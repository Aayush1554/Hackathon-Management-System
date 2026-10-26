# 🔌 Real-Time Communication with Socket.io

## Overview

The Hackathon Management System uses **Socket.io** to provide real-time communication between teams and their assigned mentors.

Instead of requiring users to manually refresh the chat, Socket.io allows message, reaction, and deletion events to be communicated between connected clients in real time.

The implementation uses a **room-based communication architecture**, where each team-mentor conversation has its own Socket.io room.

---

# 🏗️ Architecture

```text
┌──────────────────┐                 ┌──────────────────┐
│   Team Client    │                 │  Mentor Client   │
│  React + Socket  │                 │  React + Socket  │
└────────┬─────────┘                 └────────┬─────────┘
         │                                    │
         │          Socket.io Connection      │
         └────────────────┬───────────────────┘
                          │
                  ┌───────▼────────┐
                  │ Node.js Server │
                  │    Express     │
                  │   + Socket.io  │
                  └───────┬────────┘
                          │
                    ┌─────▼─────┐
                    │   MySQL   │
                    │  Database │
                    └───────────┘
```

---

# 🔧 Backend Implementation

## 1. Socket.io Server

The backend creates an HTTP server around the Express application and attaches Socket.io to it.

### `server.js`

The Socket.io server:

- Runs on the same port as the Express backend.
- Uses CORS configuration for the frontend.
- Handles client connections.
- Allows clients to join and leave communication rooms.
- Broadcasts communication events to the appropriate room.

The default backend port is:

```text
5000
```

---

## 2. Room-Based Communication

Each team-mentor conversation receives a unique room.

The room format is:

```text
team_{teamId}_mentor_{mentorId}
```

For example:

```text
team_3_mentor_5
```

This means:

```text
Team ID: 3
Mentor ID: 5
```

Only users connected to that team-mentor room receive events for that conversation.

### Why use rooms?

Room-based communication:

- Separates different conversations.
- Prevents messages from being broadcast to unrelated users.
- Allows multiple team-mentor conversations to operate simultaneously.
- Provides a scalable structure for real-time communication.

---

# 🔄 Socket Events

The application currently handles four main real-time events.

| Event | Purpose |
|---|---|
| `new_message` | Notifies clients when a new message is sent |
| `message_reaction` | Notifies clients when a reaction is added or removed |
| `message_deleted_for_me` | Notifies clients about a message deleted locally |
| `message_deleted_for_everyone` | Notifies clients when a message is deleted for everyone |

---

# 📨 Message Flow

## Sending a Message

When a user sends a message:

```text
React Client
     │
     │ POST request
     ▼
Backend Controller
     │
     │ Save message
     ▼
MySQL Database
     │
     │ Message saved
     ▼
Socket.io Server
     │
     │ emit("new_message")
     ▼
Team-Mentor Room
     │
     ├──────────────► Team Client
     │
     └──────────────► Mentor Client
```

The receiving client gets the Socket.io event and refreshes the chat data so the new message appears without manually refreshing the browser.

---

# 👍 Reaction Flow

When a user adds or removes a reaction:

```text
Frontend
    │
    │ POST reaction request
    ▼
Backend Controller
    │
    │ Update database
    ▼
MySQL
    │
    │ Updated reactions
    ▼
Socket.io
    │
    │ emit("message_reaction")
    ▼
Team-Mentor Room
    │
    ├──────────────► Team
    │
    └──────────────► Mentor
```

The other connected client receives the event and updates its chat interface.

---

# 🗑️ Message Deletion Flow

When a user deletes a message:

```text
Frontend
    │
    │ DELETE request
    ▼
Backend Controller
    │
    │ Update database
    ▼
MySQL
    │
    │ Updated message state
    ▼
Socket.io
    │
    │ emit(...)
    ▼
Team-Mentor Room
    │
    ├──────────────► Team
    │
    └──────────────► Mentor
```

Depending on the deletion type, the appropriate event is emitted:

```text
message_deleted_for_me
```

or:

```text
message_deleted_for_everyone
```

---

# 🎨 Frontend Implementation

## `ChatInterface.tsx`

The chat interface manages the Socket.io connection.

It:

- Imports `io` and `Socket` from `socket.io-client`.
- Receives `teamId` and `mentorId`.
- Stores the Socket.io connection using `useRef`.
- Establishes a connection when the chat is opened.
- Joins the appropriate team-mentor room.
- Listens for real-time events.
- Refreshes the chat when an event is received.
- Disconnects and cleans up the socket when the component unmounts.

The Socket.io client connects using:

```text
VITE_API_URL
```

or, if it is not configured:

```text
http://localhost:5000
```

---

# 🧩 Component Integration

## `MentorContentModal.tsx`

The mentor content modal passes the appropriate identifiers to the chat interface:

```text
teamId
mentorId
```

This allows the chat to join the correct communication room.

---

## `MentorDashboard.tsx`

The mentor dashboard passes:

```text
teamId={selectedTeam?.team_id}
mentorId={user?.user_id}
```

to `ChatInterface`.

This ensures that the mentor connects to the room corresponding to the currently selected team.

---

# 🔐 Communication Isolation

The room-based architecture prevents unrelated conversations from receiving each other's Socket.io events.

