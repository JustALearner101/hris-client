# 🚀 HRIS All-In-One

**HRIS All-In-One** adalah sistem Human Resource Information System modular yang dirancang untuk organisasi 50–5.000 karyawan. Fokus utama:
- Kepatuhan regulasi Indonesia (PPh21, BPJS, THR, lembur).
- UX cepat & modern.
- Arsitektur modular-monolith (siap microservices).
- Keamanan kuat (OWASP ASVS L2, RLS multi-tenant).
- Integrasi mudah (bank, e-sign, SSO, perangkat absensi).

---

## 📖 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Arsitektur Sistem](#-arsitektur-sistem)
3. [Stack Teknologi](#-stack-teknologi)
4. [Setup Dev Environment](#-setup-dev-environment)
5. [Struktur Monorepo](#-struktur-monorepo)
6. [Workflow Pengembangan](#-workflow-pengembangan)
7. [Modul Sistem](#-modul-sistem)
8. [Keamanan](#-keamanan)
9. [Testing & Quality Gates](#-testing--quality-gates)
10. [CI/CD Pipeline](#-cicd-pipeline)
11. [Kontribusi](#-kontribusi)
12. [Lisensi](#-lisensi)

---

## ✨ Fitur Utama
- **Core HR**: Master data karyawan, struktur organisasi, dokumen, audit trail immutable.
- **Recruitment / ATS**: Career site builder, pipeline hiring, interview scheduling (Google/MS).
- **Onboarding & Offboarding**: Checklist lintas departemen, provisioning akun (SCIM/OIDC).
- **Attendance & Scheduling**: Clock-in/out (GPS, biometrik), shift/roster, timesheet.
- **Leave & Absence**: Cuti tahunan/sakit/custom, accrual, approval multi-channel.
- **Payroll (Indonesia-first)**: PPh21, BPJS, THR, lembur, file bank BCA/Mandiri/BNI, e-Filing.
- **Benefits & Claims**: Enrollment asuransi, reimbursement dengan OCR dasar.
- **Performance & Learning**: OKR/KPI, review 360°, katalog kursus ringan.
- **Expenses & Travel**: Klaim biaya multi-currency, travel request → approval.
- **Asset Management**: Lifecycle aset (assign/return/service), QR/Barcode.
- **Analytics & Reporting**: Dashboard eksekutif, report builder, snapshot ke data warehouse.
- **Komunikasi**: Pengumuman, polling, kudos.
- **Integrasi**: Bank, e-sign, perangkat absensi, SSO (OIDC/SAML).

---

## 🏗 Arsitektur Sistem
- **Pattern**: Modular-monolith dengan DDD boundaries (Core, People, Time, Payroll, Finance, Talent, Comms, Integration).
- **Integrasi**: Event-driven (Kafka), REST API publik, Webhook.
- **Multi-tenant**: PostgreSQL RLS dengan kolom `tenant_id` & `entity_id`.
- **Observability**: OpenTelemetry tracing, Prometheus metrics, Grafana dashboards.

![Arsitektur HRIS](docs/architecture.png)

---

## 🛠 Stack Teknologi
- **Frontend Web**: Next.js 14 (App Router) + TypeScript + TanStack Query + Tailwind + shadcn/ui.
- **Mobile**: React Native (Expo).
- **Backend**: NestJS 10 + Prisma ORM.
- **Database**: PostgreSQL 16 + RLS.
- **Cache & Queue**: Redis 7, Kafka 3.7.
- **Storage**: S3/MinIO.
- **Auth**: Keycloak 24 (OIDC/SAML, MFA).
- **Infra**: Docker, Kubernetes (EKS/GKE/AKS), Terraform + Helm.
- **CI/CD**: GitHub Actions.
- **Testing**: Jest, Playwright, k6, Trivy.

---

## ⚙️ Setup Dev Environment
Prasyarat:
- Node.js 20.x (via `.nvmrc`)
- pnpm 9.x
- Docker Desktop / Compose v2
- PostgreSQL 16, Redis 7, Kafka 3.7, Keycloak 24 (via docker-compose)

### Clone & bootstrap
```bash
git clone https://github.com/JustALearner101/hris-client.git
cd hris
pnpm install
