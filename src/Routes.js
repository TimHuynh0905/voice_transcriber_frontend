import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home/Home';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import NewVoice from "./containers/NewVoice/NewVoice";
import Voices from "./containers/Voices/Voices";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import NotFound from './containers/ErrorHandler/NotFound';

const Routes = () => (
    <Switch>
        <Route exact path="/">
            <Home/>
        </Route>
        <UnauthenticatedRoute exact path="/login">
            <Login/>
        </UnauthenticatedRoute>
        <UnauthenticatedRoute exact path="/signup">
            <Register/>
        </UnauthenticatedRoute>
        <AuthenticatedRoute exact path="/voices/new">
            <NewVoice/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/voices/:id">
            <Voices/>
        </AuthenticatedRoute>
        <Route>
            <NotFound/>
        </Route>
    </Switch>
)

export default Routes;

