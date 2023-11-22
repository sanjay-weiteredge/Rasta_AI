import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import Sidebar from './Sidebarcomponent';
import custommarker from '../assets/markers/custommarker.png'
import stop from '../assets/markers/stop.png'
import nobicycle from '../assets/markers/nobicycle.png'
import four from '../assets/markers/four.png'
import speed from '../assets/markers/speed.png'
const customMarkerIcons = [
   custommarker,
   four,
   stop,
   custommarker,
    nobicycle,
    four,
    speed,
    custommarker,
    custommarker,
    stop,
    nobicycle,
    speed,
    custommarker,
    custommarker,
    custommarker,
    custommarker

  ];

mapboxgl.accessToken = 'pk.eyJ1IjoicmFzdGEtYWkiLCJhIjoiY2xwNnc4NzhvMGR3NDJrb2lmeG9jcjE2ZyJ9.KeN3jW2_wBNQaSPvJwmYxQ';

//index.html has the reference linkage to the magbox-gl

const Mapcomponent=()=>{
    console.log("mapbox")   
const mapContainer = useRef(null);
const map = useRef(null);
const [lng, setLng] = useState(78.381914);
const [lat, setLat] = useState(17.450764);
const [zoom, setZoom] = useState(15);
const [showSidebar, setShowSidebar] = useState(false);
const [imagePath, setImagePath] = useState('');
const [routeNames, setRouteNames] = useState([]);
const[latitude,setLatitude]=useState([]);
const[longitude,setLongitude]=useState([]);
const handleSidebarToggle = () => {
  setShowSidebar(!showSidebar);
};


//routeGeoJSON is a static data for representation
const routeGeoJSON = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                id: 'route-1',
                title: 'Route HitechCity',
                description: 'This is the route that you have selected.',
            },
            geometry: {
                type: 'LineString',
                coordinates: [
                //    [78.382589, 17.449566],
                //    [78.382197, 17.450083],
                //    [78.381916, 17.450498],
                //    [78.381570, 17.450938],
                //    [78.380804, 17.451769],
                //    [78.379919, 17.452729]
                    [78.379876,17.450558],
                    [78.379624,17.450271],
                    [78.379402,17.449696],
                    [   78.379122,17.448668],
                    [78.378796,17.448147],
                    [78.378064,17.447161],
                    [78.377503,17.445893]
                   
                ],
            },
        },
        
    ],
};


