(function () {
    // Define our constructor
    gMaps = function (options) {
        // Create global element references
        this.markers = [];
        this.currentMarker = null;
        this.directionsService = null;
        this.directionsDisplay = null;
        this.maps = null;
        this.options = options;
        // Define option defaults
        var defaults = {
            provide: 'GoogleMaps',
            icon: '/Content/Images/cod30/deliver.png',
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

        if (!ensure(this.options)) {
            this.options = defaults;
        }

        this.mapProp = {
            center: this.options.center,
            zoom: this.options.zoom,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.RIGHT_TOP
            }
        };

        this.maps = new google.maps.Map(document.getElementById(this.options.mapId), this.mapProp);
        google.maps.event.addListenerOnce(this.maps, 'idle', function () {
            // do something only the first time the map is loaded
            //getLocation();
        });
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: this.options.polylineOptions
        });
        this.directionsDisplay.setMap(this.maps);
        this.directionsDisplay.setOptions({
            suppressMarkers: true
        });

    }

    // Public Methods
    gMaps.prototype.addMarker = function (location, title, pathIcon, moveToMarker, onClickFunction) {
        if (ensure(google.maps)) {
            return null;
        }

        var marker = new google.maps.Marker({
            position: location,
            map: this.maps,
            labelContent: title,
            labelAnchor: new google.maps.Point(22, 0),
            labelClass: "labels", // the CSS class for the label
            labelStyle: {
                opacity: 0.75
            }
        });

        //set icon    
        if (ensure(pathIcon)) {
            marker.setIcon(pathIcon);
        }

        if (!ensure(moveToMarker) && moveToMarker) {
            this.maps.panTo(location);
        }

        //set onclick function to makers
        if (ensure(onClickFunction)) {
            google.maps.event.addListener(marker, "click", onClickFunction);
        }

        gMarker = {
            id: GetGuid(),
            marker: marker
        }

        // add to list marker 
        this.markers.push(gMarker);

        return gMarker;
    }

    // go to location
    gMaps.prototype.panTo = function (location) {
        if (ensure(location) && ensure(this.maps.panTo)) {
            this.maps.panTo(location);
        }
    }

    gMaps.prototype.findMarker = function (uuid) {
        if (this.markers != null && this.markers.length > 0) {
            var marker_current = null;
            // find marker with uuid
            for (var i = 0; i < this.markers.length; i++) {
                if (this.markers[i].id == uuid) {
                    return this.markers[i].marker;
                }
            }
        }
    }

    gMaps.prototype.goMarker = function (uuid) {
        var marker_current = this.findMarker(uuid);
        // todo move to onClickEvent
        if (marker_current) {
            this.panTo(marker_current.position);
        }
    }

    // measure distance from|to is location {lnt, lng}
    gMaps.prototype.measureDistance = function (from, to, waypoints, callback) {
        var request = {
            origin: from,
            destination: to,
            waypoints: waypoints,
            optimizeWaypoints: this.options.optimizeWaypoints,
            travelMode: google.maps.TravelMode.DRIVING
        };

        this.directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var distext = 0;
                for (var i = 0; i < response.routes[0].legs.length; i++) {
                    distext += response.routes[0].legs[i].distance.value;
                }

                if (this.directionsDisplay) {
                    this.directionsDisplay.setMap(this.maps);
                    this.directionsDisplay.setDirections(response);
                }

                if (typeof callback === "function") {
                    callback(distext);
                }
            }
        }.bind({
            directionsDisplay: this.directionsDisplay,
            maps: this.maps,
            callback: this.callback
        }));

    }

    //measure distance from|to is Marker 
    gMaps.prototype.measureDistanceByMarker = function (from, to, waypoints, successCallBack) {
        if (from && to) {
            this.measureDistance(from.position, to.position, waypoints, successCallBack);
        }
    }
    // end Public Methods

    // Private Methods

    ensure = function (target, root) {
        if (typeof (target) !== "string")
            return false;
        if (typeof (root) !== "object") {
            root = window;
        }
        var items = target.split(".");
        for (var i = 0; i < items.length; i++) {
            root = root[items[i]];
            if (typeof (root) === "undefined" || root == null)
                return false;
        }
        return true;
    };

    function GetGuid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    // end Private Methods
}());