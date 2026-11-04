/**
 * taller.sh — Industrial Precision Architecture v17.0
 * Swiss Technical Grid / Sovereign Infrastructure Studio · Barcelona
 * Zero scroll hijacking. Pure native performance.
 */

const BLUEPRINTS = {
  "bare-metal-vps": {
    id: "bare-metal-vps",
    title: "15-Minute Production VPS Stack",
    formula: "Deploy a hardened Linux cloud server with Traefik v3, automated SSL, and nightly encrypted snapshots in 15 minutes—without AWS complexity or bill shock.",
    stack: "DOCKER COMPOSE / TRAEFIK V3 / SYSTEMD",
    licensePrice: "€49",
    category: "infra",
    timeSaved: "8 hrs / setup",
    upsellText: "Don't want to set this up yourself? Get it deployed on your servers in 48 hours for €450.",
    upsellTopic: "VPS Stack Turnkey Deployment (€450 / 48h)",
    files: ["compose.yaml", "backup.sh", "systemd.service", ".env.example", "README.md"],
    bundleIncludes: [
      "Production-ready compose.yaml with Traefik v3 reverse proxy & automatic Let's Encrypt TLS",
      "Nightly encrypted offsite snapshot backup shell script with retention pruning",
      "Systemd unit files for auto-restart on boot with zero zombie containers",
      "5-minute Loom video walkthrough showing DNS, firewall, and SSH hardening",
      "Production .env template with security header checklists"
    ],
    code: `services:
  traefik:
    image: traefik:v3.1
    restart: unless-stopped
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@taller.sh"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - web-gateway

networks:
  web-gateway:
    name: taller-gateway`
  },

  "clinic-booking": {
    id: "clinic-booking",
    title: "Clinic Booking & WhatsApp Reminder Engine",
    formula: "Eliminate appointment no-shows with 24h & 2h WhatsApp reminders, automated rescheduling, and real-time waitlist cascading—without Zapier fees or HIPAA/GDPR leaks.",
    stack: "N8N / POSTGRESQL / WHATSAPP API",
    licensePrice: "€49",
    category: "workflows",
    timeSaved: "14 hrs / week",
    upsellText: "Don't want to wire the APIs yourself? Get it customized and live in 72 hours for €650.",
    upsellTopic: "Clinic Reminder Engine Deployment (€650 / 72h)",
    files: ["clinic-reminder-workflow.json", "schema.sql", "config.env.example", "README.md"],
    bundleIncludes: [
      "Production n8n workflow JSON with schedule triggers and fallback error handling",
      "PostgreSQL idempotent appointment and patient waitlist schema",
      "WhatsApp Cloud API webhook handler for 1-click confirmation or reschedule replies",
      "5-minute Loom video walking through Meta developer credentials and n8n webhook keys",
      "Comprehensive README.md with copy-paste .env template"
    ],
    code: `{
  "name": "taller.sh - WhatsApp Clinic Reminder & Waitlist Cascade",
  "nodes": [
    {
      "parameters": {
        "rule": { "interval": [{ "field": "minutes", "minutesInterval": 15 }] }
      },
      "name": "Schedule Trigger (Every 15m)",
      "type": "n8n-nodes-base.scheduleTrigger"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT a.id, p.name, p.phone, a.start_time FROM appointments a JOIN patients p ON a.patient_id = p.id WHERE a.status = 'scheduled' AND a.start_time >= NOW() + INTERVAL '24 hours' AND a.start_time < NOW() + INTERVAL '24 hours 15 minutes';"
      },
      "name": "Postgres: Fetch Upcoming 24h Appointments",
      "type": "n8n-nodes-base.postgres"
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://graph.facebook.com/v19.0/{{$env.WHATSAPP_PHONE_NUMBER_ID}}/messages"
      },
      "name": "WhatsApp API: Dispatch 24h Reminder",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}`
  },

  "agent-deck": {
    id: "agent-deck",
    title: "Agent-Deck Multi-CLI Supervisor",
    formula: "Coordinate multiple background autonomous CLI agents (AGY CLI, Claude Code, custom workers) in isolated PTY terminals with SQLite token accounting—without flaky browser wrappers.",
    stack: "RUST / TOKIO / SQLITE / CROSSTERM",
    licensePrice: "€49",
    category: "workflows",
    timeSaved: "20 hrs / sprint",
    upsellText: "Need custom tool harnesses integrated? Let us build your CLI agent harness for €850.",
    upsellTopic: "Custom CLI Agent Harness Integration (€850)",
    files: ["Cargo.toml", "src/main.rs", "src/agent/pty.rs", "src/telemetry.rs", "README.md"],
    bundleIncludes: [
      "Complete Rust repository with Tokio async runtime and Crossterm terminal UI",
      "Isolated pseudoterminal (PTY) spawn controller preventing zombie child processes",
      "Local SQLite schema for token burn tracking and sub-agent task attribution",
      "5-minute Loom walkthrough showing compilation, systemd service, and CLI hook wiring",
      "Ready-to-use Cargo.toml and systemd unit service file"
    ],
    code: `// Commercial Blueprint: Agent-Deck Multi-CLI Supervisor Deck
// Full repository access granted upon license acquisition
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    enable_raw_mode()?;
    let mut stdout = std::io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // Supervise isolated PTY agent sessions and track SQLite token telemetry
    let mut deck = SupervisorDeck::init("agent_deck.sqlite")?;
    deck.attach_agent_session("production-worker")?;
    
    loop {
        terminal.draw(|f| deck.render_ui(f))?;
        if event::poll(Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                if key.code == KeyCode::Char('q') { break; }
            }
        }
    }
    disable_raw_mode()?;
    Ok(())
}`
  },

  "koi-kds": {
    id: "koi-kds",
    title: "Zero-Downtime Order Queue Display",
    formula: "Real-time kitchen & order fulfillment display with SQLite idempotency, Server-Sent Events, and customer SMS alerts—without dropped orders or proprietary tablet locks.",
    stack: "NODE.JS / SQLITE / SSE / DOCKER",
    licensePrice: "€49",
    category: "infra",
    timeSaved: "10 hrs / week",
    upsellText: "Need this deployed on in-store hardware? We provision and ship turn-key for €750.",
    upsellTopic: "KDS Hardware & Cloud Turnkey Setup (€750)",
    files: ["server.js", "database.js", "webhook.json", "compose.yaml", "README.md"],
    bundleIncludes: [
      "Zero-latency Node.js server with SQLite write-ahead logging (WAL) mode",
      "Resilient Server-Sent Events (SSE) broadcaster with auto-reconnecting browser client",
      "POS webhook ingestion parser with idempotency keys preventing double-tickets",
      "5-minute Loom walkthrough showing POS webhook testing and screen layout",
      "Docker Compose configuration with automated Nginx reverse proxy"
    ],
    code: `// Commercial Blueprint: Idempotent Webhook Engine & SSE Display
const queueLoad = db
  .prepare("SELECT COUNT(*) AS count FROM orders WHERE status IN ('pending', 'preparing')")
  .get();

const estimatedWait = Math.max(10, (queueLoad.count + 1) * 8);

const insertStmt = db.prepare(\`
  INSERT OR IGNORE INTO orders
    (order_id, customer_name, customer_phone, items_json, total_eur, estimated_wait_minutes)
  VALUES (?, ?, ?, ?, ?, ?)
\`);

const result = insertStmt.run(
  orderId,
  customerName,
  customerPhone,
  JSON.stringify(items),
  total,
  estimatedWait
);

// Stream update to all connected kitchen pads via SSE
broadcastSSE({ type: "NEW_ORDER", orderId, estimatedWait });`
  },

  "content-factory": {
    id: "content-factory",
    title: "Autonomous RSS & Content Pipeline",
    formula: "Monitor industry feeds, deduplicate articles in PostgreSQL, generate structured executive briefs, and publish—without manual research or hallucinated drafts.",
    stack: "POSTGRESQL / N8N / OPENROUTER",
    licensePrice: "€49",
    category: "workflows",
    timeSaved: "12 hrs / week",
    upsellText: "Want custom scraper feeds and private fine-tunes? Deployed for your firm in 48h for €550.",
    upsellTopic: "Custom Content Pipeline Deployment (€550 / 48h)",
    files: ["content-blueprint.json", "dedup-schema.sql", "tenant-router.js", "README.md"],
    bundleIncludes: [
      "Production n8n workflow JSON with cron polling and LLM summarization chaining",
      "PostgreSQL schema with SHA-256 URL hashing for strict deduplication",
      "OpenRouter / Anthropic JSON structured prompt template for consistent executive bullets",
      "5-minute Loom video demonstrating pipeline tuning and Telegram webhook hooks",
      "README.md with copy-paste .env template"
    ],
    code: `{
  "name": "taller.sh // URL-Deduplicated Production Pipeline",
  "nodes": [
    { "name": "Schedule Trigger (Hourly)", "type": "n8n-nodes-base.cron" },
    { "name": "RSS Feed Ingest", "type": "n8n-nodes-base.rssFeedRead" },
    { "name": "Postgres SHA256 Deduplication", "type": "n8n-nodes-base.postgres" },
    { "name": "OpenRouter LLM Structured Summary", "type": "@n8n/n8n-nodes-langchain.agent" },
    { "name": "Telegram Dispatch Alert", "type": "n8n-nodes-base.telegram" }
  ]
}`
  }
};

