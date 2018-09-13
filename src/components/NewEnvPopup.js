/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
// import _ from 'lodash';

class NewEnvPopup extends PureComponent {

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    event.stopPropagation();
    if (event.keyCode === 27) {
      this.props.closeList();
    }
  };

  render() {
    return (
      <div className='list' style={{
        'position': 'absolute',
        'top': `${this.props.y}px`,
        'left': `${this.props.x}px`,
      }}>
        <div className='list-item' onClick={this.props.createNewEnvironment}>{'Create Environment'}</div>
      </div>
    );
  }
}

export default NewEnvPopup;
