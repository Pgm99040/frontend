import React, {useEffect, useState} from "react";
import { DatePicker, Input, Modal, Radio, Select } from "antd";
import moment from 'moment';
import {mentorProfileUpdate} from "./utils/_data";
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const language = [
    {value: "English", label: "English"},
    {value: "Hindi", label: "Hindi"},
    {value: "Kannada", label: "Kannada"},
];
const MentorProfileModal = (props) =>{
    const { data, cancelProfileModal, handleProfileModal, getProfileDetails, disabledDate } = props;
    const [userProfile, setProfile] = useState({});
    const [languages, setLanguage] = useState([]);
    const [stateDetail, setDetail] = useState("");
    const [mentorName, setMentorName] = useState("");
    const [error, setError] = useState({});
    useEffect(() =>{
        const stateDetails = props && props.location && props.location.state;
        const mentorName = props && props.params && props.params.mentorName;
        if (stateDetails && mentorName) {
            setDetail(stateDetails);
            setMentorName(mentorName)
        }
        if (data && data.user){
            let lang = [];
            data && data.user && data.user.preferredLanguages && data.user.preferredLanguages.length && data.user.preferredLanguages.map(item =>{
                lang.push(item.lang)
            });
            setLanguage(lang);

            let userDetails = {
                "userId": localStorage.getItem('id'),
                "firstName": data.user.firstName,
                "lastName": data.user.lastName,
                "country": data.user.country,
                "city": data.user.city,
                "zipCode": data.user.zipCode,
                "company": data.user.company,
                "companyLocation": data.user.companyLocation,
                "currentFieldOfStudy": data.user.currentFieldOfStudy,
                "currentWorkTitle": data.user.currentWorkTitle,
                "gender": data.user.gender,
                "designation": data.user.designation,
                "dateOfBirth": data.user.dateOfBirth,
                "aboutMe": data.user.aboutMe,
                "linkedInUrl": data.user.linkedInUrl,
                "githubUrl": data.user.githubUrl,
                "expertise": data.user.expertise,
                "preferredLanguages": []
            };
            setProfile(userDetails || {});
        }

    }, [data]);

    const handleChange = (e, date, dateString) =>{
        const { name, value } = e.target;
        if (name === "gender"){
            setProfile({
                ...userProfile,
                [name]: value
            })
        } else if (name === "preferredLanguage") {
            setLanguage(value)
        } else {
            setProfile({
                ...userProfile,
                [name]: name === "dateOfBirth" ? dateString : value
            })
        }
    };
    const onUpdateProfile = async () =>{
        // linkedin profile, and country, city and zipcode
        let validation = {};
        if (userProfile.linkedInUrl === "" || userProfile.linkedInUrl === null) {
            validation.linkedInUrl = "Linked in url is required";
        }
        if (userProfile.country === "" || userProfile.country === null){
            validation.country = "Country is required";
        }
        if (userProfile.city === "" || userProfile.city === null){
            validation.city = "City is required";
        }
        if (userProfile.zipCode === "" || userProfile.zipCode === null){
            validation.zipCode = "zipCode is required";
        }
        if (Object.keys(validation).length > 0){
            console.log("Hello");
            setError(validation);
            return true;
        }
        userProfile.preferredLanguages = languages;
        const response = await mentorProfileUpdate(userProfile);
        // const response = await axios.post(BaseUrl.base_url + "/api/v1/profileUpdate", userProfile,
        //     {
        //         'headers': {
        //             'Content-Type': 'application/json',
        //             'Authorization': localStorage.getItem('authToken')
        //         }
        //     });
        if ((response.data.status = 200) || (response.data.status = 201)) {
            // this.setState({postedSuccess:true,postedMessage:response.data.message, handleProfileModal: false});
            getProfileDetails(stateDetail, mentorName);
            cancelProfileModal();
        } else {
            // this.setState({postedUnsuccess:true,postedMessage:response.data.message, handleProfileModal: false})
            cancelProfileModal();
            console.log("error----->");
        }
    };

    return(
        <Modal wrapClassName="mentor-profile-form" title="Update Profile" visible={handleProfileModal} onCancel={cancelProfileModal}
               footer={[<button className="btn btn-primary" onClick={() =>onUpdateProfile()}>Submit</button>]}>
            <div>
                <p className="emptyTask_title">Hello, {}! Welcome to CodeDIY. </p>
                <p className="emptyTask_desc">Your profile will be reviewed by our admin and once verified & activated, you’ll start receiving requests from mentees to guide them through their tasks. Please provide more information about you, so we could accelerate the profile activation process. Thank you for enabling us to create an authentic platform bringing together experts and learners. </p>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>First Name</label><br />
                        <Input placeholder="" name="firstName" value={userProfile.firstName || ""} onChange={handleChange} id="firstName" required/>
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Last Name</label><br />
                        <Input placeholder="" name="lastName" value={userProfile.lastName || ""} onChange={handleChange} id="lastName" required />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Country</label><br />
                        <Input placeholder="" name="country" value={userProfile.country || ""} onChange={handleChange} id="country" required/>
                        <p className="text-danger">{error.country}</p>
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>City</label><br />
                        <Input placeholder="" name="city" value={userProfile.city || ""} onChange={handleChange} id="city" required/>
                        <p className="text-danger">{error.city}</p>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Zipcode</label><br />
                        <Input placeholder="" name="zipCode" value={userProfile.zipCode || ""} onChange={handleChange} id="zipCode" required/>
                        <p className="text-danger">{error.zipCode}</p>
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Company</label><br />
                        <Input placeholder="" name="company" value={userProfile.company || ""} onChange={handleChange} id="company" />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Company Location</label><br />
                        <Input placeholder="" name="companyLocation" value={userProfile.companyLocation || ""} onChange={handleChange} id="companyLocation" />
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Current field of Study</label><br />
                        <Input placeholder="" name="currentFieldOfStudy" value={userProfile.currentFieldOfStudy || ""} onChange={handleChange} id="currentFieldOfStudy" />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Current Work title</label><br />
                        <Input placeholder="" name="currentWorkTitle" value={userProfile.currentWorkTitle || ""} onChange={handleChange} id="currentWorkTitle" />
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Linkedin</label><br />
                        <Input placeholder="" name="linkedInUrl" value={userProfile.linkedInUrl || ""} onChange={handleChange} id="linkedIn" required/>
                        <p className="text-danger">{error.linkedInUrl}</p>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Github</label><br />
                        <Input placeholder="" name="githubUrl" value={userProfile.githubUrl || ""} onChange={handleChange} id="github" />
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Expertise</label><br />
                        <Select
                            mode="multiple"
                            id="expertise"
                            name="expertise"
                            value={userProfile.expertise || []}
                            style={{ width: '100%' }}
                            placeholder="C, Java, Spring"
                            onChange={(value) =>handleChange({target: {name: "expertise", value}})}
                            required >
                            <Option key="C">C</Option>
                            <Option key="C++">C++</Option>
                            <Option key="Java">Java</Option>
                        </Select>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Preferred Languages</label><br />
                        <Select
                            mode="multiple"
                            id="preferredLanguage"
                            name="preferredLanguage"
                            value={languages || []}
                            style={{ width: '100%' }}
                            placeholder="English, Hindi, Kannada"
                            onChange={(value) =>handleChange({target: {name: "preferredLanguage", value}})}
                            required >
                            {language && language.map((item, index) =>(
                                <Option key={index} value={item.value}>{item.label}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Gender</label><br />
                        <RadioGroup name="gender" id="gender" onChange={handleChange} value={userProfile.gender} defaultValue="Male">
                            <Radio value="Male" defaultChecked= {true}>Male</Radio>
                            <Radio value="Female">Female</Radio>
                        </RadioGroup>
                    </div>
                </div>

                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Designation</label><br />
                        <Input placeholder="" name="designation" value={userProfile.designation} onChange={handleChange} id="designation" />
                    </div>
                    <div className="col-md-6 col-sm-12 col-xs-12 pb-10">
                        <label>Date of Birth</label><br />
                        <DatePicker disabledDate={disabledDate}
                                    name="dateOfBirth"
                                    value={userProfile && userProfile.dateOfBirth && moment(userProfile.dateOfBirth, "YYYY-MM-DD")}
                                    onChange={(date, dateString) => {handleChange({target: {name: "dateOfBirth"}}, date, dateString)}}
                                    id="dateOfBirth" />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="col-md-12 col-sm-12 col-xs-12 pb-10">
                        <label>About Me</label><br />
                        <TextArea rows={4} id="aboutMe" name="aboutMe" value={userProfile.aboutMe} onChange={handleChange} required/>
                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default MentorProfileModal;