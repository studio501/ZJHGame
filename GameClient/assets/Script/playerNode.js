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
cc.Class({
    extends: cc.Component,

    properties: {
        sprite_frames:{
            default:[],
            type:cc.SpriteFrame
        },
        uid_label:{
            default:null,
            type:cc.Label
        },
        house_manager_label:{
            default:null,
            type:cc.Label
        },
        card_node_prefab:{
            default:null,
            type:cc.Prefab
        },
        card_pos:{
            default:[],
            type:cc.Node
        },
        choose_rate_label:{
            default:null,
            type:cc.Label
        },
        choose_player_button: {
            default: null,
            type: cc.Button
        },
        pk_result_label:{
            default:null,
            type:cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad :function() {
         this.choose_player_button.node.active = false;
         this.node.addComponent(cc.Sprite).spriteFrame = this.sprite_frames[Math.round(Math.random()* this.sprite_frames.length)];

         global.gameEventListener.on("change_house_manager",this.changeHouseManager.bind(this));
         global.gameEventListener.on("push_card",this.pushCard.bind(this));
         global.gameEventListener.on("player_choose_rate",this.playerChooseRate.bind(this));
         global.gameEventListener.on("player_pk",this.playerPK.bind(this));
         global.gameEventListener.on("pk_choose_player",this.pkchoosedPlayer.bind(this));
         global.gameEventListener.on("pk_result",this.pkResult.bind(this));

     },
    pkchoosedPlayer : function () {
        this.choose_player_button.node.active = false;
    },
    playerPK : function () {
        console.log("player node pk");
        if(this.uid !== global.playerData.uid){
            this.choose_player_button.node.active = true;
        }
    },
    pkResult : function (data) {
        console.log("player node pk result %j",data);
        if(data.win_uid === this.uid){
            this.pk_result_label.string = "PK WIN";
        }else if(data.lose_uid === this.uid){
            this.pk_result_label.string = "PK LOSE";
        }
    },
    playerChooseRate : function (data) {
        console.log("playerNode data is %j",data);
        if(data.uid === this.uid){
            this.choose_rate_label.string = data.rate;
        }

    },
    pushCard : function () {
        if(this.getUid() === global.playerData.uid){
            return ;
        }
        for(let i=0;i<3;++i){
            let cardNode = cc.instantiate(this.card_node_prefab);
            cardNode.parent = this.node;
            cardNode.scale = {x:0.6,y:0.6};
            cardNode.position = cc.pAdd(this.card_pos[this.index].position,cc.p((3-1)*(-0.5)*40 + 40 *i,0));
        }
    },
    changeHouseManager : function (uid) {
        console.log("player node change house manager = "+uid);
        this.house_manager_label.string = "";
        if(uid === this.uid){
            this.house_manager_label.string = "房主";
        }
    },

    init : function (uid,index) {
        this.uid = uid;
        this.index = index;
        this.uid_label.string = uid+"";
        if(global.playerData.house_manager_id === this.uid){
            this.house_manager_label.string = "房主";
        }
    },
    getUid : function () {
        return this.uid;
    },
    onDestroy : function () {
        console.log("destroy");
        global.gameEventListener.off("change_house_manager",this.changeHouseManager);
        global.gameEventListener.off("push_card",this.pushCard);
        global.gameEventListener.off("player_choose_rate",this.playerChooseRate);
        global.gameEventListener.off("player_pk",this.playerPK);
        global.gameEventListener.off("pk_choose_player",this.pkchoosedPlayer);
        global.gameEventListener.off("pk_result",this.pkResult);
    },
    onButtonClick : function (event, customData) {
        console.log("playerNode onButtonClick %j",customData);
        if(customData === "choose_player_button"){
            cc.log("choose me = "+this.uid);
            global.eventlistener.fire("pk_choose_player",this.uid);
            global.gameEventListener.fire("pk_choose_player");
        }
    }

    // update (dt) {},
});
