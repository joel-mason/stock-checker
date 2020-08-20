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
      <>
      <div className="navbar">
        <nav className="z-depth-0">
          <a href="#" data-target="slide-out" className="sidenav-trigger show-on-small hide-on-med-and-up black-text"><i className="material-icons">menu</i></a>
          <div className="nav-wrapper white">
            <Link to="/" style={{ fontFamily: "monospace" }} className="brand-logo right black-text">
                STOCK CHECKER
            </Link>
            {this.props.auth.isAuthenticated ?
            <ul id="nav-mobile" className="left hide-on-small-only">  
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
          <ul id="slide-out" className="sidenav">
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
        </nav>
      </div>
      </>
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
