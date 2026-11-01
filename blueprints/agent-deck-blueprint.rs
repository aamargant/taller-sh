// =============================================================================
// taller.sh — Open Production Blueprint #01: Agent-Deck TUI Supervisor
// Stack: Rust 2021 · tokio · ratatui · crossterm · portable-pty · rusqlite
// License: MIT / Open Proof of Iron — Need a custom Rust engine? https://taller.sh
// =============================================================================
//
// Cargo.toml dependencies:
// [dependencies]
// anyhow = "1.0"
// crossterm = "0.28"
// portable-pty = "0.8"
// ratatui = "0.29"
// rusqlite = { version = "0.32", features = ["bundled"] }
// serde = { version = "1.0", features = ["derive"] }
// serde_json = "1.0"
// tokio = { version = "1.42", features = ["full"] }

use anyhow::Result;
use crossterm::{
    event::{self, Event, KeyCode, KeyEventKind},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    widgets::{Block, Borders, List, ListItem, Paragraph},
    Terminal,
};
use rusqlite::{params, Connection};
use std::{io, time::Duration};

pub struct AgentSession {
    pub name: String,
    pub command: String,
    pub tokens_used: u64,
    pub cost_usd: f64,
    pub active: bool,
}

pub struct SupervisorDeck {
    pub db: Connection,
    pub sessions: Vec<AgentSession>,
    pub selected: usize,
}

impl SupervisorDeck {
    pub fn init(db_path: &str) -> Result<Self> {
        let db = Connection::open(db_path)?;
        db.execute_batch(
            "CREATE TABLE IF NOT EXISTS agent_telemetry (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_name TEXT NOT NULL,
                tokens_delta INTEGER NOT NULL,
                cost_usd REAL NOT NULL,
                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
        )?;

        Ok(Self {
            db,
            sessions: vec![
                AgentSession {
                    name: "worker-01-pty".into(),
                    command: "claude --dangerously-skip-permissions".into(),
                    tokens_used: 42_810,
                    cost_usd: 0.19,
                    active: true,
                },
                AgentSession {
                    name: "worker-02-pty".into(),
                    command: "aider --architect".into(),
                    tokens_used: 18_450,
                    cost_usd: 0.08,
                    active: true,
                },
            ],
            selected: 0,
        })
    }

    pub fn record_burn(&self, session: &str, tokens: u64, cost: f64) -> Result<()> {
        self.db.execute(
            "INSERT INTO agent_telemetry (session_name, tokens_delta, cost_usd) VALUES (?1, ?2, ?3)",
            params![session, tokens as i64, cost],
        )?;
        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let mut deck = SupervisorDeck::init("agent_deck.sqlite")?;

    loop {
        terminal.draw(|f| {
            let chunks = Layout::default()
                .direction(Direction::Horizontal)
                .constraints([Constraint::Percentage(38), Constraint::Percentage(62)])
                .split(f.area());

            let items: Vec<ListItem> = deck
                .sessions
                .iter()
                .enumerate()
                .map(|(idx, s)| {
                    let prefix = if idx == deck.selected { "> " } else { "  " };
                    let status = if s.active { "LIVE" } else { "IDLE" };
                    ListItem::new(format!("{}{} [{}]", prefix, s.name, status))
                })
                .collect();

            let list = List::new(items)
                .block(Block::default().title(" taller.sh // PTY Sessions ").borders(Borders::ALL))
                .style(Style::default().fg(Color::White));
            f.render_widget(list, chunks[0]);

            let current = &deck.sessions[deck.selected];
            let inspector = Paragraph::new(format!(
                "Command: {}\nTokens Burned: {}\nEstimated Cost: ${:.2}\n\n[j/k] Select  [q] Quit",
                current.command, current.tokens_used, current.cost_usd
            ))
            .block(
                Block::default()
                    .title(" Telemetry & Shell Inspector ")
                    .borders(Borders::ALL)
                    .border_style(Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD)),
            );
            f.render_widget(inspector, chunks[1]);
        })?;

        if event::poll(Duration::from_millis(120))? {
            if let Event::Key(key) = event::read()? {
                if key.kind == KeyEventKind::Press {
                    match key.code {
                        KeyCode::Char('q') => break,
                        KeyCode::Char('j') | KeyCode::Down => {
                            deck.selected = (deck.selected + 1) % deck.sessions.len();
                        }
                        KeyCode::Char('k') | KeyCode::Up => {
                            deck.selected = deck.selected.checked_sub(1).unwrap_or(deck.sessions.len() - 1);
                        }
                        _ => {}
                    }
                }
            }
        }
    }

    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    Ok(())
}