const ARCHITECTURE_PIPELINES = {
  clinic: {
    name: "Clinic Booking & WhatsApp Engine",
    inputTag: "INPUT CHANNELS",
    inputTitle: "Inquiries & Appointment Hooks",
    inputDesc: "WhatsApp patient chats, clinic form webhooks, cancellations & rescheduled slots arriving 24/7.",
    runtimeTag: "SOVEREIGN RUNTIME",
    runtimeTitle: "taller.sh Sovereign Engine",
    runtimeDesc: "Frankfurt bare-metal instance. AES-256 encrypted SQLite/Postgres. Zero model training retention.",
    outputTag: "EXECUTED OUTPUT",
    outputTitle: "Instant Confirmation & Sync",
    outputDesc: "Calendar updated, patient WhatsApp confirmation dispatched, and waitlist auto-cascaded in <60s.",
    telemetryLatency: "34ms",
    telemetryThroughput: "2.8k calls / day",
    telemetryError: "0.00%",
    telemetryResidency: "Hetzner Bare-Metal · Frankfurt"
  },
  invoice: {
    name: "Document & Ledger Reconciliation",
    inputTag: "INPUT CHANNELS",
    inputTitle: "Vendor Invoices & PDF Receipts",
    inputDesc: "Raw PDF attachments in shared email inbox, vendor portal webhooks, and photo delivery receipts.",
    runtimeTag: "SOVEREIGN RUNTIME",
    runtimeTitle: "taller.sh Sovereign Engine",
    runtimeDesc: "Isolated OCR & tabular extraction model running on European VPS with strict B2B NDA lock.",
    outputTag: "EXECUTED OUTPUT",
    outputTitle: "Drafted ERP Entries & Audit Log",
    outputDesc: "Reconciled against open purchase orders, discrepancies flagged, draft ledger entry pushed to ERP.",
    telemetryLatency: "112ms",
    telemetryThroughput: "640 docs / day",
    telemetryError: "0.00%",
    telemetryResidency: "OVH Cloud · Paris"
  },
  health: {
    name: "Continuous Code & System Audits",
    inputTag: "INPUT CHANNELS",
    inputTitle: "Scheduled Triggers & Git Hooks",
    inputDesc: "Hourly systemd cron triggers, git commit push webhooks, database replication heartbeat checks.",
    runtimeTag: "SOVEREIGN RUNTIME",
    runtimeTitle: "taller.sh Sovereign Engine",
    runtimeDesc: "CLI supervisor daemon (AGY CLI / static lint harnesses) running in isolated local PTY sandbox.",
    outputTag: "EXECUTED OUTPUT",
    outputTitle: "Pull Requests & Health Alerts",
    outputDesc: "Automated regression tests verified, backup verified, pull requests filed with proposed bugfixes.",
    telemetryLatency: "48ms",
    telemetryThroughput: "24 checks / day",
    telemetryError: "0.00%",
    telemetryResidency: "Bare-Metal · Barcelona"
  }
};

