const markerType = 1; // тип маркера
const markerSize = 5; // размер маркера
const markerColor = [255, 0, 0, 100]; // цвет маркера
const blipType = 67; // тип иконки на радаре

const freezeTime = 3; // время на сколько замораживать игрока при загрузке/разгрузке, в секундах

const localPlayer = mp.players.local; // локальный игрок

let loadPoint = false; // точка загрузки
let destPoint = false; // точка выгрузки

let workMarker = false; // маркер
let workMarkerColshape = false; // колшейп
let workBlip = false; // иконка на радаре

let missionStatus = 0; // Статус миссии: 0 - не начато, 1 - идем к точке загрзки, 2 - едем к точке разгрузки

mp.events.add('playerStartTruckWork', (startPoint, finishPoint)=> { // запуск миссии

    if( missionStatus !== 0){
        return mp.gui.chat.push("ОШИБКА: Вы уже начали работу Дальнобойщика!");
    }

    if ( !checkPlayerInVehicleWithTrailer() ) return false;

    // запонимаем точки старта и назначения
    loadPoint = startPoint;
    destPoint = finishPoint;

    setMarker(startPoint);
    missionStatus = 1;

    mp.gui.chat.push("Вы начали работу Дальнобойщика!");
});

mp.events.add('playerEnterColshape', (colshape) => { // попадание игрока в колшейп
    if( colshape == workMarkerColshape){ // проверяем что это наш колшейп
        pickLocation();
    }
});


function pickLocation(){ // игрок наехал на маркер
    
    if ( !checkPlayerInVehicleWithTrailer() ) return false;

    clearMarker();
    freezePlayer();

    if( missionStatus == 1){
        playerReachLoadingPoint(); // загружаем груз
    } else if ( missionStatus == 2){
        playerReachDestPoint(); // выгружаем груз
    }
 
}

function playerReachLoadingPoint(){ // игрок доехал до точки загрузки
    mp.gui.chat.push("Вы прибыли на место загрузки. Ожидайте...");

    setTimeout( () => {
        unfreezePlayer();
        mp.gui.chat.push("Отправляйтесь к месту разгрузки");
        missionStatus = 2;
        setMarker(destPoint);
    }, freezeTime * 1000);
}

function playerReachDestPoint(){ // игрок доехал до точки разгрузки
    mp.gui.chat.push("Вы прибыли на место разгрузки. Ожидайте...");
    
    setTimeout( () => {
        unfreezePlayer();
        mp.gui.chat.push("Груз доставлен. Спасибо за работу!");
        missionStatus = 0;
    }, freezeTime * 1000);
}


function setMarker(point){ // ставим маркер в точку point
    workMarker = mp.markers.new(markerType, point, markerSize, { color: markerColor});
    workMarkerColshape = mp.colshapes.newSphere(point.x, point.y, point.z, markerSize);
    workBlip = mp.blips.new(blipType, point, {shorRange: false});
    workBlip.setRoute(true); // включаем отображение маршрута на карте
}


function clearMarker(){ // убираем маркер
    workMarker.destroy();
    workMarkerColshape.destroy();
    workBlip.setRoute(false);
    workBlip.destroy();
}

function freezePlayer(){
    localPlayer.vehicle.freezePosition(true);
}

function unfreezePlayer(){
    localPlayer.vehicle.freezePosition(false);
}


function checkPlayerInVehicleWithTrailer(){ // проверяем нахождение игрока в грузовике с трейлером
    if( !localPlayer.vehicle){
        mp.gui.chat.push("ОШИБКА: Вы должны быть в транспорте!");
        return false;
    }

    if( !localPlayer.vehicle.isAttachedToTrailer() ){
        mp.gui.chat.push("ОШИБКА: У вас должен быть прицеплен трейлер!");
        return false;
    }

    return true;
}