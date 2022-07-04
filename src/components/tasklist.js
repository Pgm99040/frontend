import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import Header from './login/header';
import {Modal, Select} from 'antd';
import { Slider } from 'antd';
import { Collapse } from 'antd';
import One from '../images/g1.png';
import Two from '../images/group-25.png';
import Three from '../images/group-26.png';
import TaskLogo from '../images/bitmap.png';
import {getFromStorage} from "../config/common";
import {
    categoryView,
    getActiveTasks,
    getAllCategoryList,
    isTaskPurchased,
    listWithOptions,
    predefinedTaskList,
    taskPurchasedForUsers,
    searchTask, sortByOptions, subcategoryView, becomeMentor
} from "./utils/_data";
import moment from "moment";
import "../styles/task-list.css"
import GoogleWithLogin from "./login/GoogleWithLogin";
import UserModal from "./login/UserModal";
const Option = Select.Option;
const Panel = Collapse.Panel;
var activeTasks = localStorage.getItem('activeTasks');
let displayMentorDashboard =false;
let displayMenteeDashboard = false;

let requestBody = {
    categoryIds: [],
    subcategoryIds: [],
    difficultyLevel: null,
    minPrice: 0,
    maxPrice: 5000
};
require('../styles/mentee-task.css');
require('../styles/category.css');
require('../styles/listing.css');
var priceArray=[];
var filterContents =[];
var Filter = require('../helper/filter');
const marks = {
    0: '0',
    5000: {
      style: {
        color: '#676767',
      },
      label: <strong>₹5000</strong>,
    },
  };
class MenteeListing extends React.Component {
    constructor(props){
        super(props);
        this.state= { category : [],
            subcategory :[],
            authToken:'',
            categoryList: [],
            subCategoryList:[],
            categoryListing:[],
            subcategoryListing:[],
            data: [],
            dataDup: [],
            dupDataDup : [],
            count:'',
            selectedOption: 'option1',
            loggedIn:false,
            taskEngagementsId: null,
            purchaseDetail: {},
            purchaseList: [],
            purchaseSameUsers: [],
            sameTaskPurchase: [],
            isPurchasedModal: false,
            isCallTrue: true,
            visible: false,
            searchFilter: {
                difficulty: '',
                category: '',
                price: '',
            },
            searchKeyword: ''
        };
    }


    getTaskEngagementId = async () =>{
        console.log("88888888888", this.props)
        const id = localStorage.getItem('id');
        const res = await getActiveTasks(id);
        // const res = await axios.get(BaseUrl.base_url + "/api/v1/user/te/getActiveTasks/" + localStorage.getItem('id'),
        //     {headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem('authToken')}});
        if (res?.data?.status_code === 200 && res?.data?.success === true){
            if(res?.data?.result?.activeTasks &&  res?.data?.result?.activeTasks.length > 0) {
                this.setState({taskEngagementsId:  res?.data?.result?.activeTasks[0]?._id });
            }
        } else {
            console.log("error------>");
        }
        // axios.get(BaseUrl.base_url + "/api/v1/user/te/getActiveTasks/" + localStorage.getItem('id'),
        // {
        //     'headers': {
        //         "Content-Type": "application/json",
        //         "Authorization": localStorage.getItem('authToken')
        //     }
        // }).then((response) => {
        //         if(response.data.status_code === 200 && response.data.success === true) {
        //             if( response.data.result.activeTasks &&  response.data.result.activeTasks.length > 0) {
        //                 this.setState({taskEngagementsId:  response.data.result.activeTasks[0]._id });
        //             }
        //         }
        //     })
    };
    isPurchased = async (taskId, userId) =>{
        const {purchaseList} = this.state;
        const res = await isTaskPurchased(taskId, userId);
        console.log("-----------------sss", res);
        if (res && res.success){
            purchaseList.push(res && res.data);
            this.setState(prevSate=>({
                purchaseDetail: res && res.data,
                purchaseList
            }));
            // purchaseDetails.data = res && res.data;
        } else {
            console.log("error----->");
        }
    };

    findWithTaskList = async () =>{
        const res = await taskPurchasedForUsers();
        if (res.success){
            this.setState({
                purchaseSameUsers: res.data
            })
        } else {
            console.log("error---->>>")
        }
        console.log("res-------->>>---------->>>", res);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const userId = getFromStorage("id");
        const { dataDup } = this.state;
        if(prevState.dataDup !== dataDup){
            console.log("dataDup========>>>", dataDup);
            if(dataDup.length > 0){
                dataDup && dataDup.map(obj => {
                    return this.isPurchased(obj._id, userId)
                })
            }
        }
    }

