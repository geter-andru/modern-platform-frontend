#!/bin/bash

# H&S Platform - Server Cleanup Protocol (Shell Version)
# Ensures all background processes and servers are killed completely

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
PORTS=(3000 3001 3002 3003 3004 5000 5000 8000 8080 9000)
PROCESSES=("node" "npm" "yarn" "pnpm" "next" "nodemon")

echo -e "${BOLD}🧹 H&S Platform - Server Cleanup Protocol${NC}"
echo -e "${BOLD}==========================================${NC}"

# Function to log with colors
log() {
    echo -e "${2:-$NC}$1${NC}"
}

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        log "🔍 Found processes on port $port: $pids" "$YELLOW"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        log "✅ Killed processes on port $port" "$GREEN"
    else
        log "✅ Port $port is free" "$GREEN"
    fi
}

# Function to kill processes by name
kill_process() {
    local process_name=$1
    local pids=$(pgrep -f "$process_name" 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        log "🔍 Found $process_name processes: $pids" "$YELLOW"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        log "✅ Killed $process_name processes" "$GREEN"
    else
        log "✅ No $process_name processes found" "$GREEN"
    fi
}

# Function to clean up temporary files
cleanup_files() {
    local project_root=$(dirname "$(dirname "$(realpath "$0")")")
    
    log "🗑️  Cleaning up temporary files..." "$BLUE"
    
    # Remove build directories
    rm -rf "$project_root/frontend/.next" 2>/dev/null || true
    rm -rf "$project_root/frontend/out" 2>/dev/null || true
    rm -rf "$project_root/backend/build" 2>/dev/null || true
    rm -rf "$project_root/backend/dist" 2>/dev/null || true
    
    # Remove log files
    find "$project_root" -name "*.log" -type f -delete 2>/dev/null || true
    find "$project_root" -name "*.pid" -type f -delete 2>/dev/null || true
    
    # Remove environment files (keep .env.example)
    rm -f "$project_root/frontend/.env.local" 2>/dev/null || true
    rm -f "$project_root/backend/.env" 2>/dev/null || true
    
    log "✅ Temporary files cleaned up" "$GREEN"
}

# Function to show system status
show_status() {
    log "\n📊 System Status After Cleanup:" "$BOLD"
    
    # Check ports
    log "\n🔌 Port Status:" "$BLUE"
    for port in "${PORTS[@]}"; do
        if lsof -ti:$port >/dev/null 2>&1; then
            log "  Port $port: OCCUPIED" "$RED"
        else
            log "  Port $port: FREE" "$GREEN"
        fi
    done
    
    # Check processes
    log "\n⚙️  Process Status:" "$BLUE"
    for process in "${PROCESSES[@]}"; do
        local count=$(pgrep -f "$process" 2>/dev/null | wc -l)
        if [ "$count" -gt 0 ]; then
            log "  $process: $count running" "$YELLOW"
        else
            log "  $process: none running" "$GREEN"
        fi
    done
}

# Main cleanup process
main() {
    # Step 1: Kill processes on specific ports
    log "\n🔌 Step 1: Cleaning up ports..." "$BLUE"
    for port in "${PORTS[@]}"; do
        kill_port "$port"
    done
    
    # Step 2: Kill processes by name
    log "\n⚙️  Step 2: Cleaning up processes..." "$BLUE"
    for process in "${PROCESSES[@]}"; do
        kill_process "$process"
    done
    
    # Step 3: Clean up temporary files
    log "\n🗑️  Step 3: Cleaning up temporary files..." "$BLUE"
    cleanup_files
    
    # Step 4: Show final status
    show_status
    
    log "\n✅ Cleanup complete! System is ready for deployment." "$GREEN"
    log "💡 You can now safely start new servers." "$CYAN"
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        log "H&S Platform - Server Cleanup Protocol" "$BOLD"
        log "Usage: $0 [options]" "$CYAN"
        log "Options:" "$BLUE"
        log "  --help, -h     Show this help message" "$NC"
        log "  --status       Show system status only" "$NC"
        log "  --ports        Clean ports only" "$NC"
        log "  --processes    Clean processes only" "$NC"
        log "  --files        Clean files only" "$NC"
        exit 0
        ;;
    --status)
        show_status
        exit 0
        ;;
    --ports)
        log "🔌 Cleaning up ports only..." "$BLUE"
        for port in "${PORTS[@]}"; do
            kill_port "$port"
        done
        exit 0
        ;;
    --processes)
        log "⚙️  Cleaning up processes only..." "$BLUE"
        for process in "${PROCESSES[@]}"; do
            kill_process "$process"
        done
        exit 0
        ;;
    --files)
        log "🗑️  Cleaning up files only..." "$BLUE"
        cleanup_files
        exit 0
        ;;
    *)
        main
        ;;
esac




