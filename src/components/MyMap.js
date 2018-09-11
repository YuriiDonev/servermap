/* eslint-disable no-undef */
import React, { Component, PureComponent } from "react";
import _ from 'lodash';
import { compose, withProps, withState, withHandlers, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polygon,
} from "react-google-maps";

import CustomPolygon from './CustomPolygon.js';

import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
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
        //   var bounds = new google.maps.LatLngBounds();
        //   const mapBounds = refs.map.getBounds();
        //   bounds.extend(mapBounds);
        //   map.fitBounds(bounds);
      },
      onZoomChanged: ({ onZoomChange }) => () => {
        onZoomChange(refs.map.getZoom());
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultCenter={{ lat: 30, lng: 0 }}
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
          labelStyle={{backgroundColor: "#FFFFFF", fontSize: "12px", padding: "3px", cursor: 'default'}}
          onClick={() => props.editEnvironment(envMarker)}
        >
          <div>{envMarker.envName}</div>
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



// import React, { Component, PureComponent } from "react";
// import _ from 'lodash';
// import { compose, withProps, withState, withHandlers, lifecycle } from "recompose";
// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Marker,
//   InfoWindow,
// } from "react-google-maps";
//
// const MAPS_API_KEY = 'AIzaSyDUCtD8Bv47j7LtMbLksodMcO90I-xZ4vA';
//
// export const MapWithControlledZoom = compose(
//   withProps({
//     googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
//     loadingElement: <div style={{ height: `100%` }} />,
//     containerElement: <div className='google-map-container' />,
//     mapElement: <div style={{ height: `100%` }} />,
//   }),
//   withState('zoom', 'onZoomChange', 2),
//   withHandlers(() => {
//     const refs = {
//       map: undefined,
//     }
//
//     return {
//       onMapMounted: () => ref => {
//         refs.map = ref;
//       },
//       onZoomChanged: ({ onZoomChange }) => () => {
//         onZoomChange(refs.map.getZoom());
//       }
//     }
//   }),
//
//   withScriptjs,
//   withGoogleMap
// )(props =>
//   <GoogleMap
//     defaultCenter={{ lat: 0, lng: 0 }}
//     zoom={props.zoom}
//     ref={props.onMapMounted}
//     onZoomChanged={props.onZoomChanged}
//     onClick={props.mapClicked}
//   >
//     {
//       props.environmentsList.map((envMarker) =>
//       <Marker
//         position={{ lat: 50, lng: 60 }}
//         onClick={props.onToggleOpen}
//       />
//
//     )
//
//
//     }
//     <Marker
//       position={{ lat: 50, lng: 60 }}
//       onClick={props.onToggleOpen}
//     />
//
//     <InfoWindow position={{ lat: 15, lng: 20 }}>
//       {
//         (props.isInfoEditable) ? <input type='text' /> :
//         <div onClick={props.editInfoWindow}>
//           {'Some INfo here'}
//         </div>
//       }
//     </InfoWindow>
//     {
//       props.isMarkerShown &&
//       <Marker
//         position={props.markerPiosition}
//         onClick={props.onToggleOpen}
//       >
//         <InfoWindow onCloseClick={props.onToggleOpen}>
//           <div>
//             {" "}
//             Controlled zoom: {props.zoom}
//           </div>
//         </InfoWindow>
//       </Marker>
//     }
//   </GoogleMap>
// );





// import React, { Component } from 'react';
// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
//
// export const MapWithAMarker = withScriptjs(withGoogleMap((props) =>
//   <GoogleMap
//     ref={props.onMapMounted}
//     defaultZoom={props.zoom}
//     defaultCenter={{ lat: 0, lng: 0 }}
//     onClick={props.showMapClick}
//     onZoomChanged={props.onZoomChanged}
//   >
//     {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
//   </GoogleMap>
// ));
