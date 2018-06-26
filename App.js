import React from 'react'
import Chatkit from '@pusher/chatkit'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

import { tokenURL, instanceLocator } from './config'

class App extends React.Component {

    constructor() {
        super()
        this.state = {
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }

        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
      const chatManager = new Chatkit.ChatManager({
          instanceLocator,
          userID: 'Corey',
          tokenProvider: new Chatkit.TokenProvider({
              url: tokenUrl
          })
      })

      chatManager.connect()
      .then(currentUser => {
          this.currentUser = currentUser

          this.currentUsergetJoinableRooms()
          .then(joinableRooms => {
              this.setState({
                  joinableRooms,
                  joinedRooms: this.currentUser.rooms
              })
          })
          .catch(err => console.log('error on joinableRooms: ', errr))

          this.currentUser.subscribeToRoom({
              roomId: 10328672,
             // messageLimit: 20, // set message limit per room - default 20
              hooks: {
                  onNewMessage: message => {
                      this.setState({
                          messages: [...this.state.messages, message]
                      })
                  }
              }
          })
      })
      .catch(err => console.log('error on connecting: ', errr))

    }

    snedMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: 10328672
        })
    }

    render() {
        return (
            <div className="app">
                <RoomList rooms={...this.state.joinableRooms. ...this.state.joinedRooms}/>
                <MessageList messages={this.state.messages} />
                <SendMessageForm sendMessage={this.sendMessage} />
                <NewRoomForm />
            </div>
        );
    }
}

export default App
