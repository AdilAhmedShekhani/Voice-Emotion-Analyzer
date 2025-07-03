import { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');

  const emotionStyles = {
    Happy: { bg: '#e0f7fa', emoji: '😊', color: '#2e7d32' },
    Sad: { bg: '#e3f2fd', emoji: '😢', color: '#1565c0' },
    Angry: { bg: '#ffebee', emoji: '😠', color: '#c62828' },
    Neutral: { bg: '#f5f5f5', emoji: '😐', color: '#616161' },
    Default: { bg: '#ffffff', emoji: '', color: '#000000' }
  };

  const { bg, emoji, color } = emotionStyles[emotion] || emotionStyles.Default;

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setError('');

      try {
        const res = await axios.post('http://localhost:5000/analyze', {
          text: transcript,
        });
        setEmotion(res.data.emotion);
      } catch (err) {
        console.error(err);
        setError('Error analyzing emotion');
      }

      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setError(`Speech Error: ${event.error}`);
      setListening(false);
    };
  };

  return (
    <div
      style={{
        backgroundColor: bg,
        color: color,
        minHeight: '100vh',
        padding: '2rem',
        transition: 'all 0.5s ease',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}
    >
      <h1>🎙️ Voice Emotion Analyzer</h1>

      <button
        onClick={startListening}
        disabled={listening}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: listening ? '#aaa' : '#2196f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {listening ? 'Listening...' : 'Start Speaking'}
      </button>

      <p><strong>You said:</strong> {text}</p>

      {emotion && (
        <h2
          style={{
            fontSize: '2rem',
            color,
            transition: 'all 0.3s ease',
            marginTop: '30px'
          }}
        >
          {emoji} Emotion: {emotion}
        </h2>
      )}

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
}

export default App;
