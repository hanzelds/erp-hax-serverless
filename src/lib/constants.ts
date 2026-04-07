export const COMPANY = {
  name: "HAX ESTUDIO CREATIVO EIRL",
  rnc: "133290251",
  email: "info@hax.com.do",
  phone: "8297743955",
  domain: "erp.hax.com.do",
} as const;

export const BUSINESS_UNITS = {
  HAX: "Hax Estudio",
  KODER: "Koder",
} as const;

export const TAX_RATE = 0.18; // ITBIS 18%

export const NCF_TYPES = {
  CREDIT_FISCAL: { label: "Crédito Fiscal", code: "31" },
  CONSUMO: { label: "Consumo", code: "32" },
  CREDIT_NOTE: { label: "Nota de Crédito", code: "34" },
  SPECIAL: { label: "Régimen Especial", code: "33" },
} as const;

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  SENDING: "Enviando",
  PROCESSING: "Procesando",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
  PENDING: "Pendiente de pago",
  PARTIAL: "Pago parcial",
  PAID: "Pagada",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  TRANSFER: "Transferencia",
  CASH: "Efectivo",
  CHECK: "Cheque",
};

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  OPERATIVO: "Operativo",
  MARKETING: "Marketing",
  NOMINA: "Nómina",
  ALQUILER: "Alquiler",
  SERVICIOS: "Servicios",
  TECNOLOGIA: "Tecnología",
  VIAJES: "Viajes",
  OTROS: "Otros",
};

export const LEAD_STAGE_LABELS: Record<string, string> = {
  LEAD: "Lead",
  CONTACT: "Contacto",
  PROPOSAL: "Propuesta",
  CLOSED_WON: "Ganado",
  CLOSED_LOST: "Perdido",
};
