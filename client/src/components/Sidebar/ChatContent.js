import React from "react";
import { Badge, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
    alignItems: 'center',
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
  notificationIcon: {
    marginRight: 20
  },
  boldTextPreview: {
    fontWeight: 'bold'
  },
  normalWeightTextPreview: {
    fontWeight: 'normal'
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={[
            classes.previewText,
            conversation.isUnreadMessage ? classes.boldTextPreview : classes.normalWeightTextPreview
          ].join(' ')}>
          {latestMessageText}
        </Typography>
      </Box>
      <Box>
        <Badge className={classes.notificationIcon} color="primary" badgeContent={conversation.unreadMessagesCount} />
      </Box>
    </Box>
  );
};

export default ChatContent
