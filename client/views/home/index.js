import React from 'react';
// import { Link } from 'react-router-dom';
import AppBar from '../../components/AppBar';
import { withStyles } from 'material-ui/styles';
import { observer, inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import AlarmIcon from 'material-ui-icons/Alarm';
import Drawer from 'material-ui/Drawer';
import moment from 'moment';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import location from '@imagesPath/location.png';
import { get, post } from '../../http/axios';

const styles = theme => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    '& > div:first-child': {
      flexGrow: 0
    }
  },
  button: {
    margin: theme.spacing.unit
  },
  map: {
    flex: 1,
  },
  location: {
    position: 'absolute',
    cursor: 'pointer',
    right: 10,
    bottom: 20,
    width: 40,
    height: 40
  },
  buttonWrap: {
    display: 'flex',
    justifyContent: 'center',

  },
  buttonWrapButton: {
    margin: '4px 0',
    position: 'relative',
    '& span': {
      color: '#ffffff'
    }
  }
});

@inject('appState') @observer
class Home extends React.Component {
  constructor() {
    super();
    this.map = null; // 地图实例
    this.polyline = null;  // 绘制的线
    this.calRealTimeAnimation = null;
    this.state = {
      point: null,
      roundPos: [],
      bottomDrawer: false,  // 是否向上划出steps
      distance: null,   // 距离
      stepsArr: [],   // 多少步数
      haveUsedTime: [0, 0, 0], // 已经用车的时间
      beginTime: null,
      isUsing: false,
      pay: 0,
      bicycleId: null
    }
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
  handleDrawRoundPos = () => {
    const map = this.map;
    const {point} = this.state;
    if (!map) return false;
    get('/bicycle/list')
      .then(data => {
        data.forEach((pos, i) => {
          const point = {
            lng: pos.longitude,
            lat: pos.latitude
          }
          var opts = {
            position: point,
            offset: new BMap.Size(-20, -32)
          }
          const labelHTML = `<img src='https://test-1256257404.cos.ap-chengdu.myqcloud.com/location-32.png'
            data-lat=${pos.latitude}
            data-lng=${pos.longitude}
            data-bid=${pos.id}
            data-identification='bicycle'
          />`;
          var label = new BMap.Label(labelHTML, opts);  // 创建文本标注对象
          label.setStyle({
            height: "32px",
            width: "32px",
            border: 'none',
            backgroundColor: 'none',
            cursor: 'pointer'
          });
          map.addOverlay(label);
        })
        this.setState({
          roundPos: data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  // 移动地图
  handleMapPan = () => {
    const map = this.map;
    const {point} = this.state;
    if (map && point) {
      map.panTo(point);
    }
  }
  handleInitState = () => {
    const {bicycleId} = this.state;
    const {userId} = this.props.appState;
    console.log('handleInitState', this.props.appState.isLogin);
    if (!this.props.appState.isLogin) return false;
    get('/using/status', {
      userId
    })
      .then(res => {
        if (res.status === 200) {
          if (res.isUsing) {
            // const haveUsedTime = res.haveUsedTime
            // const haveUsedTimeMinute = haveUsedTime[0] * 60 + haveUsedTime[1];
            // let pay = Math.floor((haveUsedTimeMinute - 10) / 10) * 0.5
            this.setState({
              isUsing: true,
              bottomDrawer: true,
              bicycleId: res.bicycleId,
              beginTime: res.beginTime
            }, () => {
              this.handleCalculatorUsringTime();
            })
          }
        }
      })
  }
  handleSetCurrentPos = (map) => {
    map = map || this.map;
    const translateCallback = (data) => {

      if (data.status === 0) {
        const point = data.points[0];
        this.setState({
          point
        });
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
        this.handleDrawRoundPos();
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
    map.addEventListener('touchstart', (e) => {
      const element = e.domEvent.srcElement;
      element.click();
    })
  }
  handlePolyline = (datas) => {
    const map = this.map;
    this.polyline = new BMap.Polyline(datas, { strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5 });
    map.addOverlay(this.polyline);
  }
  handleMarkerClick = (e) => {
    // console.log(e.target.tagName);
    const map = this.map;
    const {point} = this.state;
    if (e && e.target && e.target.tagName === 'IMG') {
      const lat = e.target.dataset.lat;
      const lng = e.target.dataset.lng;
      const bicycleId = e.target.dataset.bid;
      const endPoint = new BMap.Point(lng, lat);
      const startPoint = new BMap.Point(point.lng, point.lat);
      const identification = e.target.dataset.identification;
      if (identification === 'bicycle') {
        let anotherMap = new BMap.Map("anotherMap")
        let walkings = new BMap.WalkingRoute(anotherMap, { renderOptions: { map: anotherMap, autoViewport: true } });
        walkings.search(startPoint, endPoint);
        walkings.setSearchCompleteCallback((rs) => {
          let chartData = [];
          let stepsArr = [];
          const route = walkings.getResults().getPlan(0).getRoute(0);
          const pts = route.getPath();
          const distance = route.getDistance(false);
          const numSteps = route.getNumSteps();
          for (let i = 0; i < numSteps; i++) {
            stepsArr.push(route.getStep(i).getDescription(false));
          }
          this.setState({
            stepsArr,
            bottomDrawer: true,
            distance,
            bicycleId
          });
          for (var i = 0; i < pts.length; i++) {
            chartData.push(new BMap.Point(pts[i].lng, pts[i].lat));
          }
          // 得到绘制起点终点之间的点，绘制线
          if (this.polyline) {
            map.removeOverlay(this.polyline);
          }
          this.handlePolyline(chartData);
        });
      }
    }
  }
  handleToggleDrawer = () => {
    this.setState({
      bottomDrawer: false
    })
  }
  handleRent = () => {
    const appState = this.props.appState;
    if (!appState.isLogin && !appState.userId) {
      this.props.history.push('/signin?from=/index');
    }
    else {
      const {bicycleId} = this.state;
      const {userId} = this.props.appState;
      post('/using/create', {
        userId,
        bicycleId
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              isUsing: true,
              haveUsedTime: [0, 0, 0],
              beginTime: res.beginTime
            }, () => {
              this.handleCalculatorUsringTime();
            })
          }
        })
    }

  }
  handleCalculatorUsringTime = () => {
    const {beginTime, bottomDrawer, pay} = this.state;
    // if (!bottomDrawer) return false;
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const diff = moment.duration(moment(currentTime).diff(moment(beginTime)));
    // console.log(currentTime, beginTime, haveUsedTime);
    const hours = parseInt(diff.asHours());
    let minutes = parseInt(diff.asMinutes());
    if (minutes > 10) {
      let currentPay = Math.floor((minutes - 10) / 10) * 0.5;
      if (pay !== currentPay) {
        this.setState({
          pay: currentPay
        })
      }
    }
    minutes = minutes - hours * 60;
    let second = parseInt(diff.asSeconds());
    second = second - (hours * 60 * 60 + minutes * 60);
    const haveUsedTime = [hours, minutes, second];
    this.setState({
      haveUsedTime
    });
    this.calRealTimeAnimation = requestAnimationFrame(this.handleCalculatorUsringTime);
  }
  handleOverRent = () => {
    const {pay, bicycleId} = this.state;
    const {userId} = this.props.appState;
    post('/using/close', {
      userId,
      bicycleId,
      pay
    })
      .then(res => {
        if (res.status === 200) {
          console.log('/using/close', res);
          cancelAnimationFrame(this.calRealTimeAnimation);
          // this.setState({
          //   bottomDrawer: false
          // })
        }
      })
  }
  renderStep = (route) => {
    const {stepsArr, distance} = this.state;
    if (!stepsArr) return null;
    if (stepsArr.length === 0) {
      return (
        <List component="nav">
          <ListItem button>
            <ListItemText primary={'暂无步行方案'} />
          </ListItem>
        </List>
      )
    }
    return (
      <List component="nav">
        {
          stepsArr.map((step, index) => {
            if (index > 0) {
              return (
                <React.Fragment key={index}>
                  <Divider />
                  <ListItem button>
                    <ListItemText primary={step} />
                  </ListItem>
                </React.Fragment>
              );
            }
            if (index === 0) {
              return (
                <ListItem button key={0}>
                  <ListItemText primary={step} />
                </ListItem>
              );
            }
          })
        }
      </List>
    )
  }
  render() {
    const { classes } = this.props;
    const { bottomDrawer, distance, isUsing, pay, haveUsedTime } = this.state;
    return (
      <div className={classes.container}>
        <AppBar onFinishAuth={this.handleInitState}/>
        <div id="map" className={classes.map} onClick={this.handleMarkerClick}>

        </div>
        <img src={location} alt="" className={classes.location} onClick={this.handleMapPan} />
        <div id="anotherMap" style={{
          display: 'none', width: 0, height: 0, visibility: 'hidden'
        }}></div>
        <Drawer
          anchor="bottom"
          open={bottomDrawer}
          onClose={this.handleToggleDrawer}
        >
          {
            isUsing ?
              <div className={classes.buttonWrap} style={{ flexDirection: 'column' }}>
                <div className={classes.buttonWrap}>
                  <Button color="primary" className={classes.button} style={{
                    fontSize: '1.8rem',
                    background: 'none',
                    boxShadow: 'none'
                  }}>

                    <span >
                      {haveUsedTime.map(time => {
                        if (time <= 9) {
                          return `0${time}`;
                        }
                        else {
                          return `${time}`;
                        }
                      }).join(':')}
                    </span>
                  </Button>
                </div>
                <p style={{ textAlign: 'center', padding: 10 }}>
                  {/*<IconButton color="secondary" className={classes.button} aria-label="Add an alarm">
                    <AlarmIcon />
                  </IconButton>*/}
                  共花费{pay}元
                </p>
                <Button color="secondary" className={classes.button} onClick={this.handleOverRent}>
                  立即还车
                </Button>


              </div> :
              <div tabIndex={0} role="button">
                {this.renderStep()}
                <Divider />
                <div className={classes.buttonWrap}>
                  <Button color="primary"
                    onClick={this.handleRent}
                    className={classes.button}
                    className={classes.buttonWrapButton}>
                    立即用车
              </Button>
                </div>
              </div>
          }
        </Drawer>
      </div>
    );
  }
}
Home = withRouter(Home);
export default withStyles(styles)(Home);

