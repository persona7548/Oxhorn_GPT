import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // import 추가
import SearchBar from '../SearchBar/SearchBar';
import axios from 'axios';
import './SearchPage.css'; // CSS 파일 import

function SearchPage() {
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
      // 로컬 스토리지에서 최근 검색어 불러오기
      const searches = localStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    }, []);
  
  const [playerInfo, setPlayerInfo] = useState(null);
  const navigate = useNavigate(); // 네비게이션 함수 사용

  const handleSearch =async  (nickname) => {
    const encodedNickname = encodeURIComponent(nickname);
    const apiKey = process.env.REACT_APP_API_KEY;
    const searchUrl = `/cy/players?nickname=${encodedNickname}&wordType=full&apikey=${apiKey}`;

    try {
      const response = await axios.get(searchUrl);
      if (response.data.rows.length > 0) {
        const playerId = response.data.rows[0].playerId;
        getPlayerDetails(playerId);
      } else {
        // 검색 결과 없음 처리
        console.log('검색 결과가 없습니다.');
        setPlayerInfo(null);
      }
    } catch (error) {
      console.error('플레이어 정보를 가져오는 데 실패했습니다.', error);
    }
    const updatedSearches = [nickname, ...recentSearches].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  
  const handleDeleteSearch = (term) => {
    // 최근 검색어 삭제
    const updatedSearches = recentSearches.filter(search => search !== term);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const getPlayerDetails = async (playerId) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const detailsUrl = `/cy/players/${playerId}?apikey=${apiKey}`;

    try {
      const response = await axios.get(detailsUrl);
      setPlayerInfo(response.data);
      navigate(`/player/${playerId}`); // 플레이어 정보 페이지로 이동
    } catch (error) {
      console.error('플레이어 상세 정보를 가져오는 데 실패했습니다.', error);
    }
  };

  // 검색 결과 컴포넌트 렌더링 (옵션)
  const renderPlayerInfo = () => {
    if (playerInfo) {
        return (
            <div>
              {/* 플레이어 정보 렌더링 */}
              <h1>{playerInfo.nickname}</h1>
              {/* 추가 정보 렌더링 */}
            </div>
          );
        }
    return null;
  };

  return (
    <div className="search-page">
      <div className="menu-bar">
        <button>홈</button>
        <button>챔피언 분석</button>
        <button>통계</button>
        <button>랭킹</button>
        <button>멀티서치</button>
      </div>
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="recent-searches">
        {recentSearches.map((search, index) => (
          <div key={index} className="recent-search">
            <span>{search}</span>
            <button onClick={() => handleDeleteSearch(search)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
