import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUser } from "../../actions/authActions";
import classnames from "classnames";
import M from  'materialize-css/dist/js/materialize.min.js';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      postcode: "",
      disabled: true,
      errors: {},
    };
  }


  componentDidMount() {
    M.updateTextFields();
    this.setState({
        name: this.props.auth.user.name,
        postcode: this.props.auth.user.postcode
    })
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = {
        name: this.state.name,
        postcode: this.state.postcode
    };
    this.props.updateUser(this.props.auth.user.id, userData);
  };
  render() {
    const { errors } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                Edit <b>Profile</b>
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  placeholder="Name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="name">Name</label>
                <span className="red-text">
                  {errors.name}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.postcode}
                  error={errors.postcode}
                  placeholder="Post Code"
                  id="postcode"
                  type="text"
                  className={classnames("", {
                    invalid: errors.postcode
                  })}
                />
                <label htmlFor="postcode">Post Code</label>
                <span className="red-text">
                  {errors.postcode}
                </span>
                <span className="green-text">
                  {this.props.auth.successMessage}
                </span>
              </div>
              
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                hidden={this.state.saveButton}
                type="submit"
                className="btn btn-large waves-light hoverable blue accent-3"
              >
                Save
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
    updateUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    items: state.items
});

export default connect(
    mapStateToProps,
    { updateUser},
)(Profile);