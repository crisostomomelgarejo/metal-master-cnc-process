# Walkthrough: Generación del Hito A (Cotización Preliminar)

Hemos alcanzado un hito crítico en el desarrollo de la plataforma: **La generación de documentos exportables (PDF) y el motor de costos.**

## ¿Qué se implementó?

1. **Panel Administrativo Conectado:**
   - La sección `Admin` ya no es solo visual. Ahora se conecta directamente a la tabla `Configuracion_Tarifas` en SQLite.
   - Hemos precargado las tarifas de mercado de Illinois: Diseño CAD ($100), CNC Tormach ($75), Torno Manual ($60), Perforadora ($40), Cortadora Láser ($50).
   - Puedes editar estos valores en la interfaz web y hacer clic en `Save`. Los cambios persistirán incluso si apagas el sistema.

2. **Módulo de Recepción (Completado):**
   - El formulario ahora incluye todos tus requerimientos: Día de solicitud, Cantidad de piezas, Número marcado de referencia, Opciones de material y el Checklist de máquinas.
   - El ID de orden se genera automáticamente concatenando la fecha y el nombre de la pieza (Ej: `20260601-BRACKET_BASE`) para alinear perfectamente la base de datos con los nombres de archivo de Fusion 360.

3. **Motor de PDF (Hito A):**
   - Al presionar **Generate Preliminary Quote (Hito A)** en la pestaña de Recepción, la plataforma:
     - Guarda la información en la base de datos.
     - Lee los costos por hora vigentes desde el Panel Administrativo.
     - Estructura un archivo PDF dinámico en el navegador usando la librería `jspdf`.
     - Dibuja el logo de *Metal Master*, inyecta el ID secuencial inmutable.
     - Crea tablas con el desglose de Herramientas solicitadas, Estado de inventario de material y un Resumen de Costos Proyectado.
     - Finalmente, descarga el archivo automáticamente a tu computadora listo para enviarlo a Compras.

## ¿Cómo probarlo?

> [!TIP]
> **Paso 1:** Ve a la pestaña **Admin** en la web (`http://localhost:5173`) y verifica que los precios por hora estén cargados. Siéntete libre de modificar alguno y guardarlo.
> 
> **Paso 2:** Ve a la pestaña **Reception**, llena los datos de una pieza imaginaria, selecciona algunas máquinas y haz clic en **Generate Preliminary Quote (Hito A)**.
> 
> **Paso 3:** Abre el PDF descargado y comprueba el desglose.
