import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from './Routes';
import './App.css';
import { AppContext} from './libs/contextLib';
import { Auth } from 'aws-amplify';
import { onError } from './libs/errorLib';


function App() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, [])

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch (e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  const handleLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/login");
  } 

  return (
    !isAuthenticating &&
    <div className="App">
      <Navbar fluid="true" collapseOnSelect fixed="top" expand="lg">
        <Navbar.Brand>
            <Link to="/" style={{textDecoration:"none",}}>Voice Transcriber</Link>
        </Navbar.Brand>
        <Navbar.Toggle>
            <svg className="bi bi-justify" width="2em" height="2em" viewBox="0 0 16 16" fill={"black"} xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
        </Navbar.Toggle>
        <Navbar.Collapse>
            <Nav className="ml-auto"> 
                {isAuthenticated ?
                <>
                    <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
                </>
                : <>
                    <LinkContainer to="/signup">
                        <Nav.Item>Sign Up</Nav.Item>
                    </LinkContainer>
                    <LinkContainer to="/login">
                        <Nav.Item>Login</Nav.Item>
                    </LinkContainer>
                </>
                }
            </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider value={{isAuthenticated, userHasAuthenticated}}>
      <Routes/>
      </AppContext.Provider>
    </div>
  );
}

export default App;
