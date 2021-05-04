import React from 'react';
import BlocksPanel from './Components/BlocksPanel';
import BricksPanel from './Components/BricksPanel';
import MainGamePanel from './Components/MainGamePanel';

export default class Game extends React.Component {
    render () {
        return (
            <div className='game-container'>
                <BlocksPanel/>
                <div>
                    <MainGamePanel/>
                    <BricksPanel/>
                </div>
            </div>
        );
    }
}