import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: 'scroll'
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    height: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class User extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            user: null,
        };
    }



    handleOpen = async userLogin => {

        //fetch single user data along with repos that belong to that user
        let response = await fetch(`https://api.github.com/users/${userLogin}`)
        let response2 = await fetch(`https://api.github.com/users/${userLogin}/repos`)

        //convert to json
        const user = await response.json()
        const userRepos = await response2.json()

        //set state with data acquired
        this.setState({
            open: true,
            userBio: user.bio,
            userRepos: userRepos

        }, console.log(user, 'hello'))
    }

    //close modal
    handleClose = () => {
        this.setState({ open: false })
    }


    editBio = async (e) => {
        e.preventDefault()

         let response4 = await fetch('https://api.github.com/user', {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem("token"),
            },
            body: JSON.stringify({bio: this.bio.value})
        })
        let responseJson = await response4.json();
        this.setState({userBio: responseJson.bio})

    }

    getAuthUser = async () => {

         let response3 = await fetch('https://api.github.com/user', {
                        method: 'GET',
                        headers: {
                          'Accept': 'application/json',
                          'Authorization': 'Bearer ' + localStorage.getItem("token")
                        },
                    });

                    //convert to json
                    let responseJson = await response3.json();

                    console.log(responseJson, 'fdsar')

    }



  render() {
    const { classes } = this.props;

    let repos = this.state.userRepos&&
                this.state.userRepos.map(x => {
                    return (
                        <div key={x.id}>
                            <h1> Repo # {x.id}</h1>
                            <p>Name: {x.name}</p>
                            <p>Lanaguage: {x.language}</p>
                            <p>Open-issues: {x.open_issues}</p>
                            <p>Watchers: {x.watchers}</p>
                            <p>Forks: {x.forks}</p>
                        </div>

                    )
                })

    let editForm = this.props.token&&
                        <div>
                            <form onSubmit={this.editBio}>
                              <input ref={input => this.bio = input} />
                              <input type="submit" value="Submit" />
                            </form>
                        </div>

    return (
      <div>
        <Button onClick={() => this.handleOpen(this.props.username)}>
            {this.props.username}
            <img src={this.props.image} alt="userImage" height="100px" width="100px" />
        </Button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
            <div style={getModalStyle()} className={classes.paper}>
                <img src={this.props.image} alt="userImage" height="100px" width="100px" />
                <Typography variant="title" id="modal-title">
                    Bio: {this.state.userBio}

                    {editForm}
                </Typography>
                {repos}
            </div>
        </Modal>
      </div>
    );
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
};

const ModalWrapped = withStyles(styles)(User);

export default ModalWrapped;
