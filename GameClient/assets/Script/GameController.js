// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var EventListener = require("./event_listener");
var global = require("./global");
cc.Class({
    extends: cc.Component,

    properties: {
        main_world_prefab :{
            default : null,
            type : cc.Prefab
        },
        game_world_prefab :{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        global.socket = io("localhost:3000");
        global.eventlistener = EventListener({});

        global.eventlistener.on("login",function (uid) {
            console.log("button click uid = "+uid);
            global.socket.emit("login",uid);
        });

        global.socket.on("sync_data",(data)=>{
            console.log("sync_data = "+JSON.stringify(data));
            this.enterGameWorld(data);
        });

        global.socket.on("player_join",(data)=>{
            global.gameEventListener.fire("player_join",data);
        });

        global.socket.on("player_offline",(uid)=>{
            console.log("player off line = "+uid);
            global.gameEventListener.fire("player_offline",uid);
        });

        global.socket.on("change_house_manager",(uid)=>{
            console.log("house manager is change "+uid);
            global.gameEventListener.fire("change_house_manager",uid);
        })
        this.enterMainWorld();
    } ,

    enterMainWorld : function () {
        console.log("enter MainWorld");
        if(this.runningWorld != undefined){
            this.runningWorld.removeFromParent(true);
        }
        this.runningWorld = cc.instantiate(this.main_world_prefab);
        this.runningWorld.parent = this.node;
    },

    enterGameWorld : function (data) {
        console.log("enter GameWorld");
        if(this.runningWorld != undefined){
            this.runningWorld.removeFromParent(true);
        }
        this.runningWorld = cc.instantiate(this.game_world_prefab);
        this.runningWorld.parent = this.node;
        global.gameEventListener.fire("sync_data",data);
    }


    // update (dt) {},
});
