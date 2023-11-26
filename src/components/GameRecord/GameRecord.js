import React from 'react';
import './GameRecord.css'; // 가정한 CSS 파일 이름입니다.

const GameRecord = ({ match }) => {
    const itemImageUrl = "https://img-api.neople.co.kr/cy/items/";
    const characterImageUrl = "https://img-api.neople.co.kr/cy/characters/";
    const attributeImageUrl = "https://img-api.neople.co.kr/cy/position-attributes/";
    // 총 KDA를 계산하는 함수
    const calculateTotalKDA = (players) => {
        return players.reduce((acc, player) => {
            acc.kills += player.playInfo.killCount;
            acc.deaths += player.playInfo.deathCount;
            acc.assists += player.playInfo.assistCount;
            return acc;
        }, { kills: 0, deaths: 0, assists: 0 });
    };
    // 팀별 KDA 문자열을 반환하는 함수
    const kdaToString = (kda) => {
        const { kills, deaths, assists } = kda;
        return `${kills}/${deaths}/${assists}`;
    };

        // 팀별 플레이어 ID를 기반으로 총 KDA 계산
    const team1KDA = calculateTotalKDA(match.players.filter(player => match.teams[0].players.includes(player.playerId)));
    const team2KDA = calculateTotalKDA(match.players.filter(player => match.teams[1].players.includes(player.playerId)));

    return (
        <div className="game-record">
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col">
                        <h2 className="text-center">게임 상세</h2>
                        <div className="d-flex justify-content-between">
                            <span>날짜: {match.date}</span>
                            <span>게임 타입: {match.gameTypeId === 'rating' ? '레이팅' : '일반'}</span>
                            <span>지도: {match.map.name}</span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <h3 className="text-success">승리 팀 (KDA): {kdaToString(team1KDA)}</h3>
                    </div>
                    <div className="col-6">
                        <h3 className="text-danger">패배 팀 (KDA): {kdaToString(team2KDA)}</h3>
                    </div>
                </div>

                <div className="row mt-3">
                    {match.players.map(player => (
                        <div key={player.playerId} className="col-12 col-md-6 col-lg-4 mb-3">
                            <div className="card">
                                <img src={`${characterImageUrl}${player.playInfo.characterId}`} alt={player.playInfo.characterName} className="card-img-top player-character-image" />
                                <div className="card-body">
                                    <h5 className="card-title">닉네임: {player.nickname}</h5>
                                    <p className="card-text">캐릭터: {player.playInfo.characterName}</p>
                                    <p className="card-text">레벨: {player.playInfo.level}</p>
                                    <p className="card-text">K/D/A: {player.playInfo.killCount}/{player.playInfo.deathCount}/{player.playInfo.assistCount}</p>
                                    <div className="player-attributes">
                                        {player.position.attribute.map(attr => (
                                            <img key={attr.id} src={`${attributeImageUrl}${attr.id}`} alt={attr.name} title={attr.name} className="player-attribute-image" />
                                        ))}
                                    </div>
                                    <div className="player-items">
                                        {player.items.map(item => (
                                            <img key={item.itemId} src={`${itemImageUrl}${item.itemId}`} alt={item.itemName} title={item.itemName} className="player-item-image" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default GameRecord;
