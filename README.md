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

## Development Planning Documentation

### 1. Project Structure
The project separates the frontend (Next.js/React) and the backend (Node.js/ws) cleanly to ensure modularity.
- `app/`: Next.js App Router handling the individual routes (`/patient` and `/staff`).
- `components/`: Contains modular React UI components broken down by domain (`patient/` and `staff/`).
- `server/`: Houses the standalone Node.js WebSocket server script (`websocket.js`) to handle connections independently from the React lifecycle.

### 2. Design Decisions (UI/UX)
- **Responsive Layout**: Tailwind CSS grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) were used so the patient form is easy to use on mobile (stacking vertically) while expanding comfortably on desktop.
- **Visual Hierarchy**: Features like distinct background colors, categorized sections (e.g., "Personal Information", "Contact Details"), and color-coded status badges (Active/Inactive/Submitted) were implemented for quick visual scanning by staff.
- **Status Indicators**: Real-time status badges were designed as pill-shaped indicators to mimic live monitoring screens, giving staff immediate confidence in the system's real-time capabilities.

### 3. Component Architecture
- `PatientForm.jsx`: The core interactive component for patients. It manages its own form state and validation, and securely communicates with the WebSocket server using a debounced data pipeline.
- `FormField.jsx`: A reusable, accessible input wrapper that automatically handles labels, input types, and localized error messages, ensuring consistency across the form.
- `StaffDashboard.jsx`: A reactive dashboard that maintains a live connection to the server. It listens for status changes and dynamically displays the patient's data as it arrives without requiring page reloads.

### 4. Real-Time Synchronization Flow
- **Debounced Updates**: To prevent network flooding, patient input is debounced by 500ms. Keystrokes instantly trigger an 'Active' status ping, but the heavy form payload is only sent once the user pauses typing.
- **Server Broadcasting**: The Node.js server maintains a lightweight `Set` of active clients and tracks their roles (`staff` or `patient`). When the server receives an update from a patient, it routes the payload strictly to connected `staff` clients.
- **Lifecycle Management**: The server actively monitors connection health and uses an inactivity timer to automatically transition idle patients back to an "Inactive" status if no updates are received after a short delay.