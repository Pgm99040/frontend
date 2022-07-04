import React, {useEffect, useState} from "react";
import {useParams,useHistory} from 'react-router-dom'
import {getSelectMCQtest,addSelectAns} from './utils/_data'
import '../styles/StartMcqTest.css'
import {toast} from "react-toastify";
import Header from "./login/header";

const StartMcqTest=()=>{
    const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(0);
    const [multiChoiceQuestions, setMultiChoiceQuestions] = useState([]);
    const [finalSelectMcqList, setFinalSelectMcqList] = useState([]);
    const [mcqEvalDetails, setMcqEvalDetails] = useState({});
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const options = ['A', 'B', 'C', 'D','E'];
    const params=useParams()
    const history =useHistory()
    useEffect(()=>{
        getMcqInvitation()
    },[])

    const getMcqInvitation = async () =>{
        setIsLoading(true);

            let candidateRecords = await getSelectMCQtest(params.testId);
            if (candidateRecords.success) {
                const evalDetails = candidateRecords.data[0] || {};
                setMcqEvalDetails(evalDetails);
                setMultiChoiceQuestions(evalDetails.MultipleChoiceQuestion.map(item=>({...item,answers:item.answers.map(data=>({...data,isSelector:false}))})) || []);
                evalDetails.MultipleChoiceQuestion.forEach(item => {
                    finalSelectMcqList.push({
                        "question_id": item.multiChoiceQuestionId,
                        "selected_answer_ids": [],
                        "answer_key_text": []
                    })
                });
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }

    };

    const onChange = (e, i) => {
        if (e.target.name === "correctAnswer" || e.target.value === "answerKey" || (e.target.attributes["data-name"]
            && e.target.attributes["data-name"].value === "correctAnswer")) {
            multiChoiceQuestions[visibleQuestionIndex].answers.forEach((ans, i) => {
                if (parseInt(e.target.attributes["data-id"].value, 10) === i) {
                    ans && ans.isSelector ? ans["isSelector"] = false : ans["isSelector"] = true;
                    finalSelectMcqList[visibleQuestionIndex]["question_id"] = multiChoiceQuestions[visibleQuestionIndex].multiChoiceQuestionId;
                    ans.isSelector ?
                        finalSelectMcqList[visibleQuestionIndex]["selected_answer_ids"].push(ans._id) :
                        finalSelectMcqList[visibleQuestionIndex]["selected_answer_ids"] = finalSelectMcqList[visibleQuestionIndex]["selected_answer_ids"].filter(e => e !== ans._id);

                    // finalSelectMcqList[visibleQuestionIndex]["selected_answer_ids"]

                    ans.isSelector ? finalSelectMcqList[visibleQuestionIndex]["answer_key_text"].push(ans.AnswerKeyText) :
                        finalSelectMcqList[visibleQuestionIndex]["answer_key_text"] = finalSelectMcqList[visibleQuestionIndex]["answer_key_text"].filter(e=>e !== ans.AnswerKeyText);
                }
            });
            setMultiChoiceQuestions(multiChoiceQuestions);
            setFinalSelectMcqList(finalSelectMcqList);
            setError({
                error: {
                    [e.target.name]: validate(e.target.name, e.target.value)
                }
            });
        }
    };

    const validate = (name, value) => {
        switch (name) {
            case 'correctAnswer':
                if (!value) {
                    return 'Please choose one correct answer';
                } else {
                    return '';
                }
            default: {
                return ''
            }
        }
    };

    const onNextPrivious = (move) => {
        if (move === "Next") {
            setVisibleQuestionIndex(visibleQuestionIndex + 1);
        } else if (move === "Previous") {
            setVisibleQuestionIndex(visibleQuestionIndex - 1);
        } else {
            setVisibleQuestionIndex(move);
        }
    };

    const onSave=async ()=>{
        let filledList = [];
        let unFilledList = [];
        let validationErrors = {};
        multiChoiceQuestions.forEach((que, i) => {
            const choose = que.answers.filter(ans => ans.isSelector);
            console.log('choose',choose)
            if (choose.length) {
                filledList.push(i + 1);
                setInProgress(!inProgress);
            } else {
                unFilledList.push(i + 1);
            }
        });
        validationErrors.MCQError = `Question number ${unFilledList.join(',')} is unfilled, please choose answer`;
        if(validationErrors && !unFilledList.length) {
            const obj = {
                testId: params.testId,
                selected_answer: finalSelectMcqList
            }
            const respons = await addSelectAns(obj);
            if (respons.success == true) {
                toast.success("successfully submit Quiz", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                history.push(`/TestResult/${params.testId}`)
            } else {
                toast.error("somthing wrong", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }else {
            setError(validationErrors);
        }
    }


    return(<>
        <div className="main_div">
            <Header/>
        </div>
        <div className="mcq-test-record">
            <div className="row new-test mx-3 invite-header mb-3">
                <div className='col-sm-6 col-md-6 col-xs-12 mcq-coding-timer mt-5'>
                </div>
                <div className={`col-xs-12 mt-5 text-right col-sm-6 col-md-6`}>
                    { multiChoiceQuestions.length>0 ? <button className="btn btn-primary" onClick={onSave}>Submit</button>:null}
                </div>
            </div>
            <div className="row">
                <div className='col-sm-12 col-md-12 col-xs-12 mcq-test'>
                    <div className="card">
                        <div className="card-body text-center">
                            <h4 className="text-dark">MCQ Test {multiChoiceQuestions.length>0?visibleQuestionIndex + 1:0}/{multiChoiceQuestions.length}</h4>
                            <small className="text-danger" style={{fontSize: 20}}>{error.MCQError}</small>
                            <div className="row" style={{display: 'flex',flexDirection: 'column'}}>
                                {multiChoiceQuestions.length>0?
                                    multiChoiceQuestions && multiChoiceQuestions.map((que, j) => (<div style={{display: 'flex',justifyContent: 'center'}}>

                                           {visibleQuestionIndex === j && <>
                                                <div key={j} className='col-sm-12 col-md-6 offset-md-3 col-xs-12'>
                                                    <div>
                                                        {/*<img alt="" src={getUrl(que.question)}/>*/}
                                                    </div>
                                                    <p className="text-muted text-dark mt-4" style={{fontSize: 20}}>
                                                        <div dangerouslySetInnerHTML={{__html: que.Question}}/>
                                                    </p>
                                                    {
                                                        que && que.answers && que.answers.length && que.answers.map((option, i) => (
                                                            <div key={i} className={`form-group 'text-success'`}>
                                                                <div
                                                                    data-name="correctAnswer"
                                                                    id={`${options[i]}`}
                                                                    data-id={i}
                                                                    onClick={onChange}
                                                                    className={`form-control text-left disabled `}
                                                                >{options[i]}. {option.MultipleChoiceAnswerText}</div>
                                                                <label className="check-container">
                                                                    <input type="checkbox" className={`custom-checkbox ${!option.isSelector ? "display-none" : null}`} name="correctAnswer" data-id={i} id={`${options[i]}`}
                                                                           onClick={onChange} />
                                                                    <span className="checkmark text-primary"/>
                                                                </label>
                                                                <small className="text-danger">{error[`option${options[i]}`]}</small>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </>
                                        }
                                    </div>
                                    )):<div style={{marginBottom: '100px',marginTop:'100px',fontSize:'30px'}}>not question list</div>
                                }
                                <div className="col-sm-12 col-md-12 offset-md-3 col-xs-12 mt-4 mb-5" style={{marginBottom: '100px'}}>
                                    <button className="btn bg-white border border-primary text-primary pl-5 pr-5 mr-2"
                                            onClick={() => onNextPrivious('Previous')} disabled={!visibleQuestionIndex}>Previous
                                    </button>
                                    <button className="btn bg-white border border-primary text-primary pl-5 pr-5"
                                            onClick={() => onNextPrivious('Next')}
                                            disabled={((multiChoiceQuestions.length - 1) === visibleQuestionIndex)}>Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)

}

export default StartMcqTest