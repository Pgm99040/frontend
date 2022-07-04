import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import mentor from '../../images/mentor.png';
import UserModal from "./UserModal";
import GoogleWithLogin from "./GoogleWithLogin";
import {getFromStorage} from "../../config/common";
import {becomeMentor} from "../utils/_data";
import codediy_logo from '../../images/codediy_logo.jpg'
require('../../styles/header.css');
// require('../../styles/antd.css');
let isLoggedIn = getFromStorage('isLoggedIn');
let displayMentorDashboard =false;
let displayMenteeDashboard = false;
let localData = localStorage;


function ProfileTab (props){
		//return(<Link className="header-nav-item" id="facebook_login"><i className="fa fa-facebook" aria-hidden="true"></i>&nbsp;{props.userName}</Link>)
		return(<li className="dropdown user_menu">
				    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
				    {props.userName}
				    <img src={props.userPic} alt="" className="profile-image img-circle"/></a>
				    <ul className="dropdown-menu">
						{/* <li><Link to="/myKnowledgeLocker"><i className="fa fa-cog"></i> Account</Link></li>
				        <li className="divider"></li> */}

				        {localData.userType === "user" && <li><Link  to={{pathname:localData.userType==="user"?"/mentee/myprofile":"/mentor/myprofile",state:"mentorprofile"}} ><i className="fa fa-user" /> My Profile</Link></li>}
						{localData.userType==="user" && <li><Link  to="/job-postings" ><i className="fa fa-shopping-cart" />Job Postings</Link></li>}
						{localData.userType==="user" && <li><Link  to="/codeCast" ><i className="fa fa-book" aria-hidden="true" />Code Cast</Link></li>}
						{localData.userType==="user" && <li><Link  to="/expert-guidance" ><i className="fa fa-question-circle"/>Expert Guidance</Link></li>}
						{localData.userType==="user" && <li><Link  to="/McqTest" ><i className="fa fa-question-circle"></i>Practice Tests</Link></li>}
						{localData.userType === "user" && <li><Link to="/LiveSessions" ><i className="fa fa-book" aria-hidden="true" />Live Learning sessions</Link></li>}
				        {localData.userType === "user" && <li><Link to="/MicroCourse" ><i className="fa fa-book" aria-hidden="true" />Micro Course</Link></li>}
						{localData.userType === "mentor" && <li><Link to="/mentor-dashboard" ><i className="fa fa-book" aria-hidden="true" />Mentor Dashboard</Link></li>}
				        <li><Link onClick={props.logout} ><i className="fa fa-sign-out" />Sign out</Link></li>
				    </ul>
				</li>)
}



class Header extends React.Component {
    constructor(props) {
		super(props);
		this.state={
		    userName : '',
            isLoggedIn : false,
            userPic : '',
            showMobileMenu : false,
            loading: false,
            visible: false,
            isVisible :false,
            userType :false
		}
		/* this.showModal =this.showModal.bind(this);
		this.renderPopup =this.renderPopup.bind(this); */
	}

