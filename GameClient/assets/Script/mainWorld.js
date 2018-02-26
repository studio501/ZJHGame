// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
const global = require("./global");
cc.Class({
    extends: cc.Component,

    properties: {
       edit_box:{
        default:null,
        type:cc.EditBox
       }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    buttonClick:function (event,cd) {
        console.log("button click = " + cd);
        console.log("eidt box string ="+ this.edit_box.string);
        if(this.edit_box.string.length !== 0){
            global.eventlistener.fire("login",this.edit_box.string);
        }
    }

    // update (dt) {},
});
