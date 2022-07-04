import React from 'react';
import { Link } from 'react-router-dom';
import Header from './login/header';
import MentorProfileModal from "./MentorProfileModal";
import { Row, Col, Grid } from 'react-bootstrap';
import mentee from '../images/mentee1.jpg'
import taskimage from '../images/java.png'
import profileimg from '../images/mentee-profile.png'
import star from '../images/mainstar.svg'
import diylogo from '../images/diylogo.svg'
import {setInToStorage} from "../config/common";
import Loader from "./common/Loader";
import {getMentorIdByUsername, mentorProfile, profilePhotoUpload, editProfileByMentee} from "./utils/_data";

require('../styles/mentor-profile.css');

class MentorProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            languages: [],
            handleModal: false,
            isLoading: false,
            totaltasks: {
                tasks: 2,
                reviews:3
            }
        };
        this.cancelProfileModal = this.cancelProfileModal.bind(this);
    }

    componentDidMount() {
        let isLoggedIn = localStorage.getItem('isLoggedIn');
        let isMentor = localStorage.getItem('userType');
        let authToken = null;
        let userData = JSON.parse(localStorage.getItem('userData'));
        let mentorID = localStorage.getItem('mentorId');
        const stateDetails = this.props.location.state;
        const mentorName = this.props && this.props.params && this.props.params.mentorName;
        //console.log(mentorID,typeof(mentorID))
        if (isLoggedIn == 'true') {
            authToken = localStorage.getItem('authToken');
            this.setState({
                authToken: authToken,
                userData: userData,
                url: userData.profilePicUrl,
                userName: userData.firstName + " " + userData.lastName

            });
        }
        this.getProfileDetails(stateDetails, mentorName);
    }
    getProfileDetails = async (stateDetails, mentorName) => {
        let isMentor = localStorage.getItem('userType');
        let userData = JSON.parse(localStorage.getItem('userData'));
        this.setState({isLoading: true});
        if(stateDetails === "mentorprofile" || isMentor === "mentor")
        {
            const response = await mentorProfile(userData && userData.mentor);
            // const response = await axios.get(BaseUrl.base_url + "/api/mentor-profile/" + userData.mentor, {'headers': {"Content-Type": "application/json"}});
            if((response && response.data && response.data.status_code ) === 200) {
                setInToStorage({'userData': response && response.data && response.data.profileDetails && JSON.stringify(response.data.profileDetails.user)});
                this.setState({ data: response.data.profileDetails, isLoading: false });
            } else {
                console.log("error1 ----->");
                this.setState({isLoading: false});
            }
        } else{
            const data = {userName:mentorName};
            const res = await getMentorIdByUsername(data);
            console.log("mentorByUserName---->", res);
            // const res = await axios.post(BaseUrl.base_url + "/api/getMentorIdByUsername", {userName:mentorName}, {'headers': {"Content-Type": "application/json"}});
            if(res && res.data && res.data.status_code === 200) {
                const result = await mentorProfile((res && res.data && res.data.mentorId) || "");
                console.log("result------>", result);
                // const url = `${BaseUrl.base_url}/api/mentor-profile/${(res &&  res.data && res.data.mentorId) || ""}`;
                // const result = await axios.get(url,{'headers': {"Content-Type": "application/json"}});
                if (result?.data?.status_code === 200){
                    this.setState({ data: result.data.profileDetails, isLoading: false });
                } else {
                    console.log("error----->");
                    this.setState({isLoading: false});
                }
            } else {
                console.log("error2----->");
                this.setState({isLoading: false});
            }
        }
    };
    viewMoreTasks(key, n) {
        let fields = this.state.totaltasks;
        fields[key] = n;
        this.setState({ totaltasks: fields })
    }

    handleProfileModal(){
        this.setState({handleModal : true});
    };
    cancelProfileModal(){
        this.setState({handleModal : false});
    };

    renderTasks(n) {
        return (
            this.state.data.approvedTasksForMentorship.map((eachtask, index) => {
                //   console.log("github-obj",obj)
                if (index < n) {
                    return (
                        <div className="col-xs-12 each-task-section">
                            <div className="col-md-2">
                                <img src={taskimage} />
                            </div>
                            <div className="col-md-6 task-details-sec">
                                <p className="task-name">{eachtask.name}
                                    <span className="task-name-divider"></span>
                                    <span className="task-category">Programming</span>
                                    <span>&bull;</span>
                                    <span className="task-difficulty-level">{eachtask.difficultyLevel}</span>
                                </p>
                                <p className="task-description">
                                    {eachtask.tinyDescription}
                                </p>
                            </div>
                            <div className="col-md-4">
                                <p className="task-cost">Free
                                   <span><Link to={{pathname: "/task-details/" + eachtask._id, state: {userType: "mentor"}}}><button className="task-explore" >Explore</button></Link></span>
                                </p>
                            </div>
                        </div>
                    )
                }
            })
        )
    }

    renderReviews(n) {
        return (
            this.state.data.taskEngagements.map((rating, index) => {
                //   console.log("github-obj",obj)
                if (index < n) {
                    return (
                        <div className="col-xs-12">

                            <div className="review-profileimg-div">
                                <img src={profileimg} />
                            </div>
                            <div className="review-profileimg-div">
                                <p>
                                    <span className="review-username">{rating.user.firstName} {rating.user.lastName}</span>
                                    <span><img src={star} alt="star"/></span>
                                    <span className="review-rating">{rating.rating.user2mentor}</span>
                                </p>
                                <p className="published-date">Published 1 month ago</p>
                            </div>
                            <p className="review-content">{rating.feedback.userFeedback}</p>
                            <hr className="custom-hr" />
                        </div>
            )}}))
    }

        profilePicUpload = async (e)=>{
        e.preventDefault();
        // this.imageUpload("sideProject")
        const formData = new FormData();
        formData.append('file', this.uploadInput.files[0]);
        formData.append('path', "profileImg/user-" + localStorage.getItem('id'));
        const response = await profilePhotoUpload(formData);
        if (response && response.data && response.data.status_code === 200){
            let data = {
                userId: localStorage.getItem('id'),
                type: "personal",
                personalData: {
                    profilePicUrl:response.data.result.Location
                }
            };
            const res = await editProfileByMentee(data);
            console.log("res111", res);
            if (res && res.data && res.data.status_code === 200){
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }else {
                console.log("error---->");
            }
        }else {
            console.log("error1---->");
        }

        // axios.post(BaseUrl.base_url + "/api/v1/imageUpload", formData, {
        //     headers: {
        //         'Authorization': localStorage.getItem('authToken')
        //     }
        // }).then(response => {
        //     let data = {
        //         userId: localStorage.getItem('id'),
        //         type: "personal",
        //         personalData: {
        //             profilePicUrl:response.data.result.Location
        //         }
        //     };
        //     axios({
        //         method: 'post',
        //         url: BaseUrl.base_url + "/api/v1/editProfile",
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': localStorage.getItem('authToken')
        //         },
        //         data: data
        //     }).then(response => {
        //         console.log("new------>", response);
        //         // setInToStorage()
        //         setTimeout(() => {
        //
        //             window.location.reload();
        //         }, 4000);
        //     })
        //         .catch(error => {
        //             throw (error);
        //         });
        // })
    };

    render() {
        let details = this.state.data;
        const { handleModal, isLoading } = this.state;
        // let active
        // if(details!="")
        // {
        //     console.log(moment(details.user.lastLoggedIn).format('HH.mm'),"TIMEEEEE")
        //     active = moment(details.user.lastLoggedIn, 'YYYY-MM-DD').fromNow();
        // }
        // if (isLoading) return <Loader/>;
        return (
            <div>
                <div className="main_div">
                    <Header />
                </div>
                { details != "" ?
                    <div>
                        {isLoading && <Loader/>}
                        <Grid>
                            <Row className="show-grid">

                                <Col xs={12} md={3}>
                                    <div className="img-container">
                                        <img src={details.user.profilePicUrl !== "" || details.user.profilePicUrl!=null?details.user.profilePicUrl:mentee} className="mentor-profile-image" />
                                    </div>
                                    <label htmlFor="upload-button2" className="camera-icon">
                                        <div className="profile-img-icon"><i className="fa fa-camera fa-2x" /></div>
                                    </label>
                                    <input
                                        type="file"
                                        name="profile_photo"
                                        accept="image/*"
                                        id="upload-button2"
                                        ref={(ref) => {this.uploadInput = ref;}}
                                        style={{display: "none"}}
                                        onChange={(e) => this.profilePicUpload(e)}
                                    />
                                </Col>
                                <Col xs={12} md={9} className="first-container">

                                    <Col xs={12} sm={6} md={7}>
                                        <p className="mentee-name-section">{details.user.firstName} {details.user.lastName} <span><img src={diylogo}/></span></p>
                                        <p className="mentee-designation">{details.user.designation} At {details.user.company}, {details.user.companyLocation}</p>
                                        <p className="mentee-location">{details.user.city}, {details.user.country}-{details.user.zipCode}</p>
                                    </Col>
                                    <Col xs={12} sm={2} md={2}>
                                        <p className="mentee-name-section">{details.taskEngagements.length}</p>
                                        <p className="reviewed-online">tasks reviewed</p>
                                    </Col>
                                    <Col xs={12} sm={2} md={2}>
                                        <p className="mentee-name-section">5 <span style={{ "fontSize": "14px" }}>hrs ago</span></p>
                                        <p className="reviewed-online">Last Online</p>
                                    </Col>
                                    <Col xs={12} sm={2} md={1}>
                                        <button className="btn btn-primary btn-sm" onClick={() =>this.handleProfileModal()}>Update Profile</button>
                                    </Col>
                                </Col>
                            </Row>
                           {handleModal && <MentorProfileModal data={details || {}}
                                               {...this.props}
                                               isProfileModal={this.handleProfileModal}
                                               cancelProfileModal={this.cancelProfileModal}
                                               getProfileDetails={this.getProfileDetails}
                                               handleProfileModal={handleModal}
                           />}
                        </Grid>
                        <div className="second-container">
                            <Grid>
                                <Row >

                                    <Col xs={12} md={3}>
                                        <div className="col-xs-12 mentor-personal-details">
                                            <p className="personal-details-heading">Skills</p>
                                            <div class="skills-row">
                                                {details.user.expertise.map(skill => (
                                                        <div class="skills-column">
                                                            <p>{skill}</p>
                                                        </div>
                                                ))}
                                            </div>
                                            <hr className="personal-details-divider" />
                                            <p className="personal-details-heading">Languages</p>
                                            {details && details.user &&  details.user.preferredLanguages.map(language => (
                                                <p className="personal-details-maincontent">{language.lang && language.lang.charAt(0).toUpperCase() + language.lang.slice(1)} - <span className="personal-details-subcontent">{language.fluency}</span></p>
                                            ))}
                                            <hr className="personal-details-divider" />
                                            <p className="personal-details-heading">Linked Accounts</p>
                                            <p className="personal-details-maincontent"><a href={details.user.githubUrl} target="_blank">{details.user.githubUrl}</a></p>
                                            <p className="personal-details-maincontent"><a href={details.user.linkedInUrl} target="_blank">{details.user.linkedInUrl}</a></p>
                                            <hr className="personal-details-divider" />
                                            <p className="personal-details-heading">Education</p>
                                            <p className="personal-details-maincontent eduaction-clg">{details.user.education.degree}</p>
                                            <p className="personal-details-subcontent">{details.user.education.college}, Graduated {details.user.education.graduatedYear}</p>
                                            <hr className="personal-details-divider"/>
                                            <p className="personal-details-heading">Email</p>
                                            <p className="personal-details-maincontent eduaction-clg">{details.user.email || "-"}</p>
                                            <hr className="personal-details-divider"/>
                                            <p className="personal-details-heading">Current Field Of Study</p>
                                            <p className="personal-details-maincontent eduaction-clg">{details.user.currentFieldOfStudy || "-"}</p>
                                            <hr className="personal-details-divider"/>
                                            <p className="personal-details-heading">Current Work Title</p>
                                            <p className="personal-details-maincontent eduaction-clg">{details.user.currentWorkTitle || "-"}</p>
                                            <hr className="personal-details-divider"/>
                                            <p className="personal-details-heading">Gender</p>
                                            <p className="personal-details-maincontent eduaction-clg">{details.user.gender || "-"}</p>
                                            <hr className="personal-details-divider"/>
                                            <p className="personal-details-heading">Date Of Birth</p>
                                            <p className="personal-details-maincontent eduaction-clg">{details.user.dateOfBirth || "-"}</p>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={9}>
                                        <div className="col-xs-12 mentor-right-col-section">
                                            <p className="mentor-right-col-heading">About {details.user.firstName} {details.user.lastName}</p>
                                            <p className="mentor-about-content">{details.user.aboutMe}</p>
                                        </div>
                                        <div className="col-xs-12 mentor-right-col-section" style={{marginBottom:"20px"}}>
                                            <p className="mentor-right-col-heading  tasks-heading">CodeDIY Tasks ({details.approvedTasksForMentorship.length})</p>
                                            <div style={{ overflowY: this.state.totaltasks["tasks"] <= 2 ? "hidden" : "scroll",height: this.state.totaltasks["tasks"] <= 2 ?"auto":"500px"}} id="custom-scroll-mentor" className="custom-scroll-tasks">
                                                {this.renderTasks(this.state.totaltasks["tasks"])}
                                            </div>
                                            {/* {details.approvedTasksForMentorship.map((eachtask,index) => {
                                                console.log(this.state.totaltasks.tasks,"taskssss")
                                                if(index<this.state.totaltasks["tasks"])
                                                (
                                                <div className="col-xs-12 each-task-section" style={{ overflowY: this.state.totaltasks["tasks"] <=2? "hidden" : "scroll" }} id="custom-scroll-mentor" className="custom-scroll-tasks">
                                                    <div className="col-md-2">
                                                        <img src={taskimage} />
                                                    </div>
                                                    <div className="col-md-6 task-details-sec">
                                                        <p className="task-name">{eachtask.name}
                                                            <span className="task-name-divider"></span>
                                                            <span className="task-category">Programming</span>
                                                            <span>&bull;</span>
                                                            <span className="task-difficulty-level">{eachtask.difficultyLevel}</span>
                                                        </p>
                                                        <p className="task-description">
                                                            {eachtask.tinyDescription}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p className="task-cost">Free
                                                        <span><a href={"/task-details/"+eachtask._id}><button className="task-explore" >Explore</button></a></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            )})} */}
                                            {details.approvedTasksForMentorship.length > 2 ?
                                                (<div className="col-md-12">
                                                    {this.state.totaltasks["tasks"] === 2 ? <p className="viewTasks" onClick={this.viewMoreTasks.bind(this, "tasks", details.approvedTasksForMentorship.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></p> : <p className="viewTasks" id="lessgithub" onClick={this.viewMoreTasks.bind(this, "tasks", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true" /></span></p>}
                                                </div>
                                                ) : null
                                            }
                                        </div>
                                        <div className="col-xs-12 mentor-right-col-section">
                                            <p className="mentor-right-col-heading">Reviews
                                      <span className="rating-star"><img src={star}/></span>
                                                <span className="average-rating">{details.averageRating.toFixed(1)}</span>
                                                <span className="total-reviews">({details.taskEngagements.length})</span>
                                            </p>
                                            <hr className="custom-hr" />
                                            <div style={{ overflowY: this.state.totaltasks["reviews"] <= 3 ? "hidden" : "scroll",height: this.state.totaltasks["reviews"] <= 3 ?"auto":"500px"}} id="custom-scroll-mentor" className="custom-scroll-reviews">
                                                {this.renderReviews(this.state.totaltasks["reviews"])}
                                            </div>
                                            {/* {details.taskEngagements.map(rating => (
                                                <div className="col-xs-12">

                                                    <div className="review-profileimg-div">
                                                        <img src={profileimg} />
                                                    </div>
                                                    <div className="review-profileimg-div">
                                                        <p>
                                                            <span className="review-username">{rating.user.firstName} {rating.user.lastName}</span>
                                                            <span>*</span>
                                                            <span className="review-rating">{rating.rating.user2mentor}</span>

                                                        </p>
                                                        <p className="published-date">Published 1 month ago</p>
                                                    </div>
                                                    <p className="review-content">{rating.feedback.userFeedback}</p>
                                                    <hr className="custom-hr" />
                                                </div>
                                            ))} */}

                                            {details.taskEngagements.length > 3 ?
                                                    (<div className="col-md-12">
                                                        {this.state.totaltasks["reviews"] == 3 ? <p className="viewTasks" onClick={this.viewMoreTasks.bind(this, "reviews", details.taskEngagements.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></p> : <p className="viewTasks" id="lessgithub" onClick={this.viewMoreTasks.bind(this, "reviews", 3)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                                                    </div>
                                                    ) : null
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    </div>
                    : ""}
            </div>
        );
    }
}
export default MentorProfile;