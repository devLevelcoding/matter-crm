# Matter CRM (#01)

Client intake → matter tracking → retainer billing, with none of the case-management bloat a real
legal-tech tool carries. Type 2 (Hybrid), the base pattern every vertical product in this catalog is
a reskin of.

`Lead` is crm3-micro's own intake-lead concept (`F:\SassFactory\crm3-micro\prisma\schema.prisma:846`)
— a prospective client, not leadMarketing's scraped-lead. `TaskGroup`/checklist ported from
crm3-micro (`:1835`), same inline-checklist-on-creation shape Garage CRM (`#06`) established.
`Contract`/`Invoice` collapsed from crm3-micro the same way every other CRM here collapses them
(dropped tenant/company/partner/employee multi-tenant fields). `retainerAmount` on `Contract` is new
— the specific "retainer billing" the pitch names.

Shape mirrors Project CRM (`#08`)'s Client→Proposal→Contract→Phase-w/-checklist→Invoice flow closely
— `Matter` here plays the role Project CRM's `Phase` did.

## Local dev

Backend: `:3322`. Frontend: `:5196`.

```
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

```
cd frontend
npm install
npm run dev
```
