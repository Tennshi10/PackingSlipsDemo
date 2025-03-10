import axios from 'axios';

const API_URL = 'http://localhost:5000/api/intuit/data'; // Ensure this URL is correct
const INVOICES_URL = 'http://localhost:5000/api/intuit/invoices'; // Add this line

export const fetchIntuitData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching Intuit data:', error);
        throw error;
    }
};

export const fetchInvoices = async () => { // Add this function
    try {
        const response = await axios.get(INVOICES_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching invoices data:', error);
        throw error;
    }
};