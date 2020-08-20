import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getItems, setNewItem, deleteItem } from "../../actions/itemActions";
import RemoveItemModal from "../modals/RemoveItemModal";
import CardDashboard from "../layout/CardDashboard";
class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...this.state,
        productName: '',
				productCode: '',
				itemsToDelete: []
		}
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      console.log("Look we reloaded!")
      this.props.getItems(this.props.auth.user.id)
    }, 600000);
  }
  
  componentWillMount() {
    this.props.getItems(this.props.auth.user.id);
  }

  onModalAddItemChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSearchTextChange = e => {
    this.setState({[e.target.id]: e.target.value});
  }

  onModalAddItemSubmit = e => {
      e.preventDefault();
      const itemData = {
        productName: this.state.productName,
        productCode: this.state.productCode
      };
			this.props.setNewItem(this.props.auth.user.id, itemData);
			this.setState({
				...this.state,
				productName : '',
				productCode : ''
			})
	}

	onModalConfirmDelete = (item) => {
    console.log(item);
		this.props.deleteItem(this.props.auth.user.id, [item.productCode]);
		this.setState({
			...this.state,
			itemsToDelete: []
		})
	}

	checkBoxOnClick = data => {
		if(data.isChecked) {
			if(data.productCode === 'all') {
				this.setState({ 
					itemsToDelete: [data.productCode]
				});
			} else {
				this.setState({ 
					itemsToDelete: this.state.itemsToDelete.concat([data.productCode])
				})
			}
		} else {
			this.setState({itemsToDelete: this.state.itemsToDelete.filter(function(item) { 
        return item !== data.productCode;
    })});
		}
  }

  buildSearchResults(items) {
    console.log("buildSearchResults", this.props.items)
    return(
          <>
            {items.items.map((value, index) => {
                return (
                    <div key={value.productCode} className="col s12 m6 l6">
                        <CardDashboard item={value} 
                              stores={this.props.items.items.stores}
                              deleteItem={this.onModalConfirmDelete}
                              />
                    </div>
                )
            })}
        </>
      )
  }
  
  render() {
    const { user } = this.props.auth;
		const { items } = this.props;
    return (
      <div className="container valign-wrapper">
        <div className="row" style={{width:"100%"}}>
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                Welcome to the stock checker app!
              </p>
            </h4>
						<RemoveItemModal modalId={"removeItemModal"} onModalConfirmDelete={this.onModalConfirmDelete} />
            {Object.entries(items.items).length !== 0 ? 
            <div className="row">
                <div className="col s12">
                    <h4>Watched Items</h4>
                </div>
                {this.buildSearchResults(items.items)}
            </div> : null}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  items: state.items
});

export default connect(
  mapStateToProps,
  { getItems, setNewItem, deleteItem }
)(Dashboard);