    componentDidMount() {
		//this.state={isLoggedIn : false}
		this.setState({isLoggedIn : false,userName : 'Login with Facebook'});
		//console.log(this.state.isLoggedIn)
		//console.log(typeof isLoggedIn)
	   	if (isLoggedIn == 'true')  {
			   let userData;
			   let userPic;
			   let isVisible = localStorage.getItem("isVisible");
			   if(localData.userData == null|| localData.userData == '' || localData.userData=='null') {
				   userData = {};
				   userPic =''
			   }else {
				   console.log("Hello")
				   userData = JSON.parse(localStorage.getItem('userData'));
				userPic = userData.profilePicUrl;
			 	userData = userData?.firstName || userData?.name +" "+ userData?.lastName || "";
			 		this.setState({userName : userData,isLoggedIn: true,userPic : userPic});
				}

			 if(isVisible == true) {
				this.showModal();
			}

		}
	    // window.fbAsyncInit = function() {
	    //     window.FB.init({
	    //       appId      : Properties.Facebook_App_id,
	    //       cookie     : true,
	    //       xfbml      : true,
	    //       version    : 'v2.11'
	    //     });
	    //
	    //     window.FB.AppEvents.logPageView();
	    // };
		//
	    // (function(d, s, id){
		//        var js, fjs = d.getElementsByTagName(s)[0];
		//        if (d.getElementById(id)) {return;}
		//        js = d.createElement(s); js.id = id;
		//        js.src = "https://connect.facebook.net/en_US/sdk.js";
		//        fjs.parentNode.insertBefore(js, fjs);
	    //  }(document, 'script', 'facebook-jssdk'));
	    // console.log(this.state.userName,'userName');
	}
	componentWillReceiveProps(nextState){
		const {popup} = this.state;
		if(popup !== nextState.popup){
			console.log(nextState.popup);
			if(this.state.authToken) {
				this.setState({
					visible:nextState.popup
				})
			}else {
				this.setState({
					visible:popup
				})
			}

        }
	}

