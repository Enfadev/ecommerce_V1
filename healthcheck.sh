#!/bin/sh
# Health check script for Docker container

set -e

# Check if the app is responding
curl -f http://localhost:3000/api/health || exit 1
