#!/bin/bash

# ── SpeseMese — rimozione servizio macOS ─────────────────────────────────────

PLIST_NAME="com.spesemese.backend"
PLIST_DEST="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"

if [ ! -f "$PLIST_DEST" ]; then
  echo "⚠️  Servizio non installato."
  exit 0
fi

launchctl unload "$PLIST_DEST" 2>/dev/null || true
rm "$PLIST_DEST"

echo "✅ Servizio rimosso. Il backend non si avvierà più automaticamente."
