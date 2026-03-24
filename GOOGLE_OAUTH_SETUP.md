# Google Calendar & Gmail Integration Guide

To enable the Calendar and Gmail features in your dashboard, you need to set up a Google Cloud Project and obtain an OAuth 2.0 Client ID. Follow these steps:

## 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown in the top left and select **"New Project"**.
3. Name it (e.g., "Command Center Dashboard") and click **Create**.

## 2. Enable APIs
1. In the sidebar, go to **APIs & Services > Library**.
2. Search for and **Enable** the following:
   - **Google Calendar API**
   - **Gmail API**

## 3. Configure OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Select **External** (unless you have a Google Workspace org, then use Internal).
3. Fill in the required app information (App name, support email, developer contact).
4. **Scopes**: Add the following scopes:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/gmail.readonly`
5. **Test Users**: Add your own Gmail address as a test user (required while the app is in "Testing" mode).

## 4. Create Credentials (Client ID)
1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials > OAuth client ID**.
3. Select **Web application** as the Application type.
4. **Authorized JavaScript origins**:
   - `http://localhost:5173`
5. **Authorized redirect URIs**:
   - `http://localhost:5173`
6. Click **Create**. You will receive your **Client ID**.

## 5. Update Your .env File
Copy the Client ID and paste it into your `.env` file at the root of the project:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

## 6. Restart the Dashboard
Restart your development server:
```bash
npm run dev
```

---
*Note: Once you have configured the Client ID, the "Connect" buttons in the Settings or Overview tab will become active.*
