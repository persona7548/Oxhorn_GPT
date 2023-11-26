import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlayerDetailsPage.css';
import axios from 'axios';
import { Pie,Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // Chart.js 자동 등록
import NavBar from '../NavBar'; // NavBar 컴포넌트를 import합니다.
import GameRecord from '../GameRecord/GameRecord'; // GameRecord 컴포넌트를 가져옵니다.

function PlayerDetailsPage() {
  const { playerId } = useParams();
  const [playerDetails, setPlayerDetails] = useState(null);
  const [ratingMatches, setRatingMatches] = useState([]);
  const [normalMatches, setNormalMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextRating, setNextRating] = useState(null);
  const [nextNormal, setNextNormal] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isMore, setIsMore] = useState(true); // 더 불러올 데이터가 있는지
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'rating', 'normal'
  const [detailedMatchInfo, setDetailedMatchInfo] = useState({});
  const apiKey = process.env.REACT_APP_API_KEY; // 환경 변수에서 API 키를 가져옵니다.

  const [allGameData, setAllGameData] = useState({
    wins: 0,
    losses: 0,
    // 필요한 다른 데이터...
  });
  
  const fetchMatchDetail = async (matchId) => {
    try {
      const response = await axios.get(`/cy/matches/${matchId}?apikey=${apiKey}`);
      setDetailedMatchInfo(prevState => ({
        ...prevState,
        [matchId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching match detail:', error);
    }
  };
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

  // 상세 보기 버튼 클릭 핸들러
const handleDetailClick = (matchId) => {
  if (!detailedMatchInfo[matchId]) {
    fetchMatchDetail(matchId);
  } else {
    setDetailedMatchInfo(prevState => ({
      ...prevState,
      [matchId]: '' // 상세 정보 숨기기
    }));
  }
};
  const formatDate = (date) => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}${month}${day}T${hours}${minutes}`;
  };
  const loadMore = () => {
    if (nextRating) {
      fetchMatches('rating', nextRating);
    } else if (nextNormal) {
      fetchMatches('normal', nextNormal);
    }
  };

  const fetchMatches = async (gameTypeId,  nextToken = null, limit = 30) => {

    let url = `/cy/players/${playerId}/matches?gameTypeId=${gameTypeId}&limit=${limit}&apikey=${apiKey}`;

    if (nextToken) {
      url += `&next=${nextToken}`; // next 값이 있으면 URL에 추가합니다.
    } else {
      const currentDate = new Date();
      
      const startDate = new Date(currentDate.getTime() - (90 * 24 * 60 * 60 * 1000));
      
      // 날짜를 'YYYYMMDDTHHmm' 형식으로 포맷팅
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(currentDate);        
      url += `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`; // 최초 호출에는 날짜를 추가합니다.
    }

    try {
      const response = await axios.get(url);
      const newMatches = response.data.matches.rows.map(match => ({
        ...match,
        gameTypeId: gameTypeId // 'rating' 또는 'normal'을 각 경기 기록에 추가
      }));
      setMatches(prevMatches => [...prevMatches, ...newMatches]);
  
      if (gameTypeId === 'rating') {
        setNextRating(response.data.matches.next);
      } else {
        setNextNormal(response.data.matches.next);
      }
  
      if (!response.data.matches.next) {
        if (gameTypeId === 'rating') {
          fetchMatches('normal'); // rating 데이터가 더 이상 없을 때 normal 호출
        } else {
          setIsMore(false); // normal 데이터도 더 이상 없으면 더 불러오기 중지
        }
      }
    } catch (error) {
      console.error(`${gameTypeId} 게임 기록을 가져오는 데 실패했습니다.`, error);
    } finally {
      if (gameTypeId === 'normal') {
        setLoading(false); // normal 데이터까지 로딩이 완료되면 로딩 상태 해제
      }
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 90);
    const apiKey = process.env.REACT_APP_API_KEY;

    if (ratingMatches.length > 0 && normalMatches.length > 0) {
      const allGames = [...ratingMatches, ...normalMatches];
      const wins = allGames.reduce((acc, match) => acc + (match.playInfo.result === 'win' ? 1 : 0), 0);
      const losses = allGames.reduce((acc, match) => acc + (match.playInfo.result === 'lose' ? 1 : 0), 0);
      setAllGameData({
        wins,
        losses,
        // 계산된 다른 데이터...
      });}
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
      setMatches(combinedMatches);
    }
  }, [loading, ratingMatches, normalMatches]);

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
    // 파이 차트 데이터 및 옵션 설정
    const pieChartData = (record) => {
      const totalGames = record.winCount + record.loseCount + record.stopCount;
      const winRate = totalGames ? ((record.winCount / totalGames) * 100).toFixed(2) : 0;
      return {
        labels: ['승리', '패배', '중단'],
        datasets: [
          {
            data: [record.winCount, record.loseCount, record.stopCount],
            backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
            hoverBackgroundColor: ['#66bb6a', '#ef5350', '#fdd835'],
          },
        ],
        text: winRate + '%', // Add win rate text
      };
    };

    const renderMatchDetail = (matchId) => {
      const matchInfo = detailedMatchInfo[matchId];
    
      // detailedMatchInfo 상태에 정보가 있으면 GameRecord 컴포넌트로 렌더링
      if (matchInfo) {
        return (
          <GameRecord match={matchInfo} />
        );
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
            <p><CharacterImage characterId={match.playInfo.characterId} /> 캐릭터: {match.playInfo.characterName}</p>
            <p>K/D/A: {match.playInfo.killCount}/{match.playInfo.deathCount}/{match.playInfo.assistCount}</p>
            <p>딜량: {match.playInfo.attackPoint}</p>
            <p>받은 피해량: {match.playInfo.damagePoint}</p>
            
            {/* 상세 정보 토글 버튼 */}
            <button onClick={() => handleDetailClick(match.matchId)}>상세 보기</button>
    
            {/* 상세 정보 렌더링 조건부 표시 */}
            {renderMatchDetail(match.matchId)}
          </div>
        </div>
      );
    };
  return (
    <div>
      {/* 상단 메뉴바 */}
      <NavBar />
  
      {/* 플레이어 전적 정보 */}
      <div className="container">
      <div className="row">
      <div  className="player-details-container">
        {playerDetails ? (
          <div class="col-12 col-md-12">
            <h1 className="player-name">{playerDetails.nickname}</h1>
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

            <div class="col-12 col-md-12">
            <div className="chart-container">
                {selectedTab === 'all' && (
                  <Doughnut
                    data={{
                      labels: ['승리', '패배'],
                      datasets: [
                        {
                          data: [allGameData.wins, allGameData.losses],
                          backgroundColor: ['#4caf50', '#f44336'],
                          hoverBackgroundColor: ['#66bb6a', '#ef5350'],
                        },
                      ],
                    }}
                    options={{
                      cutoutPercentage: 70,
                      responsive: true,
                      tooltips: { enabled: false },
                      elements: {
                        center: {
                          text: ((allGameData.wins / (allGameData.wins + allGameData.losses)) * 100).toFixed(2) + '%', // 승률 표시
                          fontStyle: 'bold',
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
            </div>
            <div class="col-12 col-md-8">

        {/* 매치 리스트 */}
        <div className="matches-container">
          {matches
            .filter(match => selectedTab === 'all' || match.gameTypeId === selectedTab)
            .map(match => renderMatch(match))
          }
          {isMore && (
            <button onClick={loadMore}>더 보기</button>
          )}
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
