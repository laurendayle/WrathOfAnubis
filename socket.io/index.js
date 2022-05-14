const io = require('socket.io')(process.env.PORT2, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

const {getUsersFromSocket, assignUserName, assignRoom} = require('../helperFN/socket.io')
const {getSingleGame, getAllGames, editGame} = require('../database/controller/games');
const {getPlayer, assignRoles, tallyVotes, checkIfGamesOver, votesVsUsers} = require('../helperFN/games');
const {getSingleUserById, addToPlayerScore} = require('../database/controller/users');
const {wolfKills , doctorCheck, seerCheck} = require('../helperFN/roles');
const {addTimeFromNow} = require('../helperFN/addTime');
const User = require('../database/models/User.js')
const gameMaster = {
    user_id : 'announcement',
    userName: 'announcement',
};

const getSocketInRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getUsersFromSocket(getAllConnectedSocket);
    return users;
};

// const calculateNight = async(room) => {

//     try {
//         const messages = [];

//         const game = await getSingleGame(room);

//         const wolf = await wolfKills(game.voted, game.players);
//         console.log(wolf)
//         if (wolf.deaths.length !== 0) {
//             wolf.deaths.forEach(death => {
//                 let {player, role, status} = death;
//                 messages.push({message: `${player.userName} was gravely injured during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
//             });
//         }

//         const doctor = doctorCheck(game.voted, wolf.players, wolf.deaths);

//         if (doctor.deaths.length !== 0) {
//             doctor.deaths.forEach(death => {
//                 let {player, role, status} = death;
//                 messages.push({message: `${player.userName} was saved by a stranger with tremendous healing abilities during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
//             });
//         }

//         const seer = seerCheck(game.voted, doctor.players);

//         if (seer.length !== 0) {
//             seer.forEach(user => {
//                 let {seer, target} = user;
//                 messages.push({message: `${seer.player.userName} was a peeping tom during the night and saw that ${target.player.userName} is a ${target.role}.`, userName: seer.player.userName, role: seer.role})

//             });
//         }

//         game.voted = [];
//         // game.endRound = addTimeFromNow(1);
//         game.endRound = Date.now() + 30000;
//         game.players = doctor.players;
//         game.phase = 'day1';
//         await editGame(game);

//         emitGame2(room, messages);
//     }
//     catch (err) {
//         throw(err)
//     }
// };

// const calculateDay2 = async(room) => {
//     try {
//         const game = await getSingleGame(room);

//         const messages = [];

//         const votes = await tallyVotes(game.voted);
//         console.log('accuse voted calc', votes)
//         if (votes) {
//             const user = await getSingleUserById(votes.userName);
//             messages.push({message: `${user.userName} was accused of first degree murder and is being put on trial.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
//             game.playerVoted = user.userName;
//             game.phase = 'day3';
//             // game.endRound = addTimeFromNow(1);
//             // game.endRound = Date.now() + 30000;
//             // game.voted = [];
//             await editGame(game);
//             emitGame2(room, messages);
            
//         }else {
//             // game.endRound = addTimeFromNow(1);
//             // game.endRound = Date.now() + 30000;
//             // game.voted = [];
//             game.phase = 'day4';
//             messages.push({message: 'No One was Accused this day!! You are lucky', userName: "announcement", user_id: "announcement", role: "gameMaster"});
//             await editGame(game);
//             emitGame2(room, messages);
//         }
         
//     }
//     catch (err) {
//         throw(err)
//     }
// };

// const calculateDay3 = async(room) => {
//     try {
//         const game = await getSingleGame(room);

//         const messages = [];
//         console.log('voted aray to be put to death', game.voted)
//         const {players, deaths} = await votesVsUsers(game.guiltyVoted, game.players);
//         if (players) {
//             game.guiltyVoted.forEach(vote => {
//                 messages.push({message: `${vote.voterUserName} voted to mummify ${vote.candidateUserName}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
//             });
//             if (deaths) {
//                 messages.push({message: `${vote.voterUserName} was mummified by majority rule.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
//             }
//             game.players = players;
//         }
//         messages.push({message: `No one was mummified by lack of majority.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});

