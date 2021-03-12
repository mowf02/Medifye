import React from "react";
import SubmitButton from "../Components/SubmitButton";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Fade from "react-reveal/Fade";

function Login(props) {
  if (props.isLoggedIn) {
    return null;
  }
  return (
    <Container>
      <Col className="d-flex align-items-center flex-column login justify-content-center login">
        <Fade duration={2000}>
          <header> Medify </header>
          <Fade delay={1000}>
            <SubmitButton
              isLoggedIn={props.isLoggedIn}
              handleLogin={() => props.handleLogin()}
            />
          </Fade>

          <h4 className="mt-5">Get more danceable, more medieval recommendations.</h4>
          <h6 className="mt-5">
            {" "}
            Created by{" "}
            <a
              href="http://lizmowforth.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Liz Mowforth{" "}
            </a>{" "}
          </h6>
          <Fade delay={2000}>
            <h6>
              Powered by{" "}
              <a
                href="https://developer.spotify.com/documentation/web-api/"
                target="_blank "
                rel="noopener noreferrer"
              >
                {" "}
                Spotify's API.{" "}
              </a>{" "}
            </h6>
          </Fade>
        </Fade>
      </Col>
    </Container>
  );
}

export default Login;
