# Frontend - Sistema de Gestión de Conferencias

Aplicación React + TypeScript + Vite para gestionar:
- Conferencistas
- Auditorios
- Reservas

## Requisitos
- Node.js 20+
- Backend activo en `http://localhost:3000`

## Variables de entorno
Crear `.env` basado en `.env.example`:

```bash
VITE_API_URL=http://localhost:3000/api
```

## Scripts
```bash
npm install
npm run dev
npm run build
npm run test
```

## Prueba rápida de 50 solicitudes
Para medir rápido cómo responde el backend desde la perspectiva del frontend:

```bash
npm run perf:quick
```

Este comando genera automáticamente el informe en:

```bash
PERF.md
```

Opciones (variables de entorno):
- `LOAD_BASE_URL` (default: `http://localhost:3000/api`)
- `LOAD_EMAIL` (default: `demo@demo.com`)
- `LOAD_CLAVE` (default: `Demo1234!`)
- `LOAD_REQUESTS` (default: `50`)
- `LOAD_ENDPOINT` (default: `/conferencistas`)

Ejemplo:
```bash
LOAD_REQUESTS=100 LOAD_ENDPOINT=/reservas npm run perf:quick
```

