/**
 * Created by tangwen on 2018/2/26.
 */
const Player = require("./player");
const EventListener = require("./event_listener");

const Room = function () {
    var that = {};
    var _playerList = [];
    var _event = EventListener({});

    var _currentTotalRate = 0;
    var _turnPlayerIndex = 0;
    var _currentMacRate = 0;

    const getIndex = function () {
        var seatMap = {};
        for(var i =0;i<_playerList.length;i++){
            seatMap[_playerList[i].getIndex()] = true;
        }

        for(var i =0;i<6;i++){
            if(!seatMap.hasOwnProperty(i)){
                return i;
            }
        }
    };

    that.createPlayer = function (uid, socket) {
        console.log("create player ="+uid);
        var currentIndex = getIndex();
        console.log("create index = "+currentIndex);

        var player = Player({
            uid:uid,
            socket:socket,
            event:_event,
            index:currentIndex
        });
        _playerList.push(player);

        var playerDatas = [];
        for(var i =0 ;i<_playerList.length;++i){
            var pl = _playerList[i];
            playerDatas.push({uid:pl.getUid(),index:pl.getIndex()});
        }

        player.sendSyncData({
            uid:uid,
            index:player.getIndex(),
            house_manager_id:_playerList[0].getUid(),
            players_data:playerDatas
        });
        _event.fire("send_create_player_message",{uid:uid,index:player.getIndex()});
    };

    that.getPlayerCount = function () {
        return _playerList.length;
    };

    _event.on("disconnect",function (uid) {
        for(var i =0;i<_playerList.length;++i){
            if(_playerList[i].getUid() === uid){
                _playerList[i].destroy();
                _playerList.splice(i,1);
            }
        }
        if(_playerList.length === 0){
            return;
        }

        _event.fire("player_offline",uid);
        _event.fire("change_house_manager_id",_playerList[0].getUid());
    });

    _event.on("start_game",function () {
        console.log("房主决定开始游戏");

    });

    _event.on("choose_rate",function (data) {
        var rate = data.rate;
        console.log("choose rate "+JSON.stringify(data));
    });

    return that;
};

module.exports = Room;