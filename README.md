# Agnos - Real-Time Patient Registration

Agnos is a small real-time patient registration and monitoring application. 

The application has two main views:
- **Patient View**: Used to enter patient registration information.
- **Staff Dashboard**: Allows staff to see patient information and monitor the patient's activity in real time.

The primary purpose of this project is to demonstrate real-time communication between the patient and staff views using WebSockets.

## Features

- Patient registration form
- Client-side form validation (required fields, email, phone, date of birth)
- Real-time patient data synchronization
- Real-time typing and activity status
- Active / Inactive patient tracking
- Successful submission states
- Graceful WebSocket connection and error handling
- Clean, responsive UI using Tailwind CSS

## Tech Stack

- Next.js
- React
- JavaScript
- Tailwind CSS
- Node.js
- WebSocket (`ws` package)

## Application Structure

```text
Patient Browser
      |
      | WebSocket
      v
Node.js WebSocket Server
      |
      | Broadcast
      v
Staff Browser
```

## Real-Time Patient Status

The Staff Dashboard tracks the patient's activity and connection lifecycle through the following statuses:

- Patient connects -> Inactive
- Patient starts typing -> Active
- Patient stops typing for the inactivity timeout -> Inactive
- Patient submits -> Submitted
- Patient disconnects -> Disconnected / Inactive

## WebSocket Events

The application uses the following WebSocket event types for communication:

- `patient:join` - Sent when the Patient View connects.
- `staff:join` - Sent when the Staff Dashboard connects.
- `patient:typing` - Sent by the patient containing debounced form data.
- `patient:submitted` - Sent when the patient successfully submits the form.
- `patient:status` - Broadcasted by the server to update the staff's status badge.
- `error` - Safely emitted if invalid data is processed.

## Project Structure

```text
app/
├── page.jsx
├── patient/
│   └── page.jsx
└── staff/
    └── page.jsx
components/
├── patient/
│   ├── PatientForm.jsx
│   └── FormField.jsx
└── staff/
    └── StaffDashboard.jsx
server/
└── websocket.js
```

## Getting Started

To run the application locally, you will need two terminal windows.

1. Start the Next.js development server:
```bash
npm run dev
```

2. Start the Node.js WebSocket server:
```bash
npm run ws
```

Once both servers are running, you can access the views at:
- **Patient View**: http://localhost:3000/patient
- **Staff View**: http://localhost:3000/staff

## Validation

To verify the integrity of the project, run the following commands:

```bash
npm run lint
npm run build
```

## Notes

- **No Database**: The current implementation runs entirely in-memory and does not use a persistent database. Connected clients and patient data are managed dynamically during active WebSocket sessions.