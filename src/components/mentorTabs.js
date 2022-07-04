import React from 'react';
import { Tabs, Input, Upload, message, Button, Icon, Select } from 'antd';
import John from '../images/john-doe.jpg';
import mentee1 from '../images/mentee1.jpg';
require('../styles/mentorTask.css');

const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;
const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

class MentorTabs extends React.Component {
    render() {
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={() => this.callback()}>
                    <TabPane tab="Answers" key="1">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <p className="tabs-text">Lorem Ipsum Dolor Sit Amet Consectet Lorem Ipsum Dolor Sit Amet Consectet</p>
                            <div className="m-bottom-30">
                                <form action="javascript:void(0);">
                                    <TextArea rows={6} placeholder="Write description here.." className="margin-Bottom" />
                                    <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                                        <div className="col-md-7 col-sm-7 col-xs-12">
                                            &nbsp;
                                                </div>
                                        <div className="col-md-3 col-sm-3 col-xs-12 no-right-padding-div">
                                            <Upload {...props}>
                                                <Button className="attach-btn">Attach File</Button>
                                            </Upload></div>
                                        <div className="col-md-2 col-sm-2 col-xs-12 no-right-padding-div">
                                            <Button className="post-btn"> POST </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 no-padding-div">
                                <div className="answer-list">
                                    <p className="answer-Id">#21345431</p>
                                    <div className="displayInline paddingBottom"><p className="answer-filename"> Setting_up_MongoDB_05_feb.zip</p>&nbsp;<Icon type="download" />&nbsp;&nbsp;&nbsp;<span className="answermargin-Bottom-hour">5 hours ago</span> </div>
                                    <p className="answer-desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inciut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ut labore et dolore magna aliqua. Ut enim ad minim  </p>
                                </div>
                                <div className="answer-list">
                                    <p className="answer-Id">#21345431</p>
                                    <div className="displayInline paddingBottom"><p className="answer-filename"> Setting_up_MongoDB_05_feb.zip</p>&nbsp;<Icon type="download" />&nbsp;&nbsp;&nbsp;<span className="answermargin-Bottom-hour">5 hours ago</span> </div>
                                    <p className="answer-desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inciut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ut labore et dolore magna aliqua. Ut enim ad minim  </p>
                                </div>
                                <div className="answer-list">
                                    <p className="answer-Id">#21345431</p>
                                    <div className="displayInline paddingBottom"><p className="answer-filename"> Setting_up_MongoDB_05_feb.zip</p>&nbsp;<Icon type="download" />&nbsp;&nbsp;&nbsp;<span className="answermargin-Bottom-hour">5 hours ago</span> </div>
                                    <p className="answer-desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inciut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ut labore et dolore magna aliqua. Ut enim ad minim  </p>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Description" key="2">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <p className="description-desc">This task will guide you through the intricacies of downloading and installing monger DB on your win or mac laptop and showing how documents are created. This task will also help you understand the difference between a SQL table and a Mongo Document using a common object like a 'User' as example.</p>
                            <p className="description-details">Task Category:&nbsp;&nbsp;<span className="task-details-name">Programming</span></p>
                            <p className="description-details">Related KnowledgeBlock:&nbsp;&nbsp;<span className="task-details-name-blue">MongoDB</span></p>
                            <p className="description-details">Related CareerPaths:&nbsp;&nbsp;<span className="task-details-name-blue">Software Development Engineering, Software Test Engineering</span></p>
                            <p className="description-details">Task Mentor:&nbsp;&nbsp;<span className="task-details-name">MongoDB, Industry Professional.</span></p>
                        </div>
                    </TabPane>
                    <TabPane tab="Discussions" key="3">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="col-md-1 col-sm-1 col-xs-12 no-left-padding-div">
                                <img src={mentee1} className="discussionsmentee-imageSize" />
                            </div>
                            <div className="col-md-11 col-sm-11 col-xs-12">
                                <div className="discussion-position" >
                                    <TextArea rows={3} placeholder="Write post here…" className="m-Bottom-30" />
                                    <Button className="discussion-btn"> Post </Button>
                                </div>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 m-Bottom-30 no-left-padding-div">
                                <div className="col-md-1 col-sm-1 col-xs-12 no-left-padding-div">
                                    <img src={John} className="discussions-imageSize" />
                                </div>
                                <div className="col-md-11 col-sm-11 col-xs-12">
                                    <p className="discussion-name">John Doe&nbsp; <span className="discussion-time">13 hours ago </span></p>
                                    <p className="discussion-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                                </div>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 m-Bottom-30 no-left-padding-div">
                                <div className="col-md-1 col-sm-1 col-xs-12 no-left-padding-div">
                                    <img src={mentee1} className="discussions-imageSize" />
                                </div>
                                <div className="col-md-11 col-sm-11 col-xs-12">
                                    <p className="discussion-name">Sherin&nbsp; <span className="discussion-time">13 hours ago </span></p>
                                    <p className="discussion-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>

                                </div>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 m-Bottom-30 no-left-padding-div">
                                <div className="col-md-1 col-sm-1 col-xs-12 no-left-padding-div">
                                    <img src={John} className="discussions-imageSize" />
                                </div>
                                <div className="col-md-11 col-sm-11 col-xs-12">
                                    <p className="discussion-name">John Doe&nbsp; <span className="discussion-time">13 hours ago </span></p>
                                    <p className="discussion-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Resources" key="4">
                        <div className="col-md-12 col-sm-12 col-xs-12"><p>Content of Tab Pane Resources</p></div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default MentorTabs;