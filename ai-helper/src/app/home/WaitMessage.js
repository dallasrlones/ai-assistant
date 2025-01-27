import { useState, useEffect } from 'react';
import { generateVibrantColor } from '../utils/colors';
import ColorBar from './ColorBar';

const waitingMessages = [
    'Enter a Prompt...',
    'Ask me anything!',
    'Need help? I’m here.',
    'Explore and Create!',
    'Get inspired today!',
    'Let’s solve this together!',
    'What would you like to learn?',
    'Ready to have fun?',
    'Your ideas, our canvas.',
    'Let’s make something amazing!',
    'Discover new possibilities...',
    'Create your masterpiece here!',
    'Share your thoughts with me...',
    'Transform ideas into action!',
    'Let’s innovate together!',
    'Express yourself freely...',
    'Innovate and explore!',
    'Your journey starts here...',
    'Build, learn, create!',
    'What can I help you with today?',
    'Let’s bring your vision to life!',
    'Explore new horizons...',
    'Ask away – I’m all ears!',
    'Solve problems, one step at a time...',
    'Learn something new today!',
    'Create, inspire, and discover!',
    'Your creativity is our canvas.',
    'What would you like to accomplish?',
    'Let’s make your ideas real!',
    'Discover insights, one prompt at a time...',
    'Innovate, explore, succeed!',
    'Share your passions with me...',
    'Transform thoughts into reality!',
    'Explore new ideas and opportunities...',
    'Your questions are my answers!',
    'Let’s co-create something amazing!'
];

const WaitingMessage = () => {
    const [waitingMessage, setWaitingMessage] = useState(waitingMessages[0]);
    const [waitingColor, setWaitingColor] = useState('white');

    useEffect(() => {
        const changeMessageInterval = setInterval(() => {
            setWaitingMessage(waitingMessages[Math.floor(Math.random() * waitingMessages.length)]);
            setWaitingColor(generateVibrantColor());
        }, 500);

        // Clean up interval on component unmount
        return () => clearInterval(changeMessageInterval);
    }, []);

    return (
        <>
            <ColorBar />
            <h1 style={{ color: waitingColor, textAlign: 'center', marginTop: '20%', fontSize: '1.6em' }}>{waitingMessage}</h1>
        </>
    );
};

export default WaitingMessage;
