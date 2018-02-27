/**
 * Created by tangwen on 2018/2/26.
 */
const Player = require("./player");
const EventListener = require("./event_listener");
const CardController = require("./card_controller");

const Room = function () {
    var that = {};
    var _playerList = [];
    var _event = EventListener({});
    var _cardController = CardController();
    _cardController.init();

    var _currentTotalRate = 0;
    var _turnPlayerIndex = 0;
    var _currentMaxRate = 0;

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
        if(_playerList.length < 2)
        {
            console.log("人数不够无法开始");
        }else
        {
            pushCard();
            turnPlayer();
        }
    });

    _event.on("choose_rate",function (data) {
        var rate = data.rate;
        console.log("choose rate "+JSON.stringify(data));
        _currentMaxRate = data.rate;
        _currentTotalRate += rate;
        data.totalRate = _currentTotalRate;
        _event.fire("update_player_rate",data);
        turnPlayer();
    });

    const pushCard = function () {
        for(var i=0;i<3;i++){
            for(var j=0;j<_playerList.length;++j){
                var player = _playerList[j];
                player.pushOneCard(_cardController.popCard());
            }
        }
        _event.fire("push_cards");
    };

    const turnPlayer = function () {
        var uid = undefined;
        for(var i=0;i<_playerList.length;i++){
            if(_playerList[i].getIndex() === _turnPlayerIndex){
                uid = _playerList[i].getUid();
            }
        }
        _event.fire("turn_player_index",{
            totalRate : _currentTotalRate,
            uid : uid,
            maxRate : _currentMaxRate
        });

        _turnPlayerIndex++;
        if(_turnPlayerIndex >= _playerList.length){
            _turnPlayerIndex = 0;
        }
    };

    const playerPk = function (data) {
        console.log("player pk = %j",data);
        var map = {};
        for(var i=0;i<_playerList.length;i++){
            map[_playerList[i].getUid()] = _playerList[i];
        }
        console.log("map = %j",map);

        var player1 = map[data.uid];
        var player2 = map[data.targetUid];
        var result = _cardController.pkCards(player1.getCardList(),player2.getCardList());
        console.log("pk result = "+result);
        _event.fire("pk_result",{
            win_uid : result ? data.uid : data.targetUid,
            lose_uid : result ? data.targetUid : data.uid
        });
    };

    _event.on("player_pk",playerPk);
    return that;
};

module.exports = Room;