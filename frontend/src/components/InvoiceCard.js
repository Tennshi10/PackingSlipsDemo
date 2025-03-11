import React from 'react';
import './InvoiceCard.css'; // Import CSS for styling

const InvoiceCard = ({ invoice }) => {
    const status = invoice.CustomField.find(field => field.Name === 'PackingSlip').StringValue.toLowerCase();
    return (
        <div className={`invoice-card ${status}`}>
            <h2>Invoice #{invoice.DocNumber}</h2>
            <p><strong>Date:</strong> {invoice.TxnDate}</p>
            <p><strong>Customer:</strong> {invoice.CustomerRef.name}</p>
            <p><strong>Total Amount:</strong> ${invoice.TotalAmt.toFixed(2)}</p>
            <p><strong>Status:</strong> {status.toUpperCase()}</p>
        </div>
    );
};

export default InvoiceCard;
