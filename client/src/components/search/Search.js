import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getItems, setNewItem } from "../../actions/itemActions";
import { getArgosSearch } from "../../actions/argosActions"
import Card from "../layout/Card";
import InfiniteScroll from "react-infinite-scroll-component";
class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...this.state,
        search: '',
        textError: false,
        pageNo: 1
    }
    this.watchItem = this.watchItem.bind(this);
    this.fetchMoreData = this.fetchMoreData.bind(this)
  }
  
  componentWillMount() {
    this.props.getItems(this.props.auth.user.id);
  }

  onSearchTextChange = e => {
    this.setState({search: e.target.value});
    if(e.target.value === '') {
        this.setState({textError: false})
    }
  }

  onSearchButtonClick = async e => {
    e.preventDefault()
    if(this.state.search !== '') {
        await this.props.getArgosSearch(this.state.search, 1)
    } else {
        this.setState({textError: true})
    }
    
  }

  watchItem(currentItem) {
      console.log("currentItem", currentItem);
      this.props.setNewItem(this.props.auth.user.id, currentItem)
  }

  async fetchMoreData() {
    this.setState({
        pageNo: this.state.pageNo++
    }, () => 
        this.props.getArgosSearch(this.state.search, this.state.pageNo)
    );
  }

  buildSearchResults(searchResults) {
      console.log(searchResults)
      return(
          <>
            {searchResults.data.map((value, index) => {
                return (
                    <div key={value.id} className="col s6 m4 l4">
                        <Card   item={value} 
                                watchedItems={this.props.items.items} 
                                onClick={this.watchItem}/>
                    </div>
                )
            })}
            </>
      )
  }
  
  render() {
    const { searchResults } = this.props;
    console.log(searchResults.searchResults)
    return (
      <div className="container">
        <div className="row" style={{width:"100%"}}>
          <div className="col s12 center-align">
            <h4>
              <b>Search</b>
              <p className="flow-text grey-text text-darken-1">
                Start by searching for an item!
              </p>
            </h4>
			<div className="col s12">
              <div className="col s12 m10">
                <input id="search" type="text" onChange={this.onSearchTextChange} required></input>
              </div>
              <div className="col s12 m2">
                <a className="waves-effect waves-light btn center" onClick={this.onSearchButtonClick}>Search</a>
              </div>
			</div>
          </div>
        </div>
        {Object.entries(searchResults.searchResults).length !== 0 ? 
        <div className="row">
            <div className="col s12">
                <h4 className="center-align">Search Results</h4>
            </div>
            {this.buildSearchResults(searchResults.searchResults)}
        </div> : null}
      </div>
    );
  }
}

Search.propTypes = {
  auth: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired,
  searchResults: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  items: state.items,
  searchResults: state.searchResults
});

export default connect(
  mapStateToProps,
  { getItems, setNewItem, getArgosSearch }
)(Search);