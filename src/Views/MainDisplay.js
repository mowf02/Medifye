import React from "react";
import Container from "react-bootstrap/Container";
import MoodDashboard from "../Components/Mood/MoodDashboard";
import Loading from "../Components/Loading";
import Footer from "../Components/Footer";

class MainDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      childComponentIsLoading: true,
    };
  }

  /**
   * Updates the loading status of the component based on loading status of child components
   */
  updateLoadingStatus() {
    if (
      !this.state.childComponentIsLoading
    ) {
      this.setState({
        isLoading: false,
      });
    }
  }

  /**
   * Updates the loading status of the mood dashboard in the state
   */
  loadMoodDashboard() {
    this.setState({
      childComponentIsLoading: false,
    });
    this.updateLoadingStatus();
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && <Loading />}
        <Container fluid="lg">
          <MoodDashboard
            token={this.props.token}
            load={() => this.loadMoodDashboard()}
            handleTimeout={() => this.props.handleTimeout()}
          />
          <Footer />
        </Container>
      </React.Fragment>
    );
  }
}

export default MainDisplay;
