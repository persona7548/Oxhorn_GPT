import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(nickname);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="유저명 검색..."
      />
      <button type="submit">검색</button>
    </form>
  );
}

export default SearchBar;
