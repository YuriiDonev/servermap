/* eslint-disable no-undef */
import React, { Component, PureComponent } from "react"
import _ from 'lodash';
import { MapWithControlledZoom } from './MyMap.js';
import uuidv4 from 'uuid/v4';
import Select from 'react-select'


class MyFancyComponent extends PureComponent {
  state = {
    isMarkerShown: false,
    currentLat: 0,
    currentLng: 0,
    currentEnvId: '',
    envName: '',
    envList: [],
    isInfoWindowEdit: false,
    showListX: '',
    showListY: '',
    showPopup: false,
    isExistEnvEdit: false,

    polygons: [],
    currentPolygonID: '',
    isPolygonCreaton: false,
    showDropdown: false,
    selectedMarker: '',
    currentEditablePolygon: '',

    showPolygonPopup: '',
    polygonPopupX: 0,
    polygonPopupY: 0,
  }

  componentDidMount() {
    this.setState({ envList: JSON.parse(localStorage.getItem('envList')) || [] });
    this.setState({ polygons: JSON.parse(localStorage.getItem('polygons')) || [] });
    this.setState({ currentEditablePolygon: localStorage.getItem('currentEditablePolygon') || '' });
  }

  addPolygonsToLocalStorage = () => {
    localStorage.setItem('polygons', JSON.stringify(this.state.polygons));
  }

  addCurrentEditablePolygonToLocalStorage = (id) => {
    localStorage.setItem('currentEditablePolygon', id);
  }

  deleteCurrentEditablePolygonFromLocalStorage = () => {
    localStorage.removeItem('currentEditablePolygon');
  }

  mapClicked = (e) => {
    if (this.state.showPopup || this.state.showDropdown) return;

    if (this.state.showListX || this.state.showListY) {
      this.setState({showListX: '', showListY: ''});
    } else {
      this.setState({showListX: e.va.clientX, showListY: e.va.clientY});
    }
    this.setState({ currentLat: e.latLng.lat(), currentLng: e.latLng.lng() });
  }

  editInfoWindow = () => {
   this.setState({ isInfoWindowEdit: true });
  }

  createNewEnvironment = () => {
    this.setState({ showPopup: true });
  }

  closePopup = () => {
    this.setState({ showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0, envName: ''});
  }

  saveEnvironment = () => {
    if (!this.state.envName) return;

    if (this.state.isExistEnvEdit) {
      const editedList = _.filter(this.state.envList, env => {
        return env.id !== this.state.currentEnvId } );
      const editingEnv = _.find(this.state.envList, env => env.id === this.state.currentEnvId );
      editingEnv.envName = this.state.envName;
      editedList.push({
        id: this.state.currentEnvId,
        envName: this.state.envName,
        latitude: this.state.currentLat,
        longitude: this.state.currentLng,
      });
      localStorage.setItem('envList', JSON.stringify(editedList));
      this.setState({ showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0, envName: '',
        isPolygonCreaton: false }, () => {
        this.setState({ envList: JSON.parse(localStorage.getItem('envList')) || [] });
      });
    } else {
      const newEnvItem = {
        id: `serverID-${uuidv4()}`,
        envName: this.state.envName,
        latitude: this.state.currentLat,
        longitude: this.state.currentLng,
      };
      const currentList = [...this.state.envList];
      currentList.push(newEnvItem);
      localStorage.setItem('envList', JSON.stringify(currentList));
      this.setState({ showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0, envName: '',
        isPolygonCreaton: false }, () => {
        this.setState({ envList: JSON.parse(localStorage.getItem('envList')) || [] });
      });
    }
  }

  setInput = (e) => {
    if (e.target.name === 'env-name') {
      this.setState({ envName: e.target.value });
    }
  }

  clearLocalStorage = () => {
    localStorage.removeItem('envList');
    localStorage.removeItem('polygons');
    localStorage.removeItem('currentEditablePolygon');
    this.setState({ envList: [], isPolygonCreaton: false, showPopup: false, isExistEnvEdit: false, isInfoWindowEdit: false,
      showListX: '', showListY: '', polygons: []});
  }

  editEnvironment = (env) => {
    this.setState({ isExistEnvEdit: true,
    currentEnvId: env.id,
    showPopup: true, currentLat: env.latitude, currentLng: env.longitude, envName: env.envName });
  }

  deleteEnvironment = () => {
    const editedList = _.filter(this.state.envList, env => {
      return env.id !== this.state.currentEnvId } );
    localStorage.setItem('envList', JSON.stringify(editedList));
    this.setState({ showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0, envName: '' }, () => {
      this.setState({ envList: JSON.parse(localStorage.getItem('envList')) || [] });
    });
  }

