import React, { useState } from 'react';
import "./App.css"

function Poll({ id, question, options, votes, onVote, onDelete, onEdit, onEnd, status }) {
  const [editMode, setEditMode] = useState(false);
  const [editedOptions, setEditedOptions] = useState([...options]);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(votes.reduce((acc, cur) => acc + cur, 0));
  const [showWinner, setShowWinner] = useState(false); 

  const handleVote = (index) => {
    onVote(id, index);
    setHasVoted(true);
    setTotalVotes(totalVotes + 1);
  };

  const handleSave = () => {
    setEditMode(false);
    onEdit(id, editedOptions);
  };

  const handleOkay = () => {
    setHasVoted(false);
    setShowWinner(false); 
  };

  const sharePoll = () => {
    const shareableLink = `https://example.com/polls/${id}`;
    alert(`Share this link: ${shareableLink}`);
  };

  const calculateWinner = () => {
    const maxVotes = Math.max(...votes);
    const winners = options.filter((option, index) => votes[index] === maxVotes);
    return winners.join(", ");
  };

  return (
    <div className="poll-container">
      <h3>{question}</h3>
      <p>Status: {status}</p>
      {editMode ? (
        <div>
          {editedOptions.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...editedOptions];
                  newOptions[index] = e.target.value;
                  setEditedOptions(newOptions);
                }}
                className="option-input"
              />
            </div>
          ))}
          <button className="action-button" onClick={handleSave}>Save</button>
        </div>
      ) : hasVoted ? (
        <div>
          {options.map((option, index) => (
            <div key={index}>
              <p>{option} - Votes: {votes[index]} ({votes[index]} out of {totalVotes})</p>
            </div>
          ))}
          {status === "Closed" && <p>Winner(s): {calculateWinner()}</p>}
          <button className="action-button" onClick={handleOkay}>Okay</button>
        </div>
      ) : (
        <div>
          <ul>
            {options.map((option, index) => (
              <li key={index}>
                <p>{option} - Votes: {votes[index]} ({votes[index]} out of {totalVotes})</p>
                <button className="action-button" onClick={() => handleVote(index)}>Vote</button>
              </li>
            ))}
          </ul>
          <button className="action-button" onClick={() => setEditMode(true)}>Edit</button>
          <button className="action-button" onClick={onDelete}>Delete</button>
          {status === "Open" && <button className="action-button" onClick={() => {onEnd(); setShowWinner(true);}}>End Poll</button>} 
          <button className="action-button" onClick={sharePoll}>Share</button> 
        </div>
      )}
      {showWinner && status === "Closed" && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Winner(s): {calculateWinner()}</h2>
            <button className="action-button" onClick={handleOkay}>Okay</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [polls, setPolls] = useState([]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleVote = (pollId, optionIndex) => {
    const updatedPolls = [...polls];
    updatedPolls[pollId].votes[optionIndex]++;
    setPolls(updatedPolls);
  };

  const handleEndPoll = (pollId) => {
    const updatedPolls = [...polls];
    updatedPolls[pollId].status = 'Closed';
    setPolls(updatedPolls);
  };

  const handleAddPoll = () => {

    if (options.some(option => option.trim() === '')) {
      alert('Please fill in all options before creating the poll.');
      return;
    }

    const newPoll = {
      id: polls.length,
      question,
      options,
      votes: new Array(options.length).fill(0),
      status: 'Open'
    };
    setPolls([...polls, newPoll]);
    setQuestion('');
    setOptions(['', '']);
  };

  const handleDeletePoll = (pollIndex) => {
    const updatedPolls = polls.filter((_, index) => index !== pollIndex);
    setPolls(updatedPolls);
  };

  const handleEditPoll = (pollId, editedOptions) => {
    const updatedPolls = [...polls];
    updatedPolls[pollId].options = editedOptions;
    setPolls(updatedPolls);
  };

  return (
    <div className="background">
      <div className="container">
        <h2>Create a Poll</h2>
        <form onSubmit={(e) => e.preventDefault()} className="form">
          <div className="form-group">
            <label>Question:</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Options:</label>
            {options.map((option, index) => (
              <div key={index} className="option-group">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="form-control option-input"
                />
                <button type="button" onClick={() => handleRemoveOption(index)} className="btn btn-remove">Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddOption} className="btn btn-add">Add Option</button>
          </div>
          <button type="submit" onClick={handleAddPoll} className="btn btn-create">Create Poll</button>
        </form>
        <hr />
        {polls.map((poll, index) => (
          <Poll
            key={index}
            id={index}
            question={poll.question}
            options={poll.options}
            votes={poll.votes}
            onVote={handleVote}
            onDelete={() => handleDeletePoll(index)}
            onEdit={handleEditPoll}
            status={poll.status}
            onEnd={() => handleEndPoll(index)} 
          />
        ))}
      </div>
    </div>
  );
}

export default CreatePoll;
