import React, {Component} from 'react'
import "./Login.css";
import {setInToStorage} from "../../config/common";
import {menteeLogin} from "../utils/_data";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                email: '',
                password: '',
            },
            errors: {
                email: '',
                password: '',
            },
            candidateList: {},
            isLoading: false
        };

    }

    onChange = (e) => {
        this.setState({
            errors: {
                ...this.state.errors,
                [e.target.name]: this.validate(e.target.name, e.target.value),
            },
            fields: {
                ...this.state.fields,
                [e.target.name]: e.target.value,
            }
        });
    };

    validate = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) {
                    return 'Email is required';
                } else if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)) {
                    return 'Email is invalid';
                } else {
                    return '';
                }
            case 'password':
                if (!value) {
                    return 'Password is required';
                } else {
                    return '';
                }
            default: {
                return ''
            }
        }
    };

    onSave = async () => {
        const {fields} = this.state;
        let validationErrors = {};
        Object.keys(fields).forEach(name => {
            const error = this.validate(name, fields[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            this.setState({errors: validationErrors});
            return;
        }else {
            const result=await menteeLogin(fields);
            if(result?.data?.success){
                setInToStorage({
                    'isVisible': false,
                    'userData': result && JSON.stringify(result.data.getFindUser),
                    'authToken': result && result.data && result.data.menteeToken,
                    'id': result && result.data && result.data.getFindUser && result.data.getFindUser._id,
                    'isMentor': result && result.data && result.data.getFindUser && result.data.getFindUser.isMentor || false,
                    'isLoggedIn': result && result.data && result.data.getFindUser && result.data.getFindUser.isLoggedIn,
                    'loginName': `${result && result.data && result.data.getFindUser && result.data.getFindUser.name}`,
                    'userType': 'user',
                })
                window.location.href = "/tasklist";

            }else {
                console.log("error");

            }
        }
    };

    render() {
        const {errors, fields, isLoading} = this.state;
        // if (isLoading) return <Loader/>;
        return (
            <div className="container login-page">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="heading">
                            <h1>Log in</h1>
                        </div>
                        <div className="form-group mt-4">
                            <input type="email" className="form-control form-control-lg" name="email"
                                   value={fields.email}
                                   onChange={this.onChange} placeholder="Username"/>
                            <p className="text-danger">{errors.email}</p>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control form-control-lg" name="password"
                                   value={fields.password} onChange={this.onChange} placeholder="Password"/>
                            <p className="text-danger">{errors.password}</p>
                        </div>
                        <div className="form-group">
                            <button className="btn1 btn-primary mb1 bg-teal btn-lg btn-block"
                                    onClick={this.onSave}>Login
                            </button>
                        </div>
                        <div className="form-group">
                            <a className="text-info">Forgot Your Password?</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Index;