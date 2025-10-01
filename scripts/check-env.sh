#!/bin/bash

# Tonal Focus - Environment Variables Setup Script
# This script helps you set up the required environment variables for production

echo "======================================"
echo "Tonal Focus - Environment Setup Helper"
echo "======================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local from .env.example${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

echo ""
echo "Checking required environment variables..."
echo ""

# Function to check if a variable is set in .env.local
check_env_var() {
    local var_name=$1
    local description=$2
    local is_required=$3
    
    if grep -q "^${var_name}=" .env.local 2>/dev/null && ! grep -q "^${var_name}=\"your-" .env.local 2>/dev/null && ! grep -q "^${var_name}=$" .env.local 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $var_name - $description"
    else
        if [ "$is_required" = "required" ]; then
            echo -e "${RED}✗${NC} $var_name - $description ${RED}(REQUIRED)${NC}"
        else
            echo -e "${YELLOW}⚠${NC} $var_name - $description (optional)"
        fi
    fi
}

# Check Supabase variables (REQUIRED)
echo "Database (Supabase) - REQUIRED:"
check_env_var "NEXT_PUBLIC_SUPABASE_URL" "Supabase project URL" "required"
check_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Public anonymous key" "required"
check_env_var "SUPABASE_SERVICE_ROLE_KEY" "Service role key for server-side" "required"

echo ""
echo "Admin Authentication - REQUIRED:"
check_env_var "ADMIN_USERNAME" "Admin username" "required"
check_env_var "ADMIN_PASSWORD_HASH" "BCrypt hash for admin login" "required"

echo ""
echo "Revalidation - REQUIRED for production:"
check_env_var "REVALIDATE_SECRET" "Secret for ISR revalidation endpoint" "required"

echo ""
echo "Site Configuration - OPTIONAL:"
check_env_var "NEXT_PUBLIC_SITE_URL" "Base URL for site" "optional"
check_env_var "REVALIDATE_ENDPOINT" "Custom revalidation endpoint URL" "optional"

echo ""
echo "Contact Information - OPTIONAL:"
check_env_var "NEXT_PUBLIC_CONTACT_EMAIL" "Public contact email" "optional"
check_env_var "NEXT_PUBLIC_CONTACT_PHONE" "Public contact phone" "optional"
check_env_var "CONTACT_EMAIL" "Backend recipient email" "optional"

echo ""
echo "Email Service (Resend) - OPTIONAL:"
check_env_var "RESEND_API_KEY" "Resend API key for contact form" "optional"

echo ""
echo "Database Migrations - OPTIONAL:"
check_env_var "DATABASE_URL" "Direct PostgreSQL connection" "optional"

echo ""
echo "Analytics - OPTIONAL:"
check_env_var "NEXT_PUBLIC_GA_ID" "Google Analytics ID" "optional"

echo ""
echo "======================================"
echo ""

# Provide instructions for Vercel
echo "To add these to Vercel:"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your 'tonalfocus-new' project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add each variable listed above"
echo ""

# Ask if user wants to generate admin password hash
echo -e "${YELLOW}Do you need to generate an admin password hash? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "Enter your desired admin password:"
    read -s admin_password
    echo ""
    echo "Generating hash..."
    
    # Check if bcryptjs is installed
    if ! npm list bcryptjs >/dev/null 2>&1; then
        echo "Installing bcryptjs..."
        npm install bcryptjs
    fi
    
    # Generate the hash
    hash=$(node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('$admin_password', 10));")
    
    echo ""
    echo -e "${GREEN}Generated hash:${NC}"
    echo "$hash"
    echo ""
    echo "Add this to your .env.local file as:"
    echo "ADMIN_PASSWORD_HASH=$hash"
fi

echo ""
echo "======================================"
echo -e "${GREEN}Setup check complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Fill in any missing required variables in .env.local"
echo "2. Add the same variables to Vercel's environment settings"
echo "3. Deploy with: npm run build && ./deploy-to-vercel.sh"
