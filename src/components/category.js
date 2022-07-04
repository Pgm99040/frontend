import React from 'react';
import { Collapse } from 'antd';
import axios from 'axios';
require('../styles/category.css');
const Panel = Collapse.Panel;

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state= { category : [],
                      subcategory :[] };
    }
    componentDidMount () {
        axios.get("http://13.59.128.57:8080/api/category/list").then((response)=>{
        	console.log(response.data.result);
            this.setState({ 
                category: response.data.result,
            });
        })
    }

    //category main (return this in main render)
    renderCat() {
        if (this.state.category) {
            return(
                this.state.category.map((obj,index) => {
                    return this.renderList(obj,index)
                })
                )
        }else{
            return(<p>Not found</p>);
        }
    }

     //print category and call subcategory list
     renderList(obj,index) {
         console.log(index);
        return(
            <Panel header={obj.name} key={index+1} onClick={()=> this.getListForCategory(obj)}>
                <ul className="sub-category">
                    {this.renderSubCat(obj,index)}
                </ul>
            </Panel>
        )
        
    }
    
    //loop subcategory list
    renderSubCat(obj,index) {
        if (obj.subcategories.length) {
            return(
                obj.subcategories.map((obj,index) => {
                    return this.renderSubCategory(obj,index)
                })
            )
        }else{
            return(<p>Not found</p>);
        }
    }

    //print subcategory list
    renderSubCategory(obj,index) {
        return (
            <li className="sub-cat-list"key={index+1}><a href="#">{obj.name}</a></li>
        )
    }
   
    //get Task list for categories

    render() {
        return (
            <div className="filter-category">
                <Collapse bordered={false} defaultActiveKey={['1']}>
                    {this.renderCat()}
                </Collapse>
            </div>
        );
    }
}

export default Category;