    // handleClick(_this) {
    //     window.FB.getLoginStatus(function(response) {
    //      if (response.status == 'connected') {
	// 		   let accessToken = response.authResponse.accessToken;
	// 		   let responseData = [];
    //           //console.log('Welcome!');
    //           window.FB.api('/me', {fields: 'id,name,first_name,last_name,email,picture.width(800).height(800),location'}, function(response) {
	// 			  //console.log({fb:response})
	// 			 this.state={userName : "Welcome! "+response.name,isLoggedIn: true};
	//
	// 			  //console.log({fn:accessToken})
	// 			  responseData = {
	// 				"firstName": response.first_name,
	// 				"lastName": response.last_name,
	// 				"email": response.email,
	// 				"profilePicUrl":response.picture.data.url,
	// 				"authToken":accessToken,
	// 				"authenticatingSite":"facebook",
	// 				"platform":"web"
	// 			  };
	// 			  //console.log(responseData);
    //               axios.post(BaseUrl.base_url+"/userLogin",JSON.stringify(responseData),{ 'headers': { 'Content-Type': 'application/json' } },).then((response)=>{
	// 				console.log({CD:response.data.result})
	// 				//_this.setState({username:response.data.result.userName})
	//
	// 				localStorage.setItem('userData', JSON.stringify(response.data.result));
	// 				localStorage.setItem('authToken', "Bearer"+" "+response.data.result.token);
	// 				localStorage.setItem('id', response.data.result._id);
	// 				localStorage.setItem('mentorId',response.data.result.mentorId)
	// 				localStorage.setItem('isMentor',false);
	// 				localStorage.setItem('isLoggedIn', true);
	// 				localStorage.setItem('isMentorApproved',response.data.result.IsMentorApproved)
	// 				localStorage.setItem('activeTasks',response.data.result.activeTasks);
	// 					_this.showModal();
	//
    //             });
    //           });
    //         } else {
    //             window.FB.login(function(response) {
	// 				let accessToken = response.authResponse.accessToken; //uncomment
	// 				//let accessToken ="EAAX64nzkN0oBABJvf0zHMUy9XWAPeGZAsPENepF8Q7FwCzd95HZB49ZBxLAB1rNHTypxXgWzyJz5VNMD5St4sBP34VyKTQJ81z3gipQ6xKX2FsL7OBU8isLATzlMkZANFRZBBgaS06IuSiWtsWVWgWB5sIMljERiFxEEEipvc9qFN4ZAzw6oC5NnrvrEZANNhaEiX88Bg2IZAWpd8FG1Nyub";
	//
	// 				let responseData = [];
    //                 window.FB.api('/me', {fields: 'id,name,first_name,last_name,email,picture.width(800).height(800),location'}, function(response) {
    //                     this.state={userName : "Welcome! "+response.name,isLoggedIn: true};
	// 					//console.log({login:response})
	// 					//console.log({UD:localStorage.getItem('userData')})
	//
	//
	// 					//==========uncomment==========//
	// 					responseData = {
	// 						"firstName": response.first_name,
	// 						"lastName": response.last_name,
	// 						"email": response.email,
	// 						"profilePicUrl":response.picture.data.url,
	// 						"authToken":accessToken,
	// 						"authenticatingSite":"facebook",
	// 						"platform":"web"
	// 					  };
	//
	// 					// responseData = {
	// 					// 	"firstName": "Dick",
	// 					// 	"lastName": "Letuchyberg",
	// 					// 	"email": "yiwomvuxxo_1527518847@tfbnw.net",
	// 					// 	"profilePicUrl":"https://scontent.fblr5-1.fna.fbcdn.net/v/t1.30497-1/c282.0.960.960a/p960x960/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=3&_nc_sid=12b3be&_nc_ohc=dT80mM8vQlIAX_GrmQI&_nc_ht=scontent.fblr5-1.fna&tp=27&oh=89807eb11a0ac27ecb3adb595ed3a9d5&oe=604AEE72",
	// 					// 	"authToken":accessToken,
	// 					// 	"authenticatingSite":"facebook",
	// 					// 	"platform":"web"
	// 					//   };
	//
	// 					// responseData = {
	// 					// 	"firstName": "Jennifer",
	// 					// 	"lastName": "Valtchanovwitz",
	// 					// 	"email": "ejfpctsgvt_1525914263@tfbnw.net",
	// 					// 	"profilePicUrl":"https://res.cloudinary.com/djstijf3p/image/upload/c_scale,w_50/v1615967525/default-profile-pic.jpg",
	// 					// 	"authToken":accessToken,
	// 					// 	"authenticatingSite":"facebook",
	// 					// 	"platform":"web"
	// 					//   };
	//
	// 					  //console.log(responseData);
    //                     axios.post(BaseUrl.base_url+"/userLogin",JSON.stringify(responseData),{ 'headers': { 'Content-Type': 'application/json' } }).then((response)=>{
	//
	// 					//_this.setState({username:response.data.result.userName})
	// 					localStorage.setItem('userData', JSON.stringify(response.data.result));
	// 					localStorage.setItem('authToken',  "Bearer"+" "+response.data.result.token);
	// 					localStorage.setItem('id', response.data.result._id)
	// 					localStorage.setItem('mentorId',response.data.result.mentorId)
	// 					localStorage.setItem('isMentor', false);
	// 					localStorage.setItem('isLoggedIn', true);
	// 					localStorage.setItem('isMentorApproved',response.data.result.IsMentorApproved)
	// 					localStorage.setItem('activeTasks',response.data.result.activeTasks);
	// 					//mentor needs to be check
	// 						_this.showModal();
    //                     });
    //                 });
    //             }, {scope: 'email'});
    //         }
    //     });
    // }

