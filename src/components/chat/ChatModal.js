import React, {useState, useEffect} from "react";
import {Modal} from "antd";
import {
    Grid,
    IconButton,
    List,
    TextField
} from "@material-ui/core";
import {Send} from "@material-ui/icons";
import axios from "axios";
import ChatItem from "./ChatItem";
import Loader from "../common/Loader";
import BaseUrl from '../../config/properties';
import {getToken} from "../utils/_data";

const Chat = require("twilio-chat");

class ChatModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            messages: [],
            loading: false,
            channel: {},
        };
        this.scrollDiv = React.createRef();
    }

    // componentDidMount() {
    //     const { taskEngagementId } = this.props;
    //     const userData = JSON.parse(localStorage.getItem("userData"));
    //     getToken(userData && userData.email)
    //         .then(data => {
    //             console.log("data----->>>>",data)
    //             Chat.Client.create(data && data.data && data.data.token)
    //         })
    //         .then(this.setupChatClient(taskEngagementId))
    //         .catch(this.handleError);
    // }
    // handleError(error) {
    //     console.error(error);
    //     throw new Error("unable to get token, please reload this page");
    // }
    //
    // setupChatClient(client, taskEngagementId) {
    //
    //     console.log("client----------->>>", client, taskEngagementId);
    //     this.client = client;
    //     this.client
    //         .getChannelByUniqueName(taskEngagementId)
    //         .then(channel => channel)
    //         .catch(error => {
    //             if (error.body.code === 50300) {
    //                 return this.client.createChannel({ uniqueName: taskEngagementId });
    //             } else {
    //                 this.handleError(error);
    //             }
    //         })
    //         .then(channel => {
    //             this.channel = channel;
    //             return this.channel.join().catch(() => {});
    //         })
    //         .then(() => {
    //             this.setState({ isLoading: false });
    //             this.channel.getMessages().then(this.messagesLoaded);
    //             this.channel.on('messageAdded', this.messageAdded);
    //         })
    //         .catch(this.handleError);
    // }
    //
    // messagesLoaded(messagePage) {
    //     this.setState({ messages: messagePage.items || [] });
    // }
    //
    // messageAdded(message) {
    //     const { messages } = this.state;
    //     this.setState({
    //         messages: !!messages ? [...messages, message] : [message],
    //     }, () => this.scrollToBottom());
    // }

    componentDidMount = () => {
        this.getChatMessages();
    };

    getAccessToken = async (email) => {
        const response = await getToken(email);
        const {data} = response;
        return data.token;
    };

    getChatMessages = async () => {
        const {taskEngagementId} = this.props;
        const userData = JSON.parse(localStorage.getItem("userData"));
        let token = "";
        let client = "";
        if (!(userData && userData.email) || !taskEngagementId) {
            this.props.history.push("/menteedashboard");
        }

        this.setState({loading: true});

        try {
            token = await this.getAccessToken(userData && userData.email);
            console.log("token ====> ", token)
        } catch {
            throw new Error("unable to get token, please reload this page");
        }

        try {
            client = await Chat.Client.create(token, { logLevel: 'debug' });
            console.log("")
            console.log("client------>>>", client);
            client.on("tokenAboutToExpire", async () => {
                const token = await this.getAccessToken(userData && userData.email);
                await client.updateToken(token);
            });

            client.on("tokenExpired", async () => {
                const token = await this.getAccessToken(userData && userData.email);
                await client.updateToken(token);
            });

            client.on("channelJoined", async (channels) => {
                const {channel} = this.state;
                // getting list of all messages since this is an existing channel
                const messages = await channels.getMessages(100);
                if (channels.channelState.uniqueName === taskEngagementId) {
                    if (messages && messages.items && messages.items.length) {
                        this.setState({messages: messages.items || []});
                    }
                }
                this.scrollToBottom();
            });
        } catch(er) {
            console.log("---", er);
        }

        try {
            const channel = await client.getChannelByUniqueName(taskEngagementId);
            console.log("channelll", channel);
            await this.joinChannel(channel);
            this.setState({channel, loading: false});
        } catch (err) {
            try {
                const channel = await client.createChannel({
                    uniqueName: taskEngagementId,
                    friendlyName: taskEngagementId,
                });
                console.log("channelll====>>>", channel);
                await this.joinChannel(channel);
                this.setState({channel, loading: false});
            } catch {
                throw new Error("unable to create channel, please reload this page");
            }
        }
    };

    joinChannel = async (channel) => {
        if (channel.channelState.status !== "joined") {
            await channel.join();
        }
        channel.on("messageAdded", this.handleMessageAdded);
    };

    handleMessageAdded = (message) => {
        const {messages} = this.state;
        this.setState({
            messages: !!messages ? [...messages, message] : [message],
        }, () => this.scrollToBottom());
    };

    scrollToBottom = () => {
        if (this.scrollDiv && this.scrollDiv.current && this.scrollDiv.current.scrollTop) {
            const scrollHeight = this.scrollDiv.current.scrollHeight;
            const height = this.scrollDiv.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            this.scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }
    };

    sendMessage = () => {
        const {text, channel} = this.state;
        if (text && String(text).trim()) {
            this.setState({loading: true});
            channel && channel.sendMessage(text);
            this.setState({text: "", loading: false});
        }
    };

