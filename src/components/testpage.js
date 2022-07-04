import React from 'react';
import BaseUrl from '../config/properties';
import { Input } from 'antd'
import { answerAdd } from "./utils/_data";
const { TextArea } = Input;
class Testpage extends React.Component {
    constructor() {
        super();
        this.state = {
          MyHtmlContent: '<div> <h2>Welcome to CodeDIY React !</h2></div>',
        };
        this.handleUploadImage = this.handleUploadImage.bind(this);
      }

      handleUploadImage = async (event) =>{
        event.preventDefault();
        // const url = BaseUrl.base_url+'/api/v1/te/submission';
        var answer_description = document.getElementById('answer_description').value;
        const formData = new FormData();
        formData.append('file',this.uploadInput.files[0])
        formData.append('taskEngagementId','5acca2a931520c2f6a036a03');
        formData.append('uploadedBy','user');
        formData.append('description',answer_description);
        formData.append('userId','5ac3405887945f1d07e151f4');
        // const config = {
        //     headers: {
        //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInBsYXRmb3JtIjoid2ViIiwia2V5IjoiZGFuLnByZWV0aGlAZ21haWwuY29tIiwiaWF0IjoxNTIzMzYwMzg5LCJleHAiOjE1MjU5NTIzODl9.Bp951XWf-ySFJgaxddDltmq1t9iL-2GuEwh8J-R_SMc'
        //     }
        // }
        //return  axios.post(url, JSON.stringify(formData),config)

        /* fileUpload(file){
            const url = BaseUrl.base_url+'/api/v1/te/submission';
            var answer_description = document.getElementById('answer_description').value;
            const formData = new FormData();
            formData.append('taskEngagementId',this.props.taskEngagementId)
            formData.append('uploadedBy','user')
            formData.append('description',answer_description)
            formData.append('userId',localStorage.getItem('id'))
            formData.append('file',file)
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('authToken')
                }
            }
            return  axios.post(url, JSON.stringify(formData),config)
    
           }*/

        const res = await answerAdd(formData);
          if(res?.data?.status_code === 200 || res?.data?.status_code === 201 ) {
              console.log("succuess")
          } else {
              console.log("error----->");
          }

        // fetch(url, {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInBsYXRmb3JtIjoid2ViIiwia2V5IjoiZGFuLnByZWV0aGlAZ21haWwuY29tIiwiaWF0IjoxNTIzMzYwMzg5LCJleHAiOjE1MjU5NTIzODl9.Bp951XWf-ySFJgaxddDltmq1t9iL-2GuEwh8J-R_SMc'
        //     }
        //     }).then((response) => {
        //     response.json().then((body) => {
        //        console.log("succuess")
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
        // });
      };

    render() {
        return (
            <div>
                <form onSubmit={this.handleUploadImage}>
                <div dangerouslySetInnerHTML={{ __html: this.state.MyHtmlContent }}/>
                <h1>File Upload</h1>
                <TextArea rows={6} id='answer_description' placeholder="Write description here.." className="margin-Bottom" />
                <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                <button type="submit">Upload</button>
                </form>
            </div>
        )
    }
}

export default Testpage;