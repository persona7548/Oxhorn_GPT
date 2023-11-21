import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import SearchPage from './components/SearchPage/SearchPage';
import PlayerDetailsPage from './components/PlayerDetailsPage/PlayerDetailsPage'; // 상세 페이지 컴포넌트를 import 합니다.

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/player/:playerId" element={<PlayerDetailsPage />} /> {/* 플레이어 상세 페이지 라우트 */}
      </Routes>
    </Router>
  );
}

export default App;