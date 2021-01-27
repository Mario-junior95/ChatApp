import React, { Component } from "react";
import io from "socket.io-client";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import "./App.css";

const styles = {
  container: {
    padding: 20,
    borderTop: "1px #4C758F solid",
    marginBottom: 20,
  },
  form: {
    display: "flex",
  },
  input: {
    color: "inherit",
    background: "none",
    outline: "none",
    border: "none",
    flex: 1,
    fontSize: 16,
  },
  getEmojiButton: {
    cssFloat: "right",
    border: "none",
    margin: 0,
    cursor: "pointer",
  },
  emojiPicker: {
    position: "absolute",
    bottom: 10,
    right: 0,
    cssFloat: "right",
    marginLeft: "200px",
  },
};

class App extends Component {
  state = {
    isConnected: false,
    id: null,
    peeps: [],
    peepsConnected: [],
    input: {},
    text: "",
    buttonclicked: false,
  };
  socket = null;

  componentWillMount() {
    this.socket = io("https://codi-server.herokuapp.com");

    this.socket.on("connect", () => {
      this.setState({ isConnected: true });
    });

    this.socket.on("pong!", () => {
      console.log("the server answered!");
    });

    this.socket.on("pong!", (additionalStuff) => {
      console.log("server answered!", additionalStuff);
    });

    this.socket.on("disconnect", () => {
      this.setState({ isConnected: false });
    });

    this.socket.on("youare", (answer) => {
      this.setState({ id: answer.id });
    });

    /** this will be useful way, way later **/
    this.socket.on("room", (old_messages) => {
      console.log(old_messages);
      this.setState({ peepsConnected: old_messages });
    });
  }

  componentWillUnmount() {
    this.socket.close();
    this.socket = null;
  }

  addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    this.setState({
      text: this.state.text + emoji,
      buttonclicked: false,
    });
  };

  onClickButton = (e) => {
    e.preventDefault();
    this.setState({
      buttonclicked: true,
    });
  };

  render() {
    return (
      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="col-md-8 col-xl-6 chat">
            <div className="card">
              <div className="card-header msg_head">
                <div className="d-flex bd-highlight">
                  <div className="user_info">
                    <span>Groupe B06</span>
                    <p>
                      {this.state.peepsConnected.length} messages <br />
                      {this.state.isConnected ? "connected" : "disconnected"}
                    </p>
                  </div>
                  <div className="video_cam">
                    <span>
                      <i className="fas fa-video"></i>
                    </span>
                    <span>
                      <i className="fas fa-phone"></i>
                    </span>
                  </div>
                </div>
                <span id="action_menu_btn">
                  <i className="fas fa-ellipsis-v"></i>
                </span>
                <div className="action_menu">
                  <ul>
                    <li>
                      <i className="fas fa-user-circle"></i> View profile
                    </li>
                    <li>
                      <i className="fas fa-users"></i> Add to close friends
                    </li>
                    <li>
                      <i className="fas fa-plus"></i> Add to group
                    </li>
                    <li>
                      <i className="fas fa-ban"></i> Block
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body msg_card_body">
                {this.state.peepsConnected.map((val, index) => {
                  if (val.name === "Mario") {
                    return (
                      <div
                        className="d-flex justify-content-end mb-4"
                        key={index}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p className="name">Me</p>
                          <div className="msg_cotainer_send">
                            {val.text}
                            <span className="date">{val.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className="d-flex justify-content-start mb-4"
                        key={index}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p className="name">{val.name}</p>
                          <div className="msg_cotainer">
                            {val.text}
                            <span className="date">{val.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text attach_btn">
                      {this.state.buttonclicked ? (
                        <span style={styles.emojiPicker}>
                          <Picker onSelect={this.addEmoji} />
                        </span>
                      ) : null}
                      <button onClick={this.onClickButton}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path
                            fill="currentColor"
                            d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
                          ></path>
                        </svg>
                      </button>
                    </span>
                  </div>
                  <textarea
                    name=""
                    className="form-control type_msg"
                    placeholder="Type your message..."
                    value={this.state.text}
                    onChange={(e) =>
                      this.setState(
                        { input: e.target.value },
                        this.setState({ text: e.target.value }),

                        e.preventDefault()
                      )
                    }
                  ></textarea>
                  <div className="input-group-append">
                    <span className="input-group-text send_btn">
                      <button
                        onClick={() =>
                          this.socket.emit("message", {
                            id: this.state.id,
                            name: "Mario",
                            text: this.state.input,
                          })
                        }
                      >
                        Send
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
