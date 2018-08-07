import React, { Component } from 'react';
import User from './User'
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import request from 'superagent'

import './App.css';


class App extends Component {
    constructor(props) {
        super(props)

        this.token = localStorage.getItem("token")

        this.state = {
            users: null,
            authUser: null,
            userToken: this.token || null,
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
        let response = await fetch(`https://api.github.com/users?since=0&per_page=10`)

        //convert to json
        const users = await response.json();

        //set state with the acquired data
        this.setState({users: users})
    }

    //perform github oauth request -> should be done on server!,
    // done on client for demonstrational purposes only
    logIn = async e => {

        //if the url contains a code parameter
        if(/code=/.test(window.location.href))
        {
            //locate and grab every character after code=
            let code = window.location.href.match(/\?code=(.*)/)[1];

            /*~~~~~~~~~~~~~~~~~~ ACQUIRE ACCESS TOKEN ~~~~~~~~~~~~~~~*/

            //perform a post request in order to receive an access token to identify user
            request
                .post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token')
                .send({
                    client_id: '1f8d20a913b00db6f9e3',
                    client_secret: '51b39ca726f4ab4d774bc6b62cdfa61e6b91fff9',//should be hidden in .env file
                    code: code,
                })
                .set('Accept', 'application/json')
                .then(async res => {

                    /*~~~~~~~~~~~~~ USE ACCESS TOKEN FOR AUTH ~~~~~~~~~~~~~~~*/

                     //save token to localstorage
                    localStorage.setItem('token', res.body.access_token);

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

                    //save authenticated user data to state & redirect to home
                    this.setState({
                        authUser: responseJson
                    } , () => {return window.location.href = '/'})
                })
                .catch(err => console.log(err))
        }
        else
        {
            /*~~~~~~~~~~~~ USER ALREADY LOGGED IN! ~~~~~~~~~~~~~~*/

            //fetch authenticated user data
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
            })
        }
    }

    render() {

        const { classes } = this.props;

        //render list of users
        let output = this.state.users&&
                        this.state.users.map(x => {
                            return (
                               <Grid item md={4} key={x.id}>
                                    <User username={x.login} image={x.avatar_url} url={x.url} />
                                </Grid>
                            )
                        })

        //render authenticated user's profile
        let userProfile =  this.token && this.state.authUser?
                            <Grid item md={4}>
                                <User
                                    username={this.state.authUser.login}
                                    image={this.state.authUser.avatar_url}
                                    authUser={this.state.authUser}
                                />
                            </Grid>
                            :
                            null

    return (
        <div className={[classes.root,'App.css']}>
            <a id='login' href="https://github.com/login/oauth/authorize?client_id=1f8d20a913b00db6f9e3&scope=user"> login </a>

            <Grid container spacing={24} justify="center">
                {userProfile}
                {output}
            </Grid>
        </div>
    )
    }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

//styles for grid and paper component
const styles = theme => ({
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'left',
        color: 'grey',
        backgroundColor: 'grey',
        border: 'none',
        boxShadow: theme.shadows[5]
      },
    });

export default withStyles(styles)(App);
