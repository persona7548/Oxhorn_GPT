import React, { useState } from 'react';

function SearchBar({ onSearch, onClick }) {
  const [nickname, setNickname] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(nickname);
  };

  return (
    <form onSubmit={handleSubmit} className="input-group"> 
    <div onClick={onClick} className="input-group">
      <input
        type="text"
        className="form-control"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="유저명 검색..."
      />
      <button className="btn btn-outline-secondary" type="submit">검색</button>
    </div> </form>
  );
}
export default SearchBar;
