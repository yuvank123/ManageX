# 🔥 Firebase Setup Guide

## Domain Authorization Issue

If you're getting the error:
```
Firebase: Error (auth/unauthorized-domain)
```

This means your deployed domain is not authorized in Firebase for OAuth operations.

## How to Fix

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Select your project: `payrollmanagement-8c05c`

### 2. Add Authorized Domain
- Click "Authentication" in left sidebar
- Click "Settings" tab
- Click "Authorized domains" tab
- Click "Add domain"
- Add your Vercel domain: `crm-l5lm-git-main-ankit-mishras-projects-f28e663c.vercel.app`
- Click "Add"

### 3. Verify Environment Variables
Make sure these are set in Vercel:
```
VITE_apiKey=AIzaSyAehw9HN29hOGbeW5wOQkv2YPr9nAGXI5M
VITE_authDomain=payrollmanagement-8c05c.firebaseapp.com
VITE_projectId=payrollmanagement-8c05c
VITE_storageBucket=payrollmanagement-8c05c.firebasestorage.app
VITE_messagingSenderId=28811841387
VITE_appId=1:28811841387:web:3067cfd2c58f5cf207062e
```

### 4. Redeploy
After adding the domain, redeploy your client on Vercel.

## Current Firebase Config
- Project ID: `payrollmanagement-8c05c`
- Auth Domain: `payrollmanagement-8c05c.firebaseapp.com`
- API Key: `AIzaSyAehw9HN29hOGbeW5wOQkv2YPr9nAGXI5M`

## Test URL
You can test Firebase auth at: `/firebase-test` route in your app. 