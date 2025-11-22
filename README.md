# Uncharted Travel

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

Install the dependencies:

```bash
npm install
```

### Running the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Routes

### Submit Waitlist

**Endpoint:** `/api/submitWaitlist`
**Method:** `POST`

#### Testing with curl

You can test the waitlist submission endpoint using the following command:

```bash
curl -X POST \
  http://localhost:3000/api/submitWaitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "featurePreferences": ["adventure", "luxury"]}'
```

**Note:** Ensure the development server is running before executing the curl command.
