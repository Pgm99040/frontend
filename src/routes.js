// Import Required modules.
import React from 'react';
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import ReactDOM from 'react-dom';
// Import styles.

// Importing components.
import App from './components/app';
import Login from './components/login/Login'
import Home from './components/home';
import Header from './components/login/header';
import Testpage from './components/testpage';
import MenteeListing from './components/tasklist';
import TaskListing from './components/task';
import TaskDetails from './components/task-details';
import MentorDashboard from './components/mentor-dashboard';
import Category from './components/category';
import Redirect from './components/redirect';
import MenteePaymentHistory from './components/mentee-payment-history';
import CurrentTask from './components/current-task';
import MentorTaskDetails from './components/mentor-task-details';
import MentorProfile from './components/mentor-profile'
import MenteeProfile from './components/mentee-profile'
import MenteeProfilePublic from './components/mentee-profile-public';
import PurchaseCredits from './components/credits-purchase';
import ImageUploadTest from './components/imguploadtest';
import PaypalTransaction from "./components/PaypalTransaction";
import LiveSession from "./components/LiveSession/index";
import PurchaseForBatch from "./components/LiveSession/purchase/PurchaseForBatch"
import LiveSessionDetails from "./components/LiveSession/LiveSessionDetails";
import MicroCourseDetail from "./components/MicroCourse/MicroCourseDetails";
import MicroCourse from "./components/MicroCourse";
import Privacy from './components/privacy';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import store, { history } from './store';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import "antd/dist/antd.css";
import style from './styles/style.css';
import 'font-awesome/css/font-awesome.min.css';
import './styles/font-awesome-4.7.0/css/font-awesome.css';
import Footer from "./components/footer";
import CodeFeed from "./components/codeFeed";
import MicroCourseHome from "./components/MicroCourse/MicroCourseHome";
import Blog from "./components/blog";
import BlogDetail from "./components/blogDetail";
import JobPostings from "./components/jobPosting";
import BatchDetail from "./components/batchDetail";
import ExportGuidance from "./components/exportGuidance";
import Mentor from "./components/mentors";
import AddMentorTaskReview from "./components/AddMentorTaskReview";
import ViewMentorReview from "./components/viewMentorReviewForTask";
import CodeCast from './components/CodeCast'
import MccqTest from "./components/McqTest";
import StartMcqTest from './components/StartMcqTest'
import ShowResultTest from "./components/ShowResultTest";


let authToken = localStorage.getItem('authToken');
if (authToken==null || authToken=='') {
    localStorage.setItem('isLoggedIn', false);
    localStorage.setItem('userData', []);

}


function userLoggedIn(nextState,replace) {
    console.log('authToken', localStorage.getItem('authToken'))
    if(localStorage.getItem('authToken')=='' || localStorage.getItem('authToken')==null) {
        replace({
            pathname :'/home'
        })
    }else if(localStorage.getItem('authToken') && localStorage.getItem('userType')=='user') {
        // localStorage.clear();
        // localStorage.setItem('isLoggedIn', false)
        // localStorage.setItem('isVisible',true)
        // replace({
        //     pathname :'/home'
        // })
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('isVisible',false);
    }

}

function mentorLoggedIn(nextState,replace) {
    //console.log('aaa')
    if(localStorage.getItem('authToken')=='' || localStorage.getItem('authToken')==null) {
        console.log("Hiiii>>>>")
        replace({
            pathname :'/home'
        })
    }else if(localStorage.getItem('authToken') && (localStorage.getItem('userType')=='mentor' || localStorage.getItem('userType')=='user')) {
        // localStorage.clear();
        // localStorage.setItem('isLoggedIn', false)
        // localStorage.setItem('isVisible',true)
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('isVisible',false)
        // replace({
        //     pathname :'/home'
        // })
    }
}

const Routers =(props)=> {
    const history = useHistory();
    console.log("propsIn routes",props)
    return (
        <Provider store = {store}>
            <ConfigProvider locale={enUS}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/menteelogin" component={Login}/>
                        <Route path="home" component={Home} />
                        <Route path="testpage" component={Testpage}  />
                        <Route path="category" component={Category} />
                        <Route path="task" component={TaskListing} />
                        <Route path="/tasklist" render={() =><MenteeListing />} onEnter={mentorLoggedIn}/>
                        <PrivateRoute path="/task-engagement/:taskId" component={CurrentTask} exact/>
                        <PrivateRoute path="/task-engagement/:taskId/ViewMentorReviewForTask" component={ViewMentorReview} />
                        <Route path="mentee-payment-history/:taskId" component={MenteePaymentHistory} onEnter={mentorLoggedIn}/>
                        <Route name="task-details" path="/task-details/:taskId" component={TaskDetails} onEnter={mentorLoggedIn} />
                        <Route name="detailed-task-requirements" path="/detailed-task-requirements/:taskId" component={TaskDetails} onEnter={mentorLoggedIn} />
                        <PrivateRoute path="/mentor-task-details/:taskEngagementId/AddMentorTaskReview" component={AddMentorTaskReview} />
                        <Route path="/mentor-task-details/:taskEngagementId" component={MentorTaskDetails} onEnter={userLoggedIn}/>
                        <Route path="redirect" component={Redirect} />
                        <Route path="/mentor-dashboard" component={MentorDashboard} onEnter={userLoggedIn}/>
                        <Route path="image-upload-test" component={ImageUploadTest}/>
                        <Route path="/menteedashboard/:activeView?" render={() => <MenteePaymentHistory />} />
                        <Route path="/mentor/myprofile" component ={MentorProfile} />
                        <Route path="/mentor/:mentorName" component ={MentorProfile} />
                        <Route path="/user/:username" component = {MenteeProfilePublic} />
                        <Route path="/mentee/myprofile" component={MenteeProfile} onEnter={mentorLoggedIn}/>
                        <Route path="/purchase-credits" component={PurchaseCredits} />
                        <Route path="/LiveSessions/:title/:title" component={() =><BatchDetail/>} />
                        <Route path="/LiveSessions/:title" component={() =><LiveSessionDetails/>} />
                        <Route path="/LiveSessions" component={LiveSession} />
                        <Route path="/MicroCourse/:id/Lesson" component={MicroCourseHome} />
                        <Route path="/MicroCourse/:title" component={MicroCourseDetail} />
                        <Route path="/MicroCourse" component={MicroCourse}/>
                        <Route path="/McqTest" component={MccqTest}/>
                        <Route path="/TestResult/:testId" component={ShowResultTest}/>
                        <Route path="/MCQTests/Test/:testId" component={StartMcqTest}/>
                        <Route path="/privacy" component={Privacy}/>
                        <Route path='/paypal' component={PaypalTransaction} />
                        <Route path='/purchase_batch/:batchId/live_session/:sessionId' component={PurchaseForBatch} />
                        <Route path='/codeFeed' component={CodeFeed}/>
                        <Route path='/codeCast' component={CodeCast}/>
                        <Route path='/blogs/:blogName' component={BlogDetail}/>
                        <Route path='/blogs' component={Blog}/>
                        <Route path='/job-postings' component={JobPostings}/>
                        <Route path='/expert-guidance' component={ExportGuidance}/>
                        <Route path='/mentors' component={Mentor}/>
                    </Switch>
                    {/*<Route path="/" component={App}>*/}

                    {/*</Route>*/}
                </Router>
            </ConfigProvider>
            <div style={{flex: 1}}/>
            <Footer />
        </Provider>
    )
}

export default Routers
