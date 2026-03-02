#!/bin/bash

# ── SpeseMese — installazione servizio macOS ──────────────────────────────────

set -e

# Percorso assoluto della cartella backend (dove si trova questo script)
BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"
PLIST_NAME="com.spesemese.backend"
PLIST_DEST="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"
LOG_DIR="$BACKEND_DIR/logs"

echo "📁 Backend path: $BACKEND_DIR"

# Trova il percorso di node
NODE_PATH="$(which node)"
if [ -z "$NODE_PATH" ]; then
  echo "❌ Node.js non trovato. Installalo prima di continuare."
  exit 1
fi
echo "🟢 Node trovato: $NODE_PATH"

# Crea cartella logs
mkdir -p "$LOG_DIR"

# Genera il plist con i percorsi reali
cat > "$PLIST_DEST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PLIST_NAME</string>

    <key>ProgramArguments</key>
    <array>
        <string>$NODE_PATH</string>
        <string>$BACKEND_DIR/server.js</string>
    </array>

    <key>WorkingDirectory</key>
    <string>$BACKEND_DIR</string>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>StandardOutPath</key>
    <string>$LOG_DIR/output.log</string>

    <key>StandardErrorPath</key>
    <string>$LOG_DIR/error.log</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>NODE_ENV</key>
        <string>production</string>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
    </dict>
</dict>
</plist>
EOF

echo "📄 Plist creato in: $PLIST_DEST"

# Scarica il servizio se già caricato
launchctl unload "$PLIST_DEST" 2>/dev/null || true

# Carica il servizio
launchctl load "$PLIST_DEST"

echo ""
echo "✅ Servizio installato e avviato!"
echo "   Il backend partirà automaticamente ad ogni login."
echo ""
echo "📋 Comandi utili:"
echo "   Stato:    launchctl list | grep spesemese"
echo "   Stop:     launchctl unload ~/Library/LaunchAgents/$PLIST_NAME.plist"
echo "   Start:    launchctl load ~/Library/LaunchAgents/$PLIST_NAME.plist"
echo "   Log:      tail -f $LOG_DIR/output.log"
echo "   Errori:   tail -f $LOG_DIR/error.log"
