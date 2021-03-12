import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Fade from "react-reveal/Fade";
import BSFade from "react-bootstrap/Fade";
import header from "../../Assets/header.png";

import ResultTable from "./ResultTable";
import ResultItem from "./ResultItem";

import Api from "../../Api";

class MoodDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userInput: [],
      userTrack: {},
      finalPercentages: [],
      userTrackDanceability: "",
      targetTrackDanceability: "",
      showValidation: "",
      resultsTableHeading: "",
      buttonCopy: "Find my track",
      recommendationsPresent: false,
      seed_artists: "3faEZMpTmZFXpELU1EwWNL",
      seed_genres: "renaissance%2C%20medieval%2C%20baroque",
      seed_tracks: "5zBEauh8r5N1nroTKIBtdH",
      label: "Enter a song URI to start getting Meddy with it:",
      moreDanceableRecommendations: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.getTrackFeatures = this.getTrackFeatures.bind(this);
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

    if (re.test(userInput)) {
      this.setState({
        userInput: this.state.userInput,
      });

      let userInput = this.state.userInput.match(/[\w\:]*\:(\w+)/)[1];

      this.setState({
        moreDanceableRecommendations: [], //i think grouping this with other set states means that if you put in something that has no results first, it returns nothing/doesn't make the api call yet.
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
        showValidation: false,
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
          resultsTableHeading: "Lo! A selection of medieval bangers with with an equal or higher danceability score:",
          userInput: [],
          buttonCopy: "Try another track URI",
          recommendationsPresent: true,
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
        });
      }
    } else { //and then if that doesn't match the reg ex, exit out
      this.setState({
        userInput: [],
        showValidation: true,
        moreDanceableRecommendations: [],
        userTrack: {},
        userTrackDanceability: "",
        recommendationsPresent: false,
      });
    }
  }

  handleChange(event) {
    this.setState({
      userInput: event.target.value,
    });
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
    const startingTrack = this.state.userTrack.length > 1;
    const showInput = this.state.recommendationsPresent;
    
    return this.state.isLoading ? null : (
      <div>
        <Container fluid className={"mb-4 mt-2 header"}>
        <img
          src={header}
          style={{ maxWidth: "80vw" }}
          alt="Medifye"
        />
        </Container>
        <Container fluid className={"mb-4 mt-2"}>
          <p><i>Medifye</i> takes any dance-worthy hit on Spotify and recommends medieval* equivalents which are more danceable. Even if it’s <i>Sandstorm</i> by Darude.</p>
        </Container>
        <div className="container-fluid container-flex">
          <div className="container-left">
            <form onSubmit={this.getTrackFeatures} name="uriForm" id="URI">
              { showInput ? <div className="test">uh-oh</div> : <div className="inputDiv">
                <label>Enter a Spotify track URI:</label>
                <input type="text" className="uriInput" name="uriInput" value={this.state.userInput} onChange={event => this.handleChange(event)} ref={(input) => { this.uriInput = input; }} />
                <div className="validation">You can copy a track URI by right-clicking any track and tapping "share"</div>
              </div> }
              <input type="submit" className="button" value={this.state.buttonCopy} />
              {showError ? <div>That doesn't seem to be a valid URI.</div> : <div></div>}
            </form>
          </div>
          <div className="container-right">
            <ResultTable
              data={this.state.moreDanceableRecommendations}
              percentage={this.state.finalPercentages}
              startingTrack={this.state.userTrack}
              startingPercetage={this.state.userTrackDanceability}
              heading={this.state.resultsTableHeading}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MoodDashboard;
