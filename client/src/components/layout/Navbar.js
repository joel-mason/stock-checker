import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    console.log(this.props.auth.isAuthenticated)
    return (
      <div className="navbar">
        <nav className="z-depth-0">
          <div className="nav-wrapper white">
            <Link to="/" style={{ fontFamily: "monospace" }} className="brand-logo left black-text">
                STOCK CHECKER
            </Link>
            {this.props.auth.isAuthenticated ?
            <ul id="nav-mobile" className="right hide-on-sm-and-down">  
              <li>
                  <Link
                    to="/dashboard"
                    style={{
                      fontFamily: "monospace"
                    }}
                    className="black-text"
                  >
                    Dashboard
                  </Link>
                </li>         
              <li>
                  <Link
                    to="/search"
                    style={{
                      fontFamily: "monospace"
                    }}
                    className="black-text"
                  >
                    Search Items
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    style={{
                      fontFamily: "monospace"
                    }}
                    className="black-text"
                    onClick={this.onLogoutClick}
                  >
                    LOGOUT
                  </Link>
              </li>
            </ul>
            : null}
          </div>
        </nav>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
