//inputs = number of players, height of sprite, width of sprite, width of gameboard, height of gamenboard,

//OutputMap = obj, OutpuMap[i] = {index: {left: Percentage, top: Percentage}},
//OutputArray = array of arrays, output array[i] = [leftStr, rightStr]

//gb = gameboard
exports.MapEmAcross = (playersArr, spH, spW, gbH, gbW) => {
  var length = playersArr.length
  //var length = 20
  var rows = 1
  if (playersArr.length > 10) {
    rows = 3
  }
  var halfwayTopPercentage = (50 - (spH / gbH) * 100).toString() + '%';
  var halfwayMaxLeftPercentage = 100 - (spW / gbW) * 100;
  //console.log('pa', playersArr)
  var halfWayInterval = halfwayMaxLeftPercentage / (length - 1);
  var map = {};
  for (let i = 0; i < playersArr.length; i++) {
        if (rows === 3) {
          halfwayTopPercentage = ((((i % 3) + 1) * 25) - (spH / gbH) * 100).toString() + '%';
        }
      //map[i] = {left: (halfWayInterval * i).toFixed(2) + '%', top: halfwayTopPercentage}
        map[playersArr[i].player.user_id] = {left: (halfWayInterval * i).toFixed(2) + '%', top: halfwayTopPercentage, userName: playersArr[i].player.userName}

  }
  return map;
};
const getMidpoint = (hDif, wDif, spW) => {
  return (hDif <= wDif) ? [(wDif/2), (hDif/2)] : [((wDif/2) + (spW/2)), (hDif/2)]
}
exports.MapEmCircle = function (playersArr, spH, spW, gbH, gbW, left) {
  left === left || false
  let map = {}
  var hDif =  gbH - spH
  var wDif = gbW - spW
  var length = playersArr.length
  //var length= 20
  //console.log('pa', playersArr)
  //console.log((gbH - hDif)/2)
  // const getMidpoint = () => {
  //   return (hDif <= wDif) ? [(wDif/2), (hDif/2)] : [((wDif/2) + (spW/2)), (hDif/2)]
  // }
  var midpoint = getMidpoint(hDif, wDif, spW)
  var radius = Math.min(hDif / 2, wDif / 2)
  if (left) {
    midpoint[0] = radius
  }
  //let radius = 100
  //let angle = (Math.PI * 2) * (270 / 360)

  //let interval = 360 / playersArr.length
  let interval = 360 / length
  for (let i = 0; i < playersArr.length; i++) {
    //console.log(interval)
    let angle = Math.PI * 2 * ((interval * i) / 360);
    //console.log(angle)
    let x = (Math.cos(angle) * radius * wDif / hDif + midpoint[0]).toFixed(2) + 'px';
    let y = (Math.sin(angle) * radius + midpoint[1]).toFixed(2) + 'px';
    //map[playersArr[i].player._id] = {left: x, top: y}
    map[playersArr[i].player.user_id] = {left: x, top: y, userName: playersArr[i].player.userName}
    //map[i] = {left: x, top: y}
  }
  //console.log(midpoint, midpoint[0], midpoint[1], radius)
  //console.log(map)
  return map;
};

exports.oneInMiddle = (playersArr, spH, spW, gbH, gbW, playerName) => {
  let map = {}
  var hDif =  gbH - spH
  var wDif = gbW - spW
  var length = playersArr.length
  var middy = getMidpoint(hDif, wDif, spW)
  //middy[0] = radius
  var radius = Math.min(hDif / 2, wDif / 2)
  let interval = 360 / length
  for (let i = 0; i < length; i++) {
    if (playerName) {
      //console.log('here i am ', playerName)
         if (playersArr[i].player.userName === playerName) {
          //let circleArr = playersArr.splice(i, 1)
          let circleArr = playersArr.slice(0, i).concat(playersArr.slice(i + 1, playersArr.length))
          map = exports.MapEmCircle(circleArr, spH, spW, gbH, gbW)
          map[playerName] = {left: middy[0].toString() + 'px', top: middy[1].toString() + 'px', userName: playerName}
          //break
         }
    }
  }
  //console.log(midpoint, midpoint[0], midpoint[1], radius)
  //console.log(radius)
  return map;
};

//console.log(MapEmAcross(4, 50, 30, 500, 500))