// sendMessage(event) {
//     this.channel.sendMessage(event.message.text);
// }
    render() {
        const {loading, text, messages, channel} = this.state;
        const {isChatModal, onCancel, taskCompleted} = this.props;
        const userData = JSON.parse(localStorage.getItem("userData"));
        return (
            <div>
                <Modal wrapClassName="chat-with-mentor" title="Chat" visible={isChatModal} onCancel={onCancel}>
                    {loading && <Loader/>}
                    <Grid container direction="column" style={styles.mainGrid}>
                        <Grid item style={styles.gridItemChatList} ref={this.scrollDiv}>
                            <List dense={true}>
                                {messages && messages.length > 0 &&
                                messages.map((message) => (
                                    <ChatItem
                                        key={message.index}
                                        message={message}
                                        email={userData && userData.email}
                                    />
                                ))}
                            </List>
                        </Grid>
                        <Grid item style={styles.gridItemMessage}>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item style={styles.textFieldContainer}>
                                    <TextField
                                        required
                                        style={styles.textField}
                                        placeholder="Enter message"
                                        variant="outlined"
                                        multiline
                                        rows={2}
                                        value={text}
                                        disabled={taskCompleted || !channel}
                                        onChange={(event) =>
                                            this.setState({text: event.target.value})
                                        }
                                    />
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        style={styles.sendButton}
                                        onClick={this.sendMessage}
                                        disabled={!channel || !text}
                                    >
                                        <Send style={styles.sendIcon}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Modal>
            </div>
        )
    }


//PubNub using chat application
// }