useEffect(() => {

    if (map.current) 
    return;

    console.log("Entered Use effect")

    map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/rasta-ai/clp9k6fn2001r01pj22101efn',
        center: [lng, lat],
        zoom: zoom,
    });

    // const directions = new MapboxDirections({
    //     accessToken: mapboxgl.accessToken,
    //     unit: 'metric', 
    // });

    // map.current.addControl(directions, 'top-left');

    map.current.on('load', () => {

        console.log("On loading",routeGeoJSON)
        map.current.addSource('routes', {
            type: 'geojson',
            data: routeGeoJSON,
        });
        
        map.current.addLayer({
            id: 'route-layer', 
            type: 'line',
            source: 'routes',
            paint: {
                'line-color': 'yellow',
                'line-width': 4,
                'line-dasharray': [2, 2],
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            interactive: true, // should be interactive
        });

        map.current.on('click', 'route-layer', (event) => {

            const routeProperties = event.features[0].properties;
            const routeId = routeProperties.id;
        
            
            console.log('Clicked route ID: ', routeId);
        
            //To display a pop up
            const popup = new mapboxgl.Popup({ offset: [0, -15] })
                .setLngLat(event.lngLat)
                .setHTML(
                    `<h3>${routeProperties.title}</h3><p>${routeProperties.description}</p>`
                )
                .addTo(map.current);
        });
        const customMarkerElement = document.createElement('div');
        customMarkerElement.style.width = '32px';
        customMarkerElement.style.height = '32px';
       
        customMarkerElement.style.backgroundImage = `url(${stop})`;
        customMarkerElement.style.backgroundSize = 'cover'; // Ensure the image covers the marker
        customMarkerElement.style.cursor = 'pointer'; // Optional: Change cursor on hover

        routeGeoJSON.features[0].geometry.coordinates.forEach((coordinate) => {
            const marker = new mapboxgl.Marker(customMarkerElement)
                .setLngLat(coordinate)
                .addTo(map.current);
                const popupContent = '<h1>Stop</h1><p>stop sign</p>';
                const popup = new mapboxgl.Popup({ offset: [0, -15] }).setHTML(popupContent);
                
                marker.setPopup(popup);
                
            
            
            // const popup = new mapboxgl.Popup({ offset: [0, -15]})
            //     .setHTML('<img src="../src/assets/images/pothholes.jpg" alt="Pothhole Image" />');
    
          
            // marker.setPopup(popup);
        });

        // Changing the cursor style when hovering over the route.
        map.current.on('mouseenter', 'route-layer', () => {
            console.log("On mouseseenter")
            mapContainer.current.style.cursor = 'pointer';
        });

        // Changing it back to the default cursor when the mouse leaves the route.
        map.current.on('mouseleave', 'route-layer', () => {
            mapContainer.current.style.cursor = '';
        });
    });
        
        map.current.on('click', function (e) {
        const clickedCoordinates = e.lngLat;
        handleSidebarToggle()//call the handlesidebarToggle
        console.log('Clicked Coordinates:', clickedCoordinates);
        try {
            axios.get(`http://localhost:2700/fetch/`, {
              params: {
                latitude: 17.457298,
                longitude: 78.365028,
              },
            })
            .then(response => {
              // Handle the response data here
              console.log("res",response)
              const imagedetails=response.data.data.result.properties.image_details
              console.log('Response from server:', response);
              const path = imagedetails.filename;

              const imageUrl = `http://localhost:2700/${encodeURIComponent(path)}`;
      setImagePath(imageUrl);
      const temp1=clickedCoordinates.lat
      const temp2=clickedCoordinates.lng
      setLatitude(temp1);
      setLongitude(temp2);
                
      // Now imagePath is set, and you can log it
      console.log("imagepath", imagePath);
              
            })
            .catch(error => {
              // Handle errors here
              console.error('Error making GET request:', error.message);
            });
          } catch (error) {
            console.error('Error outside of Axios request:', error.message);
          }
          console.log("imagepath22222222222", imagePath);
          
          try {
            axios.get(`http://localhost:2700/get/`, {
              params: {
                latitude: 17.457298,
                longitude:  78.365028,
              },
            })
            .then(response => {
                console.log("multiple data",response)
                const data = response.data.data.result;
                data.forEach((item,index) => {
                    const location = [item.geometry.coordinates[0],item.geometry.coordinates[1]];
                    // const popupContent = `<h3>${item.image_details.filename}</h3><p>Timestamp: ${item.timestamp}</p>`;
                  
                    // // Create a marker
                    // const marker = new mapboxgl.Marker()
                    //   .setLngLat([location.longitude, location.latitude])
                    //   .setPopup(new mapboxgl.Popup().setHTML(popupContent))
                    //   .addTo(map.current);
                    const customMarkerElement = document.createElement('div');
                    customMarkerElement.style.width = '32px';
                    customMarkerElement.style.height = '32px';
                   
                    customMarkerElement.style.backgroundImage = `url(${customMarkerIcons[index]})`;
                    customMarkerElement.style.backgroundSize = 'cover'; // Ensure the image covers the marker
                    customMarkerElement.style.cursor = 'pointer'; // Optional: Change cursor on hover
                
                    // Create a marker with the custom element
                    const marker = new mapboxgl.Marker(customMarkerElement)
                        .setLngLat([location[0], location[1]])
                        .addTo(map.current);
                  });
            }
            )}catch(error){
                console.error('Error outside of Axios request:', error.message);
            }
        
        const osmApiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];way(around:10,${clickedCoordinates.lat},${clickedCoordinates.lng})[highway];out;`;

    fetch(osmApiUrl)
    .then(response => response.json())
    .then(data => {
    const roadDetails = data.elements[0];
    const roads= data.elements;
    const roadNodes = roadDetails.nodes;

  
    const wayIds = roadDetails.id;
    const routeIds = roadDetails.tags.route_id;
    const routeNames = roadDetails.tags.name;
    setRouteNames(routeNames);

    const fetchNodeDetails = async (nodeId) => {
        const apiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(${nodeId});out;`;
    
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            if (data.elements && data.elements.length > 0) {
                const node = data.elements[0];
                const coordinates = { lat: node.lat, lon: node.lon };
                // const marker = new mapboxgl.Marker()
                // .setLngLat({ lng: coordinates.lon, lat: coordinates.lat })
                // .addTo(map.current);
                return coordinates;
            }
    
            return null; 
            
        } catch (error) {
            console.error('Error fetching node details:', error);
            return null;
        }
    };

    
    // Fetch coordinates for each node
    const fetchCoordinatesForNodes = async () => {
        const coordinatesPromises = roadNodes.map(async (nodeId) => {
            const coordinates = await fetchNodeDetails(nodeId);
            return coordinates;
        });

        
        const coordinatesArray = await Promise.all(coordinatesPromises);
        console.log('Coordinates for nodes:', coordinatesArray);
        // coordinatesArray.forEach(async (coordinates) => {
        //     try {
        //       const response = await axios.get(`http://localhost:2700/fetch/`, {
        //         lat: 78.37982,
        //         lon: 17.450771,
        //       });
        
        //       console.log('Response from server:', response.data,response);
        //     } catch (error) {
        //       console.error('Error making GET request:', error.message);
        //     }
        //   });
        
    };
    
    // Call the function that derives coordinates for each node
    fetchCoordinatesForNodes();

    const fetchWayDetails = async (wayId) => {
        const apiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];way(${wayId});out;`;
    
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log("data",data)
            
            if (data.elements && data.elements.length > 0) {
                const way = data.elements[0];
                console.log("way",way.nodes,way.nodes.length)
                const first=way.nodes[0];
                const last=way.nodes[way.nodes.length]
                const coordinates1=await fetchNodeDetails(first)
                const coordinates2=await fetchNodeDetails(last)
                console.log("cordinates",coordinates1,coordinates2)
                
                // const marker2 = new mapboxgl.Marker({color:'red'})
                
                // .setLngLat({ lng: coordinates2.lon, lat: coordinates2.lat })
                // .addTo(map.current);

                // const marker = new mapboxgl.Marker({color:'red'})
                
                // .setLngLat({ lng: coordinates1.lon, lat: coordinates1.lat })
                // .addTo(map.current);
                // const coordinates = way.geometry.map((node) => ({ lat: node.lat, lon: node.lon }));
                return coordinates1;
            }
    
            return null;
        } catch (error) {
            console.error('Error fetching way details:', error);
            return null;
        }
    };
    
    // Fetch coordinates for the specified way
    const fetchCoordinatesForWay = async () => {
        const coordinates = await fetchWayDetails(wayIds);
        console.log('Coordinates for way:', coordinates);
    };
    
    // Call the function to fetch coordinates for the specified way
    fetchCoordinatesForWay();

    // roads.forEach(road => {
    //     console.log("roaddddddddddddddddddddddddddd",road)
    //     if (road.lat && road.lon) {
    //         const marker = new mapboxgl.Marker()
    //             .setLngLat({ lng: road.lon, lat: road.lat })
    //             .addTo(map.current);
    //     }
    // });

    // roadNodes.forEach((nodeId) => {
    //     console.log('Node ID:', nodeId);
    //   });
    // Process the obtained information
    console.log('Way IDs:', wayIds);
    console.log('Route IDs:', routeIds);
    console.log('Route Names:', routeNames);
    console.log('Roadnodes:', roadNodes);
})
.catch(error => console.error('Error fetching OSM data:', error));;

// const getRoadNamesInHyderabad = async () => {
//     const boundingBox = '78.2176,17.1966,78.6070,17.6078';
//     const url = 'https://overpass-api.de/api/interpreter';
  
//     try {
//       const response = await fetch(`${url}?data=[out:json];
//         (
//             way[highway](${boundingBox});
//         );
//         out body;`);
  
