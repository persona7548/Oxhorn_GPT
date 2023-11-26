// GameList.js
import React from 'react';
import GameRecord from '../GameRecord/GameRecord';
import axios from 'axios';
// 캐릭터 이미지를 보여주는 컴포넌트
const CharacterImage = ({ characterId }) => (
<img src={`https://img-api.neople.co.kr/cy/characters/${characterId}?zoom=1`} alt="Character" />
);

// 아이템 이미지를 보여주는 컴포넌트
const ItemImage = ({ itemId }) => (
<img src={`https://img-api.neople.co.kr/cy/items/${itemId}`} alt="Item" />
);
// 특성 이미지를 보여주는 컴포넌트
const AttriImage = ({ attributeId }) => (
<img src={`https://img-api.neople.co.kr/cy/position-attributes/${attributeId}`} alt="Attribute" />
);
const GameList = ({ matches, detailedMatchInfo, setDetailedMatchInfo, selectedTab, apiKey }) => {
  const handleDetailClick = async (matchId) => {
    if (!detailedMatchInfo[matchId]) {
      try {
        const response = await axios.get(`/cy/matches/${matchId}?apikey=${apiKey}`);
        setDetailedMatchInfo(prevState => ({
          ...prevState,
          [matchId]: response.data
        }));
      } catch (error) {
        console.error('Error fetching match detail:', error);
      }
    } else {
      setDetailedMatchInfo(prevState => ({
        ...prevState,
        [matchId]: null // 상세 정보 숨기기
      }));
    }
  };

  const renderMatchDetail = (matchId) => {
    const matchInfo = detailedMatchInfo[matchId];
    
    if (matchInfo) {
      return <GameRecord match={matchInfo} />;
    }
    return null;
  };

  const renderMatch = (match) => {
    const backgroundColor = match.playInfo.result === 'win' ? '#ADD8E6' : '#FFC0CB'; // 하늘색 또는 붉은색
    const gameTypeText = match.gameTypeId === 'rating' ? '공식전' : '일반전';
    
    return (
      <div key={match.matchId} className="match-record" style={{ backgroundColor, marginBottom: '10px' }}>
        <div key={match.matchId} style={{ backgroundColor }}>
          <p>경기 종류: {gameTypeText}</p>
          <p>시작 시간: {match.date}</p>
          <p>지속 시간: {Math.round(match.playInfo.playTime / 60)}분</p>
          <p>맵: {match.map.name}</p>
          <p><CharacterImage characterId={match.playInfo.characterId} /> </p>
          <p>K/D/A: {match.playInfo.killCount}/{match.playInfo.deathCount}/{match.playInfo.assistCount}</p>          
          {/* 상세 정보 토글 버튼 */}
          <button onClick={() => handleDetailClick(match.matchId)}>상세 보기</button>
  
          {/* 상세 정보 렌더링 조건부 표시 */}
          {renderMatchDetail(match.matchId)}
        </div>
      </div>
    );
  };

  return (
    <div className="matches-container">
      {matches
        .filter(match => selectedTab === 'all' || match.gameTypeId === selectedTab)
        .map(renderMatch)}
    </div>
  );
};

export default GameList;
