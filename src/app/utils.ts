// Funciones para formatear fecha y monto
export function formatearFecha(fechaParam: string) {
  const [anio, mes, dia] = fechaParam.split('-');
  const fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia)); // Restamos 1 al mes porque es basado en cero

  const diaFormateado = fecha.getDate().toString().padStart(2, '0');
  const mesFormateado = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Sumamos uno al mes
  const anioFormateado = fecha.getFullYear();

  return `${diaFormateado}/${mesFormateado}/${anioFormateado}`;
}

export function formatearMonto(monto: number) {
  return monto.toLocaleString('es-ES'); // Utiliza la configuración regional para separar los miles
}
