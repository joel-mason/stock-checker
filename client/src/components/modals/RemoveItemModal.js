import React, { Component } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

class RemoveItemModal extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const options = {
          inDuration: 250,
          outDuration: 250,
          opacity: 0.5,
          dismissible: false,
          startingTop: "4%",
          endingTop: "10%"
        };
        M.Modal.init(this.Modal, options);
        // If you want to work on instance of the Modal then you can use the below code snippet 
        // let instance = M.Modal.getInstance(this.Modal);
        // instance.open();
        // instance.close();
        // instance.destroy();
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onModalConfirmDelete(e);
        let instance = M.Modal.getInstance(this.Modal);
        instance.close();
    }
    
    render() {
        return (
            <div ref={Modal => {
                this.Modal = Modal;
              }} id={this.props.modalId} style={{height: "150px"}} className="modal modal-fixed-footer">
              <div className="modal-content">
                <h4>Delete Item?</h4>
              </div>
              <div className="modal-footer">
                <a href="#!" onClick={this.onSubmit} className="modal-close waves-effect waves-green btn-flat">Yes</a>
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">No</a>
              </div>
            </div>
        )
    }
}

export default RemoveItemModal