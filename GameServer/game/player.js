/**
 * Created by tangwen on 2018/2/26.
 */

const Player = function (spec) {
    var that = {};
    var _uid = spec.uid;
    var _socket = spec.socket;
    var _event = spec.event;
    var _index = spec.index;
    var _cardList = [];

    _socket.on("disconnect",function () {
        console.log("玩家掉线");
        _event.fire("disconnect",_uid);
    });

    _socket.on("start_game",function () {
        console.log("player start game");
    });

    _socket.on("player_choose_rate",function (rate) {
        console.log("player choose rate "+rate);
    });

    _socket.on("pk_choose_player",function (uid) {
        console.log("pk choose player "+uid);
    });

    that.sendSyncData = function (data) {
        console.log("send sync data = "+ JSON.stringify(data));
        _socket.emit("sync_data",data);
    };

    const sendCreatePlayerMessage = function (data) {
        if(data.uid != _uid){
            console.log("send create player message = "+ JSON.stringify(data));
            _socket.emit("player_join",data);
        }
    };

    _event.on("send_create_player_message",sendCreatePlayerMessage);

    const sendPlayerOffline = function (uid) {
        _socket.emit("player_offline",uid);
    };
    _event.on("player_offline",sendPlayerOffline);

    const sendChangeHouseManager = function (uid) {
        _socket.emit("change_house_manager",uid);
    };
    _event.on("change_house_manager_id",sendChangeHouseManager);

    that.getIndex = function () {
        return _index;
    };

    that.getUid = function () {
        return _uid;
    };

    that.destroy = function () {
        _event.off("player_offline", sendPlayerOffline);
        _event.off("send_create_player_message", sendCreatePlayerMessage);
        _event.off("change_house_manager_id", sendChangeHouseManager);
    };
    return that;
};

module.exports = Player;