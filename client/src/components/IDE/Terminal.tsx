"use client"
import { Terminal as XTerminal } from "@xterm/xterm";

import React, { useRef, useEffect } from 'react';
import styles from './Terminal.module.css';
import "@xterm/xterm/css/xterm.css";
import { socket } from '@/socket';



export default function Terminal() {

  const terminalRef = useRef<HTMLDivElement>(null);

  // Simulated user information and current directory
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    const term = new XTerminal({
      rows: 20,
    });

    term.open(terminalRef.current as HTMLElement);

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    function onTerminalData(data: string) {
      term.write(data);
    }

    socket.on("terminal:data", onTerminalData);
  }, []);


  return (
        <div ref={terminalRef}
        style={{
          backgroundColor: "transparent",
          color: "white",
          overflow: 'auto',
        }}
        className={styles.terminal_main}
        id="terminal" />
  );
}
