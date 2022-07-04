import React, {useEffect, useState} from 'react';
import Header from "./login/header";
import {viewMentorTaskReview} from "./utils/_data";
import {Link} from "react-router-dom";

const ViewMentorReview = (props) => {

    const [taskEngagementId, setTaskEngagementId] = useState("");
    const [taskMentorReview, setTaskMentorReview] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const id = props.match.params.taskId;
        setTaskEngagementId(id)
        viewMentorReview(id)
    },[]);

    const viewMentorReview = async (id) => {
        setLoading(true);
        const response = await viewMentorTaskReview(id);
        console.log("response",response)
        if (response.data.success) {
            setTaskMentorReview(response.data.result)
            setLoading(false);
        } else {
            setLoading(false);
        }

    };

    return (
        <>
            <div className="main_div">
                <Header/>
            </div>
            <div>
                <Link to={`/task-engagement/${props.match.params.taskId}`}>&lt;&nbsp;Back To Task Engagement Page</Link>
                <div className="container">
                    <h3 className="text-center">Here is the detailed review from your mentor for this Task</h3>
                </div>
            </div>
            {
                taskMentorReview.length ? taskMentorReview.map(item => (
                        <div className="container">
                            <div className="col-m-12 col-sm-12 col-xs-12 article_content">
                                <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                                    <div className="d-flex" style={{flexDirection: "column"}}>
                                        <div><b>Task Review Item :</b></div>
                                        <div>{item.title}</div>
                                    </div>
                                    <div className="d-flex" style={{flexDirection: "column"}}>
                                        <div><b>Task Review Item Description :</b></div>
                                        <div dangerouslySetInnerHTML={{__html: item.description}}/>
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
        </>
    )
};

export default ViewMentorReview;
