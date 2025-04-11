# LeetCode Tracker Backend

This is the backend part of the LeetCode Tracker application.

## Setup

1. Install dependencies: `npm install`
2. Start development server: `npm start`

## Environment Variables

Create a `.env` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
LEETCODE_KEY_ENCRYPTION_SECRET=your_encryption_secret
FRONTEND_URL=http://localhost:5173
```

For production, set FRONTEND_URL to your deployed frontend URL.