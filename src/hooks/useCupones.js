import React, { useCallback, useEffect, useState } from 'react';
import { cuponesService } from "../services/cuponesService";
import { useAuth } from "./useAuth";

/**
 * Custom Hook: useCupones
 * Centraliza la lógica de negocio para la gestión de cupones
 */

export const useCupones = () => {

    // ✅ Estados deben coincidir EXACTAMENTE con los valores en Firestore (minúsculas)
    const ESTADO_CUPON_DISPONIBLE = "disponible";
    const ESTADO_CUPON_CANJEADO = "canjeado";
    const ESTADO_CUPON_VENCIDO = "vencido";
    
    const { user } = useAuth();

    const [cupones, setCupones] = useState([]);
    const [cuponesDisponibles, setCuponesDisponibles] = useState([]);
    const [cuponesCanjeados, setCuponesCanjeados] = useState([]);
    const [cuponesVencidos, setCuponesVencidos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Función para traer los cupones desde Firebase
    // src/hooks/useCupones.js - Agregar al inicio de fetchCupones

const fetchCupones = useCallback(async () => {

    setCargando(true);
    setError(null);

    try {
        const data = await cuponesService.getCuponesByUser(user.uid);
        console.log('📦 Datos recibidos del servicio:', data);
        console.log('📊 Tipo de datos:', Array.isArray(data) ? 'Array' : typeof data);
        console.log('📊 Cantidad:', Array.isArray(data) ? data.length : 'No es array');
        
        const cuponesArray = Array.isArray(data) ? data : [];
        
        setCupones(cuponesArray);
        categorizarCupones(cuponesArray);
    } catch (err) {
        console.error('❌ ERROR en fetchCupones:', err);
        setError(err.message || 'Error al cargar cupones');
    } finally {
        setCargando(false);
    }
}, [user]);

    // ✅ Función para separar cupones por categoría
    const categorizarCupones = (cuponesList) => {
        // ✅ Validación: si no es array, usar array vacío
        if (!Array.isArray(cuponesList)) {
            console.warn('cuponesList no es un array:', cuponesList);
            setCuponesDisponibles([]);
            setCuponesCanjeados([]);
            setCuponesVencidos([]);
            return;
        }

        const fechaActual = new Date();

        // ✅ Lógica corregida: disponible = estado 'disponible' Y fecha límite > hoy
        const disponibles = cuponesList.filter((cupon) => {
            const fechaLimite = cupon.fechaLimiteUso?.toDate?.() || new Date(cupon.fechaLimiteUso);
            return cupon.estado === ESTADO_CUPON_DISPONIBLE && fechaLimite > fechaActual;
        });

        const canjeados = cuponesList.filter(
            (cupon) => cupon.estado === ESTADO_CUPON_CANJEADO
        );

        // ✅ Vencido = estado 'vencido' O (disponible pero fecha límite <= hoy)
        const vencidos = cuponesList.filter((cupon) => {
            const fechaLimite = cupon.fechaLimiteUso?.toDate?.() || new Date(cupon.fechaLimiteUso);
            return cupon.estado === ESTADO_CUPON_VENCIDO || 
                   (cupon.estado === ESTADO_CUPON_DISPONIBLE && fechaLimite <= fechaActual);
        });

        setCuponesDisponibles(disponibles);
        setCuponesCanjeados(canjeados);
        setCuponesVencidos(vencidos);
    };

    /**
     * Recupera un cupón específico mediante su código único
     */
    const getCuponByCodigo = async (codigoCupon) => {
        setCargando(true);
        setError(null);

        try {
            // ✅ Nombre correcto del método en el servicio
            const cupon = await cuponesService.getCuponByCodigo(codigoCupon);
            return cupon;
        } catch (err) {
            setError(err.message || 'Cupón no encontrado');
            throw err;
        } finally {
            setCargando(false);
        }
    };

    /**
     * Simula la compra de cupones
     */
    const comprarCupones = async (ofertaId, cantidad, datosPago) => {
        setCargando(true);
        setError(null);

        try {
            // ✅ Usar user.uid y validar que el servicio exista
            const cuponesComprados = await cuponesService.crearCuponesCompra({
                usuarioId: user.uid,
                ofertaId,
                cantidad,
                datosPago,
                dui: user.dui // ✅ Asegúrate que user.dui existe en tu contexto
            }); 

            await fetchCupones();
            return cuponesComprados;
        } catch (err) {
            setError(err.message || 'Error al comprar cupones');
            throw err;
        } finally {
            setCargando(false);
        }
    };

    /**
     * Genera el PDF de un cupón disponible
     */
    const generarPDF = async (cupon) => {
        setCargando(true);
        setError(null);

        try {
            // ✅ Implementación real con jsPDF o similar
            // Por ahora, retornamos el objeto del cupón para que el componente lo procese
            return cupon;
        } catch (err) {
            setError(err.message || 'Error al generar PDF');
            throw err;
        } finally {
            setCargando(false);
        }
    };

    /**
     * Canjea un cupón validando código y DUI
     */
    const canjearCupon = async (codigo, dui) => {
        setCargando(true);
        setError(null);

        try {
            const resultado = await cuponesService.canjearCupon(codigo, dui);
            if (user?.uid) {
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

    /**
     * Valida si un cupón cumple todas las reglas para ser canjeado
     */
    const validarCupon = (cupon, duiCliente) => {
        if (!cupon) {
            return {
                esValido: false,
                mensaje: 'Cupón no encontrado'
            };
        }

        const ahora = new Date();
        const fechaLimite = cupon.fechaLimiteUso?.toDate?.() || new Date(cupon.fechaLimiteUso);

        const validaciones = {
            existe: !!cupon,
            noCanjeado: cupon.estado === ESTADO_CUPON_DISPONIBLE,
            noVencido: fechaLimite > ahora,
            duiCoincide: cupon.dui === duiCliente,
        };

        const esValido = Object.values(validaciones).every(v => v === true);

        return {
            esValido,
            validaciones,
            mensaje: esValido ? 'Cupón válido' : obtenerMensajeError(validaciones)
        };
    };

    const obtenerMensajeError = (validaciones) => {
        if (!validaciones.existe) return 'Cupón no encontrado';
        if (!validaciones.noCanjeado) return 'Este cupón ya fue canjeado';
        if (!validaciones.noVencido) return 'Este cupón está vencido';
        if (!validaciones.duiCoincide) return 'El DUI no coincide con el comprador';
        return 'Cupón inválido';
    };

    // ✅ Efecto para cargar cupones al montar o cambiar usuario
    useEffect(() => {
        if (user?.uid) {
            fetchCupones();
        }
    }, [user, fetchCupones]);

    // ✅ Cálculos para estadísticas
    const estadisticas = {
        total: cupones.length,
        disponibles: cuponesDisponibles.length,
        canjeados: cuponesCanjeados.length,
        vencidos: cuponesVencidos.length,
        ahorroTotal: cuponesCanjeados.reduce(
            (sum, c) => sum + ((c.precioRegular || 0) - (c.precioOferta || 0)), 
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
    };
};