# Backend Wizards — Stage 0: Profile Endpoint

Welcome to Stage 0! This project implements a small HTTP API that exposes a GET /me endpoint. The endpoint returns profile information and a dynamic cat fact fetched from the Cat Facts API.

This README documents how to run the project, the supported environment variables, the API contract, and submission guidance for the Backend Wizards Stage 0 task.

## What this project implements

- GET /me — returns JSON matching the required schema:
	- status: "success"
	- user: { email, name, stack }
	- timestamp: current UTC time in ISO 8601
	- fact: a random cat fact fetched from an external API
- GET /health — lightweight health endpoint (status + uptime)
- Uses Express, axios, cors and dotenv
- Configurable external API URL, timeout, and fallback behavior via environment variables

## Files of interest

- `server.js` — main application file (Express server and endpoints)
- `package.json` — project manifest (scripts, dependencies)
- `.env.example` — an example env file you can copy to `.env` for local development

## Requirements (acceptance checklist)

The implementation is designed to meet the Stage 0 acceptance criteria:

- [x] GET /me accessible and returns 200 OK when the external Cat Facts API responds
- [x] Response Content-Type is application/json for successful responses
- [x] Response includes `status`, `user`, `timestamp`, and `fact`
- [x] `user.email`, `user.name`, `user.stack` are non-empty (defaults or env overrides)
- [x] `timestamp` is current UTC ISO 8601 and updates per request
- [x] `fact` is fetched on every request (no caching)
- [x] Graceful fallback behavior: if `FACT_FALLBACK` is set the server returns that fact on external API failure (HTTP 200); otherwise server returns HTTP 502

## Prerequisites

- Node.js 14+ installed

## Install

From the project root:

```bash
npm install
```

## Environment configuration

You can copy `.env.example` to `.env` and edit values locally:

```bash
cp .env.example .env
# then edit .env
```

Supported environment variables (defaults shown):

- `PORT` — port to listen on (default: `3000`)
- `EMAIL` — user email included in `/me` (default: `nwosudavid77@gmail.com`)
- `FULL_NAME` — user full name (default: `Nwosu David`)
- `STACK` — backend stack string (default: `Node.js/Express`)
- `CATFACT_URL` — external cat fact API URL (default: `https://catfact.ninja/fact`)
- `CATFACT_TIMEOUT_MS` — timeout in ms for external API (default: `5000`)
- `FACT_FALLBACK` — fallback fact string. If set, the server returns this fact with HTTP 200 when the external API is unreachable. If not set, server returns HTTP 502 on external API failure.

## Run

Start the server:

```bash
npm start
```

Or set the port inline:

```bash
PORT=4000 npm start
```

## API Endpoints

1. GET /me

- Success response (HTTP 200, Content-Type: application/json)

Example

```json
{
	"status": "success",
	"user": {
		"email": "nwosudavid77@gmail.com",
		"name": "Nwosu David",
		"stack": "Node.js/Express"
	},
	"timestamp": "2025-10-15T12:34:56.789Z",
	"fact": "Cats have five toes on their front paws, but only four toes on their back paws."
}
```

- Failure behaviour

- If `FACT_FALLBACK` is set in the environment, the server will return the fallback fact with HTTP 200 when the external API fails.
- If `FACT_FALLBACK` is not set and the external API fails, the server returns HTTP 502 with a JSON error:

```json
{
	"status": "error",
	"message": "Unable to fetch cat fact from external API",
	"timestamp": "<iso timestamp>"
}
```

2. GET /health

Success response (HTTP 200):

```json
{
	"status": "ok",
	"uptime": 123.45
}
```

## Quick tests (curl)

```bash
curl -i http://localhost:3000/me
curl -i http://localhost:3000/health
```

To test fallback behaviour, set `FACT_FALLBACK` and force the external request to fail (e.g., by setting `CATFACT_URL` to an invalid host) and request `/me`.

README generated/updated on 2025-10-20 to match the current implementation.
