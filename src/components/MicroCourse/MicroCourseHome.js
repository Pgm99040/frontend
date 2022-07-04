import React, {useEffect, useState} from 'react';
import {Row, Col, Button, Menu, Checkbox } from 'antd'
import Header from "../login/header";
import "./Styles/micro-course-detail.css"
import "./Styles/micro-test-details.css"
import {
    courseCompletionStatus,
    getCourseLessonAllDetail,
    getCourseLessonContent,
    lessonCompletionStatus
} from "../utils/_data";
import SweetAlert from "sweetalert-react";
import Loader from "../common/Loader";
const SubMenu = Menu.SubMenu;

const MicroCourseHome = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [courseDetail, setCourseDetail] = useState({});
    const [lessonDetail, setLessonDetail] = useState({});
    const [key, setKey] = useState("Intro");
    const [courseComplete, setCourseComplete] = useState(false);
    const [completeStatus, setCompleteStatus] = useState(false);
    const [userHasCompletedLesson, setUserHasCompletedLesson] = useState(false);
    const [failStatus, setFailStatus] = useState(false);

    useEffect(()=>{
        const courseId = window.location.pathname.split("/")[2];
        getCourseLessonDetail(courseId)
    },[]);

    const getCourseLessonDetail =async (id) => {
        const result = await getCourseLessonAllDetail(id);
        if (result?.success){
            setCourseDetail(result.data.data[0] || {});
            setCourseComplete(result.data.data[0].courseComplete)
        }else {
            console.log("error");
        }
    };

    const course = async () => {
        const UserId = localStorage.getItem("id")
        const id = courseDetail._id;
        const data = {
            userId : UserId,
            courseId : id
        };
        const result = await courseCompletionStatus(id,data);
        if (result?.success){
            setCompleteStatus(true)
            getCourseLessonDetail(id)
        }else {
            setFailStatus(true)
        }
    };

    const onSuccess = () => {
        setCompleteStatus(false)
    };

    const onFailure = () => {
        setFailStatus(false)
    };

    const viewLessons = async (item, key) => {
        setIsLoading(true);
        if(key !== 'Intro'){
            const id = item._id;
            const result = await getCourseLessonContent(id);
            if (result?.success){
                setIsLoading(false);
                setLessonDetail(result.data.data[0] || {})
                setUserHasCompletedLesson(result.data.data[0].lessonComplete)
            }else {
                setIsLoading(false);
                console.log("error");
            }
        }
        setKey(key)
    };

    const completeLesson = async () => {
        const UserId = localStorage.getItem("id");
        const id = lessonDetail._id;
        const data = {
            userId : UserId,
            lessonId : id
        };
        const result = await lessonCompletionStatus(id,data);
        if (result?.success){
            setCompleteStatus(true)
            getCourseLessonDetail(courseDetail._id)
        }else {
            setFailStatus(true)
        }
    };

    const showMenu = (lesson, key) => {
        return (
            <div style={{flex : 1}}>
                <Col span={24}>
                    <div className="form-row col-md-12 d-flex"  style={{justifyContent: "space-between"}}>
                        <Button type="primary" onClick={() => props.history.push('/MicroCourse')}>
                            Back to Courses
                        </Button>
                        {
                            userHasCompletedLesson === true ?
                                <p className="course-complete">You have already marked this lesson as completed.</p>
                                 :
                                 <Button type="primary" onClick={() => completeLesson()}>Mark This Lesson As Completed</Button>
                        }
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <p className="menu-name" >Lesson Name:</p>
                            <p>{lesson && lesson.lessonName}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <div dangerouslySetInnerHTML={{ __html: lesson?.microLessonContent }} />
                        </div>
                    </div>
                </Col>
            </div>
        )
    };

    return(
        <div>
            {isLoading && (<Loader/>)}
            <SweetAlert
                show={completeStatus}
                title={"Success"}
                type="success"
                text={"Congrats! You have marked the completion of this lesson under the course. Good luck with the next lesson"}
                onConfirm={onSuccess}
            />
            <SweetAlert
                show={failStatus}
                title={"Error"}
                type="error"
                text={"Can Not Complete This Course"}
                onConfirm={onFailure}
            />
            <div className="main_div">
                <Header/>
            </div>
            <div className="container">
                <div className="col-md-12 col-sm-12 col-xs-12 article_content">
                    <div>
                        <div className={'col-md-12 col-sm-12'}>
                            <div className="block_locker course-body">
                                <Row gutter={8} style={{marginTop: "18px"}}>
                                    <Col span={6} className="text-center">
                                        <Menu
                                            style={{ width: 256, textAlign: 'left'}}
                                            defaultSelectedKeys={['sub1']}
                                            defaultOpenKeys={['sub2']}
                                            mode="inline"
                                        >
                                            <Menu.Item key="sub1">
                                                <p onClick={() => viewLessons(courseDetail && courseDetail.name, "Intro")}>Introduction</p>
                                            </Menu.Item>
                                            <SubMenu key="sub2" title={<span>Lessons</span>}>
                                                {
                                                    courseDetail && (courseDetail.Lesson || []).map((item,i) => (
                                                            <Menu.Item key={i} title={item.lessonName}>
                                                                <div>
                                                                    <Checkbox checked= {item.lessonComplete ? true : false} />
                                                                    <span onClick={() => viewLessons(item, "Lesson")}> {item.lessonName}</span>
                                                                </div>
                                                            </Menu.Item>
                                                        )
                                                    )
                                                }
                                            </SubMenu>
                                        </Menu>
                                    </Col>
                                    {
                                        key === "Intro" ?
                                            <div style={{flex : 1}}>
                                                <Col span={24}>
                                                    <div className="form-row col-md-12 d-flex" style={{justifyContent: "space-between"}}>
                                                        <Button type="primary" onClick={() => props.history.push('/MicroCourse')}>
                                                            Back to Courses
                                                        </Button>
                                                        {
                                                            courseComplete ?
                                                                <p className="course-complete">Course is marked completed.User can still view the contents just like before.</p>
                                                                : <Button onClick={()=>course()} type="primary">Mark course as completed</Button>
                                                        }
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-12">
                                                            <p className="menu-name">Course Name:</p>
                                                            <p>{courseDetail && courseDetail.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-12">
                                                            <p>Please Select a Lessons from the List</p>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </div> :
                                            showMenu(lessonDetail, key)
                                    }
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MicroCourseHome;
