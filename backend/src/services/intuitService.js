const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');

class IntuitService {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.token = null;
        this.baseUrl = 'https://sandbox-quickbooks.api.intuit.com'; // API URL
    }

    generateState() {
        return crypto.randomBytes(16).toString('hex');
    }

    async getAuthorizationCode() {
        const state = this.generateState();
        const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${process.env.INTUIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.INTUIT_REDIRECT_URI)}&response_type=code&scope=com.intuit.quickbooks.accounting&state=${state}`;
        // Redirect the user to the authorization URL
        return authUrl;
    }

    async getToken(authCode) {
        const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
        const auth = Buffer.from(`${process.env.INTUIT_CLIENT_ID}:${process.env.INTUIT_CLIENT_SECRET}`).toString('base64');
        const data = qs.stringify({
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: process.env.INTUIT_REDIRECT_URI
        });

        try {
            console.log('Requesting token from Intuit API'); 
            const response = await axios.post(tokenUrl, data, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            this.token = response.data.access_token;
            console.log('Token obtained successfully:', this.token);
        } catch (error) {
            console.error('Error obtaining token from Intuit API:', error.response ? error.response.data : error.message); // Add this line
            throw new Error(`Error obtaining token from Intuit API: ${error.message}`);
        }
    }

    async getData(endpoint) {
        if (!this.token) {
            throw new Error('No token available. Please authenticate first.');
        }

        try {
            const response = await this.apiClient.get(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'text/plain'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching data from Intuit API: ${error.message}`);
        }
    }

    async postData(endpoint, data) {
        if (!this.token) {
            throw new Error('No token available. Please authenticate first.');
        }

        try {
            const response = await this.apiClient.post(`${this.baseUrl}${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error posting data to Intuit API: ${error.message}`);
        }
    }
}

module.exports = IntuitService;