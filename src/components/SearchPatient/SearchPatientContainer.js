import React from "react";
import { connect } from "react-redux";
import SearchPatient from "./SearchPatient";
import { onSearch } from "../../redux/actions/searchPatientIdActions";
import getNestedObject from "../../utils/getNestedObject";

const mapStateToProps = state => ({
  patientId: getNestedObject(state, "patientDetail.patientData.patient.id"),
  patientName: getNestedObject(state, "patientDetail.patientData.patient.name"),
  success: state.patientDetail.success,
  loading: state.patientDetail.loading,
  error: state.patientDetail.error,
  serverError: state.patientDetail.serverError
});

const mapDispatchToProps = {
  onSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPatient);
