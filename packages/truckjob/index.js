// Спавны грузовиков, трейлеров и точек загрузки/разгрузки
const truckSpawns = [
    { x: -422.77093505859375, y: 1166.211669921875, z: 325.973876953125, heading: -18.22724151611328},
    { x: -404.05560302734375, y: 1161.9130859375, z: 325.98529052734375, heading: -12.60693359375}
];

const trailerSpawns = [
    { x: -410.40142822265625, y: 1134.956298828125, z: 325.9732971191406, heading: -13.243707656860352},
    { x: -428.8808288574219, y: 1138.2325439453125, z: 325.9739685058594, heading: -16.17988395690918}
];

const pickPoints = [
    { x: -412.3080749511719, y: 1218.32763671875, z: 324.7181396484375},
    { x: -457.32415771484375, y: 1152.080810546875, z: 324.9734802246094},
    { x: -511.28912353515625, y: 1184.92919921875, z: 323.9432373046875},
    { x: -368.6314392089844, y: 1255.5517578125, z: 327.6026916503906},
    { x: -347.2783203125, y: 1152.3865966796875, z: 324.71673583984375}
];


mp.events.add('packagesLoaded', () => { // при старте сервера спавним транспорт для миссии
    spawnWorkVehicles("phantom3", truckSpawns);
    spawnWorkVehicles("trailers", trailerSpawns);
});


function spawnWorkVehicles(modelName, spawnPoints){ // функция позволяет заспавнить транспорт по координатам переданным в массиве spawnPoints
    spawnPoints.forEach( spawn => {
        mp.vehicles.new(mp.joaat(modelName), spawn, { heading: spawn.heading});
    });
}


mp.events.addCommand('tw', (player) => { // команда старта работы
    let loadPoint = getRandomPoint();
    let destPoint;

    do{
        destPoint = getRandomPoint();
    } while(loadPoint.x == destPoint.x && loadPoint.y == destPoint.y); // проверяем чтобы точки старта и финиша не совпадали

    player.call('playerStartTruckWork', [loadPoint, destPoint]);
});


function getRandomPoint(){ // получаем случайную точку из массива pickPoints
    return pickPoints[ Math.floor( Math.random() * pickPoints.length ) ];
}