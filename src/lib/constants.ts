export const METODOS_PAGO: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

export const VALID_METODOS = Object.keys(METODOS_PAGO);

export const ESTADOS_PEDIDO: Record<string, string> = {
  COTIZADO: "Cotizado",
  CONFIRMADO: "Confirmado",
  EN_PRODUCCION: "En producción",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const VALID_ESTADOS = Object.keys(ESTADOS_PEDIDO);

export const ESTADO_COLORS: Record<string, string> = {
  COTIZADO: "bg-zinc-100 text-zinc-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  EN_PRODUCCION: "bg-amber-100 text-amber-700",
  LISTO: "bg-emerald-100 text-emerald-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};
