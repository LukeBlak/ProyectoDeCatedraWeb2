import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const normalize = (value) => String(value || '').trim().toLowerCase();

const buildEmpresaKey = (record) => {
	const byId = normalize(record?.empresaId);
	if (byId) return byId;

	return normalize(
		record?.nombre ||
			record?.empresa ||
			record?.empresaNombre ||
			record?.nombreEmpresa ||
			'sin-empresa'
	);
};

export const getEmpresasYClientesDetalle = async () => {
	const [usuariosSnapshot, empresasSnapshot, ofertasSnapshot] = await Promise.all([
		getDocs(collection(db, 'usuarios')),
		getDocs(collection(db, 'empresas')),
		getDocs(collection(db, 'ofertas')),
	]);

	const usuarios = usuariosSnapshot.docs.map((docData) => ({
		id: docData.id,
		...docData.data(),
	}));

	const empresas = empresasSnapshot.docs.map((docData) => ({
		id: docData.id,
		...docData.data(),
	}));

	const ofertas = ofertasSnapshot.docs.map((docData) => ({
		id: docData.id,
		...docData.data(),
	}));

	const empresasMap = new Map();

	empresas.forEach((empresa) => {
		const key = buildEmpresaKey({ ...empresa, empresaId: empresa.id });
		empresasMap.set(key, {
			id: empresa.id,
			nombre:
				empresa.nombre || empresa.empresa || empresa.empresaNombre || 'Empresa sin nombre',
			rubro: empresa.rubro || 'No definido',
			contacto: empresa.email || empresa.contacto || 'No definido',
			telefono: empresa.telefono || 'No definido',
			ofertasTotales: 0,
			ofertasActivas: 0,
			empleados: 0,
		});
	});

	ofertas.forEach((oferta) => {
		const key = buildEmpresaKey(oferta);
		const empresaNombre =
			oferta.empresa || oferta.empresaNombre || oferta.nombreEmpresa || 'Empresa sin nombre';

		const current = empresasMap.get(key) || {
			id: oferta.empresaId || key,
			nombre: empresaNombre,
			rubro: oferta.rubro || 'No definido',
			contacto: 'No definido',
			telefono: 'No definido',
			ofertasTotales: 0,
			ofertasActivas: 0,
			empleados: 0,
		};

		current.ofertasTotales += 1;
		if (oferta.disponible) {
			current.ofertasActivas += 1;
		}

		empresasMap.set(key, current);
	});

	const clientes = usuarios
		.filter((usuario) => usuario.rol === 'cliente')
		.map((cliente) => ({
			id: cliente.id,
			nombre: `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || 'Cliente',
			email: cliente.email || 'Sin correo',
			telefono: cliente.telefono || 'No definido',
			dui: cliente.dui || 'No definido',
			estado: cliente.activo === false ? 'inactivo' : 'activo',
			fechaRegistro: cliente.fechaRegistro || null,
		}));

	usuarios
		.filter((usuario) => usuario.rol === 'empleado')
		.forEach((empleado) => {
			const key = buildEmpresaKey(empleado);
			const empresa = empresasMap.get(key);
			if (empresa) {
				empresa.empleados += 1;
			}
		});

	const empresasDetalle = Array.from(empresasMap.values()).sort((a, b) =>
		a.nombre.localeCompare(b.nombre)
	);

	return {
		empresasDetalle,
		clientesDetalle: clientes,
		resumen: {
			totalEmpresas: empresasDetalle.length,
			totalClientes: clientes.length,
			totalEmpleados: usuarios.filter((usuario) => usuario.rol === 'empleado').length,
			totalOfertas: ofertas.length,
			ofertasActivas: ofertas.filter((oferta) => oferta.disponible).length,
		},
	};
};
