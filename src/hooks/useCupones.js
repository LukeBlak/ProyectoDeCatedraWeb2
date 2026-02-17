import React, { useCallback, useEffect, useState } from 'react'
import { cuponesService } from "../services/cuponesService"
import { useAuth } from "./useAuth"

/**
 * Custom Hook: useCupones
 * Centraliza la lógica de negocio para la gestión de cupones, incluyendo
 * el ciclo de vida de los datos (CRUD), categorización y validaciones.
 */

export const useCupones = () => {

    // Estados para organizar los cupones según su situación
    const ESTADO_CUPON_DISPONIBLE = "Disponible";
    const ESTADO_CUPON_CANJEADO = "Canjeado";
    const ESTADO_CUPON_VENCIDO = "Vencido";
    
    const { user } = useAuth();

    const [cupones, setCupones] = useState([]);
    const [cuponesDisponibles, setCuponesDisponibles] = useState([]);
    const [cuponesCanjeados, setcuponesCanjeados] = useState([]);
    const [cuponesVencidos, setcuponesVencidos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

// Función para traer los cupones desde la base de datos
        const fetchCupones = useCallback(async () => {
        if (!user?.id) return; // Si no hay usuario, no hacemos nada

        setCargando(true);
        setError(null);

        try {
            const data = await cuponesService.getCuponesByUser(user.id);
            setCupones(data);
            categorizarCupones(data);
        } catch (err) {
            setError(err.message || 'Error al cargar cupones');
            console.error('Error en el fetch de cupones: ', err);
        } finally {
            setCargando(false);
        }
    }, [user]);

    // Esta función separa el montón de cupones en grupos (disponibles, usados, etc.)
    const categorizarCupones = (cuponesList) => {
        const fechaActual = new Date();

        const disponibles = cuponesList.filter(
            (cupon) => cupon.estado === ESTADO_CUPON_DISPONIBLE && new Date(cupon.FechaLimiteUso) < fechaActual
        );
        const canjeados = cuponesList.filter(
            (cupon) => cupon.estado === ESTADO_CUPON_CANJEADO
        );
        const vencidos = cuponesList.filter(
            (cupon) => cupon.estado === ESTADO_CUPON_VENCIDO && new Date(cupon.FechaLimiteUso) <= fechaActual
        );

        setCuponesDisponibles(disponibles);
        setcuponesCanjeados(canjeados);
        setcuponesVencidos(vencidos);
    }

    /**
     * Recupera un cupón específico mediante su código único.
     */
    const getCuponByCodigo = async (codigoCupon) => {
        setCargando(true);
        setError(null);

        try {
            const cupon = await cuponesService.getCuponByUser(codigoCupon);
            return cupon;
        } catch (err) {
            setError(err.message || 'Cupón no encontrado');
            throw err;
        } finally {
            setCargando(false);
        }
    };

    const comprarCupones = async (ofertaId, cantidad, datosPago) => {
        setCargando(true);
        setError(null);

        try {
            const cuponesComprados = await cuponesService.comprarCupones({
                usuarioId: user.id,
                ofertaId,
                cantidad,
                datosPago,
                dui: user.id
            }); 

            // Si la compra sale bien, refrescamos la lista para que aparezcan los nuevos
            await fetchCupones();

            return cuponesComprados;
        } catch (err) {
            setError(err.message || 'Error al comprar cupones');
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Función para obtener el archivo PDF listo para descargar o ver
    const generarPDF = async (cuponId) => {
        setCargando(true);
        setError(null);

        try {
            // Pedimos el PDF al servicio y esperamos a que se genere el archivo
            const pdfConvertido = await cuponesService.generarPDFCupon(cuponId);
            return pdfConvertido;
        } catch (err) {
            setError(err.message || 'Error al generar PDF');
            throw err;
        } finally {
            setCargando(false);
        }
    };

    const canjearCupon = async (codigo, dui) => {
        setCargando(true);
        setError(null);

        try {
            // Esperamos a que el sistema valide y marque el cupón como usado
            const resultado = await cuponesService.canjearCupon(codigo, dui);

            if (user?.id) {
                await fetchCupones();
            }
            return resultado;
        } catch (err) {
            setError(err.message || 'Error al canjear cupón');
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Revisamos si el cupón cumple todas las reglas antes de intentar usarlo
    const validarCupon = (cupon, duiCliente) => {
        const ahora = new Date();
        const fechaLimite = new Date(cupon.fechaLimiteUso);

        const validaciones = {
            existe: !!cupon,
            noCanjeado: cupon.estado === ESTADO_CUPON_DISPONIBLE,
            noVencido: fechaLimite > ahora,
            duiCoincide: cupon.dui === duiCliente,
        };

        let esValido = true;
  
        // Si alguna de las condiciones de arriba es falsa, el cupón no es válido
        if (!validaciones.existe) esValido = false;
        if (!validaciones.noCanjeado) esValido = false;
        if (!validaciones.noVencido) esValido = false;
        if (!validaciones.duiCoincide) esValido = false;

        return {
            esValido,
            validaciones,
            mensaje: !esValido ? obtenerMensajeError(validaciones) : 'Cupón válido'
        };
    };

    // Solo para dar un mensaje al usuario de lo que pasó para que diera error
    const obtenerMensajeError = (validaciones) => {
        if (!validaciones.existe) return 'Cupón no encontrado';
        if (!validaciones.noCanjeado) return 'Este cupón ya fue canjeado';
        if (!validaciones.noVencido) return 'Este cupón está vencido';
        if (!validaciones.duiCoincide) return 'El DUI no coincide con el comprador';
        return 'Cupón inválido';
    };

    // Este useEffect hace que los cupones se carguen automáticamente al entrar a la pantalla
    useEffect(() => {
        if (user?.id) {
            fetchCupones();
        }
    }, [user, fetchCupones]);

    // Cálculos rápidos para mostrar en el dashboard (totales, ahorros, etc.)
    const estadisticas = {
        total: cupones.length,
        disponibles: cuponesDisponibles.length,
        canjeados: cuponesCanjeados.length,
        vencidos: cuponesVencidos.length,
        ahorroTotal: cuponesCanjeados.reduce(
        (sum, c) => sum + (c.precioRegular - c.precioOferta), 
        0
        )
    };

    return {
        cupones,
        cuponesDisponibles,
        cuponesCanjeados,
        cuponesVencidos,
        cargando,
        error,
        estadisticas,
        fetchCupones,
        getCuponByCodigo,
        comprarCupones,
        generarPDF,
        canjearCupon,
        validarCupon,
    }
}