    // mentorHandleClick=(_this)=> {
    // 	window.FB.getLoginStatus(function(response) {
    //      if (response.status == 'connected') {
	// 		   let accessToken = response.authResponse.accessToken;
	// 		   let responseData = [];
    //           //console.log('Welcome!');
    //           window.FB.api('/me', {fields: 'id,name,first_name,last_name,email,picture.width(800).height(800),location'}, function(response) {
	// 			  //console.log({fb:response})
	// 			 this.state={userName : "Welcome! "+response.name,isLoggedIn: true};
	//
	// 			  //console.log({fn:accessToken})
	// 			  responseData = {
	// 				"firstName": response.first_name,
	// 				"lastName": response.last_name,
	// 				"email": response.email,
	// 				"profilePicUrl":response.picture.data.url,
	// 				"authToken":accessToken,
	// 				"authenticatingSite":"facebook",
	// 				"platform":"web"
	// 			  };
	// 			  //console.log(responseData);
    //               axios.post(BaseUrl.base_url+"/userLogin",JSON.stringify(responseData),{ 'headers': { 'Content-Type': 'application/json' } },).then((response)=>{
	// 				console.log({CD:response.data.result})
	//
	// 				//this.setState({username:response.data.result.userName})
	// 				localStorage.setItem('userData', JSON.stringify(response.data.result));
	// 				localStorage.setItem('authToken', "Bearer"+" "+response.data.result.token);
	// 				localStorage.setItem('id', response.data.result._id);
	// 				localStorage.setItem('mentorId',response.data.result.mentorId)
	// 				localStorage.setItem('isMentor',false);
	// 				localStorage.setItem('isLoggedIn', true);
	// 				localStorage.setItem('isMentorApproved',response.data.result.IsMentorApproved)
	// 				localStorage.setItem('activeTasks',response.data.result.activeTasks);
	// 				_this.mentorLogin();
	//
    //             });
    //           });
    //         } else {
    //             //console.log('Login!');
    //             window.FB.login(function(response) {
	// 				let accessToken = response.authResponse.accessToken;
	// 				let responseData = [];
    //                 window.FB.api('/me', {fields: 'id,name,first_name,last_name,email,picture.width(800).height(800),location'}, function(response) {
    //                     this.state={userName : "Welcome! "+response.name,isLoggedIn: true};
	// 					//console.log({login:response})
	// 					//console.log({UD:localStorage.getItem('userData')})
	// 					responseData = {
	// 						"firstName": response.first_name,
	// 						"lastName": response.last_name,
	// 						"email": response.email,
	// 						"profilePicUrl":response.picture.data.url,
	// 						"authToken":accessToken,
	// 						"authenticatingSite":"facebook",
	// 						"platform":"web"
	// 					  };
	// 					  //console.log(responseData);
    //                     axios.post(BaseUrl.base_url+"/userLogin",JSON.stringify(responseData),{ 'headers': { 'Content-Type': 'application/json' } }).then((response)=>{
	// 					//console.log({CD:response});
	// 					//this.setState({username:response.data.result.userName})
	// 					localStorage.setItem('userData', JSON.stringify(response.data.result));
	// 					localStorage.setItem('authToken',  "Bearer"+" "+response.data.result.token);
	// 					localStorage.setItem('id', response.data.result._id)
	// 					localStorage.setItem('mentorId',response.data.result.mentorId)
	// 					localStorage.setItem('isMentor', false);
	// 					localStorage.setItem('isLoggedIn', true);
	// 					localStorage.setItem('isMentorApproved',response.data.result.IsMentorApproved)
	// 					localStorage.setItem('activeTasks',response.data.result.activeTasks);
	//
	// 					//mentor needs to be check
	// 						_this.mentorLogin();
    //                     });
    //                 });
    //             }, {scope: 'email'});
    //         }
    //     });
    // }

	becomeMentor = (_this) =>{
    	// const userData = getFromStorage("userData");
    	// const authToken = getFromStorage("authToken");

		//this.setState({username:response.data.result.userName})
		// localStorage.setItem('userData', JSON.stringify(response.data.result));
		// localStorage.setItem('authToken', "Bearer"+" "+response.data.result.token);
		// localStorage.setItem('id', response.data.result._id);
		// localStorage.setItem('mentorId',response.data.result.mentorId)
		// localStorage.setItem('isMentor',false);
		// localStorage.setItem('isLoggedIn', true);
		// localStorage.setItem('isMentorApproved',response.data.result.IsMentorApproved)
		// localStorage.setItem('activeTasks',response.data.result.activeTasks);
		_this.mentorLogin(_this);

	};


