import { useState } from 'react';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [sourceType, setSourceType] = useState('web');
  const [sourceLink, setSourceLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const messageId = crypto.randomUUID();
    const payload = {
      id: messageId,
      query: userInput,
      sources: [{
        type: sourceType,
        link: sourceLink
      }]
    };

    try {
      const response = await fetch('http://localhost:8080/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setMessages([...messages, {
        id: messageId,
        query: userInput,
        response: data.content
      }]);
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <h3 style={{ fontWeight: 'bold' }}>Loading..</h3>}
      <div className="chat-window" style={{ display: 'flex', gap: '20px' }}>
        <div className="sidebar" style={{ width: '250px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="sourceType" style={{ display: 'block', marginBottom: '5px' }}>
              Query Source Type
            </label>
            <select 
              id="sourceType"
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="web">Web</option>
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="sourceLink" style={{ display: 'block', marginBottom: '5px' }}>
              Query Source Link
            </label>
            <input
              id="sourceLink"
              type="text"
              placeholder="Enter source link"
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="chat-area" style={{ flex: 1 }}>
          <div className="messages" style={{ 
            height: '400px', 
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px'
          }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: '15px' }}>
                <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
                  <strong>Query:</strong> {msg.query}
                </div>
                <div style={{ backgroundColor: '#e8f4f8', padding: '10px', marginTop: '5px', borderRadius: '4px' }}>
                  <strong>Response:</strong> {msg.response}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, padding: '8px' }}
            />
            <button type="submit" style={{ padding: '8px 16px' }}>Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatWindow; 