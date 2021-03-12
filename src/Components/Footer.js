import React from "react";

export default function Loading() {
  return (
    <footer className="container-fluid mt-2 mb-4">
      <h6>
        Built by{" "}
        <a
          href="http://lizmowforth.com/"
          target="_blank"
        >
          {" "}
          Liz Mowforth 
        </a>
          {" "}using React and the Spotify API.
      </h6>
    </footer>
  );
}
