# gMaps
Maps Utils for google maps


# HTML
```
<div id="map" style="width: 1000px; height: 500px"></div>
```
# Add scripts
```javascript
<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=AIzaSyCVClxzD6PC1DW_Jb-GqW1_UeO4xBU3iGU&sensor=false&amp;libraries=places">
</script>
<script type="text/javascript" src="../gMaps.js">
```
## Method
### Create GMaps
```
var maps = new gMaps();
```
## Options

```
var defaults = {
            provide: 'GoogleMaps',
            icon: 'icon-marker.png',
            mapId: "map",
            width: 600,
            height: 280,
            center: {
                lat: 10.7785886,
                lng: 106.66294909999999
            },
            zoom: 16,
            polylineOptions: {
                strokeColor: '#393',
                strokeOpacity: 1.0,
                strokeWeight: 3
            },
            optimizeWaypoints: true
        }
```
## addMarker
```
var myLatLng = new google.maps.LatLng(10.7785886, 106.66294909999999);
var picker = maps.addMarker(myLatLng, 'picker');
```
## goMarker

by uuid

```
var myLatLng = new google.maps.LatLng(10.7785886, 106.66294909999999);
var picker = maps.addMarker(myLatLng, 'picker');
maps.goMarker(picker.id);
```

panTo
```
var myLatLng = new google.maps.LatLng(10.7785886, 106.66294909999999);
var picker = maps.addMarker(myLatLng, 'picker');
maps.panTo(picker);
```

## findMarker 

with uuid

```
gMaps.findMarker(uuid)
```

## measureDistance

from, to, waypoints
```
myLatLng = new google.maps.LatLng(10.8785886, 106.66294909999999);
var stopPoint = maps.addMarker(myLatLng, 'stopPoint');
console.log(stopPoint);

waypoints.push({
    location: stopPoint.marker.position,
    stopover: true
});
var callbackDistanceSuccess = function (result) {
    console.log('callbackDistance:' + result);
}

maps.measureDistanceByMarker(picker.marker, deliver.marker, waypoints, callbackDistanceSuccess);
```
