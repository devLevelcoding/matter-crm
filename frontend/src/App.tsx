import { useState } from 'react'
import Sidebar, { type NavItem } from './components/Sidebar'
import ResourceView from './components/ResourceView'
import type { Client, Contract, Invoice, Lead, Matter } from './types'

const NAV: NavItem[] = [
  { key: 'leads', label: 'Leads' },
  { key: 'clients', label: 'Clients' },
  { key: 'matters', label: 'Matters' },
  { key: 'contracts', label: 'Contracts' },
  { key: 'invoices', label: 'Invoices' },
]

export default function App() {
  const [active, setActive] = useState('leads')

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans text-[13px]">
      <header className="flex items-center gap-3 h-[46px] px-5 border-b border-border bg-surface flex-shrink-0">
        <span className="text-[15px] font-extrabold tracking-tight text-accent">
          matter<span className="text-txt2 font-normal">crm</span>
        </span>
        <div className="flex-1" />
        <span className="text-xs text-txt2">Type 2 &middot; Hybrid</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={NAV} selected={active} onSelect={setActive} />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {active === 'leads' && (
            <ResourceView<Lead>
              resource="leads"
              title="Leads"
              quickAction={{ label: 'Convert to Client', action: 'convert', showIf: r => r.status !== 'converted' }}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'status', label: 'Status' },
              ]}
              formFields={[
                { key: 'name', label: 'Name', required: true },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'notes', label: 'Notes' },
              ]}
            />
          )}

          {active === 'clients' && (
            <ResourceView<Client>
              resource="clients"
              title="Clients"
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
              ]}
              formFields={[
                { key: 'name', label: 'Name', required: true },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'notes', label: 'Notes' },
              ]}
            />
          )}

          {active === 'matters' && (
            <ResourceView<Matter>
              resource="matters"
              title="Matters"
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'client', label: 'Client', render: r => r.client?.name ?? '—' },
                { key: 'type', label: 'Type' },
                { key: 'status', label: 'Status' },
              ]}
              formFields={[
                { key: 'clientId', label: 'Client ID', required: true, type: 'number' },
                { key: 'title', label: 'Title', required: true },
                { key: 'type', label: 'Type', placeholder: 'litigation, contract review...' },
                { key: 'status', label: 'Status (open/closed)' },
                { key: 'notes', label: 'Notes' },
              ]}
            />
          )}

          {active === 'contracts' && (
            <ResourceView<Contract>
              resource="contracts"
              title="Contracts"
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'matter', label: 'Matter', render: r => r.matter?.title ?? '—' },
                { key: 'retainerAmount', label: 'Retainer' },
                { key: 'status', label: 'Status' },
              ]}
              formFields={[
                { key: 'matterId', label: 'Matter ID', required: true, type: 'number' },
                { key: 'title', label: 'Title', required: true },
                { key: 'retainerAmount', label: 'Retainer amount', type: 'number' },
              ]}
            />
          )}

          {active === 'invoices' && (
            <ResourceView<Invoice>
              resource="invoices"
              title="Invoices"
              columns={[
                { key: 'number', label: 'Number' },
                { key: 'matter', label: 'Matter', render: r => r.matter?.title ?? '—' },
                { key: 'total', label: 'Total' },
                { key: 'dueDate', label: 'Due', render: r => new Date(r.dueDate).toLocaleDateString() },
                { key: 'status', label: 'Status' },
              ]}
              formFields={[
                { key: 'matterId', label: 'Matter ID', required: true, type: 'number' },
                { key: 'amount', label: 'Amount', required: true, type: 'number' },
                { key: 'tax', label: 'Tax', type: 'number' },
                { key: 'dueDate', label: 'Due date', required: true, type: 'date' },
                { key: 'status', label: 'Status (unpaid/paid)' },
              ]}
            />
          )}
        </main>
      </div>
    </div>
  )
}
