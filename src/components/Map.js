/* eslint-disable no-undef */
import React from 'react';
import { compose, withProps, withState, withHandlers } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  InfoWindow,
} from 'react-google-maps';
import CustomPolygon from './CustomPolygon.js';
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
const { DrawingManager } = require("react-google-maps/lib/components/drawing/DrawingManager");

const MAPS_API_KEY = 'AIzaSyDUCtD8Bv47j7LtMbLksodMcO90I-xZ4vA';

export const MapWithControlledZoom = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div className='google-map-container' />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withState('zoom', 'onZoomChange', 2),
  withHandlers(() => {
    const refs = {
      map: undefined,
    }
    return {
      onMapMounted: () => ref => {
        refs.map = ref;
      },
      onZoomChanged: ({ onZoomChange }) => () => {
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultCenter={{ lat: 40, lng: 0 }}
    zoom={props.zoom}
    ref={props.onMapMounted}
    onZoomChanged={props.onZoomChanged}
    onClick={props.mapClicked}
    options={{minZoom: 1.5}}
  >
    {
      (props.isPolygonCreaton && props.showDrawing) ?
      <DrawingManager
        defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
        defaultOptions={{
          drawingControl: false,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.POLYGON,
            ],
          },
          polygonOptions: {
            strokeWeight: 2,
          },
        }}
        onPolygonComplete={polygon => {
          polygon.setMap(null);
          props.addPolygon(polygon);
        }}
      /> : null
    }
    {
      props.polygons.map(polygon => {
        return <CustomPolygon
          key={polygon.id}
          id={polygon.id}
          paths={polygon.paths}
          editable={polygon.isEditable}
          isHighLighted={polygon.isHighLighted}
          choosePolygonToEdit={(polygonID) => props.choosePolygonToEdit(polygonID)}
          cancelPolygonEditing={(polygonID, paths) => props.cancelPolygonEditing(polygonID, paths)}

          showPolygonPopup={props.showPolygonPopup}
          hidePolygonPopup={props.hidePolygonPopup}
        />
      })
    }
    {
      props.environmentsList.map((envMarker) =>
        <MarkerWithLabel
          key={envMarker.id}
          position={{ lat: envMarker.latitude, lng: envMarker.longitude }}
          labelAnchor={{ lat: 0, lng: 0 }}
          labelStyle={{backgroundColor: "#FFFFFF", fontSize: "12px", padding: "3px", cursor: 'default', borderRadius: '3px'}}
          onClick={(e) => props.editEnvironment(e, envMarker)}
          onMouseOver={() => props.highlightServerPolygons(envMarker.id, true)}
          onMouseOut={() => props.highlightServerPolygons(envMarker.id)}
        >
          <div>{`Environment: ${envMarker.envName}`}</div>
        </MarkerWithLabel>
      )
    }
    {
      props.isToolTip &&
      <InfoWindow position={props.toolTipPosition} onCloseClick={props.hideToolTip}>
        <div>
          {props.toolTipName}
        </div>
      </InfoWindow>
    }
  </GoogleMap>
);
