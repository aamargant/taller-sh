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
  initContactActions();
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
        openWhatsAppConsultation(`Deploy ${bp.title} on Taller Managed Cloud (€149/mo)`);
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
   5. CONTACT & WHATSAPP INTEGRATION
   ========================================================================== */
function initContactActions() {
  document.querySelectorAll("[data-order]").forEach(btn => {
    btn.addEventListener("click", () => {
      const orderName = btn.dataset.order;
      openWhatsAppConsultation(orderName);
    });
  });
}

function openWhatsAppConsultation(topic) {
  const jarLabel = IMPACT_JARS[currentJar] || "Apprentice Workshop Toolsets";
  const text = encodeURIComponent(
    `Hello taller.sh team, I am interested in: ${topic}. My selected 10% community pledge initiative is: ${jarLabel}.`
  );
  window.open(`https://wa.me/34689788390?text=${text}`, "_blank", "noopener");
}
