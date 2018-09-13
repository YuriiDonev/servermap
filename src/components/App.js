/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import Select from 'react-select'

import { MapWithControlledZoom } from './Map.js';
import PolygonPopup from './PolygonPopup.js';
import ServerPopup from './ServerPopup.js';
import NewEnvPopup from './NewEnvPopup.js';

class App extends PureComponent {
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
    serverNameWarning: '',

    polygons: [],
    currentPolygonID: '',
    isPolygonCreaton: false,
    showDropdown: false,
    selectedMarker: '',
    currentEditablePolygon: '',

    showPolygonPopup: '',
    polygonPopupX: 0,
    polygonPopupY: 0,
    editPolygonHint: '',
  }

  componentDidMount() {
    this.setState({ envList: JSON.parse(localStorage.getItem('envList')) || [] });
    this.setState({ polygons: JSON.parse(localStorage.getItem('polygons')) || [] });
    this.setState({ currentEditablePolygon: localStorage.getItem('currentEditablePolygon') || '' });
  }

  addServersToLocalStorage = () => {
    localStorage.setItem('envList', JSON.stringify(this.state.envList));
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
    if ((this.state.currentPolygonID && this.state.showDropdown) || this.state.currentEditablePolygon) return;
    if (this.state.showPopup) {
      this.closePopup();
      return;
    }
    if (this.state.showPolygonPopup) {
      this.hidePolygonPopup();
      return;
    }
    if (this.state.showListX || this.state.showListY) {
      this.setState({showListX: '', showListY: ''});
    } else {
      this.setState({showListX: e.xa.clientX, showListY: e.xa.clientY});
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
    this.setState({ showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0, currentEnvId: '', envName: '',
    serverNameWarning: '' });
  }

  closeList = () => {
    this.setState({showListX: '', showListY: ''});
  }

  clearServerNameWarning = () => {
    this.setState({ serverNameWarning: '' });
  }

  checkSeverName = (name) => {
    return !!_.find(this.state.envList, env => env.envName === name);
  }

  saveEnvironment = (serverID, envName, isDefaultServer) => {
    if (!envName) return;
    if (this.state.isExistEnvEdit) {
      if (this.state.envName !== envName && this.checkSeverName(envName)) {
        this.setState({ serverNameWarning: 'Existing environment name' });
      } else {
        const newEnvList = [];
        this.state.envList.forEach(env => {
          let isServerDefault;
          if (isDefaultServer) {
            isServerDefault = (isDefaultServer && env.id === isDefaultServer) ? true : false;
          } else {
            isServerDefault = env.defaultServer;
          }
          let newServerName = (env.id === serverID) ? envName : env.envName;
          newEnvList.push({
            id: env.id,
            envName: newServerName,
            latitude: env.latitude,
            longitude: env.longitude,
            defaultServer: isServerDefault,
          });
        });
        this.setState({ envList: newEnvList, showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0, envName: '',
          isPolygonCreaton: false }, () => {this.addServersToLocalStorage()});
      }
    } else {
      if (this.checkSeverName(envName)) {
        this.setState({ serverNameWarning: 'Existing environment name' });
      } else {
        const newEnvItem = {
          id: `serverID-${uuidv4()}`,
          envName: envName,
          latitude: this.state.currentLat,
          longitude: this.state.currentLng,
          defaultServer: (_.isEmpty(this.state.envList)) ? true : false,
        };
        const currentList = [...this.state.envList];
        currentList.push(newEnvItem);
        this.setState({ envList: currentList, showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0,
          isPolygonCreaton: false }, () => this.addServersToLocalStorage());
      }
    }
  }

  clearLocalStorage = () => {
    localStorage.removeItem('envList');
    localStorage.removeItem('polygons');
    localStorage.removeItem('currentEditablePolygon');
    this.setState({ envList: [], isPolygonCreaton: false, showPopup: false, isExistEnvEdit: false, isInfoWindowEdit: false,
      showListX: '', showListY: '', polygons: []});
  }

  editEnvironment = (e, env) => {
    if ((this.state.currentPolygonID && this.state.showDropdown) || this.state.currentEditablePolygon) return;
    if (this.state.showPopup) {
      this.closePopup();
      return;
    } else if (this.state.showPolygonPopup) {
      this.hidePolygonPopup();
      return;
    }
    let x = '';
    let y = '';
    if (e.clientX || e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else if (e.xa.clientX) {
      x = e.xa.clientX;
      y = e.xa.clientY;
    } else {
      return;
    }
    this.setState({ isExistEnvEdit: true, currentEnvId: env.id,
    showPopup: true, showListX: x, showListY: y, currentLat: env.latitude, currentLng: env.longitude, envName: env.envName });
  }

  reassignPoligonsToDefaultServer = () => {
    const newPolygons = [];
    const { id, envName } = _.find(this.state.envList, env => env.defaultServer === true);

    this.state.polygons.forEach(polygon => {
      if (polygon.chosenServerID === this.state.currentEnvId) {
        newPolygons.push({
          id: polygon.id,
          isEditable: polygon.isEditable,
          isHighLighted: polygon.isHighLighted,
          chosenServerID: id,
          chosenServerName: envName,
          paths: polygon.paths,
        });
      } else {
        newPolygons.push(polygon);
      }
    });
    this.setState({ polygons: newPolygons }, () => this.addPolygonsToLocalStorage());
  }

  deleteEnvironment = () => {
    const editedList = _.filter(this.state.envList, env => env.id !== this.state.currentEnvId );
    this.reassignPoligonsToDefaultServer();
    this.setState({ envList: editedList, showPopup: false, showListX: '', showListY: '', isExistEnvEdit: false, currentLat: 0, currentLng: 0, envName: '' },
    () => this.addServersToLocalStorage());
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
    if (nearest) {
      const polygonID = `polygonID-${uuidv4()}`;
      newPolygons.push({
        id: polygonID,
        isEditable: false,
        isHighLighted: false,
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
    if (this.state.showDropdown || this.state.currentEditablePolygon) return;
    this.setState({ currentEditablePolygon: id, showPolygonPopup: '', polygonPopupX: 0, polygonPopupY: 0,
    editPolygonHint: 'Right click on current location to editing exit' }, this.addCurrentEditablePolygonToLocalStorage(id));

    const editablePolygon = _.find(this.state.polygons, polygon => id === polygon.id);
    editablePolygon.isEditable = true;
    const newPolygonsList = _.filter(this.state.polygons, polygon => id !== polygon.id);
    newPolygonsList.push(editablePolygon);
    this.setState({ polygons: newPolygonsList }, () => this.addPolygonsToLocalStorage());
  }

  savePolygonDataWithServer = (polygonID, newServer) => {
    let savingPolygon;
    let newPolygonsList;
    if (newServer) {
      savingPolygon = _.find(this.state.polygons, polygon => polygon.id === polygonID);
      savingPolygon.chosenServerID = newServer.value;
      savingPolygon.chosenServerName = newServer.label;
      newPolygonsList = _.filter(this.state.polygons, polygon => polygonID !== polygon.id);
    } else {
      savingPolygon = _.find(this.state.polygons, polygon => polygon.id === this.state.currentPolygonID);
      savingPolygon.chosenServerID = this.state.selectedMarker.value;
      savingPolygon.chosenServerName = this.state.selectedMarker.label;
      newPolygonsList = _.filter(this.state.polygons, polygon => this.state.currentPolygonID !== polygon.id);
    }
    newPolygonsList.push(savingPolygon);
    this.setState({polygons: newPolygonsList, currentPolygonID: '', showDropdown: false, selectedMarker: '',
      showPolygonPopup: '', polygonPopupX: 0, polygonPopupY: 0, showPopup: false, showListX: '', showListY: '' }, () => this.addPolygonsToLocalStorage());
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
    this.setState({ polygons: newPolygonsList, currentEditablePolygon: '', editPolygonHint: '' },
    () => {
      this.addPolygonsToLocalStorage();
      this.deleteCurrentEditablePolygonFromLocalStorage();
    });
  }

  showPolygonPopup = (polygonID, x, y) => {
    if ((this.state.currentPolygonID && this.state.showDropdown) || this.state.currentEditablePolygon) return;
    if (this.state.showPopup) {
      this.closePopup();
      return;
    } else if (this.state.showPolygonPopup) {
      this.hidePolygonPopup();
      return;
    }
    this.setState({ showPolygonPopup: polygonID, polygonPopupX: x, polygonPopupY: y, showPopup: false, showListX: '', showListY: '' });
  }

  hidePolygonPopup = () => {
    this.setState({ showPolygonPopup: '', polygonPopupX: 0, polygonPopupY: 0, showPopup: false, showListX: '', showListY: '' });
  }

  deletePolygon = () => {
    if (!this.state.showPolygonPopup) return;
    const newPolygonsList = _.filter(this.state.polygons, polygon => polygon.id !== this.state.showPolygonPopup);
    this.setState({ polygons: newPolygonsList, showPolygonPopup: '', polygonPopupX: 0, polygonPopupY: 0 },  () => this.addPolygonsToLocalStorage());
  }

  highlightServerPolygons = (serverID, isHighLight) => {
    const newPolygonsList = [];
    this.state.polygons.forEach(polygon => {
      newPolygonsList.push({
        id: polygon.id,
        isEditable: polygon.isEditable,
        isHighLighted: (polygon.chosenServerID === serverID && isHighLight) ? true : false,
        chosenServerID: polygon.chosenServerID,
        chosenServerName: polygon.chosenServerName,
        paths: polygon.paths,
      });
    });
    this.setState({ polygons: newPolygonsList });
  }

  render() {
    const options = this.state.envList.map(marker => ({ value: marker.id, label: marker.envName }));

    return (
      <div className='map-wrapper'>
        {
          this.state.editPolygonHint &&
          <div className='polygon-edit-hint'>
            {this.state.editPolygonHint}
          </div>
        }
        {
          this.state.showPolygonPopup &&
          <PolygonPopup
            servers={this.state.envList}
            polygons={this.state.polygons}
            x={this.state.polygonPopupX}
            y={this.state.polygonPopupY}
            polygonID={this.state.showPolygonPopup}
            choosePolygonToEdit={this.choosePolygonToEdit}
            hidePolygonPopup={this.hidePolygonPopup}
            deletePolygon={this.deletePolygon}
            savePolygonWithNewServer={this.savePolygonDataWithServer}
          />
        }
        <div className='main-create-area-buttons-container'>
          <button disabled={this.state.showDropdown || this.state.currentEditablePolygon || this.state.showPolygonPopup}
            onClick={this.clearLocalStorage}>{'Clear Data'}</button>
          <button
            disabled={this.state.showDropdown || this.state.currentEditablePolygon || this.state.isPolygonCreaton || this.state.showPolygonPopup
            || _.isEmpty(this.state.envList) || this.state.showPopup}
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
          showPolygonPopup={this.showPolygonPopup}
          hidePolygonPopup={this.hidePolygonPopup}
          highlightServerPolygons={this.highlightServerPolygons}
        />
        {
          (!this.state.showPolygonPopup && !this.state.showPopup && (this.state.showListX || this.state.showListY)) ?
          <NewEnvPopup
            x={this.state.showListX}
            y={this.state.showListY}
            createNewEnvironment={this.createNewEnvironment}
            closeList={this.closeList}
          />: null
        }
        {
          this.state.showPopup &&
          <ServerPopup
            y={this.state.showListY}
            x={this.state.showListX}
            setInput={this.setInput}
            envName={this.state.envName}
            currentLat={this.state.currentLat}
            currentLng={this.state.currentLng}
            currentEnvId={this.state.currentEnvId}
            envList={this.state.envList}
            changeDefaultServer={this.changeDefaultServer}
            saveEnvironment={this.saveEnvironment}
            closePopup={this.closePopup}
            isExistEnvEdit={this.state.isExistEnvEdit}
            deleteEnvironment={this.deleteEnvironment}
            serverNameWarning={this.state.serverNameWarning}
            clearServerNameWarning={this.clearServerNameWarning}
          />
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
    );
  }
}

export default App;
