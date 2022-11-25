// ベースマップを作成する
// ここでは3DのOpenStreetMapを表示する
var map =  new maplibregl.Map({
    container: 'map',
    style: 'https://tile2.openstreetmap.jp/styles/osm-bright/style.json',
    center: [140.44682363, 36.34173699],
    zoom: 7,
    hash: true,
    pitch: 30,
    localIdeographFontFamily: false
})

// UIツール
// 右下のズームレベルの＋−ボタンを表示する
map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
// 右上の現在位置の取得ボタンを表示する
map.addControl(new maplibregl.GeolocateControl({positionOptions: {enableHighAccuracy: true},trackUserLocation: true}), 'top-right');
// 左下の尺度を表示する
map.addControl(new maplibregl.ScaleControl() );

// TODO: 画面がロードされたら地図にレイヤを追加する

map.on('load', function () {

    
    map.addSource('bousai', {
        'type': 'raster',
        'tiles': [
            //`https://www.jma.go.jp/bosai/jmatile/data/nowc/${basetime}/none/${basetime}/surf/hrpns/{z}/{x}/{y}.png`
            `https://w-hazardmap.nhk.or.jp/flood/flood-all/20220720/{z}/{x}/{y}.png`
        ],
        'tileSize': 256,
        
    });
    map.addLayer({
        'id': 'bousai_raster',
        'type': 'raster',
        'source': 'bousai',
        
    });
    
    // ポイントソース設定
map.addSource('vt', {
    'type': 'vector',
    promoteId: "N03_007",
    'tiles': ['https://azarashiha.github.io/vt/{z}/{x}/{y}.pbf']//['https://weatherbox.github.io/warning-area-vt/v2/{z}/{x}/{y}.pbf']
    //"https://weatherbox.github.io/warning-area-vt/v2/{z}/{x}/{y}.pbf"
});

// ポイントスタイル設定
map.addLayer({
    "id": "vt",
    "type": "fill",
    "source": "vt",
    "source-layer": "city",
    'paint': {
        //https://www.w3schools.com/css/css_colors_rgb.asp
        'fill-color': 'rgba(255, 255, 255, 0.1)',
        'fill-outline-color': 'rgba(0, 0, 0, 0.9)'//'rgba(200, 100, 240, 1)'
        }
    },
    );

/////////
map.addLayer(
    {
    'id': 'counties-highlighted',
    'type': 'fill',
    'source': 'vt',
    'source-layer': 'city',
    'paint': {
    'fill-outline-color': '#384fff',
    'fill-color': '#384fff',
    'fill-opacity': 0.75
    },
    'filter': ['in', 'N03_007', '']
    },
    
    ); // Place polygon under these labels.

map.on('click', (e) => {
    // Set `bbox` as 5px reactangle area around clicked point.
    const bbox = [
    [e.point.x - 1, e.point.y - 1],
    [e.point.x + 1, e.point.y + 1]
    ];
    // Find features intersecting the bounding box.
    const selectedFeatures = map.queryRenderedFeatures(bbox, {
    layers: ['vt']
    });

    //クリックイベントはここから
    console.log(selectedFeatures[0])
    //console.log(selectedFeatures[0].id)
    console.log(selectedFeatures[0].properties.N03_001)
    console.log(selectedFeatures[0].properties.N03_004)
    console.log(selectedFeatures[0].properties.N03_007)
    var pref = document.getElementById("pref");
    var city = document.getElementById("city");
    var cityid = document.getElementById("cityid");
    pref.innerHTML = selectedFeatures[0].properties.N03_001;
    city.innerHTML = selectedFeatures[0].properties.N03_004;
    //console.log(selectedFeatures[0].properties.N03_003)
    cityid.innerHTML = selectedFeatures[0].properties.N03_007;
    

    const fips = selectedFeatures.map(
    (feature) => feature.properties.N03_007
    );
    // Set a filter matching selected features by FIPS codes
    // to activate the 'counties-highlighted' layer.
    map.setFilter('counties-highlighted', ['in', 'N03_007', ...fips]);
    });


    








});


map.on('mousemove', (e) => {
    var features = map.queryRenderedFeatures(e.point);
    // Limit the number of properties we're displaying for
    // legibility and performance
    const displayProperties = [
        'type',
        'properties',
        'id',
        'layer',
        'source',
        'sourceLayer',
        'state'
        ];
        
        const displayFeatures = features.map((feat) => {
        const displayFeat = {};
        displayProperties.forEach((prop) => {
        displayFeat[prop] = feat[prop];
        });
        return displayFeat;
        });
        
        // Write object as string with an indent of two spaces.
        document.getElementById('features').innerHTML = JSON.stringify(
        displayFeatures,
        null,
        2
    );
    //https://docs.mapbox.com/jp/mapbox-gl-js/example/polygon-popup-on-click/
    map.on('click', 'vt', (e) => {
        new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.N03_004)
        .addTo(map);
        });
         
        // Change the cursor to a pointer when
        // the mouse is over the states layer.
        map.on('mouseenter', 'vt', () => {
        map.getCanvas().style.cursor = 'pointer';
        });
         
        // Change the cursor back to a pointer
        // when it leaves the states layer.
        map.on('mouseleave', 'vt', () => {
        map.getCanvas().style.cursor = '';
        });

        
})
