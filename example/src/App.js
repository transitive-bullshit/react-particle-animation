import React, { Component } from 'react'

import ParticleAnimation from 'react-particle-animation'

import ribbon from './ribbon.png'

export default class App extends Component {
  render () {
    return (
      <div>
        <a href='https://github.com/transitive-bullshit/react-particle-animation'>
          <img
            src={ribbon}
            alt='Fork me on GitHub'
            style={{
              position: 'absolute',
              zIndex: 100,
              top: 0,
              right: 0
            }}
          />
        </a>

        <ParticleAnimation
          numParticles={500}
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      </div>
    )
  }
}
