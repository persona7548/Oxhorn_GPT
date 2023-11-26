import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlayerDetailsPage.css';
import axios from 'axios';
import 'chart.js/auto'; // Chart.js 자동 등록
import NavBar from '../NavBar'; // NavBar 컴포넌트를 import합니다.
import GameList from '../GameList/GameList'; // 새로운 GameList 컴포넌트를 가져옵니다.
import useMatchFetcher from './useMatchFetcher'; // 새로운 훅 import

function PlayerDetailsPage() {
  const { playerId } = useParams();
  const [playerDetails, setPlayerDetails] = useState(null);
  const [ratingMatches] = useState([]);
  const [normalMatches] = useState([]);

  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'rating', 'normal'
  const [detailedMatchInfo, setDetailedMatchInfo] = useState({});
  const apiKey = process.env.REACT_APP_API_KEY; // 환경 변수에서 API 키를 가져옵니다.
  const {
    matches,
    loading,
    isMore,
    loadMore,
    fetchMatches
  } = useMatchFetcher(playerId, apiKey);
  const CharacterImage = ({ characterId }) => (
    <img src={`https://img-api.neople.co.kr/cy/characters/${characterId}?zoom=2`} alt="Character" />
    );
    

  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 90);

    if (ratingMatches.length > 0 && normalMatches.length > 0) {
      const allGames = [...ratingMatches, ...normalMatches];
      const wins = allGames.reduce((acc, match) => acc + (match.playInfo.result === 'win' ? 1 : 0), 0);
      const losses = allGames.reduce((acc, match) => acc + (match.playInfo.result === 'lose' ? 1 : 0), 0);
    }
    setSelectedTab('all');
    const fetchPlayerDetails = async () => {
      const url = `/cy/players/${playerId}?apikey=${apiKey}`;

      try {
        const response = await axios.get(url);
        setPlayerDetails(response.data);
      } catch (error) {
        console.error('플레이어 상세 정보를 가져오는 데 실패했습니다.', error);
      }

      
    };
    fetchMatches('rating');
    fetchPlayerDetails(); // 플레이어 정보 호출
    if (!loading) {
      const combinedMatches = [...ratingMatches, ...normalMatches]
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // 날짜 내림차순으로 정렬
    }}, [loading, ratingMatches, normalMatches]);

  // 레코드 정보를 포맷팅하는 함수
  const formatRecords = (records) => {
    return records.map((record) => (
      <div key={record.gameTypeId}>
        <h3>{record.gameTypeId === 'rating' ? '랭크 게임' : '일반 게임'}</h3>
        <p>승리: {record.winCount}</p>
        <p>패배: {record.loseCount}</p>
        <p>중단: {record.stopCount}</p>
        <br/>
      </div>
    ));
  };

  <div className="tab-buttons-container">
    <button onClick={() => setSelectedTab('all')} className={`tab-button ${selectedTab === 'all' ? 'active' : ''}`}>모두 보기</button>
    <button onClick={() => setSelectedTab('rating')} className={`tab-button ${selectedTab === 'rating' ? 'active' : ''}`}>공식전</button>
    <button onClick={() => setSelectedTab('normal')} className={`tab-button ${selectedTab === 'normal' ? 'active' : ''}`}>일반전</button>
  </div>
  return (
    <div>
      <NavBar />  
      {/* 플레이어 전적 정보 */}
      <div className="container">
      <div className="row">
      <div  className="player-details-container">
        {playerDetails ? (
          <div class="col-12 col-md-12">
            <h1 className="player-name"><CharacterImage characterId={playerDetails.represent.characterId} />{playerDetails.nickname}</h1>
            <p className="player-grade">등급: {playerDetails.grade}</p>
            {playerDetails.tierTest && (
              <div className="player-rank-info">
                <p>클랜: {playerDetails.clanName}</p>
                <p>랭크: {playerDetails.tierName}</p>
                <p>레이팅 포인트: {playerDetails.ratingPoint} (최대: {playerDetails.maxRatingPoint})</p>
              </div>
            )}
            <div className="player-records">
              {formatRecords(playerDetails.records)}
            </div>
            <div className="container">
            <div className="tab-buttons-container">
            <button onClick={() => setSelectedTab('all')} className={`tab-button ${selectedTab === 'all' ? 'active' : ''}`}>모두 보기</button>
            <button onClick={() => setSelectedTab('rating')} className={`tab-button ${selectedTab === 'rating' ? 'active' : ''}`}>공식전</button>
            <button onClick={() => setSelectedTab('normal')} className={`tab-button ${selectedTab === 'normal' ? 'active' : ''}`}>일반전</button>
          </div>                  

            </div>
          <div class="col-12 col-md-12">

            {/* 매치 리스트 */}
            <div className="matches-container">
              <GameList
                matches={matches}
                detailedMatchInfo={detailedMatchInfo}
                setDetailedMatchInfo={setDetailedMatchInfo}
                selectedTab={selectedTab}
                apiKey={apiKey}
              />
              {isMore && (<button onClick={loadMore}>더 보기</button>)}
            </div>
          </div>
        </div>
          
        ) : (
          <p className="loading">플레이어 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
    </div></div>
  );
}
export default PlayerDetailsPage;
