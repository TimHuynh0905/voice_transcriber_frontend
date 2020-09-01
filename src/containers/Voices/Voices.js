import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { Spring } from 'react-spring/renderprops';
import { API, Storage } from 'aws-amplify';
import { onError } from '../../libs/errorLib';
import './Voices.css';

const Voices = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const [voice, setVoice] = useState(null);
    const [content, setContent] = useState("");
    const [transcript, setTranscript] = useState("Job is still in progress! Please check back shortly, thank you!");

    useEffect(() => {
        const loadVoice = () => {
            return API.get("voices", `/voices/${id}`);
        }

        const onLoad = async () => {
            try {
                const voice = await loadVoice();
                const {content, attachment} = voice;
                if (attachment) {
                    // console.log(attachment)
                    voice.attachmentURL = Storage.vault.get(attachment);
                    // console.log(voice.attachmentURL)

                }

                setContent(content);
                setVoice(voice);

                try {
                    const transcript = await getTranscript(attachment);
                    setTranscript(transcript);
                } catch (e) {
                    console.log(e);
                }

            } catch (e) {
                onError(e)
            }
        }

        onLoad();
    }, [id]);

    const validateForm = () => {
        return content.length > 0;
    }

    const formatFilename = (str) => {
        return str.replace(/^\w+-/, "");
    }

    const getTranscript = (key) => {
        return API.get("transcripts", `/transcripts/${key}`);
    }

    const saveNote = (note) => {
        return API.put("voices", `/voices/${id}`, {
            body: note
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await saveNote({
                content,
                isTranscribed: voice.isTranscribed
            });
            history.push("/");
        } catch (e) {
            onError(e);
        }
    }

    const deleteNote = () => {
        return API.del("voices", `/voices/${id}`);
    }

    const handleDelete = async (event) => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Click 'OK' to confirm this delete request!"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteNote();
            history.push("/");
        } catch (e) {
            onError(e);
        }
    }

    const handleBack = async (event) => {
        event.preventDefault();

        try {
            history.push("/");
        } catch (e) {
            onError(e);
        }
    }

    return (
        <Spring
            from={{ opacity:0, marginTop: -1000 }}
            to={{ opacity:1, marginTop: 100}}
        >
            {props => (
            <Container style={props} className="Voices">
                {voice && (
                    <form onSubmit={handleSubmit}>
                        <Form.Group controlId="content" className="title">
                            <Form.Control
                                style={{fontWeight:"bold", fontSize:"20px", color:"green", textAlign:"center"}}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="content">
                            <Form.Control
                                value={transcript}
                                as="textarea"
                                readOnly
                            />
                        </Form.Group>
                        {voice.attachment && (
                            <Form.Group>
                                <Form.Label>Attachment:</Form.Label>{formatFilename(voice.attachment)}
                            </Form.Group>
                        )}
                        <Button size="large" variant="outline-primary" onClick={handleBack}>
                            Voice Lists
                        </Button>
                        <Button size="large" variant="outline-success" onClick={handleSubmit} disabled={!validateForm()}>
                            Save
                        </Button>
                        <Button size="large" variant="outline-danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </form>
                )}
            </Container>)}
        </Spring>
    );
}

export default Voices;
