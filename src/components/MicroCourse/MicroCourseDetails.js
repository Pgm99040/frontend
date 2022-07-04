import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Row, Col, Button} from 'antd'
import Header from "../login/header";
import {courseCompletionStatus, getMicroCourseDetail, requestForCourse} from "../utils/_data";
import './Styles/micro-course-detail.css'
import SweetAlert from "sweetalert-react";
import PaypalExpressBtn from "react-paypal-express-checkout";
import BaseUrl from "../../config/properties";
const ButtonGroup = Button.Group;

const MicroCourseDetail = (props) => {

    const [courseDetail, setCourseDetail] = useState({});
    const [courseComplete, setCourseComplete] = useState(false);
    const [completeStatus, setCompleteStatus] = useState(false);
    const [failStatus, setFailStatus] = useState(false);
    const [coursePay, setCoursePay] = useState(false);
    const [coursePurchased, setCoursePurchased] = useState(false);
    const history = useHistory();

    useEffect(()=>{
        const id = history?.location?.state?.data?._id
        getCourseDetail(id)
    },[]);

    const getCourseDetail = async (id) => {
        const result = await getMicroCourseDetail(id);
        if (result?.success){
            setCourseDetail(result.data.data[0] || {});
            setCourseComplete(result.data.data[0].courseComplete)
            setCoursePay(result.data.data[0].takeCourse)
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
            getCourseDetail(id)
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

    const onSuccessPurshed = () => {
        setCoursePurchased(false)
    };

    const onSuccessPaypal = async (data) =>{
        let requestBody = {
            "userId": localStorage.getItem('id'),
            "paymentStatus": "success",
            "transactionId": data.paymentID,
            "captured": true,
            "payerId" : data.payerID,
            "paymentToken" : data.paymentToken,
            "paymentGateway": "paypal",
            "courseName" : courseDetail?.name,
            "courseId" : courseDetail?._id,
            "coursePrice" : courseDetail?.coursePrice
        };
        const response = await requestForCourse(requestBody);
        if (response.data.status_code === 200) {
            setCoursePurchased(true)
            getCourseDetail(courseDetail?._id)
        }
        else {
            console.log(response.data.message);
        }
    };

    const onError = (err) => {
        console.log("Error!", err);
    };

    const onCancel = (data) => {
        console.log('The payment was cancelled!', data);
    };

    let env = 'sandbox';
    let currency = 'USD';

    const client = {
        sandbox: BaseUrl.paypal_sendbox,
    };
    const style = {
        shape: 'rect',
        size: 'responsive',
        label: 'paypal',
        width: 176,
        height: 41,
        marginTop: 15
    };

    return(
        <div>
            <SweetAlert
                show={coursePurchased}
                title={"Success"}
                type="success"
                text={"Successfully Purshed Course"}
                onConfirm={onSuccessPurshed}
            />
            <SweetAlert
                show={completeStatus}
                title={"Success"}
                type="success"
                text={"Congrats! You have marked the completion of this course. Good luck with the next course"}
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
                    <h2 className="article_innercont">Course Description</h2>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 article_content">
                    <div>
                        <div className={'col-md-12 col-sm-12'}>
                            <div className="block_locker course-body">
                                <div className="col-md-12 col-sm-12 col-xs-12 block_image account-pg">
                                    {
                                        courseDetail ?
                                            <Row gutter={8}>
                                                <Col span={4} className="text-center">
                                                    <img height={125}
                                                         src={courseDetail && courseDetail.courseImageUrl}
                                                         className="course-image"/>
                                                </Col>
                                                <Col span={20}>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <p className="intro-header">Name:</p>
                                                            <p className="intro-content">{courseDetail && courseDetail.name}</p>
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <p className="intro-header">Author:</p>
                                                            <p className="intro-content">{courseDetail && courseDetail.courseAuthor}</p>
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <p className="intro-header">Tags:</p>
                                                        <p className="intro-content">{courseDetail && courseDetail.courseTagWords}</p>
                                                    </div>

                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <p className="intro-header">Lessons:</p>
                                                            <p className="intro-content">{courseDetail && courseDetail.Lesson?.length}</p>
                                                        </div>
                                                    </div>

                                                    <div className="form-group col-md-12">
                                                        <p className="intro-header">Course Description:</p>
                                                        <p className="intro-content intro-content-description">
                                                            <div
                                                                dangerouslySetInnerHTML={{__html: courseDetail && courseDetail.description}}/>
                                                        </p>
                                                        <p className="intro-header"><Link to={`/MicroCourse/${courseDetail._id}/Lesson`}>more....</Link></p>
                                                    </div>

                                                    <div className="form-group col-md-12">
                                                        <p className="intro-header">Course
                                                            Price:(In USD) </p>

                                                        <div className="col-sm-1">
                                                            <p className="intro-content">&nbsp;{courseDetail && courseDetail.coursePrice}</p>
                                                        </div>
                                                    </div>


                                                    {
                                                        coursePay ? null :
                                                            courseDetail && courseDetail.isActive ?
                                                            <div
                                                                className="form-row col-md-12 text-center intro-button">
                                                                <PaypalExpressBtn env={env} client={client}
                                                                                  currency={currency}
                                                                                  style={style}
                                                                                  total={courseDetail?.coursePrice}
                                                                                  onError={onError}
                                                                                  onSuccess={onSuccessPaypal}
                                                                                  onCancel={onCancel}/>
                                                            </div> :
                                                                <p className="course-complete">This course has been deactivated. Pls stay tuned for new Course Launches
                                                                    on the Course List page</p>
                                                    }

                                                    {coursePay ?
                                                        <div className="form-row col-md-12 text-center intro-button">
                                                            {
                                                                courseComplete ?
                                                                    <p className="course-complete">You have already
                                                                        completed this course.You can revisit and learn
                                                                        again anytime!</p>
                                                                    : <Button type="primary" onClick={() => course()}>Mark
                                                                        course as completed</Button>
                                                            }
                                                        </div> :
                                                        null}
                                                    <div className="form-row col-md-12 text-center intro-button">
                                                        <ButtonGroup>
                                                            <Button type="primary"
                                                                    onClick={() => props.history.push('/MicroCourse')}>
                                                                Back to Courses
                                                            </Button>
                                                            <Button type="primary"
                                                                    onClick={() => props.history.push(`/MicroCourse/${courseDetail._id}/Lesson`)}>
                                                                Start Learning
                                                            </Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </Col>
                                            </Row>
                                            : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MicroCourseDetail;
