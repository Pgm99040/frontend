import React, {useEffect, useState} from "react";
import {useParams, useHistory, Link} from 'react-router-dom'
import {getSelectMCQtest,addSelectAns,getAnsTest} from './utils/_data'
import '../styles/StartMcqTest.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {toast} from "react-toastify";
import Header from "./login/header";

const ShowResultTest=()=>{

    const [result,setResult]=useState([])
    const [multiChoiceQuestions, setMultiChoiceQuestions] = useState([]);
    const [selectAns,setSelectAns]=useState([]);
    const [answer,setAnswer]=useState([])
    const [score,setScore]=useState([])
    const [showAns,setshowAns]=useState(false)
    const [currentPage,setcurrentPage]=useState(1)
    const [Page,setPage]=useState(0)
    const [startIndex,setstartIndex]=useState(0)
    const [endIndex,setendIndex]=useState(3)

    const params=useParams()
    const onSetResultTest=async()=>{
        const array=[]
        const res=await  getAnsTest(params.testId)
        if(res.success){
            setResult(res.data.findAns)
            res?.data?.findAns.map((data)=>(
                setSelectAns(data.selected_answer)
            ))

        }else {
            console.log('somethig wait wron')
        }
    }

    const getMcq=async()=>{
        let res = await getSelectMCQtest(params.testId);
        if(res.success){
            const evalDetails = res.data[0] || []
            setMultiChoiceQuestions(evalDetails)
            setAnswer(evalDetails.MultipleChoiceQuestion)
            setPage(evalDetails.MultipleChoiceQuestion && Math.ceil(evalDetails.MultipleChoiceQuestion.length / 3)||0)
        }else {
            console.log('somethig wait wron')
        }
    }

    // console.log('multiChoiceQuestions.MultipleChoiceQuestion.length',answer.length)


    const getExamScore = async () => {
        await answer.forEach(async (ans,index) => {
            const correct = ans.answers.filter(x => x.IsCorrectAnswer) || {};
            const given = await selectAns.filter((item) =>item.question_id === ans.multiChoiceQuestionId);
            if (given) {
                const selected_answer_ids = given[0].selected_answer_ids || [];

                // const selectedAnswer = correct.filter((item) => selected_answer_ids.forEach(i =>  item._id === i));
                const selectedAnswer = correct.filter((item) => selected_answer_ids.includes(item._id));

                const givenIndex = [];
                selectedAnswer.forEach((x, i) => {
                    givenIndex.push(ans.answers.findIndex(item => item === x))
                });
                if (givenIndex.length > 0) {
                    if(selected_answer_ids.length === givenIndex.length) {
                        if (givenIndex.length > 0) {
                            return ans.isRight = true
                        } else {
                            return ans.isRight = false
                        }
                    }else if(selected_answer_ids.length !== givenIndex.length && (selectedAnswer.length % 2)===0) {
                        if (givenIndex.length > 0 && selected_answer_ids.length === givenIndex.length ) {
                            return ans.isRight = true
                        } else {
                            return ans.isRight = false
                        }
                    }
                    ans.givenIndex = givenIndex;
                    ans.correctIndex = ans.answers.map((item, index) => {
                        const data = correct.find(each => each.MultipleChoiceAnswerId === item.multiChoiceQuestionId)
                        return data ? index : undefined
                    }).filter(e => e !== undefined)
                } else {
                    ans.isRight = false;

                    ans.givenIndex = givenIndex;
                    ans.correctIndex = ans.answers.map((item, index) => {
                        const data = correct.find(each => each.MultipleChoiceAnswerId === item.multiChoiceQuestionId)
                        return data ? index : undefined
                    }).filter(e => e !== undefined)
                }
            } else {
                ans.isRight = false;
                ans.givenIndex = [];
                ans.correctIndex = ans.answers.map((item, index) => {
                    const data = correct.find(each => each.MultipleChoiceAnswerId === item.multiChoiceQuestionId)
                    return data ? index : undefined
                }).filter(e => e !== undefined)
            }
        });
        const score = answer.filter(ques => ques.isRight);
        multiChoiceQuestions.MultipleChoiceQuestion = answer;
        setScore(score)
    };


    const onViweAnswer=()=>{
setshowAns(!showAns)
    }

   const  pagination = (currentPage) => {
        const startIndex = currentPage * 3 - 3;
        const endIndex = currentPage * 3;
       setstartIndex(startIndex)
       setendIndex(endIndex)
    };

    useEffect(()=>{
        onSetResultTest()
        getMcq()
    },[])

    useEffect(()=>{
        if(answer.length>0&&selectAns.length>0) {
            getExamScore()
        }
    },[selectAns,answer])
    const queCount = ['A', 'B', 'C', 'D', 'E', 'F'];
    const pageContents = [];
    for (let i = 0; i < Page; i++) {
        pageContents.push(<li key={i} className={i === currentPage - 1 ? 'active' : ''}
                              onClick={() => pagination(i + 1)}>{i + 1}</li>)
    }

    return(<>
        <div className="main_div">
            <Header/>
        </div>
        <div className="mcq-test-record">

            <Link to={'/McqTest'}> <div className={'container'} style={{fontSize: '20px'}}>&lt;&nbsp;Back</div></Link>
            {!showAns?<>
                <div className="card">
                    <div className="card-body text-center p-5">
                        <div className="row">
                            <div className='col-sm-12 col-md-12 col-xs-12 mcq-test mt-5' style={{marginTop: '70px'}}>

                                <CircularProgressbar
                                    value={(score.length*100)/answer.length}
                                    strokeWidth={5}
                                    text={`${score.length}/${answer.length}`}
                                    className="circular-progressbar"
                                >
                                </CircularProgressbar>
                                <button className="btn btn-success btn-rounded mt-4" style={{marginTop: '8px',marginBottom:'10px'}} onClick={onViweAnswer}>View Answer</button>
                            </div>
                        </div>
                    </div>
                </div></>:<>
                <div className="card-text text-muted" style={{paddingLeft:'30px',marginTop:'10px',display:'flex',flexDirection:'column',width:'50%'}}>
                    {answer.length>0? answer?.map((que, i) => (
                        <div key={i} className="question-container">
                            <div className='col-sm-12 col-md-12 col-xs-12 mcq-test mt-5' style={{marginTop: '70px'}}>

                                            <span
                                                className="questionIndex rounded-circle" style={{fontSize:"15px",border:'2px solid black',padding:"4px"}}><b>{startIndex + i + 1}</b></span>

                            <div>
                                <p style={{fontSize:"15px"}} dangerouslySetInnerHTML={{__html: que.Question}}
                                   className="question-pragraph"/>
                                <ul>
                                    {que && que.answers.map((ans, j) => (
                                        <li key={j}
                                            className={ans["IsCorrectAnswer"] ? 'text-success font-weight-bold' : (ans["IsCorrectAnswer"]===false && selectAns[i].selected_answer_ids.filter(data=>(data===ans._id)).length>0?'text-danger font-weight-bold':'') } style={{fontSize:"15px"}}>
                                            <span>{queCount[j]}.</span> {ans.MultipleChoiceAnswerText} {ans.AnswerKeyText && <span>(Reason : {ans.AnswerKeyText}) </span> }<br/>{<span>{selectAns[i].selected_answer_ids.filter(data=>(data===ans._id)).length>0?'( users selection )':''}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            </div>
                        </div>
                    )):<><span style={{fontSize:"15px"}}>No Question Found</span>
                    </>
                    }
                    <ul className='text-right pages' style={{fontSize:"15px"}}>{pageContents.map(x => x)}</ul>
                    <button className="btn btn-success btn-rounded mt-4" style={{marginTop: '8px',width:'20%',marginBottom:'10px'}} onClick={onViweAnswer}>Back Result</button>
                    {selectAns?.length>=1?'' :<span style={{fontSize:"15px"}}>No Question Found</span>}
                </div>
            </>}

        </div>
        </>)
}

export default ShowResultTest