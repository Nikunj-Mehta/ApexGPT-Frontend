import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners"; // This is a npm package use to display bounce effect in the loading time, after we send req and before we receive a response 

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat } = useContext(MyContext);
  const [loading, setLoading] = useState(false); // State variable used to display loader whenever we are sending request and before reply arrives.
  const [isOpen, setIsOpen] = useState(false); // to display the dropDown in account

  const getReply = async () => {
    setLoading(true); // When we are sending the request we want to show loader
    setNewChat(false); // so we don't see Start a New Chat
    console.log("message", prompt, " threadId", currThreadId); 
    const options = { // We are sending a post request to backend on the route we defined for new chat with threadId and message in body as we are extracting that in our req route defination
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId
      })
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options); // Now we are simply sending our request to backend with options object
      const res = await response.json();
      console.log(res); // This is the response received to us from GROQ api from backend
      setReply(res.reply); // Now we need to update the "reply" state variable and store the res obtained. As we are returning response from backend in reply: "" therefor we did res.reply
    } catch(err) {
      console.log(err);
    }
    setLoading(false); // When we got the response we don't want to display the loader
  }

  // Append new chat to prevChat (Whenever we get a reply from assistant we want that reply to be stored in prevChat state variable and display it as assistant's Chat on ChatWindow)
  useEffect(() => {
    if(prompt && reply) {
      setPrevChats(prevChats => (
        [...prevChats, {
          role: "user",
          content: prompt
        }, {
          role: "assistant",
          content: reply
        }]
      ))
    }

    setPrompt(""); // When we store this then we need to empty the input box. That is done by useState function setPrompt("") to empty string
  }, [reply]); // useEffect( function, dependancy) reply is the dependency here we want to run the function whenever there is a change in reply

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="chatWindow">

      <div className="navbar">
        <span>ApexGPT <i className="fa-solid fa-chevron-down"></i></span>
        
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>

      </div>

      {
        isOpen && 
        <div className="dropDown">
          <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
          <div className="dropDownItem"><i class="fa-regular fa-trash-can"></i> Delete</div>
          <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>

        </div>
      }

      <Chat></Chat>

      <ScaleLoader color="#fff" loading={loading}>
      </ScaleLoader>

      <div className="chatInput">

        <div className="inputBox">
          <input placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} // Make the input a controlled component by updating the prompt state on every keystroke.
            onKeyDown={(e) => e.key === 'Enter' ? getReply() : '' } // We want to send request if enter is being pressed
          >
            
          </input>

          <div id="submit" onClick={getReply}><i className="fa-solid fa-circle-arrow-up"></i></div>
        </div>

        <p className="info">
          ApexGPT can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  )
}

export default ChatWindow;