import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { Spring } from 'react-spring/renderprops';
import { onError } from "../../libs/errorLib";
import { API } from "aws-amplify";
import { s3Upload } from "../../libs/awsLib";
import config from "../../config";
import "./NewVoice.css";

const NewVoice = () => {
    const file = useRef(null);
    const history = useHistory();
    const [content, setContent] = useState("");

    const validateForm = () => {
        return (content.length > 0 && file.current!=null);
    }

    const handleFileChange = (event) => {
        file.current = event.target.files[0];
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
            1000000} MB.`
            );
            return;
        }

        try {
            const attachment = file.current ? await s3Upload(file.current) : null;
            await createVoice({content, attachment});
            history.push('/');
        } catch (e) {
            onError(e);
        }
    }

    const createVoice = (voice) => {
        return API.post("voices", "/voices", {
            body: voice
        });
    }

    return (
        <Spring
            from={{ opacity:0, marginTop: -1000 }}
            to={{ opacity:1, marginTop: 200}}
        >
            {props => (
            <Container style={props} className="NewVoice">
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId="file">
                        <Form.Label>Attachment</Form.Label>
                        <Form.Control onChange={handleFileChange} type="file" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            style={{fontWeight:"bold", fontSize:"20px", color:"green", textAlign:"center"}}
                            placeholder="Title"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        type="submit"
                        size="large"
                        variant="outline-primary"
                        disabled={!validateForm()}
                    >
                        Upload
                    </Button>
                </form>
            </Container>)}
        </Spring>
    );
}

export default NewVoice;