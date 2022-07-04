import React, {useEffect, useState} from 'react';
import moment from "moment";
import Header from "./login/header";
import {Card} from "antd";
import {getCodecast} from "./utils/_data";
import Loader from "./common/Loader";
import Flip_Image from "../images/Flip_Image.jpg"
import '../styles/CodeDemoCast.css'

const CodeCast = () => {

    const [ loading, setLoading ] = useState(false);
    const [ code, setCode ] = useState([]);
    const [mediaId,setMediaId] =useState('')
    const [classtog,setClasstog] =useState(false)


    useEffect(()=>{
        getCode()
    },[]);

    const getCode = async () => {
        setLoading(true);
        const response = await getCodecast();
        console.log("response",response)
        if(response && response.data){
            setCode(response.data.data);
            setLoading(false);
        }else{
            setLoading(false);
        }
    };


    return(
        <>
            <div className="main_div">
                <Header />
            </div>
            {
                code && code.length ? code.map((item, i) => (<>
                        <div className={`product ${classtog && mediaId===item._id ? 'flip' : ''}`}>
                            <div className="fornt">
                                <div className="img-wrap">
                                    <h4>{item?.codeCastTitle} <img
                                        style={{height: 50,borderRadius: "50%",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",margin:"0px 10px 10px 10px",cursor:"pointer",width:'auto',float: 'right'}}
                                        alt="example"
                                        src={Flip_Image}
                                        onClick={() => (setClasstog(!classtog)||setMediaId(item?._id))}
                                        id={item._id}
                                    /></h4>

                                    <img
                                        src={item?.codeCastImage}
                                        alt="mac air"/>
                                </div>
                                <div className="description clearfix">
                                    <div className="content">
                                        <span>{moment(item?.createdAt).format("MMMM DD YYYY")}</span><br/><br/>
                                        <h5 className="task_category mb-3">CodeCast Level : {item?.codeCastLevel}</h5><br/>
                                        <h5 className="task_category mb-3">Category : {item?.category.name}</h5><br/>
                                        <h5 className="task_category mb-3">Sub Category : {item?.subCategory?.name||""}</h5>&nbsp;<br/>
                                        <h5 className="task_category mb-3">CodeCast discription :<h5> <p className="task_description" dangerouslySetInnerHTML={{__html: item?.discription || "-"}}/></h5></h5><br/>
                                    </div>
                                </div>
                            </div>
                                <div className="back">
                                    <div className="img-wrap">
                                        <img
                                            style={{height: 50,borderRadius: "50%",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",margin:"10px",cursor:"pointer",width:'auto'}}
                                            alt="example"
                                            src={Flip_Image}
                                            onClick={() => (setClasstog(!classtog))}
                                            id={item._id}
                                        />
                                        <iframe width="420" height="315" src={item && item.mediaEmbed} title="Media Link"/><br/>
                                        <p className="task_description"
                                           dangerouslySetInnerHTML={{__html: item?.codeCastFlipPageContent || "-"}}/><br/>
                                    </div>
                                    <div className="description clearfix">
                                    </div>
                                </div>


                        </div>
                    </>
                )): <div className=" col-sm-12 col-md-12"><h4 className="text-center">Records not found</h4></div>
            }
        </>
    )
};

export default CodeCast;
