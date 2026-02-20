import api from "./api"

export const getOfertas = async () => {
  const response = await api.get("/ofertas")
  return response.data
}

export const getOfertaById = async (id) => {
  const response = await api.get(`/ofertas/${id}`)
  return response.data
}

export const getOfertasByRubro = async (rubro) => {
  const response = await api.get(`/ofertas?rubro=${rubro}`)
  return response.data
}