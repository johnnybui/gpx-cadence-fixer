const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

// Read the file
const fileName = '20220518NightCycling.gpx';
const xml = fs.readFileSync(`./data/${fileName}`, 'utf8');

// Parse the XML
const options = {
  ignoreAttributes: false,
};
const parser = new XMLParser(options);
const jObj = parser.parse(xml);
// print the beginnings of JSON
// console.log(JSON.stringify(jObj, null, 2).substring(0, 1000));

// Fix data
const matchedDataSet = jObj.gpx.trk.trkseg.trkpt.filter(i => i.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad'] > 90);
for (const item of matchedDataSet) {
  item.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad'] /= 2;
}
// console.log(matchedDataSet.map(i => i.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad']));

// Rebuild the XML
const builder = new XMLBuilder(options);
const xmlContent = builder.build(jObj);

// Write to file
fs.writeFileSync(`./fixed-data/${fileName}`, xmlContent);