//         game.voted = [];

//         game.phase = 'day4';

//         // game.endRound = addTimeFromNow(1);
//         game.endRound = Date.now() + 30000;

//         await editGame(game);

//         emitGame2(room, messages);
//     }
//     catch (err) {
//         throw(err)
//     }
// };

const emitGame2 = async (room, gamemessages) => {
    const game = await getSingleGame(room);
    let messages = [];

    if (game.phase === 'nightcalc') {
        const wolf = await wolfKills(game.voted, game.players);
        if (wolf.deaths.length !== 0) {
            wolf.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} was gravely injured during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        }

        const doctor = doctorCheck(game.voted, wolf.players, wolf.deaths);
        console.log('doctor', doctor.players)
        if (doctor.deaths.length !== 0) {
            doctor.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} was saved by a stranger with tremendous healing abilities during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        }

        // const seer = seerCheck(game.voted, doctor.players);

        // if (seer.length !== 0) {
        //     seer.forEach(user => {
        //         let {seer, target} = user;
        //         messages.push({message: `${seer.player.userName} was a peeping tom during the night and saw that ${target.player.userName} is a ${target.role}.`, userName: seer.player.userName, role: seer.role})

        //     });
        // }
        game.voted = [];
        // game.endRound = addTimeFromNow(1);
        game.endRound = Date.now() + 30000;
        game.players = doctor.players;
        game.phase = 'day1';
        await editGame(game);
        console.log('night messages', messages)
        emitGame2(room, messages);
    }

    if (game.phase === 'day2calc') {
        let votes = await tallyVotes(game.voted);
        console.log('accuse voted calc', votes)
        if (votes) {
            let user = await getSingleUserById(votes.userName);
            messages.push({message: `${user.userName} was accused of first degree murder and is being put on trial.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            game.playerVoted = user.userName;
            game.phase = 'day3';
            // game.endRound = addTimeFromNow(1);
            // game.endRound = Date.now() + 30000;
            // game.voted = [];
            await editGame(game);
            emitGame2(room, messages);
            
        }else {
            // game.endRound = addTimeFromNow(1);
            // game.endRound = Date.now() + 30000;
            // game.voted = [];
            game.phase = 'day4';
            messages.push({message: 'No One was Accused this day!! You are lucky', userName: "announcement", user_id: "announcement", role: "gameMaster"});
            await editGame(game);
            emitGame2(room, messages);
        }
    }

    if (game.phase === 'day3calc') {

        console.log('voted aray to be put to death', game.voted)
        let {players, deaths} = await votesVsUsers(game.guiltyVoted, game.players);
        if (players) {
            game.guiltyVoted.forEach(vote => {
                messages.push({message: `${vote.voterUserName} voted to mummify ${vote.candidateUserName}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            });
            if (deaths) {
                messages.push({message: `${vote.voterUserName} was mummified by majority rule.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            }
            game.players = players;
        }
        messages.push({message: `No one was mummified by lack of majority.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});

        game.voted = [];

        game.phase = 'day4';

        // game.endRound = addTimeFromNow(1);
        game.endRound = Date.now() + 30000;

        await editGame(game);

        emitGame2(room, messages);
    }

    if (game.phase === 'night') {
        io.to(room).emit('game-send', game);
        game.phase = 'nightcalc'
        await editGame(game);

        
        setTimeout( async() => {
            await emitGame2(room);
        }, game.endRound - Date.now());
    }

    if (game.phase === 'day1') {
        console.log("gamemessages", gamemessages)
        io.to(room).emit('game-send', game);
        if (gamemessages) {
            for (let i = 0; i < gamemessages.length; i ++) {
                if (gamemessages[i].role === 'seer') {
                    let sockets = await io.in(room).fetchSockets();
                    let socket;
                    for (let i = 0; i < sockets.length; i ++) {
                        if (sockets[i].userName === gamemessages[i].userName) {
                          socket = sockets[i]
                          break;
                        }
                    }
                    setTimeout(() => {
                        io.to(socket.id).emit(`receive-message-${room}`, gameMaster, gamemessages[i].message)
                    })
                } else {
                    setTimeout(() => {
                        io.emit(`receive-message-${room}`, gameMaster, gamemessages[i].message);
                    }, 2000 * i);
                }
            }
        }

        let gameOver = await checkIfGamesOver(game.players);
        if (gameOver.gameOver) {
            game.winner = gameOver.winner;
            game.phase = 'end';
            for (let i = 0; i < gameOver.Winningplayers.length; i++){
                let findUser = await User.findById(gameOver.Winningplayers[i].user_id);
                findUser.score += 30;
                await findUser.save();
              }
              for (let x = 0; x < gameOver.losingPlayers.length; x++) {
                  let findUser = await User.findById(gameOver.losingPlayers[x].user_id);
                  if (findUser.score >= 25) {
                      findUser.score -= 25;
                      await findUser.save();
                  }

              }

            await editGame(game);
            setTimeout(async () => {
                await emitGame2(room, gameOver.Winningplayers);
            }, game.endRound - Date.now());
        }

        game.phase = 'day2';
        await editGame(game);

        setTimeout(() => {
            emitGame2(room);
        }, game.endRound - Date.now());
    }

    if (game.phase === 'day2') {
        io.to(room).emit('game-send',game);

        game.endRound = addTimeFromNow(2);
        game.phase = 'day2calc'
        await editGame(game);

        setTimeout(async () => {
            await emitGame2(room);
        }, game.endRound - Date.now());
    }

    if (game.phase === 'day3') {

        io.to(room).emit('game-send', game);

        if (gamemessages) {
            for (let i = 0; i < gamemessages.length; i ++) {
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, gamemessages[i].message);
                }, 2000 * i);
            }
        }
        let newEndRound = game.endRound
        game.endRound = Date.now() + 30000;
        game.voted = [];
        game.phase = 'day3calc'
        await editGame(game);
        setTimeout(async () => {
            await emitGame2(room);
        }, newEndRound - Date.now());
    }

    if (game.phase === 'day4') {
        io.to(room).emit('game-send', game)
        if (gamemessages) {
            for (let i = 0; i < gamemessages.length; i ++) {
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, gamemessages[i].message);
                }, 1000 * i);
            }
        }

        let endRound = game.endRound;
        game.voted = [];
        game.guiltyVoted = []
        // game.endRound = addTimeFromNow(2);
        game.endRound = Date.now() + 30000;
        let gameOver = await checkIfGamesOver(game.players);

        if (gameOver.gameOver) {
            game.winner = gameOver.winner;
            game.phase = 'end';
            for (let i = 0; i < gameOver.Winningplayers.length; i++){
              let findUser = await User.findById(gameOver.Winningplayers[i].user_id);
              findUser.score += 30;
              await findUser.save();
            }
            for (let x = 0; x < gameOver.losingPlayers.length; x++) {
                let findUser = await User.findById(gameOver.losingPlayers[x].user_id);
                if (findUser.score >= 25) {
                    findUser.score -= 25;
                    await findUser.save();
                }

            }
            await editGame(game);
            setTimeout(() => {
                emitGame2(room, gameOver.Winningplayers);
            },endRound - Date.now() + 1000);
        }
        game.phase = 'night';
        await editGame(game);
        setTimeout(() => {
            emitGame2(room)
        },endRound - Date.now() + 1000);
    }

    if (game.phase === 'end') {
        io.to(room).emit('game-send', game)
        for (let i = 0; i < gamemessages.length; i++) {
            setTimeout(() => {
                io.emit(`receive-message-${room}`, gameMaster, `congratulations ${gamemessages[i].userName} you have won`);
            }, i * 2000)
        }

    }
}



