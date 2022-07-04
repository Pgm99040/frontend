import React from 'react';
import { Input, Button } from 'antd';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import userDefaultImage from '../images/user.png';
import {viewTask, addDiscussion} from "./utils/_data";
const { TextArea } = Input;
class MentorDiscussion extends React.Component {
    constructor() {
        super();
        this.state = {
            discussions: [],
            data:[],
            postedSuccess:false,
            postedUnsuccess:false,
            postedMessage:'',
            authToken:'',
	    	userData:[],
            msg: '',
            url:'',
            user:'',
            mentor:'',
            mentorUser:''
        }
    }
    componentDidMount() {
        let isLoggedIn = localStorage.getItem('isLoggedIn');
		let authToken = null;
		let userData = [];
		if (isLoggedIn == 'true')  {
			 authToken = localStorage.getItem('authToken');
			 userData = JSON.parse(localStorage.getItem('userData'));
             console.log(userData)
			 console.log(userData);
			 this.setState({
						authToken:authToken,
						userData:userData,
                        url:userData.profilePicUrl,
                        
					});
	   }
        //this.setState({discussions:this.props.discussions},)
        this.getAllData()
    }
    getAllData = async () =>{
        const taskId = this.props.taskEngagementId;
        const response = await viewTask(taskId);
        if (response?.data?.status_code === 200){
            console.log(response);
            this.setState({discussions:response.data.result.discussions.reverse(),
                data:response.data.result,
                user:response.data.result.user,
                mentor:response.data.result.mentor,
                mentorUser:response.data.result.mentor.user});
        } else {
            console.log("error------>");
        }

        // axios.get(BaseUrl.base_url+"/api/v1/te/view/"+this.props.taskEngagementId,{ 'headers': {
        //     "Content-Type": "application/json",
        //     "Authorization": localStorage.getItem('authToken')
        //   }
        // }).then((response)=>{
        //     console.log(response);
        //         this.setState({discussions:response.data.result.discussions.reverse(),
        //                        data:response.data.result,
        //                        user:response.data.result.user,
        //                        mentor:response.data.result.mentor,
        //                        mentorUser:response.data.result.mentor.user});
        //     }
        // );
    };
    resetState() {
        this.setState({
            postedSuccess:false,
            postedUnsuccess:false,
            postedMessage:''
        });
        this.setState({msg: ""});
        document.getElementById("myForm").reset();
          this.getAllData();
    }


    postMessage = async () =>{
        let messageData =[];
        messageData = {
            "taskEngagementId": this.props.taskEngagementId,
            "postedBy": 'mentor', //localStorage.getItem('userType')
            "mentorId": JSON.parse(localStorage.getItem('userData')).mentor,
            "description": this.state.msg,
            "fileUrl": ''
          };
        const response = await addDiscussion(messageData);
        if(response?.data?.status_code === 200 && response?.data?.success === true) {
            this.setState({postedSuccess:true,postedMessage:response.data.message})
        }else if(response?.data?.status_code === 500) {
            this.setState({postedUnsuccess:true, postedMessage:response.data.message})
        } else {
            this.setState({postedUnsuccess:true,postedMessage:response.data.message[0].msg})
        }
        this.setState({msg: ""});
        // axios.post(BaseUrl.base_url+"/api/v1/te/discussion",JSON.stringify(messageData),
        //     { 'headers': { 'Content-Type': 'application/json',
        //                     'Authorization': localStorage.getItem('authToken') }
        //     }).then((response)=>{
        //     console.log(response)
        //     if(response.data.status_code =200 && response.data.success == true) {
        //         this.setState({postedSuccess:true,postedMessage:response.data.message})
        //     }else if(response.data.status_code==500) {
        //         this.setState({postedUnsuccess:true, postedMessage:response.data.message})
        //     } else {
        //         this.setState({postedUnsuccess:true,postedMessage:response.data.message[0].msg})
        //     }
        // })
        // .catch((err) => {
        //     console.log(err)
        // });
    };

    renderMessagesList() {
        if(this.state.data) {
            return (
                    this.state.discussions.map((obj,index) => {
                    return this.renderMessagesView(obj,index)
                }))
        }
    }

