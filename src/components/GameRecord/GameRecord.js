import React from 'react';
import './GameRecord.css'; // 가정한 CSS 파일 이름입니다.

const GameRecord = ({ match }) => {



// 팀별 플레이어 ID를 기반으로 총 KDA 계산
   const isPlayerInWinningTeam = (player) => 
        match.teams.find(team => team.result === 'win').players.includes(player.playerId);

    return (
        <div className="game-record">
            <div className="container">
                {/* ... 헤더 부분 ... */}
                {/* 팀별 선수들을 표시하는 부분 */}
                <div className="row">
                    {/* 승리 팀 */}
                    <div className="col-12 mb-3">
                        <h4 className="text-success">승리 팀</h4>
                        <div className="row">
                            {match.players.filter(isPlayerInWinningTeam).map(player => (
                                <div key={player.playerId} className="col-12">
                                    <div className="card border-success mb-2">
                                       <div className="card-body">
                                            <h5 className="card-title">
                                                <img src={`https://img-api.neople.co.kr/cy/characters/${player.playInfo.characterId}?zoom=1`} alt={player.playInfo.characterName}  />
                                                {/* 포지션과 특성 */}
                                                <div className="player-attributes">
                                                    {player.position.attribute.map(attr => (
                                                    <img key={attr.id} src={`https://img-api.neople.co.kr/cy/position-attributes/${attr.id}`} alt={attr.name} title={attr.name} className="player-attribute-image" />
                                                    ))}
                                                </div>
                                            {player.nickname}</h5>
                                            <p className="card-text">{player.playInfo.characterName}</p>
                                            <p className="card-text">레벨: {player.playInfo.level}</p>
                                            <p className="card-text">K/D/A: {player.playInfo.killCount}/{player.playInfo.deathCount}/{player.playInfo.assistCount}</p>
                                            {/* 아이템 */}
                                            <div className="player-items">
                                                {player.items.map(item => (
                                                    <img key={item.itemId} src={`https://img-api.neople.co.kr/cy/items/${item.itemId}`} alt={item.itemName} title={item.itemName} className="player-item-image" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 패배 팀 */}
                    <div className="col-12 mb-3">
                        <h4 className="text-danger">패배 팀</h4>
                        <div className="row">
                            {match.players.filter(player => !isPlayerInWinningTeam(player)).map(player => (
                                <div key={player.playerId} className="col-12">
                                <div className="card border-success mb-2">
                                   <div className="card-body">
                                        <h5 className="card-title">
                                            <img src={`https://img-api.neople.co.kr/cy/characters/${player.playInfo.characterId}?zoom=1`} alt={player.playInfo.characterName}  />
                                            {/* 포지션과 특성 */}
                                            <div className="player-attributes">
                                                {player.position.attribute.map(attr => (
                                                <img key={attr.id} src={`https://img-api.neople.co.kr/cy/position-attributes/${attr.id}`} alt={attr.name} title={attr.name} className="player-attribute-image" />
                                                ))}
                                            </div>
                                        {player.nickname}</h5>
                                        <p className="card-text">{player.playInfo.characterName}</p>
                                        <p className="card-text">레벨: {player.playInfo.level}</p>
                                        <p className="card-text">K/D/A: {player.playInfo.killCount}/{player.playInfo.deathCount}/{player.playInfo.assistCount}</p>
                                        {/* 아이템 */}
                                        <div className="player-items">
                                            {player.items.map(item => (
                                                <img key={item.itemId} src={`https://img-api.neople.co.kr/cy/items/${item.itemId}`} alt={item.itemName} title={item.itemName} className="player-item-image" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default GameRecord;
