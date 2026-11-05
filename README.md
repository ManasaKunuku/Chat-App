# Team Chat App

A responsive React chat interface inspired by the supplied reference screenshots.

## Features
- Channel navigation (Poland Office, Introductions, India Office)
- Send messages in the selected channel
- Emoji picker with search
- Heart reactions on messages
- Member list panel
- Search messages in the current channel
- Create additional channels
- Responsive mobile navigation

## Run locally

1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. In the terminal, run:

   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

All message data is stored in React state for this demo. A backend or realtime service is required for persistent, multi-user messaging.
