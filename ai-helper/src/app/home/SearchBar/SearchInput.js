import { useRef, useEffect } from "react";
import { focus } from './searchUtils'

const inputStyles = {
    marginLeft: 50,
    paddingLeft: 20,
    flex: 1,
    marginRight: "10px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    color: "white",
};

const SearchInputComponent = ({ loading, prompt, setPrompt, askApiHandler }) => {
    const textareaRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askApiHandler();
        }
    };

    useEffect(() => { focus(textareaRef) }, [])

    useEffect(() => {
        setTimeout(() => {
            focus(textareaRef)
        }, 100)
    }, [loading])

    return (
        <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask something..."
            disabled={loading}
            style={{
                ...inputStyles,
                backgroundColor: loading ? "#1d1d1d" : "#403f3f",
                cursor: loading ? "not-allowed" : "text"
            }}
        />
    )
}

export default SearchInputComponent;