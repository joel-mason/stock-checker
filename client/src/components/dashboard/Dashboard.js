import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getItems, setNewItem, deleteItem } from "../../actions/itemActions";
import StockTable from "../tables/StockTable"
import AddItemModal from "../modals/AddItemModal"
import RemoveItemModal from "../modals/RemoveItemModal";
class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...this.state,
        productName: '',
				productCode: '',
				itemsToDelete: []
		}
		this.deleteCompaniesButton = React.createRef();
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

	onModalConfirmDelete = e => {
		this.props.deleteItem(this.props.auth.user.id, this.state.itemsToDelete);
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
						<div className="col s4">
							<a className="waves-effect waves-light btn modal-trigger center" href="#addItemModal">Add Item</a>
						</div>
            <div className="col s4">
							<a ref={this.deleteCompaniesButton} className="waves-effect waves-light btn modal-trigger center" href="#removeItemModal" disabled={this.state.itemsToDelete.length === 0}>Remove Item(s)</a>
						</div>
						<RemoveItemModal modalId={"removeItemModal"} onModalConfirmDelete={this.onModalConfirmDelete} />
            <AddItemModal modalId={"addItemModal"}  onChange={this.onModalAddItemChange} onSubmit={this.onModalAddItemSubmit}/>
            <StockTable tableItems={items} onClickHandler={this.checkBoxOnClick}/>
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