import React, { Component } from "react";
import Ratings from 'react-ratings-declarative';
import "materialize-css/dist/css/materialize.min.css";

class Card extends Component {

    constructor(props) {
        super(props);
        this.watchItem = this
            .watchItem
            .bind(this);
    }

    watchItem(e) {
        e.preventDefault()
        this.props.onClick(this.props.item)
    }

    alreadyWatched(watchedItems, item) {
        var ret = false;
        watchedItems.items.forEach(element => {
            if(element.productCode === item.id) {
                console.log("I matched!")
                ret = true;
            }
        });
        return ret;
    }
    
    render() {
        return (
            <div className="card medium">
              <div className="card-image">
                <img alt="item" src={"https://media.4rgos.it/s/Argos/" + this.props.item.id + "_R_SET?w=540&h=400&qlt=75&fmt=webp"}/>
              </div>
              <div className="card-content">
                <Ratings
                    rating={this.props.item.attributes.avgRating}
                    widgetDimensions="20px"
                    widgetSpacings="2px"
                >
                    <Ratings.Widget widgetRatedColor="black" />
                    <Ratings.Widget widgetRatedColor="black" />
                    <Ratings.Widget widgetRatedColor="black" />
                    <Ratings.Widget widgetRatedColor="black" />
                    <Ratings.Widget />
                </Ratings>
                <span style={{marginLeft: "10px"}}>{this.props.item.attributes.reviewsCount}</span>
                <p>{this.props.item.attributes.name}</p>
              </div>
              <div className="card-action">
                  <div style={{marginBottom: "0px"}} className="row">
                      <div className = "col s12">
                          <div style={{padding: "0"}} className="col s6">
                            <p style={{margin: 0}}>£{this.props.item.attributes.price}</p>
                          </div>
                          <div style={{padding: "0"}} className="col s6">
                              {!this.alreadyWatched(this.props.watchedItems, this.props.item) ? 
                              <a style={{marginRight: 0}} className="right" href="#" onClick={this.watchItem}>Watch Item</a>
                              : 
                              <a style={{marginRight: 0, color: "black"}}className="right" href="#">Already watched</a>}
                            
                          </div>
                      </div>
                  </div>
              </div>
            </div>
        )
    }
}

export default Card