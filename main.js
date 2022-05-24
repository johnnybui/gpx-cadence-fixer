require('dotenv').config();
const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

// Config
const dataFolder = './data/';
const outputFolder = './fixed-data/';
const fileName = process.env.FILE_NAME || '20220524NightCycling.gpx';
const deviceName = process.env.DEVICE_NAME || 'XOSS SPRINT';
const maxCadence = process.env.MAX_CADENCE || 100;

// Read the file
const xml = fs.readFileSync(`${dataFolder}${fileName}`, 'utf8');

// Parse the XML
const options = {
  ignoreAttributes: false,
};
const parser = new XMLParser(options);
const jObj = parser.parse(xml);
// print the beginnings of JSON
// console.log(JSON.stringify(jObj, null, 2).substring(0, 1000));

// Fix data
jObj.gpx['@_creator'] = deviceName;
const matchedDataSet = jObj.gpx.trk.trkseg.trkpt.filter(i => i.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad'] > maxCadence);
for (const item of matchedDataSet) {
  item.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad'] /= 2;
}
// console.log(matchedDataSet.map(i => i.extensions['gpxtpx:TrackPointExtension']['gpxtpx:cad']));

// Rebuild the XML
const builder = new XMLBuilder(options);
const xmlContent = builder.build(jObj);

// Write to file
fs.writeFileSync(`${outputFolder}${fileName}`, xmlContent);