  findNearestMarker = (polygonCoords) => {
    const res = [];
    this.state.envList.forEach(marker => {
      let dist = 0;
      const latLngFrom = new google.maps.LatLng(marker.latitude, marker.longitude);
      polygonCoords.forEach(pointCoord => {
        const latLngTo = new google.maps.LatLng(pointCoord.lat, pointCoord.lng);
        const distToPoint = google.maps.geometry.spherical.computeDistanceBetween(latLngFrom, latLngTo);
        if (dist < distToPoint) {
          dist = distToPoint;
        }
      });
      res.push({
        id: marker.id,
        name: marker.envName,
        nearestDist: dist,
      });
    });
    const closestMarker = _.minBy(res, marker => marker.nearestDist );
    return closestMarker;
  }

  addPolygon = (polygon) => {
    const newPolygons = [...this.state.polygons];
    const polyArray = polygon.getPath().getArray();
    let paths = [];
    polyArray.forEach(function(path){
      paths.push({lat: path.lat(), lng: path.lng()});
    });
    const nearest = this.findNearestMarker(paths);
    // console.log('nearest ', nearest);
    if (nearest) {
      const polygonID = `polygonID-${uuidv4()}`;
      newPolygons.push({
        id: polygonID,
        isEditable: false,
        chosenServerID: '',
        chosenServerName: '',
        paths,
      });
      this.setState({ polygons: newPolygons, currentPolygonID: polygonID, isPolygonCreaton: false, showDropdown: true,
        selectedMarker: { value: nearest.id, label: nearest.name } }, () => {
          this.addPolygonsToLocalStorage()});
    } else {
      this.setState({ isPolygonCreaton: false });
      return;
    }
  }

  startDrawPolygon = () => {
    this.setState({ isPolygonCreaton: true, showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0, envName: '' });
  }

  selectServer = (server) => {
    this.setState({ selectedMarker: server });
  }

  choosePolygonToEdit = (id) => {
    console.log('choosePolygonToEdit ', id);
    if (this.state.showDropdown || this.state.currentEditablePolygon) return;

    this.setState({ currentEditablePolygon: id, showPolygonPopup: '', polygonPopupX: 0, polygonPopupY: 0 },
      this.addCurrentEditablePolygonToLocalStorage(id));

    const editablePolygon = _.find(this.state.polygons, polygon => id === polygon.id);
    editablePolygon.isEditable = true;
    const newPolygonsList = _.filter(this.state.polygons, polygon => id !== polygon.id);
    newPolygonsList.push(editablePolygon);
    this.setState({ polygons: newPolygonsList }, () => this.addPolygonsToLocalStorage());
  }

  savePolygonDataWithServer = () => {
    const savingPolygon = _.find(this.state.polygons, polygon => polygon.id === this.state.currentPolygonID);
    savingPolygon.chosenServerID = this.state.selectedMarker.value;
    savingPolygon.chosenServerName = this.state.selectedMarker.label;
    const newPolygonsList = _.filter(this.state.polygons, polygon => this.state.currentPolygonID !== polygon.id);
    newPolygonsList.push(savingPolygon);
    this.setState({polygons: newPolygonsList, currentPolygonID: '', showDropdown: false, selectedMarker: '' });
  }

  cancelPolygonCreation = () => {
    const newPolygonsList = _.filter(this.state.polygons, polygon => this.state.currentPolygonID !== polygon.id);
    this.setState({ polygons: newPolygonsList, currentPolygonID: '', showDropdown: false, selectedMarker: '' },  () => this.addPolygonsToLocalStorage());
  }

  cancelPolygonEditing = (polygonID, newPaths) => {
    if (!this.state.currentEditablePolygon || this.state.currentEditablePolygon !== polygonID) return;

    const editablePolygon = _.find(this.state.polygons, polygon => polygon.id === polygonID);
    editablePolygon.isEditable = false;
    editablePolygon.paths = newPaths;

    const newPolygonsList = _.filter(this.state.polygons, polygon => polygon.id !== polygonID);
    newPolygonsList.push(editablePolygon);
    this.setState({ polygons: newPolygonsList, currentEditablePolygon: '' },
    () => {
      this.addPolygonsToLocalStorage();
      this.deleteCurrentEditablePolygonFromLocalStorage();
    });
  }

  showPolygonPopup = (polygonID, x, y) => {
    if (this.state.currentEditablePolygon) return;
    this.setState({ showPolygonPopup: polygonID, polygonPopupX: x, polygonPopupY: y });
  }

