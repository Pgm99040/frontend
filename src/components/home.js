import React from 'react';
import { Link } from 'react-router-dom';
import Header from './login/header';
import Footer from './footer';
import { Collapse } from 'antd';
import Properties from '../helper/constant';
import axios from 'axios';
import BaseUrl from '../config/properties';
import logo from '../images/banner-image.png';
import comp from '../images/group-24.png';
import browser from '../images/browser-window-3.png';
import browser_first from '../images/browser-window-1.png';
import browser_second from '../images/browser-window-2.png';

import ModalVideo from 'react-modal-video'
import { Modal } from 'antd';
import mentor from '../images/mentor.png';
import mentee from '../images/mentee.png';
import GoogleWithLogin from "./login/GoogleWithLogin";
import {becomeMentor} from "./utils/_data";
import homepage_infographic1 from "../images/homepage_infographic1.jpg";
import homepage_infographic2 from "../images/homepage_infographic2.jpg";
require('../styles/home.css');
require('../styles/modal-video.css');

var displayMentorDashboard =false;
var displayMenteeDashboard = false;

const Panel = Collapse.Panel;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
var isLoggedIn = localStorage.getItem('isLoggedIn');
var authStr='';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userName : '',
            isLoggedIn : '',
            userPic : '',
            isOpen: false
        };
    }

    componentDidMount() {
        this.setState({isLoggedIn : false,userName : 'Login with Facebook'});
	   	if (isLoggedIn == 'true')  {
            let userData;
            let userPic;
            if(localStorage.getItem('userData') == null|| localStorage.getItem('userData') === '' ||localStorage.getItem('userData') === 'null') {
                userData = {};
                userPic =''
            }else {
            userData = JSON.parse(localStorage.getItem('userData'));
             userPic = userData && userData.profilePicUrl;
              userData = userData.firstName+" "+userData.lastName;
                  this.setState({userName : userData,isLoggedIn: true,userPic : userPic});
             }
		}
	    window.fbAsyncInit = function() {
	        window.FB.init({
	          appId      : Properties.Facebook_App_id,
	          cookie     : true,
	          xfbml      : true,
	          version    : 'v2.11'
	        });
	          
	        window.FB.AppEvents.logPageView();        
	    };

	    (function(d, s, id){
		       var js, fjs = d.getElementsByTagName(s)[0];
		       if (d.getElementById(id)) {return;}
		       js = d.createElement(s); js.id = id;
		       js.src = "https://connect.facebook.net/en_US/sdk.js";
		       fjs.parentNode.insertBefore(js, fjs);
	     }(document, 'script', 'facebook-jssdk'));
	    //console.log(this.state.userName,'userName');
    }
    
    handleClick(_this) {
        window.FB.getLoginStatus(function(response) {
         if (response.status === 'connected') {
			   let accessToken = response.authResponse.accessToken;
			   let responseData = [];
              //console.log('Welcome!');
              window.FB.api('/me', {fields: 'id,name,first_name,last_name,email,picture.width(800).height(800),location'}, function(response) {
				  //console.log({fb:response})
				 this.state={userName : "Welcome! "+response.name,isLoggedIn: true};
				 
				  //console.log({fn:accessToken})
				  responseData = {
					"firstName": response.first_name,
					"lastName": response.last_name,
					"email": response.email,
					"profilePicUrl":response.picture.data.url,
					"authToken":accessToken,
					"authenticatingSite":"facebook",
					"platform":"web"
				  };
				  //console.log(responseData);
                  axios.post(BaseUrl.base_url+"/userLogin",JSON.stringify(responseData),{ 'headers': { 'Content-Type': 'application/json' } }).then((response)=>{
					//console.log({CD:response.data.result})
					localStorage.setItem('userData', JSON.stringify(response.data.result));
					localStorage.setItem('authToken', "Bearer"+" "+response.data.result.token);
					localStorage.setItem('id', response.data.result._id);
                    localStorage.setItem('mentorId',response.data.result.mentorId);
					localStorage.setItem('isMentor',false);
                    localStorage.setItem('isLoggedIn', true);
                    localStorage.setItem('isMentorApproved',response.data.result.IsMentorApproved);
						_this.showModal();
					
                });
              });
            } else {
                //console.log('Login!');
                window.FB.login(function(response) {
					let accessToken = response.authResponse.accessToken;
					let responseData = [];
                    window.FB.api('/me', {fields: 'id,name,first_name,last_name,email,picture.width(800).height(800),location'}, function(response) {
                        this.state={userName : "Welcome! "+response.name,isLoggedIn: true};
						//console.log({login:response})
						//console.log({UD:localStorage.getItem('userData')})
						responseData = {
							"firstName": response.first_name,
							"lastName": response.last_name,
							"email": response.email,
							"profilePicUrl":response.picture.data.url,
							"authToken":accessToken,
							"authenticatingSite":"facebook",
							"platform":"web"
						  };
						  //console.log(responseData);
                        axios.post(BaseUrl.base_url+"/userLogin",JSON.stringify(responseData),{ 'headers': { 'Content-Type': 'application/json' } }).then((response)=>{
						//console.log({CD:response});
						localStorage.setItem('userData', JSON.stringify(response.data.result));
						localStorage.setItem('authToken',  "Bearer"+" "+response.data.result.token);	
						localStorage.setItem('id', response.data.result._id);
                        localStorage.setItem('mentorId',response.data.result.mentorId);
						localStorage.setItem('isMentor', false);
                        localStorage.setItem('isLoggedIn', true);
                        localStorage.setItem('isMentorApproved',response.data.result.IsMentorApproved);
						//mentor needs to be check
							_this.showModal();
                        });
                    });
                }, {scope: 'email'});
            }
        });
    }

    
    callback(key) {
        //console.log(key);
    }
    showModal(_this){
		_this.setState({visible: true,});
	}
	handleCancel(_this) {
		_this.setState({ visible: false });
        localStorage.setItem('isVisible', false);
    }
    
    mentorLogin = async () =>{
        //console.log('mentor')
        displayMentorDashboard=true;
        let userid= localStorage.getItem('id');
        const res = await becomeMentor(userid);
        if (res?.success){
            localStorage.setItem('IsMentorApproved',true);
            localStorage.setItem('isMentor',true);
            localStorage.setItem('isVisible', false);
            localStorage.setItem('userType','mentor');
            window.location.href="/mentor-dashboard";
            //location.reload();
            this.setState({ visible: false });
        } else {
            console.log("error---->");
        }
        // axios.get(BaseUrl.base_url+"/api/v1/becomeMentor/"+userid, {headers: {Authorization: localStorage.getItem('authToken')}}).then((response)=>{
        //     //console.log(response);
        //     localStorage.setItem('IsMentorApproved',true)
        //     localStorage.setItem('isMentor',true);
        //     localStorage.setItem('isVisible', false);
        //     localStorage.setItem('userType','mentor')
        //     window.location.href="/mentor-dashboard"
        //     //location.reload();
        //     this.setState({ visible: false });
        // });
    };
    userLogin() {
        console.log("userLogin--------------->");
        displayMenteeDashboard=true;
        localStorage.setItem('isVisible',false);
        localStorage.setItem('userType','user');
        window.location.href="/tasklist";
        this.setState({visible:false})
    }
    openModal() {
        this.setState({isOpen: true})
      }

    render() {
        const { visible, loading } = this.state;
        return (
            <div>
                <div className="main_div_home">
                    <Header />
                    <div className="container-fluid paddingTop">
						<div className="row">
                            <div className ="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <p className="the-best-people-headertext">The Best Learning Happens...</p>
                                <p className="make-it-headertext">When you actually do the task</p>
                                <p className="collaborate-with-headertext">Perform carefully curated job tasks and get expert opinion for code and design review.
                                </p>
                                <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 get-started">
                                    <ModalVideo channel='youtube' width='100%' isOpen={this.state.isOpen} videoId='-aLhTdIT0Lk' onClose={() => this.setState({isOpen: false})} />
                                    <div><button className="button-white" onClick={()=>this.openModal()}><span className="how-it-works-buttonText">HOW IT WORKS</span></button></div>
                                    <div><GoogleWithLogin title="GET STARTED" showModal = {() =>this.showModal(this)} /></div>
                                </div>
                            </div>
                            <div className ="col-lg-6 col-md-6 col-sm-6 col-xs-12 imageposition">
                                <img src={logo} className="image-pstn" />
                            </div>
						</div>
                    </div>
                </div>
                <div className="img-section">
                    <div className="row">
                            <div className ="col-12 col-md-6  ">
                                <div className="container1" style={{marginTop: "15px", display:"flex",justifyContent:'center'}}>
                                    <img src={homepage_infographic1}  height={'500px'}/>
                                </div>
                            </div>
                            <div className ="col-12 col-md-6  ">
                                <div className="container2" style={{marginTop: "15px", display:"flex",justifyContent:'center'}}>
                                    <img src={homepage_infographic2}  height={'500px'}/>
                                </div>
                        </div>
                    </div>
                </div>
				<div className="second-section">
                    <div className="row">
                        <div className ="col-md-12 col-sm-12 col-xs-12 home-walkthrough">
                            <p className = "share-exp">Learing a new skill has</p>
                            <p className = "never-simple">Never been simpler</p>
                            <Collapse accordion bordered={false} defaultActiveKey={['1']} onChange={this.callback()}>
                                <Panel showArrow={false} header="Pick a task" key="1">
                                    <div className= "col-lg-6 padding-0">
                                        <p className='accordion-text' >The Expert team at CodeDIY has carefully curated programming and design tasks in a variety of
                                            functional areas in Software Engineering. Just pick a technology or domain area you want to learn and pick a task in it.
                                            e.g. Databases --> MySQL basic operations. Enter your mentor preferences like language of instruction and voila! CodeDIY assigns
                                            a mentor who can answer all your questions and guide you through completion of this task.
                                        </p>
                                    </div>
                                   {window.outerWidth <= 1024 && <img src={browser_first} className="browser-image"/>}
                                   {window.outerWidth >= 1025 && <div className ="col-lg-6 accordion-imageposition">
                                        <img src={browser_first} className="browser-image"/>
                                    </div>}
                                </Panel>
                                <Panel showArrow={false} header="Task Submission" key="2">
                                    <div className= "col-md-6 col-sm-6 col-xs-12">
                                        <p>Submit your work as zip files and get feedback from your mentor to improvise your code and design</p>
                                    </div>
                                    {window.outerWidth <= 1024 && <img src={browser_second} className="browser-image"/>}
                                    {window.outerWidth >= 1025 && <div className ="col-lg-6 col-md-6 col-sm-12 col-xs-12 accordion-imageposition">
                                        <img src={browser_second} className="browser-image"/>
                                    </div>}
                                </Panel>
                                <Panel showArrow={false} header="Get reviewed by a Mentor" key="3">
                                    <div className= "col-md-6 col-sm-12 col-xs-12">
                                        <p>The mentor is an expert in the task domain and can provide insightful tips in discussion sessions.
                                            The mentor will review your code and design and suggest improvements.

                                            As you keep submitting new versions of the code, you get
                                            better at the art of software engineering.
                                            In the end, the mentor closes out the task after you perform satisfactorily and gives you a rating for the task, that you
                                            can proudly display as a Badge for your future employers.
                                        </p>
                                    </div>
                                    {window.outerWidth <= 1024 && <img src={browser} className="browser-image"/>}
                                    {window.outerWidth >= 1025 && <div className ="col-lg-6 col-md-6 col-sm-12 col-xs-12 accordion-imageposition">
                                        <img src={browser} className="browser-image"/>
                                    </div>}
                                </Panel>
                            </Collapse>
                        </div>
                        <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12 browse-tasks">
                            <GoogleWithLogin title="Browse tasks" showModal = {() =>this.showModal(this)}/>
                        </div>
                    </div>
                </div>
				<div className="third-section">
                    <div className="row">
                        <div className ="col-lg-6 col-xl-6 col-md-12 col-sm-12 col-xs-12 imageposition">
                            <img src={comp} className="comp-pstn"/>
                        </div>
                        <div className ="col-lg-6 col-xl-6 col-md-12 col-sm-12 col-xs-12">
                            <p className="whats-in-it-for">What’s in it for</p>
                            <p className="make-it-headertext">Mentor?</p>
                            <p className="collaborate-with-headertext">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</p>
                            <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 three-mentor-tasks">
                                <div className ="col-lg-4 col-md-4 col-sm-4 col-xs-12 padding-0">
                                    <p className="review-and-earn">Review and Earn</p>
                                </div>
                                <div className ="col-lg-4 col-md-4 col-sm-4 col-xs-12 padding-0">
                                    <p className="review-and-earn">Give Feedbacks</p>
                                </div>
                                <div className ="col-lg-4 col-md-4 col-sm-4 col-xs-12 padding-0">
                                    <p className="review-and-earn">Manage your Earnings</p>
                                </div>
                            </div>
                            <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0">
                                <button className="button-blue" onClick={ ()=>this.handleClick(this)}><span className="get-started-buttonText">Become a Mentor</span></button>
                            </div>
                        </div>
                    </div>
                </div> 
				
				<div className="fourth-section">
                    <div className="container-fluid">
						<div className="row">
                            <div className ="col-md-12 col-sm-12 col-xs-12 home-faq">
                                <p className="frequently-asked">Frequently Asked Questions</p>
                                <Collapse accordion defaultActiveKey={['1']} onChange={this.callback()}>
                                    <Panel header="What’s the cost of the Premium plan?" key="1">
                                        <p>{text}</p>
                                    </Panel>
                                    <Panel header="What payment methods does CodeDIY accept?" key="2">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim The advanced is perfect for conducting remote or in-person interviews. By giving candidates an easy, intuitive platform on which to showcase their skills, you're able to evaluate their true technical abilities - not just whether they're good at whiteboarding. And since code submissions are recorded, you're able to compare and contrast candidate submissions.</p>
                                    </Panel>
                                    <Panel header="How do support, training and onboarding work?" key="3">
                                        <p>{text}</p>
                                    </Panel>
                                    <Panel header="Can I create my own assessments?" key="4">
                                        <p>{text}</p>
                                    </Panel>
                                    <Panel header="What are CodeChallenges?" key="5">
                                        <p>{text}</p>
                                    </Panel>
                                    <Panel header="What payment methods does CodeDIY accept?" key="6">
                                        <p>{text}</p>
                                    </Panel>
                                </Collapse>
                            </div>
						</div>
                    </div>
                </div>
                <div className="popup">
					<Modal
					visible={visible}
					title={null}
					footer={null}
					onCancel={ () =>this.handleCancel(this)}
					> 
					<div className="col-md-12 col-sm-12 col-xs-12 text-center">
						<h1 className="popup-title">Please select your role</h1>
						<p className="popup-descptn">CodeDIY has verified mentors ready to offer guidance and mentees seeking help solving challenges. Please select your role today.</p>
					<div className="popup-image-padding">
					<div className="col-md-6 col-sm-6"><Link onClick={()=>this.mentorLogin()}><img src={mentor} className="popup-image"/><p className="popup-mentor">Mentor</p></Link></div>
					<div className="col-md-6 col-sm-6"><Link onClick={()=>this.userLogin()}><img src={mentee} className="popup-image"/><p className="popup-mentee">Mentee</p></Link></div>
						</div></div>
					</Modal>
				</div> 
            </div>
        );
    }
}

export default Home;