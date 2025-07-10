# SmartCatch Messaging Backend

A simple Express backend for demo messaging.

## Setup & Run

```bash
cd backend
npm install
node index.js
```

The server will run on [http://localhost:3001](http://localhost:3001).

## Endpoints

- `GET /messages/:user` — Get all messages for a user/conversation
- `POST /messages/:user` — Send a new message to a user/conversation

Messages are stored in-memory and reset on server restart. 