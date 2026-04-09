# CLAUDE.md — example-claude-12

Contexto técnico del proyecto para Claude Code.

---

## Stack

- **Backend**: PHP 8.2 + Laravel 12
- **Frontend**: React 19 + TypeScript + Inertia.js 2
- **Estilos**: Tailwind CSS v4
- **Componentes UI**: shadcn/ui (Radix UI)
- **Iconos**: lucide-react
- **Base de datos**: SQLite (`database/database.sqlite`)
- **Rutas en JS**: Ziggy (tightenco/ziggy)
- **Build**: Vite 6

## Estructura clave

```
app/
  Http/
    Controllers/
      Auth/          # login, register, verify email, reset password, confirm password
      Settings/      # ProfileController, PasswordController
    Middleware/
      HandleInertiaRequests.php   # props globales: name, quote, auth.user
    Requests/
      Auth/LoginRequest.php
      Settings/ProfileUpdateRequest.php
  Models/User.php
  Providers/AppServiceProvider.php

routes/
  web.php            # home (welcome) + dashboard (auth middleware)
  auth.php           # rutas de autenticación
  settings.php       # rutas de settings
  console.php

database/
  database.sqlite    # archivo de base de datos
  migrations/        # users, cache, jobs
  factories/
  seeders/

resources/
  css/app.css
  views/app.blade.php   # única vista Blade (entry point Inertia)
  js/
    app.tsx              # bootstrap Inertia
    ssr.jsx
    pages/
      welcome.tsx
      dashboard.tsx
      auth/            # login, register, forgot-password, reset-password, verify-email, confirm-password
      settings/        # appearance, password, profile
    layouts/
      app-layout.tsx
      auth-layout.tsx
      app/             # app-header-layout, app-sidebar-layout
      auth/            # auth-card-layout, auth-simple-layout, auth-split-layout
      settings/layout.tsx
    components/
      ui/              # shadcn/ui: button, input, dialog, dropdown, select, sidebar, etc.
      app-*.tsx        # shell, header, sidebar, content, logo
      nav-*.tsx        # nav-main, nav-footer, nav-user
    hooks/
      use-appearance.tsx
      use-initials.tsx
      use-mobile.tsx
      use-mobile-navigation.ts
    lib/utils.ts
    types/index.ts

tests/
  Feature/
    Auth/              # AuthenticationTest, EmailVerificationTest, PasswordResetTest, etc.
    Settings/          # PasswordUpdateTest, ProfileUpdateTest
    DashboardTest.php
  Pest.php
  TestCase.php
```

## Convenciones

- PSR-12 en PHP, PascalCase en componentes React
- No hay Services layer aun — logica en controladores
- Tests con Pest (no PHPUnit puro)
- `npm run dev` levanta Vite; `composer dev` levanta todo (server + queue + vite)

## Estado inicial

Proyecto recien creado desde el starter kit oficial de Laravel con React.
Sin features de negocio aun — solo autenticacion y settings de perfil.
