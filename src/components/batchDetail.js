import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import Header from "./login/header";
import {Rate, Table, Tabs} from "antd";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import {FacebookIcon, TwitterIcon, WhatsappIcon} from "react-share";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Programming from "../images/programming.jpg";
import moment from "moment-timezone";
import "../styles/live-session.css"
import {becomeMentor, getBookSession, getuserRating, userRating, userReview} from "./utils/_data";
import {getFromStorage} from "../config/common";
import Loader from "./common/Loader";
import {Button, Modal} from "react-bootstrap";
import GoogleWithLogin from "./login/GoogleWithLogin";
import UserModal from "./login/UserModal";
let displayMentorDashboard =false;
let displayMenteeDashboard = false;

const BatchDetail = (props) => {
    const history = useHistory();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [detailId, setDetailId] = useState("");
    const [batchDetail, setBatchDetail] = useState({});
    const [booking, setBooking] = useState([]);
    const [batchIterator, setBatchIterator] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalRating, setTotalRating] = useState(0);
    const [reviewRating, setReviewRating] = useState(0);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [reviewFleg , setReviewFleg] = useState(false);
    const [visible, setVisible] = useState(false);
    const userDetails = getFromStorage("userData") ? JSON.parse(getFromStorage("userData")) : {};

    useEffect(() => {
        const title = params && params.title;
        const batch = history && history.location && history.location.state && history.location.state.data;
        const id = history && history.location && history.location.state && history.location.state.id;
        const iterator = history && history.location && history.location.state && history.location.state.batch;
        setDetailId(id);
        setBatchDetail(batch);
        setBatchIterator(iterator);
        getBookBatch(batch.id);
        getUsersRating(id);
    }, [reviewFleg]);

    const getUsersRating = async (id) => {
        let reviewList = [];
        const userData = JSON.parse(localStorage.getItem("userData"))
        setIsLoading(true);
        const result = await getuserRating(id)
        if (result && result.data && result.data.all_reviews) {
            setIsLoading(false);
            setAvgRating(result && result.data && result.data.response && result.data.response[0] && Number((result.data.response[0].average_rating).toFixed(1)));
            setTotalRating(result && result.data && result.data.total_rating);
            const filter = result && result.data && result.data.all_reviews && result.data.all_reviews.filter(item => item.email === userData.email);
            if (filter.length > 0) {
                result && result.data && result.data.all_reviews.unshift(filter[0]);
                reviewList = result && result.data && result.data.all_reviews && [...new Set(result && result.data && result.data.all_reviews)];
            } else {
                reviewList = result && result.data && result.data.all_reviews;
            }
            setReviews(reviewList);
        }
    };

    const getBookBatch = async (id) => {
        const data = await getBookSession(id);
        if (data && data.success) {
            setBooking(data && data.data && data.data.response);
        } else {
            console.log("error--------------->>")
        }
    };

    const showModalGoogle = () => {
        setVisible(true);
        localStorage.setItem('isVisible',true)
    };

    const handleCancelGoogle = () => {
        setVisible(false);
        localStorage.setItem('isVisible', false);

    }

    const mentorLogin = async () => {
        displayMentorDashboard=true;
        let userid= localStorage.getItem('id');
        const res = await becomeMentor(userid);
        if (res?.success){
            setVisible(false);
            localStorage.setItem('isMentor',true);
            localStorage.setItem('isVisible', false);
            localStorage.setItem('userType','mentor');
            window.location.href="/mentor-dashboard"
        }
    };

    const userLogin = () => {
        displayMenteeDashboard=true;
        setVisible(false);
        localStorage.setItem('isVisible', false);
        localStorage.setItem('userType','user');
        window.location.href="/tasklist"

    }

    const isBookOrNot = (record) => {
        const value = moment(new Date()).format("MM DD YY");
        return (record?.iterator?.find(item => {return (moment(item.date).format("MM DD YY")) === value}) || []).length > 0;
    };

    const date = moment(new Date()).format('MMM DD YYYY h:mm a');
    const columns = [
        {
            title: 'Batch URL Name',
            dataIndex: '',
            key: '',
            width: 300,
            render: (record, index) => (
                <div>{record.batchUrlName}</div>
            )
        },
        {title: 'Batch Name', dataIndex: 'batchDescription', key: 'batchDescription'},
        {title: 'Batch Instructor', dataIndex: 'name', key: 'name'},
        {title: 'Batch Instructor Bio', dataIndex: 'bio', key: 'bio', ellipsis: true},
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            render: (index, record) => {
                const filterList = booking && booking.length && booking.filter(val => {
                    if ((val.BatchId === record.id) && val.email === userDetails?.email) {
                        return true;
                    }
                });
                return (<>
                    {
                        (record && record.iterator && record.iterator.length > 0) ? !moment(record.iterator[0].date).isBefore(date) ? record.seat !== 0 ? filterList && filterList.length ?
                            <h6 className="text-success py-5">Booked</h6> :
                            isBookOrNot(record) ?
                            getFromStorage("userData") ? <Link className="btn btn-danger"
                                  to={`/purchase_batch/${record.id}/live_session/${detailId}`}>Book Now</Link> :
                                <GoogleWithLogin title="Book Now" icon={false} className={`btn-BookNow btn-danger-bookNow`} showModal = {() =>showModalGoogle()}/> :
                                <span className="view_session text-success font-weight-bold">registration for this batch has ended</span> :
                            <h6>Full</h6> : <h6>Registration Window Ended</h6> : <h6>No iterator found</h6>
                    }
                </>)
            }
        },
    ];

    const batchDetailTable = [];
    batchDetailTable.push({
        id: batchDetail.id,
        name: batchDetail.name || "-",
        seat: batchDetail.capacityOfSeats || 0,
        instructorId: batchDetail.instructorId || "-",
        bio: batchDetail.bio || "-",
        iterator: batchDetail.iterator,
        isValid: batchDetail.isValid,
        isBatchFull: batchDetail.batchIsFull,
        isCompleted: batchDetail.isCompleted,
        batchDescription: batchDetail.batchDescription,
        batchUrlName: batchDetail.batchUrlName
    });

    const expandedRowRender = (record) => {
        const IteratorColumns = [
            {title: 'Date', dataIndex: 'date', key: 'date'},
            {title: 'Time', dataIndex: 'duration', key: 'duration'},
            {
                title: 'Meet Link', dataIndex: 'meetLink', key: 'meetLink', render: (record) => (
                    record !== '' ?
                        <a href={record} className="googleMeetLink" target="_blank"><span>{record}</span></a> : '-'
                )
            }
        ];
        const iteratorData = [];
        batchIterator && batchIterator.length && batchIterator.forEach((item, i) => {
            if (record.id == item._id) {
                item && item.iterator && item.iterator.length && item.iterator.forEach((val, index) => {
                    iteratorData.push({
                        key: index + 1,
                        id: val._id || "-",
                        meetLink: val.meetLink || "",
                        date: val && moment(val.date).format("MMM DD, yyyy"),
                        duration: `${val.duration} ${val.timeZone}` || "-"
                    });
                });
            }
        });
        return <div className="col-sm-12 col-md-12">
            <Table
                columns={IteratorColumns}
                dataSource={iteratorData}
                pagination={false}
                showHeader={true}/>
        </div>;
    };

    const hendleSave = async() => {
        const sessionId = detailId;
        const userData = JSON.parse(localStorage.getItem("userData"))
        const data = {
            rating_user : userData.firstName + " "+ userData.lastName,
            rating_stars : reviewRating || 0,
            user : userData._id,
            livesession : sessionId
        };

        const reviewObj = {
            title : title,
            name : userData.firstName + " "+ userData.lastName,
            stars : reviewRating || 0,
            description :description,
            user : userData._id,
            email: userData.email || "",
            livesession: sessionId
        };
        const result = await userReview(reviewObj);
        if (result && result.success){
            await userRating(data);
            await getUsersRating();
            setTitle("");
            setDescription("");
            setReviewRating(0);
            setReviewFleg(!reviewFleg);
            handleClose()
        }

    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setReviewRating(0);
        setShow(false)
    };

    const handleShow = () => setShow(true);

    if (isLoading) return <Loader/>;
    return (
        <div className="session-details">
            <div className="main_div">
                <Header/>
            </div>
            {localStorage.getItem('userType') !== 'mentor' ?
                <div className="row details mt-2">
                    <div className="col-sm-12 col-md-8">
                        <div className="row">
                            <div className="col-md-6">
                                <div><h2 className="heading-title">{batchDetail?.batchDescription || "-"}</h2></div>
                                <div>
                                    <div className="description">
                                        <p>{batchDetail?.bio}</p>
                                    </div>
                                </div>
                                <div className="share">
                                    <div className="text-share">SHARE:</div>
                                    <a href={`https://api.whatsapp.com/send?text=Live Learning Session ${window.location.href}`}
                                       className='mr-15' target="_blank">
                                        <WhatsappIcon size={32} round/>
                                    </a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                                       className='mr-15' target="_blank">
                                        <FacebookIcon size={32} round/>
                                    </a>
                                    <a href={`http://www.twitter.com/share?url=${window.location.href}`}
                                       className='mr-15' target="_blank">
                                        <TwitterIcon size={32} round/>
                                    </a>
                                    <CopyToClipboard
                                        text={`http://localhost:3000/LiveSessions/${props && props.params && props.params.title}`}>
                                        <FileCopyOutlinedIcon className="copyBtn"/>
                                    </CopyToClipboard>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <img className="banner-img" src={Programming} alt="" height={100} width={100}/>
                            </div>
                        </div>

                        <div className="row upcoming-batch">
                            <div className="col-sm-12 col-md-12">
                                <Table
                                    columns={columns}
                                    dataSource={batchDetailTable || []}
                                    expandable={{expandedRowRender: record => expandedRowRender(record)}}
                                    pagination={false}
                                    showHeader={true}
                                />
                            </div>
                        </div>

                        <div className="row upcoming-batch">
                            <div className="col-sm-12 col-md-12">
                                <h1>Session Review</h1>
                                <button className="btn btn-danger ml-1" onClick={handleShow}>Add My Review for this
                                    Session
                                </button>
                                {reviews && reviews.length > 0 && reviews.map(val => {
                                    return (<div className='reviews'>
                                        <Rate allowHalf disabled defaultValue={Number(val.stars)}/>
                                        <div
                                            className="review-head">by {val.name} {moment(val.date).format("MMM DD, yyyy")}</div>
                                        <div>{val.description}</div>
                                        <hr className="mt-10"/>
                                    </div>)
                                })
                                }
                            </div>
                        </div>
                    </div>
                </div> : <h3 className="text-center statement">Hii</h3>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Ratings</label><br/>
                            <Rate allowHalf defaultValue={0} value={reviewRating || 0}  onChange={(e)=> setReviewRating(e)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea className="form-control mr-3 border-right-px" value={description}  onChange={e => setDescription(e.target.value)} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={hendleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="popup">
                {localStorage.getItem("isVisible") && <UserModal visible={visible}
                                                                 handleCancel={() =>handleCancelGoogle()}
                                                                 mentorLogin={() =>mentorLogin()}
                                                                 userLogin={() =>userLogin()}
                />}
            </div>
        </div>
    )
};

export default BatchDetail;