//       const data = await response.json();
//       console.log('Datas:', data.elements[0]);

//   const fetchNodeDetails = async (nodeId) => {
//   const apiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(${nodeId});out;`;

//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     if (data.elements && data.elements.length > 0) {
//       const node = data.elements[0];
//       return { lat: node.lat, lon: node.lon };
//     }

//     return null;
//   } catch (error) {
//     console.error('Error fetching node details:', error);
//     return null;
//   }
// };

// const coordinates = await Promise.all(
//   data.elements
//     .filter((element) => element.type === 'way' && element.nodes)
//     .map(async (element) => {
//       const nodesDetails = await Promise.all(
//         element.nodes.map(async (nodeId) => {
//           return await fetchNodeDetails(nodeId);
//         })
//       );

//       return nodesDetails;
//     })
// );

// console.log("Coordinates:", coordinates);

// // Flatten the array if needed
// const flattenedCoordinates = [].concat(...coordinates);
// console.log("Flattened Coordinates:", flattenedCoordinates);
// if (!map.getSource('highlighted-ways')) {
//   map.addSource('highlighted-ways', {
//     type: 'geojson',
//     data: {
//       type: 'FeatureCollection',
//       features: [], // Initially, an empty feature collection
//     },
//   });
// }

// // Create a GeoJSON feature for the line string
// const highlightedFeature = {
//   type: 'Feature',
//   properties: {},
//   geometry: {
//     type: 'LineString',
//     coordinates: flattenedCoordinates,
//   },
// };

