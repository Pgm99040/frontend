import React from 'react';
import { Link } from 'react-router-dom';
import Header from './login/header';
import ChatModal from "./chat/ChatModal";
import axios from 'axios';
import { Progress, Select, Radio } from 'antd';
import SweetAlert from 'sweetalert-react';
import { withRouter } from 'react-router-dom';
import {checkMentorsAvailability,
    getActiveTasks, isTaskPurchased,
    requestForTask, findMentorWithId,
    predefinedTaskWithId,
    predefinedTaskDetailWithId, taskPurchasedCheck} from "./utils/_data";
import {getFromStorage} from "../config/common";
import One from '../images/one.png';
import TaskLogo from '../images/bitmap.png';
import Two from '../images/two.png';
import Three from '../images/three.png';
import GetReview from '../images/reviewed.png';
import ChatIcon from '../images/chatIcon.png';
import "../styles/task-details.css";
import Loader from "./common/Loader";
require('../styles/sweetalert.css');
const Option = Select.Option;
const RadioGroup = Radio.Group;

var language = 'english';
class TaskDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            amount: 0,
            userName: '',
            userEmail: '',
            anonymous: '',
            taskId: '',
            taskTaken: false,
            noMentor: false,
            taskNotTaken: false,
            isTaskPurchase: '',
            responseMessageTaken: '',
            responseMessageTask: '',
            purchaseTask: false,
            taskengagementId: '',
            taskPurchaseType: 'credits',
            noEnoughCredits: false,
            taskEngagementDetails: {},
            noMentorAvailable:false,
            noMentorForSpecifiedLang:false,
            isPayPalModal: false,
            isPayPal: false,
            isChatModal: false,
            preferredLanguage: "english",
            activeTaskList: [],
            isMentor: false,
            isLoading : false,
            isPurchase : false
        };
    }
    async componentDidMount() {
        const isMentor = this.props && this.props.location && this.props.location.search
        if (isMentor) {
            const data = localStorage.getItem("userType")
            if (data === "mentor") {
                this.setState({isMentor: true})
            }
            if (data === "user") {
                this.setState({isMentor: false})
            }
        }
        const taskId =  this.props.match.params.taskId;
        const userId = getFromStorage("id");
        if (taskId && userId){
            this.getDetailsInTransaction(taskId, userId);
        }
        const response = await  axios.get('https://ipapi.co/json/');
        if (response.data) {
            let countryName = response.data.country_name;
            //alert('countryName in iapi.get call='+ countryName);
            localStorage.setItem('countryName', countryName);
        } else {
            this.setState({ error: response.message })
        }
        if(window.location.pathname.split('/')[1] ===  'detailed-task-requirements'){
            this.getPredefinedTaskDetail(taskId);
            this.taskPurchasedOrNot(taskId,userId)
        }else {
            this.getPredefinedTask(taskId);
        }

        this.getMenteeWithMentor();
        // axios.get('https://ipapi.co/json/').then((response) => {
        //     if (response.data) {
        //         let countryName = response.data.country_name;
        //         //alert('countryName in iapi.get call='+ countryName);
        //         localStorage.setItem('countryName', countryName);
        //     }
        // }).catch((error) => {
        //     this.setState({ error: error.message })
        // });
        // const res = await axios.get(BaseUrl.base_url + "/api/predefinedtask/view/" +  this.props.match.params.taskId);
        // console.log("predefinedtask------->", res);
        // if (res && res.data) {
        //     this.setState({ data: res.data.result });
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const taskId = this.props.match.params.taskId;
        if (prevProps.location.pathname !== this.props.location.pathname) {
            if (this.props.location.pathname.split('/')[1] === 'detailed-task-requirements') {
                this.getPredefinedTaskDetail(taskId);
            }
            if (this.props.location.pathname.split('/')[1] === 'task-details'){
                this.getPredefinedTask(taskId);
            }
        }
    }

    taskPurchasedOrNot = async (taskId, userId) => {
        const res = await taskPurchasedCheck(taskId, userId);
        if (res && res.success) {
            this.setState({ isPurchase: res.data.result });
        }else {
            console.log("error---->");
        }
    };

    getPredefinedTaskDetail = async (id) => {
        const res = await predefinedTaskDetailWithId(id);
        if (res && res.data) {
            this.setState({ data: res.data.result });
        }else {
            console.log("error---->");
        }
    }

    getPredefinedTask = async (id) =>{
        const res = await predefinedTaskWithId(id);
        if (res && res.data) {
            this.setState({ data: res.data.result });
        }else {
            console.log("error---->");
        }
    };

    getMenteeWithMentor = async () =>{
        const userData = JSON.parse(getFromStorage('userData'));
        if (userData.mentor){
            const res = await findMentorWithId(userData.mentor);
            if (res?.data?.success){
                this.setState({activeTaskList: res.data.result.approvedTasksForMentorship || []});
            }else {
                this.setState({activeTaskList: []});
                console.log("no mentor available");
            }
        }
    };
    getDetailsInTransaction = async function(id, userId){
        const res = await isTaskPurchased(id, userId);
        console.log("res8888888888888888888", res)
        if (res.success){
            this.setState({isTaskPurchase: res && res.data && res.data.paymentGateway, taskEngagementDetails: res && res.data && res.data.taskEngagement});
        } else {
            console.log("error");
        }
    };

    handleChange(value) {
        language = value;
        this.setState({ preferredLanguage: value })
        // console.log(language)
    }

    handleTaskPurchase(e) {
        // console.log(value)
        this.setState({ taskPurchaseType: e.target.value })
    }


    //razor pay functions

    takeTask = async (taskId, type) =>{
        const { data, activeTaskList, taskEngagementDetails } = this.state;
        const id = localStorage.getItem('id');
        //console.log(taskId);
        //console.log(amount);
        // Avoiding the local storage part.
        // if(localStorage.getItem('activeTaskCount')!=1) {
        //     this.openCheckout(taskId,amount,this);
        // }else {
        //     this.setState({taskNotTaken:true, responseMessageTaken:'Please complete the current task'});
        // }
        // Check wheather the user has active task.
        // If the user is having one active task then should not allow the user to take other task until current task finishes.
        const anonymous = document.getElementById('anonymous').checked;
        this.setState({isLoading:true});
        const response = await getActiveTasks(id);
        if ((response && response.data && response.data.status_code === 200) && (response && response.data && response.data.success=== true)) {
            this.setState({isLoading:false, taskNotTaken: true, responseMessageTaken: 'Oops, Please complete the current task to proceed with the new task.' });
        } else {
            let reqObj = {
                userId: id,
                preferredLanguage: this.state.preferredLanguage,
                taskId: taskId
            };
            const res = await checkMentorsAvailability(reqObj);
            if (res && res.data && res.data.status_code === 200) {
                if (this.state.taskPurchaseType === "credits") {
                    if (!activeTaskList.includes(data._id)){
                        this.setState({purchaseTask: false});
                        let userData = JSON.parse(localStorage.getItem('userData'));
                        // let anonymous = document.getElementById('anonymous').checked;
                        let requestBody = {
                            "userId": localStorage.getItem('id'),
                            "predefinedTaskId": taskId,
                            "isAnonymous": anonymous,
                            "paymentStatus": "success",
                            "taskType": this.state.data.taskType,
                            "paymentGateway": "razorpay",
                            "preferredLanguage": this.state.preferredLanguage,
                            "taskPrice": this.state.data.credits,
                            "taskPurchaseType": "credits",
                            "selectedMentorId": res && res.data && res.data.selectedMentorId,
                            "mentorUserId": res && res.data && res.data.mentorUserId
                        };
                        this.setState({isLoading:true});
                        const result = await requestForTask(requestBody);
                        if (result && result.data && result.data.status_code === 200) {
                            this.setState({isLoading:false, taskTaken: true, responseMessageTaken: result.data.message, taskengagementId: result.data.result._id });
                            localStorage.setItem('activeTasks', result.data.result.task._id);
                            window.location.href = `/task-engagement/${taskEngagementDetails._id}`;
                        }
                        // else if (response.data.status_code == 403) {
                        //     this.setState({ noMentor: true, responseMessageTaken: response.data.message });
                        // }
                        else if (result && result.data && result.data.status_code === 504) {
                            this.setState({isLoading:false, noEnoughCredits: true });
                        }
                        else {
                            this.setState({isLoading:false, taskNotTaken: true, responseMessageTaken: result.data.message });
                        }
                    }else {
                        this.setState({isLoading:false, purchaseTask: true, responseMessageTask: "You are already mentor"});
                    }
                } else {
                    if(type ==="razorpay") {
                        this.setState({isLoading:false});
                        this.openRazorpayCheckout(taskId, this, res.data.selectedMentorId, res.data.mentorUserId,null, anonymous);
                    }
                    else {
                        this.setState({isLoading:false});
                        this.openPaypalCheckout(taskId, this, res.data.selectedMentorId, res.data.mentorUserId,null, anonymous);
                    }
                }
            }
            else if (res && res.data && res.data.status_code === 403) {
                this.setState({isLoading:false,  noMentor: true, responseMessageTaken: res.data.message });
            }
            else if (res && res.data && res.data.status_code === 406) {
                this.setState({isLoading:false, noMentorForSpecifiedLang: true });
            }
            else if (res && res.data && res.data.status_code === 405) {
                this.setState({isLoading:false, noMentorAvailable: true });
            }
            else {
                console.log("error")
            }
        }



        // const response =  await axios.get(BaseUrl.base_url + "/api/v1/user/te/getActiveTasks/" + localStorage.getItem('id'), {'headers': {"Content-Type": "application/json", "Authorization": localStorage.getItem('authToken')}});
        //
        // if ((response && response.data && response.data.status_code === 200) && (response && response.data && response.data.success=== true)) {
        //     this.setState({ taskNotTaken: true, responseMessageTaken: 'Oops, Please complete the current task to proceed with the new task.' });
        // } else {
        //     let reqObj = {
        //         userId: localStorage.getItem('id'),
        //         preferredLanguage: this.state.preferredLanguage,
        //         taskId: taskId
        //     };
        //     const res = await axios.post(BaseUrl.base_url + "/api/v1/checkMentorsAvailability", reqObj,{'headers': {"Content-Type": "application/json", "Authorization": localStorage.getItem('authToken')}});
        //     if (res && res.data && res.data.status_code === 200) {
        //         if (this.state.taskPurchaseType === "credits") {
        //             var userData = JSON.parse(localStorage.getItem('userData'));
        //             var anonymous = document.getElementById('anonymous').checked;
        //             let requestBody = {
        //                 "userId": localStorage.getItem('id'),
        //                 "predefinedTaskId": taskId,
        //                 "isAnonymous": anonymous,
        //                 "paymentStatus": "success",
        //                 "taskType": this.state.data.taskType,
        //                 "paymentGateway": "razorpay",
        //                 "preferredLanguage": this.state.preferredLanguage,
        //                 "taskPrice": this.state.data.credits,
        //                 "taskPurchaseType": "credits",
        //                 "selectedMentorId": res && res.data && res.data.selectedMentorId,
        //                 "mentorUserId": res && res.data && res.data.mentorUserId
        //             };
        //             const result= await axios({
        //                 method: 'post',
        //                 url: BaseUrl.base_url + "/api/v1/requestForTask",
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'Authorization': localStorage.getItem('authToken')
        //                 },
        //                 data: requestBody
        //             });
        //             if (result && result.data && result.data.status_code === 200) {
        //                 this.setState({ taskTaken: true, responseMessageTaken: result.data.message, taskengagementId: result.data.result._id });
        //                 localStorage.setItem('activeTasks', result.data.result.task._id);
        //             }
        //             // else if (response.data.status_code == 403) {
        //             //     this.setState({ noMentor: true, responseMessageTaken: response.data.message });
        //             // }
        //             else if (result && result.data && result.data.status_code === 504) {
        //                 this.setState({ noEnoughCredits: true });
        //             }
        //             else {
        //                 this.setState({ taskNotTaken: true, responseMessageTaken: result.data.message });
        //             }
        //         }
        //         else {
        //             if(type ==="razorpay") {
        //                 this.openRazorpayCheckout(taskId, this, res.data.selectedMentorId, res.data.mentorUserId);
        //             }
        //             else {
        //                 this.openPaypalCheckout(taskId, this, res.data.selectedMentorId, res.data.mentorUserId);
        //             }
        //         }
        //
        //     }
        //     else if (res && res.data && res.data.status_code === 403) {
        //         this.setState({ noMentor: true, responseMessageTaken: res.data.message });
        //     }
        //     else if (res && res.data && res.data.status_code === 406) {
        //         this.setState({ noMentorForSpecifiedLang: true });
        //     }
        //     else if (res && res.data && res.data.status_code === 405) {
        //         this.setState({ noMentorAvailable: true });
        //     }
        //     else {
        //         console.log("error")
        //     }
        // }
    };

    openRazorpayCheckout (taskId, _this, selectedMentorId, mentorUserId, engagementId, anonymous){
        const { data, activeTaskList } = this.state;
        var userData = JSON.parse(localStorage.getItem('userData'));
        var userName = userData.firstName + " " + userData.lastName;
        var userEmail = userData.email;
        // var anonymous = document.getElementById('anonymous').checked;

        this.setState({ userName: userName, userEmail: userEmail });
        let options = {
            "key": "rzp_test_iWLnogdDrn0e8N",
            "amount": 1 * 100,//localStorage.getItem('amount')*100,
            "name": "CodeDIY",
            "description": "purchasing the task " + this.state.data.name,
            "image": "/your_logo.png",
            "handler": async function (res) {
                let requestBody = {
                    "userId": localStorage.getItem('id'),
                    "predefinedTaskId": taskId,
                    "isAnonymous": anonymous,
                    "paymentStatus": "success",
                    "razorpayId": res.razorpay_payment_id,
                    "captured": true,
                    "taskType": _this.state.data.taskType,
                    "paymentGateway": "razorpay",
                    "preferredLanguage": _this.state.preferredLanguage,
                    "taskPrice": _this.state.data.price[0].value + " " + _this.state.data.price[0].currency,
                    "taskPurchaseType": "currency",
                    "selectedMentorId": selectedMentorId,
                    "mentorUserId": mentorUserId
                };

                const response = await requestForTask(requestBody);
                // const response = await axios({
                //     method: 'post',
                //     url: BaseUrl.base_url + "/api/v1/requestForTask",
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': localStorage.getItem('authToken')
                //     },
                //     data: requestBody
                // });

                if (response && response.data && response.data.status_code == 200) {
                    _this.setState({ taskTaken: true, responseMessageTaken: response.data.message, taskengagementId: response.data.result._id });
                    localStorage.setItem('activeTasks', response.data.result.task._id);
                    window.location.href = `/task-engagement/${engagementId}`;
                }
                // else if (response.data.status_code == 403) {
                //     _this.setState({ noMentor: true, responseMessageTaken: response.data.message });
                // }
                else {
                    _this.setState({ taskNotTaken: true, responseMessageTaken: response && response.data && response.data.message });
                }


                // axios({
                //     method: 'post',
                //     url: BaseUrl.base_url + "/api/v1/requestForTask",
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': localStorage.getItem('authToken')
                //     },
                //     data: requestBody
                // }).then(response => {
                //     if (response.data.status_code == 200) {
                //         _this.setState({ taskTaken: true, responseMessageTaken: response.data.message, taskengagementId: response.data.result._id });
                //         localStorage.setItem('activeTasks', response.data.result.task._id);
                //     }
                //     // else if (response.data.status_code == 403) {
                //     //     _this.setState({ noMentor: true, responseMessageTaken: response.data.message });
                //     // }
                //     else {
                //         _this.setState({ taskNotTaken: true, responseMessageTaken: response.data.message });
                //     }
                //
                // })
                //     .catch(error => {
                //         throw (error);
                //     });
                //alert(response.razorpay_payment_id);
            },
            "prefill": {
                "name": userName,
                "email": userEmail
            },
            "notes": {
                "address": "Hello World"
            },
            "theme": {
                "color": "#F37254"
            }
        };

        if (!activeTaskList.includes(data._id)){
            this.setState({purchaseTask: false});
            let rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            this.setState({purchaseTask: true, responseMessageTask: "You are already mentor"});
        }

    }

    openPaypalCheckout(taskId, _this, selectedMentorId, mentorUserId, engagementId, anonymous){
        this.setState({isLoading:true});
        const {data, preferredLanguage, activeTaskList} = _this.state;
        // let userData = JSON.parse(localStorage.getItem('userData'));
        // let userName = userData.firstName + " " + userData.lastName;
        // let userEmail = userData.email;
        // let anonymous = document.getElementById('anonymous').checked;

        // this.setState({ userName: userName, userEmail: userEmail, isPayPal: true, anonymous: anonymous });
        if (!activeTaskList.includes(data && data._id)){
            this.setState({purchaseTask: false});
            // if (window.confirm("pay with paypal")){
                if (taskId && data.taskType && data.price[0].value && data.price[0].currency && selectedMentorId && mentorUserId){
                    this.setState({isLoading:false});
                    window.location.href = `/paypal?type=${data.taskType}&amount=${data.price[0].value}&currency=${data.price[0].currency}&lang=${preferredLanguage}&anonymous=${anonymous}&taskId=${taskId}&selectId=${selectedMentorId}&mentorUserId=${mentorUserId}`;
                }
            // }
        }else {
            this.setState({purchaseTask: true, responseMessageTask: "You are already mentor"});
        }

    }
    taskSuccessfullyTaken(taskEngagementId) {
        this.setState({ taskTaken: false }, () => window.location.href = '/mentee-payment-history/' + taskEngagementId)
    }
    PurchaseTaskTaken(){
        this.setState({purchaseTask: false});
    }

    noMentorAssigned() {
        this.setState({ noMentor: false })
    }
    noMentorAvailable() {
        this.setState({ noMentorAvailable: false })
    }
    noMentorForSpecifiedLang() {
        this.setState({ noMentorForSpecifiedLang: false })
    }

    noTaskTaken() {
        this.setState({ taskNotTaken: false })
    }
    noEnoughCredits() {
        this.setState({ noEnoughCredits: false })
    }
    renderTaskDetail() {
        console.log("this.state && this.state.data && this.state.data.imageUrl", this.state && this.state.data && this.state.data.imageUrl)
        return (
            <div className="task-details-cards">
                <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                    <div className="col-md-3 col-sm-4 col-xs-12 no-right-padding-div">
                        <img src={`${this.state && this.state.data && this.state.data.imageUrl}`} className="logo_image" alt={'image_logo'}/>
                    </div>
                    <div className="col-md-9 col-sm-8 col-xs-12">
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div top-10">
                            <div className="divider"></div>
                            <span className="task_category">{this.state?.data?.name}</span>
                            <span className="bulletin" >&bull;</span>
                            <span className="task_difficulty">{this.state?.data?.difficultyLevel}</span>
                        </div>
                        {/*<div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">*/}
                        {/*    <p className="task_desc"  dangerouslySetInnerHTML={{__html: this.state.data.tinyDescription || "-"}} />*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 padding-sides">
                    {(window.location.pathname.split('/')[1] === 'task-details') &&
                    <>
                        <p className="description-title">Description:</p>
                        <p className="task_description"
                           dangerouslySetInnerHTML={{__html: this.state?.data?.description || "-"}}/>
                        <p className="task_description1"><b className="NoItalics">NOTE</b>: Useful links will be
                            provided for you to reference and perform the task. The task mentor will review the code
                            submissions and give you useful feedback to correct and make it perfect.</p>
                        <p className="task-details">Task Category:&nbsp;&nbsp;<span
                            className="task-details-name">{this.state?.data?.name}</span></p>
                        <p className="task-details">Related KnowledgeBlock:&nbsp;&nbsp;<span
                            className="task-details-name-blue">{this.state?.data?.relatedKnowledgeBlock}</span></p>
                        < p className="task-details">Related CareerPaths:&nbsp;&nbsp;<span
                            className="task-details-name-blue">{this.state?.data?.relatedCareerPath}</span></p>
                        < p className="task-details">Task Mentor:&nbsp;&nbsp;<span
                            className="task-details-name">{this.state?.data?.taskMentor}</span></p>
                    </>
                    }
                </div>
                {
                    (window.location.pathname.split('/')[1] === 'task-details') && this.state?.data?.mediaLink &&
                    <div className="col-md-12 col-sm-12 col-xs-12 padding-sides">
                        <iframe width="420" height="315" src={this.state?.data?.mediaLink} title="Media Link" />
                    </div>
                }
                {
                    (window.location.pathname.split('/')[1] === 'detailed-task-requirements') &&
                    this.state.isPurchase ?
                    <div className="col-md-12 col-sm-12 col-xs-12 padding-sides">
                        <p className="description-title">Detailed Task Description:</p>
                        <p className="task_description"
                           dangerouslySetInnerHTML={{__html: this.state?.data?.taskDetailedDescriptionForMentee || "-"}}/>
                    </div> :
                        <div className="col-md-12 col-sm-12 col-xs-12 padding-sides">
                            <p className="task_description">The detailed task requirements will be shown only for users who have purchased the task</p>
                        </div>
                }
                {
                    (window.location.pathname.split('/')[1] === 'task-details' && this.state?.isTaskPurchase !== undefined) &&
                    <>
                        <p className="col-md-12 col-sm-12 col-xs-12 padding-sides task_description1"><b
                            className="NoItalics">NOTE</b>: Please use the dashboard to navigate to the task engagement
                            page for submitting the answer & engaging with your mantor.</p>
                        <div className="col-md-12 col-sm-12 col-xs-12 padding-sides">
                            <Link to={"/detailed-task-requirements/" + this.state?.data?._id}>Task description</Link>
                        </div>
                    </>
                }
            </div>
        )
    }

    showChatModal(isOpen){
        this.setState({isChatModal: true})
    }
    hideChatModal(){
        this.setState({isChatModal: false})
    }

    renderSummary() {
        console.log("this.state.data", this.state.data)
        const { isChatModal, isTaskPurchase } = this.state;
        const { match, location } = this.props;
        let taskEngagementId =  match && match.params && match.params.taskId;
        let userType = location && location.state && location.state.userType;
        let userDetails = JSON.parse(getFromStorage("userData"));
        return (
            <div className="full-width-background">
                <div className="col-md-12 col-sm-12 col-xs-12 marginBottom">
                    <p className="task-summary">Summary</p>
                    <p className="task-summary-detail"  dangerouslySetInnerHTML={{__html: this.state?.data?.tinyDescription || "-"}} />
                    <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                        <Progress percent={0} showInfo={false} />
                        <p className='progress-text'>Started</p>
                    </div>
                    <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div center-progress-bar">
                        <Progress percent={0} showInfo={false} />
                        <p className='progress-text text-center'>In Progress</p>
                    </div>
                    <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                        <Progress percent={0} showInfo={false} />
                        <p className='progress-text text-right'>End</p>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 price-block">
                    <div className='col-md-8 col-sm-8 col-xs-8 no-padding-div'>
                        <p className='submit-task-text'>Submit task and get reviewed by verified Mentor</p>
                    </div>
                    <div className='col-md-4 col-sm-4 col-xs-4 no-padding-div'>
                        <p className='task-amount'>&#8377;{this.state?.data?.credits}</p>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 features-block">
                    <p className='features-text'>Features</p>
                    <span className="detail-flow" ><img src={GetReview} />&nbsp;&nbsp;Get reviewed</span>
                    <span className="detail-flow" onClick={()=>(isTaskPurchase === "paypal" || isTaskPurchase === "razorpay") ? this.showChatModal() : null}><img src={ChatIcon} />&nbsp;&nbsp;{userType === 'mentor' ? 'Chat with Mentee' : 'Chat with Mentor'}</span>
                    {isChatModal && <ChatModal onCancel={()=>this.hideChatModal()} taskEngagementId={taskEngagementId} isChatModal={isChatModal}/>}
                </div>

                {/* For time being task purchase through credits or currency option */}

                {/*
                <Select showSearch className="endTask-select" placeholder='Choose Task Purchase Type' onChange={this.handleTaskPurchase.bind(this)}>
                    <Option value="credits">Credits</Option>
                    <Option value="currency">Currency</Option>
                </Select> */}

                {/* ===================ENDS HERE ====================================== */}

                <div className="col-md-6 col-sm-6 col-xs-6">
                    <div>
                            <p>You can select an additional language apart from English to communicate with the mentor</p>
                    </div>
                    <Select showSearch defaultValue="english" className="endTask-select" placeholder='Choose your language' onChange={this.handleChange.bind(this)}>
                        <Option value="english">English</Option>
                        <Option value="kannada">Kannada</Option>
                        <Option value="telugu" >Telugu</Option>
                        <Option value="marathi">Marathi</Option>
                    </Select>
                </div>
                <div className="col-md-6 col-sm-6 col-xs-6 checkbox-block text-right">
                    <label className="checkboxLabel"><input className="chkret" type="checkbox" name="" id="anonymous" />&nbsp;Take this task as anonymous</label>
                </div>


                <div className="col-md-12 col-sm-12 col-xs-12">
                 <p className="purchase-type">Purchase task with:</p>
                <RadioGroup onChange={this.handleTaskPurchase.bind(this)} value={this.state?.taskPurchaseType}>
                    <Radio className="purchase-type-option" value="credits">Credits</Radio>
                    <Radio className="purchase-type-option" value="currency">Currency</Radio>
                </RadioGroup>
                <p style={{"display":this.state?.taskPurchaseType === "credits"?"block":"none"}} className="form-task-amount">{`${this.state?.data?.credits || ''}`} Credits</p>
                <p style={{"display":this.state?.taskPurchaseType === "currency"?"block":"none"}} className="form-task-amount">
                {this.state?.data?.price?this.state?.data?.price.map(eachval=>(
                    <p>{eachval.value} {eachval.currency}</p>
                )):""}
                </p>
                    {
                        // (isTaskPurchase === "paypal" || isTaskPurchase === "razorpay") ? null : <div className='col-md-12 col-sm-12 col-xs-12 no-padding' style={{"display":this.state.taskPurchaseType === "credits"?"block":"none"}}>
                        // <button type='button' onClick={() => this.takeTask(this.state.data._id,"credits")} className='purchase-task-button'>Purchase with credits</button>
                        // </div>
                        <div className='col-md-12 col-sm-12 col-xs-12 no-padding' style={{"display":this.state?.taskPurchaseType === "credits"?"block":"none"}}>
                            <button type='button' onClick={() => this.takeTask(this.state.data._id,"credits")} className='purchase-task-button'>Purchase with credits</button>
                        </div>
                    }
                     {
                         // (isTaskPurchase === "paypal" || isTaskPurchase === "razorpay") ? <h4 className="text-primary mt-5" style={{marginTop: "10px"}}>You have purchased this task before and engaged with a mentor.  You will be assigned to different mentor when you purchase it again now</h4> :
                         <div>
                             {
                                 isTaskPurchase !== undefined &&
                                 <h4 className="text-primary mt-5" style={{marginTop: "10px"}}>You have purchased this task before and engaged with a mentor.  You will be assigned to different mentor when you purchase it again now</h4>
                             }
                             <div className='col-md-12 col-sm-12 col-xs-12 no-padding' style={{"display":this.state?.taskPurchaseType === "currency"?"block":"none"}}>
                                 <div className='col-md-6 col-sm-6 col-xs-6 no-padding'>
                                     <button type='button' onClick={() => this.takeTask(this.state?.data?._id,"razorpay")} className='purchase-task-button'>Purchase with Razorpay</button>
                                 </div>
                                 <div className='col-md-6 col-sm-6 col-xs-6 no-padding paypal-pay'>
                                     <button type='button' onClick={() => this.takeTask(this.state?.data?._id, "paypal")} className='purchase-task-button'>Purchase with Paypal</button>
                                     {/*<PayPal />*/}
                                 </div>
                             </div>
                         </div>
                     }
                </div>



                {/* <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className='col-md-6 col-sm-6 col-xs-6'>
                        <p className='form-task-amount'>{this.state.data.credits}</p>
                        <p className='total-amount-text'>Total Amount</p>
                    </div>
                    <div className='col-md-6 col-sm-6 col-xs-6'>
                        <button type='button' onClick={() => this.takeTask(this.state.data._id)} className='take-task-button'>Take Task</button>
                    </div>
                </div> */}
            </div>
        )
    }


    render() {
        const isMentor = localStorage.getItem("userType");
        console.log("history----->", this.props.history);
        if (this.state.isLoading) return <Loader/>;
        return (
            <div className="fullPage-details" >
                <SweetAlert
                    show={this.state.purchaseTask}
                    title="Warning"
                    type="warning"
                    text={this.state.responseMessageTask}
                    onConfirm={() => this.PurchaseTaskTaken()}
                />
                <SweetAlert
                    show={this.state.taskTaken}
                    title="Success"
                    type="success"
                    text={this.state.responseMessageTaken}
                    onConfirm={() => this.taskSuccessfullyTaken(this.state.taskengagementId)}
                />
                <SweetAlert
                    show={this.state.noMentor}
                    title="Warning"
                    type="warning"
                    text={this.state.responseMessageTaken}
                    onConfirm={() => this.noMentorAssigned()}
                />
                <SweetAlert
                    show={this.state.taskNotTaken}
                    title="Error"
                    type="error"
                    text={this.state.responseMessageTaken}
                    onConfirm={() => this.noTaskTaken()}
                />
                <SweetAlert
                    show={this.state.noEnoughCredits}
                    title="Warning"
                    type="warning"
                    text="No enough available credits"
                    onConfirm={() => this.noEnoughCredits()}
                />
                <SweetAlert
                    show={this.state.noMentorForSpecifiedLang}
                    title="Warning"
                    type="warning"
                    text="No Mentor available for selected language. Please choose any other language or choose deafult english language"
                    onConfirm={() => this.noMentorForSpecifiedLang()}
                />
                <SweetAlert
                    show={this.state.noMentorAvailable}
                    title="Warning"
                    type="warning"
                    text="All the mentors are occupied for this task"
                    onConfirm={() => this.noMentorAvailable()}
                />
                <div className="main_div">
                    <Header />
                </div>
                <div className="col-md-12 col-xs-12 col-sm-12 background-how-it-works">
                    <div className="container">
                        <div className="parts">
                            <span className="detail-flow">How It Works</span>
                            <span className="detail-flow" ><img src={One} />&nbsp;&nbsp;&nbsp;Choose a task</span><span className="bull">&bull;</span><span className="bull">&bull;</span><span className="bull">&bull;</span>
                            <span className="detail-flow"><img src={Two} />&nbsp;&nbsp;&nbsp;Submit your answer</span><span className="bull">&bull;</span><span className="bull">&bull;</span><span className="bull">&bull;</span>
                            <span className="detail-flow"><img src={Three} />&nbsp;&nbsp;&nbsp;Get reviewed by a verified Mentor</span>
                        </div>
                    </div>
                </div>
                {
                    this.state.isMentor ?
                        <div  className="col-md-12 col-xs-12 col-sm-12">
                            <div className="d-flex align-items-center" style={{height : "700px", justifyContent: "center"}}>
                            <h3>Task Details can be viewed only in Mentee mode. Please logout and relogin as a 'Mentee'</h3>
                            </div>
                        </div>
                        :
                        <div className="col-md-12 col-xs-12 col-sm-12">
                            <div className="container">
                                <div className="col-md-12 col-xs-12 col-sm-12 no-padding padding-20" >
                                    {
                                        window.location.pathname.split('/')[1] === 'task-details' ?
                                            <Link to={isMentor === "mentor"? '/mentor/myprofile' : `/tasklist`} className="browse_all">&lt;&nbsp;Back</Link>
                                            :
                                            <Link to={isMentor === "mentor"? '/mentor/myprofile' : `/task-engagement/${this.props?.history?.location?.state?.engagementId}`} className="browse_all">&lt;&nbsp;Back</Link>
                                    }

                                </div>
                                <div className="col-md-12 col-xs-12 col-sm-12 no-padding">
                                    <div className="col-md-7 col-xs-12 col-sm-7 no-left-padding-div right-3">
                                        {this.renderTaskDetail()}
                                    </div>
                                    <div className="col-md-5 col-xs-12 col-sm-5 no-right-padding-div left-3">
                                        {window.location.pathname.split('/')[1] === 'task-details' && this.renderSummary()}
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}

export default withRouter(TaskDetails);
