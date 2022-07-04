import React, {useEffect, useState} from 'react';
import Header from "./login/header";
import {getBlog} from "./utils/_data";
import {Spin, Table} from 'antd'
import "../components/MicroCourse/Styles/micro-test-details.css"

const Blog = (props) => {

    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState([]);
    const [dublicateBlog, setDublicateBlog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [careerPath, setCareerPath] = useState("SearchByCareerPath");
    const [searchByCareerPath, setSearchByCareerPath] = useState("ALL");
    const [searchByKeyword, setSearchByKeyword] = useState("");
    const [startIndex, setStartIndex] = useState(1);

    useEffect(() => {
        getAllBlog()
    }, []);

    const getAllBlog = async () => {
        setLoading(true);
        const response = await getBlog();
        if (response && response.data) {
            setBlog(response.data.data);
            setDublicateBlog(response.data.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const onSendData = (record) => {
        props.history.push({
            pathname: `/blogs/${record.blogTitleForURL}`,
            state: {
                data: record
            }
        })
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: '',
            key: '',
            render: (index, record) => (
                <div><a onClick={() => onSendData(record)}>{record.blogTitle}</a></div>
            )
        },
        {
            title: 'Resource Description',
            dataIndex: 'blogDescription',
            key: 'blogDescription',
        },
        {
            title: 'Resource Tags',
            dataIndex: 'blogTags',
            key: 'blogTags',
        },
        {
            title: 'Relevant Career Path',
            dataIndex: 'relevantCareerPath',
            key: 'relevantCareerPath',
        },
    ];

    const onChange = (e) => {
        const {name, value} = e.target;
        if(name === "careerPath"){
            setCareerPath(value);
        }
        if(name === "SearchByCareerPath"){
            setSearchByCareerPath(value)
        }
        if(name === "SearchByKeyword"){
            setSearchByKeyword(value)
        }
        setStartIndex(1)
    };

    const onSearch = () => {
        if(careerPath === "SearchByCareerPath"){
            if(searchByCareerPath === "ALL"){
                setDublicateBlog(blog)
            }else {
                const searchByFilter = blog.filter(item => item.relevantCareerPath.toLowerCase().includes(searchByCareerPath.toLowerCase()))
                if(searchByFilter.length){
                    setDublicateBlog(searchByFilter)
                }else {
                    setDublicateBlog([])
                }
            }
        }else if (careerPath === "SearchByKeyword"){
            const searchKeyword = blog.filter(item => item.blogTags.toLowerCase().includes(searchByKeyword.toLowerCase()))
            if(searchKeyword.length){
                setDublicateBlog(searchKeyword)
            }else {
                setDublicateBlog([])
            }
        }else {
            setDublicateBlog(blog)
        }
    };

    const onClear = () => {
        setDublicateBlog(blog)
    };

    return (
        <div className="fullPage">
            <div className="main_div">
                <Header/>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 article_content">
                <div className="col-sm-3 other">
                    <h2 className="article_innercont">Blog List</h2>
                </div>
                <div className="col-sm-9 pull-right ">
                    <div className="col-sm-3">
                        <div className="form-group">
                            <select className="form-control" style={{width: "auto"}} name="careerPath"
                                    onChange={onChange} value={careerPath}>
                                <option value="SearchByCareerPath">Search by Career Path</option>
                                <option value="SearchByKeyword">Search by Keyword</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-5">
                        {
                            careerPath === "SearchByCareerPath" ?
                                <div className="form-group">
                                    <select className="form-control" style={{width: "auto"}}
                                            name="SearchByCareerPath"
                                            onChange={onChange} value={searchByCareerPath}>
                                        <option value="All">
                                            All
                                        </option>
                                        <option value="Software Development Engineering">Software
                                            Development Engineering
                                        </option>
                                        <option value="Software Test Engineering">Software Test
                                            Engineering
                                        </option>
                                        <option value="Mechanical Engineering">Mechanical
                                            Engineering
                                        </option>
                                    </select>
                                </div> :
                                <div className="form-group">
                                    <input type="text" className="form-control inputText" style={{marginTop : "0px"}}
                                           name="SearchByKeyword" value={searchByKeyword}
                                           onChange={onChange}/>
                                </div>
                        }
                    </div>
                    <div className="col-sm-1">
                        <input type="button" value="Search"
                               className="btn btn-primary inputText" onClick={onSearch}/>
                    </div>
                    <div className="col-sm-1">
                        <input type="button" value="Clear Search"
                               className="btn btn-primary inputText" onClick={onClear}/>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 article_content">
                    {isLoading ?
                        <div style={{marginTop: "10%", marginLeft: "46%"}}><Spin size="large" tip="Loading..."/>
                        </div> :
                        blog && blog.length ?
                            <Table columns={columns} dataSource={dublicateBlog || []} />
                            : <div className="text-center">
                                <h2 className="article_innercont"> NO data found </h2>
                            </div>
                    }
                </div>
                {/*{endReached === false ?*/}
                {/*    <div className="col-md-12 col-sm-12 col-xs-12 article_content">*/}
                {/*        <div className="col-md-4"/>*/}
                {/*        <div className="col-md-4 text-center" style={{marginBottom: "10px"}}>*/}
                {/*            <input type="button" value="More Results" onClick={this.onShowMore}*/}
                {/*                   className="btn btn-primary inputText"/>*/}
                {/*        </div>*/}
                {/*        <div className="col-md-4"/>*/}
                {/*    </div> : null*/}
                {/*}*/}
            </div>
        </div>
    )
};

export default Blog;
