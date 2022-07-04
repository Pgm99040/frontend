// import React from 'react'
// import ReactDOM from 'react-dom';
// import PropTypes from "prop-types";
// import axios from "axios";
// import BaseUrl from "../config/properties";
// import actions from "../actions";
//
// const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
// class PaypalTransaction extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             editModelShow: false,
//         };
//     }
//     componentWillMount() {
//         const that = this;
//         if(!this.state.editModelShow) {
//             this.setState({
//                 editModelShow: true,
//             },() => {
//                 let PAYPAL_SCRIPT = 'https://www.paypal.com/sdk/js?client-id=AQwoZAAHsmA5vBLj_mZffS3NWJjNJODewuV2WakPm-BQilgsawTtnbLvWHNC73idcfiaHBOjaeTDkAS8';
//                 let script = document.createElement('script');
//                 script.setAttribute('src', PAYPAL_SCRIPT);
//                 document.head.appendChild(script);
//                 script.onload = () => {
//                     window.paypal.Buttons().render({
//                         env: 'sandbox', // sandbox | production
//                         client: {
//                             sandbox: 'AQwoZAAHsmA5vBLj_mZffS3NWJjNJODewuV2WakPm-BQilgsawTtnbLvWHNC73idcfiaHBOjaeTDkAS8',
//                             // production: 'AXsGhTo5jCqobjwsA_niVqqiXtOuuImsjuj9vpfVZIf6unl75F1ZuQTddF4TRKkXsQEbOXN03xp0Dr1C'
//                         },
//                         commit: true,
//
//                         payment: function(data, actions) {
//
//                             // Make a call to the REST api to create the payment
//                             return actions.payment.create({
//                                 payment: {
//                                     transactions: [
//                                         {
//                                             amount: { total: 10, currency: "USD" }
//                                         }
//                                     ]
//                                 }
//                             });
//                         },
//
//                         onAuthorize: function(data, actions) {
//
//                             // Make a call to the REST api to execute the payment
//                             return actions.payment.execute().then(function() {
//                                 console.log("================>", data)
//                                 that.onSuccess(data)
//                             });
//                         },
//
//                         onCancel: (data) => {
//                             console.log('The payment was cancelled!', data);
//                         },
//                         onError: (err) => {
//                             console.log('Error loading Paypal script!', err);
//                         },
//                     },'#euryeuryueyru90909');
//                 };
//             })
//         }
//
//     }
//
//     onSuccess (payment){
//         const payload = {
//             "PaymentGateway":"paypal",
//             "PurchasePrice": 10,
//             "PaymentToken": payment && payment.paymentToken,
//             "PaymentID": payment && payment.paymentID,
//             "PayerID": payment && payment.payerID
//         }
//
//         // if (authToken) {
//         //     const config = {
//         //         headers: {
//         //             Accept: 'application/json',
//         //             'Content-Type': 'application/json',
//         //             Authorization: localStorage.getItem('authToken')
//         //         }
//         //     }
//         //     axios.post(BaseUrl.base_url + `/api/v1/Courses/Name/${courseName}/Purchase`,payload, config).then((response) => {
//         //         if (response.data) {
//         //             this.setState({
//         //                 coursePay: response.data.status.toLowerCase(),
//         //             }, () => window.location.reload())
//         //         }
//         //     }).catch((error) => {
//         //         this.setState({error: error.message})
//         //     });
//         // }
//     }
//
//     render() {
//         return(
//             <div id="euryeuryueyru90909"/>
//         )
//     }
// }
//
// PaypalTransaction.propTypes = {
//     paypalId: PropTypes.string.isRequired,
//     total: 10,
// };
//
// export default PaypalTransaction;
import React, {useEffect, useState} from "react";
import PayPal from "./PayPal";
import { requestForTask } from "./utils/_data";
import "../styles/paypal-transaction.css";
import Loader from "./common/Loader";

const PaypalTransaction = (props) =>{
    // const [urlData, setUrlData] = useState({});
    let search = window.location.search;
    let params = new URLSearchParams(search);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() =>{
        // setUrlData(props.location.query);
    }, []);

    const onSuccess = async (data) =>{
        let requestBody = {
            "userId": localStorage.getItem('id'),
            "predefinedTaskId": params.get('taskId'),
            "isAnonymous": params.get('anonymous'),
            "paymentStatus": "success",
            "transactionId": data.paymentID,
            "captured": true,
            "taskType": params.get('type'),
            "paymentGateway": "paypal",
            "preferredLanguage": params.get('lang'),
            "taskPrice": params.get('amount') + " " + params.get('currency'),
            "taskPurchaseType": "currency",
            "selectedMentorId": params.get('selectId'),
            "mentorUserId": params.get('mentorUserId')
        };
        setIsLoading(true);
        const response = await requestForTask(requestBody);
        if (response.data.status_code === 200) {
            setIsLoading(false);
            localStorage.setItem('activeTasks', response.data.result.task._id);
            window.location.href = `/task-engagement/${response.data.result._id}`;
        }
        else {
            setIsLoading(false);
            console.log(response.data.message);
        }
        // axios({
        //     method: 'post',
        //     url: BaseUrl.base_url + "/api/v1/requestForTask",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': localStorage.getItem('authToken')
        //     },
        //     data: requestBody
        // }).then(response => {
        //     if (response.data.status_code === 200) {
        //         window.location.href = `/task-details/${urlData.taskId}`;
        //         localStorage.setItem('activeTasks', response.data.result.task._id);
        //     }
        //     else {
        //         console.log(response.data.message);
        //     }
        // }).catch(error => {
        //         throw (error);
        // });
    };
    if (isLoading) return <Loader/>;
    return (
        <div className="paypal-outer">
            <div className="paypal-inner">
                <PayPal onSuccess={onSuccess} />
            </div>
        </div>
    );
};


export default PaypalTransaction;
