import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';


class User extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            userBio: null,
            userRepos: null
        };
    }

    //open modal
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

    //save new bio
    editBio = async (e) => {

        //prevent default behavior -> page reload
        e.preventDefault()

        //make patch request to authenticated user endpoint
        let response4 = await fetch('https://api.github.com/user', {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
            },
            body: JSON.stringify({bio: this.bio.value})
        })

        //convert to json
        let responseJson = await response4.json();

        //set new state
        this.setState({userBio: responseJson.bio})
    }

  render() {
    const { classes } = this.props;

    //check for repo data and render
    let repos = this.state.userRepos&&
                this.state.userRepos.map((x,i) => {
                    return (
                        <div key={x.i}>
                            <h1> Repo # {x.id}</h1>
                            <p>Name: {x.name}</p>
                            <p>Lanaguage: {x.language}</p>
                            <p>Open-issues: {x.open_issues}</p>
                            <p>Watchers: {x.watchers}</p>
                            <p>Forks: {x.forks}</p>
                        </div>
                    )
                })

    //Check for token and render
    let editForm = this.props.authUser&&
                        <div>
                            <form onSubmit={this.editBio}>
                              <input ref={input => this.bio = input} />
                              <input type="submit" value="submit" />
                            </form>
                        </div>

    //if a user is logged in, their card will be white
    //otherwise is will be transparent
    let user = !this.props.authUser? classes.card : classes.authCard

    return (
      <div>
      <Card className={user}>
        <CardContent>
            <Typography className={classes.title} color="textSecondary">
                <img src={this.props.image} alt="userImage" height="100px" width="100px" />
            </Typography>

            <Typography variant="headline" component="h2" color="secondary">
                {this.props.username}
            </Typography>

            <a href={this.props.html_url}> check out my github </a>
        </CardContent>

        <CardActions>
          <Button className={classes.login} size="small" onClick={() => this.handleOpen(this.props.username)}> more info </Button>
        </CardActions>
      </Card>

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
                    <br/>
                    Edit Bio: {editForm}
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

//experimenting with different styling patterns
function getModalStyle() {

  return {
    top: `25%`,
    left: `35%`,
    overflow: 'scroll'
  };
}

//styles for material components
const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    height: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    color: 'black'
  },
   card: {
    minWidth: 275,
    backgroundColor: 'transparent'
  },
  authCard: {
    minWidth: 275,
    backgroundColor: 'white'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  login: {
    '&:hover': {
      color: 'red'
    }
  }
});

const ModalWrapped = withStyles(styles)(User);

export default ModalWrapped;
