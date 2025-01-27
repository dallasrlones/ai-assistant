export const askApi = async (prompt, history, onChunk, onComplete, onError) => {
    if (!prompt.trim()) return;

    const payload = {
        prompt,
        history: history.map(({ role, content }) => ({ role, content })),
    };

    try {
        const response = await fetch("http://localhost:1337/ask?stream=true", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch response from API");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            if (value) {
                const chunk = decoder.decode(value, { stream: true });
                chunk.split("\n").forEach((line) => {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            if (onChunk) onChunk(data);
                        } catch (err) {
                            console.error("Error parsing JSON stream: ", err);
                        }
                    }
                });
            }
        }
        if (onComplete) onComplete();
    } catch (error) {
        console.error("Error while calling the API:", error);
        if (onError) onError(error);
    }
};

export const handleAnalyzeImage = async (prompt, setPrompt, selectedFile, setHistory, setSelectedFile, setLoading) => {
    if (!selectedFile || !prompt.trim()) {
        alert("Please select a file and enter a prompt.");
        return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile); // Add file to form data
    formData.append("prompt", prompt); // Add prompt to form data

    try {
        setLoading(true);

        const response = await fetch("http://localhost:1337/analyze-image", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to analyze the image");
        }

        const data = await response.json();
        const { description, base64Image } = data;

        // Update history with the prompt and the AI's response
        setHistory((prev) => [
            ...prev,
            { role: "user", content: prompt },
            { role: "assistant", content: description, img: base64Image },
        ]);

        // Clear the prompt and selected file
        setPrompt("");
        setSelectedFile(null);
    } catch (error) {
        console.error("Error analyzing the image:", error);
    } finally {
        setLoading(false);
    }
};