import React, { useEffect } from "react";
import PaypalExpressBtn from 'react-paypal-express-checkout';
import BaseUrl from '../config/properties';
const PayPal = props =>{
    useEffect(() =>{
        // onSuccess();
        // onCancel();
        // onError();
    }, []);

    const onSuccess = (payment) =>{
        const authToken = localStorage.getItem("authToken");
        const payload = {
            "PaymentGateway":"paypal",
            "PurchasePrice": 10,
            "PaymentToken": payment && payment.paymentToken,
            "PaymentID": payment && payment.paymentID,
            "PayerID": payment && payment.payerID
        };
        props.onSuccess(payment)
    };

    const onCancel = (data) => {
        console.log('The payment was cancelled!', data);
    };

    const onError = (err) => {
        console.log("Error!", err);
    };

    let env = 'sandbox';
    let currency = 'USD';
    let total = 1;

    const client = {
        sandbox: BaseUrl.paypal_sendbox,
        // sandbox: 'AYtnAl7gkUzvrKgM_D2X2adNRS_WuhOTC7XkkcWILEHP_ajb4QAj3zuDB2DsvOeuvgXR7JOZ9fp0fq2I',
        // production: 'AXsGhTo5jCqobjwsA_niVqqiXtOuuImsjuj9vpfVZIf6unl75F1ZuQTddF4TRKkXsQEbOXN03xp0Dr1C',
    };
    const style = {
        shape: 'rect',
        size: 'responsive',
        label: 'paypal',
        width: 176,
        height: 41,
        marginTop: 15
    };
    return (
        <div className="paypal-btn">
            <PaypalExpressBtn env={env} client={client}  currency={currency} style={style} total={total} onError={onError} onSuccess={onSuccess} onCancel={onCancel}/>
        </div>
    );
};
export default PayPal;