// const ChatModal = (props) => {
//     const {taskEngagementId, isChatModal, onCancel} = props;
//     const username = localStorage.getItem("loginName");
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');
//     const scrollDiv = React.createRef();
//     const pubnub = new PubNub({
//         publishKey: "pub-c-9a14fcf5-87f8-46ca-bee8-634a77e14ce8",
//         subscribeKey: "sub-c-3f7913e4-16cd-11ec-914f-5693d1c31269",
//         uuid: taskEngagementId
//     });
//     useEffect(() => {
//         historyFun();
//     }, [message]);
//
//     const historyFun = async () =>{
//         let historyMessage = [];
//         await pubnub.history(
//             {
//                 channel: taskEngagementId,
//                 count: 100,
//                 stringifiedTimeToken: true,
//             },
//             function (status, response) {
//                 if (response) {
//                     response && response.messages.map(item => {
//                         historyMessage.push(item.entry);
//                     });
//                     setMessages(historyMessage);
//                 }
//                 scrollToBottom();
//                 console.log("response.messages------->>>", historyMessage);
//             }
//         );
//     };
//     const handleClick = () => {
//         pubnub.publish({
//             channel: taskEngagementId,
//             message: {"sender": userData && userData.email, "content": message || "codediyApp"}
//         }).then((response) => {
//             console.log("pusher response------>>>>", response);
//         }).catch((error) => {
//             console.log("error---------->>>>", error)
//         });
//         setMessage('');
//     };
//      pubnub.addListener({
//         status: function (s) {
//             const affectedChannelGroups = s.affectedChannelGroups; // Array of channel groups affected in the operation
//             const affectedChannels = s.affectedChannels; // Array of channels affected in the operation
//             const category = s.category; // Returns PNConnectedCategory
//             const operation = s.operation; // Returns PNSubscribeOperation
//             const lastTimetoken = s.lastTimetoken; // Last timetoken used in the subscribe request (type long)
//             const currentTimetoken = s.currentTimetoken; /* Current timetoken fetched in subscribe response,
//                                                 * to be used in the next request (type long) */
//             const subscribedChannels = s.subscribedChannels; // Array of all currently subscribed channels
//             console.log("category---->>>>>",category, subscribedChannels)
//         },
//         // Messages
//         message: function (m) {
//             const channelName = m.channel; // Channel on which the message was published
//             const channelGroup = m.subscription; // Channel group or wildcard subscription match (if exists)
//             const pubTT = m.timetoken; // Publish timetoken
//             const msg = m.message; // Message payload
//             const publisher = m.publisher; // Message publisher
//             console.log("msg----->", msg);
//             console.log("publisher, channelName, channelGroup, pubTT----->", publisher, channelName, channelGroup, pubTT);
//             if (msg) setMessages([...messages, msg])
//             scrollToBottom();
//         },
//     });
//     pubnub.subscribe({
//         channels: [taskEngagementId]
//     });
//     const scrollToBottom = () => {
//     if(scrollDiv && scrollDiv.current && scrollDiv.current.scrollTop){
//         const scrollHeight =  scrollDiv.current.scrollHeight;
//         const height = scrollDiv.current.clientHeight;
//         const maxScrollTop = scrollHeight - height;
//         console.log("sroll", scrollHeight, height, maxScrollTop);
//         scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
//     }
// };
//
//     return (
//         <div>
//             <Modal wrapClassName="chat-with-mentor" title="Chat" visible={isChatModal} onCancel={onCancel}>
//                 <Grid container direction="column" style={styles.mainGrid}>
//                     <Grid item style={styles.gridItemChatList} ref={scrollDiv}>
//                         <List dense={true}>
//                             {messages && messages.length > 0 &&
//                             messages.map((message) => (
//                                 <ChatItem
//                                     key={message.index}
//                                     message={message}
//                                     email={userData && userData.email}
//                                 />
//                             ))}
//                         </List>
//                     </Grid>
//                     <Grid item style={styles.gridItemMessage}>
//                         <Grid
//                             container
//                             direction="row"
//                             justify="center"
//                             alignItems="center"
//                         >
//                             <Grid item style={styles.textFieldContainer}>
//                                 <TextField
//                                     required
//                                     style={styles.textField}
//                                     placeholder="Enter message"
//                                     variant="outlined"
//                                     multiline
//                                     rows={2}
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                 />
//                             </Grid>
//                             <Grid item>
//                                 <IconButton
//                                     style={styles.sendButton}
//                                     onClick={handleClick}
//                                 >
//                                     <Send style={styles.sendIcon}/>
//                                 </IconButton>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             </Modal>
//         </div>
//     )
};

const styles = {
    textField: {width: "100%", borderWidth: 0, borderColor: "transparent", fontSize: 12},
    textFieldContainer: {flex: 1, marginRight: 12},
    gridItem: {paddingTop: 12, paddingBottom: 12},
    gridItemChatList: {overflow: "auto", height: "60vh"},
    gridItemMessage: {marginTop: 12, marginBottom: 12},
    sendButton: {backgroundColor: "#3f51b5"},
    sendIcon: {color: "white"},
    mainGrid: {borderWidth: 1},
};
export default ChatModal;