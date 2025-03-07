import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import IntuitData from './components/IntuitData';
import axios from 'axios';

function App() {
  const history = useHistory();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/intuit/authorize');
        if (response.data.authorizationUrl) {
          window.location.href = response.data.authorizationUrl;
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error initiating authorization:', error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      // Handle the callback and fetch data
      axios.get(`http://localhost:5000/api/intuit/callback?code=${code}&state=${state}`)
        .then(() => {
          setIsAuthorized(true);
          history.push('/');
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
        <Switch>
          <Route path="/" exact>
            {isAuthorized ? <IntuitData /> : <div>Authorizing...</div>}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;