    componentDidMount () {
        //category list api
         let isLoggedIn = localStorage.getItem('isLoggedIn');
		let authToken = null;
		let userData = [];
		if (isLoggedIn == 'true')  {
			 authToken = localStorage.getItem('authToken');
             userData = JSON.parse(localStorage.getItem('userData'));
             this.setState({authToken : authToken})
             this.getTaskEngagementId()
        }
            this.getAllCatergory();
        // task list api
            this.getAllTaskList();
            this.findWithTaskList();
    }

    getAllCatergory = async () =>{
        const res = await getAllCategoryList();
        // const res = await axios.get(BaseUrl.base_url+"/api/category/list");
        if (res?.data?.result){
            this.setState({
                category: res?.data?.result,
            });
        } else {
            console.log("error------>");
        }
        // axios.get(BaseUrl.base_url+"/api/category/list").then((response)=>{
        // 	console.log(response.data.result);
        //     this.setState({
        //         category: response.data.result,
        //     });
        // })
    };

    getAllTaskList = async () =>{
        let idArray = [];
        const response = await predefinedTaskList();
        // const response = await axios.get(BaseUrl.base_url+"/api/predefinedtask/list");
        // console.log("response1111---------------->", response);
        response && response.data && response.data.result && response.data.result.map(item =>{
            idArray.push(item._id);
        });
        if(response?.data?.result == null){
            this.setState({count:0})
        }else {
            this.setState({count: response?.data?.result.length})
        }

        this.setState({
            data: response?.data.result,
            dataDup: this.getResult(response?.data?.result),
            dupDataDup: response?.data?.result,
            InProgress: this.getResult(response?.data?.result)
        })

        // axios.get(BaseUrl.base_url+`/api/predefinedtask/records/${userData && JSON.parse(userData)._id}`).then((response)=>{
        //     //console.log({test:this.getResult(response.data.result)})
        //     /* */
        //     if(response && response.data == null){
        //         this.setState({count:0})
        //     }else {
        //         this.setState({count:response.data.length})
        //     }
        //     this.setState({
        //         data: response && response.data,
        //         dataDup : this.getResult(response && response.data),
        //         dupDataDup: response && response.data,
        //         InProgress : this.getResult(response && response.data)
        //
        //     });
        //
        // })
    };

    getResult(objArray) {
        var results = objArray && objArray.length && objArray.filter(obj => obj._id == activeTasks);
        objArray = objArray && objArray.length && objArray.filter(function (obj) {
            return results.indexOf(obj) == -1;
        });
        results && results.map((obj) => {
            objArray.unshift(obj);
        });
        return objArray;
    }

