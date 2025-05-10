# Chat-Application
Chat Application for multiple users to communicate with each other concurrently.

## **Project Requirement**
User can discover all other register user and search based on their user-name.

User can send a friend request to other user.

User can create Groups, send group invitation to users.

User can accept, reject other user's request or block user from sending the request (friend request or group invite).

User can accept or reject group invitation, won't be able to see messages of blocked user and vice-versa.
                                  
Users can interact with each other in text, send images, files, etc.

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

PORT=ANY_AVAILABLE_PORT_NUMBER

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