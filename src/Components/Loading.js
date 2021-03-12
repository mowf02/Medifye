import React from "react";
import loader from "../Assets/loader.gif";
import Fade from "react-reveal/Fade";

export default function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade>
        <img
          src={loader}
          style={{ maxHeight: "40vh", maxWidth: "80vw" }}
          alt="loading animation"
        />
        <span>https://giphy.com/kiszkiloszki</span>
        <h1>Getting ready to Meddy...</h1>
      </Fade>
    </div>
  );
}