    renderMessagesView(obj,index) {
        var time =obj.createdAt
        var localDate = new Date(time);
        var date = moment(localDate).fromNow();
        if(obj.postedBy == 'user' && this.state.user.isAnonymous == true) {
            return (
                <div className="col-md-12 col-sm-12 col-xs-12 m-Bottom-30 no-left-padding-div" key={index}>
                    <div className="col-md-12 col-sm-12 col-xs-12 d-flex flex-column">
                        <div className="row">
                            <div className="col-sm-2 col-md-2 col-lg-2 col-xs-2">
                                <img src={userDefaultImage} className="discussions-imageSize" />
                            </div>
                            <div className="col-sm-10 col-md-10 col-lg-10 col-xs-10">
                                <p className="discussion-name">Mentee(Anonymous)&nbsp;&nbsp;<span className="discussion-time">{date}</span></p>
                                <p className="discussion-text">{obj.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else if(obj.postedBy == 'user' && this.state.user.isAnonymous == false) {
            return (
                <div className="col-md-12 col-sm-12 col-xs-12 m-Bottom-30 no-left-padding-div" key={index}>
                    <div className="col-md-12 col-sm-12 col-xs-12 d-flex flex-column justify-content-end">
                        <div className="row">
                            <div className="col-sm-2 col-md-2 col-lg-2 col-xs-2">
                                <img src={this.state.user.profilePicUrl} className="discussions-imageSize" />
                            </div>
                            <div className="col-sm-10 col-md-10 col-lg-10 col-xs-10">
                                <p className="discussion-name">{this.state.user.firstName}&nbsp;{this.state.user.lastName}&nbsp;&nbsp;<span className="discussion-time">{date}</span></p>
                                <p className="discussion-text">{obj.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else if(obj.postedBy=='mentor') {
            return (
                <div className="col-md-12 col-sm-12 col-xs-12 m-Bottom-30 no-left-padding-div mentee-mode" key={index}>
                    {/*<div className="col-md-1 col-sm-1 col-xs-12 no-left-padding-div">*/}
                    {/*    <img src={this.state.mentorUser.profilePicUrl} className="discussions-imageSize" />*/}
                    {/*</div>*/}
                    <div className="col-md-12 col-sm-12 col-xs-12 d-flex flex-column justify-content-end">
                        <div className="row">
                            <div className="col-sm-2 col-md-2 col-lg-2 col-xs-2">
                                <img src={this.state.mentorUser.profilePicUrl} className="discussions-imageSize" />
                            </div>
                            <div className="col-sm-10 col-md-10 col-lg-10 col-xs-10">
                                <p className="discussion-name">{this.state.mentorUser.firstName}&nbsp;{this.state.mentorUser.lastName}&nbsp; <span className="discussion-time">{date}</span></p>
                                <p className="discussion-text">{obj.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        
    }
    render() {
        var disabled =false;
        if(this.state.data.status === 'completed') {
            disabled =true
        }else {
            disabled =false
        }
        return (
            <div className="col-md-12 col-sm-12 col-xs-12 mentor-discuss">
            <SweetAlert
                    show={this.state.postedSuccess}
                    title="Success"
                    type="success"
                    text= {this.state.postedMessage}
                    onConfirm={() => this.resetState()}
			    />
                <SweetAlert
                    show={this.state.postedUnsuccess}
                    title="Error"
                    type="error"
                    text= {this.state.postedMessage}
                    onConfirm={() => this.resetState()}
			    />
                <div className="col-md-1 col-sm-1 col-xs-12 no-left-padding-div" >
                    <img src={this.state.url} className="discussionsmentee-imageSize" />
                </div>
                <div className="col-md-11 col-sm-11 col-xs-12">
                    <div className="discussion-position" >
                    <form action="javascript:void(0);" id="myForm">
                        <TextArea rows={3} id='messageChat' required={true} value={this.state.msg} onChange={(e) =>this.setState({msg: e.target.value})} placeholder="Write post here…" className="m-Bottom-30" disabled ={disabled ? true : false } />
                        <Button className="discussion-btn" onClick ={()=>this.postMessage()} disabled ={disabled ? true : false }> Post </Button>
                    </form>
                    </div>
                </div>
                {this.renderMessagesList()}
                {/* <div className="col-md-12 col-sm-12 col-xs-12 m-Bottom-30 no-left-padding-div">
                    <div className="col-md-1 col-sm-1 col-xs-12 no-left-padding-div">
                        <img src={mentee1} className="discussions-imageSize" />
                    </div>
                    <div className="col-md-11 col-sm-11 col-xs-12">
                        <p className="discussion-name">Sherin&nbsp; <span className="discussion-time">13 hours ago </span></p>
                        <p className="discussion-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>

                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 m-Bottom-30 no-left-padding-div">
                    <div className="col-md-1 col-sm-1 col-xs-12 no-left-padding-div">
                        <img src={John} className="discussions-imageSize" />
                    </div>
                    <div className="col-md-11 col-sm-11 col-xs-12">
                        <p className="discussion-name">John Doe&nbsp; <span className="discussion-time">13 hours ago </span></p>
                        <p className="discussion-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>

                    </div>
                </div> */}
            </div>
        )
    }
}

export default MentorDiscussion