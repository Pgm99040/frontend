import React from 'react';
import { Rate } from 'antd';
import mentee1 from '../images/mentee1.jpg';
import ChatIcon from '../images/chatIcon.png';
require('../styles/mentorTask.css');
require('../styles/mentorMenteeProfile.css');

class MentorMenteeProfile extends React.Component {
    render() {
        return (
            <div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <p className="mentor-assigned" >Mentee Profile</p>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 p-bottom-50">
                    <div className="col-md-3 col-sm-4 col-xs-12 no-padding-div">
                        <img src={mentee1} className="image-size" />
                    </div>
                    <div className="col-md-9 col-sm-8 col-xs-12 no-padding-div">
                        <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                            <p className="mentor-name">Sherin</p>
                            <Rate allowHalf defaultValue={0} /> <span>Not Rated </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <p className="chat-mentor" ><img src={ChatIcon} />&nbsp;&nbsp;Chat with Mentor</p>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <p className="feedback-from-mentee" >Feedback from this mentee</p>
                    <p className="feedback-desc" >Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore</p>
                    <div className="displayInline"><p className="mentor-rating"> You’ve been rated:&nbsp;&nbsp;</p><Rate allowHalf defaultValue={5} /></div>
                </div>
            </div>
        )
    }
}

export default MentorMenteeProfile;