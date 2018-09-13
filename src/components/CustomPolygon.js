/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { Polygon } from 'react-google-maps';

class CustomPolygon extends PureComponent {
  constructor(props) {
  super(props);
    this.polygonRef = React.createRef();
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
    this.props.showPolygonPopup(this.props.id, event.xa.clientX, event.xa.clientY);
  }

  render() {
    // console.log('CustomPolygon this.props ', this.props);
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
            fillColor: `${(this.props.isHighLighted) ? 'red' : '#ffff00'}`,
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
