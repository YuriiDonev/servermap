/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import _ from 'lodash';

class ServerPopup extends PureComponent {

  state = {
    defaultServer: '',
    envName: '',
  }
  componentDidMount() {
    this.checkIsServerDefault();
    if (this.props.envName) this.setState({ envName: this.props.envName });
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    event.stopPropagation();
    if (event.keyCode === 27) {
      this.props.closePopup();
    }
  };

  checkIsServerDefault = () => {
    const server = _.find(this.props.envList, env => this.props.currentEnvId === env.id && env.defaultServer === true);
    if (server) {
      this.setState({ defaultServer: server.id });
    } else {
      this.setState({ defaultServer: '' });
    }
  }

  setInput = (e) => {
    if (e.target.name === 'env-name') {
      this.props.clearServerNameWarning();
      this.setState({ envName: e.target.value });
    }
  }

  changeDefaultServer = (e) => {
    this.setState({ defaultServer: e.target.name });
  }

  saveEnvironment = () => {
    this.props.saveEnvironment(this.props.currentEnvId, this.state.envName, this.state.defaultServer);
  }

  render() {
    return (
      <div className='popup'
        style={{
        'position': 'absolute',
        'top': `${this.props.y}px`,
        'left': `${this.props.x}px`,
      }}>
        <input type='text' autoFocus='true' name='env-name' placeholder='Enter the environment name...' onChange={this.setInput} value={this.state.envName} maxLength='20' />
        <div>{'Coordinates: '}</div>
        <div>{`- latitude: ${this.props.currentLat}`}</div>
        <div>{`- longitude: ${this.props.currentLng}`}</div>
        {
          this.props.isExistEnvEdit &&
          <div>
            <input type="checkbox" id="defaultServer" name={this.props.currentEnvId} checked={this.state.defaultServer} onChange={this.changeDefaultServer}
              disabled={this.state.defaultServer}
            />
            <label htmlFor="defaultServer">{'Default Server'}</label>
          </div>
        }
        <button onClick={this.saveEnvironment}>{'Save'}</button>
        <button onClick={this.props.closePopup}>{'Cancel'}</button>
        {
          this.props.isExistEnvEdit &&
          <button
            onClick={this.props.deleteEnvironment}
            disabled={this.state.defaultServer}
          >{'Delete'}</button>
        }
        {
          this.props.serverNameWarning &&
          <div className='popup-warning'>{this.props.serverNameWarning}</div>
        }
      </div>
    );
  }
}

export default ServerPopup;
