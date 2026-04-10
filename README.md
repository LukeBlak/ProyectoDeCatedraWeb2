# Proyecto de Catedra Web 2

Aplicacion web de cupones con React + Vite + Firebase (Firestore + Hosting).

## Funcionalidades implementadas para la rubrica

- Pantalla admin con detalle consolidado de empresas y clientes.
- Gestion de ofertas para admin de empresa (crear, editar, eliminar, listar).
- Hosting funcional en Firebase con configuracion SPA.
- Refactor de buenas practicas: componente reutilizable de metricas y validaciones de negocio centralizadas para ofertas.

## Estructura de base de datos (Firestore)

### Coleccion: usuarios

Cada documento representa una persona del sistema.

Campos recomendados:

- nombres: string
- apellidos: string
- email: string (minuscula, unica)
- password: string (actualmente base64 en este proyecto academico)
- telefono: string
- direccion: string
- dui: string (formato 12345678-9, unico)
- rol: string (admin | admin_empresa | empleado | cliente)
- activo: boolean
- empresaId: string | null (requerido para admin_empresa y empleado)
- empresaNombre: string | null
- fechaRegistro: timestamp
- ultimoAcceso: timestamp

### Coleccion: empresas

Cada documento representa una empresa afiliada.

Campos recomendados:

- nombre: string
- rubro: string
- email: string
- telefono: string
- contacto: string
- estado: string (activa | inactiva)
- fechaRegistro: timestamp

### Coleccion: ofertas

Cada documento representa una oferta publicada por una empresa.

Campos requeridos:

- titulo: string
- descripcion: string
- rubro: string
- precioOriginal: number
- precioDescuento: number
- descuento: number
- imagen: string
- disponible: boolean
- fechaExpiracion: timestamp
- empresaId: string
- empresaNombre: string
- creadoPor: string
- fechaInicio: timestamp
- fechaCreacion: timestamp
- fechaActualizacion: timestamp

### Coleccion: cupones

Cada documento representa un cupon comprado por un cliente.

Campos recomendados:

- usuarioId: string
- ofertaId: string
- empresaId: string
- codigo: string (unico)
- dui: string
- estado: string (disponible | canjeado | vencido)
- fechaCompra: timestamp
- fechaCreacion: timestamp
- fechaLimiteUso: timestamp
- fechaCanje: timestamp | null

## Reglas e indices de Firestore

- Reglas: firestore.rules
- Indices: firestore.indexes.json

Los indices incluidos cubren las consultas actuales:

- ofertas por rubro + disponible + fechaExpiracion
- ofertas por empresaId + fechaExpiracion

Nota: este proyecto usa autenticacion personalizada en frontend. Para una entrega profesional, se recomienda migrar a Firebase Authentication y luego endurecer reglas por rol.

## Levantar el proyecto en local

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

3. Ejecutar desarrollo:

```bash
npm run dev
```

## Despliegue a Firebase Hosting

1. Construir el proyecto:

```bash
npm run build
```

2. Iniciar sesion en Firebase CLI (una sola vez):

```bash
firebase login
```

3. Vincular proyecto (si aun no existe .firebaserc):

```bash
firebase use --add
```

4. Publicar hosting y Firestore:

```bash
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

## Checklist para tu entrega

- Crear al menos 1 usuario admin.
- Crear empresas con su empresaId real (id del documento en empresas).
- Crear usuarios admin_empresa o empleado con empresaId y empresaNombre.
- Probar que cada admin_empresa solo ve y gestiona ofertas de su empresa.
- Validar que admin global ve resumen y detalle completo de empresas/clientes.
- Confirmar URL de hosting en Firebase funcionando.
