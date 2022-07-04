import React,{useEffect, useState} from "react";
import {getAllCategoryList, getMCQtest} from "./utils/_data";
import '../styles/McqTest.css'
import {ArrowRightOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import Header from "./login/header";
import {Select} from "antd";
import {Option} from "antd/es/mentions";
import FreeTests_Infographic1 from "../images/FreeTests_Infographic1.jpg";

const MccqTest=()=>{
    const [evalDetails, setEvalDetails] = useState([]);
    const [Mcqtest, setMcqtest] = useState([]);
    const [evalId, setEvalId] = useState("");
    const [calling, setCalling] = useState(true);
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [searchFilter, setSearchFilter] = useState({
        category : "",
        keyword:""
    });

    useEffect(() =>{
            getTestDetails();
        getCategoryList()
            setCalling(!calling);
    },[]);

    const getCategoryList = async () => {
        const response = await getAllCategoryList();
        if (response && response.data && response.data.success) {
            setCategoryList(response.data.result || []);
        } else {
            console.log(response.msg);
        }
    };

    const handleSearchByFilter = (e, name) => {
            setSearchFilter({...searchFilter, [name]: e});
    };
    const handleSearchByFilterKeword = (e, name) => {
        setSearchFilter({...searchFilter, [name]: e.target.value});
    };

    const getTestDetails = async () =>{
        setLoading(true);
        const testDetails = await getMCQtest();
        console.log("testDetails",testDetails)
        if (testDetails.success) {
            setEvalDetails(testDetails.data || []);
            setMcqtest(testDetails.data || [])
            setLoading(false);
        } else {
            setLoading(false);
            console.log(testDetails.msg);
        }
    };

    const keywordFlag = () => {
        const {keyword} = searchFilter;
            const searchByFilter = evalDetails && evalDetails.filter(item => (item.TestName.toLowerCase().includes(keyword.toLowerCase())) ||
                (item.TestDescription.toLowerCase().includes(keyword.toLowerCase())))
        console.log('searchByFilter',searchByFilter)
            if (searchByFilter && searchByFilter.length > 0) {
                setMcqtest(searchByFilter)
            } else {
                setMcqtest([])
            }
        setSearchFilter({...searchFilter,keyword: ''});
    };

    const filterFlag = () => {
        const {category} = searchFilter;
        const searchByFilter = evalDetails && evalDetails.filter(item => {
            return (category !== "" ?  (item.selectCetegory === category) : true)
            }
        );
        console.log('searchByFilter',searchByFilter)
        if (searchByFilter && searchByFilter.length > 0) {
            setMcqtest(searchByFilter)
        } else {
            setMcqtest([])
        }
    }

    const ResetFilter = () => {
        setSearchFilter({...searchFilter, category: ""});
        setMcqtest(evalDetails)
    };
    return(
    <>
        <div className="main_div">
            <Header />
        </div>
            <div className="container">
                <div className="col-m-12 col-sm-12 col-xs-12 article_content">
                    <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                        <div>
                            <div className="col-md-12 margin-top-10" style={{paddingLeft: "30px"}}>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <div style={{marginLeft: '10px',display:'contents'}} className="col-md-4">
                                        <span>  select categary: &nbsp;&nbsp; </span>
                                        <Select
                                            id="category"
                                            style={{width: 150}}
                                            placeholder="Select a category"
                                            optionFilterProp="children"
                                            value={searchFilter?.category}
                                            onChange={(e) => handleSearchByFilter(e, "category")}
                                        >
                                            <Option value="">Select</Option>
                                            {categoryList && categoryList.map((item, i) => (
                                                <Option value={item._id} key={i}>{item.name}</Option>
                                            ))}
                                        </Select>
                                        <div className=' col-md-2 margin-top-10'>
                                            <button
                                                className='search-by-filter'
                                                onClick={() => filterFlag()}
                                            >Search By Filter
                                            </button>
                                        </div>
                                        <div className='col-md-2 margin-top-10'>
                                            <button
                                                className='search-by-keyword'
                                                onClick={() => ResetFilter()}
                                            >Reset
                                            </button>
                                        </div>
                                </div>
                            </div>
                                <div>
                                    <div className='col-md-8 margin-top-10'>
                                        <form className="navbar-form" role="search">
                                            <div className="input-group add-on">
                                                <input className="form-control search-box" placeholder="Search"
                                                       name="keyword"
                                                       type="text"
                                                       value={searchFilter.keyword}
                                                       onChange={(e) => handleSearchByFilterKeword(e, "keyword")}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className='col-md-2 margin-top-10'>
                                        <button
                                            className='search-by-keyword'
                                            onClick={() => keywordFlag()}
                                        >Search By Keyword
                                        </button>
                                    </div>
                                    <div className='col-md-2 margin-top-10'>
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
            </div>
            </div>
        <div className="container" style={{marginTop: "15px", display:"flex",justifyContent:'center'}}>
            <img src={FreeTests_Infographic1} width={'800px'} height={'500px'}/>
        </div>
        <div className="container evaluationRecord">
            <div className="row evaluationData" style={{width: '100%'}}>
                <h2>List of Test ({`${Mcqtest && Mcqtest.length}`})</h2>
                {(Mcqtest && Mcqtest.length) ? Mcqtest.map((item, i) =>(
            <div key={i} className="col-12 col-md-6  main-card">
                <div className="card test-section">
                    <div className="card-body">
                        <div style={{display:'flex',justifyContent: 'center'}}>
                        <img src={item?.TestImg || ''} width={'200px'} height={'200px'} />
                        </div>
                        <div className={'margin-top-5'} style={{marginTop:'10px'}}>
                            <h5 className="card-title text-center text-white">Coding Test {i+1}</h5>
                        </div>
                        <div>
                            <h5 className="card-title text-center text-white">{item.TestName}</h5>
                        </div>
                        <div>
                            <h5 className="card-title text-center text-white">{item.TestDescription}</h5>
                        </div>
                        <div className="text-center test-now text-white">
                            <Link to={`/MCQTests/Test/${item?.TestId}`}> Take MCQ Test now <ArrowRightOutlined/></Link>
                        </div>
                    </div>
                </div>
            </div>
        )) : null}
            </div>
        </div>
    </>
    )
}

export default MccqTest