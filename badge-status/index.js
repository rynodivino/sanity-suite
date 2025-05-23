import Fastify from 'fastify';
import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import { makeBadge } from 'badge-maker';
import { healthCheck, log } from '../shared/utils.js';

const SERVICE_NAME = 'badge-status';
const fastify = Fastify({ logger: true });
const octokit = new Octokit();
const STATUS_FILE = path.resolve('./statuses.json');

// Helper to read statuses from file
async function readStatuses() {
    try {
        const data = await fs.readFile(STATUS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return {}; // Return empty object if file doesn't exist
        }
        throw err;
    }
}

// Helper to write statuses to file
async function writeStatuses(statuses) {
    await fs.writeFile(STATUS_FILE, JSON.stringify(statuses, null, 2));
}

// Endpoint to serve badge status
fastify.get('/badge/:workflow', async (request, reply) => {
    const { workflow } = request.params;

    try {
        // Fetch workflow status from GitHub
        const response = await octokit.actions.listWorkflowRuns({
            owner: 'your-github-username',
            repo: 'your-repo-name',
            workflow_id: workflow,
        });

        const latestRun = response.data.workflow_runs[0];
        const status = latestRun?.conclusion || 'unknown';

        // Generate badge based on status
        const badge = {
            label: 'Workflow',
            message: status,
            color: status === 'success' ? 'green' : status === 'failure' ? 'red' : 'yellow',
        };

        reply.send(badge);
    } catch (error) {
        log(SERVICE_NAME, 'error', 'Failed to fetch workflow status', { error: error.message });
        reply.code(500).send({ error: 'Failed to fetch workflow status' });
    }
});

// Update the endpoint to serve an SVG badge
fastify.get('/:release/:env.svg', async (request, reply) => {
    const { release, env } = request.params;

    try {
        const statuses = await readStatuses();
        const status = statuses[release]?.[env] || 'unknown';

        // Generate badge dynamically
        const format = {
            label: `${release} - ${env}`,
            message: status,
            color: status === 'success' ? 'green' : status === 'failure' ? 'red' : 'yellow',
        };
        const svg = makeBadge(format);

        reply.type('image/svg+xml').send(svg);
    } catch (error) {
        log(SERVICE_NAME, 'error', 'Failed to fetch badge status', { error: error.message });
        reply.code(500).send({ error: 'Failed to fetch badge status' });
    }
});

// Endpoint to update status for a specific release and environment
fastify.post('/:release/:env', async (request, reply) => {
    const { release, env } = request.params;
    const { status } = request.body;

    if (!status) {
        return reply.code(400).send({ error: 'Status is required in the request body' });
    }

    try {
        const statuses = await readStatuses();
        if (!statuses[release]) {
            statuses[release] = {};
        }
        statuses[release][env] = status;

        await writeStatuses(statuses);
        log(SERVICE_NAME, 'info', `Status updated for ${release}/${env}`, { status });
        reply.send({ message: `Status for ${release}/${env} updated to ${status}` });
    } catch (error) {
        log(SERVICE_NAME, 'error', 'Failed to update status', { error: error.message });
        reply.code(500).send({ error: 'Failed to update status' });
    }
});

// Add a health check route
fastify.get('/health', (request, reply) => {
    reply.send(healthCheck(SERVICE_NAME));
});

// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        log(SERVICE_NAME, 'info', 'Service is running on http://0.0.0.0:3000');
    } catch (err) {
        fastify.log.error(err);
        log(SERVICE_NAME, 'error', 'Failed to start service', { error: err.message });
        process.exit(1);
    }
};

start();