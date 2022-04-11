import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from "react-router-dom";
import toast from 'react-hot-toast'
let jwt = require('jsonwebtoken')
export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            user: "",
            location: [],
            time: "",
            isLoggedIn: false,
            workDayStartHidden: true,
            workDayEndHidden: true,
            loginFormHidden: false,
            signoutBtnHidden: false,
            supervisorLoginHidden: false
        }
    }

    componentDidMount() {
        // navigator.geolocation.getCurrentPosition((location) => {
        //     let lat = location.coords.latitude
        //     let long = location.coords.longitude
        //     this.setState({ location: [lat, long] })
        // })

        // axios.post("/api/loginSessions/find", { sessionId: localStorage.sessionId })
        //     .then(response => {
        //         if (response.data.session.isLoggedin) {
        //             this.setState({ isLoggedIn: true })
        //             console.log(response.data.session.isLoggedin)
        //         } else {
        //             console.log(response.data)
        //         }
        //         // console.log((response.data.session.isLoggedin))
        //     })
    }

    login = async (e) => {
        e.preventDefault()
        axios.post("/api/auth/signin", { email: this.state.email, password: this.state.password })
            .then(response => {
                alert(response.data.msg)
                if (response.data.action === "next") {
                    localStorage.setItem("token", JSON.stringify(response.data.accessToken))
                    this.props.history.push("/")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    logout = () => {
        axios.post("/api/loginSessions/end", { sessionId: localStorage.sessionId })
            .then(response => {
                toast(response.data.msg)
            })
        this.setState({ workDayEndHidden: false })
        this.setState({ signoutBtnHidden: true })
    }

    endWorkDay = () => {

    }

    render() {
        return (
            <div className="container-fluid hero" style={{ height: '100vh' }}>
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 card shadow-lg mt-5 mx-auto">
                        <div className="card-body p-0">
                            <h1 className="h1 text-gray-900 mb-0">Sign In</h1>
                            <hr />
                            <form className="p-3" onSubmit={this.login}>
                                <input
                                    placeholder="Email"
                                    className="mx-auto col-sm-10 mb-3 form-control text-input"
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                    required
                                    type="email"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="mx-auto col-sm-10 mb-3 form-control text-input"
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    required
                                    type="password"
                                />
                                <button
                                    className="btn btn-success text-white col-5 mx-auto mb-3 btn-user"
                                >Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withRouter(Login)
