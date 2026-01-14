# --------------------------------------------
# Dockerfile untuk HRIS Frontend (Next.js)
# Seluruh komentar ditulis dalam Bahasa Indonesia
# --------------------------------------------

# Catatan:
# - Menggunakan Node.js 22 LTS (Debian slim) untuk kestabilan dan kompatibilitas Next.js 15 + React 19.
# - Menggunakan pnpm sebagai package manager sesuai permintaan.
# - Multi-stage build: deps -> builder -> prod-deps -> runner
# - Menyediakan target tambahan "dev" untuk mode development (hot reload).
# - ENV default non-rahasia disetel di image; rahasia HARUS disuntik dari secrets manager / env terpisah.

# ===== Base stage: siapkan Node + pnpm =====
FROM node:22-slim AS base

# Direktori kerja dalam container
WORKDIR /app

# Matikan telemetry Next.js agar build lebih bersih (opsional)
ENV NEXT_TELEMETRY_DISABLED=1

# Aktifkan Corepack dan siapkan pnpm
# (Catatan: versi pnpm bisa dipatok bila diperlukan, mis. pnpm@9)
RUN corepack enable \
    && corepack prepare pnpm@9 --activate

# ===== Deps stage: instal semua dependensi (termasuk dev) =====
FROM base AS deps

# Pada tahap ini butuh dev deps untuk proses build
ENV NODE_ENV=development

# Salin manifest untuk optimasi layer cache
COPY pnpm-lock.yaml package.json ./

# Instal dependensi menggunakan lockfile (tanpa modifikasi)
RUN pnpm install --frozen-lockfile

# ===== Builder stage: build Next.js untuk produksi =====
FROM deps AS builder

# Salin seluruh source code
COPY . .

# Build aplikasi (Next.js 15 dengan Turbopack sesuai script di package.json)
ENV NODE_ENV=production
RUN pnpm run build

# ===== Prod-deps stage: instal hanya dependensi produksi =====
FROM base AS prod-deps

# Salin manifest
COPY pnpm-lock.yaml package.json ./

# Instal hanya dependency produksi (lebih kecil dan aman)
RUN pnpm install --frozen-lockfile --prod

# ===== Runner stage: image final produksi =====
FROM node:22-slim AS runner
WORKDIR /app

# ENV default non-rahasia (bisa dioverride via docker run atau docker-compose)
# Perhatian: JANGAN menaruh rahasia (DATABASE_URL, KEYCLOAK_SECRET, dsb.) di image
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_API_BASE_URL=https://api.hris.local/api/v1 \
    NEXTAUTH_URL=http://localhost:3000

# Salin node_modules produksi dan store pnpm agar symlink bekerja
# Catatan: pnpm menggunakan content-addressable store di /root/.local/share/pnpm
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /root/.local/share/pnpm /root/.local/share/pnpm

# Salin artefak build dan file yang dibutuhkan saat runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Menjalankan sebagai user non-root (keamanan lebih baik)
USER node

# Port default Next.js
EXPOSE 3000

# Jalankan Next.js server untuk produksi
# (Memanggil CLI Next.js langsung via node agar tidak tergantung shell)
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]

# ===== Dev stage (opsional): untuk pengembangan dengan hot reload =====
# Penggunaan: docker build --target dev -t hris-client:dev .
#            docker run -p 3000:3000 -v %cd%:/app hris-client:dev (Windows PowerShell)
FROM deps AS dev
ENV NODE_ENV=development \
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1 \
    NEXTAUTH_URL=http://localhost:3000

# Salin source code (untuk container dev tanpa volume; jika pakai volume, akan dioverride)
COPY . .

# Ekspose port dev server
EXPOSE 3000

# Jalankan Next.js dev server (Turbopack sudah diaktifkan oleh script)
CMD ["pnpm", "dev"]

# --------------------------------------------
## Tag the image
#docker tag hris-client:latest tar01/hris-client:latest
#
## Push the image
#docker push tar01/hris-client:latest