import React, {useEffect, useState} from 'react';
import Header from "./login/header";
import Loader from "./common/Loader";
import {getAllActiveMentors} from "./utils/_data";

const Mentor = () => {

    const [loading, setLoading] = useState(false);
    const [mentorsActive, setMentorsActive] = useState([]);

    useEffect(()=>{
        getAllMentorList()
    },[]);

    const getAllMentorList = async () => {
        setLoading(true);
        const response = await getAllActiveMentors();
        if (response && response.success) {
            setMentorsActive(response.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };
    if (loading) return <Loader/>;
    return(
        <div>
            <div className="main_div">
                <Header/>
            </div>
            <div>
                {
                    mentorsActive && mentorsActive.map(item => (
                        <div className="container d-flex" style={{padding: '10px', width: '50%', justifyContent: "center"}}>
                            <div>
                                <img src={item.imageUrl} width={120} height={120} alt="profile Picture"/>
                            </div>
                            <div className="container-right" style={{display : "flex",flexDirection: "column", padding:"8px"}}>
                                <div><b>Mentor Name</b> : {item.user.firstName + " " + item.user.lastName}</div>
                                <div><b>Mentor Bio</b> : {item.mentorBio}</div>
                                <div><b>Mentor Position</b> : {item.currentPosition}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
};

export default Mentor;

