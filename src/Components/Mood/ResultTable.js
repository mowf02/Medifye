import React from "react";
import ResultItem from "./ResultItem";

class ResultTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyPlaying: "",
    };
    this.playTrack = this.playTrack.bind(this);
  }
  playTrack(previewURL) {
    let activeTrack = document.getElementById("player");
    if (!activeTrack) {
      console.log("no active track");
      activeTrack = new Audio(previewURL);
      activeTrack.setAttribute("id", "player");
      activeTrack.onended = () => this.setState({ currentlyPlaying: "" });

      activeTrack.volume = 0.3;
      document.getElementById("result-table").append(activeTrack);
      activeTrack.play();
      this.setState({ currentlyPlaying: previewURL });
    } else {
      console.log("active track");
      if (activeTrack.paused) {
        activeTrack.play();
        this.setState({ currentlyPlaying: previewURL });
      } else {
        activeTrack.pause();
        this.setState({ currentlyPlaying: "" });
      }
      if (activeTrack.src !== previewURL) {
        console.log(activeTrack.src);
        activeTrack.currentTime = 0;
        activeTrack.src = previewURL;
        activeTrack.play();
        this.setState({ currentlyPlaying: previewURL });
      }
    }
  }

  render() {
    let results;
    let testBLOCK;
    let startingTrack = ((this.props.startingTrack.data || {}) || {});
    let artist = startingTrack.artists;

    results =
    this.props.data.map((track, index) => (
        <ResultItem
          type="track"
          position={index + 1}
          key={track.id}
          title={track.name}
          subtitle={track.artists[0].name}
          image={
            track.album.images[0] === undefined
              ? null
              : track.album.images[0].url
          }
          previewURL={track.preview_url}
          uri={track.external_urls.spotify}
          playTrack={this.playTrack}
          isPlaying={this.state.currentlyPlaying === track.preview_url}
          percentage={this.props.percentage[index]}
        />
    ));

    testBLOCK = this.props.startingTrack.data;

    return (
      <div id="result-table">
        {testBLOCK ? (<div><div>Your starting track is {this.props.startingPercetage} danceable:</div><ResultItem
          type="track"
          key={startingTrack.id}
          title={startingTrack.name}
          subtitle={startingTrack.artists[0].name}
          image={
            startingTrack.album.images[0] === undefined
              ? null
              : startingTrack.album.images[0].url
          }
          previewURL={startingTrack.preview_url}
          uri={startingTrack.external_urls.spotify}
          playTrack={this.playTrack}
          isPlaying={this.state.currentlyPlaying === startingTrack.preview_url}
          percentage={this.props.startingPercetage}
        /></div>) : ''}
        {testBLOCK ? (
          this.props.heading
        ) : (
          ''
        )}
        {results ? (
          <div>
            {results}
          </div>
        ) : (
          ''
        )}
        {this.data ? (
          <h3 className="no-results" style={{ alignSelf: "center" }}>
            No Results
          </h3>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default ResultTable;
