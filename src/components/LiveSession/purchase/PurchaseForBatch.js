import React, {useState} from "react";
import PayPal from "../../PayPal";
import {bookSession, purchaseBatches} from "../../utils/_data";
import {getFromStorage} from "../../../config/common";
import { useHistory, useParams } from  "react-router-dom";
import SweetAlert from "sweetalert-react";
import moment from "moment-timezone";
const PurchaseForBatch = (props) =>{
    const [show, setShow] = useState(false);
    const history = useHistory();
    const params = useParams();
    const userData = JSON.parse(getFromStorage("userData"));
    const userName = getFromStorage("loginName");
    console.log("history", history);
    const onSuccess = async (data) =>{
        const bookSessionObj = {
            LiveSessionId: params.sessionId || "",
            BatchId: params.batchId || "",
            username: userName,
            email: userData.email,
            bookingTransactionId: data.paymentID,
            timeZone: moment.tz.guess() || ""
        };

        const result = await bookSession(bookSessionObj);
        if (result && result.success){
            setShow(true);
            await purchaseBatches(params.sessionId);
            window.location.href = "/menteedashboard";
            console.log("success");
        } else {
            console.log("error");
        }
    };
    const closeAlert = () =>{
        setShow(false);
    };

  return(
      <div className="paypal-outer">
          <SweetAlert
              show={show}
              title="Success"
              type="success"
              text= "Your Payment Successfully"
              onConfirm={() => closeAlert()}
          />
          <div className="paypal-inner">
              {localStorage.getItem('userType') !=='mentor' ? <PayPal onSuccess={onSuccess} /> : <h3 className="text-center statement">login as 'Mentee' mode to access the Live Learning Sessions</h3>}
          </div>
      </div>
  )
};
export default PurchaseForBatch;