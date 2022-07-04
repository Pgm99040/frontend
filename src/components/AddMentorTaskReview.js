import React from 'react';
import {withRouter,Link} from "react-router-dom";
import Header from './login/header';
import {Button} from 'antd';
import {toast} from "react-toastify";
import {viewTaskReview, taskviewreview,gettaskviewreview,taskreviewupdate} from "./utils/_data";
import Loader from "./common/Loader";
import CKEditor from "./common/CKEditor";

require('../styles/current-task.css');
require('../styles/task-details.css');

class AddMentorTaskReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            taskReview: [],
            edit: [],
            editData: "",
            taskfeedback: []
        };

        this.onHandleEditor = this.onHandleEditor.bind(this)
        this.onGetdata = this.onGetdata.bind(this)
        this.onHandleeditor = this.onHandleeditor.bind(this)
        this.onGetdataset = this.onGetdataset.bind(this)

    }

    getViewTask = async () => {
        const taskId = this.props.match.params.taskEngagementId;
        this.setState({isLoading: true});
        const response = await viewTaskReview(taskId);
        if (response.success) {
            this.setState({
                isLoading: true,
                taskReview: response.data.result || []
            });
            this.onGetdataset()
        } else {
            this.setState({isLoading: false});
        }
    }

    onGetdata = async () => {
        const taskId = this.props.match.params.taskEngagementId;
        const response = await gettaskviewreview(taskId)
        if (response.success) {
            this.setState({
                taskfeedback: response.data.response || []
            });
        }
    };

    onGetdataset = async () => {
        this.setState({
            taskReview : this.state.taskReview.map(eachTaskReview=>{
                const data = this.state.taskfeedback.find(e=>e.TaskReviewItemId === eachTaskReview._id);
                return {...eachTaskReview,MentorTaskReviewTextForReviewItem : data?.MentorTaskReviewTextForReviewItem || ``}
            })
        })
    };

    componentDidMount() {
        this.onGetdata()
        this.getViewTask()
    }

    onHandleEditor(e) {
        const {name, value, id} = e.editor;
        let updatedTask = this.state.taskReview;
        if (name === 'MentorTaskReviewTextForReviewItem') {
            updatedTask[id][name] = value.editor.getData();
        } else {
            updatedTask[id][name] = value.editor.getData();
        }
        this.setState([...updatedTask])
    }

    onHandleeditor = (e) => {
        this.setState({editData: e.editor.getData()})
    };

    onSave = async () => {
        const taskId = this.props.match.params.taskEngagementId;
        const filterData = this.state.taskReview.filter(item => item.MentorTaskReviewTextForReviewItem !== "")
        const response = await taskreviewupdate(taskId, filterData)
        console.log("response",response)
        this.props.history.push(`/mentor-task-details/${taskId}`)

    };

    render() {
        // if (this.state.isLoading) return <Loader/>;
        return (
            <div>
                <div className="main_div">
                    <Header/>
                </div>

                    <div>
                        <Link to={`/mentor-task-details/${this.props.match.params.taskEngagementId}`}>&lt;&nbsp;Back To Task Engagement Page</Link>
                        <div className="container">
                            <h3 className="text-center">Here is the detailed review from your mentor for this Task</h3>
                        </div>
                    </div>

                {this.state.taskReview.length ? this.state.taskReview.map((item,id) => (
                    <div className="container">
                        <div className="col-m-12 col-sm-12 col-xs-12 article_content">
                            <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                                <div className="d-flex" style={{flexDirection: "column", alignItems: "flex-start"}}>
                                    <div className="d-flex flex-row col-12 col-md-12" style={{justifyContent: "flex-start"}}>
                                        <div className="col-12 col-md-2">
                                            <p><b>Task Review Item : </b></p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <p>{item?.title}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row col-12 col-md-12" style={{justifyContent: "flex-start"}}>
                                        <div className="col-12 col-md-2">
                                            <p><b>Task Review Item Description : </b></p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <p dangerouslySetInnerHTML={{__html: item?.description || "-"}}/>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row col-12 col-md-12 " style={{justifyContent: "flex-start"}} >
                                        <div className="col-12 col-md-2">
                                            <p><b>My FeedBack : </b></p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <CKEditor name="editData" data={(item.MentorTaskReviewTextForReviewItem)}
                                                      onChange={(value) =>
                                                          this.onHandleEditor({editor: {name: "MentorTaskReviewTextForReviewItem", value, id}})
                                                          }/>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                     :
                    <div className="d-flex" style={{justifyContent: "center"}}>
                    <h3>No Review available</h3>
                    </div>
                }
                {this.state.taskReview.length ?<div className="d-flex w-100" style={{marginTop: "10px",marginBottom: "10px", justifyContent: "center"}}>
                    <Button type="primary" className="btn primary " style={{marginRight: "5px"}}
                            onClick={() => this.onSave()}>save</Button>
                    <Link to={`/mentor-task-details/${this.props.match.params.taskEngagementId}`}>
                        <Button type="primary" className="btn primary" >cancel</Button>
                    </Link>

                </div>:null}
            </div>
        )
    }
}

export default withRouter(AddMentorTaskReview);
