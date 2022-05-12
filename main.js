const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

// Read the file
const xml = fs.readFileSync('Son_Tra_Cycling.gpx', 'utf8');

// Parse the XML
const options = {
  ignoreAttributes: false,
};
const parser = new XMLParser(options);
const jObj = parser.parse(xml);
// print the beginnings of JSON
// console.log(JSON.stringify(jObj, null, 2).substring(0, 1000));

// Fix data
const matchedDataSet = jObj.gpx.trk.trkseg.trkpt.filter(i => i.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad'] > 82);
for (const item of matchedDataSet) {
  item.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad'] /= 2;
}
// console.log(matchedDataSet.map(i => i.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad']));

// Rebuild the XML
const builder = new XMLBuilder(options);
const xmlContent = builder.build(jObj);

// Write to file
fs.writeFileSync('Son_Tra_Cycling_Fixed.gpx', xmlContent);
