import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Header from './login/header';
import moment from 'moment-timezone';
import SweetAlert from 'sweetalert-react';
import Answers from './answers';
import Discussion from './discussion';
import TaskLogo from '../images/bitmap.png';
import { Progress, Tabs, Input, message, Button, Rate, Select, Spin, DatePicker } from 'antd';
import ChatIcon from '../images/chatIcon.png';
import ChatModal from "./chat/ChatModal";
import videoIcon from "../images/video-camera.png";
import {viewTask, endTask} from "./utils/_data";
import Loader from "./common/Loader";
require('../styles/current-task.css');
require('../styles/task-details.css');
const { RangePicker } = DatePicker;
var taskEngagementIdValue;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;
const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};
class CurrentTask extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            data: [],
            started:0,
            task:'',
            user:'',
            mentor:'',
            subcategory:'',
            category:'',
            loading:true,
            submissions:[],
            discussions : [],
            googleMeetLink: "",
            value:0,
            messageForEndTask:'',
            messageForEndedTask:'',
            endTask:false,
            endedTask:false,
            taskEnded:false,
            isChatModal: false,
            isOpenTimeSlot: false,
            endTaskValidate: false,
            isValid: true,
            averageRating:2,
            payment:'',
            isAuth : false,
            isLoading : false
        };

        this.handleRatingChange= this.handleRatingChange.bind(this)

    }

    componentDidMount() {
       console.log(this.props,"PARAMS")
    //    if(this.props.pathName.pathname == '/menteedashboard') {
    //        //console.log('yes')
    //         axios.get(BaseUrl.base_url + "/api/v1/user/te/getActiveTasks/" + localStorage.getItem('id'),
    //         {
    //             'headers': {
    //                 "Content-Type": "application/json",
    //                 "Authorization": localStorage.getItem('authToken')
    //             }
    //         }).then((response) => {
    //             console.log({ response });
    //             if(response.data.status_code ==204) {
    //                 this.setState({ data: []})
    //             }else {

    //             this.setState({ data: response.data.result.activeTasks[0],
    //                             task:response.data.result.activeTasks[0].task,
    //                             mentor:response.data.result.activeTasks[0].mentor,
    //                             subcategory:response.data.result.activeTasks[0].task.subcategory,
    //                             category:response.data.result.activeTasks[0].task.subcategory.category,
    //                             user:response.data.result.activeTasks[0].mentor.user,
    //                             loading:false,
    //                             submissions:response.data.result.activeTasks[0].submissions,
    //                             discussions:response.data.result.activeTasks[0].discussions,
    //                             averageRating:response.data.result.activeTasks[0].mentor.averageRating,
    //                             payment:response.data.result.activeTasks[0].payment });
    //                             console.log(this.state.data)

    //                         }
    //         }).catch(function (error) {
    //             console.log({ error: error });

    //         });
    //    } else {
           this.getViewTask();
       // }
    }

    getViewTask = async () =>{
        const taskId = this.props.match.params.taskId;
        const response = await viewTask(taskId);
        if (response?.data?.status_code === 200) {
            localStorage.setItem('reason','');
            this.setState({data: response.data.result,
                task:response.data.result.task,
                mentor:response.data.result.mentor,
                subcategory:response.data.result.task.subcategory,
                category:response.data.result.task.subcategory.category,
                user:response.data.result.mentor.user,
                loading:false,
                submissions:response.data.result.submissions,
                discussions:response.data.result.discussions,
                googleMeetLink: response.data.result.gmeetLinkUrl || "",
                payment:response.data.result.payment,
                averageRating:response.data.result.mentor.averageRating});
        } else if (response?.data?.status_code === 401){
                console.log(response?.data?.message)
                this.setState({isAuth: true,loading:false})
        }
        else {
            this.setState({loading:false})
        }
        // axios.get(BaseUrl.base_url+"/api/v1/te/view/"+ this.props.match.params.taskId,{ 'headers': {
        //         "Content-Type": "application/json",
        //         "Authorization": localStorage.getItem('authToken')
        //     }
        // }).then((response)=>{
        //         console.log(response);
        //         localStorage.setItem('reason','')
        //         this.setState({data: response.data.result,
        //             task:response.data.result.task,
        //             mentor:response.data.result.mentor,
        //             subcategory:response.data.result.task.subcategory,
        //             category:response.data.result.task.subcategory.category,
        //             user:response.data.result.mentor.user,
        //             loading:false,
        //             submissions:response.data.result.submissions,
        //             discussions:response.data.result.discussions,
        //             googleMeetLink: response.data.result.gmeetLinkUrl || "",
        //             payment:response.data.result.payment,
        //             averageRating:response.data.result.mentor.averageRating});
        //     }
        // );
    };


    callback(key) {
        //console.log(key);
    }

    handleChange(value) {
        //console.log(`selected ${value}`);
        localStorage.setItem('reason',value)
    }


    handleRatingChange(value) {
        //console.log(value)
        this.setState({ value:value });
    }

    // initiateChat(){
    //     $applozic.fn.applozic('loadTab', this.state.mentor._id);
    // }

    endTask = async () =>{
        const { endTaskValidate, isValid } = this.state;
        var flag = true;
        localStorage.setItem('activeTasks',"");
        let taskData = [];
        // if(this.props.pathName.pathname == '/menteedashboard') {
        //     taskEngagementIdValue = this.state.payment.taskEngagement
        // }else {
            taskEngagementIdValue =  this.props.match.params.taskId;
       // }
        taskData = {
            "taskEngagementId": taskEngagementIdValue,
            "rating":this.state.value,
            "taskCompletionReason": localStorage.getItem('reason'),
            "feedback":document.getElementById('feedback').value,
            // "comment":document.getElementById('comment').value,
        };

        if ((taskData.rating === 0) && (taskData.feedback === '')) {
            this.setState({endTaskValidate: true});
        } else {
            this.setState({isLoading : true})
            const response = await endTask(taskData);
            if(response?.data?.status_code === 200) {
                this.setState({endTask:true, messageForEndTask:'Task has ended successfully and you can take new tasks.',taskEnded:true, isLoading : false})

            } else if(response?.data?.status_code === 400) {
                this.setState({endedTask:true, messageForEndedTask:response.data.message[0].msg , isLoading : false})
            }
            else {
                this.setState({endedTask:true, messageForEndedTask:response.data.message, isLoading : false})
            }
        }

        //console.log(taskData);


        // axios.post(BaseUrl.base_url+'/api/v1/te/endTask',JSON.stringify(taskData),{ 'headers': {
        //     "Content-Type": "application/json",
        //     "Authorization": localStorage.getItem('authToken')
        //   }
        // }).then((response)=>{
        //     //console.log(response)
        //     if(response.data.status_code==200) {
        //         this.setState({endTask:true, messageForEndTask:'Task has ended successfully and you can take new tasks.',taskEnded:true})
        //
        //     } else if(response.data.status_code==400) {
        //         this.setState({endedTask:true, messageForEndedTask:response.data.message[0].msg})
        //     }
        //     else {
        //         this.setState({endedTask:true, messageForEndedTask:response.data.message})
        //     }
        //
        //     //window.location.href='/tasklist';
        //
        // }).catch(error => {
        //     throw(error);
        // });
    };

    taskEndedSuccessfully() {
        this.setState({endTask:false,messageForEndTask:''});
        localStorage.setItem('reason','');
        //window.location.href = '/mentee-payment-history/'+taskEngagementIdValue
        window.location.href = '/tasklist'
    }
    taskAlreadyEndedSuccessfully() {
        this.setState({endedTask:false,messageForEndedTask:''})
    }
    taskAddCommentStar() {
        this.setState({endTaskValidate:false})
    }
    showChatModal(isOpen){
        this.setState({isChatModal: true})
    }
    hideChatModal(){
        this.setState({isChatModal: false})
    }

    openDatePicker = () =>{
        this.setState({isOpenTimeSlot: true});
      return (
          <div>
              <DatePicker showTime  />
              <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  // onChange={onChange}
                  // onOk={onOk}
              />
          </div>
      )
    };

    render() {
        const { value, isChatModal } = this.state;
        console.log("this.props", this.props)
        var started;
        var inProgress;
        var end;
        var disabled =false;
        var taskEngagementId=undefined;
        var display ={
            display:'none'
            };
            if(this.state.data.status === "started") {
                started = 100;
                inProgress =0;
                end = 0;
                disabled =false
            }else if(this.state.data.status === "inprogress") {
                started = 100;
                inProgress =100;
                end = 0;
                disabled =false
            }else if (this.state.data.status === 'completed') {
                started = 100;
                inProgress =100;
                end = 100;
                disabled =true
            }
            // if(this.props.pathName.pathname == '/menteedashboard') {
            //     taskEngagementId = this.state.payment.taskEngagement
            // }else {
            //     taskEngagementId =  this.props.match.params.taskId;
                taskEngagementId =  this.props.match.params.taskId;
           // }

            //console.log(taskEngagementId)
            //console.log(started)
            //console.log(inProgress)
            //console.log(end)
            //console.log((Math.round(this.state.averageRating*2))/2)
            // if(this.state.data.length==0) {
            //     return(<p className="myTask-desc">No active tasks. Please take a task to make this section active</p>)
            // }else {
            return (
                <div>
                <div className="main_div">
                    <Header />
                </div>

                <a href={this.props.location.search === "menteeprofile"?"/mentee/myprofile":this.props.location.search === "tasklist" ? "/tasklist" : "/menteedashboard"} className="back-btn" >&lt;&nbsp;Back</a>
                    <SweetAlert
                        show={this.state.endTask}
                        title="Success"
                        type="success"
                        text= {this.state.messageForEndTask}
                        onConfirm={() => this.taskEndedSuccessfully()}
                    />
                    <SweetAlert
                        show={this.state.endedTask}
                        title="Warning"
                        type="warning"
                        text= {this.state.messageForEndedTask}
                        onConfirm={() => this.taskAlreadyEndedSuccessfully()}
                    />
                    <SweetAlert
                        show={this.state.endTaskValidate}
                        title="Warning"
                        type="warning"
                        text= {"Please enter comment and rating after end of the task."}
                        onConfirm={() => this.taskAddCommentStar()}
                    />
                    <Spin spinning={this.state.loading} className='loading'/>
                    {this.state.isLoading && <Loader/>}
                    {
                        this.state.isAuth ?
                            <div className="col-md-12 col-xs-12 col-sm-12">
                                <div className="d-flex align-items-center" style={{height : "700px", justifyContent: "center"}}>
                                    <h3>401 Unauthorized</h3>
                                </div>
                            </div>
                            :
                            <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                                <div className="col-md-8 col-sm-8 col-xs-12 paddingBottom  no-padding-div">
                                    <div className="task-details-cards text-center">
                                        <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                                            <div className="col-md-2 col-sm-4 col-xs-12 no-right-padding-div">
                                                <img src={this.state.task.imageUrl} alt="logo_image" className="logo_image"/>
                                            </div>
                                            <div className="col-md-8 col-sm-6 col-xs-12">
                                                <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div top-10 paddingBottom">
                                                    <span className="task_name">{this.state.task.name}</span>
                                                    <div className="divider" />
                                                    <span className="task_category">{this.state.category.name }</span>
                                                    <span className="bulletin" >&bull;</span>
                                                    <span className="task_difficulty">{this.state.task.difficultyLevel}</span>
                                                </div>
                                                <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div paddingBottom">
                                                    <p className='task_desc paddingBottom' dangerouslySetInnerHTML={{__html: this.state.task.description || "-"}} />
                                                </div>
                                                <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                                    <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                                                        <Progress percent={started} showInfo={false} />
                                                        <p className='progress-text text-left'>Started</p>
                                                    </div>
                                                    <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div center-progress-bar">
                                                        <Progress percent={inProgress} showInfo={false} />
                                                        <p className='progress-text text-center'>In Progress</p>
                                                    </div>
                                                    <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                                                        <Progress percent={end} showInfo={false} />
                                                        <p className='progress-text text-right'>End</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12 padding-sides">
                                                    <div className="hyperLink">
                                                        <Link to={{
                                                            pathname : `/detailed-task-requirements/${this.state?.task?._id}`,
                                                            state :{engagementId : this.props.match.params.taskId}
                                                        }}>Click here to get the Full Task Requirements</Link>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12 padding-sides">
                                                    <div className="hyperLink">
                                                            <a href={`/task-engagement/${this.props.match.params.taskId}/ViewMentorReviewForTask`}>ViewMentorReviewForTask</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 col-sm-2 col-xs-12 no-padding-div">
                                                <span className="task_pay">Paid {this.state.payment.taskPurchaseType === "currency"?this.state.payment.currency + ' ' + 'Currency' : this.state.payment.credits + ' ' + 'Credits'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="task-details-cards text-center">
                                        <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom mentee-view">
                                            <Tabs defaultActiveKey="1" onChange={() => this.callback()}>
                                                <TabPane tab="Answers" key="1">
                                                    <Answers taskEngagementId={taskEngagementId} submissions={this.state.submissions}/>
                                                </TabPane>
                                                <TabPane tab="Description" key="2">
                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                        <p className="description-desc" dangerouslySetInnerHTML={{__html: this.state.task.description || "-"}} />
                                                        <p className="description-details">Task Category:&nbsp;&nbsp;<span className="task-details-name">{this.state.task.name}</span></p>
                                                        <p className="description-details">Related KnowledgeBlock:&nbsp;&nbsp;<span className="task-details-name-blue">{this.state.task.relatedKnowledgeBlock}</span></p>
                                                        <p className="description-details">Related CareerPaths:&nbsp;&nbsp;<span className="task-details-name-blue">{this.state.task.relatedCareerPath}Software Development Engineering, Software Test Engineering</span></p>
                                                        <p className="description-details">Task Mentor:&nbsp;&nbsp;<span className="task-details-name">{this.state.task.taskMentor}</span></p>
                                                    </div>
                                                </TabPane>
                                                <TabPane tab="Discussions" key="3">
                                                    <Discussion taskEngagementId={taskEngagementId} discussions={this.state.discussions}/>
                                                </TabPane>
                                                <TabPane tab="Resources" key="4">
                                                    <div className="col-md-12 col-sm-12 col-xs-12"><p className="task-details-name-blue">{this.state.task.resources || ""}</p></div>
                                                </TabPane>
                                                <TabPane tab="Gmeet link" key="5">
                                                    <div className="col-md-12 col-sm-12 col-xs-12 d-flex">
                                                        {this.state.googleMeetLink !== "" ? <a href={this.state.googleMeetLink} className="googleMeetLink" target="_blank">{this.state.googleMeetLink}</a> :
                                                            <p><b>no gmeet url has been set yet by mentor</b></p>}
                                                    </div>
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-12 paddingBottom no-right-padding-div">
                                    <div className="task-details-cards">
                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <p className="mentor-assigned" >Mentor Assigned</p>
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12 p-bottom-50">
                                            <div className="col-md-3 col-sm-4 col-xs-12 no-padding-div">
                                                <img src={this.state.user.profilePicUrl} className="image-size" />
                                            </div>
                                            <div className="col-md-9 col-sm-8 col-xs-12 no-padding-div">
                                                <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                                    <Link to={{pathname:"/mentor/"+this.state.user.userName,state:this.state.mentor._id}}> <a>  <p className="mentor-name">{this.state.user.firstName}&nbsp;{this.state.user.lastName}</p></a></Link>
                                                    <p className="mentor-pos" >Senior Develoment at IBM Enterprise</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-xs-12 col-sm-12">
                                            <p className="mentor-erpertise">Expertise</p>
                                            <p className="mentor-tech">Javascript, Nodejs, React, React + Redux, MongoDB</p>
                                            <div>
                                                <button className="applozic-launcher" onClick={() =>this.openDatePicker()}><span className="detail-flow"><img src={videoIcon} width={32} height={28} alt="icon"/>&nbsp; Schedule a meeting</span></button>
                                                {/*<Tooltip title="Hii" color="white">*/}

                                                {/*</Tooltip>*/}
                                                <button onClick={()=>this.showChatModal()} className="applozic-launcher" data-mck-id={this.state.mentor._id} data-mck-name="" ><span className="detail-flow"><img src={ChatIcon} />&nbsp;&nbsp;Chat with Mentor</span></button>
                                                {isChatModal && <ChatModal onCancel={()=>this.hideChatModal()} taskEngagementId={taskEngagementId} isChatModal={isChatModal} taskCompleted={disabled}/>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="task-details-cards">
                                        {disabled ?
                                            <>
                                                <div className="col-md-12 col-xs-12 col-sm-12" >
                                                    <div className="col-md-4 col-xs-12 col-sm-12"><span>Task completion date: </span></div>
                                                    <div className="col-md-8 col-xs-12 col-sm-12"><span>{(this.state && this.state.data && moment(this.state.data.updatedAt).format("MMMM Do YYYY")) || ''}</span></div>
                                                </div>
                                                <div className="col-md-12 col-xs-12 col-sm-12" >
                                                    <div className="col-md-4 col-xs-12 col-sm-12"><span>Review and Feedback from my Mentor for this Task: </span></div>
                                                    <div className="col-md-8 col-xs-12 col-sm-12"><span>{(this.state && this.state.data && this.state.data.feedback && this.state.data.feedback.mentorFeedback) || 'No feedback'}</span></div>
                                                </div>
                                                <div className="col-md-12 col-xs-12 col-sm-12" >
                                                    <div className="col-md-4 col-xs-12 col-sm-12"><span>This is the feedback you entered for the Mentor: </span></div>
                                                    <div className="col-md-8 col-xs-12 col-sm-12"><span>{(this.state && this.state.data && this.state.data.feedback && this.state.data.feedback.userFeedback) || 'No feedback'}</span></div>
                                                </div>
                                                <div className="col-md-12 col-xs-12 col-sm-12" >
                                                    <div className="col-md-4 col-xs-12 col-sm-12"><span>Rating: </span></div>
                                                    <div className="col-md-8 col-xs-12 col-sm-12"><span><Rate allowHalf disabled value={(this.state && this.state.data && this.state.data.rating && this.state.data.rating.user2mentor) || 0} /></span></div>
                                                </div>
                                            </>
                                            :
                                            <div className="col-md-12 col-xs-12 col-sm-12" >
                                                <div className="col-md-12 col-xs-12 col-sm-12">
                                                    <p className="end-task" >End the Task</p>
                                                    <p className="endTask-desc"> Lorem ipsum dolor sit amet, consectetur adipisic elit, sed do</p>
                                                </div>
                                                <div className="col-md-12 col-xs-12 col-sm-12 mb-2">
                                                    <div className="col-md-4 col-xs-12 col-sm-12 padding-0">Mentor Rating:</div>
                                                    <div className="col-md-8 col-xs-12 col-sm-12"><Rate allowHalf defaultValue={0}  onChange={this.handleRatingChange} value={value} /></div>
                                                </div>
                                                <div className="col-md-12 col-xs-12 col-sm-12 mb-3 reason-select">
                                                    <Select showSearch placeholder="Select a Reason" className="endTask-select mb-2" onChange={this.handleChange.bind(this)}>
                                                        <Option value="completed">I’ve successfully completed the task</Option>
                                                        <Option value="resume later"> I’d like to hold on to this now & maybe resume later</Option>
                                                        <Option value="quit" >I’d like to move on & do something else</Option>
                                                        <Option value="bad mentor">I’m not satisfied with the mentor’s behavior</Option>
                                                        <Option value="mentor not available">Mentor doesn’t seem to be available</Option>
                                                        <Option value="other">Some other reason..</Option>
                                                    </Select>
                                                </div>
                                                {/*<div className="col-md-12 col-xs-12 col-sm-12">*/}
                                                {/*    <Input placeholder="Write comment…" className="m-Bottom-30" id='comment' />*/}
                                                {/*</div>*/}
                                                <div className="col-md-12 col-xs-12 col-sm-12">
                                                    <TextArea rows={3} placeholder="Write feedback…" className="m-Bottom-30" id='feedback' />
                                                </div>
                                                <div className="col-md-12 col-xs-12 col-sm-12 mt-2">
                                                    <Button className="ensTask-btn" onClick={()=>this.endTask()}> End the Task </Button>
                                                </div>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            )
        //}
    }
}

export default withRouter(CurrentTask);
