import { useAddMessage, useMessages } from "../lib/graphql/hooks";
import MessageInput from "../components/MessageInput";

function Chat() {
  const { addMessage } = useAddMessage();
  const { messages } = useMessages();

  const handleSend = async (text) => {
    const message = await addMessage(text);
    console.log("Message added:", message);
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-4">{`Chatting as ${"XX"}`}</h1>
      </div>
      <button>Add Message</button> <MessageInput onSend={handleSend} />
      {messages.map((message) => {
        return (
          <div key={message.id}>
            <p>
              {message.user}: {message.text}
            </p>
          </div>
        );
      })}
    </section>
  );
}

export default Chat;
