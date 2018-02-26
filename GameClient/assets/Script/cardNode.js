// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
import defines from './defines'
cc.Class({
    extends: cc.Component,

    properties: {
        sprite_frames :{
            default:null,
            type:cc.SpriteAtlas
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad :function() {
         this.addComponent(cc.Sprite).spriteFrame = this.sprite_frames.getSprite_Frames("card_black");
     },

    showCard:function (data) {
        console.log("show card data = "+ JSON.stringify(data));
        var value = data.value;
        var shape = data.shape;
        var nameStr = "card_" + defines.cardShapeMap[shape]+defines.cardValueMap[value];
        console.log("name str = "+ nameStr);
        this.getComponent(cc.Sprite).spriteFrame = this.sprite_frames.getSpriteFrame(nameStr);
    }


    // update (dt) {},
});
