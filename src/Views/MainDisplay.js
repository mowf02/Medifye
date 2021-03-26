import React from "react";
import Container from "react-bootstrap/Container";
import Dashboard from "../Components/Mood/Dashboard";
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
  loadDashboard() {
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
          <Dashboard
            token={this.props.token}
            load={() => this.loadDashboard()}
            handleTimeout={() => this.props.handleTimeout()}
          />
          <Footer />
        </Container>
      </React.Fragment>
    );
  }
}

export default MainDisplay;
