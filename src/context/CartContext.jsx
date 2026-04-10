import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [carrito, setCarrito] = useState(() => {
    try {
      const item = window.localStorage.getItem('cuponera_cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Error leyendo del localStorage", error);
      return [];
    }
  });

  // Efecto para sincronizar con Firebase cuando el usuario loguea
  useEffect(() => {
    const fetchCartFromFirebase = async () => {
      const currentUserId = user?.uid || user?.id;
      if (currentUserId) {
        try {
          const cartRef = doc(db, 'carritos', currentUserId);
          const cartSnap = await getDoc(cartRef);
          
          if (cartSnap.exists()) {
             setCarrito(cartSnap.data().items || []);
          } else {
             if (carrito.length > 0) {
               await setDoc(cartRef, { items: carrito });
             } else {
               await setDoc(cartRef, { items: [] });
             }
          }
        } catch (error) {
          console.error("Error cargando carrito desde firebase:", error);
        }
      } else {
        // Fallback fallback para usuarios anonimos
        try {
          const item = window.localStorage.getItem('cuponera_cart');
          if (item) setCarrito(JSON.parse(item));
        } catch(e) {}
      }
    };

    fetchCartFromFirebase();
  }, [user]);

  // Efecto para guardar en localStorage Y en firestore ante cada cambio
  useEffect(() => {
    try {
      window.localStorage.setItem('cuponera_cart', JSON.stringify(carrito));
      
      const currentUserId = user?.uid || user?.id;
      // Sincronizar con Firebase si el usuario está logueado
      if (currentUserId) {
        const syncCartToFirebase = async () => {
          try {
            const cartRef = doc(db, 'carritos', currentUserId);
            await setDoc(cartRef, { items: carrito }, { merge: true });
          } catch(e) {
            console.error("Error sincronizando carrito a firebase:", e);
          }
        };
        syncCartToFirebase();
      }
    } catch (error) {
      console.error("Error guardando carrito", error);
    }
  }, [carrito, user]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.id === producto.id);
      
      if (itemIndex >= 0) {
        // El producto ya existe, actualizamos la cantidad
        const newCart = [...prevCart];
        newCart[itemIndex].cantidad += producto.cantidad || 1;
        return newCart;
      } else {
        // Es un producto nuevo
        return [...prevCart, { ...producto, cantidad: producto.cantidad || 1 }];
      }
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad < 1) return; // No permitir cantidad menor a 1 desde aquí (usar eliminar para quitar)
    
    setCarrito((prevCart) => 
      prevCart.map((item) => 
        item.id === id ? { ...item, cantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const calcularTotales = () => {
    return carrito.reduce(
      (totales, item) => {
        const subtotalRegular = item.precioRegular * item.cantidad;
        const subtotalOferta = item.precioOferta * item.cantidad;
        
        return {
          subtotal: totales.subtotal + subtotalRegular,
          total: totales.total + subtotalOferta,
          ahorro: totales.ahorro + (subtotalRegular - subtotalOferta),
          cantidadObjeto: totales.cantidadObjeto + item.cantidad
        };
      },
      { subtotal: 0, total: 0, ahorro: 0, cantidadObjeto: 0 }
    );
  };

  return (
    <CartContext.Provider 
      value={{ 
        carrito, 
        agregarAlCarrito, 
        eliminarDelCarrito, 
        actualizarCantidad, 
        vaciarCarrito, 
        calcularTotales 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
