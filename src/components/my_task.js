import React from 'react';
import { Link } from 'react-router-dom';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import {Input, Select, Progress, Radio, DatePicker, Spin} from 'antd';
import { mentorTask } from "./utils/_data";
import MongoDBImage from '../images/bitmap.png';
import CheckedImage from '../images/checked.png';
import {Tab, Tabs} from "react-bootstrap";
import Loader from "./common/Loader";
require('../styles/mentorTask.css');
require('../styles/my_task.css');
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

var formDate = "";
var selectedExpertise = "";
var selectedPreferredLang = [];
var radioChecked = "Male";

const language = [
    {value: "English", label: "English"},
    {value: "Hindi", label: "Hindi"},
    {value: "Kannada", label: "Kannada"},
];

class MyTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postedSuccess : false,
            postedUnsuccess : false,
            postedMessage : "",
            data: [],
            userName:'',
            userData:[],
            authToken:'',
            url:'',
            razorpay:[],
            MyTask:[],
            ongoingTask: [],
            completedTask: [],
            selectedPreferredLang: [],
            flag : localStorage.getItem('isMentorApproved'),
            countOfTask:0,
            key: 1,
            loading:true
        };
        // this.postForm=this.postForm.bind(this);
        this.handleSelect = () => this.handleSelect;
        this.handleSelect = () => this.getResult;
    }

    componentDidMount() {
        let isLoggedIn = localStorage.getItem('isLoggedIn');
		let authToken = null;
        let userData = [];
        userData = JSON.parse(localStorage.getItem('userData'));
        let mentorID = userData.mentor;
        if (isLoggedIn == 'true')  {
            authToken = localStorage.getItem('authToken');
			 //console.log(userData);
			 this.setState({
						authToken:authToken,
						userData:userData,
                        url:userData.profilePicUrl,
                        userName:userData.firstName+" "+userData.lastName

					});
       }
       if(mentorID != 'null') {
           this.mentorTask(mentorID);
       // axios.get(BaseUrl.base_url + "/api/v1/te/mentor/mytask/"+ mentorID,
       //      {
       //          'headers': {
       //              "Content-Type": "application/json",
       //              "Authorization": localStorage.getItem('authToken')
       //          }
       //      }).then((response) => {
       //          console.log("-----response----", response);
       //
       //          this.setState({ MyTask: this.getResult(response.data.result) ,
       //                          countOfTask:response.data.result.length });
       //      }
       //      ).catch(function (error) {
       //          console.log({ error: error });
       //      });
        }
    }

    mentorTask = async (id) =>{
        const response = await mentorTask(id);
        if (response?.data?.success){
            const { objArray, ongoing, completed } = this.getResult(response.data.result);
            if ((ongoing !== [] || ongoing !== undefined) || (completed !== [] || ongoing !== undefined)){
                this.setState({ ongoingTask: ongoing, completedTask: completed ,
                    countOfTask:response.data.result.length,
                    loading:false});
            }
        }else {
            this.setState({loading:false})
            console.log("error------->>>");
        }
    };

    mapOrder (array, order) {

        array.sort( function (a, b) {
            var A = a._id, B = b._id;
            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            } else {
                return -1;
            }
        });
        return array;
    };

    renderCompletedTask(){
        const { completedTask } = this.state;
        if(completedTask && completedTask.length > 0) {
            let activeTasksIds = completedTask[0].mentor.activeTasks;
            let otherTasks = completedTask.filter(item => !activeTasksIds.includes(item._id));
            let activeTasks = completedTask.filter(item => activeTasksIds.includes(item._id));
            let myTaskList = [...activeTasks, ...otherTasks];
            return (myTaskList && myTaskList.map((obj,index) => this.renderMyTask(obj,index)));
        } else {
            return (<div>
                    <p className="myTask-desc">You have not been assigned any task yet. </p>
                </div>
            );
        }

    }

    //loop the MyTask array
    renderOngoingTask() {
        const { ongoingTask } = this.state;
        if (ongoingTask && ongoingTask.length > 0) {
            let activeTasksIds = ongoingTask[0].mentor.activeTasks;
            let otherTasks = ongoingTask.filter(item => !activeTasksIds.includes(item._id));
            let activeTasks = ongoingTask.filter(item => activeTasksIds.includes(item._id));
            let myTaskList = [...activeTasks, ...otherTasks];
            return (myTaskList && myTaskList.map((obj,index) => this.renderMyTask(obj,index)))
        } else {
                return (<div>
                    <p className="myTask-desc">You have not been assigned any task yet. </p>
                    </div>
                );
            }



        // if (this.state.countOfTask >0) {
        //     let activeTasksIds = this.state.MyTask[0].mentor.activeTasks;
        //     let otherTasks = this.state.MyTask.filter(item => !activeTasksIds.includes(item._id));
        //     let activeTasks = this.state.MyTask.filter(item => activeTasksIds.includes(item._id));
        //     let myTaskList = [...activeTasks, ...otherTasks];
        //     return (myTaskList && myTaskList.map((obj,index) => this.renderMyTask(obj,index)))
        // } else {
        //     return (<div>
        //         <p className="myTask-desc">You have not been assigned any task yet. </p>
        //         </div>
        //     );
        // }
    }

    //All My Task Listing
    renderMyTask(obj, index) {
        var date = moment(obj.createdAt);
        var endDate;
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
        var display = {
            display: 'none'
        };
        var completedTextDiv = "";
        if (obj.status === "started") {
            started = 100;
            inProgress = 0;
            end = 0;
            startedStatus= "active";
            statusText = "Started";
        } else if (obj.status === "inprogress") {
            started = 100;
            inProgress = 100;
            end = 0;
            inProgressStatus= "active";
            statusText = "In Progress";
        } else if (obj.status === 'completed') {
            statusText = "Closed";
            progressDiv = false;
            completedTextDiv = true;
            taskInProgress = false;
            taskClosed = true;
            endDate=moment(obj.endDate).format('LL')
        }
        if (this.state.isLoading) return <Loader/>;

        return (

            <div className="col-m-12 col-sm-12 col-xs-12 task-cards" key={index}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                    <div className="col-md-2 col-sm-3 col-xs-12">
                        <img className="taskIcon logo_image" src={obj?.task?.imageUrl} alt={'image_logo'}/>
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-12 no-left-padding-div">
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                         <Link to={`/mentor-task-details/${obj && obj.payment && obj.payment.taskEngagement}`}><span className="task_name">{obj?.task?.name}</span></Link>
                            <div className="divider"></div>
                            <span className="task_category" dangerouslySetInnerHTML={{__html: obj?.task?.description || "-"}} />
                            <span className="bulletin" >&bull;</span>
                            <span className="task_difficulty">{obj?.task?.difficultyLevel}</span>
                            <span className="bulletin" >&bull;</span>
                            <span className="taskInProgress" style={{ display: taskInProgress ? 'block' : 'none' }}>{statusText}</span>
                            <span className="taskClosed" style={{ display: taskClosed ? 'block' : 'none' }}>{statusText}</span>

                        </div>
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <p className="task_desc" dangerouslySetInnerHTML={{__html: obj?.task?.tinyDescription || "-"}} />
                            <div style={{ display: progressDiv ? 'block' : 'none' }}>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div firstProgressBar">
                                    <Progress percent={started} showInfo={false} status={startedStatus}/>
                                    <p className='progress-text text-left'>Started</p>
                                </div>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div center-progress-bar secondProgressBar">
                                    <Progress percent={inProgress} showInfo={false} status={inProgressStatus}/>
                                    <p className='progress-text text-center'>In Progress</p>
                                </div>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div thirdProgressBar">
                                    <Progress percent={end} showInfo={false} />
                                    <p className='progress-text text-right'>End</p>
                                </div>
                            </div>
                            <div style={{ display: completedTextDiv ? 'block' : 'none' }}>
                                <p className="completedTask"><img className="checkedImg" src={CheckedImage} />Completed on {endDate}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-3 col-xs-12 float-right">
                        {obj?.payment?.taskPurchaseType ?
                            <p className="task_rate">{obj?.payment?.taskPurchaseType=="credits"? obj?.payment?.credits + 'Credits' : obj?.payment?.currency}</p> : <p className="task_rate">0</p>}
                        </div>
                </div>
            </div>

        )
    }

    //rearrange the array according to in-progress, started and closed
    getResult(objArray) {
        let ongoing = [];
        let completed = [];
        // var results = objArray && objArray.filter(obj => obj.status.toLowerCase().includes("inprogress") || obj.status.toLowerCase().includes("started"));
        //
        // objArray = objArray && objArray.filter(function (obj) {
        //     return results.indexOf(obj) == -1;
        // });
        //
        // results && results.map((obj) => {
        //     objArray.unshift(obj);
        // });
        // return objArray;


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

    onChange(date, dateString) {
        formDate = dateString;
    }
    log(e) {
        console.log(e);
    }

    // handlePreferredLanguage(value) {
    //     selectedPreferredLang = `${value}`.split(",");
    // }
    // handleExpertise(value) {
    //     selectedExpertise = `${value}`.split(",");
    // }
    //
    // onChangeRadio(e) {
    //     radioChecked = `${e.target.value}`;
    // }


    // // form for profile updation
    // postForm() {
    //     //console.log('form')
    //     let formData = [];
    //     formData = {
    //         "userId": localStorage.getItem('id'),
    //         "firstName": document.getElementById('firstName').value,
    //         "lastName": document.getElementById('lastName').value,
    //         "country": document.getElementById('country').value,
    //         "city": document.getElementById('city').value,
    //         "zipCode": document.getElementById('zipcode').value,
    //         "company": document.getElementById('company').value,
    //         "companyLocation": document.getElementById('companyLocation').value,
    //         "currentFieldOfStudy": document.getElementById('currentFieldOfStudy').value,
    //         "currentWorkTitle": document.getElementById('currentWorkTitle').value,
    //         "gender": radioChecked,
    //         "designation": document.getElementById('designation').value,
    //         "dateOfBirth": formDate,
    //         "aboutMe": document.getElementById('aboutMe').value,
    //         "linkedInUrl": document.getElementById('linkedIn').value,
    //         "githubUrl": document.getElementById('github').value,
    //         "expertise": selectedExpertise,
    //         "preferredLanguages": selectedPreferredLang,
    //
    //     };
    //     axios.post(BaseUrl.base_url + "/api/v1/profileUpdate", JSON.stringify(formData),
    //         {
    //             'headers': {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': localStorage.getItem('authToken')
    //             }
    //         }).then((response) => {
    //             console.log(response)
    //             if((response.data.status =200) || (response.data.status =201)) {
    //                 this.setState({postedSuccess:true,postedMessage:response.data.message})
    //
    //             }else {
    //                 this.setState({postedUnsuccess:true,postedMessage:response.data.message})
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         });
    // }
    // successAlert(){
    //     this.setState({postedSuccess:false});
    //     document.getElementById("mentor-form").reset();
    // }
    // failureAlert(){
    //     this.setState({postedUnsuccess:false});
    //     document.getElementById("mentor-form").reset();
    // }
    // disabledDate(current) {
    //     // Can not select days after today
    //     return current && current > moment().endOf('day');
    // }
    // renderEmptyDiv() {
    //     return(
    //         <div>
    //         </div>
    //     )
    // }

    // renderEmptyTask() {
    //     return (
    //         <div>
    //             <p className="emptyTask_title">Hello, {this.state.userName}! Welcome to CodeDIY. </p>
    //             <p className="emptyTask_desc">Your profile will be reviewed by our admin and once verified & activated, you’ll start receiving requests from mentees to guide them through their tasks. Please provide more information about you, so we could accelerate the profile activation process. Thank you for enabling us to create an authentic platform bringing together experts and learners. </p>
    //             <form action="javascript:void(0)" onSubmit={this.postForm} id="mentor-form">
    //                 <div className="col-md-12 col-sm-12 col-xs-12 ">
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>First Name</label><br />
    //                         <Input placeholder="" id="firstName" required/>
    //                     </div>
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Last Name</label><br />
    //                         <Input placeholder="" id="lastName"required />
    //                     </div>
    //                 </div>
    //                 <div className="col-md-12 col-sm-12 col-xs-12 ">
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Country</label><br />
    //                         <Input placeholder="" id="country" required/>
    //                     </div>
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>City</label><br />
    //                         <Input placeholder="" id="city" required/>
    //                     </div>
    //                 </div>
    //                 <div className="col-md-12 col-sm-12 col-xs-12 ">
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Zipcode</label><br />
    //                         <Input placeholder="" id="zipcode" required/>
    //                     </div>
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Company</label><br />
    //                         <Input placeholder="" id="company" />
    //                     </div>
    //                 </div>
    //                 <div className="col-md-12 col-sm-12 col-xs-12 ">
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Company Location</label><br />
    //                         <Input placeholder="" id="companyLocation" />
    //                     </div>
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Current field of Study</label><br />
    //                         <Input placeholder="" id="currentFieldOfStudy" />
    //                     </div>
    //                 </div>
    //                 <div className="col-md-12 col-sm-12 col-xs-12 ">
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Current Work title</label><br />
    //                         <Input placeholder="" id="currentWorkTitle" />
    //                     </div>
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Linkedin</label><br />
    //                         <Input placeholder="" id="linkedIn" required/>
    //                     </div>
    //                 </div>
    //                 <div className="col-md-12 col-sm-12 col-xs-12 ">
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Github</label><br />
    //                         <Input placeholder="" id="github" />
    //                     </div>
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Expertise</label><br />
    //                         <Select
    //                             mode="multiple"
    //                             id="expertise"
    //                             style={{ width: '100%' }}
    //                             placeholder="C, Java, Spring"
    //                             onChange={this.handleExpertise}
    //                             required >
    //                             <Option key="C">C</Option>
    //                             <Option key="C++">C++</Option>
    //                             <Option key="Java">Java</Option>
    //                         </Select>
    //                     </div>
    //                 </div>
    //                 <div className="col-md-12 col-sm-12 col-xs-12 ">
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Preferred Languages</label><br />
    //                         <Select
    //                             mode="multiple"
    //                             id="preferredLanguage"
    //                             style={{ width: '100%' }}
    //                             placeholder="English, Hindi, Kannada"
    //                             onChange={this.handlePreferredLanguage}
    //                             required >
    //                             {language && language.map((item, index) =>(
    //                                     <Option key={index} value={item.value}>{item.label}</Option>
    //                             ))}
    //                         </Select>
    //                     </div>
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Gender</label><br />
    //                         <RadioGroup name="radiogroup" id="gender" onChange={this.onChangeRadio}  defaultValue="Male">
    //                             <Radio value="Male" defaultChecked= {true}>Male</Radio>
    //                             <Radio value="Female">Female</Radio>
    //
    //                         </RadioGroup>
    //                     </div>
    //                 </div>
    //
    //                 <div className="col-md-12 col-sm-12 col-xs-12">
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Designation</label><br />
    //                         <Input placeholder="" id="designation" />
    //                     </div>
    //                     <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
    //                         <label>Date of Birth</label><br />
    //                         <DatePicker disabledDate={this.disabledDate} onChange={this.onChange} id="dateOfBirth" required/>
    //                     </div>
    //                 </div>
    //                 <div className="col-md-12 col-sm-12 col-xs-12">
    //                     <div className="col-md-12 col-sm-12 col-xs-12 pb-10">
    //                         <label>About Me</label><br />
    //                         <TextArea rows={4} id="aboutMe" required/>
    //                     </div>
    //                     <div className="col-md-12 col-sm-12 col-xs-12 pb-10">
    //                         <Button className="btn_submit" htmlType='submit'>Submit</Button>
    //                     </div>
    //                 </div>
    //             </form>
    //         </div>
    //     )
    // }
    renderTasks() {
        const { ongoingTask, completedTask } = this.state;
        return (
            <div>

                <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div listing-section" >
                    <div className="col-md-6 col-sm-6 col-xs-12 no-padding-div">
                        <p className="available-tasks">My Tasks({this.state.countOfTask})</p>
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-12 no-right-padding-div float-right text-right sort_field">
                        {/* <div className="drop_list">
                            <Select
                                className="selectpicker"
                                id="sort"
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Sort by: Most Recent"
                                optionFilterProp="children"

                            >
                                <Option value="sortByDate" active>Most Recent</Option>
                                <Option value="sortByPrice">Price</Option>
                            </Select>
                        </div> */}
                    </div>
                    <div className="col-m-12 col-sm-12 col-xs-12 payment-listing-section no-left-padding-div" >
                        <Tabs className="col-md-12 col-sm-6 col-xs-12" defaultActiveKey={1} id="purchase-history-tabs">
                            <Tab eventKey={1} title="Tasks to be Reviewed">
                                {(ongoingTask && ongoingTask.length) > 0 ? this.renderOngoingTask() :<><Spin spinning={this.state.loading} className='loading'/> <p className="myTask-desc">You have not been assigned any task yet. </p></>}
                            </Tab>
                            <Tab eventKey={2} title="Completed Review">
                                {(completedTask && completedTask.length) > 0 ? this.renderCompletedTask() : <p className="myTask-desc">You have not been completed any task yet. </p>}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
                {/* <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                    <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                        <div className="col-md-2 col-sm-3 col-xs-12">
                            <img className="taskIcon" src={MongoDBImage} />
                        </div>
                        <div className="col-md-7 col-sm-6 col-xs-12 no-padding-div">
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <span className="task_name">MongoDB Task</span>
                                <div className="divider"></div>
                                <span className="task_category">Programming</span>
                                <span className="bulletin" >&bull;</span>
                                <span className="task_difficulty">Beginner</span>
                                <span className="bulletin" >&bull;</span>
                                <span className="taskInProgress">In Progress</span>
                            </div>
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <p className="task_desc">Setting up MongoDB 3.6 on your laptop and creating a document.</p>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div firstProgressBar">
                                    <Progress percent={100} showInfo={false} />
                                    <p className='progress-text text-left'>Started</p>
                                </div>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div center-progress-bar secondProgressBar">
                                    <Progress percent={100} showInfo={false} status="active" />
                                    <p className='progress-text text-center'>In Progress</p>
                                </div>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div thirdProgressBar">
                                    <Progress percent={0} showInfo={false} />
                                    <p className='progress-text text-right'>End</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 col-sm-3 col-xs-12 float-right">
                            <p className="task_priceText">Fee Earned</p>
                            <p className="task_rate">₹150</p>
                        </div>
                    </div>
                </div>
                <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                    <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                        <div className="col-md-2 col-sm-3 col-xs-12">
                            <img className="taskIcon" src={JavaImage} />
                        </div>
                        <div className="col-md-7 col-sm-6 col-xs-12 no-padding-div">
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <span className="task_name">Java Task</span>
                                <div className="divider"></div>
                                <span className="task_category">Programming</span>
                                <span className="bulletin" >&bull;</span>
                                <span className="task_difficulty">Beginner</span>
                                <span className="bulletin" >&bull;</span>
                                <span className="taskClosed">Closed</span>
                            </div>
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <p className="task_desc">Implementing a file transfer command line utility in Java</p>
                                <p className="completedTask"><img className="checkedImg" src={CheckedImage} />Completed on 23rd January 2018</p>
                            </div>
                        </div>
                        <div className="col-md-2 col-sm-3 col-xs-12 float-right">
                            <p className="task_priceText">Fee Earned</p>
                            <p className="task_rate">₹400</p>
                        </div>
                    </div>
                </div>
                <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                    <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                        <div className="col-md-2 col-sm-3 col-xs-12">
                            <img className="taskIcon" src={ReactImage} />
                        </div>
                        <div className="col-md-7 col-sm-6 col-xs-12 no-padding-div">
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <span className="task_name">Reactjs Task</span>
                                <div className="divider"></div>
                                <span className="task_category">Programming</span>
                                <span className="bulletin" >&bull;</span>
                                <span className="task_difficulty">Beginner</span>
                                <span className="bulletin" >&bull;</span>
                                <span className="taskInProgress">In Progress</span>
                            </div>
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <p className="task_desc">Setting up MongoDB 3.6 for React Native Application.</p>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                                    <Progress percent={100} showInfo={false} />
                                    <p className='progress-text text-left'>Started</p>
                                </div>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div center-progress-bar">
                                    <Progress percent={100} showInfo={false} status="active" />
                                    <p className='progress-text text-center'>In Progress</p>
                                </div>
                                <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                                    <Progress percent={0} showInfo={false} />
                                    <p className='progress-text text-right'>End</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 col-sm-3 col-xs-12 float-right">
                            <p className="task_priceText">Fee Earned</p>
                            <p className="task_rate">₹350</p>
                        </div>
                    </div>
                </div>
                <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                    <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                        <div className="col-md-2 col-sm-3 col-xs-12">
                            <img className="taskIcon" src={ClojureImage} />
                        </div>
                        <div className="col-md-7 col-sm-6 col-xs-12 no-padding-div">
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <span className="task_name">Clojure Task</span>
                                <div className="divider"></div>
                                <span className="task_category">Programming</span>
                                <span className="bulletin" >&bull;</span>
                                <span className="task_difficulty">Beginner</span>
                                <span className="bulletin" >&bull;</span>
                                <span className="taskClosed">Closed</span>
                            </div>
                            <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                                <p className="task_desc">Setting up MongoDB 3.6 on your laptop and creating a document.</p>
                                <p className="completedTask"><img className="checkedImg" src={CheckedImage} />Completed on 23rd October 2018</p>
                            </div>
                        </div>
                        <div className="col-md-2 col-sm-3 col-xs-12 float-right">
                            <p className="task_priceText">Fee Earned</p>
                            <p className="task_rate">₹300</p>
                        </div>
                    </div>
                </div> */}
            </div >
        )
    }

    render() {
        const flag = this.state.flag;
        return (
            <div>
            <SweetAlert
                show={this.state.postedSuccess}
                title="Successfully Sent"
                type="success"
                text= {this.state.postedMessage}
                onConfirm={()=>this.successAlert()} />
                <SweetAlert
                show={this.state.postedUnSuccess}
                title="Warning!"
                type="warning"
                text= {this.state.postedMessage}
                onConfirm={()=>this.failureAlert()} />

                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                {console.log("this.state.flag: inside rendor",localStorage.getItem('isMentorApproved'), this.state.flag, flag) }
                    {this.renderTasks()}
                </div>
            </div>
        )
    }

}

export default MyTask;
