import React from 'react';
import TaskLogo from '../images/bitmap.png';
import { Progress } from 'antd';
require('../styles/mentorTask.css');

class MentorTask extends React.Component {
    render() {
        return (
            <div>
                <div className="col-md-2 col-sm-4 col-xs-12 no-right-padding-div">
                    <img src={TaskLogo} />
                </div>
                <div className="col-md-8 col-sm-6 col-xs-12">
                    <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div top-10 paddingBottom">
                        <span className="task_name">MongoDB Task</span>
                        <div className="divider" />
                        <span className="task_category">Programming</span>
                        <span className="bulletin" >&bull;</span>
                        <span className="task_difficulty">Beginner</span>
                    </div>
                    <div className="col-md-12 col-xs-12 col-sm-12 no-padding-div">
                        <p className='task_desc paddingBottom'>Setting up MongoDB 3.6 on your laptop and creating a document.</p>
                        <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                            <Progress percent={100} showInfo={false} status="active"/>
                            <p className='progress-text text-left'>Started</p>
                        </div>
                        <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div center-progress-bar">
                            <Progress percent={0} showInfo={false} />
                            <p className='progress-text text-center'>In Progress</p>
                        </div>
                        <div className="col-md-4 col-xs-4 col-sm-4 no-padding-div">
                            <Progress percent={0} showInfo={false} />
                            <p className='progress-text text-right'>End</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 col-sm-2 col-xs-12 no-padding-div top-10 paddingBottom">
                    <span className="mentorTask_pay">Earned ₹300</span>
                </div>
            </div>
        )
    }
}

export default MentorTask;