io.on('connection', socket => {
    console.log(socket.id, 'has connected')
    socket.on('join-room', async(user,room) => {
        console.log('from socket.emit',user)
        try {
            console.log('on connect user', user)
            assignUserName(socket, user);
            console.log('assign user', socket.user)
            assignRoom(socket, room);
            const users = await getSocketInRoom(room);
            console.log('room user', users)
            io.to(room).emit(`receive-${room}`, users);
        }
        catch (err) {
            socket.emit('error', err);
        }
    });
    socket.on('send-message', (user, message, room) => {
        io.emit(`receive-message-${room}`, user, message);
    });

    socket.on('player-vote', async(user, candidate, room) => {
        console.log('vote got hit', user, room)
        console.log('voter candi', candidate)
        console.log('destructor ',{user_id:candidate.player.user_id, userName: candidate.player.userName})
        
        try {
            const game = await getSingleGame(room);
            const player = await getPlayer(game.players, user);
            const target = await getPlayer(game.players, {user_id:candidate.player.user_id, userName: candidate.player.userName});
            if (game.endRound > Date.now() && player.status && target.status) {
                console.log('hit on saved database')
                if (game.phase === 'day3') {
                    game.guiltyVoted.push({voter:user.user_id, voterUserName: user.userName, candidate:candidate.player.user_id, candidateUserName:candidate.player.userName});
                } else {
                    game.voted.push({voter:user.user_id, voterUserName: user.userName, candidate:candidate.player.user_id, candidateUserName:candidate.player.userName});
                }
                console.log('after vote push', game.phase, game.voted)
                await editGame(game);
            }
        }
        catch (err) {
            socket.emit('error', err);
        }
    });

    socket.on('start-game', async (user, room) => {
        console.log('start game')
        try {
            const game = await getSingleGame(room);
            console.log('game owner',game.owner )
            console.log('game owner2',user.user_id )
            if (game.owner === user.user_id) {
                const getUsers = await getSocketInRoom(room);
                console.log(getUsers, "getUser")
                let users = [];
                getUsers.forEach(user => {
                    users.push({player: {
                        userName: user.userName,
                        user_id: user.user_id,
                        }
                    });
                });
                console.log('users', users)
                const players = await assignRoles(users);
                console.log('player',players)
                game.players = players;
                game.phase = 'night';
                game.started = true;
                game.endRound = addTimeFromNow(1);
                // game.endRound = 30000;
                await editGame(game);
                emitGame2(room);
            }
        }
        catch(err) {
            socket.emit('error', err);
        }
    })

    

    socket.on('get-games', async() => {
        try {
            const games = await getAllGames({started: false});
            io.emit('receive-games', games);
        }
        catch(cihadsWork) {
            socket.emit('error', cihadsWork);
        }
    });

    socket.on("disconnecting", async () => {
        try {
            const rooms = Array.from(socket.rooms);
            for (let i = 1; i < rooms.length;i++) {
                const users = await getSocketInRoom(rooms[i]);
                const editUsers = users.filter(user => user.userName !== socket.user.userName);
                io.emit(`receive-${rooms[i]}`, editUsers);
            }
        }
        catch (err) {
            socket.emit('error', err);
        }
      });
});

module.exports = io;








// const getUsersFromSocket = (socket) => {
//     const users = [];
//     for(let i = 0; i< socket.length;i++) {
//         if (!users.includes(socket[i].username)) {
//             users.push(socket[i].username);
//         }
//     }
//     return users;
// };
// const assignUserName = (socket , user) => {
//     socket.username = user.userName;
//     if (user.user_id) {
//         socket.user_id = user.user_id
//     }

// };

// const assignRoom = (socket, room) => {
//     socket.join(room);
//     socket.rooms = room;
// };





//Input
// [
//     {
//         player: {userName: "dave1", user_id: 1}
//     }
// ]

//output
// [
    //     {
    //         player: {userName: "dave1", user_id: 1},
    //         status: true,
    //         role: "villager",
    //         abilityCount: 0
    //     }
// ]
