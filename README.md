# Chat-Application
Chat Application for multiple users to communicate with each other concurrently.

## Project Structure:

- `/frontend`: React App (Vite)
- `/backend`: Node, Express server

## Setup

### Frontend

```bash
cd frontend
npm i
npm run dev
```

### Backend

```bash
cd backend
npm i
npm run dev
```

### Environment Variables

`backend/.env`: Environment variables required in our backend 

```javascript
MONGODB_CONNECTION_STRING=Your_MongoDB_Connection_String

PORT=5001

JWT_SECRETE_KEY=your_secret_key
TOKEN_NAME=your_token_name

# node environment
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

// Future  variables...
````

`frontend/.env`: Environment variables required in our frontend  

```javascript
// Future Variables...
```