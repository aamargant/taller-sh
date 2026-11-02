# TALLER.SH // Dossier Estratégico y Modelo de Agencia

> **Nombre:** taller.sh  
> **Engineering Studio:** taller.sh (Edge DevOps & Systems Architecture)  
> **Sede:** Granollers / Barcelona (Vallès Oriental)  
> **Lema:** *«El taller de software para la economía real. Reparamos cuellos de botella operativos con micro-aplicaciones y automatizaciones a medida.»*

---

## 1. Tesis Central del Negocio

El valor comercial de esta agencia no reside en la complejidad técnica abstracta ni en vender "transformación digital" o "IA", sino en **eliminar cuellos de botella operativos cuantificables** en empresas que aún gestionan sus procesos críticos mediante WhatsApp, papel arrugado o tablas de Excel:

1. **Vender retorno económico, nunca código:** El cliente no compra n8n ni PostgreSQL; compra recuperar 300 € al mes en citas vacías o cerrar una reforma de 4.000 € antes de que el cliente firme con la competencia.
2. **Hiperfoco geográfico y sectorial:** Dominar Granollers, el Vallès Oriental y Barcelona antes de dispersar el esfuerzo.
3. **Precios cerrados y predecibles:** Presupuesto fijo de implantación (900–1.500 €) + cuota mensual recurrente de mantenimiento y servidor (49–89 €/mes).
4. **Validación rápida mediante el "Piloto para Prueba":** El primer cliente sirve para generar capturas reales, métricas de asistencia y testimonios en vídeo que desbloquean la venta mecánica a las siguientes 10 empresas.

---

## 2. Las 4 Reparaciones de Catálogo (Servicios Clave)

### Reparación #01: Recuperador de Citas & WhatsApp 24/7
* **Público:** Fisioterapeutas, osteópatas, podólogos, clínicas dentales, psicólogos y centros de estética.
* **Problema:** No-shows (pacientes que no acuden) e interrupciones constantes durante las sesiones para coger llamadas.
* **Solución:**
  * Recordatorio automático interactivo 24h antes por WhatsApp Cloud API (`[Confirmar]` / `[Cancelar]`).
  * Sincronización en tiempo real con Google Calendar / Cal.com y PostgreSQL.
  * Cascada dinámica de Lista de Espera: si un paciente cancela, el hueco se ofrece automáticamente al siguiente paciente en lista con ventana de 20 minutos.
* **Modelo Económico:**
  * **Setup:** 900 € (o 450 € condición piloto).
  * **MRR:** 49 €/mes (Starter) o 89 €/mes (Pro con cascada y reseñas).
  * **ROI Cliente:** Con evitar 1 no-show a la semana (45 €), la herramienta se amortiza sola.

### Reparación #02: Presupuestador Instantáneo en WhatsApp
* **Público:** Reformistas, instaladores de climatización/aerotermia, fontanería, electricidad y carpintería de aluminio.
* **Problema:** Tardar entre 5 y 10 días en entregar presupuestos por estar todo el día en faena, perdiendo clientes frente a competidores más rápidos.
* **Solución:** Micro-formulario en el móvil o flujo WhatsApp que calcula partidas (m², materiales, mano de obra) y genera un PDF oficial con logo y firma digital antes de subir a la furgoneta.
* **Modelo Económico:**
  * **Setup:** 1.400 €.
  * **MRR:** 39 €/mes.
  * **ROI Cliente:** Amortizado al cerrar la primera obra que antes se enfriaba.

### Reparación #03: Partes de Trabajo & Albaranes Digitales
* **Público:** Empresas de mantenimiento industrial (polígonos de Granollers/Vallès), climatización, limpieza técnica.
* **Problema:** Albaranes en papel perdidos, fotos borrosas por WhatsApp y horas perdidas los viernes cuadrando facturación.
* **Solución:** Micro-app PWA offline-first: el técnico pulsa 3 botones, registra material y horas, el cliente firma en pantalla y se envía a facturación/ERP.
* **Modelo Económico:**
  * **Setup:** 1.200 €.
  * **MRR:** 49 €/mes.

### Reparación #04: Blindaje Edge & Anti-Cheat para Campañas Web
* **Público:** Agencias de diseño/publicidad (ej. achos! agency), festivales (Brunch Electronik) y marcas de consumo.
* **Problema:** Minijuegos 3D, sorteos y activaciones web hackeadas con scripts cURL o manipulación en consola DevTools.
* **Solución:** Arquitectura Edge serverless en Cloudflare / Netlify: tokens HMAC temporizados por checkpoints físicos, Cloudflare Turnstile invisible y validación replay headless en < 5ms.
* **Modelo Económico:** 1.500 € por campaña o retainer técnico mensual.

---

## 3. Arquitectura Técnica & Stack

| Capa | Herramienta | Función |
| :--- | :--- | :--- |
| **Frontend / Web** | Vanilla HTML5 + CSS Tokens + JS | Landing de alta conversión, banco de diagnóstico y simulador interactivo sin dependencias. |
| **Automatización** | n8n (Self-hosted en Docker) | Orquestador de webhooks, crons cada 15 min y lógica de lista de espera. |
| **Base de Datos** | PostgreSQL | Almacén de pacientes, citas, estados ('scheduled', 'confirmed', 'cancelled') y colas. |
| **Mensajería** | Meta WhatsApp Cloud API / Baileys | Envío de plantillas interactivas aprobadas con botones rápidos. |
| **Edge / Infraestructura** | Traefik + Docker + Cloudflare | Enrutado reverse proxy, certificados SSL automáticos y CDN de baja latencia. |

---

## 4. Proyección de Ingresos (Objetivo a 6 Meses)

* **Meta de Clientes:** 15 clínicas / pymes locales + 2 activaciones de agencias por trimestre.
* **Ingresos de Implantación:** 15 × 1.200 € = 18.000 €
* **Ingresos Recurrentes (MRR):** 15 × 65 €/mes = **975 €/mes de ingresos pasivos recurrentes**.
* **Activaciones Edge:** 2 × 1.500 € = 3.000 €/trimestre.
