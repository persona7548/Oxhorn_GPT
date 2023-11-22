// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom'; // react-router-dom의 Link 컴포넌트를 사용합니다.

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">홈</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/champion-analysis">챔피언 분석</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/statistics">통계</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ranking">랭킹</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/multi-search">멀티서치</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
