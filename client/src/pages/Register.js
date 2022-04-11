import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import toast from 'react-hot-toast'

export class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: ""
        }
    }

    register = (e) => {
        e.preventDefault()

        // make a request to the backedn to save this user
        axios.post("/api/auth/signup", {
            email: this.state.email,
            password: this.state.password
        })
            .then(response => {
                toast(response.data.message)
                if (response.data.status == 200) { // register the user
                    this.props.history.push("/login") // then send the user to the login page
                }
            })
            .catch(err => {
                console.log("error in application: ", err)
            })
    }

    test = () => {
        axios.post("/testRoute/createUser", {}).then(response => console.log(response))
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="container-fluid hero" style={{height: '100vh'}}>
                {/* <div className="row">
                    <div className="col-6 my-5 mx-auto">
                        <div className="card" style={{ backgroundColor: "#DAEAC5" }}>
                            <h1 className="display-5">Register</h1>
                            <label>Username</label>
                            <input className="col-6 mx-auto mb-3 form-control" onChange={(e) => this.setState({ username: e.target.value })} />
                            <label>Email</label>
                            <input className="col-6 mx-auto mb-3 form-control" type="email" onChange={(e) => this.setState({ email: e.target.value })} />
                            <label>Password</label>
                            <input className="col-6 mx-auto mb-3 form-control" onChange={(e) => this.setState({ password: e.target.value })} />
                            <button className="btn btn-success col-6 mx-auto my-5" onClick={this.register}>Register</button>
                        </div>
                    </div>
                </div> */}
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto card o-hidden border-0 shadow-lg my-5">
                        <div className="text-center">
                            <h1 className="h1 text-gray-900 mb-0">Register</h1>
                        </div>
                        <hr />
                        <div className="card-body p-0">
                            <div className="p-3">
                                <form onSubmit={this.register}>
                                    <input
                                        type="email"
                                        className="form-control form-control-user col-sm-9 mx-auto mb-1"
                                        onChange={(e) => this.setState({ email: e.target.value })}
                                        placeholder="Email Address"
                                        required
                                    />
                                    <input
                                        type="password"
                                        className="form-control form-control-user col-sm-9 mx-auto my-1"
                                        onChange={(e) => this.setState({ password: e.target.value })}
                                        placeholder="Password"
                                        required
                                    />
                                    <button className="btn btn-success btn-user btn-block col-sm-4 mx-auto mt-3">
                                        Register
                                    </button>
                                </form>
                            </div>
                            {/* </div> */}
                            {/* </div> */}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(Register)
