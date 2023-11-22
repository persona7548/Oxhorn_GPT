import React, { useState, useEffect,useRef  } from 'react';
import { useNavigate } from 'react-router-dom'; // import 추가
import SearchBar from '../SearchBar/SearchBar';
import axios from 'axios';
import './SearchPage.css'; // CSS 파일 import
import '../../assets/css/bootstrap.min.css'

function SearchPage() {
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const searchRef = useRef(null);

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
        navigate(`/player/${playerId}`); // 사용자를 상세 페이지로 이동시킵니다.
        updateRecentSearches(nickname); // 중복되지 않는 검색어만 최근 검색 기록에 추가합니다.
      } else {
        // 검색 결과 없음 처리
        console.log('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('플레이어 정보를 가져오는 데 실패했습니다.', error);
    }
  };
  // 과거 검색 기록을 클릭했을 때의 처리 함수
  const handleRecentSearchClick = (nickname) => {
    handleSearch(nickname); // 과거 검색어로 검색을 수행합니다.
  };
  const updateRecentSearches = (searchTerm) => {
    // 중복되지 않는 항목만 남기기 위해 Set을 사용합니다.
    const searchesSet = new Set(recentSearches);
    if (!searchesSet.has(searchTerm)) {
      // 새로운 검색어가 기존의 검색 기록에 없으면 추가합니다.
      const updatedSearches = [searchTerm, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };
  const handleSearchBarClick = () => {
    // 검색창 클릭 시, 이전 검색 목록을 토글합니다.
    setShowRecentSearches(!showRecentSearches);
  };
  const handleDeleteSearch = (term) => {
    // 최근 검색어 삭제
    const updatedSearches = recentSearches.filter(search => search !== term);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecentSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);
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
    <div className="container py-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">홈</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/champion-analysis">챔피언 분석</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/statistics">통계</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/ranking">랭킹</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/multi-search">멀티서치</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="row justify-content-center">
        <div className="col-md-6 position-relative">
          <div ref={searchRef} className="search-container">
            {/* 검색 바 */}
            <SearchBar onSearch={handleSearch} onClick={handleSearchBarClick} />

            {/* 최근 검색 기록 */}
            <div className={showRecentSearches ? 'collapse show' : 'collapse'}>
              <div className="list-group">
                {recentSearches.map((search, index) => (
                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="recent-search-term" onClick={() => handleRecentSearchClick(search)}>
                      {search}
                    </span>
                    <button onClick={() => handleDeleteSearch(search)} className="btn btn-danger btn-sm delete-button">
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SearchPage;
