import React, {useEffect, useState} from "react";
import Header from "./login/header";
import {Card, Button, Table, Select} from "antd";
import {getJobPost, getUserEligibleForJobPost,creacteJobPostingPromotions} from "./utils/_data";
import {Modal} from "react-bootstrap";
import {JobRole} from '../components/constants/JobRole'
import Loader from "./common/Loader";
import jobposting_Infographic from '../images/jobposting_Infographic.jpg'
import {toast} from "react-toastify";
// import {json} from "express";

const Country = [
    {value: "", label: "Select"},
    {value: "Remote", label: "Remote"},
    {value: "USA", label: "USA"},
    {value: "India", label: "India"},
    {value: "Singapore", label: "Singapore"},
    {value: "UK", label: "UK"},
    {value: "UAE", label: "UAE"},
    {value: "Australia", label: "Australia"},
    {value: "Canada", label: "Canada"},
    {value: "Germany", label: "Germany"}
];

const JobPostings = () => {

    const [loading, setLoading] = useState(false);
    const [jobPost, setJobPost] = useState([]);
    const [dublicateJobPost, setDublicateJobPost] = useState([]);
    const [isModel, setIsModel] = useState(false);
    const [searchFilter, setSearchFilter] = useState({});
    const [promoteStatus, setPromoteStatus] = useState(null);

    useEffect(()=>{
        getAllJobPost()
    },[]);

    const getAllJobPost = async () => {
        setLoading(true);
        const response = await getJobPost();
        if (response && response.data) {
            setJobPost(response.data.data);
            setDublicateJobPost(response.data.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const Columns = [
        {
            title: 'Task Category', dataIndex: '',
            render: (record, i) => {
                return (
                    <div>{record?.taskCategory?.name}</div>
                )
            }
        },
        {
            title: 'Task Sub Category', dataIndex: '',
            render: (record, i) => {
                return (
                    <div>{record?.taskSubCategory?.name}</div>
                )
            }
        },
        {title: 'Number Of Task', dataIndex: 'numOfTask'}
    ];

    const handleCancel = () => {
        setIsModel(false)
    };

    const handleOk = () => {
        setIsModel(false)
    };

    const handlePromote = async (id) => {
        setLoading(true);
        const response = await getUserEligibleForJobPost(id);
        if (response) {
            setPromoteStatus(response.data);
            const userData=JSON.parse(localStorage.getItem('userData'))
            const obj={
                Useremail:userData.email,
                JobPostingId:id,
            }
            const result =await creacteJobPostingPromotions(obj)
            console.log('result',result)
            if(result.data.status===200){
                console.log('successfully job promoted')
                setLoading(false);
                setIsModel(true)
            }else if(result.data.response.status===404){
                setLoading(false);
                toast.error("Job Already promoted", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        else{
                console.log('already job promoted')
            }
        } else {
            setLoading(false);
        }
    };

    const onPromote = async (id) => {
        await handlePromote(id);
    };

    const handleSearchByFilter = (e) => {
        const {name, value} = e.target;
        if(name === "keyword"){
            setSearchFilter({...searchFilter, [name]: value});
        }else {
            setSearchFilter({...searchFilter, [name]: value});
        }
    };

    const keywordFlag = () => {
        const {keyword} = searchFilter;
        if(keyword){
            const searchByFilter = jobPost && jobPost.filter(item => item?.jobRole?.toLowerCase().includes(keyword.toLowerCase()))
            if (searchByFilter && searchByFilter.length > 0) {
                setDublicateJobPost(searchByFilter)
            } else {
                setDublicateJobPost([])
            }
        }else {
            setDublicateJobPost(jobPost)
        }
        setSearchFilter({...searchFilter, country: ""});
    };

    const CountryFlag = () => {
        const {country} = searchFilter;
        if(country){
            if(country === "Remote"){
                setDublicateJobPost(jobPost)
            }else {
                const searchByFilter = jobPost && jobPost.filter(item => item?.country?.toLowerCase().includes(country.toLowerCase()))
                if (searchByFilter && searchByFilter.length > 0) {
                    setDublicateJobPost(searchByFilter)
                } else {
                    setDublicateJobPost([])
                }
            }
        }else {
            setDublicateJobPost(jobPost)
        }
        setSearchFilter({...searchFilter, keyword: ""});
    };

    const ResetFilter = () => {
        setSearchFilter({...searchFilter, keyword: "", country: ""});
        setDublicateJobPost(jobPost)
    };

    if (loading) return <Loader/>;
    return(
        <div className="fullPage">
            <div className="main_div">
                <Header/>
            </div>
                <div className="container">
                    <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div search_div" style={{top : '15px'}}>
                        <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                            <div className="d-flex">
                                <div className='col-md-6 margin-top-10 d-flex' style={{justifyContent: "center"}}>
                                            <Select placeholder="Select JobRole" value={searchFilter?.keyword} style={{width : "80%"}}
                                                    onChange={value => handleSearchByFilter({target: {name: "keyword", value}})}>
                                                {Object.keys(JobRole).map(items => (
                                                    <Select.Option key={items}
                                                                   value={JobRole[items]}>{items}</Select.Option>
                                                ))}
                                            </Select>
                                </div>
                                <div className='col-md-3 margin-top-10'>
                                    <button
                                        className='search-by-keyword'
                                        onClick={() => keywordFlag()}
                                    >Search By Job Role
                                    </button>
                                </div>
                                <div className='col-md-3 margin-top-10'>
                                    <button
                                        className='search-by-keyword'
                                        onClick={() => ResetFilter()}
                                    >Reset
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className='col-md-6 margin-top-10 d-flex' style={{justifyContent: "center"}}>
                                    <Select placeholder="Select Country" value={searchFilter?.country} style={{width : "80%"}}
                                            onChange={value => handleSearchByFilter({target: {name: "country", value}})}>
                                        {Country.map((items, i) => (
                                            <Select.Option value={items.value} key={items}>{items.label}</Select.Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className='col-md-3 margin-top-10'>
                                    <button
                                        className='search-by-keyword'
                                        onClick={() => CountryFlag()}
                                    >Search By Country
                                    </button>
                                </div>
                                <div className='col-md-3 margin-top-10'>
                                    <button
                                        className='search-by-keyword'
                                        onClick={() => ResetFilter()}
                                    >Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="container" style={{marginTop: "15px", display:"flex",justifyContent:'center'}}>
                <img src={jobposting_Infographic} width={'500px'} height={'500px'}/>
            </div>
            <div className="container">
                <h2 style={{marginTop: "15px", marginBottom: "15px"}}>List of Job Posting ({`${dublicateJobPost && dublicateJobPost.length}`})</h2>

                {
                    dublicateJobPost && dublicateJobPost.map(item => (
                        <Card style={{marginTop: "15px", marginBottom: "15px"}}>
                            <div className="d-flex">
                                <p><b>Job Title:</b> <span>{item?.jobTitle}</span></p>
                            </div>
                            <div className="d-flex">
                                <p><b>Job Role:</b> <span>{item?.jobRole}</span></p>
                            </div>
                            <div className="d-flex">
                                <p><b>Company:</b>  <span>{item?.company}</span></p>
                            </div>
                            <div className="d-flex">
                                <p><b>Application URL:</b> <span>{item?.jobApplicationURL}</span></p>
                            </div>
                            <div className="d-flex">
                                <p><b>Job Description:</b> <span dangerouslySetInnerHTML={{__html: item?.jobDescription || "-"}}/></p>
                            </div>
                            <div className="d-flex">
                                <p><b>Job Location:</b> <span>{item?.country}</span></p>
                            </div>
                            <div className="d-flex">
                                <p><b>{(item?.remote ?"Remote OK":null)}</b></p>
                            </div>
                            <div className="d-flex" style={{flexDirection : "column", alignItems : "flex-start"}}>
                                <label>Remote My Application</label>
                                <label>Criteria</label>
                                <Card className="w-100">
                                    <Table
                                        columns={Columns}
                                        dataSource={item?.taskRequire}
                                        pagination={false}
                                        showHeader={true}/>

                                </Card>
                            </div>
                            <div className="d-flex" style={{justifyContent : "center", marginTop: "30px"}}>
                                <Button onClick={()=>onPromote(item?._id)}>Promote To Company</Button>
                            </div>
                        </Card>
                    ))
                }
                <Modal show={isModel} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Promote to Company</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            { promoteStatus ?
                            'Your application will be promoted to the company' :
                                'You did not compete the required number of tasks in the category and subcategory required. Please complete and Apply again'
                            }
                        </div>
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
            </div>
        </div>
    )
};

export default JobPostings;
