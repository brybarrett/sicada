// Inisialisasi peta
var map = L.map('map').setView([-2.2, 115.5], 12);

// Menambahkan basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Menambahkan layer radar
var tms_example = L.tileLayer('https://inasiam.bmkg.go.id/api23/mpl_req/radar/radar/0/202503190225/202503190225/{z}/{x}/{y}.png?overlays=contourf', {
    tms: true, opacity :0.5
}).addTo(map);
// Menambahkan GeoJSON dengan CircleMarker berwarna magenta

// Fungsi untuk menambahkan label dari GeoJson
function addGeoJsonLabel() {
    fetch('station.geojson')
        .then(response => response.json())
        .then(data => {
            if (map.geoJsonLayer) {
                map.removeLayer(map.geoJsonLayer);
            }
            map.geoJsonLayer = L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
				var smallIcon = L.DivIcon.extend({
				  options: {
					iconSize: [70,52],
					iconAnchor: [feature.properties.label_anchor_x, feature.properties.label_anchor_y],
					//iconAnchor: [50, 0],
					html: "<div style='font-size: 8pt; color: black; background-color:rgba(255,240,0,0.95); padding: 2px; border-radius: 2px;'><b>" + feature.properties.location +"</b><br>Current : "+feature.properties.precipRate+"<br>Daily : "+feature.properties.precipTotal+"</div>"
				  }
				});
				return L.marker(latlng, {icon: new smallIcon()});
                }
            }).addTo(map);
        });
}



// Fungsi untuk menambahkan label dari GeoJson
function addGeoJsonLayer() {
    fetch('station.geojson')
        .then(response => response.json())
        .then(data => {
            map.geoJsonLayer = L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
				var geojsonMarkerOptions = {
					radius: 6,
					fillColor: "magenta",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.7
				};
				return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
        });
}


// Memuat layer layer point dari GeoJson
addGeoJsonLabel();
// Memuat layer layer point dari GeoJson
addGeoJsonLayer();


// Mengatur interval untuk memuat ulang layer GeoJSON setiap 10 menit
setInterval(addGeoJsonLabel, 10 * 60 * 1000);
setInterval(addGeoJsonLayer, 5 * 60 * 1000);
