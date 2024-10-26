"use client"
import React, { useState, useRef, useEffect } from 'react';
import styles from './Terminal.module.css';

interface Command {
  input: string;
  output: string;
}

export default function Terminal() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Simulated user information and current directory
  const username = "user";
  const hostname = "localhost";
  const currentDirectory = "~/projects/my-ide";

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleInputSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentInput.trim() === '') return;

    const newCommand: Command = {
      input: currentInput,
      output: 'Processing...',
    };

    setCommands((prevCommands) => [...prevCommands, newCommand]);
    setCurrentInput('');

    try {
      const response = await simulateCommandExecution(currentInput);
      
      setCommands((prevCommands) => 
        prevCommands.map((cmd, index) => 
          index === prevCommands.length - 1 ? { ...cmd, output: response } : cmd
        )
      );
    } catch (error) {
      setCommands((prevCommands) => 
        prevCommands.map((cmd, index) => 
          index === prevCommands.length - 1 ? { ...cmd, output: `An error occurred while processing the command. ${error}` } : cmd
        )
      );
    }
  };

  const simulateCommandExecution = (command: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Executed command: ${command}`);
      }, 500);
    });
  };

  const renderPrompt = () => (
    <span className={styles.prompt}>
      {username}@{hostname}:{currentDirectory}$
    </span>
  );

  return (
    <div className={styles.terminal} ref={terminalRef}>
      <div className={styles.output}>
        {commands.map((cmd, index) => (
          <div key={index}>
            <div className={styles.commandInput}>
              {renderPrompt()} {cmd.input}
            </div>
            <div className={styles.commandOutput}>{cmd.output}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleInputSubmit} className={styles.inputForm}>
        {renderPrompt()}
        <input
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          ref={inputRef}
          className={styles.input}
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
}
