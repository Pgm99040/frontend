import React from 'react';
import { Link } from 'react-router-dom';
import Header from './login/header';
import { Modal,DatePicker } from 'antd';
// import DatePicker from 'react-date-picker';
import moment from 'moment';
import pin from "../images/mentee-profile/pin.svg"
import task from "../images/mentee-profile/task.svg"
import user from "../images/mentee-profile/user.svg"
import google from "../images/mentee-profile/google.svg"
import github from "../images/mentee-profile/github.jpg"
import compPgms from "../images/mentee-profile/compPgms.png"
import leetCode from "../images/mentee-profile/leetCode.png"
import sideprojects from "../images/mentee-profile/sideprojects.svg"
import add from "../images/mentee-profile/add.svg"
import externalSym from "../images/mentee-profile/external-link-symbol.svg"
import upload from "../images/mentee-profile/upload.svg"
import userProfile from "../images/mentee-profile/user-profile.svg"
import edit from "../images/mentee-profile/edit.svg"
import BaseUrl from '../config/properties';
import { Select } from 'antd';
import Loader from "./common/Loader";
import {setInToStorage} from "../config/common";
import {editProfileByMentee, findByUserName, getMenteeProfile, profilePhotoUpload} from "./utils/_data";
import "../styles/mentee-profile.css"

