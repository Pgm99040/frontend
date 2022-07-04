import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Header from "../login/header";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { getAllSession, getAllCategoryList } from '../utils/_data';
import "../../styles/live-session.css";
import {Select} from "antd";
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

const data = [
    {title: "java-programming-basics", description: "Lorem inspect", Outcomes: "hhhhh", instructorName: "john", batches: [{date : "01-09-2021", duration: "1hour", capacityOfSeats: "10"}]},
    {title: "react-programming-basics", description: "Lorem inspect", Outcomes: "ssd", instructorName: "john1", batches: [{date : "01-09-2021", duration: "1hour", capacityOfSeats: "10"}]},
    {title: "node-programming-basics", description: "Lorem inspect", Outcomes: "ggg", instructorName: "john2", batches: [{date : "01-09-2021", duration: "1hour", capacityOfSeats: "10"}]}
];
const LiveSession = () =>{
    const [sessionList, setSession] = useState([]);
    const [dubSessionList, setDubSession] = useState([]);
    const [searchFilter, setSearchFilter] = useState({
        price : "",
        language: "",
        category : ""
    });
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() =>{
        findAllList();
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

    const findAllList = async () =>{
        const result = await getAllSession();
        if (result?.data?.success){
            setSession(result.data.response || [])
            setDubSession(result.data.response || [])
        } else {
            console.log("error-------->>>");
        }
    };

    const handleSearchByFilter = (e, name) => {
        if(name === "keyword"){
            setSearchFilter({...searchFilter, [name]: e.target.value});
        } else {
            setSearchFilter({...searchFilter, [name]: e});
        }
    };

    const filterFlag = () => {
        const {price, language, category} = searchFilter;
        if(price || language || category){
            let min = null;
            let max = null;
            if (price?.includes("+"))
                min = parseInt(price?.replace("+", "")) + 1;
            else {
                min = parseInt(price?.split("-")[0]);
                max = parseInt(price?.split("-")[1]);
            }
            const searchByFilter = sessionList && sessionList.filter(item =>
                (price !== "" ? (item.price >= min && (max === null ? true : item.price <= max)) : true) &&
                (language !== "" ? (item.LanguageOfInstruction.split(' ').some((itm)=> itm.toLowerCase() ===  language.toLowerCase())) : true) &&
                (category !== "" ?  (item.category === category) : true)
            );
            if (searchByFilter && searchByFilter.length > 0) {
                setDubSession(searchByFilter)
            } else {
                setDubSession([])
            }
        }else {
            setDubSession(sessionList)
        }
        setSearchFilter({...searchFilter, keyword: ""});
    };

    const keywordFlag = () => {
        const {keyword} = searchFilter;
        if(keyword){
            const searchByFilter = sessionList && sessionList.filter(item => item.title.toLowerCase().includes(keyword.toLowerCase()))
            if (searchByFilter && searchByFilter.length > 0) {
                setDubSession(searchByFilter)
            } else {
                setDubSession([])
            }
        }else {
            setDubSession(sessionList)
        }
        setSearchFilter({...searchFilter, price: "", language: "", category: ""});
    };

    const ResetFilter = () => {
        setSearchFilter({...searchFilter, keyword: "", price: "", language: "", category: ""});
        setDubSession(sessionList)
    };

  return(
      <div className="live_Lerning">
          <div className="main_div">
              <Header />
          </div>
          {localStorage.getItem('userType') !=='mentor' ? <div className="live-session" style={{flexDirection: "column"}}>
              {
                  <div className="container">
                      <div className="col-m-12 col-sm-12 col-xs-12 no-padding-div search_div">
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
                                          <div style={{marginLeft: '10px'}}>
                                              <Select
                                                  id='Price'
                                                  className="selectpicker marginBottom-unset"
                                                  style={{width: 150}}
                                                  placeholder="Select a Price"
                                                  value={searchFilter?.price}
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
                                                     name="keyword" value={searchFilter?.keyword}
                                                     type="text" onChange={(e) => handleSearchByFilter(e, "keyword")}/>
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
              }
              <div>
              {
                  dubSessionList && dubSessionList.length && dubSessionList.map((item, i) => (
                      <div className="col-sm-12 col-xs-12 col-md-3" key={i}>
                          <div className="session-block">
                              <div className="d-flex" style={{flexDirection : "column"}}>
                                  {item?.Thumbnail_ImageURL && <img src={item.Thumbnail_ImageURL} height={200} width={200} alt="" />}
                              <div className="title"><h3 style={{color: "white"}}>{item.title || ""}</h3></div>
                              </div>
                              <span className="title align-center"><h5 style={{color: "white"}} className="card-subtitle mb-2"><b>Number of Batches :</b>&nbsp;
                                  {item.batches.length}</h5></span>
                              <span className=" title align-center"><h5 style={{color: "white"}}
                                  className="card-subtitle mb-2"><b>Price :</b>&nbsp;
                                  {item.price} {item.currencyCode}</h5></span>
                              <span className=" title align-center"><h5 style={{color: "white"}}
                                  className="card-subtitle mb-2"><b>Languages :</b>&nbsp;
                                  {item.LanguageOfInstruction}</h5></span>
                              <div className="live">
                                  <div><Link to={{pathname: `/LiveSessions/${item.slug}`, state: {data: item}}} className="link">start session <ArrowRightAltIcon /> </Link></div>
                              </div>
                          </div>
                      </div>
                  ))
              }
              </div>
          </div> : <h3 className="text-center statement">login as 'Mentee' mode to access the Live Learning Sessions</h3>}
      </div>
  )
};
export default LiveSession;