  hidePolygonPopup = () => {
    this.setState({ showPolygonPopup: '', polygonPopupX: 0, polygonPopupY: 0 });
  }

  deletePolygon = () => {
    if (!this.state.showPolygonPopup) return;
    const newPolygonsList = _.filter(this.state.polygons, polygon => polygon.id !== this.state.showPolygonPopup);
    this.setState({ polygons: newPolygonsList, showPolygonPopup: '', polygonPopupX: 0, polygonPopupY: 0 },  () => this.addPolygonsToLocalStorage());
  }

  render() {
    // console.log('RENDER this.state.polygons ', this.state.polygons);
    console.log('RENDER this.state ', this.state);

    const options = this.state.envList.map(marker => ({ value: marker.id, label: marker.envName }));

    return (
      <div className='map-wrapper'>

        {
          this.state.showPolygonPopup &&
          <div className='polygon-popup' style={{
            'position': 'absolute',
            'top': `${this.state.polygonPopupY}px`,
            'left': `${this.state.polygonPopupX}px`,
          }}>
            <div>{'Polygon info:'}</div>
            <div className='polygon-popup-list-item'
              onClick={() => this.choosePolygonToEdit(this.state.showPolygonPopup)}
            >{'Edit border/locaton'}</div>
            <div className='polygon-popup-list-item'
              onClick={this.deletePolygon}
              >{'Delete this area'}</div>
            <div className='polygon-popup-list-item' onClick={this.hidePolygonPopup}>{'Cancel'}</div>
          </div>
        }

        <div className='main-create-area-buttons-container'>
          <button disabled={this.state.showDropdown || this.state.currentEditablePolygon || this.state.showPolygonPopup} onClick={this.clearLocalStorage}>{'Clear Data'}</button>
          <button
            disabled={this.state.showDropdown || this.state.currentEditablePolygon || this.state.isPolygonCreaton || this.state.showPolygonPopup}
            onClick={this.startDrawPolygon}
          >{'Create New Area'}</button>
        </div>

        <MapWithControlledZoom
          isMarkerShown={this.state.isMarkerShown}
          mapClicked={this.mapClicked}
          markerPiosition={{lat: this.state.currentLat, lng: this.state.currentLng}}
          editInfoWindow={this.editInfoWindow}
          isInfoEditable={this.state.isInfoWindowEdit}
          environmentsList={this.state.envList}
          editEnvironment={this.editEnvironment}
          addPolygon={this.addPolygon}
          polygons={this.state.polygons}
          isPolygonCreaton={this.state.isPolygonCreaton}
          showDrawing={(_.isEmpty(this.state.envList)) ? false : true}
          choosePolygonToEdit={this.choosePolygonToEdit}
          cancelPolygonEditing={this.cancelPolygonEditing}
          sendNewPathsAfterEdit={this.sendNewPathsAfterEdit}
          showPolygonPopup={this.showPolygonPopup}
          hidePolygonPopup={this.hidePolygonPopup}
        />
        {
          (!this.state.showPopup && (this.state.showListX || this.state.showListY)) ?
          <div className='list' style={{
            'position': 'absolute',
            'top': `${this.state.showListY}px`,
            'left': `${this.state.showListX}px`,
          }}>
            <div className='list-item' onClick={this.createNewEnvironment}>{'Create Environment'}</div>
          </div> : null
        }
        {
          this.state.showPopup &&
          <div className='popup'>
            <input type='text' name='env-name' placeholder='Enter the environment name...' onChange={this.setInput} value={this.state.envName} />
            <div>{'Coordinates: '}</div>
            <div>{`- latitude: ${this.state.currentLat}`}</div>
            <div>{`- longitude: ${this.state.currentLng}`}</div>
            <div>{'Country: '}</div>
            <button onClick={this.saveEnvironment}>{'Save'}</button>
            <button onClick={this.closePopup}>{'Cancel'}</button>
            {
              this.state.isExistEnvEdit && <button onClick={this.deleteEnvironment}>{'Delete'}</button>
            }
          </div>
        }
        {
          this.state.showDropdown &&
          <div className='dropdown'>
            <div>{'Select your environment'}</div>
            <Select
              options={options}
              value={this.state.selectedMarker}
              onChange={this.selectServer}
            />
            <button onClick={this.savePolygonDataWithServer}>{'Save'}</button>
            <button onClick={this.cancelPolygonCreation}>{'Cancel'}</button>
          </div>
        }

      </div>
    )
  }
}

export default MyFancyComponent;
