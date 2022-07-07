// const { MongoClient } = require("mongodb");
// const uri = 'mongodb://localhost:27017/blueocean'
// const client = new MongoClient(uri);
// const axios = require('axios')

// const basePath = `${process.env.REACT_APP_URL}/blueocean/api/v1`;
// async function addGame(gameObj) {
//   try {
//     await client.connect();
//     const database = client.db('blueocean');
//     const dummyGames = database.collection('DummyGames');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const game = await dummyGames.insertOne(gameObj);
//     console.log(game);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// const createSampleGame = (owner, players) => {
//   var gameObj = {
//     id: 'game-' + owner.userName,
//     owner: players[0],
//     gameName: "somKindaGameName",
//     playerAllowed: 20,
//     players: [],
//     winner: 'none',
//     started: false,
//     createdAt: 'creationTimeString'
//   }
//   players.forEach((player, ind) => {
//     var role = (ind === 0 || ind === 1) ? 'wolf' : (ind === 3) ? 'doctor' : ind === 4 ? 'seer' : 'villager';
//     gameObj.players.push({
//       player: players[ind],
//       status: true,
//       role: role
//     })
//   })
//   return gameObj
// }
// axios.get(`${basePath}/users`)
//     .then((res) => {
//       const players = res.data.users.slice(0, 10)
//       const createdGame = createSampleGame(players[0], players)
//       console.log(createdGame)
//       addGame(createdGame)
//     })

// addGame().catch(console.dir);
