import 'dotenv/config' // Load environment variables from .env
import Fastify from 'fastify'
import { CloudAdapter } from 'botbuilder'
import { healthCheck, log } from '../shared/utils.js'

const SERVICE_NAME = 'msteams-chatbot'

// Create server
const fastify = Fastify({ logger: true })
fastify.listen(
  {
    port: process.env.port || process.env.PORT || 4000,
    host: '0.0.0.0',
  },
  (err, address) => {
    if (err) {
      log(SERVICE_NAME, 'error', 'Failed to start service', { error: err.message })
      process.exit(1)
    }
    log(SERVICE_NAME, 'info', `Bot is listening on ${address}`)
  }
)

// Create adapter
const adapter = new CloudAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
})

// Listen for incoming requests
fastify.post('/api/messages', async (request, reply) => {
  await adapter.processActivity(request.raw, reply.raw, async (context) => {
    // Echo back the user's message
    if (context.activity.type === 'message') {
      await context.sendActivity(`You said: ${context.activity.text}`)
    }
  })
})

// Update the health check route
fastify.get('/health', async (request, reply) => {
  reply.send(healthCheck(SERVICE_NAME))
})
