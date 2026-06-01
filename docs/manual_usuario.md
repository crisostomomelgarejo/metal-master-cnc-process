# Manual de Usuario / User Manual
**Metal Master Material - CNC Standard Platform**

*Este manual se construirá paso a paso junto con el desarrollo de la aplicación.*
*This manual will be built step-by-step alongside the application development.*

---

## 1. Introducción / Introduction
Bienvenido a la plataforma de estandarización de Metal Master Material. Esta herramienta te permitirá calcular costos de materiales, tiempos de mecanizado y generar cotizaciones precisas de manera estandarizada.

Welcome to the Metal Master Material standardization platform. This tool will allow you to calculate material costs, machining times, and generate accurate quotes in a standardized way.

## 2. Acceso y Roles (Login & Roles)

Para garantizar la seguridad y la correcta distribución del trabajo, el sistema utiliza un control de acceso basado en roles (RBAC).
*To ensure security and proper workload distribution, the system uses Role-Based Access Control (RBAC).*

### Roles Disponibles / Available Roles:
1. **Diseño (Design / Operator):**
   - Puede crear nuevas cotizaciones (Hito A y B).
   - Puede ingresar tiempos de la máquina Tormach.
   - *Can create new quotes and input Tormach machine times.*
2. **Administración (Admin):**
   - Tiene los mismos permisos que Diseño.
   - **Permiso Exclusivo:** Puede editar las tarifas diarias por hora de los 5 trenes de trabajo en el Panel Administrativo.
   - *Has Design permissions plus exclusive access to edit hourly rates for all 5 work trains in the Admin Panel.*
3. **Gerencia (Manager):**
   - Acceso de solo lectura al Dashboard para visualizar reportes y cotizaciones. No puede alterar los precios ni crear órdenes de trabajo.
   - *Read-only access to the Dashboard for viewing reports and quotes. Cannot alter prices or create work orders.*

### Cómo iniciar sesión / How to Login:
1. Abre la aplicación en tu navegador web.
2. Ingresa tu correo corporativo y contraseña.
3. El sistema te redirigirá automáticamente a tu vista correspondiente según tu rol.

> [!TIP]
> Si olvidas tu contraseña o necesitas cambiar tu rol, contacta con el departamento de TI.
> *If you forget your password or need a role change, contact the IT department.*

---

## 3. Flujo de Trabajo General / General Workflow

El proceso completo consta de 7 pasos clave:
1. **Recepción / Reception:** Evaluación inicial de la pieza.
2. **Herramientas / Tooling:** Verificación de inventario.
3. **Discretización / Discretization:** Generación de **Cotización Preliminar (Hito A)**.
4. **Diseño / Design:** Modelado en Fusion 360.
5. **Material / Material:** Selección en McMaster-Carr.
6. **Mecanizado / Machining:** Ingreso de tiempos CNC y otros trenes.
7. **Finalización / Delivery:** Generación de **Cotización Final (Hito B)** y Órdenes de Trabajo.
