import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Header from "../login/header";
import {getAllCategoryList, getAllMicroCourse} from "../utils/_data";
import "./Styles/micro-course.css";
import {Select} from "antd";
import  Microcourses_Infographic  from '../../images/Microcourses_Infographic.jpg'
const Option = Select.Option;

const languages = [
    {value: "", label: "Select"},
    {value: "English", label: "English"},
    {value: "Hindi", label: "Hindi"},
    {value: "Gujarati", label: "Gujarati"},
    {value: "Telugu", label: "Telugu"},
    {value: "Tamil", label: "Tamil"},
    {value: "Bahasa", label: "Bahasa"},
    {value: "Spanish", label: "Spanish"},
    {value: "Chinese", label: "Chinese"},
];

const MicroCourse = (props) => {

    const [microCourse, setMicroCourse] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [searchFilter, setSearchFilter] = useState({
        price : "",
        language: "",
        category : ""
    });
    const [dubMicroList, setDubCourse] = useState([]);

    useEffect(() =>{
        findAllMicroCourseList();
        getCategoryList()
    }, []);

    const getCategoryList = async () => {
        const response = await getAllCategoryList();
        if (response && response.data && response.data.success) {
            setCategoryList(response.data.result || []);
        } else {
            console.log(response.msg);
        }
    };

    const findAllMicroCourseList = async () =>{
        const result = await getAllMicroCourse();
        if (result?.success){
            setDubCourse(result?.data?.data || []);
            setMicroCourse(result?.data?.data || [])
        } else {
            console.log("error-------->>>");
        }
    };

    const handleSearchByFilter = (e, name) => {
        if(name === "keyword"){
            setSearchFilter({...searchFilter, [name]: e.target.value});
        }else {
            setSearchFilter({...searchFilter, [name]: e});
        }
    };

    const filterFlag = () => {
        const {price, language, category} = searchFilter;
        if(price || language || category){
            let min = null;
            let max = null;
            if (price.includes("+"))
                min = parseInt(price.replace("+", "")) + 1;
            else {
                min = parseInt(price.split("-")[0]);
                max = parseInt(price.split("-")[1]);
            }
            const searchByFilter = microCourse && microCourse.filter(item =>
                (price !== "" ? (item.coursePrice >= min && (max === null ? true : item.coursePrice <= max)) : true) &&
                (language !== "" ? (item.courseLanguage.split(' ').some((itm)=> itm.toLowerCase() ===  language.toLowerCase())) : true) &&
                (category !== "" ?  (item.category === category) : true)
            );
            if (searchByFilter && searchByFilter.length > 0) {
                setDubCourse(searchByFilter)
            } else {
                setDubCourse([])
            }
        }else {
            setDubCourse(microCourse)
        }
        setSearchFilter({...searchFilter, keyword: ""});
    };

    const keywordFlag = () => {
        const {keyword} = searchFilter;
        if(keyword){
            const searchByFilter = microCourse && microCourse.filter(item => (item.name.toLowerCase().includes(keyword.toLowerCase())) ||
                (item.courseTagWords.toLowerCase().includes(keyword.toLowerCase())))
            if (searchByFilter && searchByFilter.length > 0) {
                setDubCourse(searchByFilter)
            } else {
                setDubCourse([])
            }
        }else {
            setDubCourse(microCourse)
        }
        setSearchFilter({...searchFilter, price: "", language: "", category: ""});
    };

    const ResetFilter = () => {
        setSearchFilter({...searchFilter, keyword: "", price: "", language: "", category: ""});
        setDubCourse(microCourse)
    };


    return(
        <div className="live_Lerning">
            <div className="main_div">
                <Header />
            </div>
            {localStorage.getItem('userType') !=='mentor' ?
                <div className="micro-course" style={{flexDirection: "column"}}>
                    <div className="container">
                        <div className="col-m-12 col-sm-12 col-xs-12 article_content">
                            <div className="col-m-12 col-sm-12 col-xs-12 task-cards">
                                <div>
                                    <div className="col-md-8 margin-top-10" style={{paddingLeft: "30px"}}>
                                        <div style={{display: "flex", flexDirection: "row", width: "fit-content"}}>
                                            <div>
                                                <label
                                                    htmlFor='Price'
                                                >
                                                    Price:
                                                </label>
                                            </div>
                                            <div style={{marginLeft:'10px'}}>
                                                <Select
                                                    id='Price'
                                                    className="selectpicker marginBottom-unset"
                                                    style={{width: 150}}
                                                    placeholder="Select a Price"
                                                    onChange={(e) => handleSearchByFilter(e, "price")}
                                                >
                                                    <Option value="">Select</Option>
                                                    <Option value="0-20">0-20 USD</Option>
                                                    <Option value="21-50">21-50 USD</Option>
                                                    <Option value="50+">50+ USD</Option>
                                                </Select>
                                            </div>

                                            <div style={{marginLeft: '15px'}}>
                                                <label
                                                    htmlFor='language'
                                                >
                                                    Language:
                                                </label>
                                            </div>
                                            <div style={{marginLeft: '10px'}}>
                                                <Select
                                                    id='language'
                                                    style={{width: 150}}
                                                    placeholder="Select a language"
                                                    optionFilterProp="children"
                                                    value={searchFilter?.language}
                                                    onChange={(e) => handleSearchByFilter(e, "language")}
                                                >
                                                    {languages && languages.map((item, i) => (
                                                        <Option value={item.value} key={i}>{item.label}</Option>
                                                    ))}
                                                </Select>
                                            </div>

                                            <div style={{marginLeft: '15px'}}>
                                                <label
                                                    htmlFor='category'
                                                >
                                                    Category:
                                                </label>
                                            </div>
                                            <div style={{marginLeft: '10px'}}>
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
                                            </div>
                                        </div>
                                    </div>
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
                                <div>
                                    <div className='col-md-8 margin-top-10'>
                                        <form className="navbar-form" role="search">
                                            <div className="input-group add-on">
                                                <input className="form-control search-box" placeholder="Search"
                                                       name="keyword"
                                                       type="text"
                                                       onChange={(e) => handleSearchByFilter(e, "keyword")}
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
                        <div className="container" style={{marginTop: "15px", display:"flex",justifyContent:'center'}}>
                            <img src={Microcourses_Infographic} width={'500px'} height={'500px'}/>
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12 article_content">
                            <h2 className="article_innercont">List of Courses ({`${dubMicroList && dubMicroList.length}`})</h2>
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12 article_content">
                            <div>
                                <div className={'col-md-12 col-sm-12'}>
                                    <div className="block_locker course-body">
                                        <div className="col-md-12 col-sm-12 col-xs-12 block_image account-pg">
                                            {
                                                dubMicroList && dubMicroList.map((item,i) => (
                                                        <div key={i.toString()} className="col-md-6">
                                                            <div className="panel panel-default course-box">
                                                                <div className="row course-div">
                                                                    <div className="course-name">
                                                                        {item && item.coursePrice===0?<div><Link to={{pathname: `/MicroCourse/${item && item._id}/Lesson`, state: {data: item}}} className="link course-name is-link">{item && item.name}</Link></div>:<div><Link to={{pathname: `/MicroCourse/${item.name}`, state: {data: item}}} className="link course-name is-link">{item && item.name}</Link></div>}

                                                                    </div>
                                                                    <div className='d-flex' style={{flexDirection : "column", alignItems : "flex-start"}}>
                                                                        <div className="text-center w-100">
                                                                            <Link to={{pathname: `/MicroCourse/${item.name}`, state: {data: item}}} className="">
                                                                                <img className="course-img text-center"
                                                                                     src={item && item.courseImageUrl} alt=''/>
                                                                            </Link>
                                                                        </div>
                                                                        <h4 className="course-author">Author:</h4>
                                                                        <p className="course-content">{item && item.courseAuthor}</p>

                                                                        <h4 className="course-content">Tags:</h4>
                                                                        <p className="course-content">{item && item.courseTagWords.replace(/,/g, ", ")}</p>

                                                                        <h4 className="course-content">Course
                                                                            Price:</h4>
                                                                        <div className="course-content">
                                                                            <p className="intro-content">&#36;&nbsp;{item && item.coursePrice}</p>
                                                                        </div>
                                                                        <h4 className="course-content">Course
                                                                            description:</h4>
                                                                        <div className="course-content intro-content-description1">
                                                                            <p className="intro-content" dangerouslySetInnerHTML={{__html: item && item.description}}></p>
                                                                        </div>
                                                                        <p className="intro-header"><Link to={`/MicroCourse/${item.name}`}>more....</Link></p>{
                                                                        item && item.coursePrice===0?
                                                                            <div className='w-100' style={{paddingRight:'10px',marginBottom:'5px', paddingLeft: "10px"}}>
                                                                                <div className="d-flex w-100" style={{alignItems:'center', background : "#2DCC70", padding: "9px", borderRadius: "5px",width:"100%",display:"flex",justifyContent:"space-between"}}>
                                                                                    <h4 className="course-content t" style={{marginBottom:0}}>FREE</h4>
                                                                                    <button style={{backgroundColor: "#E8F1F8", border: 0}}><Link to={{pathname:`/MicroCourse/${item && item._id}/Lesson`, state: {data: item}}} style={{ color: "#202E55"}}>Explore</Link></button>
                                                                                </div>
                                                                            </div>:
                                                                            <>
                                                                            {
                                                                                item && item.takeCourse &&
                                                                            <div className='w-100' style={{paddingRight:'10px',marginBottom:'5px', paddingLeft: "10px"}}>
                                                                                <div className="d-flex w-100 justify-content-between" style={{alignItems:'center', background : "#2DCC70", padding: "9px", borderRadius: "5px"}}>
                                                                                    <h4 className="course-content" style={{marginBottom:0}}>PURCHASED
                                                                                        ALREADY</h4>
                                                                                    <button style={{backgroundColor: "#E8F1F8", border: 0}}><Link to={{pathname: `/MicroCourse/${item.name}`, state: {data: item}}} style={{ color: "#202E55"}}>Explore</Link></button>
                                                                                </div>
                                                                            </div>
                                                                    }
                                                                    </>
                                                                    }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div> : <h3 className="text-center statement">login as 'Mentee' mode to access the Micro Course</h3>}
        </div>
    )
};

export default MicroCourse;
