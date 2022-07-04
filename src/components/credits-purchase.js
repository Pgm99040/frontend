import React from 'react';
import Header from './login/header';
import { Radio, InputNumber ,Button} from 'antd';
import SweetAlert from 'sweetalert-react';
import {purchaseCredits} from "./utils/_data";
import {getFromStorage} from "../config/common";
const RadioGroup = Radio.Group;
require('../styles/purchase-credits.css');

class creditsPurchase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: "INR",
            credits: 0,
            total:0,
            purchasesuccess:false,
        };
    }

 
    onChange = (e) => {
        this.setState({
            value: e.target.value,
            credits:0,
            total:0
        });
    };
    onChangeCredits=(value) =>{
        let currency = this.state.value === "INR"? 50 : 20;
        let total = (value*currency);
        this.setState({
            credits: value,
            total:total
        })
    };

    purchaseCredits=()=>{
        let _this = this;
        const userData = JSON.parse(getFromStorage("userData"));
        let options = {
            "key": "rzp_test_iWLnogdDrn0e8N",
            "amount":1*100,//localStorage.getItem('amount')*100,
            "name": "CodeDIY",
            "description": "purchasing the credits " + this.state.credits,
            "image": "/your_logo.png",
            "handler": async function (response) {
                let requestBody = {
                    "userId": localStorage.getItem('id'),
                    "credits":_this.state.credits,
                    "amountPaid":  _this.state.total+" "+_this.state.value,
                    "paymentStatus": "success",
                    "razorpayId": response.razorpay_payment_id,
                    "captured": true,
                    "paymentGateway": "razorpay",
                    "email": userData.email || ""
                };
                const res = await purchaseCredits(requestBody);
                if (res?.data?.status_code === 200) {
                    _this.setState({ purchasesuccess: true});

                } else {
                    console.log("error----->");
                }
                // axios({
                //     method: 'post',
                //     url: BaseUrl.base_url + "/api/v1/purchaseCredits",
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': localStorage.getItem('authToken')
                //     },
                //     data: requestBody
                // }).then(response => {
                //     if (response.data.status_code == 200) {
                //         _this.setState({ purchasesuccess: true});
                //
                //     }
                // })
                //     .catch(error => {
                //         throw (error);
                //     });

                //alert(response.razorpay_payment_id);
            },
            // "prefill": {
            //     "name": userName,
            //     "email": userEmail
            // },
            "notes": {
                "address": "Hello World"
            },
            "theme": {
                "color": "#F37254"
            }
        };
        let rzp = new window.Razorpay(options);
        rzp.open();
    };

    confirm=()=>{
        this.setState({purchasesuccess:false});
        window.location.href = "/menteedashboard"
    };

    render() {
        return (

            <div>
            <SweetAlert
                    show={this.state.purchasesuccess}
                    title="Success"
                    type="success"
                    text="Credits purchased successfully"
                    onConfirm={this.confirm}
                />
                <div className="main_div">
                    <Header />
                </div>

                <div className="main-credits-card">
                    <h1>Purchase Credits</h1>
                    <br />
                    <h5 >1 credit = &#8377; 50</h5>
                    <h5>1 credit = &#36;20</h5>
                    <br />
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value={"INR"}>INR</Radio>
                        <Radio value={"USD"}>USD</Radio>
                    </RadioGroup>
                    <br />
                    <InputNumber min={0} value={this.state.credits} onChange={this.onChangeCredits} />
                    <h4>Total :{this.state.value=="INR"?"₹":"$"}{this.state.total}</h4>
                    <br/>
                    <Button type="primary" onClick={this.purchaseCredits}>Purchase</Button>
                </div>

            </div>
        )
    }

}

export default creditsPurchase;


