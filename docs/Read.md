## Convex Setup

1. Go to convex.dev make an account make a project and whatevers
2. Then come here do `npm run dev` and convex will ask you create new project or pick existing so you can pick existing directly
3. Everything will be setup by convex till then and you can come to `localhost:3000` and try to sign in
4. While signing in it'll give errors about PRIVATE_JWT_SECRET and whatever so then run `node generateKeys.mjs` (Requires `jose` package)
5. Then go to the dashboard there you'll see a cloud development in green box click on it go to environment variables (Settings) and then add and then paste `PRIVATE_JWT_SECRET` AND `JWKS`
6. After that you should login successfully
