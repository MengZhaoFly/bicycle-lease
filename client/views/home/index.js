import React from 'react';
// import { Link } from 'react-router-dom';
import AppBar from '../../components/AppBar';
import { withStyles } from 'material-ui/styles';
// import location from '@imagesPath/location.png';

const styles = {
  map: {
    width: '100%',
    height: 'calc(100vh - 56px)'
  }
};

class Home extends React.Component {
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
    const translateCallback = (data) => {
      if (data.status === 0) {
        const point = data.points[0];
        // var myIcon = new BMap.Icon("http://p7mkbgmyd.bkt.clouddn.com/location.png", new BMap.Size(16, 16));
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
    }
    this.handleGetLocation()
      .then(position => {
        // 经度
        var longitude = position.coords.longitude;
        // 纬度
        var latitude = position.coords.latitude;
        console.log("经度:" + longitude + ", 纬度:" + latitude);
        var ggPoint = new BMap.Point(longitude, latitude);


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
    let map = new BMap.Map("map");
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
    ]
    map.setMapStyle({ styleJson: styleJson });
    this.handleSetCurrentPos(map);
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar />
        <div id="map" className={classes.map}>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);

