import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forgotPassword } from "../../actions/authActions";
import classnames from "classnames";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
      hostname: window.location.host
    };
    this.props.forgotPassword(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };
  render() {
    const { errors } = this.props;
    const { success } = this.props;
    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/login" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              login
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                Enter your <b>Email</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
            <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
                <span className="red-text">{errors.message}</span>
                <span className="green-text">{success.message}</span>
              </div>
              
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    errors: state.errors,
    success: state.success
});

export default connect(
    mapStateToProps,
    { forgotPassword},
)(ForgotPassword);