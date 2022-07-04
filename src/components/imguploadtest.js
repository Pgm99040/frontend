import React from 'react';
import axios from 'axios';
import { Input, Button, Select } from 'antd';

import PayPal from "./PayPal";

const { TextArea } = Input;
const Option = Select.Option;

class ImageUploadTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    onFormSubmit(event) {
        event.preventDefault();

        const url = "http://localhost:8080/api/v1/editProfile";

        const formData = new FormData();
        formData.append('file', this.uploadInput.files[0]);
        formData.append('path', "sideProject" + "-" + "6012773b4957ee2e2fb5e92d");

        axios.post("http://localhost:8080/api/v1/imageUpload", formData, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInBsYXRmb3JtIjoid2ViIiwia2V5Ijoic3pzemZqcXJlbl8xNjExMjk5MTM3QHRmYm53Lm5ldCIsImlhdCI6MTYxMjI1MDY1NywiZXhwIjoxNjE0ODQyNjU3fQ.ZKdUM01oqcg5aMBJ8rVrGTMKlgy7L9oYMnBQN2_ySj4'
            }
        }).then(response => {
            //console.log(response, "res in hrerererer")

            let data = {
                "userId": "6012773b4957ee2e2fb5e92d",
                "type": "sideProject",
                "operation": "add",
                "sideProject": {
                    "projectTitle": "E-Commerce Application",
                    "projectLink": "http://github-url",
                    "screenshot": response.data.result.Key,
                    "description": "web app"
                }
            };
            axios.post(url, data, {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInBsYXRmb3JtIjoid2ViIiwia2V5Ijoic3pzemZqcXJlbl8xNjExMjk5MTM3QHRmYm53Lm5ldCIsImlhdCI6MTYxMjI1MDY1NywiZXhwIjoxNjE0ODQyNjU3fQ.ZKdUM01oqcg5aMBJ8rVrGTMKlgy7L9oYMnBQN2_ySj4'
                }
            }).then(response => {
                console.log(response, "res finalllllll")
            })
        })

    }

    render() {

        return (
            <div className="col-md-12 col-sm-12 col-xs-12">
            <PayPal />
                                                                      

                <p className="tabs-text">Lorem Ipsum Dolor Sit Amet Consectet Lorem Ipsum Dolor Sit Amet Consectet</p>
                <div className="m-bottom-30">
                    {/* <form action="javascript:void(0);" onSubmit={this.onFormSubmit} id='answerForm'> */}
                    <TextArea rows={6} id='answer_description' placeholder="Write description here.." className="margin-Bottom" />
                    <div className="col-md-12 col-sm-12 col-xs-12 paddingBottom">
                        <div className="col-md-4 col-sm-7 col-xs-12">
                            &nbsp;
                            </div>
                        <div className="col-md-6 col-sm-3 col-xs-12 no-right-padding-div">
                            <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                        </div>
                        <div className="col-md-2 col-sm-2 col-xs-12 no-right-padding-div">
                            <Button className="post-btn" htmlType='submit' onClick={this.onFormSubmit}> POST </Button>
                        </div>
                    </div>
                    {/* </form> */}
                </div>
            </div>
        )
    }
}
export default ImageUploadTest;