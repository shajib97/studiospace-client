# StudioSpace

StudioSpace is a marketplace for discovering and booking photography, film, podcast, music, and workshop spaces. Hosts can publish and manage their own listings.

- [Live app](https://studiospace-client-nu-three.vercel.app/)
- [Express API repository](https://github.com/shajib97/studiospace-server)
- [Live API sample](https://studiospace-server-delta.vercel.app/api/studios/featured)

## Features

- Browse featured studios, filter by category, and view galleries, amenities, prices, and demo reviews.
- Sign in with email and password, Google, or GitHub.
- Create, edit, and delete your own listings. Upload listing photos through ImgBB.
- Request a booking, check its status in My Bookings, and cancel a pending request. Requests that overlap a confirmed booking for the same studio are rejected.
- Use the responsive interface in light or dark mode.

## Tech stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui with Base UI, Better Auth, Express, MongoDB Atlas, ImgBB, and Vercel. The Next.js server forwards authenticated requests to Express using short-lived JWTs.

## Run locally

Clone this repository and the linked API repository. Install dependencies with `npm ci` in each folder. In the API root, create a `.env` with `PORT=5000`, `CLIENT_URL=http://localhost:3000`, `DB_NAME=StudioSpace`, your `MONGODB_URI`, and an `API_JWT_SECRET`. Start Express with `node index.js`.

Create `.env.local` in the client root with the following variables. Replace the placeholders with your own values and set `API_URL` to your local Express URL.

```dotenv
API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-better-auth-secret
API_JWT_SECRET=the-same-jwt-secret-used-by-express
MONGODB_URI=your-mongodb-connection-string
DB_NAME=StudioSpace
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
IMGBB_API_KEY=your-imgbb-api-key
```

Run `npm run dev` in the client and open [localhost:3000](http://localhost:3000). Use `npm run lint` and `npm run build` to validate changes.

## Examiner login

Use the email and password fields on the [live login page](https://studiospace-client-nu-three.vercel.app/login).

- Email: `studiospace.examiner.cf8021@example.com`
- Password: `DemoAa9-Vrqx6vjAVy3pXUyjN0Es`

This is a shared demo account with standard user access.
