/* eslint-disable no-undef */
import React, { Component, PureComponent } from 'react';
import propTypes from 'prop-types';
import { Polygon } from 'react-google-maps';

class CustomPolygon extends Component {
  constructor(props) {
  super(props);
    this.polygonRef = React.createRef();
    // this.state = {
    //   currentPolygonID: '',
    //   polygonPopupX: 0,
    //   polygonPopupY: 0,
    // }
  }

  static propTypes = {
    id: propTypes.string.isRequired,
    paths: propTypes.arrayOf(
      propTypes.shape({
        lat: propTypes.number.isRequired,
        lng: propTypes.number.isRequired
      }).isRequired
    ),
    onChangeStart: propTypes.func,
    onChangeEnd: propTypes.func,
    onChangeSet: propTypes.func,
    onChangeInsert: propTypes.func,
    onChangeRemove: propTypes.func,
  }

  getNewPolygonpaths = () => {
    const polyArray = this.polygonRef.current.getPath().getArray();
    let paths = [];
    polyArray.forEach(function(path){
      paths.push({lat: path.lat(), lng: path.lng()});
    });
    return paths;
  }

  showPolygonPopup = (event) => {

    // this.setState({currentPolygonID: this.props.id, polygonPopupX: event.xa.clientX, polygonPopupY: event.xa.clientY });

    this.props.showPolygonPopup(this.props.id, event.xa.clientX, event.xa.clientY);
    // this.props.cancelPolygonEditing(this.props.id, this.getNewPolygonpaths());
  }

  render() {
    // const { paths, onChangeStart, onChangeEnd } = this.props;
    // onClick={() => this.props.choosePolygonToEdit(this.props.id)}
    // onRightClick={this.showPolygonPopup}
    // onRightClick={() => this.props.hidePolygonPopup(this.props.id)}

    return (
        <Polygon
          key={this.props.id}
          ref={this.polygonRef}
          paths={this.props.paths}

          onClick={this.showPolygonPopup}
          onRightClick={() => this.props.cancelPolygonEditing(this.props.id, this.getNewPolygonpaths())}

          options={{
            fillColor: '#ffff00',
            fillOpacity: 0.2,
            strokeWeight: 2,
            zIndex: 1,
            draggable: this.props.editable,
            editable: this.props.editable
          }}
        />
    );
  }
}

export default CustomPolygon;



// /* eslint-disable no-undef */
// import React, { Component, PureComponent } from 'react';
// import propTypes from 'prop-types';
// import { Polygon } from 'react-google-maps';
//
// class CustomPolygon extends Component {
//
//   static propTypes = {
//     id: propTypes.string.isRequired,
//     paths: propTypes.arrayOf(
//       propTypes.shape({
//         lat: propTypes.number.isRequired,
//         lng: propTypes.number.isRequired
//       }).isRequired
//     ),
//     onChangeStart: propTypes.func,
//     onChangeEnd: propTypes.func,
//     onChangeSet: propTypes.func,
//     onChangeInsert: propTypes.func,
//     onChangeRemove: propTypes.func,
//   }
//
//   static defaultProps = {
//     onChangeStart: () => null,
//     onChangeEnd: () => null,
//     onChangeSet: () => null,
//     onChangeInsert: () => null,
//     onChangeRemove: () => null,
//   }
//
//   state = {
//     polygonPaths: [],
//   }
//
//   componentDidMount() {
//     const addListener = (type, func) => google.maps.event.addListener(this.__polygon, type, func);
//
//     addListener('set_at', position => this.props.onChangeSet(this.onChange(position)));
//     addListener('insert_at', position => this.props.onChangeInsert(this.onChange(position)));
//     addListener('remove_at', position => this.props.onChangeRemove(this.onChange(position)));
//   }
//
//   onChange = position => {
//     // console.log('this.__polygon.getPath().getArray() ', this.__polygon.getPath().getArray());
//     // console.log('this.__polygon ', this.__polygon);
//     // console.log('this.__polygon.getArray() ', this.__polygon.getArray());
//     // const polyArray = this.__polygon.getArray();
//
//     // let paths = [];
//     // polyArray.forEach(function(path){
//     //   paths.push({lat: path.lat(), lng: path.lng()});
//     // });
//
//     // this.props.sendNewPathsAfterEdit(this.props.id, paths);
//     // console.log('paths ', paths);
//
//     //   return {
//     //   coordinate: {
//     //     lat: this.__polygon.b[position].lat(),
//     //     lng: this.__polygon.b[position].lng(),
//     //   },
//     //   id: this.props.id,
//     //   position,
//     // }
//   };
//
//   onRemove = position => ({
//     id: this.props.id,
//     position,
//   });
//
//   getNewPolygonpaths = () => {
//     const polyArray = this.__polygon.getArray();
//     let paths = [];
//     polyArray.forEach(function(path){
//       paths.push({lat: path.lat(), lng: path.lng()});
//     });
//     return paths;
//   }
//
//   onPolygonChangeStart = () => {
//     this.props.onChangeStart(this.props.id, this.getNewPolygonpaths());
//   }
//
//   onPolygonChangeEnd = () => {
//     this.props.onChangeEnd(this.props.id, this.getNewPolygonpaths());
//   }
//
//   __ref = ref => this.__polygon = ref && ref.getPath();
//
//   render() {
//
//     const { paths, onChangeStart, onChangeEnd } = this.props;
//
//     return <Polygon
//       ref={this.__ref}
//       paths={paths}
//       onMouseDown={this.onPolygonChangeStart}
//       onTouchStart={this.onPolygonChangeStart}
//       onMouseUp={this.onPolygonChangeEnd}
//       onTouchEnd={this.onPolygonChangeEnd}
//       onClick={() => this.props.choosePolygonToEdit(this.props.id)}
//       onRightClick={() => {this.props.cancelPolygonEditing(this.props.id)}}
//
//       options={{
//         fillColor: '#ffff00',
//         fillOpacity: 0.2,
//         strokeWeight: 2,
//         zIndex: 1,
//         draggable: this.props.editable,
//         editable: this.props.editable
//       }}
//     />;
//   }
// }
//
// export default CustomPolygon;
