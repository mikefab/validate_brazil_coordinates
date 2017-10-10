var fs = require('fs');
var jsts = require('jsts');

var geojsonReader = new jsts.io.GeoJSONReader();
// Import brazil shapefile
var bra = require('./BRA_0').features[0]

// Create polygon for Brazil
var jstsPolygon = geojsonReader.read({
      type: bra.geometry.type,
      coordinates: bra.geometry.coordinates
    });

var i = 1;
// Path to CSV
const csvFilePath='./BR-ProCo-0-MCTIC-0.csv'
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
  if (i === 1) {
    fs.writeFileSync('good_schools.csv', Object.keys(jsonObj).join(',') + '\n')
    fs.writeFileSync('bad_schools.csv', Object.keys(jsonObj).join(',')  + '\n')
  }
  i+=1
  var point = {
    type: 'Point',
    coordinates: [jsonObj.lon, jsonObj.lat]
  };

  var jstsPoint = geojsonReader.read(point);
  if (jstsPoint.within(jstsPolygon)) {
    console.log(i, 'good', point)
    fs.appendFileSync('good_schools.csv', Object.values(jsonObj).join(',') + '\n')
  } else {
    console.log(i, 'bad', point)
    fs.appendFileSync('bad_schools.csv', Object.values(jsonObj).join(',') + '\n')
  }

    // combine csv header row and csv line to a json object
    // jsonObj.a ==> 1 or 4
})
.on('done',(error)=>{
    console.log('end')
    // objects.forEach(obj => {
    //   var point = {
    //     type: 'Point',
    //     coordinates: [obj.lon, obj.lat]
    //   };
    //
    //
    //   var jstsPoint = geojsonReader.read(point);
    //   console.log(jstsPoint.within(jstsPolygon));
    // })
})