// // Set the data for the source
// map.getSource('highlighted-ways').setData(highlightedFeature);

// // Check if the layer already exists, if not, add it to the map
// if (!map.getLayer('highlighted-ways-layer')) {
//   map.addLayer({
//     id: 'highlighted-ways-layer',
//     type: 'line',
//     source: 'highlighted-ways',
//     layout: {
//       'line-join': 'round',
//       'line-cap': 'round',
//     },
//     paint: {
//       'line-color': 'red',
//       'line-width': 4,
//     },
//   });
// }

  
//       console.log('Road Names in Hyderabad:', coordinates);
//     } catch (error) {
//       console.error('Error fetching road names:', error);
//     }
//   };
  
//   getRoadNamesInHyderabad();

  

const residentialRoadsUrl = `https://overpass-api.de/api/interpreter?data=[out:json];way(around:10,${clickedCoordinates.lat},${clickedCoordinates.lng})[highway=residential];out;`;

fetch(residentialRoadsUrl)
    .then(response => response.json())
    .then(data => {
        const residentialRoads = data.elements[0];
        console.log('Nearby Residential Roads:', residentialRoads);
    })
    .catch(error => console.error('Error fetching nearby residential roads:', error));


    });
    function getRouteIds(roadDetails) {
        // Check if the road is part     of a relation (route)
        if (roadDetails.tags && roadDetails.tags.type === 'route' && roadDetails.tags.route_id) {
            return [roadDetails.tags.route_id];
        }
    
        // Check if the road is part of multiple relations
        if (roadDetails.members) {
            return roadDetails.members
                .filter(member => member.type === 'relation' && member.role === 'street')
                .map(member => member.ref);
        }
    
        return undefined;}
          
      
}, [lng,lat,zoom,imagePath]);
useEffect(() => {
    // This effect will log the imagePath whenever it changes
    console.log("imagepath", imagePath);
  }, [imagePath]); 
return (
    <div>
    <div ref={mapContainer} className="map-container"/>
    {showSidebar && imagePath && routeNames&& latitude && longitude &&<Sidebar showSidebar={showSidebar} imagePath={imagePath} routeNames={routeNames} latitude={latitude} longitude={longitude} handleSidebarToggle={handleSidebarToggle} />}

    {/* <div>
      <h1>Image Display</h1>
      {imagePath && <img src={imagePath} alt="Image" />}
    </div>
     */}
    </div>
  );
}

export default Mapcomponent;