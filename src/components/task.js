import React from 'react';
import axios from 'axios';
import TaskLogo from '../images/bitmap.png';
require('../styles/mentee-task.css');

class TaskListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            changed:false,
            };
        }
        getAllData() {
            var count;
            axios.get("http://13.59.128.57:8080/api/predefinedtask/list").then((response)=>{
                console.log(response.data.result);
                if(response.data.result == null){
                    count=0;
                }else {
                    count=response.data.result.length;
                }
                this.setState({ 
                    data: response.data.result,
                });
                console.log(count)
                
            })
        }
    componentDidMount() {
        console.log(this.props.subCat);
        this.getAllData();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.subCat);
        if(this.state.data != this.props.subCat ) {
            this.setState({ 
                data: this.props.subCat
            });
        }
    }

    renderTaskList(obj) {
        return (
            <div className="col-m-12 col-sm-12 col-xs-12 task-cards" key ={obj._id}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                    <div className="col-md-2 col-sm-3 col-xs-12">
                        <img src={TaskLogo} />
                    </div>
                    <div className="col-md-7 col-sm-6 col-xs-12 no-padding-div">
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <span className="task_name">{obj.name}</span>
                            <div className="divider" />
                            <span className="task_category">{obj.subcategory.category.name}</span>
                            <span className="bulletin" >&bull;</span>
                            <span className="task_difficulty">{obj.difficultyLevel}</span>
                        </div>
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <p className="task_desc">{obj.description}</p>
                            <p className="task_detail">This task will guide you through the intricacies of downloading and installing mongoDB on your PC</p>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-3 col-xs-12 float-right">
                        <p className="task_price">Price</p>
                        <p className="task_rate">{obj.credits}</p>
                        <button className="task_button">Explore</button>
                    </div>
                </div>
            </div>
        ) 
    }

    renderTask(){
		if (this.state.data) {
        	return(
        		this.state.data.map((obj) => {
        			return this.renderTaskList(obj)
        		})
        	)
        }else {
            return(<p>Not found</p>);
        }
	}

    render() {
        return (
            <div>
                <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div search_div" >
                <form className="navbar-form" role="search">
                    <div className="input-group add-on">
                        <input className="form-control" placeholder="Search" name="srch-term" id="srch-term" type="text" />
                        <div className="input-group-btn">
                            <button className="btn btn-default" type="submit"><i className="fa fa-search" /></button>
                        </div>
                    </div>
                </form>
                </div>
                <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div listing-section" >
                    <p className="avaiable-tasks">Available Tasks(25)</p>
                    <div className="col-md-6 col-sm-6 col-xs-12 no-right-padding-div float-right text-right sort_field">
                        <div className="drop_list">
                            <select className="selectpicker" name="mydropdown" id="sort">
                                <option value="Most Recent" active>Sort by: Most Recent</option>
                                <option value="Most Taken">Sort by: Most Taken</option>
                                <option value="Most Viewed">Sort by: Most Viewed</option>
                            </select>
                        </div>
                    </div>
                    {this.renderTask()}
                </div>
            </div>
        )
    }
}

export default TaskListing;



