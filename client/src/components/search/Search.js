import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getItems, setNewItem } from "../../actions/itemActions";
import { getArgosSearch } from "../../actions/argosActions"
import Card from "../layout/Card";
import Spinner from "../random/Spinner"
import InfiniteScroll from 'react-infinite-scroll-component';
class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...this.state,
        search: '',
        textError: false,
        hasMore: false,
        pageNo: 2,
        items: []
    }
    this.watchItem = this.watchItem.bind(this);
    this.fetchMoreData = this.fetchMoreData.bind(this)
    this.onSearchButtonClick = this.onSearchButtonClick.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    if(Object.entries(props.searchResults.searchResults).length !== 0) {
      console.log("in here")
      console.log("state", state, "props", props)
      if(!props.searchResults.searchResults.data.some(r=> state.items.includes(r))) {
        var totalPages = props.searchResults.searchResults.pageData.totalPages
        console.log("pageSize", props.searchResults.searchResults.pageData.currentPage <= totalPages+1);
        if(props.searchResults.searchResults.pageData.currentPage <= totalPages+1) {
          console.log("I should be set")
          return {
            ...state,
            pageNo: props.searchResults.searchResults.pageData.currentPage++,
            hello: "Joel",
            items: state.items.concat(props.searchResults.searchResults.data),
            hasMore: props.searchResults.searchResults.pageData.currentPage <= totalPages+1
          }
        }
      } else {
        return {
          ...state,
          hasMore: false
        }
      }
    }
    return null
  }
  
  componentDidMount() {
    this.props.getItems(this.props.auth.user.id);
  }

  onSearchTextChange = e => {
    this.setState({search: e.target.value});
    if(e.target.value === '') {
        this.setState({textError: false})
    }
  }

  onSearchButtonClick(e) {
    e.preventDefault()
    console.log("searchText", this.state.search)
    var pageNo = this.state.pageNo
    this.setState({
      items: []
    });
    if(this.state.search !== '') {
      this.props.getArgosSearch(this.state.search, 1)
    } else {
        this.setState({textError: true})
    }
    
  }

  watchItem(currentItem) {
      this.props.setNewItem(this.props.auth.user.id, currentItem)
  }

  fetchMoreData = () => {
        console.log(this.state.pageNo);
        this.props.getArgosSearch(this.state.search, this.state.pageNo)
  }

  buildSearchResults(searchResults) {
      return(
          <InfiniteScroll
            dataLength={this.state.items.length} //This is important field to render the next data
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={<div className="center align"><Spinner /></div>}
            style={{overflow: "unset"}}>
            {this.state.items.map((value, index) => {
              return (
                  <div key={value.id} className="col s6 m4 l4">
                      <Card   item={value} 
                              watchedItems={this.props.items.items} 
                              onClick={this.watchItem}/>
                  </div>
              )
          })}
          </InfiniteScroll>
      )
  }

  addPageNumber(pageData) {
    const items = []
    for(var i = 0; i < pageData.totalPages; i++) { 
      var page = i+1;
      items.push(<li key={"page"+page} className={pageData.currentPage === page ? "active" : "waves-light"}><a href="#" onClick={this.fetchMoreData.bind(this, page)}>{page}</a></li>)
    }
    return items;
  }

  buildPagination(pageData) {
    console.log(pageData)
    if(pageData.totalPages > 1) {
      return (
        <ul className="pagination center-align">
          <li className={pageData.currentPage === 1 ? "disabled" : ""}><a href="#" onClick={this.fetchMoreData.bind(this, (pageData.currentPage-1))}><i className="material-icons">chevron_left</i></a></li>
          {this.addPageNumber(pageData)}
          <li className={pageData.currentPage === pageData.totalPages ? "disabled" : ""}><a href="#" onClick={this.fetchMoreData.bind(this, (pageData.currentPage+1))}><i className="material-icons">chevron_right</i></a></li>
      </ul>
      )
    }
  }
  
  render() {
    const { searchResults } = this.props;
    console.log("re-rendered")
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
                <a className="waves-light btn center" onClick={this.onSearchButtonClick}>Search</a>
              </div>
			      </div>
            {searchResults.loadingItems ?  
              <Spinner />
            : null}
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