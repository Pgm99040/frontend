import React from "react";
import BaseUrl from '../../config/properties';
import {GoogleLogin} from "react-google-login";
import {setInToStorage} from "../../config/common";
import {loginWithGoogle} from "../utils/_data";
import moment from "moment-timezone";

const GoogleWithLogin = ({showModal, title, style = {}, icon = true, className = ''}) => {
    const onSubmit = async (data, _this) => {
        console.log("data-----123>", data);
        let responseData = {
            "firstName": data && data.profileObj && data.profileObj.familyName,
            "lastName": data && data.profileObj && data.profileObj.givenName,
            "email": data && data.profileObj && data.profileObj.email,
            "profilePicUrl": data && data.profileObj && data.profileObj.imageUrl,
            "authToken": data && data.tokenId,
            "authenticatingSite": "google",
            "platform": "web",
            "timeZone": moment.tz.guess() || ""
        };
        const response = await loginWithGoogle(responseData);
        if (response && response.data && response.data.success) {
            setInToStorage({
                'isVisible': true,
                'userData': response && JSON.stringify(response.data.result),
                'authToken': response && response.data && response.data.result && response.data.result.socialLoginInfo && response.data.result.socialLoginInfo.authToken,
                'id': response && response.data && response.data.result && response.data.result._id,
                'isMentor': response && response.data && response.data.result && response.data.result.isMentor,
                'isLoggedIn': response && response.data && response.data.result && response.data.result.isLoggedIn,
                'loginName': `${response && response.data && response.data.result && response.data.result.firstName}${response && response.data && response.data.result && response.data.result.lastName}`
            });
            if (response && response.data && response.data.result && response.data.result.isMentor) {
                showModal();
            } else {
                setInToStorage({
                    'isVisible': false,
                    'userType': 'user'
                });
                window.location.href = "/tasklist";
            }
        } else {
            console.log("error");
        }

    };
    return (
        <div>
            {
                BaseUrl.google_client_id && (
                    <GoogleLogin
                        clientId={BaseUrl.google_client_id || ""}
                        buttonText={title}
                        icon={icon}
                        style={style}
                        onSuccess={(data) => onSubmit(data, this)}
                        onFailure={(data) => onSubmit(data, this)}
                        className={className ||  `google-btn`}
                    />
                )
            }
        </div>

    )
};
export default GoogleWithLogin;
