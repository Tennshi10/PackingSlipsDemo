const IntuitService = require('../services/intuitService');
const axios = require('axios');

class IntuitController {
    constructor() {
        this.intuitService = new IntuitService(axios);
        this.state = null; // Add this line
    }

    async fetchData(req, res) {
        try {
            console.log('Fetching data from Intuit API'); // Add this line
            const companyId = '9341454230989547'; // Replace with your actual company ID
            const query = 'select * from CompanyInfo'; // Example query, adjust as needed
            const minorVersion = 75; // Example minor version, adjust as needed
            console.log(`Query: ${query}, Company ID: ${companyId}, Minor Version: ${minorVersion}`); // Add this line
            const data = await this.intuitService.getData(`/v3/company/${companyId}/query?query=${encodeURIComponent(query)}&minorversion=${minorVersion}`);
            console.log('Data fetched successfully:', data); // Add this line
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching data:', error); // Add this line
            res.status(500).json({ message: 'Error fetching data', error: error.message });
        }
    }

    async fetchInvoices(req, res) {
        try {
            console.log('Fetching invoices from Intuit API');
            const companyId = '9341454230989547'; // Replace with your actual company ID
            const query = "SELECT * FROM Invoice where TxnDate > '2025-02-20'"; // Fetch all invoices
            const minorVersion = 75; // Example minor version, adjust as needed
            console.log(`Query: ${query}, Company ID: ${companyId}, Minor Version: ${minorVersion}`);
            const data = await this.intuitService.getData(`/v3/company/${companyId}/query?query=${encodeURIComponent(query)}&minorversion=${minorVersion}`);
            console.log('Invoices fetched successfully:', data);
    
            // Log the raw data to see what is being fetched
            console.log('Raw invoice data:', JSON.stringify(data, null, 2));
    
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
            console.error('Error fetching invoices:', error.response ? error.response.data : error.message); // Enhanced error logging
            res.status(500).json({ message: 'Error fetching invoices', error: error.response ? error.response.data : error.message });
        }
    }

    async authorize(req, res) {
        try {
            if (this.intuitService.token) {
                res.json({ message: 'Already authorized' });
            } else {
                const authUrl = await this.intuitService.getAuthorizationCode();
                this.state = authUrl.split('state=')[1]; // Store the state parameter
                res.json({ authorizationUrl: authUrl }); // Return the authorization URL
            }
        } catch (error) {
            res.status(500).json({ message: 'Error initiating authorization', error: error.message });
        }
    }

    async callback(req, res) {
        const authCode = req.query.code;
        const state = req.query.state;
        if (state !== this.state) {
            return res.status(400).json({ message: 'Invalid state parameter' });
        }
        try {
            await this.intuitService.getToken(authCode);
            res.redirect('http://localhost:3000'); // Redirect to the frontend application
        } catch (error) {
            res.status(500).json({ message: 'Error during authorization callback', error: error.message });
        }
    }
}

module.exports = IntuitController;