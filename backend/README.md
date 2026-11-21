# JobConnect Backend

Node.js + Express + MongoDB API for the existing JobConnect React/Vite frontend.

## 1. Install
```bash
npm install
```

## 2. Configure environment
Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string, database username/password, and a long random JWT secret. Do not commit `.env`.

If your MongoDB password contains special characters, URL-encode the password before putting it in the URI. In Atlas, add the IP address of the environment running this API under Network Access. Avoid `0.0.0.0/0` for production.

## 3. Run
```bash
npm run dev
```
API default: `http://localhost:5000`

## API endpoints

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Logged in |
| GET | `/api/jobs` | Public |
| GET | `/api/jobs/:id` | Public |
| POST | `/api/jobs` | Employer/Admin |
| PATCH | `/api/jobs/:id` | Owner/Admin |
| DELETE | `/api/jobs/:id` | Owner/Admin (soft close) |
| POST | `/api/applications/:jobId` | Job seeker |
| GET | `/api/applications/mine` | Job seeker |
| GET | `/api/applications/job/:jobId` | Job owner/Admin |

Send authenticated requests with:
`Authorization: Bearer YOUR_JWT_TOKEN`

Register body:
```json
{ "name": "Bibin", "email": "bibin@example.com", "password": "change-me-123", "role": "jobseeker" }
```
For an employer account, use `"role": "employer"`. Public registration intentionally does not allow admin creation.

## Frontend integration
Set the frontend API base URL to the deployed API URL, for example:
`https://YOUR-API-HOST/api`

This is a backend starter, not yet deployed or connected to the live frontend. Test endpoints and update the frontend's demo login/apply/post handlers before claiming those flows are live.
