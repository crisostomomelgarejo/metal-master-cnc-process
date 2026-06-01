# Plan de Acción Autónomo V2: Integración de StitchMCP y GitHub

Has solicitado un cambio arquitectónico importante: migrar las interfaces hacia diseños profesionales generados por **Stitch**. Dado el impacto de esto en la plataforma actual, he estructurado este plan para tu revisión antes de tu salida.

## User Review Required
> [!IMPORTANT]
> **Integración con Stitch:** Utilizaré la herramienta Stitch (IA) para regenerar y embellecer los módulos:
> 1. Admin Panel
> 2. Módulo de McMaster (Paso 5)
> 3. Módulo de Tiempos Fusion (Paso 6)
> 
> Stitch creará los diseños, los cuales exportaré y conectaré manualmente al backend que ya tenemos funcionando en `http://localhost:3001`. ¿Estás de acuerdo con sobreescribir la UI actual del panel administrativo con la nueva versión de Stitch?

## Proposed Changes

---
### 1. Inicialización del Entorno Stitch
- **`create_project`**: Crear un proyecto en la nube de Stitch llamado `Metal Master UI`.
- **`generate_screen_from_text`**: Crear las pantallas con un prompt que enfatice una "interfaz industrial moderna, profesional, con paleta de colores metálica oscura, para maquinaria CNC".

### 2. Implementación de los Paneles
- **Admin Panel Reparado:** Reemplazaré `src/components/AdminPanel.jsx` con el código generado por Stitch, asegurándome de reescribir la lógica de guardado (`PUT /api/tarifas`).
- **Nuevos Paneles:** Crearé los componentes para McMaster y Fusion 360 e inyectaré su lógica.

### 3. Git y GitHub (Respaldando el Contexto)
- Ejecutaré la configuración de tu repositorio en la carpeta actual `C:\Users\melga\.gemini\antigravity\scratch\cnc-standard-app`.
- **Comandos:**
  ```bash
  git init
  git add .
  git commit -m "feat: Integración de Stitch y Backend"
  gh repo create metal-master-cnc --public --source=. --remote=origin --push
  ```

## Verification Plan
### Automated Tests
- Verificar la correcta compilación de los módulos de Stitch en Vite.
- Comprobar el status del repositorio con `git status`.

## ⚙️ Aprobación e Inicio Autónomo
Para que pueda trabajar en esto mientras almuerzas:
1. Aprueba este plan diciendo **"Aprobado, ejecuta el /goal"**.
2. Cuando el sistema te pida autorización para los comandos `git` y `gh`, dale "Allow always" para que yo no me interrumpa.
