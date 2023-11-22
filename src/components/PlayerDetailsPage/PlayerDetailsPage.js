import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlayerDetailsPage.css';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Chart.js 자동 등록
import NavBar from '../NavBar'; // NavBar 컴포넌트를 import합니다.

function PlayerDetailsPage() {
  const { playerId } = useParams();
  const [playerDetails, setPlayerDetails] = useState(null);
  const [ratingMatches, setRatingMatches] = useState([]);
  const [normalMatches, setNormalMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'rating', 'normal'

  const fetchMatches = async (gameTypeId, next) => {
    const apiKey = process.env.REACT_APP_API_KEY; // 환경 변수에서 API 키를 가져옵니다.
    let url = `https://api.neople.co.kr/cy/players/${playerId}/matches?gameTypeId=${gameTypeId}&limit=100&apikey=${apiKey}`;

    if (next) {
      url += `&next=${next}`; // next 값이 있으면 URL에 추가합니다.
    } else {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getTime() - (90 * 24 * 60 * 60 * 1000)); // 90일 전 날짜
      const formattedStartDate = startDate.toISOString().substring(0, 19).replace('T', '') + '00';
      const formattedEndDate = currentDate.toISOString().substring(0, 19).replace('T', '') + '00';
      url += `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`; // 최초 호출에는 날짜를 추가합니다.
    }

    try {
      const response = await axios.get(url);
      if (gameTypeId === 'rating') {
        setRatingMatches(prev => [...prev, ...response.data.matches.rows]);
      } else {
        setNormalMatches(prev => [...prev, ...response.data.matches.rows]);
      }

      if (response.data.matches.next) {
        // 다음 페이지 데이터가 있으면 재귀적으로 호출합니다.
        fetchMatches(gameTypeId, response.data.matches.next);
      } else {
        // 두 게임 유형 모두 불러왔는지 확인하고 로딩 상태를 업데이트합니다.
        if (gameTypeId === 'rating' && !next) {
          fetchMatches('normal');
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(`${gameTypeId} 게임 기록을 가져오는 데 실패했습니다.`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 90);
    const apiKey = process.env.REACT_APP_API_KEY;

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
    // 파이 차트 데이터 및 옵션 설정
    const pieChartData = (record) => {
      return {
        labels: ['승리', '패배', '중단'],
        datasets: [
          {
            data: [record.winCount, record.loseCount, record.stopCount], // 각 데이터 항목
            backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
            hoverBackgroundColor: ['#66bb6a', '#ef5350', '#fdd835'],
          },
        ],
      };
    };

    const renderMatch = (match) => {
      const backgroundColor = match.playInfo.result === 'win' ? '#ADD8E6' : '#FFC0CB'; // 하늘색 또는 붉은색
      return (
        <div key={match.matchId} style={{ backgroundColor }}>
          <p>시작 시간: {match.date}</p>
          <p>지속 시간: {Math.round(match.playInfo.playTime / 60)}분</p>
          <p>맵: {match.map.name}</p>
          <p>캐릭터: {match.playInfo.characterName}</p>
          <p>K/D/A: {match.playInfo.killCount}/{match.playInfo.deathCount}/{match.playInfo.assistCount}</p>
          <p>딜량: {match.playInfo.attackPoint}</p>
          <p>받은 피해량: {match.playInfo.damagePoint}</p>
          {/* 아이템 및 특성 정보를 여기에 표시 */}
        </div>
      );
    };
  return (
    <div>
      {/* 상단 메뉴바 */}
      <NavBar />
  
      {/* 플레이어 전적 정보 */}
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
            <div>
              {playerDetails.records.map((record, index) => (
                <div key={index}>
                  <h3>{record.gameTypeId === 'rating' ? '랭크 게임' : '일반 게임'}</h3>
                  <Pie data={pieChartData(record)} options={{ responsive: true }} />
                </div>
              ))}
            </div>
            <div className="player-details-container">
        {/* 탭 버튼 */}
        <button onClick={() => setSelectedTab('all')}>모두 보기</button>
        <button onClick={() => setSelectedTab('rating')}>공식전</button>
        <button onClick={() => setSelectedTab('normal')}>일반전</button>

        {/* 매치 리스트 */}
        <div className="matches-container">
          {matches
            .filter(match => selectedTab === 'all' || match.gameTypeId === selectedTab)
            .map(match => renderMatch(match))
          }
        </div>
      </div>
          </div>
          
        ) : (
          <p className="loading">플레이어 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}

export default PlayerDetailsPage;
