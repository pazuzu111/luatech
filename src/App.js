import React, { Component } from 'react';
import User from './User'
// import Button from '@material-ui/core/Button';
import request from 'superagent'

import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: null,
            userToken: null,
            authUser: []
        }
    }

    componentDidMount() {

        //get users from github
        this.getUsers()

        //if there is a code parameter, perform a user login
        this.logIn()
    }

    getUsers = async() => {

        //make get request to github api to fetch list of users
        let response = await fetch(`https://api.github.com/users?since=1&per_page=10`)

        //convert to json
        const users = await response.json();

        //set state with the acquired data
        this.setState({users: users}, console.log(users))
    }


    //perform user github oauth
    logIn = () => {

        //if the url contains a code parameter
        if(/code=/.test(window.location.href))
        {
            //locate and grab everything after code=
            let code = window.location.href.match(/\?code=(.*)/)[1];

            //perform a post request in order to receive a access token to identify users
            request
                .post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token')
                .send({
                    client_id: '1f8d20a913b00db6f9e3',
                    client_secret: '51b39ca726f4ab4d774bc6b62cdfa61e6b91fff9',
                    code: code
                })
                .set('Accept', 'application/json')
                .then(async res => {

                    //set state with access token
                    this.setState({userToken: res.body.access_token})

                    //fetch authenticated user data
                    let response3 = await fetch('https://api.github.com/user', {
                        method: 'GET',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          Authorization: 'Bearer ' + this.state.userToken,
                        },
                    });

                    //convert to json
                    let responseJson = await response3.json();
                    this.setState({
                        authUser: responseJson
                    })
                    console.log(this.state.authUser, 'auth')
                })
                .catch(err => console.log(err))
        }
    }

    render() {

        let output = this.state.users?
            this.state.users.map(x => {
                return (
                   <div key={x.id}>
                        <User username={x.login} image={x.avatar_url} />
                    </div>
                )
            })
            :
            null

        return (
            <div className="App">
                <a href="https://github.com/login/oauth/authorize?client_id=1f8d20a913b00db6f9e3"> login </a>
                {this.state.userToken && this.state.authUser&&
                    <User
                        username={this.state.authUser.login}
                        image={this.state.authUser.avatar_url}
                        auth={this.state.userToken}
                        authUser={this.state.authUser}
                    />
                }

                                {output}

            </div>
        )
    }
}

