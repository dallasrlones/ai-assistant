import { useEffect, useRef } from 'react';

const ThoughtsComponent = ({ thoughts }) => {
    const thoughtsRef = useRef(null);

    useEffect(() => {
        if (thoughtsRef.current) {
            thoughtsRef.current.scrollTop = thoughtsRef.current.scrollHeight;
        }
    }, [thoughts]);

    return (
        <div className="pad-10">
            <div ref={thoughtsRef} className="thoughts-container hide-scrollbar">
                {thoughts.join("").trim()}
            </div>
        </div>
    )
}

export default ThoughtsComponent