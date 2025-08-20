#!/bin/bash

# DNS Propagation Check Script
# Monitors when domains are pointing to correct IP

set -e

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

TARGET_IP="$HETZNER_IP"
DOMAINS=("cradlesystems.xyz" "mezzpro.xyz" "minqro.xyz")

echo "🔍 Checking DNS propagation for domains..."
echo "🎯 Target IP: $TARGET_IP"
echo ""

ALL_READY=true

for domain in "${DOMAINS[@]}"; do
    echo -n "📡 Checking $domain... "
    
    # Get the IP address the domain resolves to
    RESOLVED_IP=$(nslookup "$domain" | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
    
    if [ "$RESOLVED_IP" = "$TARGET_IP" ]; then
        echo "✅ Ready ($RESOLVED_IP)"
    else
        echo "⏳ Still propagating (currently: $RESOLVED_IP)"
        ALL_READY=false
    fi
done

echo ""

if [ "$ALL_READY" = true ]; then
    echo "🎉 All domains are ready for SSL setup!"
    echo "🔒 You can now run: ./scripts/hetzner/setup-ssl.sh"
    echo ""
    echo "🌐 Test your domains:"
    for domain in "${DOMAINS[@]}"; do
        echo "   http://$domain:3000"
    done
else
    echo "⏱️  DNS propagation in progress..."
    echo "💡 Tip: DNS changes can take 5-60 minutes to propagate globally"
    echo "🔄 Run this script again in a few minutes"
fi

echo ""
echo "📱 Current application status:"
echo "   Direct IP: http://$TARGET_IP:3000 (working now)"
echo "   Password: vsc123"