const Option = Select.Option;
class MenteeProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibleLeet: false,
      visibleSideProject: false,
      visibleCompPgm: false,
      visiblePersonalDtls: false,
      github: [],
      leetCode: [],
      competitiveProgramming: [],
      sideProject: [],
      personal: [],
      languages:[],
      githubData: {},
      LeetCodeData: {},
      sideProjectsData: {},
      cpmPgmData: {},
      personalInfo: {
        calendarUrl: "",
      },
      personalInfoEdu: {},
      collapseID: "",
      tasksEngagement: [],
      selectedCmpType: "HackerRank",
      value: new Date(),
      imageLocation: "",
      totaltasks: {
        github: 3,
        CodeTasks: 2,
        LeetCode: 2,
        CpmProgrmaam: 2,
        sideproj: 2
      },
      height: "auto",
      usernameexists: false,
      isChanged: false,
      isLoading: false
    };
    this.showMoreTasksTaken = this.showMoreTasksTaken.bind(this)
  }

  componentDidMount() {
    this.getProfileDetails();
  }

  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));
  };
  showModal = () => {
    this.setState({
      visible: true,

    });
  };
  showLeetModal = () => {
    this.setState({
      visibleLeet: true,

    });
  };
  showCmpPgmModal = () => {
    this.setState({
      visibleCompPgm: true,

    });
  };
  showVisibleSideProject = () => {
    this.setState({
      visibleSideProject: true,

    });
  };

  handleOk = (e) => {
    console.log(e);
    e.preventDefault();
    this.setState({
      visible: false,
    });
  };
  changeGithubData(field, e) {
    let fields = this.state.githubData;
    fields[field] = e.target.value;
    this.setState({ githubData: fields });
    // console.log(this.state.githubData)
  }
  changeLeetCodeData(field, e) {
    let fields = this.state.LeetCodeData;
    fields[field] = e.target.value;
    this.setState({ LeetCodeData: fields });
  }
  changeSideProjectsData(field, e) {
    let fields = this.state.sideProjectsData;
    fields[field] = e.target.value;
    this.setState({ sideProjectsData: fields });
    console.log("sideProjectsData", this.state.sideProjectsData)
  }
  changeCmpPgmData(field, e) {
    let fields = this.state.cpmPgmData;
    fields[field] = e.target.value;
    this.setState({ cpmPgmData: fields });
  }

  changePersonalInfo(field, e) {
    let fields = this.state.personalInfo;
    fields[field] = e.target.value;
    if (field == "userName")
      this.setState({ isChanged: true ,usernameexists:false});
    this.setState({ personalInfo: fields });
  }
  changePersonalInfoEdu(field, e) {
    let fields = this.state.personalInfoEdu;
    fields[field] = e.target.value;
    this.setState({ personalInfoEdu: fields });
  }

  SubmitCmpPgmData = async (e) => {
    e.preventDefault();
    // this.imageUpload("competitiveProgramming")
    // console.log(this.uploadInput.files[0].name,"IMAGE UPLOAD")
    const formData = new FormData();
    formData.append('file', this.uploadInput.files[0] || "");
    formData.append('path', "competitiveProgramming/user-" +localStorage.getItem('id') );

    this.setState({isLoading: true});
    const response = await profilePhotoUpload(formData);
    if ((response && response.data && response.data.status_code) === 200){
      this.setState({ imageLocation: response.data.result.Location });
      console.log("imageLocation", this.state.imageLocation);
      let data = {
        userId: localStorage.getItem('id'),
        type: "competitiveProgramming",
        operation: "add",
        competitiveProgramming: {
          type: this.state.SelectedCmpType,
          contestName: this.state.cpmPgmData["contestName"],
          contestDate: this.state.value.toISOString().substring(0, 10),
          description: this.state.cpmPgmData["description"],
          screenshot: response.data.result.Location
        }
      };
      const res = await editProfileByMentee(data);
      if (res && res.data && res.data.status_code === 200){
        this.setState({
          visibleCompPgm: false,
          isLoading: false
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.log("error------>");
        this.setState({
          visibleCompPgm: false,
          isLoading: false
        });
      }
    } else {
      console.log("error1------>");
    }

    // axios.post(BaseUrl.base_url + "/api/v1/imageUpload", formData, {
    //   headers: {
    //     'Authorization': localStorage.getItem('authToken')
    //   }
    // }).then(response => {
    //   console.log("image response", response)
    //   this.setState({ imageLocation: response.data.result.Location })
    //   console.log("imageLocation", this.state.imageLocation)
    //   let data = {
    //     userId: localStorage.getItem('id'),
    //     type: "competitiveProgramming",
    //     operation: "add",
    //     competitiveProgramming: {
    //       type: this.state.SelectedCmpType,
    //       contestName: this.state.cpmPgmData["contestName"],
    //       contestDate: this.state.value.toISOString().substring(0, 10),
    //       description: this.state.cpmPgmData["description"],
    //       screenshot: response.data.result.Location
    //     }
    //   }
    //   console.log("data", data)
    //   axios({
    //     method: 'post',
    //     url: BaseUrl.base_url + "/api/v1/editProfile",
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': localStorage.getItem('authToken')
    //     },
    //     data: data
    //   }).then(response => {
    //
    //     this.setState({
    //       visibleCompPgm: false,
    //       isLoading: false
    //     });
    //     setTimeout(() => {
    //
    //       window.location.reload();
    //     }, 500);
    //   })
    //     .catch(error => {
    //       throw (error);
    //       this.setState({
    //         visibleCompPgm: false,
    //         isLoading: false
    //       });
    //     });
    // })
  };
  SubmiteGithubProjects = (e) => {
    e.preventDefault();
    let data = {
      userId: localStorage.getItem('id'),
      type: "github",
      operation: "add",
      github: {
        projectTitle: this.state.githubData["title"],
        projectUrl: this.state.githubData["url"],
        description: this.state.githubData["description"]
      }
    };
    this.setState(prevState => ({
      visible: false
    }),async () => {
      const response = await editProfileByMentee(data);
      if (response && response.data && response.data.status_code === 200){
        window.location.reload();
      }else {
        console.log(response.data);
      }

      // axios({
      //   method: 'post',
      //   url: BaseUrl.base_url + "/api/v1/editProfile",
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': localStorage.getItem('authToken')
      //   },
      //   data: data
      // }).then(response => {
      //   if((response && response.data && response.data.status) == "success") {
      //     window.location.reload();
      //   } else {
      //     console.log(response.data);
      //   }
      // }).catch(error => {
      //   console.log(error);
      // });
    });
  };
  submitLeetcode = async (e) => {
    e.preventDefault();
    //  this.imageUpload("leetcode");
    const formData = new FormData();
    formData.append('file', this.uploadInput.files[0] || "");
    formData.append('path', "leetcode/user-" + localStorage.getItem('id'));
    this.setState({isLoading: true});

    const response = await profilePhotoUpload(formData);
    if (response?.data?.status_code === 200){
      this.setState({ imageLocation: response.data.result.Location });
      console.log("imageLocation", this.state.imageLocation);
      let data = {
        userId: localStorage.getItem('id'),
        type: "leetcode",
        operation: "add",
        leetcode: {
          publicProfileLink: this.state.LeetCodeData["profileLink"],
          description: this.state.LeetCodeData["description"],
          screenshot: response.data.result.Location
        }
      };
      const res = await editProfileByMentee(data);
      if (res && res.data && res.data.status_code === 200){
        this.setState({
          visibleLeet: false,
          isLoading: false
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }else {
        this.setState({
          visibleLeet: false,
          isLoading: false
        });
      }
    }else {
      console.log("error1----->");
    }

    // axios.post(BaseUrl.base_url + "/api/v1/imageUpload", formData, {
    //   headers: {
    //     'Authorization': localStorage.getItem('authToken')
    //   }
    // }).then(response => {
    //   console.log("image response", response)
    //   this.setState({ imageLocation: response.data.result.Location })
    //   console.log("imageLocation", this.state.imageLocation)
    //   let data = {
    //     userId: localStorage.getItem('id'),
    //     type: "leetcode",
    //     operation: "add",
    //     leetcode: {
    //       publicProfileLink: this.state.LeetCodeData["profileLink"],
    //       description: this.state.LeetCodeData["description"],
    //       screenshot: response.data.result.Location
    //     }
    //   }
    //   axios({
    //     method: 'post',
    //     url: BaseUrl.base_url + "/api/v1/editProfile",
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': localStorage.getItem('authToken')
    //     },
    //     data: data
    //   }).then(response => {
    //     this.setState({
    //       visibleLeet: false,
    //       isLoading: false
    //     });
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 500);
    //   })
    //     .catch(error => {
    //       throw (error);
    //       this.setState({
    //         visibleLeet: false,
    //         isLoading: false
    //       });
    //     });
    // })

  };

  profilePicUpload = async (e)=>{
    this.setState({isLoading: true});
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
        await this.getProfileDetails(userId);
        this.setState({isLoading: false});
        // setTimeout(() => {
          window.location.reload();
        // }, 4000);
      } else {
        this.setState({isLoading: false});
        console.log("error1--->");
      }
    } else {
      this.setState({isLoading: false});
      console.log("error--->");
    }
  };

  SubmiteSideProjects = async (e) => {
    e.preventDefault();
    // this.imageUpload("sideProject")
    const formData = new FormData();
    formData.append('file', this.uploadInput.files[0] || "");
    formData.append('path', "sideProject/user-" + localStorage.getItem('id'));
    this.setState({isLoading: true});
    const response = await profilePhotoUpload(formData);
    if (response && response.data && response.data.status_code === 200){
      this.setState({ imageLocation: response.data.result.Location });
      console.log("imageLocation", this.state.imageLocation);
      let data = {
        userId: localStorage.getItem('id'),
        type: "sideProject",
        operation: "add",
        sideProject: {
          projectTitle: this.state.sideProjectsData["projectTitle"],
          projectLink: this.state.sideProjectsData["projectUrl"],
          screenshot: response.data.result.Location,
          description: this.state.sideProjectsData["description"]
        }
      };
      const res = await editProfileByMentee(data);
      if (res && res.data && res.data.status_code === 200){
        this.setState({
          visibleSideProject: false,
          isLoading: false
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }else {
        this.setState({
          visibleSideProject: false,
          isLoading: false
        });
      }
    }else {
      console.log("error------->");
    }

    // axios.post(BaseUrl.base_url + "/api/v1/imageUpload", formData, {
    //   headers: {
    //     'Authorization': localStorage.getItem('authToken')
    //   }
    // }).then(response => {
    //   console.log("image response", response)
    //   this.setState({ imageLocation: response.data.result.Location })
    //   console.log("imageLocation", this.state.imageLocation)
    //   let data = {
    //     userId: localStorage.getItem('id'),
    //     type: "sideProject",
    //     operation: "add",
    //     sideProject: {
    //       projectTitle: this.state.sideProjectsData["projectTitle"],
    //       projectLink: this.state.sideProjectsData["projectUrl"],
    //       screenshot: response.data.result.Location,
    //       description: this.state.sideProjectsData["description"]
    //     }
    //   }
    //   console.log("data", data)
    //   axios({
    //     method: 'post',
    //     url: BaseUrl.base_url + "/api/v1/editProfile",
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': localStorage.getItem('authToken')
    //     },
    //     data: data
    //   }).then(response => {
    //     console.log("sideprojects-response", response)
    //     this.setState({
    //       visibleSideProject: false,
    //       isLoading: false
    //     });
    //     setTimeout(() => {
    //
    //       window.location.reload();
    //     }, 500);
    //   })
    //     .catch(error => {
    //       throw (error);
    //       this.setState({
    //         visibleSideProject: false,
    //         isLoading: false
    //       });
    //     });
    // })

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
        linkedInUrl:this.state.personalInfo.linkedInUrl,
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
          this.getProfileDetails();
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
      const response = await editProfileByMentee(data);
      if (response && response.data && response.data.status_code === 200){
        this.setState({
          visiblePersonalDtls: false,
        });
        this.getProfileDetails();
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

  handleCancelGithub = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleCancelLeet = (e) => {
    this.setState({
      visibleLeet: false,
    });
  };
  handleCancelSideProjects = (e) => {
    this.setState({
      visibleSideProject: false,
    });
  };
  handleCancelCompPgms = (e) => {
    this.setState({
      visibleCompPgm: false,
    });
  };

  getProfileDetails = async () =>{
    let data = {
      userId: localStorage.getItem('id')
    };
    this.setState({isLoading: true});
    const response = await getMenteeProfile(data.userId);
    if (response && response.data && response.data.status_code === 200) {
      this.setState({
        github: response.data.profileDetails.github,
        leetCode: response.data.profileDetails.leetcode,
        competitiveProgramming: response.data.profileDetails.competitiveProgramming,
        sideProject: response.data.profileDetails.sideProject,
        tasksEngagement: response.data.profileDetails.taskEngagements,
        personalInfo: response.data.profileDetails,
        personalInfoEdu: response.data.profileDetails.education,
        languages:response.data.profileDetails?.preferredLanguages?.map((lang)=>{return lang.lang}),
        isLoading: false
      });
      setInToStorage({'userData': response && response.data && JSON.stringify(response.data.profileDetails)});
    } else {
      this.setState({isLoading: false});
      console.log("something went wrong");
    }
  };

  renderGithubTasks(n) {
    return (
      this.state?.github?.map((obj, index) => {
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
                  <img src={obj.screenshot} className="LeetDataImage" />
                  {/* <img src={leetImage} className="LeetDataImage"/> */}
                  <div>
                    <p className="leetCodeContent">{obj.description}</p>
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
                  <img src={obj.screenshot} className="sideProjScreenshot" alt=""/>
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
  imageUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', this.uploadInput.files[0]);
    formData.append('path', e + "/user-" + this.state.personalInfo._id);

    const response = await profilePhotoUpload(formData);
    if (response?.data?.status_code === 200){
      this.setState({ imageLocation: response.data.result.Location });
    }else {
      console.log("error------->");
    }

    // axios.post(BaseUrl.base_url + "/api/v1/imageUpload", formData, {
    //   headers: {
    //     'Authorization': localStorage.getItem('authToken')
    //   }
    // }).then(response => {
    //   console.log("image response", response)
    //   this.setState({ imageLocation: response.data.result.Location })
    //   console.log("imageLocation", this.state.imageLocation)
    // })
  };

  //task Listing
  renderTaskList(n) {
    if (this.state.tasksEngagement) {
      return (
        this.state.tasksEngagement.map((obj, index) => {
          const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
          const links = obj && obj.task && obj.task.tinyDescription && obj.task.tinyDescription.match(urlRegex, function(url) {
            return url;
          });
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
                      <div className="divider"></div>
                      <span className="task_category">Programming</span>
                      <span className="bulletin" >&bull;</span>
                      <span className="task_category">{obj.difficultyLevel}</span>
                    </div>
                    <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                      <p className="task_desc" dangerouslySetInnerHTML={{__html: obj.tinyDescription}} />
                      {links && <img src={links} alt="" width={100} height={100}/>}
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-3 col-xs-12 float-right">
                    <Link onlyActiveOnIndex to={{ pathname: '/task-details/' + obj._id, search: "menteeprofile" }}><button className="task_button" >View</button></Link>
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
            )
          }
        })
      )
    }
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
  onChangeDate = value => this.setState({ value });

  viewMoreTasks(key, n) {
    let fields = this.state.totaltasks;
    fields[key] = n;
    this.setState({ totaltasks: fields })
    //  document.getElementById("more"+key).style.display="none"
    //  document.getElementById("less"+key).style.display="block"
  }

   handleLanguageChange=(value)=> {
      this.setState({languages:value})
  };


  render() {
    const {isLoading, personalInfo} = this.state;
    return (
      <div>
        {isLoading && (<Loader/>)}
        <div className="main_div">
          <Header />
        </div>
        <div className="col-md-12 menteeMainDiv">
          <div className="col-md-3 col-sm-12">
            <div className="menteeProfile">
              <div className="userProfileDetails">
                <a> <img src={edit} className="editProImg" onClick={() => { this.setState({ visiblePersonalDtls: true }) }} /></a>
                <div>
                <img src={this.state.personalInfo.profilePicUrl!="" || this.state.personalInfo?.profilePicUrl!=null?this.state.personalInfo?.profilePicUrl:userProfile} className="userProfile" />
                <label htmlFor="upload-button2" className="upload-button2">
                    <div className="profile-img-icon"><i className="fa fa-camera fa-2x"></i></div>
                </label>
                  {/* <img src={userProfile} className="userProfile" />  */}
                </div>
               <input
                  type="file"
                  name="profile_photo"
                  accept="image/*"
                  id="upload-button2"
                  ref={(ref) => { this.uploadInput = ref; }}
                  style={{ display: "none" }}
                  onChange={(e) =>this.profilePicUpload(e)}
                />
                <h4>{this.state.personalInfo?.firstName} {this.state.personalInfo?.lastName}</h4>
                <p>{this.state.personalInfo?.designation}</p>
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
                <p>{this.state.tasksEngagement?.length}</p>
              </div>
            </div>
            <div className="AbtDiv">
              <div className="AbtInfo">
                <h2>Public Profile URL</h2>
                <p style={{lineBreak: "anywhere"}}>{this.state.personalInfo?.userName ?  BaseUrl.website_url + "/user/" + this.state.personalInfo?.userName : BaseUrl.website_url + "/user/"}</p>
              </div>
              <div className="AbtInfo">
                <h2>LinkedIn Profile URL</h2>
                <p style={{lineBreak: "anywhere"}}>{this.state.personalInfo?.linkedInUrl || "-"}</p>
              </div>
              <div className="AbtInfo">
                <h2>Email</h2>
                <p style={{lineBreak: "anywhere"}}>{this.state.personalInfo?.email || "-"}</p>
              </div>
              <div className="AbtInfo">
                <h2>About {this.state?.personalInfo?.firstName}</h2>
                <p>{this.state?.personalInfo?.aboutMe}</p>
              </div>
              <div className="AbtInfo">
                <h2>Languages</h2>
                {this.state?.languages?.map((lang)=>(
                  <p>{lang} - <span>Fluent</span></p>
                ))}
              </div>
              <div className="AbtInfo">
                <h2>Linked Accounts</h2>
                <a href={this.state?.personalInfo?.googleUrl} className="linkedAccount"><p><img src={google} className="menteeProfileIcons" />Google</p> </a>
                <a href={this.state?.personalInfo?.githubUrl} className="linkedAccount"><p><img src={github} className="menteeProfileIcons" />Github</p></a>
              </div>
              <div className="AbtInfo">
                <h2>Education</h2>
                <p>{this.state?.personalInfoEdu?.degree}</p>
                <p>{this.state?.personalInfoEdu?.college}, Graduated {this.state?.personalInfoEdu?.graduatedYear}</p>
              </div>
              <div className="AbtInfo">
                <h2>Calendar Url</h2>
                <a href={this.state?.personalInfo?.calendarUrl}>{this.state?.personalInfo?.calendarUrl || "----"}</a>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-sm-12">
            <div className="d-flex" style={{justifyContent: "center"}}>
              <h2>My Profile</h2>
            </div>
            {this.state.github.length === 0 ?
              <div className="col-md-6 col-m-12 projectMainDiv">
                <div className="ProjectsInfo">
                  <div>
                    <h2><img src={github} className="menteeProfileIcons" />GitHub</h2>
                    <p>Add your GitHub projects link</p>
                  </div>
                  <div>
                    <button className="addbtn" onClick={this.showModal}><img src={add} className="menteeProfileIcons" />Add</button>
                  </div>
                </div>
              </div> : null}
            {
              this.state.leetCode.length === 0 ?
                <div className="col-md-6 col-m-12 projectMainDiv">
                  <div className="ProjectsInfo">
                    <div>
                      <h2><img src={leetCode} className="menteeProfileIcons" />Leet Code</h2>
                      <p>Add your LeetCode accomplishments</p>
                    </div>
                    <div>
                      <button className="addbtn" onClick={this.showLeetModal}><img src={add} className="menteeProfileIcons" />Add</button>
                    </div>
                  </div>
                </div> : null
            }
            {
              this.state.competitiveProgramming.length === 0 ?
                <div className="col-md-6 col-m-12 projectMainDiv">
                  <div className="ProjectsInfo">
                    <div>
                      <h2><img src={compPgms} className="menteeProfileIcons" />Competitive Programming</h2>
                      <p>Add Hacker Rank &  CodeChef contests</p>
                    </div>
                    <div>
                      <button className="addbtn" onClick={this.showCmpPgmModal}><img src={add} className="menteeProfileIcons" />Add</button>
                    </div>
                  </div>
                </div> : null
            }
            {
              this.state.sideProject.length === 0 ?
                <div className="col-md-6 col-m-12 projectMainDiv">
                  <div className="ProjectsInfo">
                    <div>
                      <h2><img src={sideprojects} className="menteeProfileIcons" />Side Projects</h2>
                      <p>Add details of your side projects</p>
                    </div>
                    <div>
                      <button className="addbtn" onClick={this.showVisibleSideProject}><img src={add} className="menteeProfileIcons" />Add</button>
                    </div>
                  </div>
                </div> : null
            }
            {
              this.state.github.length !== 0 ?
                <div className="githubTasksTaken col-md-12 col-sm-12" >
                  <div className="githubTitle">
                    <p><img src={github} className="menteeProfileIcons" />Github</p>
                    <button className="addbtn" onClick={this.showModal}><img src={add} className="menteeProfileIcons" />Add</button>
                  </div>
                  <div style={{ overflowY: this.state.totaltasks["github"] <= 3 ? "hidden" : "scroll" ,height:this.state.totaltasks["github"] <= 3 ?"auto":"300px"}} id="custom-scroll" className="custom-scroll-class-github">
                    {this.renderGithubTasks(this.state.totaltasks["github"])}
                  </div>
                  {
                    this.state.github?.length > 3 ?
                      (<div className="col-md-12">
                        {this.state.totaltasks["github"] == 3 ? <p className="viewTasks" id="moregithub" onClick={this.viewMoreTasks.bind(this, "github", this.state.github.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></p> : <p className="viewTasks" id="lessgithub" onClick={this.viewMoreTasks.bind(this, "github", 3)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
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
                    <button className="addbtn" onClick={this.showLeetModal}><img src={add} className="menteeProfileIcons" />Add</button>
                  </div>
                  <div style={{ overflowY: this.state.totaltasks["LeetCode"] <= 2 ? "hidden" : "scroll",height:this.state.totaltasks["LeetCode"] <= 2 ? "auto":"482px"}} id="custom-scroll" className="custom-scroll-class-leetcode" >
                    {this.renderLeetCodeProjects(this.state.totaltasks["LeetCode"])}
                  </div>
                  {
                    this.state?.leetCode?.length > 2 ?
                      (<div className="col-md-12">
                        {this.state.totaltasks["LeetCode"] === 2 ? <p className="viewTasks" id="moreLeetCode" onClick={this.viewMoreTasks.bind(this, "LeetCode", this.state.leetCode.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></p> : <p className="viewTasks" id="lessLeetCode" onClick={this.viewMoreTasks.bind(this, "LeetCode", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                      </div>
                      ) : null
                  }
                </div> : null
            }
            {
              this.state.competitiveProgramming.length !== 0 ?
                <div className="cmpPgmMainDiv col-md-12 col-sm-12" >
                  <div className="githubTitle">
                    <h3>Competitive Programming</h3>
                    <button className="addbtn" onClick={this.showCmpPgmModal}><img src={add} className="menteeProfileIcons" />Add</button>
                  </div>
                  <div style={{ overflowY: this.state.totaltasks["CpmProgrmaam"] <= 2 ? "hidden" : "scroll",height: this.state.totaltasks["CpmProgrmaam"] <= 2 ? "auto":"482px"}} id="custom-scroll" className="custom-scroll-class-leetcode" >
                    {this.renderCmpPgmList(this.state.totaltasks["CpmProgrmaam"])}
                  </div>
                  {
                    this.state?.competitiveProgramming?.length > 2 ?
                      (<div className="col-md-12">
                        {this.state.totaltasks["CpmProgrmaam"] === 2 ? <p className="viewTasks" id="moreCpmProgrmaam" onClick={this.viewMoreTasks.bind(this, "CpmProgrmaam", this.state.competitiveProgramming.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span> </p> : <p className="viewTasks" id="lessCpmProgrmaam" onClick={this.viewMoreTasks.bind(this, "CpmProgrmaam", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                      </div>
                      ) : null
                  }
                </div> : null}
            {
              this.state.sideProject.length != 0 ?
                <div className="sideProjMainDiv  col-md-12 col-sm-12"  >
                  <div>
                    <div className="githubTitle">
                      <h3>Side Projects</h3>
                      <button className="addbtn" onClick={this.showVisibleSideProject}><img src={add} className="menteeProfileIcons" />Add</button>
                    </div>
                    <div style={{ overflowY: this.state.totaltasks["sideproj"] <= 2 ? "hidden" : "scroll",height:this.state.totaltasks["sideproj"] <= 2?"auto":"482px" }} id="custom-scroll" className="custom-scroll-class">
                      {this.renderSideProjects(this.state.totaltasks["sideproj"])}
                    </div>
                    {
                      this.state.sideProject.length > 2 ?
                        (<div className="col-md-12">
                          {this.state.totaltasks["sideproj"] == 2 ? <p className="viewTasks" id="moreSideProj" onClick={this.viewMoreTasks.bind(this, "sideproj", this.state.sideProject.length)}>View More <span><i class="fa fa-angle-down" aria-hidden="true"></i></span></p> : <p className="viewTasks" id="lessSideProj" onClick={this.viewMoreTasks.bind(this, "sideproj", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                        </div>
                        ) : null
                    }
                  </div>
                </div> : null
            }
            <div className="codeTasksMainDiv col-md-12 col-sm-12" >
              <h3>CodeDIY Tasks Taken ({this.state.tasksEngagement.length})</h3>
              {/* <div className="codeTaskSubDiv">
                                    <ul className="projectsData">
                                      <li><img src={mongo}/></li>
                                      <li>
                                         <h4>MongoDB Task</h4>
                                         <p>Setting up MongoDB 3.6 on your laptop and creating a document.</p>
                                      </li>
                                    </ul>
                                     <div><button className="tasksViewBtn">View</button></div>
                              </div> */}

              <div style={{ overflowY: this.state.totaltasks["CodeTasks"] <= 2 ? "hidden" : "scroll" ,height:this.state.totaltasks["CodeTasks"] <= 2 ? "auto":"482px"}} id="custom-scroll" className="custom-scroll-class-tasks">
                {this.renderTaskList(this.state.totaltasks["CodeTasks"])}
              </div>
              {
                this.state.tasksEngagement.length > 2 ?
                  (<div className="col-md-12">

                    {this.state.totaltasks["CodeTasks"] == 2 ? <p className="viewTasks" id="moreCodeTasks" onClick={this.viewMoreTasks.bind(this, "CodeTasks", this.state.tasksEngagement.length)}>View All Tasks <span><i class="fa fa-angle-down" aria-hidden="true"></i></span> </p> : <p className="viewTasks" id="lessCodeTasks" onClick={this.viewMoreTasks.bind(this, "CodeTasks", 2)}>View less <span><i class="fa fa-angle-up" aria-hidden="true"></i></span></p>}
                  </div>
                  ) : null
              }
            </div>
          </div>
        </div>

        <Modal
          title="GitHub Project"
          visible={this.state.visible}
          onOk={this.handleCancelGithub}
          onCancel={this.handleCancelGithub}
        >
          <div>
            <form>
              <label for="projectTitle">Project Title:</label>
              <input type="text" id="projectTitle" name="projectTitle" placeholder="Enter project title.." value={this.state.githubData["title"]} onChange={this.changeGithubData.bind(this, "title")} required />
              <label for="projectUrl">Project URL:</label>
              <input type="text" id="projectUrl" name="projectUrl" placeholder="Enter project url.." value={this.state.githubData["url"]} onChange={this.changeGithubData.bind(this, "url")} required />
              <label for="description">Description</label>
              <textarea id="description" name="description" placeholder="Write description.." style={{ height: "100px" }} value={this.state.githubData["description"]} onChange={this.changeGithubData.bind(this, "description")} required />
              <input type="submit" value="Add project" onClick={this.SubmiteGithubProjects.bind(this)} />
            </form>
          </div>
        </Modal>

        <Modal
          title="Leet Code Accomplishments"
          visible={this.state.visibleLeet}
          onOk={this.handleCancelLeet}
          onCancel={this.handleCancelLeet}
        >
          <div>
            <form>
              <label for="profileLink">Public Profile link:</label>
              <input type="text" id="profileLink" name="profileLink" placeholder="Enter profile link.." value={this.state.LeetCodeData["profileLink"]} onChange={this.changeLeetCodeData.bind(this, "profileLink")} required />
              <label for="description">Description</label>
              <textarea id="description" name="description" placeholder="Write description.." style={{ height: "100px" }} value={this.state.LeetCodeData["description"]} onChange={this.changeLeetCodeData.bind(this, "description")} required />
              <div className="leetUpload">
                <label for="upload" style={{ cursor: "pointer" }}>
                  <p><img src={upload} style={{ paddingRight: "7px" }} /><span>Upload</span> your project screenshots</p>
                  <h5 id="leetcode-scrnshot" />
                </label>
                <input id="upload" ref={(ref) => { this.uploadInput = ref; }} type="file" className="filetypeInput"  onChange={()=>{document.getElementById("leetcode-scrnshot").innerHTML=this.uploadInput.files[0].name || ""}} />
              </div>
              <input type="submit" value="Add project" onClick={this.submitLeetcode} />
            </form>
          </div>
        </Modal>

        <Modal
          title="Side Project"
          visible={this.state?.visibleSideProject}
          onOk={this.handleCancelSideProjects}
          onCancel={this.handleCancelSideProjects}
        >
          <div>
            <form>
              <label for="projectTitle">Project Title:</label>
              <input type="text" id="projectTitle" name="projectTitle" placeholder="Enter project title.." value={this.state?.sideProjectsData["projectTitle"]} onChange={this.changeSideProjectsData.bind(this, "projectTitle")} />
              <label for="projectUrl">Project URL:</label>
              <input type="text" id="projectUrl" name="projectUrl" placeholder="Enter project url.." value={this.state?.sideProjectsData["projectUrl"]} onChange={this.changeSideProjectsData.bind(this, "projectUrl")} />
              <label for="description">Description</label>
              <textarea id="description" name="description" placeholder="Write description.." style={{ height: "100px" }} value={this.state?.sideProjectsData["description"]} onChange={this.changeSideProjectsData.bind(this, "description")} />
              <div className="leetUpload">
                <label for="upload" style={{ cursor: "pointer" }}>
                  <p><img src={upload} style={{ paddingRight: "7px" }} /><span>Upload</span> your project screenshots</p>
                  <h5 id="sideproj-scrnshot" />
                </label>
                <input id="upload" ref={(ref) => { this.uploadInput = ref; }} type="file" className="filetypeInput" onChange={()=>{document.getElementById("sideproj-scrnshot").innerHTML=this.uploadInput.files[0].name || ""}} />
              </div>
              <input type="submit" value="Add project" onClick={this.SubmiteSideProjects} />
            </form>
          </div>
        </Modal>

        <Modal
          title="Competitive Programming"
          visible={this.state?.visibleCompPgm}
          onOk={this.handleCancelCompPgms}
          onCancel={this.handleCancelCompPgms}
        >
          <div>
            <ul style={{ display: "flex" }}>
              <li className="cmpli activeCmpLi" id="HackerRank" onClick={this.selectedCmpType.bind(this, "HackerRank")}>HackerRank</li>
              <li className="cmpli" id="CodeChef" onClick={this.selectedCmpType.bind(this, "CodeChef")}>CodeChef</li>
            </ul>

            <form>
              <div className="col-sm-12 no-padding-div" >
                <div className="col-sm-6 no-padding-div">
                <label for="projectTitle">Contest Name:</label>
                <input type="text" id="contestName" name="contestName" className="" placeholder="Enter contest name.." value={this.state.cpmPgmData["contestName"]} onChange={this.changeCmpPgmData.bind(this, "contestName")} />
                </div>
                <label for="projectUrl">Contest date:</label>
                <div className="col-sm-6 no-padding-div">
                <DatePicker onChange={this.onChangeDate} placeholder="YYYY-MM-DD"  className="date-picker-custom"/>
                {/* <DatePicker
                  calendarAriaLabel="Toggle calendar"
                  clearAriaLabel="Clear value"
                  dayAriaLabel="Day"
                  monthAriaLabel="Month"
                  nativeInputAriaLabel="Date"
                  minDate={this.state.value}
                  onChange={this.onChangeDate}
                  value={this.state.value}
                  yearAriaLabel="Year"
                  className="CalenderIcon "
                  format="y-MM-dd"
                /> */}
                </div>
              </div>
              <label for="description">Description</label>
              <textarea id="description" name="description" placeholder="Write description.." style={{ height: "100px" }} value={this.state?.cpmPgmData["description"]} onChange={this.changeCmpPgmData.bind(this, "description")} />
              <div className="leetUpload">
                <label for="upload" style={{ cursor: "pointer" }}>
                  <p><img src={upload} style={{ paddingRight: "7px" }} /><span>Upload</span> your project screenshots</p>
                  <h5 id="filename-cmpPmg" />
                </label>
                <input id="upload" ref={(ref) => { this.uploadInput = ref; }} type="file" className="filetypeInput" onChange={()=>{document.getElementById("filename-cmpPmg").innerHTML=this.uploadInput.files[0].name || ""}}/>
                <br/>
              </div>
              <input type="submit" value="Add project" onClick={this.SubmitCmpPgmData} />
            </form>
          </div>
        </Modal>

        <Modal
          title="Personal Info"
          visible={this.state?.visiblePersonalDtls}
          onOk={() => { this.setState({ visiblePersonalDtls: false }) }}
          onCancel={() => { this.setState({ visiblePersonalDtls: false }) }}
        >
          <div>
            <form>
              <div className="col-sm-12 no-padding-div">
                <div className="col-sm-6 no-padding-div">
                  <label for="firstName">First name:</label>
                  <input type="text" id="firstName" name="firstName" placeholder="Enter firstname" value={this.state.personalInfo["firstName"]} onChange={this.changePersonalInfo.bind(this, "firstName")} required />
                </div>
                <div className="col-sm-6 no-padding-div">
                  <label for="lastName">Last name:</label>
                  <input type="text" id="lastName" name="lastName" placeholder="Enter lastname" value={this.state?.personalInfo["lastName"]} onChange={this.changePersonalInfo.bind(this, "lastName")} required />
                </div>
              </div>
              <div className="col-sm-12 no-padding-div">
                <label for="userName">Public Profile URL:</label>
                <h5>{this.state?.personalInfo?.userName ? BaseUrl.website_url + "/user/" + this.state?.personalInfo["userName"] : BaseUrl.website_url + "/user/"}<span><input type="text" id="userName" name="userName" placeholder="Enter username" value={this.state.personalInfo["userName"]} onChange={this.changePersonalInfo.bind(this, "userName")} /></span></h5>
                { this.state.usernameexists == true ? <p style={{ color: "red" }}>This username already exists</p> : "" }
              </div>
              <div className="col-sm-12 no-padding-div">
                <div className="col-sm-6 no-padding-div">
                  <label for="college">College:</label>
                  <input type="text" id="college" name="college" placeholder="Enter College" value={this.state?.personalInfoEdu?.college} onChange={this.changePersonalInfoEdu.bind(this, "college")} required />
                </div>
                <div className="col-sm-6 no-padding-div">
                  <label for="degree">Degree:</label>
                  <input type="text" id="degree" name="degree" placeholder="Enter Degree" value={this.state?.personalInfoEdu?.degree} onChange={this.changePersonalInfoEdu.bind(this, "degree")} required />
                </div>
              </div>
              <div className="col-sm-4 no-padding-div">
                <label for="graduatedYear">Graduated:</label>
                <input type="text" id="graduatedYear" name="graduated" placeholder="Enter graduated year" value={this.state?.personalInfoEdu?.graduatedYear} onChange={this.changePersonalInfoEdu.bind(this, "graduatedYear")} required />
              </div>
              <div className="col-sm-12 no-padding-div mb-2 languages">
              <label for="preferredLanguages">Language:</label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select preferred languages"
                name="preferredLanguages"
                value={this.state?.languages}
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
                <label for="google">Google Link:</label>
                <input type="text" id="googleUrl" name="googleUrl" placeholder="Enter Google Url" value={this.state?.personalInfo?.googleUrl} onChange={this.changePersonalInfo.bind(this, "googleUrl")} required />
              </div>
              <div className="col-sm-12 no-padding-div">
                <label for="github">Github Link:</label>
                <input type="text" id="githubUrl" name="githubUrl" placeholder="Enter Github Url" value={this.state?.personalInfo?.githubUrl} onChange={this.changePersonalInfo.bind(this, "githubUrl")} required />
              </div>
              <div className="col-sm-12 no-padding-div">
                <label htmlFor="github">Linkedin profile Link:</label>
                <input type="text" id="linkedInUrl" name="linkedInUrl" placeholder="Enter linkedin profile Url"
                       value={this.state?.personalInfo?.linkedInUrl}
                       onChange={this.changePersonalInfo.bind(this, "linkedInUrl")} required/>
              </div>
              <div className="col-sm-12 no-padding-div">
                <label htmlFor="github">My Calendar Link:</label>
                <input type="text" id="calendarUrl" name="calendarUrl" placeholder="Enter Calendar Url"
                       value={this.state?.personalInfo.calendarUrl}
                       onChange={this.changePersonalInfo.bind(this, "calendarUrl")} required/>
              </div>
              <div className="col-sm-12 no-padding-div">
                <label for="aboutMe">About</label>
                <textarea id="aboutMe" name="aboutMe" placeholder="Write about yourself.." style={{ height: "100px" }} value={this.state?.personalInfo["aboutMe"]} onChange={this.changePersonalInfo.bind(this, "aboutMe")} required />
              </div>
              <div className="col-sm-12 no-padding-div">
                <input type="submit" value="Save" disabled={this.state?.usernameexists == true ? true : false} onClick={this.submitPersonalInfo.bind(this)} />
              </div>
            </form>
          </div>
        </Modal>
      </div>
    )
  }
}

export default MenteeProfile;