    logout(){
		localStorage.removeItem('authToken');
		localStorage.removeItem('mentorId');
		localStorage.removeItem('id');
		localStorage.removeItem('isLoggedIn');
		localStorage.removeItem('userData');
		localStorage.removeItem('activeTasks');

		localStorage.removeItem('userType')
		localStorage.removeItem('isMentor');
		localStorage.removeItem('isMentorApproved');
		localStorage.removeItem('isVisible');
		localStorage.removeItem('reason');
		localStorage.removeItem('state');


		window.location.href = "/";
	}
	showModal(_this){
		_this.setState({
		  visible: true,
		});
		localStorage.setItem('isVisible',true)
		//console.log('true')
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
        // axios.get(BaseUrl.base_url+"/api/v1/becomeMentor/"+userid, {headers: {Authorization: localStorage.getItem('authToken')}}).then((response)=>{
		// 	//console.log(response);
        //     this.setState({visible:false});
		// 	localStorage.setItem('isMentor',true);
		// 	localStorage.setItem('isVisible', false);
		// 	localStorage.setItem('userType','mentor');
		// 	window.location.href="/mentor-dashboard"
		//
        // });
	};

	userLogin(_this) {
		displayMenteeDashboard=true;
		_this.setState({visible:false});
		localStorage.setItem('isVisible', false);
		localStorage.setItem('userType','user');
		window.location.href="/tasklist"

	}


    render() {
		const { visible, loading } = this.state;

        return (
            <div className="row header-home">
				<div className="col-md-3 col-sm-4 header-main">
					{((this.state.isLoggedIn) && (localStorage.getItem('userType')=='user'))?<Link to="/tasklist" className="header-nav-item code-title"><img src={codediy_logo} height={'50px'} width={'200px'}/></Link>:''}
					{((this.state.isLoggedIn) && (localStorage.getItem('userType')=='mentor'))?<Link to="/mentor-dashboard" className="header-nav-item code-title"><img src={codediy_logo} height={'50px'} width={'200px'}/></Link>:''}
					{!(this.state.isLoggedIn) ?<Link to="/" className="header-nav-item code-title">CodeDIY</Link>:''}
				</div>
				<div className="col-md-9 col-sm-8 login-btn">
					<div className="header-nav">
						{/*{(((localStorage.getItem('userType')=='user') && (localStorage.getItem('isMentor'))=='false') || !(this.state.isLoggedIn))?<Link to="" className="header-nav-item" onClick={()=>this.becomeMentor(this)}>Become a Mentor?</Link>:''}*/}
						{((this.state.isLoggedIn) && (localStorage.getItem('userType')=='user'))?<Link to="/tasklist" className="header-nav-item">Browse Tasks</Link>:<Link></Link>}
						{(localStorage.getItem('userType')=='user')?<a href='/menteedashboard' className="header-nav-item">My Dashboard</a>:''}
						{(localStorage.getItem('userType')=='mentor')?<a href='/mentor-dashboard' className="header-nav-item">My Dashboard</a>:''}
						{/*{(localStorage.getItem('userType')=='mentor')?<a href='/mentor-dashboard' className="header-nav-item">My Dashboard</a>:''}*/}
						{this.state.isLoggedIn ?<ProfileTab
							userPic={this.state.userPic}
							userName={this.state.userName}
							username={this.state.username}
							logout = {() => this.logout()}
						/>: <GoogleWithLogin title="Login with Google" showModal = {() =>this.showModal(this)}/>
						}
					</div>
				</div>
                {/*<div className="col-md-12 col-sm-12 col-xs-hidden header-main">*/}
                {/*   */}
                {/*</div>*/}
				<div className="popup">
                    {localStorage.getItem("isVisible") && <UserModal visible={visible}
                                                                     handleCancel={() =>this.handleCancel(this)}
                                                                     mentorLogin={() =>this.mentorLogin(this)}
                                                                     userLogin={() =>this.userLogin(this)}
                    />}
				</div>
            </div>

        )
    }
}
export default Header;
