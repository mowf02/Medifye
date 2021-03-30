import React from "react";
import SubmitButton from "../Components/SubmitButton";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Fade from "react-reveal/Fade";
import HeaderSmall from "../Assets/header-small.png";
import HeaderLarge from "../Assets/header-large.png";

function Login(props) {
  if (props.isLoggedIn) {
    return null;
  }
  return (
    <Container>
      <Col className="d-flex align-items-center flex-column login justify-content-center login">
        <Fade duration={2000}>
          <picture>
            <source srcSet={`${HeaderSmall} 1x`} media="(max-width: 768px)" />
            <img
              className="login-img"
              srcSet={`${HeaderLarge} 2x`}
              alt="Full Logo" />
          </picture>
          <Fade delay={1000}>
            <SubmitButton
              isLoggedIn={props.isLoggedIn}
              handleLogin={() => props.handleLogin()}
            />
          </Fade>
        </Fade>
      </Col>
    </Container>
  );
}

export default Login;
