export interface Lead {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  status: string
}

export interface Client {
  id: number
  name: string
  email?: string | null
  phone?: string | null
}

export interface Matter {
  id: number
  clientId: number
  client?: Client
  title: string
  type?: string | null
  status: string
}

export interface Contract {
  id: number
  matterId: number
  matter?: Matter
  title: string
  retainerAmount: string
  status: string
}

export interface Invoice {
  id: number
  matterId: number
  matter?: Matter
  number: string
  amount: string
  tax: string
  total: string
  dueDate: string
  status: string
}

export interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'number' | 'date'
  required?: boolean
  placeholder?: string
}

export interface ColumnDef<T> {
  key: string
  label: string
  render?: (row: T) => string
}
