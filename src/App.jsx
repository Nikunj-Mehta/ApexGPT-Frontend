import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState(""); // This is the message from the user
  const [reply, setReply] = useState(null); // This is the message from the assistant
  const [currThreadId, setCurrThreadId] = useState(uuidv1()); // This is a state variable for threadId so that we know the message is being sent from which chat(Thread). uuidv1 is used to create unique threadId
  const [prevChats, setPrevChats] = useState([]); // State variable used to store user's prompt and assistant's reply in an array and we are using it as a state variable because everytime the user sends a message or the assistant sends reply we want it to be stored in this array. So that we can re-render it on page. Stores all chats of current thread
  const [newChat, setNewChat] = useState(true); // We want to check whether the chat is new or an earlier chat.
  const [allThreads, setAllThreads] = useState([]); // We want to store all The theads so that in sidebar history we can show all of them

  const providerValues = { // We will be passing down our values using this object. It is used to avoid passing state variables to each component store it here and any component can use it.
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads
  };  // Now these are the state variables which we had to pass using props but we are using Context API and passing so that any component can use it easily instead of passing prop to each variable


  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App
