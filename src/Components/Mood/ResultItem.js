import React from "react";
import "../../result.css";
import Fade from "react-reveal/Fade";

class ResultItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      isHovering: false,
    };
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  handleClick() {
    this.props.playTrack(this.props.previewURL);
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  render() {
    const {
      type,
      position,
      title,
      subtitle,
      percentage,
      searchTerm,
      image,
      isPlaying,
    } = this.props;

    const resultCoverStyle = image
      ? { backgroundImage: `url(${image})` }
      : { backgroundColor: "black" };

    let trackInfo = (
      <Fade>
          <span className="order-number">{position}</span>
          <div className="result-info">
            <span className="result-summary">
              <span className="result-danceability">{percentage} danceable</span>
              <span className="result-name" alt="View on Spotify">{title}</span>
              <span className="result-artist" alt="View on Spotify">{subtitle}</span>
            </span>
          </div>
      </Fade>
    );

    let playbackBlock = (
      <div className="wrapper-artwork">
        { isPlaying ? (<svg className="icon-pause" onClick={() => this.handleClick()} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11.5" fill="black" stroke="white"/>
        <path d="M11 16.5H8.75V7.5H11V16.5Z" fill="white"/>
        <path d="M15.5 16.5H13.25V7.5H15.5V16.5Z" fill="white"/>
        </svg>) : <span></span> }
        <svg className="icon-play" onClick={() => this.handleClick()} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11.5" fill="black" stroke="white"/>
        <path d="M17 12L9.5 16.3301L9.5 7.66987L17 12Z" fill="white"/>
        </svg>
        <span className="result-cover" style={resultCoverStyle}></span>
      </div>
    );

    let item = {};
        item = (
          <div className="wrapper" id="result-item">
            <div
              className="result-item"
              onMouseEnter={this.handleMouseHover}
              onMouseLeave={this.handleMouseHover}
            >
              <a className="result-track" href={this.props.uri} rel="noopener noreferrer" target="_blank">
                {trackInfo}
              </a>
                {playbackBlock}
            </div>
          </div>
        );

    return item;
  }
}

export default ResultItem;
