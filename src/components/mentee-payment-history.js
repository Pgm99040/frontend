import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Header from './login/header';
import moment from 'moment-timezone';
import { Tab, Tabs, Row, Nav, NavItem } from 'react-bootstrap';
import {Rate, Progress, Table} from 'antd';
import MongoDBImage from '../images/bitmap.png';
import CheckedImage from '../images/checked.png';
import User from '../images/user.png';
import {
    fetchAllLiveSessions,
    getCreditsOfUser,
    getIteratorByBatch,
    myTask,
    paymentHistory,
    purchaseBatchesList,
    getAllBookingSessionWithEmail,
    getAllBookSession,
    getBatches
} from "./utils/_data";
import Loader from "./common/Loader";
require('../styles/mentee-payment.css');

const columns = [
    // { title: 'Date', dataIndex: 'date', key: 'date' },
    {title: 'Name', dataIndex: 'title', key: 'title'},
    {title: 'Seat', key: 'seats', dataIndex: 'seats'},
    {title: 'Description', dataIndex: 'description', key: 'description', width: "500px"},
    {title: 'Price', dataIndex: 'price', key: 'price'}
];
class MenteePaymentHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskList: [],
            data: [],
            userName: '',
            userData: [],
            authToken: '',
            url: '',
            razorpay: [],
            ongoingTask: [],
            completedTask: [],
            bookSession: [],
            batchItem: [],
            bookedSession: [],
            liveSessionData: [],
            completeLiveSessionData: [],
            completedSession: [],
            batchesList: [],
            batchesDetails: [],
            purchaseSession: [],
            iteratorList: [],
            expandedBatchRowKey: [],
            sessionCompleteOrNot: {},
            length: 0,
            totalPayment: 0,
            creditPurchase:'',
            credits:0,
            liveSessionId: null,
            isLoading: true,
            activeKey:"MyTasks"
        };
        this.handleSelect = () => this.handleSelect;
        this.state = {
            key: 1
        };
        this.handleSelect = () => this.getResult;
    }

    componentDidMount() {
        let isLoggedIn = localStorage.getItem('isLoggedIn');
        let authToken = null;
        let userData = [];
        userData = JSON.parse(localStorage.getItem('userData'));
        if (isLoggedIn == 'true') {
            authToken = localStorage.getItem('authToken');
            console.log(userData,"userdata");
            this.setState({
                authToken: authToken,
                userData: userData,
                url: userData.profilePicUrl,
                userName: userData.firstName + " " + userData.lastName,
            });
        }
        this.showBatch();
        this.getCredit();
        this.getPaymentHistory();
        this.myTasks();
        this.getAllBookingSessionList(userData && userData.email);
        // this.getAllSessions(userData && userData.email);
        this.getAllOngoingList(userData && userData.email);
        this.getAllCompletedSession(userData && userData.email);
        // this.getAllBookBatch();
    }

    getAllOngoingList = async (email) =>{
        let batchesList = [];
        let data = [];
        const d = new Date();
        const date = moment(d).toString();
        const payload = {
                email,
                location: moment.tz.guess(),
                date,
                sessionType: "onGoing"
            };
        this.setState({isLoading: true});
        const res = await purchaseBatchesList(payload);
        console.log("res-------------->>>", res)
        if (res?.data?.success){
            this.setState({bookedSession: res.data.result || [], isLoading: false});
            res && res.data && res.data.result && res.data.result.map((item, i)=>{
                data.push({
                    key: i + 1,
                    id: item._id,
                    title: item && item.title,
                    description: item && item.description,
                    price: item.price,
                    seats : item.seats
                });
            })
            this.setState({liveSessionData: data});
            this.setState({batchesDetails: batchesList});
        }
    };

    getAllCompletedSession = async (email) =>{
        let data = [];
        const d = new Date();
        const date = moment(d).toString();
        const payload = {
            email,
            location: moment.tz.guess(),
            date,
            sessionType: "completed"
        };
        this.setState({isLoading: true});
        const res = await purchaseBatchesList(payload);
        console.log("res-------------->>>", res);
        if (res?.data?.success){
            this.setState({completedSession: res.data.result || [], isLoading: false});
            res && res.data && res.data.result && res.data.result.map((item, i)=>{
                data.push({
                    key: i + 1,
                    id: item._id,
                    title: item && item.title,
                    description: item && item.description,
                    price: item.price,
                    seats : item.seats
                });
            });
            this.setState({completeLiveSessionData: data});
        }
    };

    getAllSessions = async (email) =>{
        this.setState({isLoading: true});
        const res = await fetchAllLiveSessions(email);
        let data = [];
        let completed = [];
        let batchesList = [];
        let completedBatchesList = [];
        if (res?.data?.success){
            this.setState({bookedSession: res.data.result || [], isLoading: false});
            const validSession = this.onGoingLiveSession(res.data.result || []);
            if (Object.keys(validSession).length){
                res && res.data && res.data.result && res.data.result.map((item, i)=>{
                    const statusArray = validSession && validSession[item._id];
                    if (statusArray.includes(true)){
                        data.push({
                            key: i + 1,
                            id: item._id,
                            title: item && item.title,
                            description: item && item.description,
                            price: item.price
                        });
                        batchesList.push(item && item.batches);
                    } else {
                        completed.push({
                            key: i + 1,
                            id: item._id,
                            title: item && item.title,
                            description: item && item.description,
                            price: item.price
                        });
                        completedBatchesList.push(item && item.batches);
                    }
                });
            }
            this.setState({liveSessionData: data, completeLiveSessionData: completed});
            this.setState({batchesDetails: batchesList});
        } else {
            console.log("error--------->>>");
            this.setState({isLoading: false});
        }
    };

    onGoingLiveSession = (data) =>{
        let validSession = {};
        const d = new Date();
        const time = d.toLocaleTimeString();
        const todayDate = d.toUTCString().slice(0, 16);
        const startTime = moment(time, "HH:mm:ss a");
        data && data.length && data.map((item, i) =>{
            let flag = [];
            item && item.batches && item.batches.length && item.batches.map((batch, index) =>{
                batch && batch.iterateList && batch.iterateList.length && batch.iterateList.map(iterator =>{
                    const dbDate = (iterator && iterator.date).slice(0, 16);
                    console.log("---->>>>", todayDate <= dbDate);
                    var endTime = moment(iterator && iterator.duration && iterator.duration.split("-")[1], "HH:mm:ss a");
                    var dur = moment.duration(endTime.diff(startTime));// duration in hours
                    var hours = parseInt(dur.asHours());// duration in minutes
                    var minutes = parseInt(dur.asMinutes())%60;
                    if ((moment(todayDate) <= moment(dbDate)) && (hours >= 0)){
                        flag.push(true);
                    }
                    if (moment(todayDate) < moment(dbDate)){
                        console.log("today above----->>>>", );
                        flag.push(true);
                    }
                    if(moment(todayDate) > moment(dbDate)){
                        flag.push(false);
                    }
                })
            });
            validSession = {
                ...validSession,
                [item._id]: flag
            }
        });
        this.setState({sessionCompleteOrNot: validSession});
        return validSession;
        console.log("validSession", validSession);
    };
    //  getAllBookBatch = async () =>{
    //     const data = await getAllBookSession();
    //     console.log("data-----====", data);
    //     if (data && data.success){
    //         this.setState({bookSession : data && data.data && data.data.response});
    //     } else {
    //         console.log("error--------------->>")
    //     }
    // };

    getCredit = async () =>{
        const data = {userId:localStorage.getItem('id')};
        const response = await getCreditsOfUser(data);
        if (response?.success){
            this.setState({
                credits:response.data.credits
            });
        } else {
            console.log("error---->");
        }
        // await axios.post(BaseUrl.base_url + "/api/v1/getCreditsOfUser/", {userId:localStorage.getItem('id')},
        //     {
        //         'headers': {
        //             "Content-Type": "application/json",
        //             "Authorization": localStorage.getItem('authToken')
        //         }
        //     }).then((response) => {
        //         this.setState({
        //             credits:response.data.credits
        //         });
        //     }
        // ).catch(function (error) {
        //     console.log({ error: error });
        // });
    };

    myTasks = async () =>{
        const id = localStorage.getItem('id');
        const response = await myTask(id);
        if (response?.data?.status_code === 200){
            const {objArray, ongoing, completed} = this.getResult(response.data.result);
            if ((ongoing !== [] || ongoing !== undefined) || (completed !== [] || ongoing !== undefined)){
                this.setState({ ongoingTask: ongoing, completedTask:completed, length: response.data.result.length });
            }
        }else {
            console.log("error------->");
        }
        // axios.get(BaseUrl.base_url + "/api/v1/te/user/mytask/" + localStorage.getItem('id'),
        //     {
        //         'headers': {
        //             "Content-Type": "application/json",
        //             "Authorization": localStorage.getItem('authToken')
        //         }
        //     }).then((response) => {
        //         console.log({ response });
        //         console.log(response.data,"RESPONSE MENTEE")
        //         this.setState({ MyTask: this.getResult(response.data.result), length: response.data.result.length });
        //     }
        // ).catch(function (error) {
        //     console.log({ error: error });
        // });
    };

    getPaymentHistory = async () =>{
        let id = localStorage.getItem('id');
        const response = await paymentHistory(id);
        if (response?.data?.status_code === 200){
            this.setState({
                data: response.data.result,
                razorpay: response.data.result.taskPurchaseType == "credits" ? [] : response.data.result.razorPay,
                totalPayment: this.totalPayment(response.data.result),
                creditPurchase:response.data.creditHistory
            });
        } else {
            console.log("error------>");
        }
        // axios.get(BaseUrl.base_url + "/api/v1/user/payment/history/" + localStorage.getItem('id'),
        //     {
        //         'headers': {
        //             "Content-Type": "application/json",
        //             "Authorization": localStorage.getItem('authToken')
        //         }
        //     }).then((response) => {
        //         this.setState({
        //             data: response.data.result,
        //             razorpay: response.data.result.taskPurchaseType == "credits" ? [] : response.data.result.razorPay,
        //             totalPayment: this.totalPayment(response.data.result),
        //             creditPurchase:response.data.creditHistory
        //         });
        //     }
        // ).catch(function (error) {
        //     console.log({ error: error });
        // });
    };

    getAllBookingSessionList = async (email) =>{
      const res = await getAllBookingSessionWithEmail(email);
      if (res?.data?.success){
          this.setState({purchaseSession: res.data.response || []})
      } else {
          console.log("error")
      }
        console.log("getAll------------------------", res);
    };
    onViewTask(obj){
        this.props.history.push(`/task-engagement/${obj && obj.payment && obj.payment.taskEngagement}`);
        // window.location.href=`/task-engagement/${obj && obj.payment && obj.payment.taskEngagement}`;
    }
    renderMyTask(obj, index) {
        var date = moment(obj.createdAt);
        const { value } = this.state;
        var started;
        var inProgress;
        var end;
        var startedStatus;
        var inProgressStatus;
        var progressDiv = true;
        var completedTextDiv = false;
        var taskInProgress = true;
        var taskClosed = false;
        var statusText;
        var endDate;
        var display = {
            display: 'none'
        };
        var completedTextDiv = "";
        if (obj.status === "started") {
            started = 100;
            inProgress = 0;
            end = 0;
            startedStatus = "active";
            statusText = "Started";
        } else if (obj.status === "inprogress") {
            started = 100;
            inProgress = 100;
            end = 0;
            inProgressStatus = "active";
            statusText = "In Progress";
        } else if (obj.status === 'completed') {
            statusText = "Closed";
            progressDiv = false;
            completedTextDiv = true;
            taskInProgress = false;
            taskClosed = true;
            endDate = moment(obj.endDate).format('LL')

        }

        return (
            <div className="col-m-12 col-sm-12 col-xs-12 task-cards" key={index}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                    <div className="col-md-2 col-sm-3 col-xs-12">
                        <img className="taskIcon logo_image" src={obj && obj.task && obj.task.imageUrl} alt={'image_logo'} />
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-12 no-left-padding-div">
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <Link onlyActiveOnIndex to={`/task-engagement/${obj && obj.payment && obj.payment.taskEngagement}`}><span className="task_name">{obj?.task?.name}</span></Link>
                                <div className="divider"></div>
                                <span className="task_category" dangerouslySetInnerHTML={{__html: obj && obj.task && obj.task.description || "-"}} />
                            </div>

                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div d-flex justify-content-between">
                                <div>
                                    <span className="bulletin" >&bull;</span>
                                    <span className="task_difficulty">{obj && obj.task && obj.task.difficultyLevel}</span>
                                    <span className="bulletin" >&bull;</span>
                                    <span className="taskInProgress" style={{ display: taskInProgress ? 'block' : 'none' }}>{statusText}</span>
                                </div>
                                <div>
                                    <span className="taskClosed" style={{ display: taskClosed ? 'block' : 'none' }}>{statusText}</span>&nbsp;
                                    <span className="fee-paid float-right" >Paid {`${(obj && obj.payment && obj.payment.taskPurchaseType ) === 'currency' ? obj && obj.payment && obj.payment.currency : obj && obj.payment && obj.payment.credits + ' ' + 'Credits'}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <p className="task_desc" dangerouslySetInnerHTML={{__html: obj && obj.task && obj.task.tinyDescription}} />
                            <div style={{ display: progressDiv ? 'block' : 'none' }}>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div firstProgressBar">
                                    <Progress percent={started} showInfo={false} status={startedStatus} />
                                    <p className='progress-text text-left'>Started</p>
                                </div>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div center-progress-bar secondProgressBar">
                                    <Progress percent={inProgress} showInfo={false} status={inProgressStatus} />
                                    <p className='progress-text text-center'>In Progress</p>
                                </div>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div thirdProgressBar">
                                    <Progress percent={end} showInfo={false} />
                                    <p className='progress-text text-right'>End</p>
                                </div>
                            </div>
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <div style={{ display: completedTextDiv ? 'block' : 'none' }} className="col-md-6 col-xs-6 col-sm-6 no-padding-div">
                                <p className="completedTask"><img className="checkedImg" src={CheckedImage} />Completed on {endDate}</p>
                            </div>
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <Link onlyActiveOnIndex to={`/task-engagement/${obj && obj.payment && obj.payment.taskEngagement}`}><button className="view-task-detail">View</button></Link>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-xs-12 no-right-padding-div">

                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <p className="mentor-assigned" >Mentor Assigned</p>
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12 p-bottom-10 no-right-padding-div">
                            <div className="col-md-3 col-sm-4 col-xs-12 no-padding-div">
                                {(obj && obj.mentor && obj.mentor.user && obj.mentor.user.profilePicUrl) === "" ? <img src={User} className="image-size" /> : <img src={obj && obj.mentor && obj.mentor.user && obj.mentor.user.profilePicUrl} className="image-size" />}
                            </div>
                            <div className="col-md-9 col-sm-8 col-xs-12 no-padding-div no-right-padding-div">

                                <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                    {obj && obj.endDate && <p className="mentor-name">Task completion date: {endDate}</p>}
                                    {obj && obj.feedback && obj.feedback.mentorFeedback && <p className="mentor-name">{obj.feedback.mentorFeedback}</p>}
                                    {obj && obj.mentor && obj.mentor.user && obj.mentor.user.firstName === "" ? <p className="mentor-name">{obj && obj.mentor && obj.mentor.user && obj.mentor.user.firstName}&nbsp;{obj && obj.mentor && obj.mentor.user && obj.mentor.user.lastName}</p> :<Link onlyActiveOnIndex to={{pathname:`/mentor/${obj && obj.mentor && obj.mentor.user && obj.mentor.user.userName}`,state:obj && obj.mentor && obj.mentor.user && obj.mentor.user.mentor}}> <a><p className="mentor-name">{obj && obj.mentor && obj.mentor.user && obj.mentor.user.firstName}&nbsp;{obj && obj.mentor && obj.mentor.user && obj.mentor.user.lastName}</p></a></Link>}
                                    {obj && obj.mentor && obj.mentor.user && obj.mentor.user.currentWorkTitle === "" ? <p className="mentor-pos" /> : <p className="mentor-pos" >{obj && obj.mentor && obj.mentor.user && obj.mentor.user.currentWorkTitle}</p>}
                                    {obj && obj.mentor && obj.mentor.user && obj.mentor.user.mentor === "" ? <Rate allowHalf defaultValue={0} value="" disabled /> : <Rate allowHalf defaultValue={0} value={(Math.round(obj.rating.user2mentor * 2)) / 2} disabled />}
                                </div>
                            </div>

                        </div>
                        {/* <div className="col-md-12 col-sm-12 col-xs-12">
                                <p className="fee-paid" >Paid ₹300</p>
                            </div> */}
                    </div>
                </div>
            </div>
        )
    }


    //task Listing
    renderPaymentHistory(obj, index) {
        var date = moment(obj.createdAt);
        return (
            <div className="col-md-12 col-sm-12 col-xs-12 mentee-task-cards" key={index}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                    <div className="col-md-2 col-sm-2 col-xs-12">
                        <p className="taskid">{obj?.razorPay?.razorpayId != null ? obj?.razorPay?.razorpayId : "NA"}</p>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                        <p className="taskid">{obj?.paypal?.transactionId != null ? obj?.paypal?.transactionId : "NA"}</p>
                    </div>
                    <div className="col-md-1 col-sm-1 col-xs-12">
                        <p className="payment-history-table">{obj?.taskPurchaseType === "credits" ? obj?.credits : "NA"}</p>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                        <p className="payment-history-table">{obj?.task?.name || '-'}</p>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-12">
                        <p className="payment-history-table">{date?.format('LLL')}</p>
                    </div>
                    <div className="col-md-1 col-sm-1 col-xs-12">
                        <p className="payment-history-table">{obj?.taskPurchaseType === "currency" ? obj?.currency : "NA"}</p>
                    </div>
                </div>
            </div>
        )
    }


    renderSessionPurchaseHistory(obj, index) {
        var date = moment(obj?.createdAt);
        return (
            <div className="col-md-12 col-sm-12 col-xs-12 mentee-task-cards" key={index}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                    <div className="col-md-4 col-sm-4 col-xs-12">
                        <p className="taskid">{obj?.bookingTransactionId || "-"}</p>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                        <p className="payment-history-table">{obj && obj.LiveSessionId && obj.LiveSessionId.title}</p>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                        <p className="payment-history-table">{date?.format('LLL')}</p>
                    </div>
                </div>
            </div>
        )
    }
    renderCreditHistory(obj, index) {
        console.log("credit--->>>", obj)
        var date = moment(obj.createdAt);
        return (
            <div className="col-md-12 col-sm-12 col-xs-12 mentee-task-cards" key={index}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                    <div className="col-md-4 col-sm-4 col-xs-12">
                        <p className="taskid">{obj?.razorPay?.razorpayId === null ? obj?.paymentMode : obj?.razorPay?.razorpayId}</p>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                        <p className="payment-history-table">{obj?.credits} credits purchased</p>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                        <p className="payment-history-table">{date?.format('LLL')}</p>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-12">
                        <p className="payment-history-table">{obj?.razorPay?.razorpayId === null ? 'Free' : obj?.amountPaid}</p>
                    </div>
                </div>
            </div>
        )
    }

    getResult(objArray) {
        let ongoing = [];
        let completed = [];
        // var results = objArray && objArray.filter(obj => obj.status.toLowerCase().includes("inprogress") || obj.status.toLowerCase().includes("started"));
        // objArray = objArray && objArray.filter(function (obj) {
        //     console.log("results.indexOf(obj) == -1", results.indexOf(obj) == -1)
        //     return results.indexOf(obj) == -1;
        // })
        //
        // console.log("results", objArray)
        //
        // results && results.map((obj) =>{
        //     objArray.unshift(obj);
        // });

       objArray && objArray.map(obj =>{
           console.log("Check", obj.status.toLowerCase().includes("inprogress"), obj.status.toLowerCase().includes("started"))
           if (obj.status.toLowerCase().includes("inprogress") || obj.status.toLowerCase().includes("started")){
               ongoing.push(obj);
           } else {
               completed.push(obj);
           }
       });
        console.log("ongoing--->>>", ongoing, completed)
        return {objArray, ongoing, completed};
    }


    renderOngoing(){
        const { ongoingTask } = this.state;
        // console.log("ongoing", ongoing, completedTask)
        if (ongoingTask && ongoingTask.length > 0) {
            return (
                ongoingTask && ongoingTask.length && ongoingTask.map((obj, index) => {
                    return this.renderMyTask(obj, index)
                })
            )
        }
    }
    renderCompleted(){
        const { completedTask } = this.state;
        if(completedTask && completedTask.length > 0) {
            return (
                completedTask && completedTask.length && completedTask.map((obj, index) => {
                    return this.renderMyTask(obj, index)
                })
            )
        }

    }
      renderTask() {


    }

    renderPayment(type) {
     if(type=="task"){
        if (this.state.data) {
            return (
                this.state.data.map((obj, index) => {
                    return this.renderPaymentHistory(obj, index)
                })
            )
        } else {
            return (<p>Not found</p>);
        }
     } else if (type=="credit"){
        if (this.state.creditPurchase) {
            return (
                this.state.creditPurchase.map((obj, index) => {
                    return this.renderCreditHistory(obj, index)
                })
            )
        } else {
            return (<p>Not found</p>);
        }
     } else {
         if (this.state.purchaseSession){
             return (
                 this.state.purchaseSession.map((obj, index) => {
                     return this.renderSessionPurchaseHistory(obj, index)
                 })
             )
         } else {
             return (<p>Not found</p>);
         }
     }


    }

    totalPayment(arr) {
        var totalPrice = 0;
        arr.map((obj) => {
            totalPrice = totalPrice + obj?.task?.credits;
        });
        return totalPrice;
    }

    handleSelect(key) {
        this.setState({ activeKey:key });
    }

    liveSessionDetails = () =>{
        const { liveSessionData, bookedSession } = this.state;
        bookedSession && bookedSession.length && bookedSession.map((item, i) =>{
            liveSessionData.push({
                key: i + 1,
                id: item._id,
                title: item && item.title,
                description: item && item.description,
                price: item.price
            })
        });
    };
     getAllIteratorByBatch = async (id) =>{
        const res = await getIteratorByBatch(id);
        if (res?.data?.msg === "success"){
            this.setState({iteratorList: res.data.response});
        } else {
            console.log("error------>>>");
        }
        console.log("getAllIteratorByBatch----->>", res);
    };

     showBatch = async () => {
        //  const userData = JSON.parse(localStorage.getItem('userData'));
        // const res = await purchaseBatchesList(userData.email);
        // if (res?.data?.success) {
        //     this.setState({batchesList: res.data.result || []});
        //     console.log("res.data---------------------------------------", res.data)
        // }
    };
    expandedBatchRender = (record) =>{
        const { batchesDetails,bookedSession, liveSessionId } = this.state;
        console.log("record111111-----------", record)
        const IteratorColumns = [
            {title: 'Date', dataIndex: 'date', key: 'date'},
            {title: 'Time', dataIndex: 'duration', key: 'duration'},
            {title: 'Meet Link', dataIndex: 'meetLink', key: 'meetLink', render: (record) => (record !== "-" ? <a href={record} target="_blank" className="googleMeetLink">{record}</a> : "-")}
        ];
        const iteratorData = [];
        bookedSession && bookedSession.length && bookedSession.map((item, i) =>{
            item && item.batches && item.batches.length && item.batches.forEach((val, index)=>{
                if (record.id == val._id){
                    val && val.iterator && val.iterator.length && val.iterator.forEach((ele, index1) =>{
                        iteratorData.push({
                            key: index1 + 1,
                            id: ele._id || "-",
                            meetLink: ele.meetLink || "-",
                            date: ele && moment(ele.date).format("MMM DD, yyyy"),
                            duration: `${ele.duration || "-"}`
                        })
                    });
                }
            })
        });
        return <div className="col-sm-12 col-md-12">
            <Table
                columns={IteratorColumns}
                dataSource={iteratorData}
                pagination={false}
                showHeader={true}/>
        </div>;
    };

    expandedCompleteBatchRender = (record) =>{
        console.log("record------------>>>", record);
        const { bookedSession, completedSession } = this.state;
        const IteratorColumns = [
            {title: 'Date', dataIndex: 'date', key: 'date'},
            {title: 'Time', dataIndex: 'duration', key: 'duration'},
            {title: 'Meet Link', dataIndex: 'meetLink', key: 'meetLink', render: (record) => (<a href={record} target="_blank" className="googleMeetLink">{record}</a>)}
        ];
        const iteratorData = [];
        completedSession && completedSession.length && completedSession.map((item, i) =>{
            item && item.batches && item.batches.length && item.batches.forEach((val, index)=>{
                if (record.id == val._id){
                    val && val.iterator && val.iterator.length && val.iterator.forEach((ele, index1) =>{
                        iteratorData.push({
                            key: index1 + 1,
                            id: ele._id || "-",
                            meetLink: ele.meetLink || "-",
                            date: ele && moment(ele.date).format("MMM DD, yyyy"),
                            duration: ele.duration || "-"
                        })
                    });
                }
            })
        });
        return <div className="col-sm-12 col-md-12">
            <Table
                columns={IteratorColumns}
                dataSource={iteratorData}
                pagination={false}
                showHeader={true}/>
        </div>;
    };


    expandedCompleteRowRender = (record) =>{
        console.log("record batch----------->>>>>>", record);
        const { completedSession } = this.state;
        const batchColumns = [
            {title: 'Name', dataIndex: 'name', key: 'name'},
            {title: 'Seat', key: 'seat', dataIndex: 'seat'},
            {title: 'Description', dataIndex: 'description', key: 'description'}
        ];

        const batchData = [];
        completedSession && completedSession.length && completedSession.forEach((item, i) => {
            if (record.id == item._id) {
                item && item.batches && item.batches.length && item.batches.forEach((val, index) =>{
                    batchData.push({
                        key: index + 1,
                        id: val._id,
                        name: val.name || "-",
                        seat: val.capacityOfSeats || 0,
                        instructorId: val.instructorId || "-",
                        description: val.batchDescription || "-",
                    });
                });
            }
        });
        return <div className="col-sm-12 col-md-12">
            <Table
                columns={batchColumns}
                dataSource={batchData}
                expandable={{expandedRowRender: data =>this.expandedCompleteBatchRender(data)}}
                pagination={false}
                showHeader={true}/>
        </div>;
    };

    expandedRowRender = (record) =>{
        const { bookedSession } = this.state;
        const batchColumns = [
            {title: 'Name', dataIndex: 'name', key: 'name'},
            {
                title: 'Seat',
                key: 'seat',
                dataIndex: 'seat'
            },
            {title: 'Description', dataIndex: 'description', key: 'description'}
        ];

        const batchData = [];
        bookedSession && bookedSession.length && bookedSession.forEach((item, i) => {
            if (record.id == item._id) {
                item && item.batches && item.batches.length && item.batches.forEach((val, index) =>{
                    batchData.push({
                        key: index + 1,
                        id: val._id,
                        name: val.name || "-",
                        seat: val.capacityOfSeats || 0,
                        instructorId: val.instructorId || "-",
                        description: val.batchDescription || "-",
                    });
                });
            }
        });
        // this.setState({batchItem: batchData});
        return <div className="col-sm-12 col-md-12">
            <Table
                columns={batchColumns}
                dataSource={batchData}
                expandable={{expandedRowRender: data =>this.expandedBatchRender(data)}}
                pagination={false}
                showHeader={true}/>
        </div>;
    };

    batchFetchData = async (expanded, record) =>{
        console.log("record11111---->>", record);
        let keys = [];
        if (expanded){
            await this.showBatch(record.id);
            keys.push(record.key)
        }
        this.setState({expandedBatchRowKey: keys});
    };

    activeChange = (key) =>{
        console.log("key------------->>>", key);
    };

    onActiveTab = (key) =>{
        console.log("onActiveTab", key, this.props.history);
        // window.location.href = `/menteedashboard/${key}`;
        this.props.history.push(`/menteedashboard/${key}`);
    };

    render() {
        const { liveSessionData, completeLiveSessionData,isLoading, activeKey, ongoingTask, completedTask } = this.state;
        console.log("activeKey", ongoingTask, completedTask)
        if (isLoading) return <Loader/>;
        return (
            <div>
                <div className="main_div">
                    <Header />
                </div>
                <div>
                    <div className="col-md-12 col-sm-12 col-xs-12 no-padding-div content-background">
                        <Tab.Container id="left-tabs-example" defaultActiveKey={"MyTasks"} onSelect={(key) =>this.onActiveTab(key)}>
                            <Row className="clearfix">
                                <div className="col-md-3 col-sm-4 col-xs-12 no-left-padding-div ">
                                    <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div mentee-sidebar" >
                                        <div className="subdiv">
                                            <div className="col-m-4 col-sm-4 col-xs-4 text-center">
                                                <img src={this.state.url} className="img-circle" alt="mentee" width="60" height="60" />
                                            </div>
                                            <div className="col-m-6 col-sm-6 col-xs-6 no-padding-div mentee-name">{this.state.userName}</div>
                                        </div>
                                        <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div mentee-pay-sidemenu">
                                            <Nav bsStyle="pills" stacked>
                                                {/* <NavItem eventKey="first">Current Task</NavItem> */}
                                                <NavItem eventKey="MyTasks">My Tasks</NavItem>
                                                {/*<NavItem eventKey="Credits">Credits</NavItem>*/}
                                                <NavItem eventKey="PaymentHistory">Payment History</NavItem>
                                                <NavItem eventKey="LiveSessions">Live Sessions</NavItem>
                                            </Nav>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-9 col-sm-8 col-xs-12 no-padding-div">
                                    <div className="col-m-12 col-sm-12 col-xs-12 payment-listing-section no-left-padding-div" >
                                        <Tab.Content animation>
                                            {/* <Tab.Pane eventKey="first"><CurrentTask taskEngagementId={ this.props.match.params.taskId} pathName={this.props.location} /></Tab.Pane> */}
                                            <Tab.Pane eventKey="MyTasks">
                                                <h4 className="paddingBottom">My Tasks({this.state.length})</h4>
                                                <Tabs className="col-md-12 col-sm-6 col-xs-12" defaultActiveKey={1} id="purchase-history-tabs">
                                                    <Tab eventKey={1} title="Ongoing">
                                                        {(ongoingTask && ongoingTask.length) > 0 ? this.renderOngoing() : <p className="myTask-desc">You’ve not taken any tasks yet. <Link onlyActiveOnIndex to='/tasklist' ><span className="myTask-to">Browse through tasks.</span></Link> </p>}
                                                    </Tab>
                                                    <Tab eventKey={2} title="Completed">
                                                        {(completedTask && completedTask.length) > 0 ? this.renderCompleted() : <p className="myTask-desc">You’ve not taken any tasks yet. <Link onlyActiveOnIndex to='/tasklist' ><span className="myTask-to">Browse through tasks.</span></Link> </p>}
                                                    </Tab>
                                                </Tabs>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Credits">
                                            <h3>Your current available credits : {this.state.credits}</h3>
                                                <br/>
                                                <h4>To view the credits purchase history go to Payment History</h4>
                                                <br/>
                                                <a href="/purchase-credits" style={{textDecoration:"underline", "textDecorationColor": "blue","color":"blue"}}>Purchase Credits</a>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="PaymentHistory"><p className="col-md-6 col-sm-6 col-xs-12 payment-history">Purchase History</p>
                                                {/* <p className="col-md-6 col-sm-6 col-xs-12 total-spent">Total Spent: &#8377;&nbsp;{this.state.totalPayment}</p> */}
                                                {/* <p className="col-md-6 col-sm-6 col-xs-12 total-spent"></p> */}
                                                <Tabs className="col-md-12 col-sm-6 col-xs-12" defaultActiveKey={1} id="purchase-history-tabs">
                                                    <Tab eventKey={1} title="Task Purchase">
                                                        <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                                            <div className="col-md-2 col-sm-2 col-xs-12">
                                                                <p className="task-heading">RAZORPAY ID</p>
                                                            </div>
                                                            <div className="col-md-3 col-sm-3 col-xs-12">
                                                                <p className="task-heading">PAYPAL ID</p>
                                                            </div>
                                                            <div className="col-md-1 col-sm-1 col-xs-12">
                                                                <p className="task-heading">CREDITS</p>
                                                            </div>
                                                            <div className="col-md-3 col-sm-3 col-xs-12">
                                                                <p className="task-heading">TASK NAME</p>
                                                            </div>
                                                            <div className="col-md-2 col-sm-2 col-xs-12">
                                                                <p className="task-heading">DATE</p>
                                                            </div>
                                                            <div className="col-md-1 col-sm-1 col-xs-12">
                                                                <p className="task-heading">CURRENCY</p>
                                                            </div>
                                                        </div>{this.renderPayment("task")}
                                                    </Tab>
                                                    <Tab eventKey={2} title="Credits Purchased or Granted">
                                                    <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                                <p className="task-heading">PURCHASE ID</p>
                                                            </div>
                                                            <div className="col-md-3 col-sm-3 col-xs-12">
                                                                <p className="task-heading">CREDIT PURCHASED</p>
                                                            </div>
                                                            <div className="col-md-3 col-sm-3 col-xs-12">
                                                                <p className="task-heading">DATE</p>
                                                            </div>
                                                            <div className="col-md-2 col-sm-2 col-xs-12">
                                                                <p className="task-heading">AMOUNT</p>
                                                            </div>
                                                        </div>{this.renderPayment("credit")}
                                                        </Tab>
                                                    <Tab eventKey={3} title="Live Session Purchase">
                                                        <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                                <p className="task-heading">PURCHASE ID</p>
                                                            </div>
                                                            <div className="col-md-3 col-sm-3 col-xs-12">
                                                                <p className="task-heading">Title</p>
                                                            </div>
                                                            <div className="col-md-3 col-sm-3 col-xs-12">
                                                                <p className="task-heading">DATE</p>
                                                            </div>
                                                        </div>{this.renderPayment("livesession")}
                                                  </Tab>
                                                </Tabs>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="LiveSessions"><p className="col-md-6 col-sm-6 col-xs-12 payment-history">Live Session</p>
                                                {/* <p className="col-md-6 col-sm-6 col-xs-12 total-spent">Total Spent: &#8377;&nbsp;{this.state.totalPayment}</p> */}
                                                {/* <p className="col-md-6 col-sm-6 col-xs-12 total-spent"></p> */}
                                                <Tabs className="col-md-12 col-sm-6 col-xs-12" defaultActiveKey={1} id="purchase-history-tabs" onChange={(key) =>this.activeChange(key)}>
                                                    <Tab eventKey={1} title="Ongoing Live sessions">
                                                        <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
                                                            <Table
                                                                columns={columns}
                                                                dataSource={liveSessionData}
                                                                expandable = {{expandedRowRender: record => this.expandedRowRender(record)}}
                                                                pagination={false}
                                                                showHeader={true}/>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey={2} title="Live sessions Completed">
                                                        <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                                                            <Table
                                                                columns={columns}
                                                                dataSource={completeLiveSessionData}
                                                                pagination={false}
                                                                expandable = {{expandedRowRender: record => this.expandedCompleteRowRender(record)}}
                                                                showHeader={true}/>
                                                        </div>
                                                    </Tab>
                                                </Tabs>;
                                            </Tab.Pane>
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
export default withRouter(MenteePaymentHistory);
