require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
const router = require('./config/routes.js');
app.use('/', router);

app.get('/artist-search-results', (req, res) => {
  spotifyApi
  .searchArtist(req.query.search)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('search', { data: data.body.artist} )
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
      res.render('albums', {albums: data.body.items});
      const dataToDisplay = {
          searchResults: data.body
      };
      res.render('albums', dataToDisplay);
      })
      .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/albums/:albumId/tracks', (req, res, next) => {
  // Get tracks in an album
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    const tracks = data.body.items;
      console.log('Tracks ====================', tracks);
      res.render('tracks', { tracks } );
    })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
});

module.exports = app;

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
