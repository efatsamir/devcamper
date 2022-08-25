// we should install node-geocoder 
// import NodeGeocoder from 'node-geocoder'

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apikey: process.env.GEOCODER_API_KEY,
  formatter: null

}
const geocoder = NodeGeocoder(options);
// export default geocoder; 