    getAllTaskForIds = async (obj) =>{
        requestBody.subcategoryIds =[];
        const res = await listWithOptions(requestBody);
        // const res = await axios.post(BaseUrl.base_url+"/api/predefinedtask/listWithOptions", requestBody, {headers: {'Content-Type': 'application/json'}});
          if(res?.data?.result.length<=0 || res?.data?.result!= undefined) {
                this.setState({
                    dataDup:res?.data?.result,
                    dupDataDup:res?.data?.result,
                    count:res?.data?.result?.length
                })
          }else {
                console.log('No data Available')
          }

        // axios({
        //     method: 'post',
        //     url: BaseUrl.base_url+"/api/predefinedtask/listWithOptions",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //       data: requestBody
        //       }).then(response => {
        //           console.log(response)
        //           if(response.data.result.length<=0 || response.data.result!= undefined) {
        //                 this.setState({
        //                     dataDup:response.data.result,
        //                     dupDataDup:response.data.result,
        //                     count:response.data.result.length
        //                 })
        //           }else {
        //                 console.log('No data Available')
        //           }
        //         })
        //       .catch(error => {
        //         throw(error);
        //       });

    };

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
                {/*<li className="sub-cat-list" onClick={()=> this.getAllTaskForIds(obj)}></li>*/}
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
            return(<p>No categories</p>);
        }
    }

    //print subcategory list
    renderSubCategory(obj,index) {
        return (
            <li className="sub-cat-list"key={index+1} onClick={()=> this.getListForSubcategory(obj)}><Link>{obj.name}</Link></li>
        )
    }

    //get Task list for categories
    getListForCategory = async (obj) =>{
        const res = await categoryView(obj._id);
        if (res?.data?.status_code === 200){
            this.setState({ categoryList: res.data.result});
        }else {
            console.log("error------->")
        }
        // axios.get(BaseUrl.base_url+"/api/category/view/"+obj._id)
        //     .then((response)=>{
        //         this.setState({ categoryList: response.data.result});
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
    };

    getListForSubcategory = async function(obj) {
        const response = await subcategoryView(obj._id);
        // const response = await axios.get(BaseUrl.base_url+"/api/subcategory/view/"+obj._id);
        // console.log("resSub--------------->", response);
        if (response?.data?.success) {
            requestBody.categoryIds =[];
            requestBody.subcategoryIds =[];
            typeof response.data.result != undefined || typeof response.data.result != null
                ? requestBody.categoryIds.push(response.data.result.category._id) : alert('category was not fetched');
            typeof response.data.result != undefined || typeof response.data.result != null
                ? requestBody.subcategoryIds.push(response.data.result._id) : alert('category was not fetched');
            if(requestBody.categoryIds.length==0 || requestBody.subcategoryIds.length==0) {
                this.setState({
                    count : response.data.result.predefinedTasks.length,
                    dataDup : response.data.result.predefinedTasks,
                    dupDataDup : response.data.result.predefinedTasks
                },() => {
                    console.log(this.state.subcategoryListing);
                    console.log(this.state.categoryListing);
                    this.renderTask();
                });
                console.log({withoutIDs:this.state.data});
            }else {
                this.allFilterValues();
            }
        } else {
            console.log("error---->");
        }

        // axios.get(BaseUrl.base_url+"/api/subcategory/view/"+obj._id)
        //     .then((response)=>{
        //         console.log({response:response})
        //         requestBody.categoryIds =[];
        //         requestBody.subcategoryIds =[];
        //     typeof response.data.result != undefined || typeof response.data.result != null
        //         ? requestBody.categoryIds.push(response.data.result.category._id) : alert('category was not fetched');
        //     typeof response.data.result != undefined || typeof response.data.result != null
        //         ? requestBody.subcategoryIds.push(response.data.result._id) : alert('category was not fetched');
        //     if(requestBody.categoryIds.length==0 || requestBody.subcategoryIds.length==0) {
        //         this.setState({
        //             count : response.data.result.predefinedTasks.length,
        //             dataDup : response.data.result.predefinedTasks,
        //             dupDataDup : response.data.result.predefinedTasks
        //         },() => {
        //             console.log(this.state.subcategoryListing)
        //             console.log(this.state.categoryListing)
        //             this.renderTask();
        //         });
        //         console.log({withoutIDs:this.state.data});
        //     }else {
        //         this.allFilterValues();
        //     }
        // })
        // .catch(err => {
        //     console.log(err)
        // })
    };

    onAfterChange(value) {
        console.log('onAfterChange: ', value);
        priceArray = [];
        requestBody.minPrice=0;
        requestBody.maxPrice=value;
        if(requestBody.categoryIds.length === 0 || requestBody.subcategoryIds.length === 0) {
            if(this.state.dataDup) {
                this.state.dataDup.map((obj) => {
                if(obj.price <= value) {
                    priceArray.push(obj)
                }
                this.setState({
                        dataDup:priceArray,
                        dupDataDup:priceArray,
                        count:priceArray.length,
                })
                })
            }
        }
        else {
            this.allFilterValues()
        }
    }


    //search functionality
    searchFun = async function(){
        var searchKey = document.getElementById('searchKey').value;
        var param = {"searchText": searchKey };
        requestBody.searchText = searchKey;
		if(searchKey == null || searchKey === '') {
			this.getAllTaskList();
		}
		else {
		    const response = await searchTask(requestBody);
		    // const response = await axios.post(BaseUrl.base_url+"/api/predefinedtask/searchTask", requestBody, {headers: {'Content-Type': 'application/json'}});
		    if (response?.data?.success){
                  this.setState({
                    count : response.data.result.length,
                    dataDup : response.data.result,
                    dupDataDup : response.data.result
                    },() => {
                    this.renderTask();
                });
            } else {
                console.log("error---------------->");
            }

			// axios({
            //     method: 'post',
            //     url: BaseUrl.base_url+"/api/predefinedtask/searchTask",
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //       data: requestBody
            //       }).then(response => {
            //           console.log(response)
            //           this.setState({
            //             count : response.data.result.length,
            //             dataDup : response.data.result,
            //             dupDataDup : response.data.result
            //             },() => {
            //             this.renderTask();
            //         });
            //       })
            //       .catch(error => {
            //         throw(error);
            // });
		}
    };

    //filter by level
    filterLevel(value) {
        var level;
         if (document.getElementById('r1').checked) {
            level = document.getElementById('r1').value;
          }else if(document.getElementById('r2').checked) {
            level = document.getElementById('r2').value;
          }else if(document.getElementById('r3').checked) {
            level = document.getElementById('r3').value;
        }
        level = level.toLowerCase();
        typeof level != undefined || typeof level != null
        ? requestBody.difficultyLevel=level : alert('level was not fetched');
        if(requestBody.categoryIds.length === 0 || requestBody.subcategoryIds.length === 0) {
            var arrOfObj = {list: this.state.data};
            this.filter(level, arrOfObj, this);
        }else {
            this.allFilterValues();
        }
    }

    //filter function
    filter(level, arrOfObj, props){
		Filter.filterObject(level, arrOfObj, function(err,result){
            console.log({after:result,isTrue:true});
            props.setState({
                dataDup: result.list,
                dupDataDup:result.list,
                count:result.list.length,
            });
        });
	}

    //handle all filters together
    allFilterValues = async () =>{
        const response = await listWithOptions(requestBody);
        // const response = await axios.post(BaseUrl.base_url+"/api/predefinedtask/listWithOptions", requestBody, {headers: {'Content-Type': 'application/json'}});
        if (response?.data?.success) {
              if(response?.data?.result.length<=0 || response?.data?.result!= undefined) {
                    this.setState({
                        dataDup:response?.data.result || [],
                        dupDataDup:response?.data.result || [],
                        count:response?.data.result.length,
                    })
              }else {
                    console.log('No data Available')
              }
        } else {
            console.log("error---------------->");
        }


        // axios({
        //     method: 'post',
        //     url: BaseUrl.base_url+"/api/predefinedtask/listWithOptions",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //       data: requestBody
        //       }).then(response => {
        //           if(response.data.result.length<=0 || response.data.result!= undefined) {
        //                 this.setState({
        //                     dataDup:response.data.result,
        //                     dupDataDup:response.data.result,
        //                     count:response.data.result.length,
        //
        //                 })
        //
        //           }else {
        //                 console.log('No data Available')
        //           }
        //         })
        //       .catch(error => {
        //         throw(error);
        //       });
        };


    //sort functionality
    handleChange = async function(value) {
        console.log(value);
        var sortValue = value;
        var param;
        if (sortValue === 'sortByDate') {
            param ={
                "sortType": sortValue,
                "newToOld": true
            };
            const response = await sortByOptions(param);
            // const response = await axios.post(BaseUrl.base_url+"/api/predefinedtask/sortByOptions", param,{headers: {'Content-Type': 'application/json'}});
            if (response?.data?.success) {
                this.setState({
                    count : response.data.result.length,
                    dataDup : response.data.result,
                    dupDataDup : response.data.result,
                },() => {
                    this.renderTask();
                });
            } else {
                console.log("error--------->")
            }
            // axios({
            //     method: 'post',
            //     url: BaseUrl.base_url+"/api/predefinedtask/sortByOptions",
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //       data: param
            //       }).then(response => {
            //           console.log(response)
            //           this.setState({
            //             count : response.data.result.length,
            //             dataDup : response.data.result,
            //             dupDataDup : response.data.result,
            //
            //             },() => {
            //             this.renderTask();
            //          });
            //       })
            //       .catch(error => {
            //         throw(error);
            // });
        } else if (sortValue === 'sortByPrice') {
            param ={
                "sortType": sortValue,
                "highToLow": true
            };
            const response = await sortByOptions(param);
            // const response = await axios.post(BaseUrl.base_url+"/api/predefinedtask/sortByOptions", param, {headers: {'Content-Type': 'application/json'}});
            if (response?.data?.success){
                this.setState({
                    count : response.data.result.length,
                    dataDup : response.data.result,
                    dupDataDup : response.data.result,
                },() => {
                    this.renderTask();
                });
            } else {
                console.log("error------------------>");
            }
            // axios({
            //     method: 'post',
            //     url: BaseUrl.base_url+"/api/predefinedtask/sortByOptions",
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //       data: param
            //       }).then(response => {
            //           console.log(response)
            //           this.setState({
            //             count : response.data.result.length,
            //             dataDup : response.data.result,
            //             dupDataDup : response.data.result,
            //             },() => {
            //             this.renderTask();
            //          });
            //       })
            //       .catch(error => {
            //         throw(error);
            // });
        }
    };


    showMorePurchases = (data) =>{
        // const { isPurchasedModal } = this.state;
        this.setState(prevState =>({
            isPurchasedModal: !prevState.isPurchasedModal,
            sameTaskPurchase: data
        }))

    };

    getUrl = (que) => {
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

        const links = que.match(urlRegex, function (url) {
            return url;
        })
        console.log("links",links)
        return (links && links[0]) || ""
    };

    showModal(_this){
        _this.setState({
            visible: true,
        });
        localStorage.setItem('isVisible',true)
        //console.log('true')
    }

    //task Listing
    renderTaskList(obj) {
        const { taskEngagementsId, purchaseDetail, purchaseList, purchaseSameUsers } = this.state;
        const purchaseTask = purchaseList && purchaseList.filter(item => (item && item.task && item.task._id) === (obj?._id));
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        // let isCheck = purchaseDetail && purchaseDetail.paymentGateway;
        // let taskMatch = purchaseDetail && purchaseDetail.task && purchaseDetail.task._id;
        // console.log("taskMatch-------->", taskMatch, obj._id);


        const sameTaskPurchase = purchaseSameUsers && purchaseSameUsers.length && purchaseSameUsers.filter(ele => ((ele?.task?._id === obj?._id) && (ele?.user?._id === getFromStorage('id'))));
        const links = obj && obj.description && obj.description.match(urlRegex, function(url) {
            return url;
        });

        let taskCompletedDate = purchaseDetail && purchaseDetail.taskEngagement && purchaseDetail.taskEngagement.endDate || "";
        let firstName = (purchaseDetail && purchaseDetail.mentor && purchaseDetail.mentor.user && purchaseDetail.mentor.user.firstName) || "";
        let lastName = (purchaseDetail && purchaseDetail.mentor && purchaseDetail.mentor.user && purchaseDetail.mentor.user.lastName) || "";
        return (
            <div className="col-m-12 col-sm-12 col-xs-12 task-cards" key ={obj._id}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                    <div className="col-md-2 col-sm-3 col-xs-12">
                        <img src={obj && obj.imageUrl} alt={'image_logo'} className="logo_image" />
                    </div>
                    <div className="col-md-7 col-sm-6 col-xs-12 no-padding-div">
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <span className="task_name">{obj && obj.name}</span>
                            <div className="divider" />
                            <span className="task_category">{obj && obj.subcategory && obj.subcategory.category && obj.subcategory.category.name}</span>
                            <span className="bulletin" >&bull;</span>
                            <span className="task_difficulty">{obj && obj.difficultyLevel}</span>
                            {activeTasks != obj && obj._id ? "" : <span className="taskInProgress">In Progress</span> }
                        </div>
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <p className="task_desc"  style={{display : 'inline-block'}} dangerouslySetInnerHTML={{__html: obj && obj.description}} />
                            <p className="task_detail" dangerouslySetInnerHTML={{__html: obj && obj.tinyDescription}} />
                        </div>
                        { obj.mediaLink &&
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <iframe width="420" height="315" src={obj && obj.mediaLink} title="Media Link" />
                        </div>
                        }
                    </div>
                    {

                        <div className="col-md-3 col-sm-3 col-xs-12 float-right">
                            {(sameTaskPurchase && sameTaskPurchase.length >= 1) && <p className="purchase_more task_price" onClick={() =>this.showMorePurchases(sameTaskPurchase)}>Show more purchases</p>}
                            <p className="task_price">Price</p>
                            <p className="task_rate">{`${obj && obj.credits} ${obj && obj.currencyCode}`}</p>
                            {
                                getFromStorage("userData") ?
                                    <Link to={"/task-details/"+ obj._id}><button className="task_button" >Explore</button></Link> :
                                    <GoogleWithLogin title="Explore" icon={false} className={`task_button`} showModal = {() =>this.showModal(this)}/>
                            }

                        </div>
                    }
                    {/*<div className="col-md-2 col-sm-3 col-xs-12 float-right">*/}

                    {/*</div>*/}


                    {/*{*/}
                    {/*    ((purchaseDetail && purchaseDetail.paymentGateway === "paypal") || (purchaseDetail && purchaseDetail.paymentGateway === "razorpay"))*/}
                    {/*    && (purchaseTask.length) ? (sameTaskPurchase && sameTaskPurchase.length >= 1) ?*/}
                    {/*        <div className="col-md-3 col-sm-3 col-xs-12 float-right"><span className="purchase_more" onClick={() =>this.showMorePurchases(sameTaskPurchase)}>Show more purchases</span></div> :*/}
                    {/*        <div className="col-md-2 col-sm-3 col-xs-12 float-right">*/}
                    {/*            <div className="purchase-history">*/}
                    {/*                <p><b>Purchase Date:</b></p>*/}
                    {/*                <span>{moment(purchaseDetail && purchaseDetail.createdAt).format("MM/DD/YYYY")}</span>*/}
                    {/*            </div>*/}
                    {/*            {taskCompletedDate && <div className="purchase-history">*/}
                    {/*                <p><b>Task Completed Date:</b></p>*/}
                    {/*                <span>{moment(taskCompletedDate).format("MM/DD/YYYY")}</span>*/}
                    {/*            </div>}*/}
                    {/*            <div className="purchase-history">*/}
                    {/*                <p><b>Paired Mentor:</b></p>*/}
                    {/*                <span>{firstName + " " + lastName}</span>*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <p><b>Task Engagement page link:</b></p>*/}
                    {/*                <span><Link onlyActiveOnIndex to={`/task-engagement/${purchaseDetail && purchaseDetail.taskEngagement && purchaseDetail.taskEngagement._id}`} className="text-primary">Click here</Link></span>*/}
                    {/*            </div>*/}
                    {/*        </div> :*/}
                    {/*        <div className="col-md-2 col-sm-3 col-xs-12 float-right">*/}
                    {/*            <p className="task_price">Price</p>*/}
                    {/*            <p className="task_rate">{`${obj && obj.credits} ${obj && obj.currencyCode}`}</p>*/}
                    {/*            {activeTasks == obj._id ? <Link to={{pathname:"/task-engagement/"+taskEngagementsId}}><button className="task_button" >Explore</button></Link> : <Link to={"/task-details/"+ obj._id}><button className="task_button" >Explore</button></Link> }*/}
                    {/*        </div>*/}
                    {/*}*/}
                </div>
            </div>
        )
    }


    renderTask(){
        const { dataDup } = this.state;
        console.log(">>>>>>>>>", dataDup);
        const userId = getFromStorage("id");
		if (dataDup && dataDup.length > 0) {
        	return(
                dataDup && dataDup.map((obj) => {
        			return this.renderTaskList(obj)
        		}))
        }else {
            return(<p>Not found</p>);
        }
    }

    filterFlag() {
        const {data, searchFilter} = this.state;
        const {difficulty, category, price} = searchFilter;
        console.log('data',data,price);
        if(price || difficulty || category){
            let min = null;
            let max = null;
            if (price.includes("+"))
                min = parseInt(price.replace("+", "")) + 1;
            else {
                min = parseInt(price.split("-")[0]);
                max = parseInt(price.split("-")[1]);
            }

            const searchByFilter = data.filter(item => (difficulty !== '' ? (item.difficultyLevel.toLowerCase() === difficulty.toLowerCase()) : true) &&
               (category !== '' ?  (item.subcategory.name.toLowerCase() === category.toLowerCase()) : true) &&
               (price !== ''  ? (item.price[0].value >= min && (max === null ? true : item.price[0].value <= max)) : true));

            if (searchByFilter && searchByFilter.length > 0) {
                this.setState({
                    dataDup : searchByFilter,
                    count : searchByFilter.length
                })
            } else {
                this.setState({
                    dataDup : [],
                    count : 0
                })
            }
        }else {
            this.setState({
                dataDup : data,
                count : data.length
            })
        }
    }

    keywordFlag() {
        const {data, searchKeyword} = this.state;
        if(searchKeyword){
            const searchByFilter = data.filter(item => item.name.toLowerCase().includes(searchKeyword.toLowerCase()))
            if (searchByFilter && searchByFilter.length > 0) {
                this.setState({
                    dataDup : searchByFilter,
                    count : searchByFilter.length
                })
            } else {
                this.setState({
                    dataDup : [],
                    count : 0
                })
            }
        }else {
            this.setState({
                dataDup : data,
                count : data.length
            })
        }
    }

    handleSearchByKeyword(e) {
        const {name, value} = e.target
        this.setState({...this.state, searchKeyword: value})
    }

    handleSearchByFilter(e, name) {
        this.setState({
                ...this.state, searchFilter: {
                    ...this.state.searchFilter,
                    [name]: e
                }
            }
        )
    }

    handleCancel(_this) {
        //console.log('a')
        _this.setState({ visible: false });
        localStorage.setItem('isVisible', false);

    }

    mentorLogin = async (_this) =>{
        console.log('mentor-login');
        displayMentorDashboard=true;
        let userid= localStorage.getItem('id');
        const res = await becomeMentor(userid);
        if (res?.success){
            this.setState({visible:false});
            localStorage.setItem('isMentor',true);
            localStorage.setItem('isVisible', false);
            localStorage.setItem('userType','mentor');
            window.location.href="/mentor-dashboard"
        }
    };

    userLogin(_this) {
        displayMenteeDashboard=true;
        _this.setState({visible:false});
        localStorage.setItem('isVisible', false);
        localStorage.setItem('userType','user');
        window.location.href="/tasklist"

    }


    render() {
        /* if(this.state.authToken) { */
        const { isPurchasedModal, sameTaskPurchase } = this.state;
        return(
            <div className="fullPage" >
                <div className="main_div">
                    <Header />
                </div>
                <div className="container listing-container">
                    <div className="col-md-12 col-sm-12 col-xs-12 no-padding-div">
                        <div className="col-md-3 col-sm-4 col-xs-12 no-left-padding-div">
                            {/*<div className="col-md-12 col-xs-12 col-sm-12 filters-content">*/}
                            {/*    <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div mentee-category">*/}
                            {/*        <p className="filter-title">Filters</p>*/}
                            {/*        <p className="categories-title">Categories</p>*/}
                            {/*        <div className="filter-category">*/}
                            {/*            <Collapse bordered={false} defaultActiveKey={['1']}>*/}
                            {/*                {this.renderCat()}*/}
                            {/*            </Collapse>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <hr className="horizontal-line"/>*/}
                            {/*    <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div mentee-slider">*/}
                            {/*        <div className="d-flex flex-row">*/}
                            {/*            <span className="">MAX PRICE</span>*/}
                            {/*            <span className="">200</span>*/}
                            {/*        </div>*/}
                            {/*        <Slider className="" marks={marks} defaultValue={0} max={5000}*/}
                            {/*                onAfterChange={this.onAfterChange.bind(this)}/>*/}
                            {/*    </div>*/}
                            {/*    <hr className="horizontal-line"/>*/}
                            {/*    <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div mentee-level">*/}
                            {/*        <p className="difficulty">DIFFICULTY</p>*/}
                            {/*        <div>*/}
                            {/*            <input className="radio-custom" id="r1" name="radio-group" value='beginner'*/}
                            {/*                   type="radio" onClick={() => this.filterLevel('beginner')}/>*/}
                            {/*            <label htmlFor="r1" className="radio-custom-label">Beginner</label>*/}
                            {/*        </div>*/}
                            {/*        <div>*/}
                            {/*            <input className="radio-custom" id="r2" name="radio-group" value='intermediate'*/}
                            {/*                   type="radio" onClick={() => this.filterLevel('intermediate')}/>*/}
                            {/*            <label htmlFor="r2" className="radio-custom-label">Intermediate</label>*/}
                            {/*        </div>*/}
                            {/*        <div>*/}
                            {/*            <input className="radio-custom" id="r3" name="radio-group" value='advanced'*/}
                            {/*                   type="radio" onClick={() => this.filterLevel('advanced')}/>*/}
                            {/*            <label htmlFor="r3" className="radio-custom-label">Advanced</label>*/}

                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="col-md-12 col-xs-12 col-sm-12 how-it-works">
                                <p className="how-it-works-title">HOW IT WORKS</p>
                                <p className="choose-a-task"><img src={One}/>&nbsp;&nbsp;Choose a task</p>
                                <p className="choose-a-task"><img src={Two}/>&nbsp;&nbsp;Submit your answer</p>
                                <p className="choose-a-task"><img src={Three}/>&nbsp;&nbsp;Get reviewed by a verified
                                    Mentor</p>
                            </div>
                            <hr className="horizontal-line"/>
                        </div>


                        <div className="col-md-9 col-sm-8 col-xs-12 no-right-padding-div">
                            <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div search_div">
                                <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                                    <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div difficulty-category-box mb-15 d-flex w-100">
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <label
                                                    htmlFor='Difficulty'
                                                >
                                                    Difficulty:
                                                </label>
                                            </div>
                                            <div style={{marginLeft:'10px'}}>
                                                <Select
                                                    id='Difficulty'
                                                    className="selectpicker"
                                                    style={{width: 200,marginBottom:'0'}}
                                                    placeholder="Select a Difficulty"
                                                    onChange={(e) => this.handleSearchByFilter(e, "difficulty")}
                                                    // value={this.state.searchFilter.difficulty}
                                                >
                                                    <Option value="">Select</Option>
                                                    <Option value="Beginner">Beginner</Option>
                                                    <Option value="Intermediate">Intermediate</Option>
                                                    <Option value="Advanced">Advanced</Option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <label
                                                    htmlFor='Category'
                                                >
                                                    Category:
                                                </label>
                                            </div>
                                            <div style={{marginLeft:'10px'}}>
                                                <Select
                                                    id='Category'
                                                    className="selectpicker mb-0"
                                                    style={{width: 200,marginBottom:'0'}}
                                                    placeholder="Select a Category"
                                                    onChange={(e) => this.handleSearchByFilter(e, "category")}
                                                    // value={this.state.searchFilter.category}
                                                >
                                                    <Option value="">Select</Option>
                                                    {
                                                        this.renderCat().map((item, index) => (
                                                            <Option
                                                                value={item.props.header}>{item.props.header}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 w-100 d-flex align-items-center justify-content-center col-sm-12 col-xs-12 mb-15 no-left-padding-div">
                                        <div className='d-flex gep-9' style={{marginLeft : "60px"}}>
                                            <div style={{marginBottom: "unset"}}>
                                                <label
                                                    htmlFor='Price'
                                                >
                                                    Price:
                                                </label>
                                            </div>
                                            <div style={{marginBottom: "unset"}}>
                                                <Select
                                                    id='Price'
                                                    className="selectpicker marginBottom-unset"
                                                    style={{width: 200}}
                                                    placeholder="Select a Price"
                                                    onChange={(e) => this.handleSearchByFilter(e, "price")}
                                                    // value={this.state.searchFilter.price}
                                                >
                                                    <Option value="">Select</Option>
                                                    <Option value="0-20">0-20 USD</Option>
                                                    <Option value="21-50">21-50 USD</Option>
                                                    <Option value="50+">50+ USD</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-12 d-flex search-filter-btn w-100 mb-15'>
                                        <button
                                            className='search-by-filter w-25'
                                            onClick={() => this.filterFlag()}
                                        >Search By Filter</button>
                                    </div>
                                    <div className='col-md-9 margin-top-10'>
                                        <form className="navbar-form" role="search">
                                            <div className="input-group add-on">
                                                <input className="form-control search-box" placeholder="Search" name="srch-term" value={this.state.searchKeyword}
                                                       type="text" onChange={(e) => this.handleSearchByKeyword(e)}/>
                                            </div>
                                        </form>
                                    </div>
                                    <div className='col-md-3 margin-top-10'>
                                        <button
                                            className='search-by-keyword'
                                            onClick={() => this.keywordFlag()}>Search By Keyword</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div listing-section">
                                <p className="avaiable-tasks">Available Tasks({this.state.count})</p>
                                <div
                                    className="col-md-6 col-sm-6 col-xs-12 no-right-padding-div float-right text-right sort_field">
                                    <div className="drop_list">
                                        <Select
                                            className="selectpicker"
                                            id="sort"
                                            showSearch
                                            style={{width: 200}}
                                            placeholder="Sort by: Most Recent"
                                            // optionFilterProp="children"
                                            onChange={this.handleChange.bind(this)}
                                        >
                                            <Option value="sortByDate" active>Most Recent</Option>
                                            <Option value="sortByPrice">Price</Option>
                                        </Select>
                                    </div>
                                </div>
                                {this.renderTask()}
                            </div>
                        </div>
                    </div>
                </div>
                <Modal wrapClassName="taskListModal" title="Purchases List" visible={isPurchasedModal}
                       onCancel={() => this.setState({isPurchasedModal: false})}>
                    <div style={{
                        overflowY: sameTaskPurchase.length <= 3 ? "hidden" : "scroll",
                        height: sameTaskPurchase.length <= 3 ? "auto" : "500px"
                    }} id="custom-scroll-mentor" className="custom-scroll-tasks">
                        {
                            sameTaskPurchase && sameTaskPurchase.length ? sameTaskPurchase.map(item => {
                                const username = item && item.mentor && item.mentor.user && item.mentor.user;
                                const completedTask = item && item.taskEngagement && item.taskEngagement;
                                return (
                                    <div>
                                        <div className="purchase-history row mb-1">
                                            <div className="col-sm-6"><b>Task Purchased Date:</b></div>
                                            <div
                                                className="col-sm-6">{moment(item && item.createdAt).format("MM/DD/YYYY")}</div>
                                        </div>
                                        <div className="purchase-history row mb-1">
                                            <div className="col-sm-6"><b>Task Completed Date:</b></div>
                                            <div
                                                className="col-sm-6">{(completedTask.endDate && moment(completedTask.endDate).format("MM/DD/YYYY")) || "-"}</div>
                                        </div>
                                        <div className="purchase-history row mb-1">
                                            <div className="col-sm-6"><b>Paired Mentor:</b></div>
                                            <div
                                                className="col-sm-6">{username?.firstName + " " + username?.lastName}</div>
                                        </div>
                                        <div className="purchase-history row mb-1">
                                            <div className="col-sm-6"><b>Task Engagement page link:</b></div>
                                            <div className="col-sm-6"><Link to={`/task-engagement/${completedTask?._id}`}
                                                                            className="text-primary">Click here</Link>
                                            </div>
                                        </div>
                                        <hr/>
                                    </div>)
                            }) : <h6>No Purchase history available</h6>
                        }
                    </div>
                </Modal>
                <div className="popup">
                    {localStorage.getItem("isVisible") && <UserModal visible={this.state.visible}
                                                                     handleCancel={() =>this.handleCancel(this)}
                                                                     mentorLogin={() =>this.mentorLogin(this)}
                                                                     userLogin={() =>this.userLogin(this)}
                    />}
                </div>
            </div>
        );
    }/* else {
        return (
            window.location='/redirect'
        );
    }
}*/
}
export default withRouter(MenteeListing);
