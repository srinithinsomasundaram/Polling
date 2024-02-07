import React, { useState } from 'react';

function Poll({ id, question, options, votes, onVote, onDelete, onEdit, status }) {
  const [editMode, setEditMode] = useState(false);
  const [editedOptions, setEditedOptions] = useState([...options]);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(votes.reduce((acc, cur) => acc + cur, 0));

  const handleVote = (index) => {
    onVote(id, index);
    setHasVoted(true);
    setTotalVotes(totalVotes + 1);
  };

  const handleSave = () => {
    setEditMode(false);
    // Save edited options
    onEdit(id, editedOptions);
  };

  const handleOkay = () => {
    setHasVoted(false);
  };

  return (
    <div style={{ margin: '10px auto', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '50%', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
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
                style={{ marginBottom: '5px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
              />
            </div>
          ))}
          <button style={{ margin: '5px', padding: '5px 10px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '3px' }} onClick={handleSave}>Save</button>
        </div>
      ) : hasVoted ? (
        <div>
          {options.map((option, index) => (
            <div key={index}>
              <p style={{ marginBottom: '5px' }}>{option} - Votes: {votes[index]} ({votes[index]} out of {totalVotes})</p>
            </div>
          ))}
          <button style={{ margin: '5px', padding: '5px 10px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '3px' }} onClick={handleOkay}>Okay</button>
        </div>
      ) : (
        <div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {options.map((option, index) => (
              <li key={index}>
                <p style={{ marginBottom: '5px' }}>{option} - Votes: {votes[index]} ({votes[index]} out of {totalVotes})</p>
                <button style={{ margin: '5px', padding: '5px 10px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '3px' }} onClick={() => handleVote(index)}>Vote</button>
              </li>
            ))}
          </ul>
          <button style={{ margin: '5px', padding: '5px 10px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '3px' }} onClick={() => setEditMode(true)}>Edit</button>
          <button style={{ margin: '5px', padding: '5px 10px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '3px' }} onClick={onDelete}>Delete</button>
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
    updatedPolls[pollId].status = 'Closed'; // Change status after voting
    setPolls(updatedPolls);
  };

  const handleAddPoll = () => {
    // Check if any option is empty
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
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>Create a Poll</h2>
      <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: '20px' }}>
        <div>
          <label style={{ fontFamily: 'Arial, sans-serif' }}>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ margin: '5px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ fontFamily: 'Arial, sans-serif' }}>Options:</label>
          {options.map((option, index) => (
            <div key={index} style={{ margin: '5px' }}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{ marginRight: '10px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
              />
              <button type="button" onClick={() => handleRemoveOption(index)} style={{ padding: '5px 10px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '3px' }}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddOption} style={{ padding: '5px 10px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '3px' }}>
            Add Option
          </button>
        </div>
        <button type="submit" onClick={handleAddPoll} style={{ margin: '10px 0', padding: '8px 16px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '3px' }}>
          Create Poll
        </button>
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
        />
      ))}
    </div>
  );
}

export default CreatePoll;
