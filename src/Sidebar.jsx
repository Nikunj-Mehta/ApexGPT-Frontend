import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread"); // as we have defined in backend if any req comes on this route send all threads form db.
      const res = await response.json(); 
      const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title})); // to disply it in history we need 2 things, title and thereadId, as we have to access that thread which is clicked. That can be done only by threadId
      // console.log(filteredData); // We are getting them correctly now using .map we are going to display them in history
      setAllThreads(filteredData); // update the statevariable so that we can access it.
    } catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]); // Whenever theres is a change in currThreadId we need to getAllThreads as if we create a new chat or click on an existing chat then our currThreadId will be changes
  
  const createNewChat = () => { // We want to create a new chat when we click on the button
    setNewChat(true); // When we want to create a new chat we want it to be true
    setPrompt(""); // we want prompt to be empty string in input box
    setReply(null); // We initialize it as null because from assistant an object can also come
    setCurrThreadId(uuidv1()); // We want a new id for new chat
    setPrevChats([]); // we want to set previous chats to empty array as this is a new chat
  }

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId); //  Change the currThreadId by the id of thread on which we clicked so that thread with all of it's previous chat will be displayed

    try {
      const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`); // Send the request to backend and the route defn will handel the rest
      const res = await response.json();
      console.log(res); // it will return all the chat history that is entire messages array
      setPrevChats(res);; // as on screen prevChats are getting printed so let's update that so that all the messages of previous thread will be displayed
      setNewChat(false); // To set a new chat to false
      setReply(null);
    } catch(err) {
      console.log(err);
    }
  }

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"}); // We will send the delete req to th path and it will perform the task
      const res = await response.json();
      console.log(res);

      // re-render Updated Threads
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId)); // remove only the one with this threadId and take others

      if(threadId === currThreadId) {
        createNewChat(); // we are on a chat and we are deleting the same chat then we must go to a new chat
      }
    } catch(err) {
      console.log(err);
    }
  }

  
  return (
    <section className="sidebar">
      {/* new chat button  */}
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
        <span><i className="fa-regular fa-pen-to-square"></i></span>
      </button>

      {/* history */}
      <ul className="history">
        {
          allThreads?.map((thread, idx) => ( // if allThreads exists then .map ...
            <li key={idx}
              onClick={(e) => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""} 
            >
              {thread.title}
              <i className="fa-regular history-trash-can fa-trash-can"
                onClick={(e) => {
                  e.stopPropagation(); // because when we clicked on delete we also clicked on open that chat with this threadId and we want to avoid that therefor we wrote that. This is event bubbling
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))
        }
      </ul>

      {/* sign */}
      <div className="sign">
        <p>By Nikunj Mehta 🧑‍💻</p>
      </div>
    </section>
  )
}

export default Sidebar;