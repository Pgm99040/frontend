import React from 'react';
import { Link } from 'react-router-dom';
import Header from './login/header';
import TaskListing from './task';
import { Slider } from 'antd';
import { Collapse } from 'antd';
import axios from 'axios';
const Panel = Collapse.Panel;
require('../styles/category.css');
require('../styles/listing.css');

const marks = {
    0: 'Free',
    100: {
      style: {
        color: '#676767',
      },
      label: <strong>700</strong>,
    },
  };
class MenteeListing extends React.Component {
    constructor(props){
        super(props);
        this.state= { category : [],
            subcategory :[],
            categoryList: [],
            subCategoryList:[] };
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
            <Panel header={obj.name} key={index+1}>
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
            <li className="sub-cat-list"key={index+1} onClick={()=> this.getListForSubcategory(obj)}><Link>{obj.name}</Link></li>
        )
    }
        
    //get Task list for categories
    getListForCategory(obj) {
        axios.get("http://13.59.128.57:8080/api/category/view/"+obj._id).then((response)=>{
        	console.log('abc');
            this.setState({ 
                categoryList: response.data.result,
            });
        })
    }

    getListForSubcategory(obj) {
        axios.get("http://13.59.128.57:8080/api/subcategory/view/"+obj._id).then((response)=>{
        	console.log(response.data.result);
            this.setState({ 
                subCategoryList: response.data.result.predefinedTasks,
            });
            console.log(this.state.subCategoryList);
        })
    }

    onChange(value) {
        console.log('onChange: ', value);
      }
      
    onAfterChange(value) {
        console.log('onAfterChange: ', value);
      }
      
    render() {
        
        return(
            <div className="fullPage" >
                <div className="main_div">
                    <Header />
                </div>
                <div className="container listing-container">
                    <div className="col-md-12 col-sm-12 col-xs-12 no-padding-div">
                        <div className="col-md-3 col-sm-4 col-xs-12 no-left-padding-div">
                            <div className="col-md-12 col-xs-12 col-sm-12 filters-content">
                                <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div mentee-category" >
                                    <p className="filter-title">Filters</p>
                                    <p className="categories-title">Categories</p>
                                    <div className="filter-category">
                                        <Collapse bordered={false} defaultActiveKey={['1']}>
                                        {this.renderCat()}
                                        </Collapse>
                                    </div>
                                </div>
                                <hr className="horizontal-line" />
                                <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div mentee-slider" >
                                    <div className="col-md-5 col-sm-6 col-xs-12 no-left-padding-div price-slider">
                                        <p className="max-price-title">MAX PRICE</p>
                                    </div>
                                    <span className="max-price">200</span>
                                    <Slider className="max-price-slider" marks={marks} defaultValue={0} onChange={this.onChange()} onAfterChange={this.onAfterChange()} />
                                </div>
                                <hr className="horizontal-line" />
                                <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div mentee-level" >
                                    <p className="difficulty">DIFFICULTY</p>
                                    <div>
                                        <input id="radio-1" className="radio-custom" name="radio-group" type="radio" checked />
                                        <label htmlFor="radio-1" className="radio-custom-label">First Choice</label>
                                    </div>
                                    <div>
                                        <input id="radio-2" className="radio-custom"name="radio-group" type="radio" />
                                        <label htmlFor="radio-2" className="radio-custom-label">Second Choice</label>
                                    </div>
                                    <div>
                                        <input id="radio-3" className="radio-custom" name="radio-group" type="radio" />
                                        <label htmlFor="radio-3" className="radio-custom-label">Third Choice</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 col-sm-8 col-xs-12 no-right-padding-div">
                            <TaskListing subCat={ this.state.subCategoryList }/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
export default MenteeListing;