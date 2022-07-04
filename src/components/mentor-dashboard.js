import React from 'react';
import Header from './login/header';
import moment from 'moment';
import { Tab, Row, Nav, NavItem } from 'react-bootstrap';
import MyTask from './my_task';
import {mentorPaymentHistory} from "./utils/_data";
import Loader from "./common/Loader";
require('../styles/mentor-dashboard.css');

class MentorDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskList: [],
            key: 1,
            data: [],
            userName:'',
            userData:[],
            authToken:'',
            url:'',
            razorpay:[],
            MyTask:[],
            totalPayment:0,
        loading:true};
        this.handleSelect = () => this.handleSelect;
    }

    componentDidMount() {
        let isLoggedIn = localStorage.getItem('isLoggedIn');
		let authToken = null;
        let userData = [];
        let userDetails = JSON.parse(localStorage.getItem('userData'));
        console.log("userDetails", userDetails);
        //console.log(mentorID,typeof(mentorID))
		if (isLoggedIn == 'true')  {
			 authToken = localStorage.getItem('authToken');
			 userData = JSON.parse(localStorage.getItem('userData'));
			 //console.log(userData);
			 this.setState({
						authToken:authToken,
						userData:userData,
                        url:userData.profilePicUrl,
                        userName:userData.firstName+" "+userData.lastName

					});
       }
       if(userDetails.mentor != 'null' || userDetails.mentor !== '' || userDetails.mentor !== undefined) {
           this.paymentHistory(userDetails.mentor);
        // axios.get(BaseUrl.base_url + "/api/v1/mentor/payment/history/"+ userDetails.mentor,
        //     {
        //         'headers': {
        //             "Content-Type": "application/json",
        //             "Authorization": localStorage.getItem('authToken')
        //         }
        //     }).then((response) => {
        //         console.log({ response: response });
        //         this.setState({ data: response.data.result,
        //                         totalPayment:this.totalPayment(response.data.result) });
        //     }
        //     ).catch(function (error) {
        //         console.log({ error: error });
        //     });
        }
    }

    paymentHistory = async (id) => {
        const response = await mentorPaymentHistory(id);
        if (response?.data?.success) {
            this.setState({
                data: response.data.result,
                totalPayment: this.totalPayment(response?.data?.result),
                loading: false
            });
        } else {
            console.log("error------->");
        }
    };

    //task Listing
    renderTaskList(obj,index) {
        var date = moment(obj?.createdAt);
        return (
            <div className="col-md-12 col-sm-12 col-xs-12 mentee-task-cards" key={index}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                    <div className="col-md-2 col-sm-4 col-xs-12">
                        <p className="taskid">{obj?.razorPay?.razorpayId || '-'}</p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-12">
                        <p className="taskid">{obj?.paypal?.transactionId || '-'}</p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-12">
                        <p className="taskid">&#8377; {obj?.taskPurchaseType === 'credits' ? obj?.credits : obj?.currency}</p>
                    </div>
                    <div className="col-md-3 col-sm-4 col-xs-12">
                        <p className="payment-history-table">{obj?.task?.name}</p>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                        <p className="payment-history-table">{date?.format('LLL')}</p>
                    </div>
                    {/*<div className="col-md-1 col-sm-1 col-xs-12">*/}
                    {/*    <p className="payment-history-table">&#8377;{obj.task.credits}</p>*/}
                    {/*</div>*/}
                </div>
            </div>
        )
    }

    renderMyTasks() {
        return (
            <div>
                 <MyTask />
            </div>
        )
    }

    renderTask() {
        if (this.state.data) {
            return (
                this.state.data.map((obj,index) => {
                    return this.renderTaskList(obj,index)
                })
            )
        } else {
            return (<p>Not found</p>);
        }
    }

    totalPayment(arr){
        var totalPrice = 0;
        arr.map((obj)=> {
            totalPrice = totalPrice + obj?.task?.credits;
        });
        return totalPrice;
    }

    handleSelect(key) {
        alert(`selected ${key}`);
        this.setState({ key });
    }

    render() {
        if (this.state.loading) return <Loader/>;
        return (
            <div>
                <div className="main_div">
                    <Header />
                </div>
                <div>
                    <div className="col-md-12 col-sm-12 col-xs-12 no-padding-div content-background">
                        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                            <Row className="clearfix">
                                <div className="col-md-3 col-sm-4 col-xs-12 no-left-padding-div ">
                                    <div className="col-md-12 col-sm-12 col-xs-12 no-padding-div mentee-sidebar" >
                                        <div className="subdiv">
                                            <div className="col-md-4 col-sm-4 col-xs-4 text-center">
                                                <img src={this.state?.url} className="img-circle" alt="mentee" width="60" height="60" />
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-6 no-padding-div mentee-name">{this.state?.userName}</div>
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12 no-padding-div mentee-pay-sidemenu">
                                            <Nav bsStyle="pills" stacked>
                                                <NavItem eventKey="first">My Tasks</NavItem>
                                                <NavItem eventKey="second">Payment History</NavItem>
                                            </Nav>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-9 col-sm-8 col-xs-12 no-padding-div">
                                    <div className="col-md-12 col-sm-12 col-xs-12 payment-listing-section no-left-padding-div" >
                                        <Tab.Content animation>
                                            <Tab.Pane eventKey="first">{this.renderMyTasks()}</Tab.Pane>
                                            <Tab.Pane eventKey="second"><p className="col-md-6 col-sm-6 col-xs-12 payment-history">Payment History</p>
                                                <p className="col-md-6 col-sm-6 col-xs-12 total-spent">Total Spent: &#8377;&nbsp;{localStorage.getItem("mentorId") === "null" ? 0 : this.state?.totalPayment} </p>
                                                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                                                    <div className="col-md-2 col-sm-4 col-xs-12">
                                                        <p className="task-heading">RAZORPAY ID</p>
                                                    </div>
                                                    <div className="col-md-2 col-sm-4 col-xs-12">
                                                        <p className="task-heading">PAYPAL ID</p>
                                                    </div>
                                                    <div className="col-md-2 col-sm-4 col-xs-12">
                                                        <p className="task-heading">CREDITS</p>
                                                    </div>
                                                    <div className="col-md-3 col-sm-4 col-xs-12">
                                                        <p className="task-heading">TASK NAME</p>
                                                    </div>
                                                    <div className="col-md-3 col-sm-3 col-xs-12">
                                                        <p className="task-heading">DATE</p>
                                                    </div>
                                                    {/*<div className="col-md-1 col-sm-1 col-xs-12">*/}
                                                    {/*    <p className="task-heading">PAYMENT</p>*/}
                                                    {/*</div>*/}
                                                </div>{this.renderTask()}</Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </div>
                            </Row>
                        </Tab.Container>;
                    </div>
                </div>
            </div>
        );
    }
}
export default MentorDashboard
