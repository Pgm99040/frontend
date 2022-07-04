import React from "react";
import {ListItem} from "@material-ui/core";

class ChatItem extends React.Component {
    render() {
        const {message, email} = this.props;
        console.log("message", message);
        const isOwnMessage = message?.state?.author === email;
        // const isOwnMessage = message?.sender === email;
        return (
            <ListItem style={styles.listItem(isOwnMessage)}>
                <div style={styles.author}>{message.author}</div>
                <div style={styles.container(isOwnMessage)}>
                  {message?.state?.body}
                  <div style={styles.timestamp}>
                    {new Date(message?.state?.dateUpdated?.toISOString()).toLocaleString()}
                  </div>
                </div>


                {/*pubnum*/}
                {/*<div style={styles.author}>{message.sender}</div>*/}
                {/*<div style={styles.container(isOwnMessage)}>*/}
                {/*    {message?.content}*/}
                {/*    /!*<div style={styles.timestamp}>*!/*/}
                {/*    /!*    {new Date(message?.state?.dateUpdated?.toISOString()).toLocaleString()}*!/*/}
                {/*    /!*</div>*!/*/}
                {/*</div>*/}
            </ListItem>
        );
    }
}

const styles = {
    listItem: (isOwnMessage) => ({
        flexDirection: "column",
        alignItems: isOwnMessage ? "flex-end" : "flex-start",
    }),
    container: (isOwnMessage) => ({
        maxWidth: "75%",
        borderRadius: 12,
        padding: 16,
        color: "white",
        fontSize: 12,
        backgroundColor: isOwnMessage ? "#054740" : "#262d31",
    }),
    author: {fontSize: 10, color: "gray"},
    timestamp: {fontSize: 8, color: "white", textAlign: "right", paddingTop: 4},
};

export default ChatItem;
