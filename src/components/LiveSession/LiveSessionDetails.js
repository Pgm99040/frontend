import React, {useEffect, useState, useRef} from "react";
import { Link, useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';
import Helmet from "react-helmet";
import Header from "../login/header";
import Programming from '../../images/programming.jpg';
import {Rate, Collapse, Table, Tabs, Input} from "antd";
import {Modal, Button,Form} from 'react-bootstrap'
// import moment from 'moment';
import moment from "moment-timezone";
import PersonIcon from '@material-ui/icons/Person';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Loader from "../common/Loader";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
    getSessionDetails,
    userRating,
    getuserRating,
    userReview,
    bookSession,
    getAllBookSession,
    getIteratorByBatch,
    getBatchesList, purchaseBatches, becomeMentor
} from '../utils/_data';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    WhatsappIcon,
    FacebookIcon,
    TwitterIcon,
} from "react-share";
import "../../styles/live-session.css"
import {getFromStorage} from "../../config/common";
import Head from "../head";
import GoogleWithLogin from "../login/GoogleWithLogin";
import UserModal from "../login/UserModal";
let displayMentorDashboard =false;
let displayMenteeDashboard = false;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Search } = Input;
const LiveSessionDetails = (props) =>{
    const history = useHistory();
    const params = useParams();
    const [booking, setBooking] = useState([]);
    const [batches, setBatches] = useState([]);
    const [batchesDuplicate, setBatchesDuplicate] = useState([]);
    const [details, setSessionDetails] = useState({});
    const [rating, setRating] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [totalRating, setTotalRating] = useState(0);
    const [reviewRating, setReviewRating] = useState(0);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [reviews, setReviews] = useState([]);
    const [comingSoon, setComingSoon] = useState({});
    const [bookBatch, setBookBatch] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [reviewsLengthArray, setReviewsLengthArray] = useState([]);
    const [reviewFleg , setReviewFleg] = useState(false);
    const [batchId, setBatchId] = useState("");
    const [expandedBatchRowKey, setBatchExpand] = useState([]);
    const [iterateData, setIterateData] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [isModel, setIsModel] = useState(false);
    const [visible, setVisible] = useState(false);
    const mounted = useRef();
    const userDetails = getFromStorage("userData") ? JSON.parse(getFromStorage("userData")) : {};
    useEffect( () =>{
        console.log("history, params", history, params);
        const title = params && params.title;
        const sessionData = history && history.location && history.location.state && history.location.state.data;
        if (title !== "" || title !== null) {
            showBatch(title, sessionData._id);
            getSortByBatch(title);
            // bookSessions(sessionData._id);
        };
        // if (sessionData) {
        //     sessionDetails(sessionData._id);
        // }
    }, []);

    useEffect(() =>{
        getAllBookBatch();
        getInstructor();
    }, []);

    useEffect(()=>{
        getUsersRating();
    },[rating,avgRating,totalRating,reviewFleg]);

    useEffect(() =>{
        const current = upComingBatchOrNot(batches);
        setComingSoon(current[0] || {});
    }, [batches]);
    const showMoreDesc = () =>{
        setShowMore(!showMore);
    };

    const getUsersRating = async () =>{
        const sessionId = details._id;
        let reviewList = [];
        const userData = JSON.parse(localStorage.getItem("userData"))
        setIsLoading(true);
        const result = await getuserRating(sessionId)
        if (result && result.data&& result.data.all_reviews){
            setIsLoading(false);
            setAvgRating(result && result.data&& result.data.response && result.data.response[0] && Number((result.data.response[0].average_rating).toFixed(1)));
            setTotalRating(result && result.data&& result.data.total_rating);
            // setReviews(result && result.data&& result.data.all_reviews);
            const filter = result && result.data && result.data.all_reviews && result.data.all_reviews.filter(item => item.email === userData.email);
            if (filter.length > 0){
                result && result.data && result.data.all_reviews.unshift(filter[0]);
                reviewList = result && result.data && result.data.all_reviews && [...new Set(result && result.data && result.data.all_reviews)];
            } else {
                reviewList = result && result.data && result.data.all_reviews;
            }
            setReviews(reviewList);
        }
        const slicrArray = result && result.data && result.data.all_reviews && result.data.all_reviews.slice(0,4);
        setReviewsLengthArray(slicrArray)
    };


    const sessionDetails = async (id) =>{
        // const userId = getFromStorage('id');
      const result = await getSessionDetails(id);
        console.log("qqqq--------->>>", result);
      if (result?.data?.success && result.data.response){
          setSessionDetails(result.data.response || {});
      }else {
          console.log("error");
      }
    };

    const getInstructor = async()=>{
        // const result = await getInstructors();
        // console.log("getInstructors--------->>>", result);
        // console.log("getsessions--------->>>", details);
        // let data = []
    }
    const getSortByBatch = async (title) =>{
        // let current = [];
        // let upcoming = [];
        // let delay = [];
        // const res = await getSortingBatch(title);
        // if (res?.data?.msg){
        //     let data = res && res.data && res.data.result && res.data.result[0];
        //     const d = new Date();
        //     const time = d.toLocaleTimeString();
        //     const date = d.toLocaleDateString();
        //     const startTime = moment(time, "HH:mm:ss a");
        //     var currentDay = moment().startOf('day');
        //     console.log("currentDay------>>>", currentDay);
        //     data && data.batches && data.batches.length && data.batches.map((item, i) =>{
        //         const sessionDate = moment(item.date, "YYYY-MM-DD");
        //         const utcDate = new Date(sessionDate).toUTCString();
        //         const todayDate = moment(date);
        //         const days = moment.duration(sessionDate.diff(currentDay)).asDays();
        //         // const days = sessionDateFormat.diff(todayDate, 'days');
        //         var endTime = moment(item.duration.split("-")[1], "HH:mm:ss a");
        //         var dur = moment.duration(endTime.diff(startTime));// duration in hours
        //         var hours = parseInt(dur.asHours());// duration in minutes
        //         var minutes = parseInt(dur.asMinutes())%60;
        //         if ((days > 0) || ((days === 0 && hours > 0) || (days === 0 && hours === 1 && minutes < 0))){
        //             item.isValid = true;
        //             if ((days === 0 && hours > 0) || (days === 0 && hours === 1 && minutes < 0)){
        //                 current.push(item)
        //             } else if(days > 0){
        //                 upcoming.push(item);
        //             }
        //         } else {
        //             item.isValid = false;
        //             delay.push(item);
        //         }
        //     });
        //     delay = delay.sort((a, b) =>{
        //         if (a.date === b.date){
        //             console.log("a, b",a.date === b.date,a.date, b.date);
        //             return b.date.localeCompare(a.date) && b.duration.localeCompare(a.duration)
        //         } else {
        //             return b.date.localeCompare(a.date)
        //         }
        //     });
        //     console.log("delay----------->>>", delay);
        //     const mergeArray = [...current, ...upcoming, ...delay];
        //     setBatches(mergeArray);
        // } else {
        //     console.log("error");
        // }
    };

    // const bookSessions = async (id) =>{
    //   const data = await purchaseBatches(id);
    //     console.log("data", data);
    // };
    const getAllBookBatch = async () =>{
        const data = await getAllBookSession();
        if (data && data.success){
            setBooking(data && data.data && data.data.response);
            console.log("data && data.data && data.data.response", data && data.data && data.data.response)
            if (batches && batches.length) {
               const record = data && data.data && data.data.response && data.data.response.length && data.data.response.filter(item => item._id == batches && batches[0]._id);
            }
        } else {
            console.log("error--------------->>")
        }
    };

    const getTimeDuration = (duration) =>{
        // start time and end time
        var startTime = moment(duration.split("-")[0], "HH:mm:ss a");
        var endTime = moment(duration.split("-")[1], "HH:mm:ss a");
        // calculate total duration
        var dur = moment.duration(endTime.diff(startTime));// duration in hours
        var hours = parseInt(dur.asHours());// duration in minutes
        var minutes = parseInt(dur.asMinutes())%60;
        return `${hours}:${minutes}`;
    };

    const handleRating =async (e) => {
        setRating(e);
        const sessionId = details._id;
        const userData = JSON.parse(localStorage.getItem("userData"))
        const data = {
            rating_user : userData.firstName + " "+ userData.lastName,
            rating_stars : e,
            user : userData._id,
            livesession : sessionId
        };
        console.log("data", data);
        const result = await userRating(data);
        if (result && result.success){
            // await getUsersRating();
            console.log("success");
        } else {
            console.log("error");
        }
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setReviewRating(0);
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const handleCloseModal = () => {
        setUserName("");
        setEmail("");
        setShowModal(false);
    };
    const handleShowModal = (batchId) => {
        setBatchId(batchId);
        setShowModal(true);
    };

    const hendleSave = async() => {
        const sessionId = details._id;
        const userData = JSON.parse(localStorage.getItem("userData"))
        const data = {
            rating_user : userData.firstName + " "+ userData.lastName,
            rating_stars : reviewRating || 0,
            user : userData._id,
            livesession : sessionId
        };
        console.log("data", data);

        const reviewObj = {
            title : title,
            name : userData.firstName + " "+ userData.lastName,
            stars : reviewRating || 0,
            description :description,
            user : userData._id,
            email: userData.email || "",
            livesession: sessionId
        };
        console.log("reviewObj",reviewObj);
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

    const hendleSaveModal = async() => {
        const sessionId = details._id;
        const bookSessionObj = {
            LiveSessionId : sessionId,
            BatchId : batchId,
            username : username,
            email :email,
            bookingTransactionId : null,
        }
        console.log("batch",details.batches[0]._id);

        const result = await bookSession(bookSessionObj);
        if (result && result.success){
            console.log("success");
        } else {
            console.log("error");
        }
        setUserName("");
        setEmail("");
        handleCloseModal()
    };
    const showBatch = async (i, id) => {
        console.log("i", i);
        const d = new Date();
        const date = moment(d).toString();
        const payload = {
            location: moment.tz.guess() || "",
            liveSessionId: id,
            date
        };
        // const res = await getBatches(i);
        const result = await getBatchesList(payload);
        if (result && result.data && result.data.success) {
            const data = result?.data?.result[0]?.batches || [];
            const current = upComingBatchOrNot(data);
            console.log("current", data, current)
            setSessionDetails(result?.data?.result[0]);
            setBatches(result?.data?.result[0]?.batches || []);
            setBatchesDuplicate(result?.data?.result[0]?.batches || []);
            // setBatches(current && current[0] && current[0].batches || []);
            setComingSoon(current[0] || {});
        } else {
            console.log("error----->>>");
        }
    };

    const upComingBatchOrNot = (batches) =>{
        let current = [];
       batches && batches.length && batches.map(item =>{
            item && item.iterator && item.iterator.map(iterator =>{
                const d = new Date();
                console.log("date---------------", d)
                const time = d.toLocaleTimeString();
                const date = d.toLocaleDateString();
                const startTime = moment(time, "HH:mm:ss a");
                var currentDay = moment(new Date());
                const sessionDate = moment(iterator.date);
                const days = moment.duration(sessionDate.diff(currentDay)).asDays();
                var endTime = moment(iterator.duration.split("-")[0], "HH:mm:ss a");
                var dur = moment.duration(endTime.diff(startTime));// duration in hours
                var hours = parseInt(dur.asHours());// duration in minutes
                var minutes = parseInt(dur.asMinutes())%60;
                console.log("hh,mm,dd", hours, minutes, days);
                if ((days > 0) || ((days === 0 && hours > 0) || (days === 0 && hours === 1 && minutes < 0))) {
                    item.isValid = true;
                    if (days > 0 || (days === 0 && hours > 0) || (days === 0 && hours === 1 && minutes < 0)) {
                        current.push(item);
                    }
                }
            })
        });
        return current
        // console.log("current, upcoming" ,current, upcoming)
    };

    const timeFiltering = (data) =>{
        let upcoming = [];
        let noIterators = [];
        let delay = [];
        const d = new Date();
        const time = d.toLocaleTimeString();
        const todayDate = d.toUTCString().slice(0, 16);
        const startTime = moment(time, "HH:mm:ss a");
        // const momentTime = moment(d);
        // console.log("data---------=====>>>",momentTime);
        data && data.length > 0 && data.map(item =>{
            item && item.iterators && item.iterators.map(iterator =>{
                // const localtz = moment.tz.guess();
                const dbDate = (iterator && iterator.date).slice(0, 16);
                console.log("---->>>>", todayDate <= dbDate);
                var endTime = moment(iterator && iterator.duration && iterator.duration.split("-")[1], "HH:mm:ss a");
                var dur = moment.duration(endTime.diff(startTime));// duration in hours
                var hours = parseInt(dur.asHours());// duration in minutes
                var minutes = parseInt(dur.asMinutes())%60;
                if ((moment(todayDate) <= moment(dbDate)) && (hours >= 0)){
                    const upCommings = upcoming.filter(val =>val._id === iterator._id);
                    if (upCommings.length === 0) {
                        item.isValid = true;
                        upcoming.push(item)
                    }
                }
                if (moment(todayDate) < moment(dbDate)){
                    const upCommings = upcoming.filter(val =>val._id === iterator._id);
                    console.log("today above----->>>>", );
                    if (upCommings.length === 0) {
                        item.isValid = true;
                        upcoming.push(item)
                    }
                }
                if((moment(todayDate) > moment(dbDate)) || hours < 0){
                    const upCommings = delay.filter(val =>val._id === iterator._id);
                    if (upCommings.length === 0) {
                        item.isValid = false;
                        delay.push(item);
                    }
                }
            });
            if (item?.iterators?.length === 0) {
                noIterators.push(item);
            }
        });
        console.log("")
        // upcoming = upcoming && upcoming.iterators && upcoming.iterators.length && upcoming.iterators.sort((a, b) =>{
        //     if (a.date === b.date){
        //         console.log("a, b",a.date === b.date,a, b);
        //         return b.date.localeCompare(a.date) && b.duration.localeCompare(a.duration)
        //     } else {
        //         return b.date.localeCompare(a.date)
        //     }
        // });
        return [...upcoming, ...delay, ...noIterators]
    };


    const getAllIteratorByBatch = async (id) =>{
        const res = await getIteratorByBatch(id);
        if (res?.data?.msg === "success"){
            setIterateData(res.data.response);
        } else {
            console.log("error------>>>");
        }
        console.log("getAllIteratorByBatch----->>", res);
    };

    const header = (item) => {
        const filterList = booking && booking.length && booking.filter(val => val.BatchId === item.user._id);
        return (
            <div className="collapse-header row">
                <div className="col-sm-12 col-md-2"><p><b>{item?.user?.name || "-"}</b></p></div>
                <div className="col-sm-12 col-md-6"><p>{item?.user?.bio || "-"}</p></div>
                <div className="col-sm-12 col-md-2"><p>Session({item.batches.length || 0})</p></div>
                <div className="col-sm-12 col-md-2 booked">
                    {filterList && filterList.length ? <h6 className="text-success py-5">Booked</h6> : <Link className="btn btn-danger" to={`/purchase_batch/${item?.user?._id}/live_session/${details._id}`}>Book Now</Link>}</div>
            </div>
        )
    };

    // const activeCollapse = (key) =>{
    //     console.log("key----->>>", key);
    // };

    const onSearch = () =>{
        let filterList = [];
        var searchKey = document.getElementById('searchKey').value;
        console.log("searchKey", typeof searchKey)
        let batchesList = batchesDuplicate || [];
        if (searchKey !== ""){
            const searchString = searchKey.toLowerCase();
            batchesList = batchesList.filter(character => {
                console.log("character.isBatchFull",character)
                if ((character.name.toLowerCase().includes(searchString) || character.iterator.every(ele => ele && moment(ele.date).format("MMM DD, yyyy").toLowerCase().includes(searchString))) && !character.batchIsFull) return true;
                else return false;
            });
        }
        setBatches(batchesList);
    };

    const bookSessionORNOt = (data) =>{
        const filterList = booking && booking.length && booking.filter(val => {
            if ((val.BatchId === (data && data._id)) && val.email === userDetails?.email){
                return true;
            }
        });
        return filterList
    };

    const isBookOrNot = (data) => {
            const value = moment(new Date()).format("MM DD YY");
            return (data?.iterator?.find(item => {return (moment(item.date).format("MM DD YY")) === value}) || []).length > 0;
    };

    const date = moment(new Date()).format('MMM DD YYYY h:mm a');
    const columns = [
        // { title: 'Date', dataIndex: 'date', key: 'date' },
        // {
        //     title: 'Batch',
        //     key: 'batch',
        //     dataIndex: 'batch',
        //     render: (item, record, index) =>{
        //         return <h6>{`Batch ${index + 1}`}</h6>
        //     }
        // },
        {
            title: 'Batch URL Name',
            dataIndex: '',
            key: '',
            width: 300,
            render: (record, index) => (
                <Link to={{pathname: `/LiveSessions/${props?.location?.state?.data?.slug}/${record?.batchUrlName}`, state: {data: record, id: details?._id, batch: batches}}}><span>{record?.batchUrlName}</span></Link>
            )
        },
        {title: 'Batch Name', dataIndex: 'batchDescription', key: 'batchDescription'},
        {title: 'Batch Instructor', dataIndex: 'name', key: 'name'},
        // {
        //     title: 'Seat',
        //     key: 'seat',
        //     dataIndex: 'seat',
        //     render: (index, record) =>{
        //         return <h6>{record.isBatchFull ? 'No seats available' : record.seat}</h6>
        //     }
        // },
        {title: 'Batch Instructor Bio', dataIndex: 'bio', key: 'bio', ellipsis: true},
        // {title: 'Description', dataIndex: 'batchDescription', key: 'batchDescription', width: "500px"},
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            render: (index, record) => {
                const filterList = booking && booking.length && booking.filter(val => {
                    if ((val.BatchId === record.id) && val.email === userDetails?.email){
                        return true;
                    }
                });
              return ( <>
                    {
                        (record && record.iterator && record.iterator.length > 0) ? !moment(record.iterator[0].date).isBefore(date) ? record.seat !== 0 ? filterList && filterList.length ? <h6 className="text-success py-5">Booked</h6> :
                            isBookOrNot(batches && batches[0]) ?
                            getFromStorage("userData") ? <Link className="btn btn-danger"
                                  to={`/purchase_batch/${record.id}/live_session/${details._id}`}>Book Now</Link> :
                                <GoogleWithLogin title="Book Now" icon={false} className={`btn-BookNow btn-danger-bookNow`} showModal = {() =>showModalGoogle()}/> :
                                <span className="view_session text-success font-weight-bold">registration for this batch has ended</span>
                            : <h6>Full</h6>:<h6>Registration Window Ended</h6> : <h6>No iterator found</h6>
                    }
                </>)
            }
        },
    ];
    const batchesItem = [];
    batches && batches.length && batches.forEach((item, i) => {
        batchesItem.push({
            key: i + 1,
            id: item._id,
            name: item.name || "-",
            seat: item.capacityOfSeats || 0,
            instructorId: item.instructorId || "-",
            bio: item.bio || "-",
            iterator: item.iterator,
            isValid: item.isValid,
            isBatchFull: item.batchIsFull,
            isCompleted: item.isCompleted,
            batchDescription: item.batchDescription,
            batchUrlName: item.batchUrlName
        })
    });
    const expandedRowRender = (record) =>{
        const IteratorColumns = [
            {title: 'Date', dataIndex: 'date', key: 'date'},
            {title: 'Time', dataIndex: 'duration', key: 'duration'},
            {title: 'Meet Link', dataIndex: 'meetLink', key: 'meetLink', render: (record) =>(
                    record !== '' ? <a href={record} className="googleMeetLink" target="_blank"><span>{record}</span></a> : '-'
                )}
        ];
        const iteratorData = [];
        batches && batches.length && batches.forEach((item, i) => {
            if (record.id == item._id) {
                item && item.iterator && item.iterator.length && item.iterator.forEach((val, index) =>{
                    iteratorData.push({
                        key: index + 1,
                        id: val._id || "-",
                        meetLink: val.meetLink || "",
                        date: val && moment(val.date).format("MMM DD, yyyy"),
                        duration: `${val.duration} ${val.timeZone}`  || "-"
                    });
                });
            }
        });


        // iterateData && iterateData.length && iterateData.map((item, i) =>{
        //     iteratorData.push({
        //         key: i + 1,
        //         id: item._id || "-",
        //         meetLink: item.meetLink || "-",
        //         date: item && moment(item.date).format("MMM DD, yyyy"),
        //         duration: `${item.duration || "-"} (${item.timeZone || "-"})`
        //     })
        // });
        return <div className="col-sm-12 col-md-12">
            <Table
                columns={IteratorColumns}
                dataSource={iteratorData}
                pagination={false}
                showHeader={true}/>
        </div>;
    };

    const batchFetchData = async (expanded, record) =>{
        let keys = [];
        if (expanded){
            await getAllIteratorByBatch(record.id);
            keys.push(record.key)
        }
        setBatchExpand(keys);
    };

    const handleChange = (key) =>{
        // getAllActiveDetails();
    };

    const onBatchModel = () => {
        setIsModel(true)
    };

    const handleOk = () => {
        setIsModel(false);
    };

    const handleCancel = () => {
        setIsModel(false);
    };

    const findBatchDateAndTime = () => {
        let date = new Date()
        const data = []
        details && details.batches && details.batches.forEach(item => (
            item && item.iterator && item.iterator.forEach(item1 => {
                const x = moment(item1.date).isSameOrAfter(moment(date));
                if(x){
                    const obj = item1.date + " " + (item1.timeZone)
                    data.push(obj)
                }
            })
        ))

        return data
    };

    const getIteration = () => {
        let date = new Date()
        const data = [];
        details && details.batches && details.batches.forEach(item => (
            item && item.iterator && item.iterator.forEach(item1 => {
                const x = moment(item1.date).isSameOrAfter(moment(date));
                if(x){
                    data.push(item1)
                }
            })
        ));
        return data
    };

    const getDateForUpComing = () => {
        let dates = [];
        comingSoon.iterator.forEach(item => {
            dates.push(item.date)
        });
        const data = (dates[0])
        const isPast = moment(data, 'MMM DD YYYY h:mm a').isSameOrBefore(moment(new Date()).utc(true).format('MMM DD YYYY h:mm a'));
        if (isPast) {
            return 'Coming Soon!'
        } else {
            return (moment(comingSoon && comingSoon.iterator && comingSoon.iterator[0] && comingSoon.iterator[0].date).format("MMM DD, yyyy") || "-")
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

    if (isLoading) return <Loader/>;
    return(
        <div className="session-details">
            <Helmet>
                <meta property="og:title" content={`${details.title}`} />
                <meta property="og:image" content={`${Programming}`} />
            </Helmet>
            <Modal show={isModel} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Batches List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        findBatchDateAndTime().map((item, index) => (
                            <div>{item}</div>
                        ))
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleOk}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="main_div">
                <Header />
            </div>
           {localStorage.getItem('userType') !==('mentor' || undefined) ?
               <div className="row details mt-2">
                <div className="col-sm-12 col-md-8">
                    <div className="row">
                        <div className="col-md-6">
                            <div><h2 className="heading-title">{details.title || "-"}</h2></div>
                            <div>
                                <div className="description">
                                    <p>{(showMore && details && details.description && details.description.length >= 600) ? `${details && details.description && details.description.slice(0, 600)}${details && details.description && details.description.length >= 600 &&'...'} ` : details && details.description}</p>
                                </div>
                                {(details && details.description && details.description.length >= 600) && (<a
                                    style={{ color: "blue", cursor: "pointer", display: "flex", justifyContent: "flex-end" }}
                                    onClick={showMoreDesc}
                                >
                                    {showMore ? 'Show More': 'Show Less'}
                                </a>)}
                            </div>

                            <div className="row date-and-rating">
                                <div className="date col-sm-12 col-md-6">
                                    <div className="date-no">
                                        <b>Batch Starting</b>
                                        {/*<p>{batches && batches[0] && batches[0].iterator && batches[0].iterator[0] && batches[0].iterator[0].date ? (moment(batches && batches[0] && batches[0].iterator && batches[0].iterator[0] && batches[0].iterator[0].date).format("MMM DD, yyyy") || "-") : "Coming Soon!"}</p>*/}
                                        <p>{comingSoon && comingSoon.iterator && comingSoon.iterator[0] && comingSoon.iterator[0].date ? getDateForUpComing() : "Coming Soon!"}</p>
                                        {
                                            !comingSoon && comingSoon.iterator && comingSoon.iterator[0] && comingSoon.iterator[0].date &&
                                                <>
                                                    <b>Number of Classes</b>
                                                    <p  style={{ color: "blue", cursor: "pointer"}} onClick={onBatchModel}>{details && details.batches && getIteration().length}</p>
                                                </>
                                        }
                                        <b>Language of instruction</b>
                                        <p>{details.LanguageOfInstruction || ""}</p>
                                    </div>
                                    {/*<div className="calender">*/}
                                    {/*    <div*/}
                                    {/*        className="date-no">{(moment(batches && batches[0] && batches[0].date).format("MMM DD yyyy")).split(" ")[0]}</div>*/}
                                    {/*    <div className="simple">*/}
                                    {/*        <p>{(moment(batches && batches[0] && batches[0].date).format("MMM DD yyyy")).split(" ")[1]}</p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    {/*<div className="time">*/}
                                    {/*    <p>{batches && batches[0] && batches[0].duration && batches[0].duration.split("-")[0]}</p>*/}
                                    {/*    <span>({details && details.batches && details.batches.length} sessions)</span>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="rating col-sm-12 col-md-6">
                                    {
                                        !comingSoon && comingSoon.iterator && comingSoon.iterator[0] && comingSoon.iterator[0].date &&
                                        <>
                                            <div className="seat">
                                                <p>{`${(batches && batches[0] && batches[0].capacityOfSeats) > 0 ? `${batches && batches[0] && batches[0].capacityOfSeats} Seats left` : 'Full'}`}</p>
                                            </div>
                                        </>
                                    }
                                    <div className="rate">
                                        <span className="avg no-rate">{avgRating || 0}</span>
                                        <div><Rate allowHalf disabled defaultValue={0} value={avgRating || 0}
                                                   // onChange={(e) => handleRating(e)}
                                        /></div>
                                        <div><PersonIcon/><span
                                            className="font-weight-bold">{totalRating || 0} RATINGS</span></div>
                                    </div>
                                </div>

                            </div>
                            <div className="price-book row">
                                <div className="col-sm-6 col-md-6 currency">
                                    <p><span className="price-value">{`${details && details.price && Number(details.price).toFixed(2)} ${details.currencyCode || ""}`}</span></p>
                                </div>
                                <div className="col-sm-6 col-md-6 button-group">
                                    {
                                        Array.isArray(Object.keys(comingSoon || {})) && Object.keys(comingSoon || {}).length > 0 ? (bookSessionORNOt(batches && batches[0])?.length === 0 || bookSessionORNOt(batches && batches[0])?.length === undefined) ?
                                            isBookOrNot(batches && batches[0]) ?
                                            getFromStorage("userData") ?
                                            <Link className="btn btn-danger" to={`/purchase_batch/${batches && batches[0] && batches[0]._id}/live_session/${details._id}`}>Book Now</Link>:
                                                <GoogleWithLogin title="Book Now" icon={false} className={`btn-BookNow btn-danger-bookNow`} showModal = {() =>showModalGoogle()}/> :
                                                <span className="view_session text-success font-weight-bold">registration for this batch has ended</span>
                                            :
                                            <span className="view_session text-success font-weight-bold">Booked</span> : ""
                                    }
                                </div>
                            </div>
                            <div className="share">
                                <div className="text-share">SHARE: </div>
                                <a href={`https://api.whatsapp.com/send?text=Live Learning Session ${window.location.href}`} className='mr-15' target="_blank">
                                    <WhatsappIcon size={32} round />
                                </a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} className='mr-15' target="_blank">
                                    <FacebookIcon size={32} round />
                                </a>
                                <a href={`http://www.twitter.com/share?url=${window.location.href}`} className='mr-15' target="_blank">
                                    <TwitterIcon size={32} round />
                                </a>
                                {/*<div><TwitterIcon /></div>*/}
                                <CopyToClipboard text={`http://localhost:3000/LiveSessions/${props && props.params && props.params.title}`}>
                                    <FileCopyOutlinedIcon className="copyBtn"/>
                                </CopyToClipboard>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <img className="banner-img" src={details?.Thumbnail_ImageURL || Programming} alt="" height={100} width={100}/>
                        </div>
                    </div>

                    {/*<div className='row review'>*/}
                    {/*    <div className="col-sm-12 col-md-12">*/}
                    {/*    <h3 className="batch-heading">{reviews.length > 0 && "Reviews"}</h3><br /><br />*/}
                    {/*        {reviewsLength ?*/}
                    {/*            reviewsLengthArray && reviewsLengthArray.length > 0 && reviewsLengthArray.map(val => {*/}
                    {/*            return ( <div className='reviews'>*/}
                    {/*                <Rate allowHalf disabled  defaultValue={Number(val.stars)} />*/}
                    {/*                <div className="review-head">by {val.name} {moment(val.date).format("MMM DD, yyyy")}</div>*/}
                    {/*                <div>{val.description}</div>*/}
                    {/*                <hr className="mt-10"/>*/}
                    {/*            </div> )*/}
                    {/*        }) :*/}
                    {/*            reviews && reviews.map(val => {*/}
                    {/*            return ( <div className='reviews'>*/}
                    {/*                <Rate allowHalf disabled  defaultValue={Number(val.stars)}  />*/}
                    {/*                <div className="review-head">by {val.name} {moment(val.date).format("MMM DD, yyyy")}</div>*/}
                    {/*                <div>{val.description}</div>*/}
                    {/*                <hr className="mt-10"/>*/}
                    {/*            </div> )*/}
                    {/*        })*/}
                    {/*        }*/}

                    {/*        {reviews.length > 4 && <button className="btn btn-danger mb-15" onClick={()=> setReviewsLength(!reviewsLength)}>View all Reviews</button>}*/}

                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="row upcoming-batch">
                        <div className="col-sm-12 col-md-12">
                            {/*<h3 className="batch-heading">Upcoming Batches</h3><br/><br/>*/}
                            <div className="mb-15 batches">
                                {/*<div className="search-batch">*/}
                                {/*    /!*<Search placeholder="Search here..." onSearch={() =>onSearch()} style={{ width: 200 }} />*!/*/}
                                {/*    <form className="navbar-form" role="search" action='javascript:void(0)' onSubmit={()=>onSearch()}>*/}
                                {/*        <div className="input-group add-on">*/}
                                {/*            <input className="form-control" placeholder="Search" name="srch-term" id="searchKey" type="text" />*/}
                                {/*            <div className="input-group-btn">*/}
                                {/*                <button className="btn btn-default" type="submit"><i className="fa fa-search"></i></button>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    </form>*/}
                                {/*</div>*/}
                                <Tabs defaultActiveKey="1" onChange={key =>handleChange(key)}>
                                    <TabPane tab="Reviews" key="1">
                                        <button className="btn btn-danger ml-1" onClick={handleShow}>Add My Review for this Session</button>
                                        {reviews && reviews.length > 0 && reviews.map(val => {
                                            return ( <div className='reviews'>
                                                    <Rate allowHalf disabled  defaultValue={Number(val.stars)}  />
                                                    <div className="review-head">by {val.name} {moment(val.date).format("MMM DD, yyyy")}</div>
                                                    <div>{val.description}</div>
                                                    <hr className="mt-10"/>
                                                </div>)})
                                        }
                                        </TabPane>
                                    <TabPane tab="Upcoming Batches" key="2">
                                        <Table
                                            columns={columns}
                                            dataSource={batchesItem}
                                            // expandable={{
                                            //     expandedRowRender,
                                            //     onExpand: batchFetchData,
                                            //     expandedRowKeys: expandedBatchRowKey
                                            // }}
                                            expandable = {{expandedRowRender: record => expandedRowRender(record)}}
                                            pagination={false}
                                            showHeader={true}
                                        />
                                    </TabPane>
                                </Tabs>

                                {/*<div className="batches">*/}
                                {/*    {*/}
                                {/*        batchesList && batchesList.length && batchesList.map((item, i) => (*/}
                                {/*            <div key={i}>*/}
                                {/*                <h5 className="batch-title">Batch {i+1}</h5>*/}
                                {/*                <Collapse onChange={(key) => activeCollapse(key)}>*/}
                                {/*                    <Panel header={header(item)} key={i + 1}>*/}
                                {/*                        <table className="table">*/}
                                {/*                            <tbody>*/}
                                {/*                            {item && item.batches && item.batches.length && item.batches.map((batch, index) => (*/}
                                {/*                                <tr key={index}>*/}
                                {/*                                    <td>Iterate{index + 1}</td>*/}
                                {/*                                    <td>{moment(batch.date).format("MMM DD, yyyy")}</td>*/}
                                {/*                                    <td>{batch.duration}</td>*/}
                                {/*                                    <td>{getTimeDuration(batch.duration)} Hour</td>*/}
                                {/*                                </tr>*/}
                                {/*                            ))}*/}
                                {/*                            </tbody>*/}
                                {/*                        </table>*/}

                                {/*                    </Panel>*/}
                                {/*                </Collapse>*/}
                                {/*            </div>*/}
                                {/*        ))*/}
                                {/*    }*/}
                                {/*</div>*/}

                                {/*<div className="outer-table"><table className="table table-row-header text-secondary">*/}
                                {/*    <tbody>*/}
                                {/*    { batches && batches.length && batches.map((item, i) =>{*/}
                                {/*        const filterList = booking && booking.length && booking.filter(val => val.BatchId === item._id);*/}
                                {/*        return(<tr key={i}>*/}
                                {/*                <td>Session{i+1}</td>*/}
                                {/*                <td>{moment(item.date).format("MMM DD, yyyy")}</td>*/}
                                {/*                <td>{item.duration}</td>*/}
                                {/*                <td>{getTimeDuration(item.duration)} Hour</td>*/}
                                {/*                /!*<td><button className="btn btn-danger" onClick={() => handleShowModal(item._id)}>Book Now</button></td>*!/*/}
                                {/*                <td>{*/}
                                {/*                    item.isValid ? filterList && filterList.length ? <h6 className="text-success py-5">Booked</h6> :*/}
                                {/*                    <Link className="btn btn-danger" to={`/purchase_batch/${item._id}/live_session/${details._id}`}>Book Now</Link> : <h6 className="py-5">Session Delayed</h6>*/}
                                {/*                }</td>*/}
                                {/*            </tr>)})*/}
                                {/*    }*/}
                                {/*    </tbody>*/}
                                {/*</table></div>*/}
                            </div>
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
            {/*<Modal show={showModal} onHide={handleCloseModal}>*/}
            {/*    <Modal.Header closeButton>*/}
            {/*        <Modal.Title>Book Session</Modal.Title>*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body>*/}
            {/*        <form>*/}
            {/*            <div className="form-group">*/}
            {/*                <label htmlFor="username">Username</label>*/}
            {/*                <input type="text" className="form-control" value={username} onChange={e => setUserName(e.target.value)}/>*/}
            {/*            </div>*/}

            {/*            <div className="form-group">*/}
            {/*                <label htmlFor="email">Email</label>*/}
            {/*                <input type="text" className="form-control"  value={email}  onChange={e => setEmail(e.target.value)} />*/}
            {/*            </div>*/}
            {/*        </form>*/}
            {/*    </Modal.Body>*/}
            {/*    <Modal.Footer>*/}
            {/*        <Button variant="secondary" onClick={handleCloseModal}>*/}
            {/*            Close*/}
            {/*        </Button>*/}
            {/*        <Button variant="primary" onClick={hendleSaveModal}>*/}
            {/*            Save*/}
            {/*        </Button>*/}
            {/*    </Modal.Footer>*/}
            {/*</Modal>*/}
        </div>
    )
};
export default LiveSessionDetails;
