# 🚀 CRM Application Deployment Guide

This guide will help you deploy your CRM application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **MongoDB Atlas**: Database should be set up and accessible
4. **Firebase Project**: For authentication
5. **Stripe Account**: For payments (if using payment features)

## 🏗️ Project Structure

```
CRM_PROJECT-main/
├── crm-client/          # React Frontend
├── crm-server/          # Node.js Backend
└── DEPLOYMENT_GUIDE.md  # This file
```

## 📦 Step 1: Prepare Your Code

### 1.1 Update Environment Variables

**For Client (`crm-client/`):**
Create a `.env` file:
```env
VITE_API_URL=https://your-backend.vercel.app
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
```

**For Server (`crm-server/`):**
Create a `.env` file:
```env
PORT=3000
NODE_ENV=production
DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password
JWT_Secret=your_jwt_secret_key
PAYMENT_KEY=your_stripe_secret_key
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

### 1.2 Update CORS Configuration

The server is already configured to allow Vercel domains. Update the `allowedDomains` array in `crm-server/index.js` with your actual frontend domain.

## 🚀 Step 2: Deploy Backend (Server)

### 2.1 Deploy to Vercel

1. **Go to Vercel Dashboard**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Node.js
   - **Root Directory**: `crm-server`
   - **Build Command**: Leave empty (not needed for Node.js)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 2.2 Set Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

```env
PORT=3000
NODE_ENV=production
DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password
JWT_Secret=your_jwt_secret_key
PAYMENT_KEY=your_stripe_secret_key
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

### 2.3 Deploy

Click "Deploy" and wait for the deployment to complete. Note the deployment URL (e.g., `https://your-backend.vercel.app`).

## 🌐 Step 3: Deploy Frontend (Client)

### 3.1 Update API URL

Update the `VITE_API_URL` in your client's `.env` file to point to your deployed backend:

```env
VITE_API_URL=https://your-backend.vercel.app
```

### 3.2 Deploy to Vercel

1. **Go to Vercel Dashboard**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `crm-client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.3 Set Environment Variables in Vercel

Add these environment variables:

```env
VITE_API_URL=https://your-backend.vercel.app
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
```

### 3.4 Deploy

Click "Deploy" and wait for the deployment to complete.

## 🔧 Step 4: Configure Custom Domains (Optional)

### 4.1 Add Custom Domain

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 4.2 Update CORS

Update the `allowedDomains` array in your backend with your custom domain.

## 🧪 Step 5: Testing

### 5.1 Test Backend

Visit your backend URL + `/health` to ensure it's running:
```
https://your-backend.vercel.app/health
```

### 5.2 Test Frontend

Visit your frontend URL and test:
- Login functionality
- API calls
- Authentication
- All features

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your backend CORS configuration includes your frontend domain
   - Check that `credentials: true` is set

2. **Environment Variables**
   - Verify all environment variables are set in Vercel
   - Check that variable names match exactly

3. **Build Errors**
   - Check the build logs in Vercel
   - Ensure all dependencies are in `package.json`

4. **Database Connection**
   - Verify MongoDB Atlas network access allows Vercel IPs
   - Check database credentials

### Debugging

1. **Check Vercel Logs**
   - Go to your project → Functions → View Function Logs

2. **Test API Endpoints**
   - Use tools like Postman to test your backend endpoints

3. **Browser Console**
   - Check for JavaScript errors in the browser console

## 📱 Mobile Considerations

- Ensure your app is responsive
- Test on different screen sizes
- Consider PWA features for mobile users

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to Git
   - Use Vercel's environment variable system

2. **CORS**
   - Only allow necessary domains
   - Use HTTPS in production

3. **Authentication**
   - Ensure JWT tokens are secure
   - Use proper session management

## 📈 Monitoring

1. **Vercel Analytics**
   - Enable Vercel Analytics for performance monitoring

2. **Error Tracking**
   - Consider adding error tracking services like Sentry

3. **Performance**
   - Monitor API response times
   - Optimize database queries

## 🎉 Success!

Your CRM application is now deployed and ready to use!

### Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Database connection working
- [ ] Authentication working
- [ ] All features tested
- [ ] Custom domain configured (if desired)

## 📞 Support

If you encounter issues:
1. Check Vercel documentation
2. Review this guide
3. Check your application logs
4. Test locally first

---

**Happy Deploying! 🚀** 