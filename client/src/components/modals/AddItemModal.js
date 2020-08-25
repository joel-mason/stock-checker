import React, { Component } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

class AddItemModal extends Component {

    constructor(props) {
        super(props);
        this.textInputPN = React.createRef();
        this.textInputPC = React.createRef();
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const options = {
          inDuration: 250,
          outDuration: 250,
          opacity: 0.5,
          dismissible: false,
          startingTop: "4%",
          endingTop: "10%",
          onCloseEnd: () => {
            this.textInputPN.current.value = ''
            this.textInputPC.current.value = ''
          },
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
        this.props.onSubmit(e);
        let instance = M.Modal.getInstance(this.Modal);
        instance.close();
    }
    
    render() {
        return (
            <div ref={Modal => {
                this.Modal = Modal;
              }} id={this.props.modalId} style={{height: "350px"}} className="modal modal-fixed-footer">
              <div className="modal-content">
                <h4>Add item</h4>
                <form className="col s12" onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref={this.textInputPC} id="productCode" type="text" className="validate" onChange={this.props.onChange} required/>
                            <label htmlFor="productCode">Product Code</label>
                        </div>
                        <div className="input-field col s12">
                            <input ref={this.textInputPN} id="productName" type="text" className="validate" onChange={this.props.onChange} required/>
                            <label htmlFor="productName">Product Name</label>
                        </div>
                        <div className="input-field col s12">
                        <button className="btn waves-light" type="submit" name="action">Submit
                            <i className="material-icons right">send</i>
                        </button>
                        </div>
                    </div>
                </form>
              </div>
              <div className="modal-footer">
                <a href="#!" className="modal-close waves-green btn-flat">Close</a>
              </div>
            </div>
        )
    }
}

export default AddItemModal