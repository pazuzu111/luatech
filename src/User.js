// import React from 'react';
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
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
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

        let response = await fetch(`https://api.github.com/users/${userLogin}`)
//         let response2 = await fetch(`https://api.github.com/users/${userLogin}/repos`)

        const user = await response.json()
//         const userRepos = await response2.json()

        this.setState({
            open: true,
            user: user.bio,

        }, console.log(user, 'hello'))
    }

    handleClose = () => {
        this.setState({ open: false })
    }

  render() {
    const { classes } = this.props;

//     // let repos = this.state.userRepos&&
//     //             this.state.userRepos.map(x => {
//     //                 return (
//     //                     <div key={x.id}>
//     //                         <p>{x.full_name}</p>
//     //                         <p>{x.language}</p>
//     //                         <p>{x.open_issues}</p>
//     //                         <p>{x.watchers}</p>
//     //                         <p>{x.forks}</p>
//     //                     </div>

//     //                 )
//     //             })

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
                {this.state.user}
                </Typography>
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
