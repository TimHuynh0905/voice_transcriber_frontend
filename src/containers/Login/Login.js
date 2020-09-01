import React from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { Link } from 'react-router-dom';
import { Spring } from 'react-spring/renderprops';
import { Auth } from "aws-amplify";
import { useAppContext } from '../../libs/contextLib';
import { useFormFields } from "../../libs/hooksLib";
import { onError } from '../../libs/errorLib';

const Login = ()  => {
    const {userHasAuthenticated} = useAppContext();
    const [fields, handleFieldChange] = useFormFields({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const validateForm = () => {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0
        );
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
        } catch (e) {
            onError(e);
        }
    }

    const renderForm = (props) => {
        return (
            <div style={props}>
                <h3 className="register_title">
                    LOGIN HERE
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
                    <Button
                        variant="success"
                        className="register_form_box mb-3"
                        block
                        type="submit"
                        bssize="large"
                        disabled={!validateForm()}
                    >
                        Login
                    </Button>
                    <Link to="/signup"><h6>Have not registerd? Register here!</h6></Link>
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
                    {props => renderForm(props)}
                </Spring>
            </div>
        </div>
    );
}

export default Login;