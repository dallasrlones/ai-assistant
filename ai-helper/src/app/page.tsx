"use client";

import { useState} from "react";
import React from "react";

import SearchBarComponent from "./home/SearchBar/SearchBarComponent";
import HistoryComponent from "./home/HistoryComponent";
import WaitingMessage from './home/WaitMessage'

export default function Home() {
  const [history, setHistory] = useState([]);

  return (
    <div className="main-container">
      {history.length == 0 && <WaitingMessage />}
      <HistoryComponent history={history} />
      <SearchBarComponent
        history={history}
        setHistory={setHistory}
      />
    </div>
  );
}
