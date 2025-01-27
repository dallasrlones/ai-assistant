
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useEffect, useRef } from "react";

const defaultStyles = {
    marginBottom: 10,
    borderRadius: 15,
    padding: 15
};

const userStyles = {
    ...defaultStyles,
    marginLeft: 50,
    backgroundColor: '#e8e8e8',
    boxShadow: '0px 0px 14px 3px #767676 inset',
    border: '1px solid white',
    // fontFamily: 'squids',
    textShadow: '0px 0px 2px #ffffff'
};

const systemStyles = {
    ...defaultStyles,
    marginRight: 50,
    backgroundColor: 'rgb(45 50 53)',
    color: 'white',
    // fontFamily: 'manga'
};

const historyContainer = {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    margin: "10px",
    borderRadius: "5px"
}

const renderMessageContent = (content) => (
    <ReactMarkdown
        components={{
            code({ inline, children, className, ...props }) {
                // Extract language from className
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "plaintext";
                console.log("Detected Language:", language); // Debugging
                const codeContent = String(children).replace(/\n$/, "");

                // Render SyntaxHighlighter
                return !inline ? (
                    <div style={{ marginBottom: "10px" }}>
                        <SyntaxHighlighter
                            style={atomDark} // Use GitHub theme for testing
                            language={language}
                            PreTag="div"
                        >
                            {codeContent}
                        </SyntaxHighlighter>
                    </div>
                ) : (
                    <code
                        style={{
                            backgroundColor: "#f6f8fa",
                            color: "#0366d6",
                            padding: "2px 4px",
                            borderRadius: "4px",
                        }}
                        {...props}
                    >
                        {children}
                    </code>
                );
            },
        }}
    >
        {content}
    </ReactMarkdown>
);

const HistoryComponent = ({ history }) => {
    const historyRef = useRef(null);

    useEffect(() => {
        if (historyRef.current) {
          historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
      }, [history]);
    
    return (
        <div
            ref={historyRef}
            style={historyContainer}
        >
            {history.map((message, index) => {
                if (message.content == '') {
                    return false;
                }
                return message.role == 'user' ? (
                    <div key={index} style={userStyles}>
                        {renderMessageContent(message.content)}
                    </div>
                ) : (
                    <div key={index} style={systemStyles}>
                        {message.img ? (
                            <div style={{ boxShadow: '0px 0px 14px 3px #767676 inset', border: '1px solid white', borderRadius: 15, overflow: 'hidden', padding: 15, marginBottom: 10, backgroundColor: '#1d1d1d' }}>
                                <image src={`data:image/png;base64,${message.img}`} style={{ margin: '0 auto', maxHeight: 300, marginBottom: 20 }} />
                            </div>
                        ): ''}
                        {renderMessageContent(message.content)}
                    </div>
                )
            })}
        </div>
    )
}

export default HistoryComponent