# Flow Board Frontend

Flow Board is a team task management app for organizations, boards, and cards.
This frontend is built with Next.js, Tailwind CSS, and shadcn/ui components.

## Local Development

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

By default, the app expects the backend API at:

```bash
http://127.0.0.1:5001/api
```

To use another API URL, create a local environment file and set:

```bash
NEXT_PUBLIC_API_URL=https://your-api-host.com/api
```

## Pages

- Landing page
- About page
- Pricing page
- FAQ page
- Contact page
- Login and signup pages
- App workspace
- Organizations, members, boards, and cards

## Backend Contract

The frontend is wired to the Flow Board backend endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/org`
- `POST /api/org/create`
- `POST /api/org/:orgId/invite`
- `GET /api/org/:id/members`
- `POST /api/board/:orgId`
- `GET /api/board/:orgId/list`
- `POST /api/card/:boardId`
- `GET /api/card/:boardId/list`
- `PATCH /api/card/:cardId/status`
