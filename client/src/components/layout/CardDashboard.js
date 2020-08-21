import React, { Component } from "react";
import "materialize-css/dist/css/materialize.min.css";

class CardDashboard extends Component {

    onDeleteClick(item) {
        console.log(item);
        this.props.deleteItem(item)
    }

    addStores() {
        return(
            this.props.stores.map((value, index) => {
                return(
                    <div key={value + index} className="row">
                        <div className="col s12">
                            <div className="s6">
                                <p key={index}>{value.store}</p>
                            </div>
                            <div className="s6">
                                <p>{this.props.item['store'+index] ? <i className="material-icons green-text">done</i> : <i className="material-icons red-text">clear</i>}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        )
    }
    
    render() {
        const {item} = this.props
        return (
            
            <div className="col">
                <div className="card horizontal">
                <div className="card-image">
                    <a href={"https://www.argos.co.uk/product/" + this.props.item.productCode} target="_blank">
                        <img alt="item" src={"https://media.4rgos.it/s/Argos/" + this.props.item.productCode + "_R_SET?w=540&h=800&qlt=75&fmt=webp"}/>
                    </a>
                </div> 
                <div className="card-stacked">
                    <div className="card-content">
                    <b>{this.props.item.productName}</b>
                    {this.addStores()}
                    </div>
                    <div className="card-action">
                    <a href="#removeItemModal" className="red-text" data-product-code={item.productCode} onClick={() => this.onDeleteClick(item)}>Delete Item</a>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default CardDashboard