const IMPACT_JARS = {
  "apprentice-tools": "Apprentice Workshop Toolsets (Vocational Trades in Barcelona)",
  "market-crates": "Local Market Food Crates (Community Kitchens)",
  "land-tools": "Ecological Restoration Tools (Trail & Watershed Volunteer Teams)"
};

let currentJar = localStorage.getItem("taller_selected_jar") || "apprentice-tools";
if (!IMPACT_JARS[currentJar]) currentJar = "apprentice-tools";

let activeBlueprintId = "bare-metal-vps";

document.addEventListener("DOMContentLoaded", () => {
  initArchitectureDiagram();
  initBlueprintTabs();
  initBlueprintModal();
  initImpactSelector();
  initRoiCalculator();
  initIntakeModal();
  initMobileMenu();
  initScrollMotion();
});

/* ==========================================================================
   1. INTERACTIVE 3-STAGE ARCHITECTURE GRAPH
   ========================================================================== */
function initArchitectureDiagram() {
  const pipelineBtns = document.querySelectorAll(".pipeline-btn");
  if (!pipelineBtns.length) return;

  function setPipeline(key) {
    const data = ARCHITECTURE_PIPELINES[key];
    if (!data) return;

    pipelineBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.pipeline === key);
    });

    const elInputTag = document.getElementById("diag-input-tag");
    const elInputTitle = document.getElementById("diag-input-title");
    const elInputDesc = document.getElementById("diag-input-desc");

    const elRuntimeTag = document.getElementById("diag-runtime-tag");
    const elRuntimeTitle = document.getElementById("diag-runtime-title");
    const elRuntimeDesc = document.getElementById("diag-runtime-desc");

    const elOutputTag = document.getElementById("diag-output-tag");
    const elOutputTitle = document.getElementById("diag-output-title");
    const elOutputDesc = document.getElementById("diag-output-desc");

    const elLatency = document.getElementById("diag-telemetry-latency");
    const elThroughput = document.getElementById("diag-telemetry-throughput");
    const elError = document.getElementById("diag-telemetry-error");
    const elResidency = document.getElementById("diag-telemetry-residency");

    if (elInputTag) elInputTag.textContent = data.inputTag;
    if (elInputTitle) elInputTitle.textContent = data.inputTitle;
    if (elInputDesc) elInputDesc.textContent = data.inputDesc;

    if (elRuntimeTag) elRuntimeTag.textContent = data.runtimeTag;
    if (elRuntimeTitle) elRuntimeTitle.textContent = data.runtimeTitle;
    if (elRuntimeDesc) elRuntimeDesc.textContent = data.runtimeDesc;

    if (elOutputTag) elOutputTag.textContent = data.outputTag;
    if (elOutputTitle) elOutputTitle.textContent = data.outputTitle;
    if (elOutputDesc) elOutputDesc.textContent = data.outputDesc;

    if (elLatency) elLatency.textContent = data.telemetryLatency;
    if (elThroughput) elThroughput.textContent = data.telemetryThroughput;
    if (elError) elError.textContent = data.telemetryError;
    if (elResidency) elResidency.textContent = data.telemetryResidency;
  }

  pipelineBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      setPipeline(btn.dataset.pipeline);
    });
  });
}

