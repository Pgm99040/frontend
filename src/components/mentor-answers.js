import React from 'react';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import { Input, Button, Icon, Select } from 'antd';
import userDefaultImage from '../images/user.png';
import {viewTask, answerAdd} from "./utils/_data";
import { DownloadOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const Option = Select.Option;

class MentorAnswers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            submissions:[],
            uploadedSuccessfully:false,
            uploadedUnsuccessful:false,
            message:'',
            mentor:'',
            mentorUser:'',
            user:'',
        };
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }
    componentDidMount() {
        //console.log(this.props)
        //this.setState({submissions:this.props.submissions},)
        this.getAllAnswers();
    }

    //get all the answers for the task engagement Id 
    getAllAnswers = async () =>{
        const taskId = this.props.taskEngagementId;
        const response = await viewTask(taskId);
        if (response?.data?.status_code === 200){
            this.setState({data:response.data.result,
                submissions:response.data.result.submissions.reverse(),
                mentor:response.data.result.mentor,
                mentorUser:response.data.result.mentor.user,
                user:response.data.result.user});
        } else {
            console.log("error------->");
        }
        // axios.get(BaseUrl.base_url+"/api/v1/te/view/"+this.props.taskEngagementId,{ 'headers': {
        //     "Content-Type": "application/json",
        //     "Authorization": localStorage.getItem('authToken')
        //   }
        // }).then((response)=>{
        //     console.log(response);
        //         this.setState({data:response.data.result,
        //             submissions:response.data.result.submissions.reverse(),
        //             mentor:response.data.result.mentor,
        //             mentorUser:response.data.result.mentor.user,
        //             user:response.data.result.user});
        //     }
        // );
    };

    //upload answer from mentor side 
    onFormSubmit = async (event) =>{
        event.preventDefault();

        // const url = BaseUrl.base_url+'/api/v1/te/submission';
        var answer_description = document.getElementById('answer_description').value;
        const formData = new FormData();
        formData.append('file',this.uploadInput.files[0]);
        formData.append('taskEngagementId',this.props.taskEngagementId);
        formData.append('uploadedBy','mentor');
        formData.append('description',answer_description);
        formData.append('mentorId', JSON.parse(localStorage.getItem('userData')).mentor);
        console.log("formData", formData);
        const config = {
            headers: {
                'Authorization': localStorage.getItem('authToken')
            }
        };
        //return  axios.post(url, JSON.stringify(formData),config)
        var that = this;

        const response = await answerAdd(formData);
        console.log("answers----------->", response);
          if(response?.data?.status_code === 200 || response?.data?.status_code==201 ) {
            that.setState({uploadedSuccessfully:true, message:response.data.message})
          }else if(response?.data?.status_code === 500) {
            that.setState({uploadedUnsuccessful:true, message:'Please select a file to upload.'})
          } else {
            that.setState({uploadedUnsuccessful:true, message: response && response.data && response.data.message[0] && response.data.message[0].msg})
          }

        // fetch(url, {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         'Authorization': localStorage.getItem('authToken')
        //     }
        //     }).then((response) => {
        //         return response.json();
        //     }).then(function(data) {
        //
        //       console.log(data.message);
        //       if(data.status_code==200 || data.status_code==201 ) {
        //         that.setState({uploadedSuccessfully:true, message:data.message})
        //       }else if(data.status_code==500) {
        //         that.setState({uploadedUnsuccessful:true, message:'Please select a file to upload.'})
        //       } else {
        //         that.setState({uploadedUnsuccessful:true, message:data.message[0].msg})
        //       }
        //     })
        //
        //     .catch((err) => {
        //         console.log(err)
        //     })
      
      };

      //get the submission list from the function getAllData and loop them
      renderSubmissionList() {
          if(this.state.submissions) {
            return(
        		this.state.submissions.map((obj,index) => {
        			return this.renderSubmissionView(obj,index)
                })
            )}
          /* else {

        } */
      }

      //render the submission html
      renderSubmissionView(obj,index) {
         
          var menteeName;
          var menteeProfilePic;
          var str = obj.fileUrl!=null?obj.fileUrl:"";
          var parts = str.split('/');
          var loc = parts.pop();
          //console.log(loc)
          var time =obj.createdAt;
          var localDate = new Date(time);
          var date = moment(localDate).fromNow();
          //console.log(localDate)

          //check if it is submitted by the mentor or mentee
          if(obj.submittedBy === 'mentor') {
                menteeName =this.state.mentorUser.firstName+' '+this.state.mentorUser.lastName
          }else if(this.state.user.isAnonymous == true && obj.submittedBy === 'user'){  //anonymous check
                menteeName = 'Mentee(Anonymous)'
                menteeProfilePic = userDefaultImage
          }else if(this.state.user.isAnonymous == false && obj.submittedBy === 'user'){
                menteeName = this.state.user.firstName+' '+this.state.user.lastName;
                menteeProfilePic = this.state.user.profilePicUrl
          }
        return(
            <div className="answer-list" key= {index}>
                <p className="answer-Id">#{obj._id}</p>&nbsp;&nbsp;<span className='uploadedby'>By&nbsp;{menteeName}</span>
                <div className="displayInline paddingBottom"><a href={'https://s3.amazonaws.com/codediydev/'+obj.fileUrl} className='downloadable' download><p className="answer-filename">{loc}</p>&nbsp;<DownloadOutlined /></a>&nbsp;&nbsp;&nbsp;<span className="answermargin-Bottom-hour">{date}</span> </div>
                <p className="answer-desc">{obj.description}</p>
            </div>
        )
      }
      success() {
          this.setState({uploadedSuccessfully:false});
          document.getElementById("answerForm").reset();
          this.getAllAnswers();
      }
      failure() {
        this.setState({uploadedUnsuccessful:false});
        document.getElementById("answerForm").reset();
        this.getAllAnswers();
      }

    render() {
        var disabled =false;
        if(this.state.data.status === 'completed') {
            disabled =true
        }else {
            disabled =false
        }
        return(
            <div className="col-md-12 col-sm-12 col-xs-12">
            <SweetAlert
                show={this.state.uploadedSuccessfully}
                title="Success"
                type="success"
                text= {this.state.message}
                onConfirm={()=>this.success()}
            />
            <SweetAlert
                show={this.state.uploadedUnsuccessful}
                title="Warning"
                type="warning"
                text= {this.state.message}
                onConfirm={()=>this.failure()}
            />
                <p className="tabs-text">Lorem Ipsum Dolor Sit Amet Consectet Lorem Ipsum Dolor Sit Amet Consectet</p>
                <div className="m-bottom-30">
                    <form action="javascript:void(0);" onSubmit={this.onFormSubmit} id='answerForm'>
                        <TextArea rows={6} disabled ={disabled ?true : false } id='answer_description' placeholder="Write description here.." className="margin-Bottom"   />
                        <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                            <div className="col-md-4 col-sm-7 col-xs-12">
                                &nbsp;
                            </div>
                            <div className="col-md-6 col-sm-3 col-xs-12 no-right-padding-div">
                            <input ref={(ref) => { this.uploadInput = ref; }} type="file" disabled ={disabled ?true : false } />
                            </div>
                            <div className="col-md-2 col-sm-2 col-xs-12 no-right-padding-div">
                                <Button className="post-btn" htmlType='submit' disabled ={disabled ?true : false }> POST </Button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 no-padding-div">
                    {this.renderSubmissionList()}
                </div>
            </div>
        )
    }
}
export default MentorAnswers;