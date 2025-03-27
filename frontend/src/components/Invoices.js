import React, { useEffect, useState } from 'react';
import { fetchInvoices } from '../services/apiService';
import InvoiceCard from './InvoiceCard'; // Import InvoiceCard component
import './Invoices.css'; // Import CSS for styling

const Invoices = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch invoices from the backend
        const getData = async () => {
            try {
                const result = await fetchInvoices();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="invoices-container">
            {/* Render each invoice as a card */}
            {data.map(invoice => (
                <InvoiceCard key={invoice.Id} invoice={invoice} />
            ))}
        </div>
    );
};

export default Invoices;
