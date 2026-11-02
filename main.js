/**
 * taller.sh — Studio Application Script v14.0
 * Custom AI Agents & Managed Business Intelligence · Barcelona
 * Zero scroll hijacking. Pure native performance.
 */

const BLUEPRINTS = {
  "agent-deck": {
    id: "agent-deck",
    title: "Agent-Deck & Multi-CLI Supervisor",
    stack: "RUST / CLI HARNESS / SQLITE",
    licensePrice: "€49",
    desc: "Production supervisor built in Rust to coordinate autonomous CLI agents (AGY CLI, Claude Code, and background workers) in isolated PTY shells while recording token burn to a local SQLite database. Includes full Rust source repository, systemd unit definitions, and setup guide.",
    files: ["Cargo.toml", "src/main.rs", "src/app.rs", "src/agent/pty.rs", "src/telemetry.rs"],
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
    title: "Kitchen & Order Queue Display",
    stack: "NODE.JS / SQLITE / SSE",
    licensePrice: "€49",
    desc: "High-volume order queue display built for retail counters and kitchen desks that cannot afford dropped tickets. Catches POS webhooks with SQLite INSERT OR IGNORE idempotency, streams cards live via Server-Sent Events, and alerts customers on WhatsApp. Includes full Node.js code and Docker Compose stack.",
    files: ["server.js", "database.js", "webhook.json", "compose.yaml"],
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
    title: "Autonomous Content Pipeline",
    stack: "POSTGRESQL / N8N / OPENROUTER",
    licensePrice: "€49",
    desc: "Production pipeline that monitors industry RSS feeds, deduplicates incoming links in PostgreSQL using unique URL hashes, triggers structured language model generation, and logs outputs to Telegram. Includes production n8n JSON schema, PostgreSQL migration files, and custom prompt templates.",
    files: ["content-blueprint.json", "dedup-schema.sql", "tenant-router.js"],
    code: `{
  "name": "taller.sh // URL-Deduplicated Production Pipeline",
  "nodes": [
    { "name": "Schedule Trigger", "type": "n8n-nodes-base.cron" },
    { "name": "Postgres Deduplication", "type": "n8n-nodes-base.postgres" },
    { "name": "OpenRouter LLM Agent", "type": "@n8n/n8n-nodes-langchain.agent" },
    { "name": "Telegram Dispatch Alert", "type": "n8n-nodes-base.telegram" }
  ]
}`
  },
  "vps-stack": {
    id: "vps-stack",
    title: "Hardened Linux Cloud Engine",
    stack: "DOCKER / TRAEFIK / SYSTEMD",
    licensePrice: "€49",
    desc: "Production €6/month Linux daily-driver: Traefik v3 reverse proxy with automated Let's Encrypt TLS certificates, isolated container bridges, strict HSTS security headers, and nightly encrypted backup snapshots. Includes compose configuration, backup cron scripts, and hardening checklist.",
    files: ["compose.yaml", "backup.sh", "systemd.service"],
    code: `services:
  traefik:
    image: traefik:v3.1
    restart: unless-stopped
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"`
  }
};

const IMPACT_JARS = {
  "apprentice-tools": "Apprentice Workshop Toolsets (Vocational Trades in Barcelona)",
  "market-crates": "Local Market Food Crates (Community Kitchens)",
  "land-tools": "Ecological Restoration Tools (Trail & Watershed Volunteer Teams)"
};

let currentJar = localStorage.getItem("taller_selected_jar") || "apprentice-tools";
if (!IMPACT_JARS[currentJar]) currentJar = "apprentice-tools";

let activeBlueprintId = null;

document.addEventListener("DOMContentLoaded", () => {
  initConsoleTabs();
  initBlueprintTabs();
  initBlueprintModal();
  initImpactSelector();
  initRoiCalculator();
  initIntakeModal();
  initScrollMotion();
});

/* ==========================================================================
   1. SOVEREIGNTY CONSOLE INTERACTION
   ========================================================================== */
function initConsoleTabs() {
  const tabs = document.querySelectorAll(".console-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".console-panel").forEach(panel => {
        panel.classList.toggle("active", panel.id === `tab-${target}`);
      });
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
   3. BLUEPRINT MODAL INSPECTOR
   ========================================================================== */
