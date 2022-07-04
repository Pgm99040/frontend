import React, {useEffect, useState} from 'react';
import moment from "moment";
import Header from "./login/header";
import {Card} from "antd";
import {getAllFeed} from "./utils/_data";

const CodeFeed = () => {

    const [ loading, setLoading ] = useState(false);
    const [ feed, setFeed ] = useState([]);

    useEffect(()=>{
        getFeed()
    },[]);

    const getFeed = async () => {
        setLoading(true);
        const response = await getAllFeed();
        console.log("response",response)
        if(response && response.data){
            setFeed(response.data.data);
            setLoading(false);
        }else{
            setLoading(false);
        }
    };

    return(
        <div className="fullPage" >
            <div className="main_div">
                <Header />
            </div>
            <div className="col-sm-12 col-md-12">
                <div className="row add-task d-flex" style={{flexDirection: "column", gap: '30px', alignItems: "center"}}>
                    {
                        feed && feed.length ? feed.map((item, i) =>(
                            <div className="col-sm-12 col-xs-12 col-md-5" key={i}>
                                <Card
                                    style={{borderRadius: "10px"}}
                                    title={item?.feedContentSummary}
                                    cover={
                                        <img
                                            style={{height: 300}}
                                            alt="example"
                                            src={item?.feedImageUrl}
                                            // src='https://s3.amazonaws.com/klockerimg/KB/Joins+in+SQL.jpg'
                                        />
                                    }
                                >
                                    <div>
                                        <h3>{item?.feedTitle}</h3>
                                        <span>Created At : {moment(item?.createdAt).format("MMMM DD YYYY")}</span><br/>
                                        <span>Link Url : {item?.feedLinkUrl}</span>
                                    </div>
                                </Card>
                            </div>
                        )) : <div className=" col-sm-12 col-md-12"><h4 className="text-center">Records not found</h4></div>
                    }
                </div>
            </div>
        </div>
    )
};

export default CodeFeed;
