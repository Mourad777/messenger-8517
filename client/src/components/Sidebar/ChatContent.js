import React from "react";
import { Badge, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
    alignItems:'center',
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  notificationIcon:{
    marginRight:20
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation,user:currentUser } = props;
  const { latestMessageText, otherUser } = conversation;

  const numberOfUnreadMessages = conversation.messages.filter(m=>{
    return !m.isRead && m.senderId !== currentUser.id
  }).length

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      <Box>
        <Badge className={classes.notificationIcon} color="primary" badgeContent={numberOfUnreadMessages} />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(ChatContent);
