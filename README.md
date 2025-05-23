# Sanity Suite

A collection of services to assist with development and operations workflows.

## Services

### Badge Status

A service that generates SVG badges for different release environments. It stores status data in a JSON file and serves badges via a Fastify server.

- **Port**: 3000
- **Endpoints**:
  - `GET /:release/:env.svg` - Get SVG badge for a specific release and environment
  - `POST /:release/:env` - Update status for a specific release and environment
  - `GET /health` - Health check endpoint
  - `GET /badge/:workflow` - Get badge based on GitHub workflow status

### MS Teams Chatbot

A chatbot service for Microsoft Teams integration.

- **Port**: 4000

## Setup

### Prerequisites

- Node.js (16+)
- Docker & Docker Compose

### Installation

```bash
# Install dependencies for all services
npm install

# Start all services with Docker
npm start

# Or start individual services
npm run start:badge
npm run start:chatbot
```

### Development

Each service is kept in its own directory with its own package.json and Dockerfile, but they can share common code and configurations through the monorepo structure.

## Docker

The project uses Docker Compose to manage all services. You can start everything with:

```bash
docker-compose up
```

Or build the images:

```bash
docker-compose build
```

## License

MIT