function initBlueprintModal() {
  const modal = document.getElementById("blueprint-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const buyBtn = document.getElementById("modal-buy-license-btn");
  const deployCloudBtn = document.getElementById("modal-deploy-cloud-btn");

  document.querySelectorAll("[data-inspect]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.inspect;
      const bp = BLUEPRINTS[id];
      if (!bp) return;

      activeBlueprintId = id;
      document.getElementById("modal-stack").textContent = `${bp.stack} · LICENSE: ${bp.licensePrice}`;
      document.getElementById("modal-title").textContent = bp.title;
      document.getElementById("modal-desc").textContent = bp.desc;
      document.getElementById("modal-code").textContent = bp.code;

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
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      const bp = BLUEPRINTS[activeBlueprintId];
      closeModal();
      if (bp) {
        openWhatsAppConsultation(`Purchase Architecture License for ${bp.title} (${bp.licensePrice})`);
      }
    });
  }

  if (deployCloudBtn) {
    deployCloudBtn.addEventListener("click", () => {
      const bp = BLUEPRINTS[activeBlueprintId];
      closeModal();
      if (bp) {
        if (window.openIntakeModal) {
          window.openIntakeModal(`Deploy ${bp.title} on Taller Managed Cloud (€149/mo)`);
        } else {
          openWhatsAppConsultation(`Deploy ${bp.title} on Taller Managed Cloud (€149/mo)`);
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
        indicator.textContent = isSelected ? "Selected Project" : "Available Project";
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
   5. ROI / TIME RECOVERY CALCULATOR (Sales Enablement)
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
    const tallerCost = 349;
    const monthlyNet = Math.max(0, monthlyDrag - tallerCost);
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
    `Hello taller.sh team, I am interested in: ${topic}. My selected 10% community pledge initiative is: ${jarLabel}.`
  );
  window.open(`https://wa.me/34689788390?text=${text}`, "_blank", "noopener");
}

/* ==========================================================================
   6. RAPID INTAKE MODAL & CONTACT (CRO Friction Reducer)
   ========================================================================== */
let activeIntakeTopic = "Pro Cloud Fleet Plan (€349/mo)";

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
    activeIntakeTopic = topic || "Custom Agent Deployment";
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

  // Bind all buttons with data-order to open the intake modal
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

  // Chip selection
  let selectedBottleneck = "WhatsApp & Lead Triage";
  chipBtns.forEach(chip => {
    chip.addEventListener("click", () => {
      chipBtns.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selectedBottleneck = chip.dataset.val || chip.textContent;
    });
  });

  // Form submission
  if (intakeForm) {
    intakeForm.addEventListener("submit", e => {
      e.preventDefault();
      const contactVal = document.getElementById("intake-contact").value.trim();
      const notesVal = document.getElementById("intake-notes").value.trim();

      if (!contactVal) return;

      if (confirmMsg) {
        confirmMsg.style.display = "block";
      }

      // Track conversion attempt locally
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
        selectedBottleneck = "WhatsApp & Lead Triage";
      }, 2200);
    });
  }

  // Direct WhatsApp from modal
  if (waDirectBtn) {
    waDirectBtn.addEventListener("click", () => {
      const contactVal = document.getElementById("intake-contact")?.value.trim() || "";
      const notesVal = document.getElementById("intake-notes")?.value.trim() || "";
      const jarLabel = IMPACT_JARS[currentJar] || "Apprentice Workshop Toolsets";

      let text = `Hello taller.sh team, I am interested in: ${activeIntakeTopic}. Primary bottleneck: ${selectedBottleneck}.`;
      if (contactVal) text += ` My contact: ${contactVal}.`;
      if (notesVal) text += ` Notes: ${notesVal}.`;
      text += ` Community pledge: ${jarLabel}.`;

      window.open(`https://wa.me/34689788390?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      closeIntake();
    });
  }
}

/* ==========================================================================
   7. MOTION LAYER (Scroll Reveals)
   ========================================================================== */
function initScrollMotion() {
  const targets = document.querySelectorAll(
    ".section-head, .solution-card, .service-card, .blueprint-card, .faq-card, .impact-jar-card, .datacenter-photo-wrap, .pledge-photo-wrap, .studio-photo-card, .studio-media-wrap, .roi-calculator-wrap, .offer-guarantee-wrap, .contact-block"
  );
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          try {
            entry.target.animate([{ transform: "translateY(10px)" }, { transform: "translateY(0)" }], { duration: 380, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
          } catch (err) {}
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
