#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to determine which docker compose command to use
get_docker_compose_cmd() {
    if command_exists docker-compose; then
        echo "docker-compose"
    elif command_exists docker && docker compose version >/dev/null 2>&1; then
        echo "docker compose"
    else
        echo ""
    fi
}

# Get the appropriate docker compose command
DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)

# Check if Docker Compose is available
if [ -z "$DOCKER_COMPOSE_CMD" ]; then
    echo "Error: Docker Compose is not installed or Docker Desktop is not running."
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    echo "or install Docker Compose separately if you're on Linux."
    exit 1
fi

case "$1" in
    start)
        $DOCKER_COMPOSE_CMD up -d
        echo "Services started"
        ;;
    stop)
        $DOCKER_COMPOSE_CMD down
        echo "Services stopped"
        ;;
    restart)
        $DOCKER_COMPOSE_CMD down
        $DOCKER_COMPOSE_CMD up -d
        echo "Services restarted"
        ;;
    logs)
        $DOCKER_COMPOSE_CMD logs -f
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs}"
        exit 1
        ;;
esac