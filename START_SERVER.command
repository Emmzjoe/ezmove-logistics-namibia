#!/bin/bash
# Simple server startup script for macOS

cd "$(dirname "$0")"

echo "========================================="
echo "  EZMove E-Hailing Logistics App"
echo "========================================="
echo ""
echo "Starting server on port 8000..."
echo "The app will open automatically in your browser."
echo ""
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Try different server options
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000 &
    SERVER_PID=$!
    sleep 2
    open http://localhost:8000
    wait $SERVER_PID
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000 &
    SERVER_PID=$!
    sleep 2
    open http://localhost:8000
    wait $SERVER_PID
elif command -v php &> /dev/null; then
    php -S localhost:8000 &
    SERVER_PID=$!
    sleep 2
    open http://localhost:8000
    wait $SERVER_PID
else
    echo "ERROR: No web server available!"
    echo ""
    echo "Please install Python 3 by running:"
    echo "  brew install python3"
    echo ""
    echo "Or manually open index.html in your browser after starting a server."
    read -p "Press Enter to exit..."
fi
