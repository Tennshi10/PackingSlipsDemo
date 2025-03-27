import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory, Link } from 'react-router-dom'; // Add Link
import IntuitData from './components/IntuitData';
import Invoices from './components/Invoices'; // Import Invoices component
import axios from 'axios';
import './App.css'; // Import global CSS

function App() {
  const history = useHistory();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if the user is authorized or initiate the authorization process
    const checkAuthorization = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/intuit/authorize');
        if (response.data.authorizationUrl) {
          window.location.href = response.data.authorizationUrl; // Redirect to authorization URL
        } else {
          setIsAuthorized(true); // User is already authorized
        }
      } catch (error) {
        console.error('Error initiating authorization:', error);
      }
    };

    // Handle the OAuth callback and fetch data
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      axios.get(`http://localhost:5000/api/intuit/callback?code=${code}&state=${state}`)
        .then(() => {
          setIsAuthorized(true);
          history.push('/'); // Redirect to the home page
        })
        .catch(error => {
          console.error('Error during authorization callback:', error);
        });
    } else {
      checkAuthorization();
    }
  }, [history]);

  return (
    <Router>
      <div>
        <h1>Intuit Data Fetcher</h1>
        {/* Navigation links */}
        <nav>
          <Link to="/">Home</Link> | <Link to="/invoices">Invoices</Link> {/* Add link to invoices */}
        </nav>
        <Switch>
          {/* Route for the home page */}
          <Route path="/" exact>
            {isAuthorized ? <IntuitData /> : <div>Authorizing...</div>}
          </Route>
          {/* Route for the invoices page */}
          <Route path="/invoices" exact>
            <Invoices /> {/* Add route for invoices */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;