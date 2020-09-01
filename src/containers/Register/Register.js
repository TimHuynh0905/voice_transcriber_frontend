import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormLabel, FormGroup, FormControl, Button } from "react-bootstrap";
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { Link } from 'react-router-dom';
import { Spring } from 'react-spring/renderprops';
import { Auth } from "aws-amplify";
import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";
import { useFormFields } from "../../libs/hooksLib";
import "./Register.css";

const Register = ()  => {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });

    const history = useHistory();
    const [newUser, setNewUser] = useState(null);
    const { userHasAuthenticated } = useAppContext();

    const validateForm = () => {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    const validateConfirmationForm = () => {
        return fields.confirmationCode.length > 0;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password
            });
            setNewUser(newUser);
        } catch(e) {
            onError(e);
        }        
    }

    const handleConfirmationSubmit = async (event)  => {
        event.preventDefault();
        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
        }
    }

    const renderConfirmationForm = (props) => {
        return (
            <form style={props} onSubmit={handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                <FormLabel>Confirmation Code</FormLabel>
                <FormControl
                    autoFocus
                    type="tel"
                    onChange={handleFieldChange}
                    value={fields.confirmationCode}
                />
                <Form.Text>
                    Please check your email for the code.
                </Form.Text>
                </FormGroup>
                <Button
                    variant="outline-primary"
                    type="submit"
                    size="large"
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </Button>
            </form>
        );
    }

    const renderForm = (props) => {
        return (
            <div style={props}>
                <h3 className="register_title">
                    REGISTER HERE
                </h3>
                <form onSubmit={handleSubmit} className="register_form" >
                    <FacebookLogin
                        // appId="562118384400275"
                        // // autoLoad={true}
                        // fields="name,email,picture"
                        // scope="public_profile,user_friends"
                        // callback={responseFacebook}
                        icon="fa-facebook" />
                    <GoogleLogin
                        className="google-login"
                        // clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                        buttonText="LOGIN WITH GMAIL"
                        // onSuccess={responseGoogle}
                        // onFailure={responseGoogle}
                        // cookiePolicy={'single_host_origin'}
                    />
                    <h3 className="register_title">
                        OR
                    </h3>
                    <FormGroup controlId="fullname" bssize="large">
                    </FormGroup>
                    <FormGroup controlId="email" bssize="large">
                    <h5>Email</h5>
                    <FormControl
                        className="register_form_box"
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                    </FormGroup>
                    <FormGroup controlId="password" bssize="large">
                    <h5>Password</h5>
                    <FormControl
                        className="register_form_box"
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                    </FormGroup>
                    <FormGroup controlId="confirmPassword" bssize="large">
                    <h5>Confirm Password</h5>
                    <FormControl
                        className="register_form_box"
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.confirmPassword}
                    />
                    </FormGroup>
                    <Button
                        variant="success"
                        className="register_form_box mb-3"
                        type="submit"
                        size="large"
                        disabled={!validateForm()}
                    >
                        Register
                    </Button>
                    <Link to="/login"><h6>Already registered? Login in here!</h6></Link>
                </form>
            </div>
        );
    }

    return (
        <div className="register">
            <div className="container">
                <Spring
                    from={{ opacity:0, marginTop: -1000 }}
                    to={{ opacity:1, marginTop: 0, duration: 100 }}
                >
                    {props => newUser === null ? renderForm(props) : renderConfirmationForm(props)}
                </Spring>
            </div>
        </div>
    );
}

export default Register;