/* ==========================================================================
   2. BLUEPRINT FILTER TABS
   ========================================================================== */
function initBlueprintTabs() {
  const filterTabs = document.querySelectorAll(".blueprint-tab");
  const cards = document.querySelectorAll(".blueprint-card");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      filterTabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      cards.forEach(card => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });
}

/* ==========================================================================
   3. BLUEPRINT MODAL & SPEC INSPECTOR
   ========================================================================== */
function initBlueprintModal() {
  const modal = document.getElementById("blueprint-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const buyBtn = document.getElementById("modal-buy-license-btn");
  const upsellBtn = document.getElementById("modal-deploy-upsell-btn");

  document.querySelectorAll("[data-inspect]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.inspect;
      const bp = BLUEPRINTS[id];
      if (!bp) return;

      activeBlueprintId = id;
      document.getElementById("modal-stack").textContent = `${bp.stack} · ${bp.timeSaved}`;
      document.getElementById("modal-title").textContent = bp.title;
      document.getElementById("modal-desc").textContent = bp.formula;
      document.getElementById("modal-code").textContent = bp.code;

      const fileContainer = document.getElementById("modal-file-list");
      if (fileContainer) {
        fileContainer.innerHTML = bp.files.map(f => `<span class="spec-file-tag">${f}</span>`).join("");
      }

      const bundleContainer = document.getElementById("modal-bundle-list");
      if (bundleContainer && bp.bundleIncludes) {
        bundleContainer.innerHTML = bp.bundleIncludes.map(item => `<li><span class="bundle-check">✓</span> <span>${item}</span></li>`).join("");
      }

      if (buyBtn) {
        buyBtn.textContent = `Buy Blueprint License — ${bp.licensePrice}`;
      }

      if (upsellBtn) {
        upsellBtn.textContent = `Get Deployed in 48h (€450)`;
      }

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeModal();
    }
  });

  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      const bp = BLUEPRINTS[activeBlueprintId];
      closeModal();
      if (bp) {
        openWhatsAppConsultation(`Purchase Architecture License: ${bp.title} (${bp.licensePrice})`);
      }
    });
  }

  if (upsellBtn) {
    upsellBtn.addEventListener("click", () => {
      const bp = BLUEPRINTS[activeBlueprintId];
      closeModal();
      if (bp) {
        if (window.openIntakeModal) {
          window.openIntakeModal(bp.upsellTopic || `Turnkey Deployment: ${bp.title} (€450)`);
        } else {
          openWhatsAppConsultation(`Turnkey Deployment: ${bp.title} (€450)`);
        }
      }
    });
  }
}

