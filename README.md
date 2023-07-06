# Storm Board

## Development
### Requirements
`docker` and `docker-compose` should be installed.

### Instructions
All backend related code can be found in `/backend`.
All frontend related code can be found in `/frontend`

To start the development environment run `docker compose up` from the root folder.

### Description
The previous command will start:
- The frontend server (next.js) -> mapped to handle any route except for the ones which start with `/api`
- The backend server (express.js) -> mapped to handle any route starting with `/api`
- Nginx to handle the http traffic routing and having both servers be accessible from one single endpoint
- Mongodb

Both the frontend and backend have live reload enabled, so any change of your code will automatically restart the server and be available.

### Terminate
Press `ctrl+c` or run the command `docker compose down` from another terminal.
