import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetPasswordWithEmail, resetPage } from "../../actions/authActions";
import classnames from "classnames";
import CircularProgress from '@material-ui/core/CircularProgress';

class Reset extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password2: "",
      errors: {},
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    console.log(this.props.match.params.token)
    this.props.resetPage(this.props.match.params.token)
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      email: this.props.auth.email.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.resetPasswordWithEmail(newUser, this.props.history); 
  };

  render() {
    const { errors } = this.props;
    const { successMessage } = this.props.auth
  return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/login" className="btn-flat">
              <i className="material-icons left">keyboard_backspace</i> Back to
              Login
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Reset</b> password
              </h4>
            </div>
            {this.props.auth.loading ? 
            <div className="col s12">
              <CircularProgress /> 
            </div>:
            errors.invalid ? <p className="red-text">{errors.invalid}</p> :
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">{errors.password}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password" 
                  autoComplete="new-password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <label htmlFor="password2">Confirm Password</label>
                <span className="red-text">{errors.password2}</span>
                <span className="red-text">{errors.message}</span>
                <span className="green-text">{successMessage}</span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              {successMessage ? null : 
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
                Reset Password
              </button>
            </div>
              }
              </div>
            </form>}
          </div>
        </div>
      </div>
    );
  }
}

Reset.propTypes = {
    errors: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(
    mapStateToProps,
    { resetPasswordWithEmail, resetPage }
  )(withRouter(Reset));