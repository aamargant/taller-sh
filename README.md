# taller.sh 🛠️⚡
**El taller de software para la economía real.**

> *"Donde se reparan cuellos de botella operativos con micro-aplicaciones y tuberías automatizadas a medida."*

---

## 📂 Estructura del Proyecto

* **`index.html`**: Landing page de alta conversión diseñada bajo el arquetipo **Industrial / Utilitarian** con banco de pruebas y simulador interactivo.
* **`style.css`**: Sistema de diseño con tokens CSS, rejilla blueprint, acentos naranja seguridad (`#FF5500`) y responsividad total.
* **`main.js`**:
  * **Calculadora de Diagnóstico ROI**: Cálculo en vivo de dinero perdido por sector (clínicas, reformas, mantenimiento).
  * **Simulador de WhatsApp**: Emulador interactivo con botones `[Confirmar]` / `[Cancelar]`, telemetría de backend en tiempo real y disparo de lista de espera.
* **`OUTREACH_PLAYBOOK.md`**: Guiones directos de prospección a pie de calle, llamadas y WhatsApp en catalán/castellano para conseguir los primeros 3 clientes.
* **`PROPOSAL_TEMPLATE.md`**: Contrato/acuerdo de 1 página listo para firmar con garantía de amortización en 30 días.
* **`n8n-workflow-clinic.json`**: Flujo completo listo para importar en n8n (Cron 24h + Webhooks + WhatsApp Cloud API + PostgreSQL).
* **`netlify.toml`**: Configuración de despliegue con cabeceras de seguridad HTTP.

---

## 🚀 Cómo Probar en Local

Puedes abrir directamente el archivo `index.html` en cualquier navegador, o lanzar un servidor ligero:

```bash
cd /Users/arnauamargant/Repositories/taller-sh
npx serve .
# o con python:
python3 -m http.server 8080
```

Visita `http://localhost:8080` en tu navegador.

---

## 🌐 Cómo Conectar con tu Dominio `taller.sh`

1. **En Netlify:**
   * Importa este repositorio o arrastra la carpeta `taller-sh` en [app.netlify.com/drop](https://app.netlify.com/drop).
   * En *Domain Management*, añade tu dominio comprado `taller.sh`.
   * En tu registrador de `.sh`, añade los registros DNS (CNAME o Nameservers de Netlify).

2. **En Cloudflare Pages:**
   * Conecta tu repositorio de GitHub y selecciona la carpeta raíz.
   * Apunta el dominio `taller.sh` con el proxy de Cloudflare activo.
