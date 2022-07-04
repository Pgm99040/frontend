import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Header from './login/header';
import {Modal, Select} from 'antd';
import moment from 'moment';
import pin from "../images/mentee-profile/pin.svg"
import task from "../images/mentee-profile/task.svg"
import user from "../images/mentee-profile/user.svg"
import google from "../images/mentee-profile/google.svg"
import github from "../images/mentee-profile/github.jpg"
import leetCode from "../images/mentee-profile/leetCode.png"
import externalSym from "../images/mentee-profile/external-link-symbol.svg"
import userProfile from "../images/mentee-profile/user-profile.svg"
import edit from "../images/mentee-profile/edit.svg"
import {
  editProfileByMentee,
  findByUserName,
  findUserIdByName,
  getMenteeProfile,
  profilePhotoUpload
} from "./utils/_data";
import axios from 'axios';
import BaseUrl from '../config/properties';
import "../styles/mentee-profile.css"
import Loader from "./common/Loader";
import {getFromStorage, setInToStorage} from "../config/common";
class MenteeProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      github: [],
      leetCode: [],
      competitiveProgramming: [],
      sideProject: [],
      personal: [],
      githubData: {},
      LeetCodeData: {},
      sideProjectsData: {},
      cpmPgmData: {},
      personalInfo: {},
      personalInfoEdu:{},
      collapseID: "",
      tasksEngagement: [],
      languages:[],
      selectedCmpType: "",
      value: new Date(),
      imageLocation: "",
      totaltasks: {
        github: 3,
        CodeTasks: 2,
        LeetCode: 2,
        CpmProgrmaam: 2,
        sideproj: 2
      },
      height:"auto",
      isProfileAvailable:true,
      visiblePersonalDtls: false,
      usernameexists: false,
      isChanged: false,
      isLoading: false
    };
    this.showMoreTasksTaken = this.showMoreTasksTaken.bind(this)
    this.changePersonalInfo = this.changePersonalInfo.bind(this)
  }
  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));
  };
  componentDidMount() {
    const userName = this.props && this.props.match && this.props.match.params && this.props.match.params.username;
    this.getUserProfileDetails(userName);
  }

  getProfileDetails = async (userId) =>{
    this.setState({isLoading: true});
    const response = await getMenteeProfile(userId);
    console.log("xxxxxxxxxxxx---------->", response);
    if (response && response.data && response.data.status_code === 200){
      this.setState({
        github: response.data.profileDetails.github,
        leetCode: response.data.profileDetails.leetcode,
        competitiveProgramming: response.data.profileDetails.competitiveProgramming,
        sideProject: response.data.profileDetails.sideProject,
        tasksEngagement: response.data.profileDetails.taskEngagements,
        personalInfo: response.data.profileDetails,
        personalInfoEdu:response.data.profileDetails.education,
        languages:response.data.profileDetails.preferredLanguages.map((lang)=>{return lang.lang}),
        isProfileAvailable:true,
        isLoading: false
      });
      // setInToStorage({'userData': response && response.data && JSON.stringify(response.data.profileDetails)});
    } else {
      console.log("error------>");
      this.setState({isLoading: false});
    }
  };

  getUserProfileDetails = async (userName) =>{
    const data = {userName};
    const res = await findUserIdByName(data);
    if((res && res.data && res.data.status_code) === 200){
      let data = {
        userId: res.data.userId || ""
      };
      await this.getProfileDetails(data.userId);
    }else {
      this.setState({isProfileAvailable:false});
      console.log("error----->");
    }
  };
  // componentDidMount() {
  //
  //   console.log(this.props.params.username,"USERNAMEEEEEE")
  //   axios({
  //     method: 'post',
  //     url: BaseUrl.base_url + "/api/findUserIdByName" ,
  //     data:{userName:this.props.params.username},
  //     headers: {
  //       'Content-Type': 'application/json',
  //       //'Authorization': localStorage.getItem('authToken')
  //     }
  //   }).then(response => {
  //       if(response.data.status_code==200)
  //       {
  //         console.log(response.data.userId,"USERID")
  //         let data = {
  //           userId: response.data.userId
  //         }
  //         axios({
  //           method: 'get',
  //           url: BaseUrl.base_url + "/api/mentee-profile/" + data.userId,
  //           headers: {
  //             'Content-Type': 'application/json',
  //             //'Authorization': localStorage.getItem('authToken')
  //           }
  //         }).then(response => {
  //           console.log("profileDetails", response.data);
  //           this.setState({
  //             github: response.data.profileDetails.github,
  //             leetCode: response.data.profileDetails.leetcode,
  //             competitiveProgramming: response.data.profileDetails.competitiveProgramming,
  //             sideProject: response.data.profileDetails.sideProject,
  //             tasksEngagement: response.data.profileDetails.taskEngagements,
  //             personalInfo: response.data.profileDetails,
  //             personalInfoEdu:response.data.profileDetails.education,
  //             languages:response.data.profileDetails.preferredLanguages.map((lang)=>{return lang.lang}),
  //             isProfileAvailable:true,
  //             isLoading: false
  //           })
  //         }).catch(error => {
  //             this.setState({isLoading: false});
  //             throw (error);
  //           });
  //       }
  //    else{
  //      this.setState({isProfileAvailable:false})
  //    }
  //   })
  //     .catch(error => {
  //       throw (error);
  //     });
  //
  //
  // }

  changePersonalInfo(field, e) {
    let fields = this.state.personalInfo;
    fields[field] = e.target.value;
    if (field === "userName")
      this.setState({ isChanged: true ,usernameexists:false});
    this.setState({ personalInfo: fields });
  }
  changePersonalInfoEdu(field, e) {
    let fields = this.state.personalInfoEdu;
    fields[field] = e.target.value;

    this.setState({ personalInfoEdu: fields });
  }

  handleLanguageChange=(value)=> {
    this.setState({languages:value})
  };

  renderGithubTasks(n) {
    return (
      this.state.github.map((obj, index) => {
        //   console.log("github-obj",obj)
        if (index < n) {
          return (
            <div className="col-md-4 col-sm-12">
              <div className="githubProjectsDi">
                <h4>{obj.projectTitle}</h4>
                <p className="githubProContent">{obj.description}</p>
                <p className="githubLink"><a href={obj.projectUrl} target="_blank" style={{ color: "#0074ff" }}>View in Github<img src={externalSym} className="githubLink" /></a></p>
              </div>
            </div>
          )
        }
      })
    )
  }

  renderLeetCodeProjects(n) {
    if (this.state.leetCode) {
      return (
        this.state.leetCode.map((obj, index) => {
          if (index < n) {
            return (
              <div className="col-md-6 col-sm-12">
                <div className="leetCodeDiv">
                  {/* <p className="leetScore">Problem Solved <br/> <span>647</span></p>
                             <ul className="leetscorepoints">
                                 <li>
                                     <p className="leetCodeEase1">Easy</p>
                                     <p>212<span>/455</span></p>
                                 </li>
                                 <li>
                                     <p className="leetCodeEase2">Medium</p>
                                     <p>368<span>/896</span></p>
                                 </li>
                                 <li>
                                     <p className="leetCodeEase3">Hard</p>
                                     <p>67<span>/896</span></p>
                                 </li>
                             </ul> */}
                  <img src={obj && obj.screenshot} className="LeetDataImage" />
                  {/* <img src={leetImage} className="LeetDataImage"/> */}
                  <div>
                    <p className="leetCodeContent">{obj && obj.description}</p>
                    <p className="leetMonth">1 month ago</p>
                  </div>
                </div>

              </div>
            )
          }
        })
      )
    }
  }

  renderSideProjects(n) {
    if (this.state.sideProject) {
      return (
        this.state.sideProject.map((obj, index) => {
          if (index < n) {
            return (
              <div className="col-md-6 col-sm-12">
                <div className="sideProjDiv">
                  <h5>{obj.projectTitle}</h5>
                  <img src={obj.screenshot} className="sideProjScreenshot" />
                  <div>
                    <p className="sideProjContent">{obj.description}</p>
                  </div>
                </div>
              </div>
            )
          }
        })
      )
    }
  }
  imageUpload = (e) => {
    const formData = new FormData();
    formData.append('file', this.uploadInput.files[0]);
    formData.append('path', e + "/user-" + this.state.personalInfo._id);

    axios.post(BaseUrl.base_url + "/api/v1/imageUpload", formData, {
      headers: {
        'Authorization': localStorage.getItem('authToken')
      }
    }).then(response => {
      console.log("image response", response);
      this.setState({ imageLocation: response.data.result.Location });
      console.log("imageLocation", this.state.imageLocation)
    })
  };

  //task Listing
  renderTaskList(n) {
      const isLogin = JSON.parse(getFromStorage('isLoggedIn'));
    if (this.state.tasksEngagement) {
      return (
        this.state.tasksEngagement.map((obj, index) => {
          // console.log("tasks",obj)
          if (index < n) {
            return (
              <div className="col-m-12 col-sm-12 col-xs-12 each-task-section" key={obj._id}>
                <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
                  <div className="col-md-2 col-sm-3 col-xs-12">
                    <img src={obj.imageUrl} className="taskImgss" />
                  </div>
                  <div className="col-md-7 col-sm-6 col-xs-12 no-padding-div">
                    <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                      <span className="task_name">{obj.name}</span>
                      <div className="divider" />
                      <span className="task_category">Programming</span>
                      <span className="bulletin" >&bull;</span>
                      <span className="task_category">{obj.difficultyLevel}</span>
                    </div>
                    <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                      <p className="task_desc">{obj.tinyDescription}</p>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-3 col-xs-12 float-right">
                      {isLogin ? <Link to={{ pathname: '/task-details/' + obj._id, search: "menteeprofile" }}><button className="task_button" >View</button></Link>
                          : <Link to="/"><button className="task_button" >View</button></Link> }
                  </div>
                </div>
              </div>
            )
          }

        })
      )
    }

  }

  //Competative Listing
  renderCmpPgmList(n) {
    if (this.state.competitiveProgramming) {
      return (
        this.state.competitiveProgramming.map((obj, index) => {
          // console.log("tasks",obj)
          if (index < n) {
            // return (

            //   <div className="col-md-6 col-sm-12 task-cards-cmp" key={obj._id}>
            //     <div className="col-md-12 col-sm-12 col-xs-12 no-left-padding-div">
            //       <div className="col-md-2 col-sm-3 col-xs-12">
            //         <img src={obj.screenshot} className="taskImgss" />
            //       </div>
            //       <div className="col-md-7 col-sm-6 col-xs-12 no-padding-div">
            //         <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
            //           <span className="task_name">{obj.contestName}</span>
            //           <div className="divider"></div>
            //           <span className="task_category">{obj.type}</span>

            //         </div>
            //         <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
            //           <p className="task_desc">{obj.description}</p>

            //         </div>
            //       </div>

            //     </div>
            //   </div>
            // )


            return (
              <div className="col-md-6 col-sm-12">
                <div className="task-cards-cmp">
                  <h5>{obj.contestName} <span className="task_category">{obj.type}</span></h5>

                  <img src={obj.screenshot} className="sideProjScreenshot" />
                  <div>
                    <p className="task_desc">{obj.description}</p>
                  </div>
                </div>
              </div>
            )}
        })
      )}
  }
  showMoreTasksTaken() {
    { this.renderTaskList("70") }
  }
  selectedCmpType(type) {
    document.getElementById("CodeChef").classList.remove("activeCmpLi");
    document.getElementById("HackerRank").classList.remove("activeCmpLi");
    this.setState({ SelectedCmpType: type });
    document.getElementById(type).classList.add("activeCmpLi")

  }
 
  viewMoreTasks(key, n) {
    let fields = this.state.totaltasks;
    fields[key] = n;
    this.setState({ totaltasks: fields })
    //  document.getElementById("more"+key).style.display="none"
    //  document.getElementById("less"+key).style.display="block"
  }

  profilePicUpload = async (e)=>{
    const userId = localStorage.getItem('id');
    e.preventDefault();
    // this.imageUpload("sideProject")
    const formData = new FormData();
    formData.append('file', this.uploadInput.files[0]);
    formData.append('path', "profileImg/user-" + localStorage.getItem('id'));

    const res = await profilePhotoUpload(formData);
    console.log("profilePhotoUpload--->>", res);
    if (res && res.data && res.data.status_code === 200){
      let data = {
        userId,
        type: "personal",
        personalData: {
          profilePicUrl: res && res.data && res.data.result && res.data.result.Location
        }
      };
      const response = await editProfileByMentee(data);
      if (response && response.data && response.data.status_code === 200){
        this.getProfileDetails(userId);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        console.log("error1--->");
      }
    } else {
      console.log("error--->");
    }
  };

  submitPersonalInfo = async (e) => {
    e.preventDefault();

    let data = {
      userId: localStorage.getItem('id'),
      type: "personal",
      personalData: {
        firstName: this.state.personalInfo["firstName"],
        lastName: this.state.personalInfo["lastName"],
        aboutMe: this.state.personalInfo["aboutMe"],
        education: {
          degree: this.state.personalInfoEdu["degree"],
          college: this.state.personalInfoEdu["college"],
          graduatedYear: this.state.personalInfoEdu["graduatedYear"],
        },
        googleUrl: this.state.personalInfo.googleUrl,
        githubUrl: this.state.personalInfo.githubUrl,
        userName: this.state.personalInfo.userName,
        calendarUrl: this.state.personalInfo.calendarUrl,
        preferredLanguages: this.state.languages.map((lang)=>{return {lang:lang,fluency:"Fluent"}})
      }
    };
    if (this.state.isChanged == true) {
      const userData = { userId: localStorage.getItem('id'), userName: this.state.personalInfo.userName };
      const res = await findByUserName(userData);
      if (res && res.data && res.data.status_code === 200) {
        const response = await editProfileByMentee(data);
        if (response && response.data && response.data.status_code === 200){
          this.setState({
            visiblePersonalDtls: false,
          });
          this.getProfileDetails(userData.userId);
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        } else {
          console.log("error--->");
        }
        this.setState({
          visiblePersonalDtls: false,
          usernameexists:false
        });
      } else if(res && res.data && res.data.status_code === 201) {
        this.setState({usernameexists:true})
      }
    } else {
      const userId = localStorage.getItem('id');
      const response = await editProfileByMentee(data);
      if (response && response.data && response.data.status_code === 200){
        this.setState({
          visiblePersonalDtls: false,
        });
        this.getProfileDetails(userId);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        console.log("error1---->");
      }
      this.setState({
        visiblePersonalDtls: false,
      });
    }
  };

  render() {
    const { isLoading } = this.state;
    const isLogin = getFromStorage("isLoggedIn");
    console.log("this.state.personalInfo", this.state.personalInfo.profilePicUrl);
    return (
      <div>
        {isLoading && (<Loader/>)}
        <div className="main_div">
          <Header />
        </div>
       <div>
          <Modal
              title="Personal Info"
              visible={this.state.visiblePersonalDtls}
              onOk={() => {
                this.setState({visiblePersonalDtls: false})
              }}
              onCancel={() => {
                this.setState({visiblePersonalDtls: false})
              }}
          >
            <div>
              <form>
                <div className="col-sm-12 no-padding-div">
                  <div className="col-sm-6 no-padding-div">
                    <label htmlFor="firstName">First name:</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Enter firstname"
                           value={this.state.personalInfo["firstName"]}
                           onChange={this.changePersonalInfo.bind(this, "firstName")} required/>
                  </div>
                  <div className="col-sm-6 no-padding-div">
                    <label htmlFor="lastName">Last name:</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Enter lastname"
                           value={this.state.personalInfo["lastName"]}
                           onChange={this.changePersonalInfo.bind(this, "lastName")} required/>
                  </div>
                </div>
                <div className="col-sm-12 no-padding-div">
                  <label htmlFor="userName">Public Profile URL:</label>
                  <h5>{this.state.personalInfo.userName ? BaseUrl.website_url + "/user/" + this.state.personalInfo["userName"] : BaseUrl.website_url + "/user/"}<span>
                    <input
                      type="text" id="userName" name="userName" placeholder="Enter username"
                      value={this.state.personalInfo["userName"]}
                      onChange={this.changePersonalInfo.bind(this, "userName")}/></span></h5>
                      {this.state.usernameexists === true ? <p style={{color: "red"}}>This username already exists</p> : ""}
                </div>
                <div className="col-sm-12 no-padding-div">
                  <div className="col-sm-6 no-padding-div">
                    <label htmlFor="college">College:</label>
                    <input type="text" id="college" name="college" placeholder="Enter College"
                           value={this.state.personalInfoEdu.college}
                           onChange={this.changePersonalInfoEdu.bind(this, "college")} required/>
                  </div>
                  <div className="col-sm-6 no-padding-div">
                    <label htmlFor="degree">Degree:</label>
                    <input type="text" id="degree" name="degree" placeholder="Enter Degree"
                           value={this.state.personalInfoEdu.degree}
                           onChange={this.changePersonalInfoEdu.bind(this, "degree")} required/>
                  </div>
                </div>
                <div className="col-sm-4 no-padding-div">
                  <label htmlFor="graduatedYear">Graduated:</label>
                  <input type="text" id="graduatedYear" name="graduated" placeholder="Enter graduated year"
                         value={this.state.personalInfoEdu.graduatedYear}
                         onChange={this.changePersonalInfoEdu.bind(this, "graduatedYear")} required/>
                </div>
                <div className="col-sm-12 no-padding-div mb-2 languages">
                  <label htmlFor="preferredLanguages">Language:</label>
                  <Select
                      mode="multiple"
                      style={{width: '100%'}}
                      placeholder="Please select preferred languages"
                      name="preferredLanguages"
                      value={this.state.languages}
                      onChange={this.handleLanguageChange}
                  >
                    <option key="English">English</option>
                    <option key="Kannada">Kannada</option>
                    <option key="Telugu">Telugu</option>
                    <option key="Tamil">Tamil</option>
                    <option key="Hindi">Hindi</option>
                    <option key="French">French</option>
                  </Select>
                </div>
                <div className="col-sm-12 no-padding-div">
                  <label htmlFor="google">Google Link:</label>
                  <input type="text" id="googleUrl" name="googleUrl" placeholder="Enter Google Url"
                         value={this.state.personalInfo.googleUrl}
                         onChange={this.changePersonalInfo.bind(this, "googleUrl")} required/>
                </div>
                <div className="col-sm-12 no-padding-div">
                  <label htmlFor="github">Github Link:</label>
                  <input type="text" id="githubUrl" name="githubUrl" placeholder="Enter Github Url"
                         value={this.state.personalInfo.githubUrl}
                         onChange={this.changePersonalInfo.bind(this, "githubUrl")} required/>
                </div>
                <div className="col-sm-12 no-padding-div">
                  <label htmlFor="github">My Calendar Link:</label>
                  <input type="text" id="calendarUrl" name="calendarUrl" placeholder="Enter Calendar Url"
                         value={this.state.personalInfo.calendarUrl}
                         onChange={this.changePersonalInfo.bind(this, "calendarUrl")} required/>
                </div>
                <div className="col-sm-12 no-padding-div">
                  <label htmlFor="aboutMe">About</label>
                  <textarea id="aboutMe" name="aboutMe" placeholder="Write about yourself.." style={{height: "100px"}}
                            value={this.state.personalInfo["aboutMe"]}
                            onChange={this.changePersonalInfo.bind(this, "aboutMe")} required />
                </div>
                <div className="col-sm-12 no-padding-div">
                  <input type="submit" value="Save" disabled={this.state.usernameexists === true ? true : false}
                         onClick={this.submitPersonalInfo.bind(this)} />
                </div>
              </form>
            </div>
          </Modal>
        </div>
      {  this.state.isProfileAvailable === true?
        <div className="col-md-12 menteeMainDiv">
          <div className="col-md-3 col-sm-12">
            <div className="menteeProfile">
              <div className="userProfileDetails">
                {isLogin == "true" &&  <a> <img src={edit} className="editProImg" onClick={() => { this.setState({ visiblePersonalDtls: true }) }} /></a>}
                <img src={this.state.personalInfo.profilePicUrl !== "" || this.state.personalInfo.profilePicUrl != null?this.state.personalInfo.profilePicUrl:userProfile} className="userProfile" />

                {isLogin == "true" &&
                    <>
                      <label htmlFor="upload-button2" className="upload-button2">
                        <div className="profile-img-icon"><i className="fa fa-camera fa-2x"></i></div>
                      </label>
                      <input
                          type="file"
                          name="profile_photo"
                          accept="image/*"
                          id="upload-button2"
                          ref={(ref) => {
                            this.uploadInput = ref;
                          }}
                          style={{display: "none"}}
                          onChange={(e) => this.profilePicUpload(e)}
                      />
                    </>
                }
                <h4>{this.state.personalInfo.firstName} {this.state.personalInfo.lastName}</h4>
                <p>{this.state.personalInfo.designation}</p>
              </div>
              <div className="menteedetails">
                <p><img src={pin} className="menteeProfileIcons" />From</p>
                <p>{this.state.personalInfo.country}</p>
              </div>
              <div className="menteedetails">
                <p><img src={user} className="menteeProfileIcons" />Member since</p>
                <p>{moment(this.state.personalInfo.registeredOn).format('MMM YYYY')}</p>
              </div>
              <div className="menteedetails">
                <p><img src={task} className="menteeProfileIcons" />No.of tasks taken</p>
                <p>{this.state.tasksEngagement.length}</p>
              </div>
            </div>
            <div className="AbtDiv">
              <div className="AbtInfo">
                <h2>About {this.state.personalInfo.firstName}</h2>
                <p>{this.state.personalInfo.aboutMe}</p>
              </div>
              <div className="AbtInfo">
                <h2>Languages</h2>
                <p>English - <span>Fluent</span></p>
                <p>French - <span>Fluent</span></p>
              </div>
              <div className="AbtInfo">
                <h2>Linked Accounts</h2>
                <a href={this.state.personalInfo.googleUrl} className="linkedAccount"><p><img src={google} className="menteeProfileIcons" />Google</p> </a>
                <a href={this.state.personalInfo.githubUrl} className="linkedAccount"><p><img src={github} className="menteeProfileIcons" />Github </p></a>
              </div>
              <div className="AbtInfo">
                <h2>Education</h2>
                <p>{this.state.personalInfoEdu.degree}</p>
                <p>{this.state.personalInfoEdu.college}, Graduated {this.state.personalInfoEdu.graduatedYear}</p>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-sm-12">
            {
              this.state.github.length !== 0 ?
                <div className="githubTasksTaken col-md-12 col-sm-12" >
                  <div className="githubTitle">
                    <p><img src={github} className="menteeProfileIcons" />Github</p>
                  </div>
                  <div style={{ overflowY: this.state.totaltasks["github"] <=3? "hidden" : "scroll" }} id="custom-scroll" className="custom-scroll-class-github">
                    {this.renderGithubTasks(this.state.totaltasks["github"])}
                  </div>
                  {
                    this.state.github.length > 3 ?
                      (<div className="col-md-12">
                        {this.state.totaltasks["github"] === 3 ? <p className="viewTasks" id="moregithub" onClick={this.viewMoreTasks.bind(this, "github", this.state.github.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></p> : <p className="viewTasks" id="lessgithub" onClick={this.viewMoreTasks.bind(this, "github", 3)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                      </div>
                      ) : null
                  }

                </div>
                : null
            }

            {
              this.state.leetCode.length !== 0 ?
                <div className="LeetTasksTaken col-md-12 col-sm-12" >
                  <div className="githubTitle">
                    <p><img src={leetCode} className="menteeProfileIcons" />Leet Code</p>
                  </div>
                  <div style={{ overflowY: this.state.totaltasks["LeetCode"]<=2 ? "hidden" : "scroll" }} id="custom-scroll" className="custom-scroll-class-leetcode" >
                    {this.renderLeetCodeProjects(this.state.totaltasks["LeetCode"])}
                  </div>
                  {
                    this.state.leetCode.length > 2 ?
                      (<div className="col-md-12">
                        {this.state.totaltasks["LeetCode"] === 2 ? <p className="viewTasks" id="moreLeetCode" onClick={this.viewMoreTasks.bind(this, "LeetCode", this.state.leetCode.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></p> : <p className="viewTasks" id="lessLeetCode" onClick={this.viewMoreTasks.bind(this, "LeetCode", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                      </div>
                      ) : null
                  }
                </div> : null
            }
            {
              this.state.competitiveProgramming.length != 0 ?
                <div className="cmpPgmMainDiv col-md-12 col-sm-12" >
                  <div className="githubTitle">
                    <h3>Competitive Programming</h3>
                  </div>
                  <div style={{ overflowY: this.state.totaltasks["CpmProgrmaam"] <=2 ? "hidden" : "scroll" }} id="custom-scroll" className="custom-scroll-class-leetcode" >
                     {this.renderCmpPgmList(this.state.totaltasks["CpmProgrmaam"])}
                  </div>
                  {
                    this.state.competitiveProgramming.length > 2 ?
                      (<div className="col-md-12">
                        {this.state.totaltasks["CpmProgrmaam"] == 2 ? <p className="viewTasks" id="moreCpmProgrmaam" onClick={this.viewMoreTasks.bind(this, "CpmProgrmaam", this.state.competitiveProgramming.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span> </p> : <p className="viewTasks" id="lessCpmProgrmaam" onClick={this.viewMoreTasks.bind(this, "CpmProgrmaam", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                      </div>
                      ) : null
                  }
                </div> : null}
            {
              this.state.sideProject.length !== 0 ?
                <div className="sideProjMainDiv  col-md-12 col-sm-12"  >
                  <div>
                    <div className="githubTitle">
                      <h3>Side Projects</h3>
                    </div>
                    <div style={{ overflowY: this.state.totaltasks["sideproj"] <=2? "hidden" : "scroll" }} id="custom-scroll" className="custom-scroll-class">
                      {this.renderSideProjects(this.state.totaltasks["sideproj"])}
                    </div>
                    {
                      this.state.sideProject.length > 2 ?
                        (<div className="col-md-12">
                          {this.state.totaltasks["sideproj"] ===2 ? <p className="viewTasks" id="moreSideProj" onClick={this.viewMoreTasks.bind(this, "sideproj", this.state.sideProject.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></p> : <p className="viewTasks" id="lessSideProj" onClick={this.viewMoreTasks.bind(this, "sideproj", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                        </div>
                        ) : null
                    }
                  </div>
                </div> : null}

            <div className="codeTasksMainDiv col-md-12 col-sm-12" >
              <h3>CodeDIY Tasks Taken ({this.state.tasksEngagement.length})</h3>
              <div style={{ overflowY: this.state.totaltasks["CodeTasks"] <=2? "hidden" : "scroll" }} id="custom-scroll" className="custom-scroll-class-tasks">
                {this.renderTaskList(this.state.totaltasks["CodeTasks"])}
              </div>
              {
                this.state.tasksEngagement.length > 2 ?
                  (<div className="col-md-12">
                    {this.state.totaltasks["CodeTasks"] === 2 ? <p className="viewTasks" id="moreCodeTasks" onClick={this.viewMoreTasks.bind(this, "CodeTasks", this.state.tasksEngagement.length)}>View All Tasks <span><i class="fa fa-angle-down" aria-hidden="true"></i></span> </p> : <p className="viewTasks" id="lessCodeTasks" onClick={this.viewMoreTasks.bind(this, "CodeTasks", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                  </div>
                  ) : null
              }
            </div>
          </div>
        </div>
        :<h3 style={{textAlign:"center",marginTop:"15%"}}>This Profile is not available</h3>}
      </div>
    )
  }
}

export default withRouter(MenteeProfile);