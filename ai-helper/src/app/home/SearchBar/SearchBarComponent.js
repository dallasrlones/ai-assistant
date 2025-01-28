"use client";

import { useState } from 'react';
import { buildMethods } from './searchUtils'
import ThoughtsComponent from "../ThoughtsComponent";
import ColorBar from '../ColorBar'
import UploadComponent from './UploadComponent'
import SearchInputComponent from './SearchInput'
import SearchButtonComponent from './SearchButtonComponent'

const searchBarContainer = {
    display: "flex",
    alignItems: "center",
    padding: "10px"
};

const SearchBarComponent = ({
    history,
    setHistory
}) => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [thoughts, setThoughts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const {
        askApiHandler
    } = buildMethods({ setThoughts, history, setHistory, prompt, setPrompt, setLoading, selectedFile, setSelectedFile })

    return (
        <>
            <ThoughtsComponent thoughts={thoughts} />
            {loading ? <ColorBar /> : ''}
            <div style={searchBarContainer}>
                <SearchInputComponent loading={loading} prompt={prompt} setPrompt={setPrompt} askApiHandler={askApiHandler} />
                <UploadComponent loading={loading} askApiHandler={askApiHandler} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                <SearchButtonComponent loading={loading} askApiHandler={askApiHandler} />
            </div>
        </>
    );
};

export default SearchBarComponent;
