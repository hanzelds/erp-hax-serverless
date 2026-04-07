export const NCF_TYPES = {
  CREDIT_FISCAL: { code: '31', label: 'Crédito Fiscal' },
  CONSUMO: { code: '32', label: 'Consumo' },
  SPECIAL: { code: '33', label: 'Regímenes Especiales' },
  CREDIT_NOTE: { code: '34', label: 'Nota de Crédito' },
} as const

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  SENDING: 'Enviando',
  PROCESSING: 'Procesando',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  CANCELLED: 'Cancelada',
  PENDING: 'Pendiente',
  PARTIAL: 'Pago Parcial',
  PAID: 'Pagada',
}

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  SENDING: 'bg-blue-100 text-blue-600',
  PROCESSING: 'bg-yellow-100 text-yellow-600',
  APPROVED: 'bg-green-100 text-green-600',
  REJECTED: 'bg-red-100 text-red-600',
  CANCELLED: 'bg-gray-100 text-gray-400',
  PENDING: 'bg-orange-100 text-orange-600',
  PARTIAL: 'bg-purple-100 text-purple-600',
  PAID: 'bg-green-100 text-green-700',
}

export const EXPENSE_CATEGORIES = [
  'OPERATIVO',
  'MARKETING',
  'NOMINA',
  'ALQUILER',
  'SERVICIOS',
  'TECNOLOGIA',
  'VIAJES',
  'OTROS',
] as const

export const PAYMENT_METHODS = {
  TRANSFER: 'Transferencia',
  CASH: 'Efectivo',
  CHECK: 'Cheque',
} as const

export const ITBIS_RATE = 0.18
