/**
 * Created by tangwen on 2018/2/26.
 */
var Card = require("./card");
var defines = require("./defines");

const CardController = function () {
    var that = {};

    var _cardList = [];
    var initCard = function () {
        //console.log("call initCard");
        _cardList = [];
        var cards = [];
        var valueList = Object.keys(defines.cardValues);
        var shapeList = Object.keys(defines.cardShapes);
        for(var i =0;i<valueList.length;i++){
            for(var j =0;j<shapeList.length;j++){
                var card = Card(valueList[i],shapeList[j]);
                cards.push(card);
            }
        }
        while(cards.length){
            var index = Math.floor(Math.random() * cards.length);
            var card = cards[index];
            _cardList.push(card);
            cards.splice(index,1);
        }

        //console.log("after initCard is %j",_cardList);
    };

    that.init = function () {
        initCard();
    };

    that.popCard = function () {
        var card = _cardList[_cardList.length-1];
        _cardList.splice(_cardList.length-1,1);
        if(_cardList.length <= 0){
            initCard();
        }
        console.log("popCard of %j",card);
        return card;
    };

    //特殊牌型检测
    const checkDoubel = function (cardList) {
        var map = {};
        for(var i =0;i<cardList.length;i++){
            var card = cardList[i];
            var number = card.value;
            map[number] = true;
        }
        if(Object.keys(map).length === 2){
            return true;
        }
        return false;
    };

    const checkStraight = function (cardList) {
        var valueList = [];
        for(var i =0;i<cardList.length;i++){
            valueList.push(defines.cardValues[cardList[i].value]);
        }

        console.log("value list = "+ JSON.stringify(valueList));
        valueList.sort(function (a, b) {
            return a < b;
        });
        if(valueList[0] - valueList[1] === 1 && valueList[1] - valueList[2] === 1){
            return true;
        }
        if(valueList[0] === 14){
            valueList[0] = 1;
        }
        valueList.sort(function (a, b) {
            return a < b;
        });
        if(valueList[0] - valueList[1] === 1 && valueList[1] - valueList[2] === 1){
            return true;
        }

        return false;
    };

    const checkColor = function (cardList) {
        var map = {};
        for(var i =0;i<cardList.length;++i){
            var card = cardList[i];
            map[card.shape] = true;
        }
        if(Object.keys(map).length === 1){
            return true;
        }
        return false;
    };

    const checkColorStraight = function (cardList) {
        if(checkStraight(cardList) && checkColor(cardList)){
            return true;
        }
        return false;
    };

    const checkBoss = function (cardList) {
        var map = {};
        for (var i = 0; i < cardList.length; ++i) {
            var card = cardList[i];
            map[card.value] = true;
        }
        if (Object.keys(map).length === 1) {
            return true;
        }
        return false;
    };

    var checkCardMethod = {
        "Doubel":1,
        "Straight":2,
        "Color":3,
        "ColorStraight":4,
        "Boss":5
    };

    var checkMethodMap = {
        "Doubel":checkDoubel,
        "Straight":checkStraight,
        "Color":checkColor,
        "ColorStraight":checkColorStraight,
        "Boss":checkBoss
    };

    const sortCard = function (cards) {
        if(checkDoubel(cards)){
            var map = {};
            for(var i =0;i<cards.length;i++){
                var card = cards[i];
                if(map.hasOwnProperty(card.value)){
                    map[card.value].push(card);
                }else{
                    map[card.value] = [card];
                }
            }
            var value = 0;
            for(var i in map){
                if(map[i].length === 1){
                    value = i;
                }
            }
            cards.sort(function (a, b) {
                return a.value === value;
            });
            return cards;
        }
        cards.sort(function (a, b) {
            return defines.cardValues[a.value] < defines.cardValues[b.value];
        });
        return cards;
    };

    that.pkCards = function (cards1, cards2) {
        var cardsList = [cards1,cards2];
        var scoreMap = {"0":0,"1":0};
        for(var j = 0;j<2;j++){
            for(var i in checkCardMethod){
                var method = checkMethodMap[i];
                if(method(cardsList[j]) === true){
                    if(scoreMap[j+""] < checkCardMethod[i]){
                        scoreMap[j+""] = checkCardMethod[i];
                    }
                }
            }
        }
        if(scoreMap[0] === scoreMap[1]){
            cards1 = sortCard(cards1);
            cards2 = sortCard(cards2);
            console.log("cards1 & cards2 is %j,%j",cards1,cards2);

            for(var i =0;i<3;++i){
                var card1 = cards1[i];
                var card2 = cards2[i];
                if(defines.cardValues[cards1[i].value] > defines.cardValues[cards2[i].value]){
                    return true;
                }
                else if(defines.cardValues[cards1[i].value] < defines.cardValues[cards2[i].value]){
                    return false;
                }
            }
            if(cards1[0].shape > cards2[0].shape){
                return true;
            }
        }
        else if(scoreMap[0] > scoreMap[1]){
            return true;
        }
        return false;
    };
    return that;
};

module.exports = CardController;