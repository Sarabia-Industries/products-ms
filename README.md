# Product Microservice

## Development

1. Clone the repository
2. Install dependencies
3. Create a `.env` file based on `example.env`
4. Run the Prisma migration: `npx prisma migrate dev`
5. Start the NATS server

   ```sh
   docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
   ```

6. Run `npm run start:dev`
