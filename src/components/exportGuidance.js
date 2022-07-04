import React, {useEffect, useState} from 'react';
import Header from "./login/header";
import {getExportGuidance, createExportGuidanceSubscriber} from "./utils/_data";
import {Button, Card, Table, Alert} from "antd";
import {toast} from "react-toastify";
import moment from 'moment-timezone';
import img from "../images/programming.jpg"
import Loader from "./common/Loader";
import expertGuidanceImage from "../images/ExpertGuidance.jpg"
import "../styles/exportGuidance.css"

const ExportGuidance = () => {

    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);
    const [exportGuidance, setExportGuidance] = useState([]);

    useEffect(() => {
        getAllExportGuidance()
    }, []);

    const getAllExportGuidance = async () => {
        setLoading(true);
        const response = await getExportGuidance();
        if (response && response.data) {
            setExportGuidance(response.data.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const onGetGuidance = async (item) => {
        let userId = localStorage.getItem('id');
        let user = JSON.parse(localStorage.getItem('userData'));
        const userEmail = user.email;
        const obj = {
            userId: userId,
            userEmail: userEmail,
            exportGuidanceId: item._id,
            registerDate: moment(new Date()).format("MM-DD-YY")
        };
        setLoading(true);
        const response = await createExportGuidanceSubscriber(obj);
        if (response?.data?.status) {
            alert('Successfully added you to the guidance list for this topic. Look out for email for further instructions')
            toast.success("successfully created", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
        } else {
            toast.warn("You are already In Guidance List", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
        }
    };

    const showMoreDesc = () =>{
        setShowMore(!showMore);
    };


    if (loading) return <Loader/>;
    return (
        <div className="fullPage">
            <div className="main_div">
                <Header/>
            </div>
            <div className="container">
                <div className="d-flex" style={{justifyContent: "center"}}>
                    <img src={expertGuidanceImage} alt="expertGuidanceImage"/>
                </div>
                {
                    exportGuidance && exportGuidance.map((item, index) => (
                        <div>
                        <div key={index}>
                          <div key={index} >
                                <Card style={{marginTop: "15px", marginBottom: "15px"}}>
                                    <div className="d-flex" style={{justifyContent: "center"}}>
                                        <div style={{width: "400px", height: "250px"}}>
                                            <img src={item?.exportGuidanceImageUrl} width={'100%'} height={"100%"} alt={'image_logo'}/>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="d-flex" style={{justifyContent: "center"}}>
                                        <p><h2>{item?.exportGuidanceTitle}</h2></p>
                                    </div>
                                    <div className="d-flex" style={{justifyContent: "center"}}>
                                        <p>{(showMore && item && item.exportGuidanceDescription && item.exportGuidanceDescription.length >= 500) ?
                                            <>
                                                <div
                                                    dangerouslySetInnerHTML={{__html: item?.exportGuidanceDescription?.slice(0, 500)}}/>
                                            </> :
                                            <div dangerouslySetInnerHTML={{__html: item?.exportGuidanceDescription}}/>}
                                        </p>
                                    </div>
                                    <div>
                                        {(item && item.exportGuidanceDescription && item.exportGuidanceDescription.length >= 600) && (<a
                                            style={{ color: "blue", cursor: "pointer", display: "flex", justifyContent: "flex-end" }}
                                            onClick={showMoreDesc}
                                        >
                                            {showMore ? 'Show More': 'Show Less'}
                                        </a>)}
                                    </div>

                                    <div className="d-flex w-100"
                                         style={{direction: "row", gap: "10px", justifyContent: "center"}}>
                                        <div>
                                            <Button onClick={() => onGetGuidance(item)}>Get Free Guidance</Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
};

export default ExportGuidance;
