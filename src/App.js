import React, { Component } from "react";
import Wizard, { STATUS } from "./components/Wizard/Wizard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getAppointment, getParticipant } from "./services/fhir";
import { SECRET_IDENTIFIER } from "./constants";

const initialState = {
  status: STATUS.CHECK_IN,
  isLoading: false,
  appointment: null,
  participant: []
};

class App extends Component {
  state = initialState;

  handleCheckIn = async patientIdentifier => {
    this.setState({ isLoading: true });

    const appointment =
      patientIdentifier === SECRET_IDENTIFIER
        ? await getAppointment(patientIdentifier)
        : null;
    const participant = await getParticipant(appointment);
    this.setState({
      status: appointment ? STATUS.CHECKED_IN : STATUS.APPOINTMENT_NOT_FOUND,
      appointment,
      participant,
      isLoading: false
    });
  };

  handleShowMap = () => {
    this.setState({ status: STATUS.CHECKED_IN_MAP });
  };

  handleCloseMap = () => {
    this.setState({ status: STATUS.CHECKED_IN });
  };

  reset = () => {
    this.setState(initialState);
  };

  render() {
    return (
      <div className="App cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Header />
        <div className="cover">
          <Wizard
            className="lead"
            {...this.state}
            onCheckIn={this.handleCheckIn}
            onClose={this.reset}
            onShowMap={this.handleShowMap}
            onCloseMap={this.handleCloseMap}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
