import axios from 'axios';

const API_URL = 'http://localhost:5000/api/intuit/data'; // Ensure this URL is correct

export const fetchIntuitData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching Intuit data:', error);
        throw error;
    }
};