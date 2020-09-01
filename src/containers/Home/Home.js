import React, { useState, useEffect } from 'react';
import { ListGroup, Row, Col, Button, Card, Container, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Spring } from 'react-spring/renderprops';
import { useAppContext } from '../../libs/contextLib';
import { onError } from '../../libs/errorLib';
import { API } from "aws-amplify";
import './Home.css';

const Home = (props) => {
  const [voices, setVoices] = useState([]);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    const onLoad = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const voices = await loadVoices();
        setVoices(voices);
      } catch (e) {
        onError(e);
      }

    }

    onLoad();
  }, [isAuthenticated]);

  const loadVoices = async () => {
    return API.get("voices", "/voices");
  }

  const handleTranscribe = async (voice) => {
    const attachment = voice.attachment;
    console.log(attachment);
    try {
      await loadTranscript({attachment});
      const response = await setIsTranscribed(voice);
      window.location.reload(false);
      return response;
    } catch (e) {
      onError(e);
    }
  }

  const loadTranscript = (attachment) => {
    return API.post("transcripts", "/transcripts", {
      body: attachment
    });
  }

  const setIsTranscribed = (voice) => {
    const content = voice.content;
    const isTranscribed = !voice.isTranscribed;
    const body = {content, isTranscribed};

    console.log(voice.voiceId)

    return API.put("voices", `/voices/${voice.voiceId}`, {
      body: body
    });
  }

  const resultRow = (voice, props) => {
    return (
      <Row style={props} key={voice.voiceId}> 
        <Col lg={9}>
          {voice.isTranscribed
          ? (
            <LinkContainer key={voice.voiceId} to={`/voices/${voice.voiceId}`}>
              <ListGroup.Item className="voice-box">
                {voice.content.trim().split("\n")[0] +" ("+new Date(voice.createdAt).toLocaleString()+")"}
              </ListGroup.Item>
            </LinkContainer>
          ) : (
            <ListGroup.Item key={voice.voiceId} className="voice-box inactive">
              {voice.content.trim().split("\n")[0] +" ("+new Date(voice.createdAt).toLocaleString()+")"}
            </ListGroup.Item>
          )}
        </Col>
        <Col lg={1}/>
        <Col lg={2}>
          {!voice.isTranscribed
          ? (
            <ListGroup.Item className="result-box transcribe" onClick={() => handleTranscribe(voice)}>
              <h4>Transcribe</h4>
            </ListGroup.Item>
          ) : (
            <LinkContainer to={`/voices/${voice.voiceId}`}>
              <ListGroup.Item className="result-box result">
                <h4>Result</h4>
              </ListGroup.Item>
            </LinkContainer>
          )
          }
        </Col>
      </Row>
    );
  }

  const renderVoicesList = (voices) => {
    return [{}].concat(voices).map((voice, i) =>
      i!==0 &&
      <Spring
        from={ i%2===1 ? {opacity:0, marginLeft: -1000} : {opacity:0, marginRight: -1000} }
        to={ i%2===1 ? {opacity:1, marginLeft: 0} : {opacity:1, marginRight: 0} }
        key={voice.voiceId}
      >
        {props => (resultRow(voice, props))}
      </Spring>
    );
  }

  const renderVoices = () => {
    return (
      <Container className='voices'>
        <h2>Your Records</h2>
        <ListGroup>
          <LinkContainer key="new" to="/voices/new">
            <ListGroup.Item className="create-voice-btn">
              <h4><b>{"\uFF0B"}</b> Create a new voice</h4>
            </ListGroup.Item>
          </LinkContainer>
          {renderVoicesList(voices)}
        </ListGroup>
      </Container>
    )
  }

  const [open, set] = useState(false)
  const renderLander = () => {
    return (
      <div className="lander">
        <h2>100% Free</h2>
        <p>A Simple Speech-to-Text App</p>
        <p>Hands-on wtih Amazon Web Services</p>
        <LinkContainer to="/signup">
          <Button variant="outline-success">Transcribe Now!</Button>
        </LinkContainer>
        {open ? (
          <Card as="a" onClick={() => set(open => !open)}className="how-it-works">
            <Card.Body>Click to see how this works</Card.Body>
          </Card>
        ) : (
          <>
            <Card as="a" onClick={() => set(open => !open)}className="how-it-works">
              <Card.Body>Close</Card.Body>
            </Card>
            <Container>
              <Row>
                <Spring
                  from={{ opacity:0, marginLeft: -600 }}
                  to={{ opacity:1, marginLeft: 0}}
                >
                  {props => (
                    <Col lg={6} md={6} sm={6}>
                      <Card style={props} className="how-it-works-info1"><Image alt="main" src="assets/images/main.png"/></Card>
                    </Col>
                  )}
                </Spring>
                <Spring
                  from={{ opacity:0, marginRight: -600 }}
                  to={{ opacity:1, marginRight: 0 }}
                >
                  {props => (
                    <Col lg={6} md={6} sm={6}>
                      <Card style={props} className="how-it-works-info2"><Image alt="voice" src="assets/images/voice.png"/></Card>
                    </Col>
                  )}
                </Spring>
              </Row>
            </Container>
          </>
        )}
        
      </div>
    )
  }

  return (
      <div className="Home">
        { isAuthenticated ? renderVoices() : renderLander() }
      </div>
  );
};

export default Home;
