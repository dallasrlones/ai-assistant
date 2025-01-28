import { askApi, handleAnalyzeImage } from "../../services/aiService";

export const focus = (ref) => {
    if (ref.current) {
        ref.current.focus();
    }
};

export const buildMethods = ({ setThoughts, history, setHistory, prompt, setPrompt, setLoading, selectedFile, setSelectedFile }) => {
    let tempAnswer = "";
    
    const onChunk = (data) => {
        if (data.type === "T") {
            setThoughts((prev) => [...prev, data.value]);
        } else if (data.type === "A") {
            tempAnswer += data.value;
            setHistory((prev) => {
                const updatedHistory = [...prev];
                if (
                    updatedHistory.length > 0 &&
                    updatedHistory[updatedHistory.length - 1].role === "system"
                ) {
                    updatedHistory[updatedHistory.length - 1].content = tempAnswer;
                }
                return updatedHistory;
            });
        }
    };

    const onComplete = () => {
        setPrompt("");
        setLoading(false);
    };

    const onError = (error) => {
        console.error("Error during API call:", error);
        setLoading(false);
    };

    const askApiHandler = async () => {
        if (selectedFile != null) {
            setTimeout(() => {
                setSelectedFile(null);
                setPrompt("");
            }, 1000);
            await handleAnalyzeImage(prompt, setPrompt, selectedFile, setHistory, setSelectedFile, setLoading);
        } else {
            if (!prompt.trim()) return;
            setLoading(true);
            setThoughts([]);
            setHistory((prev) => [
                ...prev,
                { role: "user", content: prompt },
                { role: "system", content: "" },
            ]);
            const currentPrompt = `${prompt}`;
            setTimeout(() => { setPrompt(""); }, 1000)
            await askApi(currentPrompt, history, onChunk, onComplete, onError);
        }
    };

    

    return {
        askApiHandler
    };
};