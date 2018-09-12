/* eslint-disable no-undef */
import React, { PureComponent } from "react"
import _ from 'lodash';
import Select from 'react-select'


class PolygonPopup extends PureComponent {
  state = {
    selectedServer: '',
  }

  componentDidMount() {
    const currentPolygon = _.find(this.props.polygons, polygon => polygon.id === this.props.polygonID);
    this.setState({ selectedServer: {value: currentPolygon.chosenServerID, label: currentPolygon.chosenServerName }});
  }

  selectServer = (server) => {
    this.setState({ selectedServer: server });
  }

  savePolygonWithNewServer = () => {
    this.props.savePolygonWithNewServer(this.props.polygonID, this.state.selectedServer);
  }

  render() {
    const options = this.props.servers.map(server => ({ value: server.id, label: server.envName }));

    return (
      <div className='polygon-popup' style={{
        'position': 'absolute',
        'top': `${this.props.y}px`,
        'left': `${this.props.x}px`,
      }}>

        <div>
          <div>{'Select your environment'}</div>
          <Select
            options={options}
            value={this.state.selectedServer}
            onChange={this.selectServer}
          />

        </div>

        <div className='polygon-popup-list-item'
          onClick={() => this.props.choosePolygonToEdit(this.props.polygonID)}
        >{'Edit border/locaton'}</div>
        <div className='polygon-popup-list-item'
          onClick={this.props.deletePolygon}
          >{'Delete this area'}</div>
        <div className='polygon-popup-list-item' onClick={this.savePolygonWithNewServer}>{'Save'}</div>
        <div className='polygon-popup-list-item' onClick={this.props.hidePolygonPopup}>{'Cancel'}</div>
      </div>
    );
  }
}

export default PolygonPopup;
