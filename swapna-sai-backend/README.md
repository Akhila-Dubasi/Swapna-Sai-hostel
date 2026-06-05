# swapna-sai-backend

## Environment Variables (.env)
Create a `.env` file in the root of the backend folder with the following:
```
PORT=5000
DATABASE_URL=postgres://[user]:[password]@[host]:[port]/[db]?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
```

## Running Locally
1. `npm install`
2. `node server.js`

## Production Deployment (Render)
This project is configured to deploy directly to Render.com using the included `render.yaml`.
1. Push this backend repository to GitHub.
2. Go to Render.com -> Dashboard -> New -> Blueprint.
3. Select your repository.
4. Render will automatically detect `render.yaml` and deploy your Web Service.
5. Go to your Render Web Service -> Environment, and ensure `DATABASE_URL` and `JWT_SECRET` are securely set.
