const IntuitService = require('../services/intuitService');
const axios = require('axios');

class IntuitController {
    constructor() {
        // Initialize the IntuitService and state
        this.intuitService = new IntuitService(axios);
        this.state = null;
    }

    // Fetch general company data from Intuit API
    async fetchData(req, res) {
        try {
            console.log('Fetching data from Intuit API');
            const companyId = '9341454230989547'; // Company ID for the API request
            const query = 'select * from CompanyInfo'; // Query to fetch company information
            const minorVersion = 75; // Minor version for API compatibility

            // Make the API request to fetch company data
            const data = await this.intuitService.getData(`/v3/company/${companyId}/query?query=${encodeURIComponent(query)}&minorversion=${minorVersion}`);
            console.log('Data fetched successfully:', data);

           
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching data:', error);

            
            res.status(500).json({ message: 'Error fetching data', error: error.message });
        }
    }

    // Fetch invoices with specific custom fields from Intuit API
    async fetchInvoices(req, res) {
        try {
            console.log('Fetching invoices from Intuit API');
            const companyId = '9341454230989547'; // Company ID for the API request
            const query = "SELECT * FROM Invoice where TxnDate > '2024-02-20'"; // Query to fetch invoices
            const minorVersion = 75; // Minor version for API compatibility

            // Make the API request to fetch invoices
            const data = await this.intuitService.getData(`/v3/company/${companyId}/query?query=${encodeURIComponent(query)}&minorversion=${minorVersion}`);
            console.log('Invoices fetched successfully:', data);

            // Filter invoices based on custom fields
            const filteredInvoices = data.QueryResponse.Invoice.filter(invoice => {
                return invoice.CustomField && invoice.CustomField.some(field => 
                    field.Name === 'PackingSlip' && 
                    ['PENDING', 'WORKING', 'FINISHED', 'SHIPPED'].includes(field.StringValue)
                );
            });

            console.log('Filtered invoices:', filteredInvoices);

           
            res.status(200).json(filteredInvoices);
        } catch (error) {
            console.error('Error fetching invoices:', error.response ? error.response.data : error.message);

           
            res.status(500).json({ message: 'Error fetching invoices', error: error.response ? error.response.data : error.message });
        }
    }

    // Initiate the OAuth authorization process
    async authorize(req, res) {
        try {
            // Check if the user is already authorized
            if (this.intuitService.token) {
                res.json({ message: 'Already authorized' });
            } else {
                // Generate the authorization URL and store the state parameter
                const authUrl = await this.intuitService.getAuthorizationCode();
                this.state = authUrl.split('state=')[1];
                res.json({ authorizationUrl: authUrl }); // Return the authorization URL
            }
        } catch (error) {
           
            res.status(500).json({ message: 'Error initiating authorization', error: error.message });
        }
    }

    // Handle the OAuth callback and exchange the authorization code for a token
    async callback(req, res) {
        const authCode = req.query.code; // Extract the authorization code from the query parameters
        const state = req.query.state; // Extract the state parameter from the query parameters

        // Validate the state parameter to prevent CSRF attacks
        if (state !== this.state) {
            return res.status(400).json({ message: 'Invalid state parameter' });
        }

        try {
            // Exchange the authorization code for an access token
            await this.intuitService.getToken(authCode);

            // Redirect the user to the frontend application
            res.redirect('http://localhost:3000');
        } catch (error) {
          
            res.status(500).json({ message: 'Error during authorization callback', error: error.message });
        }
    }
}

module.exports = IntuitController;