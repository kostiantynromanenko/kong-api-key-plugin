class KongPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        const apiKey = await kong.request.getHeader('X-API-Key');

        kong.log('API Key header value: ' + apiKey);

        if (apiKey) {
            try {
                const res = await fetch('http://auth-service:3000/api/apiKey/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ key: apiKey })
                });

                kong.log('API Key validation response: ' + res.status);

                if (!res.ok) {
                    const errorMessage = await res.json();
                    await kong.response.exit(res.status, errorMessage);
                }
            } catch (e) {
                kong.log('Unexpected plugin error.', e.toString());
            }
        } else {
            await kong.response.exit(403, "No API Key provided.");
        }
    }
}

module.exports = {
    Plugin: KongPlugin,
    Name: 'api-key',
    Version: '0.0.1',
    Priority: 0,
}