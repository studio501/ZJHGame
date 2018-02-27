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
        cardnode_prefab:{
            default:null,
            type:cc.Prefab
        },
        total_rate_label:{
            default:null,
            type:cc.Label
        },
        look_card_button:{
            default:null,
            type:cc.Button
        },
        rate_1_button:{
            default:null,
            type:cc.Button
        },
        rate_2_button:{
            default:null,
            type:cc.Button
        },
        rate_5_button:{
            default:null,
            type:cc.Button
        },
        pk_button:{
            default:null,
            type:cc.Button
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.node.active = false;
        global.gameEventListener.on("push_card",this.pushCard.bind(this));
        global.gameEventListener.on("show_card",this.showCard.bind(this));
        global.gameEventListener.on("player_choose_rate",this.playerChooseRate.bind(this));
        global.gameEventListener.on("turn_player_message",this.turnPlayerMessage.bind(this));
    },

    pushCard : function () {
        this.node.active = true;
        this.cardNodeList = [];
        console.log("recive event push card");
        for(var i = 0;i<3;i++){
            var cardNode = cc.instantiate(this.cardnode_prefab);
            cardNode.parent = this.node;
            cardNode.position = {x:100*(3-1)*(-0.5) + 100 * i,y:0};
            this.cardNodeList.push(cardNode);
        }
    },
    showCard : function (data) {
        console.log("showCard data = "+ JSON.stringify(data));
        for(var i =0;i<data.length;++i){
            var cardData = data[i];
            var cardNode = this.cardNodeList[i];
            cardNode.getComponent("cardNode").showCard(cardData);
        }
        this.look_card_button.interactable = false;
    },
    playerChooseRate:function (data) {
        var totalRate = data.totalRate;
        this.total_rate_label.string = totalRate + "";
    },
    turnPlayerMessage : function (data) {
        console.log("turn player meessage "+ JSON.stringify(data));
        let uid = data.uid;
        this.currentMaxRate = data.maxRate;
        if(uid === global.playerData.uid){
            this.enableButton(true);
        }else{
            this.enableButton(false);
        }
    },
    enableButton : function (isEnable) {
        this.setButtonActive(isEnable);
    },
    setButtonActive : function (value) {
        if(value === false){
            this.rate_1_button.interactable = value;
            this.rate_2_button.interactable = value;
            this.rate_5_button.interactable = value;
        }else{
            var rateList = [1,2,5];
            for(let i=0;i<rateList.length;++i){
                if(this.currentMaxRate <= rateList[i]){
                    this["rate_"+rateList[i]+"_button"].interactable = value;
                }else{
                    this["rate_"+rateList[i]+"_button"].interactable = false;
                }
            }
        }
        this.pk_button.interactable = value;
    },
    onDestroy : function () {
        global.gameEventListener.off("push_card",this.pushCard);
        global.gameEventListener.off("show_card",this.showCard);
        global.gameEventListener.off("player_choose_rate",this.playerChooseRate);
        global.gameEventListener.off("turn_player_message",this.turnPlayerMessage);
    }
    

    // update (dt) {},
});