/* ==========================================================================
   4. IMPACT JARS SELECTOR
   ========================================================================== */
function initImpactSelector() {
  const jarCards = document.querySelectorAll(".impact-jar-card");

  function updateJarDisplay() {
    jarCards.forEach(card => {
      const isSelected = card.dataset.jar === currentJar;
      card.classList.toggle("selected", isSelected);
      const indicator = card.querySelector(".jar-indicator");
      if (indicator) {
        indicator.textContent = isSelected ? "● Selected Project" : "○ Available Project";
      }
    });
  }

  jarCards.forEach(card => {
    card.addEventListener("click", () => {
      currentJar = card.dataset.jar;
      localStorage.setItem("taller_selected_jar", currentJar);
      updateJarDisplay();
    });
  });

  updateJarDisplay();
}

/* ==========================================================================
   5. ROI / TIME RECOVERY CALCULATOR (Swiss Technical Grid)
   ========================================================================== */
function initRoiCalculator() {
  const hoursSlider = document.getElementById("roi-hours-slider");
  const rateSlider = document.getElementById("roi-rate-slider");
  const hoursVal = document.getElementById("roi-hours-val");
  const rateVal = document.getElementById("roi-rate-val");
  const currentDrag = document.getElementById("roi-current-drag");
  const netSavings = document.getElementById("roi-net-savings");
  const hoursReclaimed = document.getElementById("roi-hours-reclaimed");

  if (!hoursSlider || !rateSlider) return;

  function updateRoi() {
    const hours = parseInt(hoursSlider.value, 10);
    const rate = parseInt(rateSlider.value, 10);

    hoursVal.textContent = `${hours} hrs/week`;
    rateVal.textContent = `€${rate} / hr`;

    const monthlyHours = hours * 4.33;
    const monthlyDrag = Math.round(monthlyHours * rate);
    const sprintAmortizedCost = 280; // Estimated amortized monthly cost of custom sprint
    const monthlyNet = Math.max(0, monthlyDrag - sprintAmortizedCost);
    const annualHours = Math.round(hours * 50);

    currentDrag.textContent = `€${monthlyDrag.toLocaleString()} / mo`;
    netSavings.textContent = `€${monthlyNet.toLocaleString()} / mo`;
    hoursReclaimed.textContent = `${annualHours.toLocaleString()} hrs / yr`;
  }

  hoursSlider.addEventListener("input", updateRoi);
  rateSlider.addEventListener("input", updateRoi);
  updateRoi();
}

function openWhatsAppConsultation(topic) {
  const jarLabel = IMPACT_JARS[currentJar] || "Apprentice Workshop Toolsets";
  const text = encodeURIComponent(
    `Hello taller.sh workshop crew, I am interested in: ${topic}. My selected 10% community pledge initiative is: ${jarLabel}.`
  );
  window.open(`https://wa.me/34689788390?text=${text}`, "_blank", "noopener");
}

/* ==========================================================================
   6. RAPID INTAKE MODAL & CUSTOM SPRINT ORDER HANDLER
   ========================================================================== */
let activeIntakeTopic = "14-Day Sovereign Architecture Sprint (€2,800)";

