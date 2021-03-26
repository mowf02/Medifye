import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Fade from "react-reveal/Fade";
import BSFade from "react-bootstrap/Fade";
import HeaderSmall from "../../Assets/header-small.png";
import HeaderLarge from "../../Assets/header-large.png";

import ResultItem from "./ResultItem";

import Api from "../../Api";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonCopy: "Get Meddy With It",
      currentlyPlaying: "",
      finalPercentages: [],
      index: 0,
      isLoading: true,
      label: "Enter a song URI to start getting Meddy with it:",
      moreDanceableRecommendations: [],
      recommendationsPresent: false,
      resultsTableHeading: "",
      seed_artists: "3faEZMpTmZFXpELU1EwWNL",
      seed_genres: "renaissance%2C%20medieval%2C%20baroque",
      seed_tracks: "5zBEauh8r5N1nroTKIBtdH",
      showValidation: "",
      targetTrackDanceability: "",
      userInput: [],
      userTrack: {},
      userTrackDanceability: "",
    };
    this.getTrackFeatures = this.getTrackFeatures.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.resetMedifyer = this.resetMedifyer.bind(this);
    this.showNextRecommendation = this.showNextRecommendation.bind(this);
    this.showValidationError = this.showValidationError.bind(this);
  }

  async getTrackFeatures(event) {
    event.preventDefault();

    let audioFeaturesEndpoint = "https://api.spotify.com/v1/audio-features";
    let getTrackEndpoint = "https://api.spotify.com/v1/tracks/";
    let recommendationsEndpoint = "https://api.spotify.com/v1/recommendations";

    let seed_artists = this.state.seed_artists;
    let seed_genres = this.state.seed_genres;
    let seed_tracks = this.state.seed_tracks;

    let re = /[\w\:]*\:(\w+)/;
    let userInput = this.state.userInput;

    if (re.test(userInput) && userInput.length>1) {//if it's an existing and valid user input, go ahead and get audio features.
      this.setState({
        userInput: this.state.userInput,
      });

      let userInput = this.state.userInput.match(/[\w\:]*\:(\w+)/)[1];

      this.setState({
        moreDanceableRecommendations: [], //i think grouping this with other set states means that if you put in something that has no results first, it returns nothing/doesn't make the api call yet.
        showValidation: "",
      });

      let userTrack = await axios.get(`${getTrackEndpoint}${userInput}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      });

      this.setState({
        userTrack: userTrack,
      });

      let res = await axios.get(`${audioFeaturesEndpoint}?ids=${userInput}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      });

      let danceabilityScore = res.data.audio_features[0].danceability;
      let targetDanceability = danceabilityScore + .05;

      this.setState({
        userTrackDanceability: ((danceabilityScore) * 100).toFixed() + '%',
      });

      let response = await axios.get(`${recommendationsEndpoint}?seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}&min_danceability=${danceabilityScore}&target_danceability=${targetDanceability}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      });

      let tracksHavePreviewURL = [];

      response.data.tracks.forEach((track) => {
        if (track.preview_url) {
          tracksHavePreviewURL.push(track);
        }
      }); // only tracks which have a previewURL get pushed

      if (tracksHavePreviewURL && tracksHavePreviewURL.length > 1) {//if that uri does return some recommendations
        this.setState({
          moreDanceableRecommendations: tracksHavePreviewURL,
        }); // set the recommendations state

        let resultTrackID = [];

        this.state.moreDanceableRecommendations.forEach((track) => {
          resultTrackID.push(track.id);
        }); // set the recommendations percentages

        let resultsDanceability = await axios.get(audioFeaturesEndpoint, {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
          params: {
            ids: resultTrackID.join(),
          },
        });

        let resultDanceabilityPercentages = [];

        resultsDanceability.data.audio_features.forEach((result) => {
          resultDanceabilityPercentages.push((result.danceability * 100).toFixed() + '%');
        });

        this.setState({
          finalPercentages: resultDanceabilityPercentages,
          resultsTableHeading: "Your medieval equivalent:",
          userInput: [],
          buttonCopy: "Try another track URI",
          recommendationsPresent: true,
          showValidation: "",
        });
      } else { //if the uri doesn't return any recommendations, just show arbitrary ones
        let alternativeRecommendations = await axios.get(`${recommendationsEndpoint}?seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}&min_danceability=0.65`, {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
        });

        let resultTrackID = [];

        alternativeRecommendations.data.tracks.forEach((track) => {
          resultTrackID.push(track.id);
        }); // set the recommendations percentages

        let resultsDanceability = await axios.get(audioFeaturesEndpoint, {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
          params: {
            ids: resultTrackID.join(),
          },
        });

        let resultDanceabilityPercentages = [];

        resultsDanceability.data.audio_features.forEach((result) => {
          resultDanceabilityPercentages.push((result.danceability * 100).toFixed() + '%');
        });

        this.setState({
          finalPercentages: resultDanceabilityPercentages,
          moreDanceableRecommendations: alternativeRecommendations.data.tracks,
          resultsTableHeading: "OK, this is embarrassing, but it seems you’ve found the limits of medieval-ness. Here are some things which are kinda close:",
          userInput: [],
          buttonCopy: "Try another track URI",
          recommendationsPresent: true,
          showValidation: "",
        });
      }
    } else if (this.state.moreDanceableRecommendations.length>1) {
      //assume user is trying a new track.
      this.resetMedifyer();
    } else if ((!re.test(userInput))) {
      //and then if that doesn't match the reg ex, exit out with a validation error.
      this.showValidationError();
    }
  }

  handleChange(event) {
    this.setState({
      userInput: event.target.value,
    });
  }

  showValidationError() {
    this.setState({
      userInput: [],
      showValidation: "That doesn't seem to be a valid track URI.",
      moreDanceableRecommendations: [],
      userTrack: {},
      userTrackDanceability: "",
      recommendationsPresent: false,
      buttonCopy: "Try another track URI",
    });
  }

  showNextRecommendation() {
    let looper = ++this.state.index % this.state.moreDanceableRecommendations.length;
    this.setState({
      index: looper
    });

    if (document.getElementById("player")) {
      let audioPlayer = document.getElementById("player");
      this.playTrack(audioPlayer);
    }
  }

  resetMedifyer() {
    this.setState({
      userInput: [],
      showValidation: "",
      moreDanceableRecommendations: [],
      userTrack: {},
      userTrackDanceability: "",
      recommendationsPresent: false,
      buttonCopy: "Get Meddy With It",
    });

    if (document.getElementById("player")) {
      let audioPlayer = document.getElementById("player");
      this.playTrack(audioPlayer);
    }
  }

  playTrack(previewURL) {
    let activeTrack = document.getElementById("player");

    if (!activeTrack) {
      activeTrack = new Audio(previewURL);
      activeTrack.setAttribute("id", "player");
      activeTrack.onended = () => this.setState({ currentlyPlaying: "", });

      activeTrack.volume = 1;
      document.getElementById("result-item").append(activeTrack);
      activeTrack.play();
      this.setState({ currentlyPlaying: previewURL, });
    } else {
      if (activeTrack.paused) {
        activeTrack.play();
        this.setState({ currentlyPlaying: previewURL, });
      } else {
        activeTrack.pause();
        this.setState({ currentlyPlaying: "", });
      }
      if (activeTrack.src !== previewURL) {
        activeTrack.currentTime = 0;
        activeTrack.src = previewURL;
        activeTrack.play();
        this.setState({ currentlyPlaying: previewURL, });
      }
    }
  }



  async componentDidMount() {
    try {
      const API = new Api(this.props.token);
      let requestFeatures = [
        "acousticness",
        "danceability",
        "energy",
        "instrumentalness",
        "liveness",
        "speechiness",
        "valence",
        "popularity",
      ];

////DELETING THIS PROMTS WHOLE APP TO NOT LOAD
      // const recentTracks = await API.getRecentTracks();
      const recentTracksFeatures = await API.getTrackFeatures(
        requestFeatures
      );

      this.setState({
        isLoading: false,
      });

      this.props.load();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401)
        this.props.handleTimeout();
    }
    this.uriInput.focus();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const showResults = this.state.moreDanceableRecommendations && this.state.moreDanceableRecommendations.length > 0;
    const showError = this.state.showValidation;
    const startingTrack = ((this.state.userTrack.data || {}) || {});
    const showInput = this.state.recommendationsPresent;
    let results;
    let recommendations = ((this.state.moreDanceableRecommendations || {}) || {});
    const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('do validate')
    }
  }

    results =
    recommendations.map((track, index) => (
        <ResultItem
          type="result-track"
          key={index.id}
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
          percentage={this.state.finalPercentages[index]}
        />
    )
  );


    return this.state.isLoading ? null : (
      <div>
        <Container fluid className={"mb-4 mt-2 header"}>
        <picture>
          <source srcSet={`${HeaderSmall} 1x`} media="(max-width: 768px)" />
          <img
            className="logo"
            srcSet={`${HeaderLarge} 2x`}
            alt="Full Logo" />
        </picture>
        </Container>
        <Container fluid className={"mb-4 mt-2"}>
          <p>Give <i>Medifye</i> any track on Spotify, and it will recommend a medieval* equivalent which is more danceable. Even if your favourite tune is <i>Sandstorm</i> by Darude.</p>
        </Container>
        <div className="container-fluid container-flex">
          <div className="container-left">
            {showInput ? <div>You've Medifyed this track:</div> : <span></span>}
            <form onSubmit={this.getTrackFeatures} name="uriForm" id="URI">
              { showInput ? <div className="test"></div> :
              <div className="inputDiv">
                <label>Enter a Spotify track URI:</label>
                <input type="text" className="uriInput" name="uriInput" value={this.state.userInput} onChange={event => this.handleChange(event)} ref={(input) => { this.uriInput = input; }} onKeyDown={handleKeyDown}/>
                <div className="validation">{this.state.showValidation}</div>
                <input type="submit" className="button-primary" value={this.state.buttonCopy} />
              </div> }
            </form>
            { showInput ? <div></div> : <div className="helper">You can copy a track URI by right-clicking any track and tapping "share"</div>}
            { this.state.userTrack.data ? <ResultItem
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
              percentage={this.state.userTrackDanceability}
            /> : <div></div> }
          </div>
          <div className="container-right">
            {showInput ? <div>{this.state.resultsTableHeading}</div> : <div></div>}
            {results[this.state.index]}
            {showInput ? <form name="resetForm">
              <input type="submit" onClick={this.showNextRecommendation} className="button-primary" value="Show me another medieval track" />
              <input type="submit" onClick={this.resetMedifyer} className="button-secondary" value="Start again" />
            </form> : <div></div> }
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
