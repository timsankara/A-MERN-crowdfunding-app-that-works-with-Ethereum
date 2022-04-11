import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
let jwt = require('jsonwebtoken')

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    componentDidMount() {
        let token = (localStorage.getItem("token"))
        if (token) {
            let { email } = jwt.decode(JSON.parse(token))
            this.setState({ email })
        } else {
            // alert('Please Sign in to donate')
            // window.location.href = '/login'
        }
    }

    render() {
        return (
            <header className='navbar fixed-top' style={{ backgroundColor: "#040c39" }}>
                {/* <Link className='navbar__title navbar__item text-white' to="/">Home</Link> */}
                {/* <Link className='navbar__title navbar__item text-white' to="https://nema.go.ke"> */}
                {/* <img src={require("../assets/logo1.jpg")} style={{height: "50px"}}/> */}


                {

                    (localStorage.token) ?
                        <div className="container">
                            {/* {
                                (String(localStorage.isAdmin) !== "true") ?
                                    <Link className='navbar__title navbar__item text-white' to="/reports">
                                        <BiHome style={{ width: "40px", height: "30px" }} />
                                    </Link> 
                                    :
                                    <Link className='navbar__title navbar__item text-white' to="/admin">
                                        <BiHome style={{ width: "40px", height: "40px" }} />
                                    </Link>
                            } */}
                            {/* <Link className='navbar__title navbar__item text-white' to="">
                                <IoIosArrowBack style={{width: "40px", height: "40px"}}/>
                            </Link> */}
                            {/* <IoIosArrowBack style={{ width: "40px", height: "30px" }} onClick={() => this.props.history.goBack()} /> */}
                            <Link className='navbar__item text-white ' to="/">Home</Link>
                            <Link className='navbar__item text-white ' to="/notifications">
                                Notifications - {this.state.email}
                            </Link>
                            <Link className='navbar__item text-white'
                                onClick={(e) => {
                                    localStorage.removeItem("token")
                                    window.location.reload()
                                }}
                                to="/"
                            >
                                Log Out
                            </Link>
                        </div>
                        : <div className="container">
                            <Link className='navbar__item text-white ' to="/">Home</Link>
                            <Link className='navbar__item text-white ' to="/register">Register</Link>
                            <Link className='navbar__item text-white' to="/login">Login</Link>
                        </div>
                }
                {/* <Link className='navbar__item text-dark' to="/register">Register</Link>
                <Link className='navbar__item text-dark' to="/">Login</Link> */}
                {/* <Link className='navbar__item'>Help</Link> */}
            </header>
        )
    }
}

export default withRouter(NavBar)