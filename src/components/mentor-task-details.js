import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import Header from './login/header';
import BaseUrl from '../config/properties';
import {Progress, Tabs, Input, Button, Rate, Select, Spin} from 'antd';
import TaskLogo from '../images/bitmap.png';
import MentorAnswers from './mentor-answers';
import MentorDiscussion from './mentor-discussion';
import ChatIcon from '../images/chatIcon.png';
import SweetAlert from 'sweetalert-react';
import userDefaultImage from '../images/user.png';
import ChatModal from "./chat/ChatModal";
import {createGMeetLink, ratingMentorToUser, viewTask} from "./utils/_data";
import '../styles/mentor-dashboard.css';
import moment from "moment-timezone";
import Loader from "./common/Loader";

const TabPane = Tabs.TabPane;
const {TextArea} = Input;
const Option = Select.Option;
var disabledRating = false;
var mentorRating;
var userRating;
var ratingText;

class MentorTaskDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            started: 0,
            task: '',
            user: '',
            mentor: '',
            subcategory: '',
            category: '',
            loading: true,
            submissions: [],
            discussions: [],
            googleMeetLink: '',
            value: 0,
            messageForEndTask: '',
            messageForEndedTask: '',
            endTask: false,
            endedTask: false,
            taskEnded: false,
            rating: 0,
            mentee: '',
            mentorRated: false,
            mentorNotRated: false,
            isChatModal: false,
            message: '',
            mentorFeedback: false,
            review: {feedback: '', comment: ''},
            ratedTitle: '',
            payment: [],
            feedbackError: '',
            isLoading: false,
        };
        this.handleRatingChange = this.handleRatingChange.bind(this)
    }

    componentDidMount() {
        //console.log(this.props)
        this.getAllData();
    }

    //get all the data for the first time with the task engagement Id
    getAllData = async () => {
        const taskId = this.props.match.params.taskEngagementId;
        const response = await viewTask(taskId);
        if (response?.data?.status_code === 200) {
            this.setState({
                data: response.data.result,
                task: response.data.result.task,
                mentor: response.data.result.mentor,
                subcategory: response.data.result.task.subcategory,
                category: response.data.result.task.subcategory.category,
                user: response.data.result.mentor.user,
                mentee: response.data.result.user,
                loading: false,
                submissions: response.data.result.submissions,
                discussions: response.data.result.discussions,
                rating: response.data.result.rating,
                feedback: response.data.result.feedback,
                payment: response.data.result.payment,
                googleMeetLink: response.data.result.gmeetLinkUrl || ""
            });
        } else {
            console.log("error---->");
        }
        // axios.get(BaseUrl.base_url+"/api/v1/te/view/"+this.props.params.taskEngagementId,{ 'headers': {
        //     "Content-Type": "application/json",
        //     "Authorization": localStorage.getItem('authToken')
        //   }
        // }).then((response)=>{
        //         localStorage.setItem('reason','')
        //         this.setState({data: response.data.result,
        //                 task:response.data.result.task,
        //                 mentor:response.data.result.mentor,
        //                 subcategory:response.data.result.task.subcategory,
        //                 category:response.data.result.task.subcategory.category,
        //                 user:response.data.result.mentor.user,
        //                 mentee:response.data.result.mentor.user,
        //                 loading:false,
        //                 submissions:response.data.result.submissions,
        //                 discussions:response.data.result.discussions,
        //                 rating:response.data.result.rating,
        //                 feedback:response.data.result.feedback,
        //                 payment:response.data.result.payment,
        //                 googleMeetLink: response.data.result.gmeetLinkUrl || ""
        //             });
        //
        //     }
        // );
    };

    //rating for user from mentor api call
    handleRatingChange = async (value) => {
        //console.log(value)
        var taskData = {
            "taskEngagementId": this.props.match.params.taskEngagementId,
            "rating": value,
        };
        const response = await ratingMentorToUser(taskData);
        disabledRating = true;
        userRating = value;
        ratingText = 'Rated';
        if (response.data.status_code === 200) {
            this.setState({mentorRated: true, message: response.data.message, ratedTitle: 'Success'})
        } else {
            this.setState({mentorRated: true, message: response.data.message, ratedTitle: 'Warning'})
        }

        // axios.post(BaseUrl.base_url+'/api/v1/te/rate/mentorToUser',JSON.stringify(taskData),{ 'headers': {
        //     "Content-Type": "application/json",
        //     "Authorization": localStorage.getItem('authToken')
        //   }
        // }).then((response)=>{
        //    // console.log(response)
        //     disabledRating = true
        //     userRating = value
        //     ratingText ='Rated'
        //     if(response.data.status_code === 200 ) {
        //         this.setState({mentorRated : true, message:response.data.message, ratedTitle: 'Success'})
        //     } else {
        //         this.setState({mentorRated : true, message:response.data.message, ratedTitle: 'Warning'})
        //     }
        // }).catch(error => {
        //     throw(error);
        //     //this.setState({mentorNotRated : false,message:response.data[0].message})
        // });
    };

    callback(key) {
        //console.log(key);
    }

    //Sweet alert reset state
    successRate() {
        this.setState({mentorRated: false});
        this.getAllData()
    }

    failureRate() {
        this.setState({mentorNotRated: false});
        this.getAllData()
    }

    successFeedback() {
        this.setState({mentorFeedback: false});
        this.getAllData()
    }

    failureFeedback() {
        this.setState({mentorFeedback: false})
        this.getAllData();
    }

    showChatModal(isOpen) {
        this.setState({isChatModal: true})
    }

    hideChatModal() {
        this.setState({isChatModal: false})
    }

    createGmeetLink = async () => {
        let taskEngagementId = this.props.match.params.taskEngagementId || "";
        const {googleMeetLink} = this.state;
        const data = {gMeetUrl: googleMeetLink};
        const res = await createGMeetLink(taskEngagementId, data);
        if (res && res.success) {
            console.log("success---->")
        } else {
            console.log("error---->")
        }
    };
    addFeedback = async () => {
        let taskEngagementId = this.props.match.params.taskEngagementId || "";
        console.log("document.getElementById('comment').value", document.getElementById('comment').value, document.getElementById('feedback').value)
        const payload = {
            "comment": document.getElementById('comment').value || '',
            "feedback": document.getElementById('feedback').value || '',
            "taskEngagementId": taskEngagementId,
            isReview: true
        };

        if ((document.getElementById('comment').value === '') && (document.getElementById('feedback').value === '')) {
            this.setState({feedbackError: "At list one filed is required!"});
            return true
        } else {
            const response = await ratingMentorToUser(payload);
            if (response.data.success) {
                this.setState({mentorFeedback: true, feedbackError: ''})
            } else {
                console.log("Error--->>>");
            }
            this.setState({review: {feedback: '', comment: ''}});
        }
    };

    reviewChange = (e) => {
        this.setState(prevState =>({
            ...prevState,
            review: {
                ...prevState.review,
                [e.target.name]: e.target.value
            }
        }))
    };

    render() {
        const {value, isChatModal, data, feedbackError, feedback, review} = this.state;
        let taskEngagementId = this.props.match.params.taskEngagementId || "";
        var started;
        var inProgress;
        var end;
        var disabled = false;
        var displayRating = false;
        var displayZero = false;
        var mentorToUserRating;
        var menteeName = '';
        var menteeProfilePic = null;
        var noFeedback = 'No feedback from the mentee';
        // var isSubmitFeedback = true;
        //anonymous check
        if (this.state.data.isAnonymous == true) {
            menteeName = 'Mentee';
            menteeProfilePic = userDefaultImage
        } else {
            menteeName = this.state.mentee.firstName + ' ' + this.state.mentee.lastName;
            menteeProfilePic = this.state.mentee.profilePicUrl
        }

        //status check for progress bar
        if (this.state.data.status == "started") {
            started = 100;
            inProgress = 0;
            end = 0;
            disabledRating = true;
            disabled = false;
            ratingText = 'Not Rated'
        } else if (this.state.data.status == "inprogress") {
            started = 100;
            inProgress = 100;
            end = 0;
            disabledRating = true;
            disabled = false;
            ratingText = 'Not Rated'
        } else if (this.state.data.status == 'completed') {
            started = 100;
            inProgress = 100;
            end = 100;
            disabledRating = false;
            disabled = true;
            ratingText = 'Rate Now'
        }

        //rating check for mentor rating the mentee
        if (this.state.rating.user2mentor == 0) {
            mentorRating = 0
        } else {
            mentorRating = (Math.round(this.state.rating.user2mentor * 2)) / 2;
            disabledRating = true;
        }
        if (typeof this.state.rating.mentor2user == 'undefined' || this.state.rating.mentor2user == 0) {
            mentorToUserRating = 0;
            disabledRating = false;
            ratingText = 'Rate Now';
            displayZero = true;
            displayRating = false
        } else if (typeof this.state.rating.mentor2user == 'number') {
            mentorToUserRating = (Math.round(this.state.rating.mentor2user * 2)) / 2;
            ratingText = 'Rated';
            disabledRating = true;
            displayRating = true;
            displayZero = false;
        }
        // if ((feedback && feedback.mentorFeedback === null) && (feedback && feedback.mentorFeedback === null)) {
        //     isSubmitFeedback = false;
        // }
        //main html
        return (
            <div>
                <SweetAlert
                    show={this.state.mentorRated}
                    title={this.state.ratedTitle}
                    type={(this.state.ratedTitle).toLowerCase()}
                    text={this.state.message}
                    onConfirm={() => this.successRate()}
                />
                <SweetAlert
                    show={this.state.mentorNotRated}
                    title="Warning"
                    type="success"
                    text={this.state.message}
                    onConfirm={() => this.failureRate()}
                />
                <SweetAlert
                    show={this.state.mentorFeedback}
                    title={"Success"}
                    type="success"
                    text={"Successfully add your feedback for mentee."}
                    onConfirm={this.state.mentorFeedback ? () => this.failureFeedback() : () => this.successFeedback()}
                />
                <div className="main_div">
                    <Header/>
                </div>
                <Link onlyActiveOnIndex to={"/mentor-dashboard"}><a className="back-btn">&lt;&nbsp;Back</a></Link>
                <Spin spinning={this.state.loading} className='loading'/>
                <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                    <div className="col-md-8 col-sm-8 col-xs-12 paddingBottom  no-padding-div">
                        <div className="task-details-cards text-center">
                            <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                                <div className="col-md-2 col-sm-4 col-xs-12 no-right-padding-div">
                                    <img src={TaskLogo}/>
                                </div>
                                <div className="col-md-8 col-sm-6 col-xs-12">
                                    <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div top-10 paddingBottom">
                                        <span className="task_name">{this.state.task.name}</span>
                                        <div className="divider"></div>
                                        <span className="task_category">{this.state.category.name}</span>
                                        <span className="bulletin">&bull;</span>
                                        <span className="task_difficulty">{this.state.task.difficultyLevel}</span>

                                    </div>
                                    <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                        <p className='task_desc paddingBottom'
                                           dangerouslySetInnerHTML={{__html: this.state.task.description || "-"}}/>
                                        <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                                            <Progress percent={started} showInfo={false}/>
                                            <p className='progress-text text-left'>Started</p>
                                        </div>
                                        <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div center-progress-bar">
                                            <Progress percent={inProgress} showInfo={false}/>
                                            <p className='progress-text text-center'>In Progress</p>
                                        </div>
                                        <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                                            <Progress percent={end} showInfo={false}/>
                                            <p className='progress-text text-right'>End</p>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 padding-sides">
                                        <div className="hyperLink">
                                            <a href={`/mentor-task-details/${this.props.match.params.taskEngagementId}/AddMentorTaskReview`}>AddMentorTaskReview</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2 col-sm-2 col-xs-12 no-padding-div top-10 paddingBottom">
                                    <span
                                        className="mentorTask_pay">{this.state.payment.taskPurchaseType == "credits" ? this.state.payment.credits + ' ' + 'Credits' : this.state.payment.currency + ' ' + 'Currency'}</span>

                                </div>

                            </div>
                        </div>
                        <div className="task-details-cards text-center">
                            <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                                <Tabs defaultActiveKey="1" onChange={() => this.callback()}>
                                    <TabPane tab="Answers" key="1">
                                        <MentorAnswers taskEngagementId={this.props.match.params.taskEngagementId}
                                                       submissions={this.state.submissions}/>
                                    </TabPane>
                                    <TabPane tab="Description" key="2">
                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <p className="description-desc"
                                               dangerouslySetInnerHTML={{__html: this.state.task.description || "-"}}/>
                                            <p className="description-details">Task Category:&nbsp;&nbsp;<span
                                                className="task-details-name">{this.state.task.name}</span></p>
                                            <p className="description-details">Related KnowledgeBlock:&nbsp;&nbsp;<span
                                                className="task-details-name-blue">{this.state.task.relatedKnowledgeBlock}</span>
                                            </p>
                                            <p className="description-details">Related CareerPaths:&nbsp;&nbsp;<span
                                                className="task-details-name-blue">{this.state.task.relatedCareerPath}Software Development Engineering, Software Test Engineering</span>
                                            </p>
                                            <p className="description-details">Task Mentor:&nbsp;&nbsp;<span
                                                className="task-details-name">{this.state.task.taskMentor}</span></p>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Discussions" key="3">
                                        <MentorDiscussion taskEngagementId={this.props.match.params.taskEngagementId}
                                                          discussions={this.state.discussions}/>
                                    </TabPane>
                                    <TabPane tab="Resources" key="4">
                                        <div className="col-md-12 col-sm-12 col-xs-12"><p
                                            className="task-details-name-blue">{this.state.task.resources || ""}</p>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Gmeet link" key="5">
                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <input type="text" name="gmeetLinkUrl"
                                                   value={this.state.googleMeetLink || ""} onChange={(e) => {
                                                this.setState({googleMeetLink: e.target.value})
                                            }}/>
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <div className="col-md-10 col-sm-10 col-xs-12">
                                                &nbsp;
                                            </div>
                                            <div className="col-md-2 col-sm-2 col-xs-12 no-right-padding-div">
                                                <Button className="post-btn" htmlType='submit'
                                                        onClick={() => this.createGmeetLink()}
                                                        disabled={this.state.googleMeetLink === "" ? true : false}>Set
                                                    Gmeet Link URL</Button>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-xs-12 paddingBottom no-right-padding-div">
                        <div className="task-details-cards">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <p className="mentor-assigned">Mentee Profile</p>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 p-bottom-50">
                                <div className="col-md-3 col-sm-4 col-xs-12 no-padding-div">
                                    <img src={menteeProfilePic} className="image-size"/>
                                </div>
                                <div className="col-md-9 col-sm-8 col-xs-12 no-padding-div">
                                    <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                        <p className="mentor-name">{menteeName}</p>
                                        <Rate allowHalf defaultValue={0} value={value}
                                              onChange={this.handleRatingChange}
                                              style={{display: displayZero ? 'inline-block' : 'none'}}/> <span
                                        style={{display: displayZero ? 'inline-block' : 'none'}}>{ratingText} </span>
                                        <Rate allowHalf defaultValue={0} value={mentorToUserRating}
                                              disabled={disabledRating ? true : false}
                                              style={{display: displayRating ? 'inline-block' : 'none'}}/> <span
                                        style={{display: displayRating ? 'inline-block' : 'none'}}>{ratingText} </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <span className="detail-flow" onClick={() => this.showChatModal()}><img
                                    src={ChatIcon}/>&nbsp;&nbsp;Chat with Mentee</span>
                                {isChatModal &&
                                <ChatModal onCancel={() => this.hideChatModal()} taskEngagementId={taskEngagementId}
                                           isChatModal={isChatModal}/>}
                                {/*<a href="#" className="applozic-launcher" data-mck-id={this.state.mentee._id} data-mck-name="" disabled ={disabled ?true : false }> <p className="chat-mentor" ><img src={ChatIcon} />&nbsp;&nbsp;Chat with Mentee</p></a>*/}
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 public-url">
                                <a href={`${BaseUrl.website_url}/user/${this.state.mentee.userName}`} target="_blank"><p
                                    className="detail-flow">{BaseUrl.website_url + "/user/" + this.state.mentee.userName || ""}</p>
                                </a>
                            </div>

                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <p className="feedback-from-mentee">Feedback from this mentee</p>
                                <p className="feedback-from-mentee">Your Mentee will give Feedback when they Complete
                                    and Close the task</p>
                                <p className="feedback-desc">{(feedback && feedback.userFeedback === '') ? noFeedback : feedback && feedback.userFeedback}</p>
                                <div className="displayInline"><p className="mentor-rating"> You’ve been
                                    rated:&nbsp;&nbsp;</p><Rate allowHalf defaultValue={0} value={mentorRating}
                                                                disabled/></div>
                            </div>
                        </div>
                        {disabled ?
                            <div className="task-details-cards">
                                {(data && data.mentor2userReview) ?
                                    <div>
                                        <div className="col-md-12 col-xs-12 col-sm-12">
                                            <div className="col-md-4 col-xs-12 col-sm-12">
                                                <span>Task completion date: </span></div>
                                            <div className="col-md-8 col-xs-12 col-sm-12">
                                                <span>{data && moment(data.endDate).format("DD/MM/YYYY") || ''}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-xs-12 col-sm-12">
                                            <div className="col-md-4 col-xs-12 col-sm-12"><span>My Review Text for Mentee: </span>
                                            </div>
                                            <div className="col-md-8 col-xs-12 col-sm-12">
                                                <span>{data && data.feedback && data.feedback.mentorFeedback || 'No feedback'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-xs-12 col-sm-12">
                                            <div className="col-md-4 col-xs-12 col-sm-12"><span>Comment: </span></div>
                                            <div className="col-md-8 col-xs-12 col-sm-12">
                                                <span>{data && data.comment && data.comment.mentor2user || 'No comment'}</span>
                                            </div>
                                        </div>
                                    </div> :
                                    <div>
                                        <div className="col-md-12 col-xs-12 col-sm-12">
                                            <div className="col-md-12 col-xs-12 col-sm-12"><p
                                                className="text-danger">{feedbackError || ''}</p></div>
                                            <div className="col-md-12 col-xs-12 col-sm-12">
                                                <Input placeholder="Write comment…" name="comment"
                                                       value={review.comment || ''}
                                                       onChange={(e) => this.reviewChange({
                                                           target: {
                                                               name: 'comment',
                                                               value: e.target.value
                                                           }
                                                       })}
                                                       className="m-Bottom-30" id='comment'/>
                                            </div>
                                            <div className="col-md-12 col-xs-12 col-sm-12">
                                                <TextArea rows={3} placeholder="Write feedback…" name="feedback"
                                                          value={review.feedback || ''}
                                                          onChange={(e) => this.reviewChange({
                                                              target: {
                                                                  name: 'feedback',
                                                                  value: e.target.value
                                                              }
                                                          })} className="m-Bottom-30" id='feedback'/>
                                            </div>
                                            <div className="col-md-12 col-xs-12 col-sm-12 mt-2">
                                                <Button className="ensTask-btn"
                                                        onClick={() => this.addFeedback()}>Submit</Button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div> : ''}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MentorTaskDetails);



