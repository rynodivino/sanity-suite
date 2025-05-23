import Fastify from 'fastify';
import { CloudAdapter } from 'botbuilder';

// Create server
const fastify = Fastify({ logger: true });
fastify.listen({ 
    port: process.env.port || process.env.PORT || 4000, 
    host: '0.0.0.0' 
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`\nBot is listening on ${address}`);
});

// Create adapter
const adapter = new CloudAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for incoming requests
fastify.post('/api/messages', async (request, reply) => {
    await adapter.processActivity(request.raw, reply.raw, async (context) => {
        // Echo back the user's message
        if (context.activity.type === 'message') {
            await context.sendActivity(`You said: ${context.activity.text}`);
        }
    });
});

// Update the health check route
fastify.get('/health', async (request, reply) => {
    reply.send({ status: 'ok', service: 'msteams-chatbot' });
});