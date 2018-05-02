import React from 'react';
// import { Link } from 'react-router-dom';
import AppBar from '../../components/AppBar';
import { withStyles } from 'material-ui/styles';
import location from '@imagesPath/location.png';

const styles = theme => ({
  map: {
    width: '100%',
    height: theme.globalClass.heightFull
  },
  container: {
    position: 'relative'
  },
  location: {
    position: 'absolute',
    cursor: 'pointer',
    right: 0,
    bottom: 20,
    width: 56,
    height: 56
  }
});

class Home extends React.Component {
  constructor () {
    super();
    this.map = null;
  }
  handleGetLocation = () => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 1000
    };
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        //浏览器支持geolocation
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            resolve(position);
          },
          (error) => {
            reject(`${error.code}--${error.message}`);
          },
          options
        );
      } else {
        console.log('浏览器不支持GeoLocation!');
        reject('浏览器不支持GeoLocation!');
      }
    });
  }
  handleSetCurrentPos = (map) => {
    map = map || this.map;
    console.log(map);
    const translateCallback = (data) => {
      if (data.status === 0) {
        const point = data.points[0];
        // var myIcon = new BMap.Icon("http://p7mkbgmyd.bkt.clouddn.com/location.png", new BMap.Size(16, 16));
        /* eslint-disable */
        var marker = new BMap.Marker(point);
        // var marker = new BMap.Marker(point, {icon: myIcon});
        map.addOverlay(marker);
        //
        // var label = new BMap.Label("你在这",{offset:new BMap.Size(20,-10)});
        // marker.setLabel(label); //添加百度label
        map.setCenter(point);
        map.centerAndZoom(point, 16);
        map.panTo(point);
      }
    };
    this.handleGetLocation()
      .then(position => {
        // 经度
        var longitude = position.coords.longitude;
        // 纬度
        var latitude = position.coords.latitude;
        console.log("经度:" + longitude + ", 纬度:" + latitude);
        /* eslint-disable */
        var ggPoint = new BMap.Point(longitude, latitude);

        /* eslint-disable */
        let convertor = new BMap.Convertor();
        let pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 1, 5, translateCallback);

      })
      .catch(err => {
        console.error(err);
      });
  }
  componentDidMount() {
    /* eslint-disable */
    let map = new BMap.Map("map");
    this.map = map;
    var styleJson = [
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": {
          "hue": "#007fff",
          "saturation": 89
        }
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": {
          "color": "#ffffff"
        }
      }
    ];
    map.setMapStyle({ styleJson: styleJson });
    this.handleSetCurrentPos(map);
  }
  render() {
    const { classes } = this.props;
    return (
      <div classes={classes.container}>
        <AppBar />
        <div id="map" className={classes.map}>
          
        </div>
        <img src={location} alt="" className={classes.location} onClick={this.handleSetCurrentPos}/>
      </div>
    );
  }
}

export default withStyles(styles)(Home);

