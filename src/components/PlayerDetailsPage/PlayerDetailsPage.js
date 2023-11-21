import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlayerDetailsPage.css';
import axios from 'axios';

function PlayerDetailsPage() {
  const { playerId } = useParams();
  const [playerDetails, setPlayerDetails] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = `/cy/players/${playerId}?apikey=${apiKey}`;

      try {
        const response = await axios.get(url);
        setPlayerDetails(response.data);
      } catch (error) {
        console.error('플레이어 상세 정보를 가져오는 데 실패했습니다.', error);
      }
    };

    fetchPlayerDetails();
  }, [playerId]);

  // 레코드 정보를 포맷팅하는 함수
  const formatRecords = (records) => {
    return records.map((record) => (
      <div key={record.gameTypeId}>
        <h3>{record.gameTypeId === 'rating' ? '랭크 게임' : '일반 게임'}</h3>
        <p>승리: {record.winCount}</p>
        <p>패배: {record.loseCount}</p>
        <p>중단: {record.stopCount}</p>
      </div>
    ));
  };

  return (
    <div className="player-details-container">
      {playerDetails ? (
        <div className="player-details">
          <h1 className="player-name">{playerDetails.nickname}</h1>
          <p className="player-grade">등급: {playerDetails.grade}</p>
          {playerDetails.tierTest && (
            <div className="player-rank-info">
              <p>클랜: {playerDetails.clanName}</p>
              <p>랭크: {playerDetails.tierName}</p>
              <p>레이팅 포인트: {playerDetails.ratingPoint}</p>
              <p>최대 레이팅 포인트: {playerDetails.maxRatingPoint}</p>
            </div>
          )}
          <div className="player-records">
            {formatRecords(playerDetails.records)}
          </div>
        </div>
      ) : (
        <p className="loading">플레이어 정보를 불러오는 중...</p>
      )}
    </div>
  );
}

export default PlayerDetailsPage;
