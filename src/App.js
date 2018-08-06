import React, { Component } from 'react';
import User from './User'
import {Redirect} from 'react-router-dom';
import request from 'superagent'

import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props)

        this.token = localStorage.getItem("token")


        this.state = {
            users: null,
            authUser: null,
            userToken: this.token,
            signedIn: false
        }
    }

    componentDidMount() {
            console.log(this.token, 'token')


        //check for auther=nticate user
        // this.isAuth()

        //get users from github
        // this.getUsers()

        //if there is a code parameter, perform a user login
        this.logIn()
    }

    // isAuth = async () => {

    //      let response3 = await fetch('https://api.github.com/user', {
    //                             method: 'GET',
    //                             headers: {
    //                               'Accept': 'application/json',
    //                               'Content-Type': 'application/json',
    //                               'Authorization': 'Bearer ' +  res.body.access_token
    //                             },
    //                           })

    //     //convert to json
    //     let responseJson = await response3.json();

    //     //save authenticated user data to state
    //     this.setState({
    //         authUser: responseJson
    //     })
    // }

    getUsers = async() => {

        //make get request to github api to fetch list of users
        let response = await fetch(`https://api.github.com/users?since=1&per_page=10`)

        //convert to json
        const users = await response.json();

        //set state with the acquired data
        this.setState({users: users})
    }

    //perform github oauth
    logIn = async e => {

        //if the url contains a code parameter
        if(/code=/.test(window.location.href))
        {
            //locate and grab every character after code=
            let code = window.location.href.match(/\?code=(.*)/)[1];

            /*~~~~~~~~~~~~~~~~~~ ACQUIRE ACCESS TOKEN ~~~~~~~~~~~~~~~*/

            //perform a post request in order to receive an access token to identify a user
            request
                .post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token')
                .send({
                    client_id: '1f8d20a913b00db6f9e3',
                    client_secret: '51b39ca726f4ab4d774bc6b62cdfa61e6b91fff9',
                    code: code,
                })
                .set('Accept', 'application/json')
                .then(async res => {

                    /*~~~~~~~~~~~~~~~~~~ USE ACCESS TOKEN ~~~~~~~~~~~~~~~*/

                     //save token to localstorage
                    localStorage.setItem('token', res.body.access_token);


                    this.setState({userToken: res.body.access_token})

                    //fetch authenticated user data
                    let response3 = await fetch('https://api.github.com/user', {
                                            method: 'GET',
                                            headers: {
                                            'Accept': 'application/vnd.github.v3+json',
                                              'Content-Type': 'application/json',
                                              'Authorization': 'Bearer ' +  res.body.access_token
                                            },
                                          })

                    //convert to json
                    let responseJson = await response3.json();

                    localStorage.setItem("user", responseJson);


                    //save authenticated user data to state
                    this.setState({
                        authUser: responseJson
                    } , () => {return window.location.href = '/'})
                })
                .catch(err => console.log(err))
        }
        else
        {
            console.log(this.token, 'token reload')
             let response5 = await fetch('https://api.github.com/user', {
                                method: 'GET',
                                headers: {
                                  'Accept': 'application/vnd.github.v3+json',
                                  'Authorization': 'Bearer ' +  this.token
                                },
                              })

                //convert to json
                let responseJson2 = await response5.json();

                //save authenticated user data to state
                this.setState({
                    authUser: responseJson2
                }, console.log(this.state.authUser, 'user reloaded'))
        }
    }

    render() {

        //render list of users
        let output = this.state.users&&
                        this.state.users.map(x => {
                            return (
                               <div key={x.id}>
                                    <User username={x.login} image={x.avatar_url} />
                                </div>
                            )
                        })

        //render authenticated users profile
        let userProfile =  this.state.authUser?
                            <User
                                username={this.state.authUser.login}
                                image={this.state.authUser.avatar_url}
                                authUser={this.state.authUser}

                            />
                            :
                            null

        return (
            <div className="App">
                <a href="https://github.com/login/oauth/authorize?client_id=1f8d20a913b00db6f9e3&scope=user"> login </a>

                {userProfile}
                {output}

            </div>
        )
    }
}

