import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGripLinesVertical } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import Markdown from 'markdown-to-jsx';
import RequestForm from '../RequestForm';
import ChatSidebar from './ChatSidebar';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [conversationTitles, setConversationTitles] = useState([]);
  const [summary, setSummary] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMeetingClicked, setRequestMeetingClicked] = useState(false);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const [inputVisible, setInputVisible] = useState(true); // State to control input visibility

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setConversationId('');
    fetchConversationTitles();
  };

  const fetchConversationTitles = () => {
    axios.get("http://localhost:4000/gab/conversations")
      .then(response => {
        setConversationTitles(response.data);
      })
      .catch(error => console.error('Error fetching conversation titles:', error));
  };

  const handleConversationClick = (conversationId) => {
    axios.get(`http://localhost:4000/gab/conversation/${conversationId}`)
      .then(response => {
        setMessages(response.data.messages);
        setConversationId(conversationId);
      })
      .catch(error => console.error('Error fetching conversation:', error));
  };

  const sendMessage = () => {
    if (input.trim() !== '') {
      const newMessage = { role: 'user', content: input };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');

      axios.post("http://localhost:4000/gab/conversation", { input: input, conversationId: conversationId })
        .then(response => {
          const aiMessage = { role: 'assistant', content: response.data.message };
          setMessages(prevMessages => [...prevMessages, aiMessage]);

          if (!conversationId) {
            setConversationId(response.data.conversationId);
          }

          setSummary(response.data.summary);
          console.log("Summary:", response.data.summary);

          // Check if AI message contains the specific phrase to show the button
          if (response.data.message.includes("Thank you for confirming. You can now request a video conference")) {
            setShowRequestButton(true);
            setInputVisible(false); // Hide the input field
          }

        })
        .catch(error => console.error('Error:', error));
    } else {
      console.error('Error: Empty input');
    }
  };

  useEffect(() => {
    setIsSendDisabled(input === '');
  }, [input]);

  useEffect(() => {
    fetchConversationTitles();
  }, []);

  return (
    <div className="relative z-10 w-full h-screen flex flex-row justify-start items-start">
      <div className="flex flex-row w-full h-screen bg-bkg">
        <div className="flex flex-row w-full h-screen pt-[3.875rem]">
          <div
            id="chat-history"
            className={`transition-all overflow-hidden w-${sidebarOpen ? '0' : '64'} h-full bg-bkg z-50 shadow-lg left-0 top-0`}
            style={{ width: sidebarOpen ? '0px' : '256px' }}
          >
            <ChatSidebar
              handleNewChat={handleNewChat}
              handleConversationClick={handleConversationClick}
              conversationTitles={conversationTitles}
            />
          </div>
          <div className="flex h-full items-center" onClick={toggleSidebar}>
            <FaGripLinesVertical className="text-azure text-2xl" />
          </div>
          <div id="chat-content" className="flex flex-col w-full h-full mx-auto max-w-4xl justify-between">
            <div className="h-full overflow-y-auto flex flex-col gap-2 p-5">
              {messages.map((message, index) => (
                <div className="p-5 bg-gray-400 bg-opacity-20 rounded-xl animate__animated text-content" key={index}>
                  <p><b>{message.role === 'user' ? 'You' : 'Gab'}</b></p>
                  <p><Markdown>{message.content}</Markdown></p>
                </div>
              ))}
            </div>
              <div className="relative items-center">
                <div>
                  {showRequestButton && !requestMeetingClicked ? (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowRequestForm(true) || setRequestMeetingClicked(true)}>Request a video conference</button>
                  ) : (
                    <>
                      {inputVisible && (
                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            sendMessage();
                          }}
                          className="flex flex-row gap-1 bottom-0 w-full py-2"
                        >
                          <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="p-3 border-2 border-gray-500 border-opacity-50 rounded-full w-full bg-bkg text-content"
                            placeholder="Type your message here"
                          />
                                    <button
                                        type="submit"
                                        id="sendBtn"
                                        disabled={isSendDisabled}
                                        className={
                                            isSendDisabled
                                                ? 'absolute pb-1 pl-1 p-2 text-center text-2xl justify-center mx-2 mt-1 rounded-full bg-gray-400 text-white right-0'
                                                : 'absolute pb-1 pl-1 p-2 text-center text-2xl justify-center mx-2 mt-1 rounded-full bg-azure-500 text-white right-0'
                                        }>
                                        <BsSend className="h-[1em] w-[1em]" />
                                    </button>
                        </form>
                      )}
                    </>
                  )}
                </div>
                <div className="flex justify-center items-center pb-3">
                  <p className="text-gray-400 text-xs">
                    All conversations are completely confidential.
                  </p>
                </div>
                {showRequestForm && <RequestForm summary={summary} onClose={() => { setShowRequestForm(false); setRequestMeetingClicked(false); }} />}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
