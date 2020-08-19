import React, { Component } from "react";

class StockTable extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.tableItems);
        this.state = {
            selectAllCheckbox: {
                id: "checkboxSelectAll",
                isSelected: false,
                productCode: 'all'
            },
            selectAllSelected : false,
            checkboxes: []
        }
        this.onClick = this.onClick.bind(this);
        this.onClickSelectAll = this.onClickSelectAll.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        console.log("props", props)
        console.log("state", state)
        if((props.tableItems.items.items.length !== state.checkboxes.length)) {
            if(props.tableItems.items.items.length > 0) {
                return {
                    ...state,
                    checkboxes: props.tableItems.items.items.map((item, index) => {
                        const newCheckbox = {
                            id: "checkbox " + index,
                            isSelected: false,
                            productCode: item.productCode,
                            disabled: false          
                          };
                        return newCheckbox;
                    })
                }
            } else {
                return {
                    ...state,
                    checkboxes: []
                }
            }
        } else {
            return null
        }
        
    }

    onClickSelectAll(e) {
        let data = {
            productCode: 'all',
            isChecked: false,
            event: e
        }
        let selectAllCheckbox = this.state.selectAllCheckbox;
        let checkboxes = this.state.checkboxes;
        selectAllCheckbox.isSelected = data.isChecked = !selectAllCheckbox.isSelected;
        for(var i = 0; i < checkboxes.length; i++) {
            if(selectAllCheckbox.isSelected) {
                checkboxes[i].isSelected = false;
            }
            checkboxes[i].disabled = selectAllCheckbox.isSelected;
        }
        this.setState({
            selectAllCheckbox: selectAllCheckbox,
            checkboxes: checkboxes
        })
        this.props.onClickHandler(data);
        
    }


    onClick(e) {
        //this.toggleSelectBox(e);
        let data = {
            productCode: '',
            isChecked: false,
            event: e
        }
        let checkboxes = this.state.checkboxes;
        let checkbox = checkboxes[e.target.getAttribute('data-index')];
        checkbox.isSelected = !checkbox.isSelected;
        data.productCode = checkbox.productCode;
        data.isChecked = checkbox.isSelected;
        this.setState({
            checkboxes: checkboxes
        })
        this.props.onClickHandler(data);
    }

    toggleSelectBox(e) {
        e.target.getAttribute("data-checked") === 'yes' ? e.target.setAttribute("data-checked", "no"): e.target.setAttribute("data-checked", "yes");
    }

    getTableBody(items) {
        console.log(items);
        return (!items) ? null : (
          <tbody>
            {items.map((item, index) => {                                // changed here
              return (
                <tr key={item.productCode}>
                    <td>
                        <div>
                            <label>
                            <input 
                                onChange={this.onClick}
                                type="checkbox"
                                className="filled-in checkbox-green"
                                id={"checkbox" + index}
                                data-product-code={item.productCode}
                                checked={this.state.checkboxes[index].isSelected}
                                data-index={index}
                                disabled={this.state.checkboxes[index].disabled}/>
                            <span style={{ height: "18px"}}></span>
                            </label>
                        </div>
                    </td>
                    <td key={item.productName}>{item.productName}</td>
                    <td key={item.productCode}>{item.productCode}</td>
                    <td key={"store0"}>{item.store0 ? "YES" : "NO"}</td>
                    <td key={"store1"}>{item.store1 ? "YES" : "NO"}</td>
                    <td key={"store2"}>{item.store2 ? "YES" : "NO"}</td>
                </tr>
              );
            })}
          </tbody>
        );
      }

    getTableHead(items) {
        return (!items) ? null : (
            <thead>
                <tr>
                    <th>
                    <label>
                        <input onChange={this.onClickSelectAll} type="checkbox" className="filled-in checkbox-green" id="checkboxSelectAll" checked={this.state.selectAllCheckbox.isSelected} />
                        <span style={{ height: "18px"}}></span>
                    </label>
                    </th>
                    <th key={"productName"}>Product Name</th>
                    <th key={"productCode"}>Product Code</th>
                    {items.map((item, index) => {
                        return(
                            <th key={item.store}>{item.store}</th>
                        );
                    })}
                </tr>
            </thead>
          );
    }


    render() {
        console.log("I re rendered!");
        return (
            <table className='highlight'>
            {this.getTableHead(this.props.tableItems.items.stores)}
            {this.getTableBody(this.props.tableItems.items.items)}
            </table>
        )
    }
}

export default StockTable;