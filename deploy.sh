#!/bin/bash

echo "🚀 CRM Application Deployment Script"
echo "====================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git and push to GitHub first."
    exit 1
fi

echo "✅ Git repository found"

# Check if .env files exist
if [ ! -f "crm-client/.env" ]; then
    echo "⚠️  crm-client/.env not found. Creating from example..."
    cp crm-client/env.example crm-client/.env
    echo "📝 Please update crm-client/.env with your API URL"
fi

if [ ! -f "crm-server/.env" ]; then
    echo "⚠️  crm-server/.env not found. Creating from example..."
    cp crm-server/env.example crm-server/.env
    echo "📝 Please update crm-server/.env with your credentials"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo "1. ✅ Git repository ready"
echo "2. ✅ Environment files created"
echo ""
echo "📝 Next Steps:"
echo "=============="
echo "1. Update environment variables in .env files"
echo "2. Push your code to GitHub"
echo "3. Deploy backend to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'crm-server'"
echo "   - Add environment variables"
echo "4. Deploy frontend to Vercel:"
echo "   - Create another project"
echo "   - Set root directory to 'crm-client'"
echo "   - Add VITE_API_URL environment variable"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Ready to deploy!" 