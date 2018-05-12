## solve
1. webpack DefinePlugin 定义字符串 `" 'string' "`；
2. mobx react-route 都修改组件的shouldUpdate 导致url变了 组件不更新；
3. `Access-Control-Expose-Headers` 服务器把允许浏览器访问的头放入白名单;
4. 百度地图手机版是默认阻止自定义覆盖物的click事件的， 可以设置map的touchstart事件，map.addEventListener('touchstart',function(e){});其中e对象中保留了我们点击的那个覆盖物element，e.domEvent.srcElement。获得这个element调用element.click()