function initIntakeModal() {
  const intakeModal = document.getElementById("intake-modal");
  const intakeCloseBtn = document.getElementById("intake-close-btn");
  const intakeBadge = document.getElementById("intake-tier-badge");
  const intakeForm = document.getElementById("agent-intake-form");
  const confirmMsg = document.getElementById("intake-confirm-msg");
  const waDirectBtn = document.getElementById("intake-wa-direct-btn");
  const chipBtns = document.querySelectorAll("#bottleneck-chips .chip-btn");

  if (!intakeModal) return;

  function openIntake(topic) {
    activeIntakeTopic = topic || "Custom Architecture Inquiry";
    if (intakeBadge) intakeBadge.textContent = activeIntakeTopic.toUpperCase();
    if (confirmMsg) confirmMsg.style.display = "none";
    intakeModal.classList.add("open");
    intakeModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const contactInput = document.getElementById("intake-contact");
    if (contactInput) contactInput.focus();
  }

  window.openIntakeModal = openIntake;

  function closeIntake() {
    intakeModal.classList.remove("open");
    intakeModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-order]").forEach(btn => {
    btn.addEventListener("click", () => {
      openIntake(btn.dataset.order);
    });
  });

  if (intakeCloseBtn) intakeCloseBtn.addEventListener("click", closeIntake);
  intakeModal.addEventListener("click", e => {
    if (e.target === intakeModal) closeIntake();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && intakeModal.classList.contains("open")) {
      closeIntake();
    }
  });

  let selectedBottleneck = "WhatsApp & Customer Triage";
  chipBtns.forEach(chip => {
    chip.addEventListener("click", () => {
      chipBtns.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selectedBottleneck = chip.dataset.val || chip.textContent;
    });
  });

  if (intakeForm) {
    intakeForm.addEventListener("submit", e => {
      e.preventDefault();
      const contactVal = document.getElementById("intake-contact").value.trim();
      const notesVal = document.getElementById("intake-notes").value.trim();

      if (!contactVal) return;

      if (confirmMsg) confirmMsg.style.display = "block";

      try {
        const payload = {
          topic: activeIntakeTopic,
          contact: contactVal,
          bottleneck: selectedBottleneck,
          notes: notesVal,
          jar: currentJar,
          timestamp: new Date().toISOString()
        };
        const existing = JSON.parse(localStorage.getItem("taller_intakes") || "[]");
        existing.push(payload);
        localStorage.setItem("taller_intakes", JSON.stringify(existing));
      } catch (err) {}

      setTimeout(() => {
        closeIntake();
        intakeForm.reset();
        chipBtns.forEach((c, idx) => c.classList.toggle("active", idx === 0));
        selectedBottleneck = "WhatsApp & Customer Triage";
      }, 2200);
    });
  }

  if (waDirectBtn) {
    waDirectBtn.addEventListener("click", () => {
      const contactVal = document.getElementById("intake-contact")?.value.trim() || "";
      const notesVal = document.getElementById("intake-notes")?.value.trim() || "";
      const jarLabel = IMPACT_JARS[currentJar] || "Apprentice Workshop Toolsets";

      let text = `Hello taller.sh crew, I want to book: ${activeIntakeTopic}. Primary operational bottleneck: ${selectedBottleneck}.`;
      if (contactVal) text += ` Contact: ${contactVal}.`;
      if (notesVal) text += ` Scope notes: ${notesVal}.`;
      text += ` Community pledge: ${jarLabel}.`;

      window.open(`https://wa.me/34689788390?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      closeIntake();
    });
  }
}

/* ==========================================================================
   7. MOBILE NAVIGATION & DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("mobile-open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggleBtn.textContent = isOpen ? "✕ Close" : "☰ Menu";
  });

  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("mobile-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.textContent = "☰ Menu";
    });
  });
}

/* ==========================================================================
   8. MOTION & SCROLL REVEALS
   ========================================================================== */
function initScrollMotion() {
  const targets = document.querySelectorAll(
    ".section-head, .blueprint-card, .sprint-card, .solution-card, .faq-card, .impact-jar-card, .roi-calculator-wrap, .offer-guarantee-wrap, .contact-block, .diagram-container"
  );
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -10px 0px" });

    targets.forEach(el => {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });
  }
}
