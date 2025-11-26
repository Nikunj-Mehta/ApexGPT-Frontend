import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null); // We are creating this state variable to store the last(latest) reply and display only that with typing effect

  useEffect(() => {
    if(reply === null) { // When we are trying to access any previous chat then we don't want the last message to be printed with typing effect
      setLatestReply(null); 
      return;
    }
    
    // LatestReply separate => typing effect create
    if(!prevChats?.length) return; // if previous chat doesn't exist then return stop the function immediately

    const content = reply.split(" "); // individual words

    // Now we will display individual words with a regular delay
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx+1).join(" ")); // Update the latestReply by revealing the first (idx + 1) words to create the typing effect.

      idx++;
      if(idx >= content.length) clearInterval(interval); // simply stops a running interval that was created using setInterval()
    }, 40);

    return () => clearInterval(interval); // simply stops a running interval that was created using setInterval()
  }, [prevChats, reply]) // we want this action to trigger only when there is a change in any one of them prevChats and reply. We added prevChats as if we visited any previous thread form history and then sent a new msg there and reply for new chat
  
  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}
      <div className="chats">
        {
          prevChats?.slice(0, -1).map((chat, idx) =>  // -1 because we want to remove the last element 1st from end as we are displaying it word by word with typing effect. prevChats?.slice(0, -1) does NOT remove anything from the original array.
            <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
              {
                chat.role == "user" ? 
                <p className="userMessage">{chat.content}</p> : 
                <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
              }
            </div>
          )
        }

        {
          prevChats.length > 0 && (
            <>
              {
                latestReply === null ? (
                  <div className="gptDiv" key={"typing"}>
                    <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                  </div>
                 ) : (
                  <div className="gptDiv" key={"typing"}>
                    <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                  </div>
                 )
              }
            </>
          )
        }
      </div>
    </>
  )
}

export default Chat;