For example:

```text
team_1_mentor_2
```

and:

```text
team_3_mentor_5
```

are completely separate rooms.

An event emitted to:

```text
team_1_mentor_2
```

is not broadcast to:

```text
team_3_mentor_5
```

This provides communication isolation between different team-mentor conversations.

> Authentication and authorization are handled separately by the application's existing authentication system and API middleware. Socket.io rooms provide event routing and communication isolation.

---

# 🧪 Testing Real-Time Communication

## 1. Start the Backend

Open a terminal:

```bash
cd BACKEND
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

---

## 2. Start the Frontend

Open another terminal:

```bash
cd FRONTEND
npm run dev
```

The frontend should start on:

```text
http://localhost:5173
```

---

## 3. Open Two Clients

Use two browser windows, or use an incognito window for the second client.

### Window 1

Login as a team member.

### Window 2

Login as the mentor assigned to that team.

Open the same team-mentor chat in both windows.

---

## 4. Test Messaging

Send a message from the team account.

Expected result:

```text
Team
  ↓
Backend
  ↓
Database
  ↓
Socket.io
  ↓
Mentor
```

The mentor should receive the update without manually refreshing the page.

---

## 5. Test Reactions

Add a reaction to a message.

Expected result:

```text
Reaction added
      ↓
Database updated
      ↓
Socket.io event
      ↓
Other client receives update
```

The reaction should appear on the other client without a manual page refresh.

---

## 6. Test Message Deletion

Delete a message using the available deletion functionality.

Expected result:

```text
Message deletion
      ↓
Database updated
      ↓
Socket.io event
      ↓
Other client receives update
```

The other client should reflect the deletion automatically.

---

# ⚙️ Configuration

## Backend

Socket.io runs alongside the Express server.

Default configuration:

```text
Backend Port: 5000
```

The backend Socket.io configuration includes:

- CORS support
- Connection handling
- Room management
- Event broadcasting
- WebSocket transport with Socket.io fallback support

---

## Frontend

The Socket.io client uses:

```text
VITE_API_URL
```

when configured.

Otherwise it defaults to:

```text
http://localhost:5000
```

The client also supports automatic reconnection.

---

# 🔄 Polling Fallback

The chat application also has a periodic refresh mechanism.

The polling interval is:

```text
3 seconds
```

Socket.io is responsible for the real-time experience, while the existing refresh mechanism provides a fallback if a Socket.io connection is unavailable or temporarily interrupted.

Therefore:

```text
Primary:
Socket.io → Real-time updates

Fallback:
Periodic API refresh → Synchronization
```

---

# 🐛 Troubleshooting

## Messages Are Not Updating in Real Time

Check:

1. Backend server is running.
2. Frontend is connected to the correct backend URL.
3. Browser console for Socket.io errors.
4. Backend terminal for connection messages.
5. Team ID and mentor ID are correct.
6. Both users are opening the same team-mentor conversation.

---

## CORS Error

Check the backend `.env`:

```env
FRONTEND_URL=http://localhost:5173
```

Make sure it matches the URL where the frontend is running.

Restart the backend after changing `.env`.

---

## Socket.io Is Not Connecting

Check:

```text
Backend:
http://localhost:5000

Frontend:
http://localhost:5173
```

If using a frontend `.env`, verify:

```env
VITE_API_URL=http://localhost:5000
```

Then restart the Vite development server.

---

## Room Events Are Not Received

Verify that the room identifier is consistent:

```text
team_{teamId}_mentor_{mentorId}
```

The same team-mentor pair must generate the same room name on both sides.

---

# 🗄️ Database Changes

The communication system uses the following identifier changes:

```text
message_id
     ↓
communication_id
```

`communication_id` is used as the primary key for communication records.

The reply reference was also changed:

```text
reply_to_message_id
     ↓
reply_to_communication_id
```

Foreign key relationships were updated accordingly.

---

# 📁 Related Files

Important Socket.io-related files include:

```text
BACKEND/
├── server.js
├── controllers/
│   ├── team.controller.js
│   └── mentor.controller.js
└── models/
    ├── Team.model.js
    └── Mentor.model.js

FRONTEND/
└── src/
    └── components/
        └── ChatInterface.tsx
```

Additional frontend components involved in the integration:

```text
MentorContentModal.tsx
MentorDashboard.tsx
```

---

# 🎯 Result

### Before Socket.io

```text
User sends message
       ↓
Database updated
       ↓
Other user does not immediately see it
       ↓
Refresh / polling required
```

### With Socket.io

```text
User sends message
       ↓
Database updated
       ↓
Socket.io event emitted
       ↓
Team-Mentor room
       ↓
Other client receives event
       ↓
Chat updates automatically
```

This provides a smoother real-time communication experience between hackathon teams and their assigned mentors.

---

## 🚀 Summary

The Socket.io implementation provides:

- ✅ Real-time messaging
- ✅ Real-time reactions
- ✅ Real-time message deletion updates
- ✅ Team-mentor room isolation
- ✅ Automatic reconnection
- ✅ WebSocket-based communication
- ✅ Polling fallback
- ✅ Support for multiple simultaneous conversations
- ✅ Integration with the existing React + Node.js architecture