import React, { Component } from 'react';
import User from './User'
import Button from '@material-ui/core/Button';
import request from 'superagent'

import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: null,
            userToken: null,
        }
    }

    componentDidMount() {

        //get users from github
        // this.getUsers()
        // this.loggedIn()
    }

    // getUsers = async() => {

    //     let response = await fetch(`https://api.github.com/users?since=1&per_page=10`)
    //     const users = await response.json();

    //     this.setState({users: users}, console.log(users))

    // }

    // loggedIn = () => {
    //     if(/code=/.test(window.location.href))
    //     {
    //         //in the url, locate and grab everything after code=
    //         let code = window.location.href.match(/\?code=(.*)/)[1];

    //          request
    //             .post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token')
    //             .send({
    //                 client_id: '1f8d20a913b00db6f9e3',
    //                 client_secret: '51b39ca726f4ab4d774bc6b62cdfa61e6b91fff9',
    //                 code: code
    //             })
    //             .set('Accept', 'application/json')
    //             .then(async res => {
    //               this.setState({userToken: res.body.access_token})
    //                 let response3 = await fetch('https://api.github.com/user', {
    //                     method: 'GET',
    //                     headers: {
    //                       'Accept': 'application/json',
    //                       'Content-Type': 'application/json',
    //                       Authorization: 'Bearer ' + this.state.userToken,
    //                     },
    //                   });
    //                   let responseJson = await response3.json();
    //                   console.log(responseJson)
    //             })
    //             .catch(err => console.log(err))


    //     }
    // }

    render() {

        // let output = this.state.users?
        //     this.state.users.map(x => {
        //         return(
        //            <div key={x.id}>
        //                 <User username={x.login} image={x.avatar_url} auth={this.state.userToken} />
        //             </div>
        //         )
        //     })
        //     :
        //     null

        return (
            <div className="App">
                // <a href="https://github.com/login/oauth/authorize?client_id=1f8d20a913b00db6f9e3"> login </a>
            </div>
        )
    }
}

