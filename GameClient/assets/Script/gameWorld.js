// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
import global from './global'
import EventListener from './event_listener'

cc.Class({
    extends: cc.Component,

    properties: {
        player_node_prefab:{
            default:null,
            type:cc.Prefab
        },
        player_pos_list:{
            default:[],
            type:cc.Node
        },
        game_ready:{
            default : null,
            type : cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        this._index = 0;
        this.playerNodeList = [];


        this.game_ready.active = true;

        global.gameEventListener = EventListener({});
        global.gameEventListener.on("sync_data",(data)=> {
            console.log("game world sync data = "+ JSON.stringify(data));
            global.playerData.uid = data.uid;
            global.playerData.house_manager_id = data.house_manager_id;
            console.log("house manager = "+data.house_manager_id);
            if(data.uid === data.house_manager_id){
                this.game_ready.active = true;
            }
            var _playersData = data.players_data;
            this._index = data.index;
            for(var i =0;i<_playersData.length;++i){
                var playerData = _playersData[i];
                this.createPlayer(playerData.uid,playerData.index);
            }
        });
        global.gameEventListener.on("player_join",(data)=>{
            this.createPlayer(data.uid,data.index);
        });

        global.gameEventListener.on("player_offline",(uid)=>{
            for(var i =0;i<this.playerNodeList.length;++i){
                var playerNode = this.playerNodeList[i];
                if(playerNode.getComponent("playerNode").getUid() === uid){
                    playerNode.removeFromParent(true);
                    playerNode.destroy();
                    this.playerNodeList.splice(i,1);
                }
            }
        });

        global.gameEventListener.on("change_house_manager",(uid)=>{
            global.playerData.house_manager_id = uid;
            if(global.playerData.uid === uid){
                this.game_ready.active = true;
            }
        });
    },

    createPlayer : function (uid, index) {
        console.log("uid = "+uid);
        console.log("index = "+index);
        var currentIndex = index - this._index;
        if(currentIndex < 0){
            currentIndex += 6;
        }

        var player = cc.instantiate(this.player_node_prefab);
        player.parent = this.node;
        player.getComponent("playerNode").init(uid,currentIndex);
        player.position = this.player_pos_list[currentIndex].position;
        this.playerNodeList.push(player);
    },

    onButtonClick : function (event, customData) {
        console.log("customData = "+customData);
        switch (customData){
            case "start_game":
                break;
            default:
                break;
        }
    }

    // update (dt) {},
});
