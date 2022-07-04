import React, {useEffect, useState} from 'react';
import moment from "moment";
import Header from "./login/header";
import {Card} from 'antd';
import "../styles/blog_detail.css"
import {getBlog, getBlogInfo, updateCommentForBlog} from "./utils/_data";
import {  Tag } from 'antd';


const BlogDetail = (props) => {

    const [blogId, setBlogId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [blogDetail, setBlogDetail] = useState({});
    const [commit, setCommit] = useState(false);

    useEffect(() => {
        console.log('props',props)

        const data = props?.location?.state?.data;
        const id = data?._id;
        setBlogId(id);
        getBlogDetail(id)
    }, []);

    const getBlogDetail = async (id) => {
        if(props?.location?.state?.data?._id) {
            setLoading(true);
            const response = await getBlogInfo(id);
            if (response && response.data && response.data.success) {
                setBlogDetail(response.data.data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }else {
            setLoading(true);
            const response = await getBlog();
            if (response && response.data) {
                const blog=response.data.data;
                const filterBlog=blog.filter((item)=>(item.blogTitleForURL==props?.match?.params?.blogName))
                setBlogDetail(filterBlog[0])
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    const handleClick = async () => {
        const message = document.getElementById('message').value.replace(/\n/g, '<br>');
        const anonymous = document.getElementById('anon').value;
        let data = {};
        if(anonymous === "anonymous"){
            data.message = message;
            data.name = "Anonymous"
        }else {
            data.message = message;
            const name = JSON.parse(localStorage.getItem("userData"))
            data.name = name.firstName + " " + name.lastName
        }
        setLoading(true);
        const id = blogDetail._id;
        const response = await updateCommentForBlog(id,data);
        if (response && response.data) {
            getBlogDetail(blogId);
            setLoading(false);
        } else {
            setLoading(false);
        }

        document.getElementById('message').value='';
    };

    const onHandaleCommit=()=>{
        setCommit(!commit)
    }

    return (
        <>
            <div className="fullPage">
                <div className="main_div">
                    <Header/>
                </div>
                {
                    blogDetail?._id ?
                        <div className="container">
                            <div className="col-md-12 col-sm-12 col-xs-12 tutorial_content">
                                <h3 className="article_innercont">{blogDetail?.blogTitle}</h3>
                                <p className="article_innercontwrap"><i className="fa fa-circle dotart" aria-hidden="true"></i>
                                    <i>{moment(blogDetail?.createdAt).format("MMMM DD YYYY")}</i></p>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 sec_main">

                                <div
                                    dangerouslySetInnerHTML={{__html: blogDetail?.blogContent}}>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-12 sec_main">
                                    <Tag color={'geekblue'} key={blogDetail.blogTags}>
                                        {blogDetail.blogTags.toUpperCase()}
                                    </Tag>
                                </div>
                                {/*<div className="col-md-3 col-sm-3 col-xs-12 side_sec">*/}
                                {/*    <p className="art_spon">Sponsored Links</p>*/}
                                {/*</div>*/}
                            </div>
                            <div className="col-md-12 col-xs-12 col-sm-12">
                                <p className="art_joy">Enjoy this tutorial? Don't forget to share.</p>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 mobile-no-padding no-padding-sides">
                                <div className="col-md-12 col-sm-12 col-xs-12 resp_Secb">
                                    <div className="resp_Seca">
                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <span className="resp_tutorialrsp">Enter your comments</span>
                                            <textarea rows="4" cols="50" placeholder="Leave your comments" className="text_respart" id="message" />
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <div className="btn_pubb" style={{display : "flex"}}>
									<span className="ret_check">
									<select id = "anon">
            							<option value="anonymous">post anonymously</option>
            							<option value="real">Use my real name</option>
          							</select>
									</span>
                                                <span className="ret_pub" onClick={() => handleClick()}>Post Comment</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="ret_pub" onClick={() => onHandaleCommit()}>Showing all Comments</span>
                            {commit?<>{blogDetail?.comments?.length > 0 &&
                            <div className="col-md-12 col-xs-12 col-sm-12" style={{padding: "0px 20px 20px 20px"}}>
                                <Card style={{boxShadow: '0px 0px 6px rgb(0 0 0 / 16%)'}}>
                                    <div>
                                        {
                                            blogDetail?.comments?.map(item => (
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <p style={{border : "1px solid", padding: "10px", boxShadow: '0px 0px 6px rgb(0 0 0 / 16%)'}}>
                                                        <b>  {item?.name}</b>  : <br/> {item?.message}
                                                    </p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Card>
                            </div>}</>:<>{blogDetail?.comments?.length > 0 &&
                            <div className="col-md-12 col-xs-12 col-sm-12" style={{padding: "0px 20px 20px 20px"}}>
                                <Card style={{boxShadow: '0px 0px 6px rgb(0 0 0 / 16%)'}}>
                                    <div>
                                        {
                                            blogDetail?.comments?.map((item,id) => (
                                                id < 5 ? <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <p style={{border : "1px solid", padding: "10px", boxShadow: '0px 0px 6px rgb(0 0 0 / 16%)'}}>
                                                        <b>  {item?.name}</b> :  <br/> {item?.message}
                                                    </p>
                                                </div> : ''
                                            ))
                                        }
                                    </div>
                                </Card>
                            </div>}</>}

                            <div className="col-md-12 col-sm-12 col-xs-12 resp_tutorialrel">
                                <div className="col-md-12 col-sm-12 col-xs-12">
                                </div>
                            </div>
                        </div>
                        :
                        <div className="w-100" align={"center"} >
                            <h1>
                                This blog is no longer active
                            </h1>
                        </div>
                }

            </div>
        </>
    )
};

export default BlogDetail;
