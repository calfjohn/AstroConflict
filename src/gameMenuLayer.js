var GameMenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.initMenuLayer();
    },
    initMenuLayer: function(){
        var baselayer = new cc.LayerColor(cc.color(0,0,0,100));
        baselayer.ignoreAnchorPointForPosition(false);
        baselayer.setAnchorPoint(cc.p(0.5,0.5));
        baselayer.setContentSize(cc.size(cc.winSize.width * 3/4, cc.winSize.height*3/4));
        baselayer.setPosition(cc.winSize.width/2,cc.winSize.height);
        this.addChild(baselayer);
        baselayer.runAction(cc.moveBy(0.8,cc.p(0,-cc.winSize.height/2)).easing(cc.easeBackOut()));

        var sprite = new cc.Sprite(res.cocologo);
        sprite.setPosition(cc.p(baselayer.getContentSize().width - sprite.getContentSize().width/2 - 1, sprite.getContentSize().height/2 + 1));
        baselayer.addChild(sprite, 0);

        var logo = new cc.Sprite(res.logo_png);
        logo.setPosition(cc.p(baselayer.getContentSize().width/2, baselayer.getContentSize().height*4/5));
        baselayer.addChild(logo);

        var startitem = new cc.MenuItemImage(res.start, res.start, function(pSender){
            audioEngine.playEffect(res.audio_item_taken);
            this.runAction(cc.sequence(cc.moveBy(0.8,cc.p(0,cc.winSize.height*3/4)).easing(cc.easeBackOut()),cc.callFunc(function(sender){
                currentLayer.onStartGame();
            })));
        },this);
        startitem.runAction(cc.sequence(cc.scaleTo(0.9,1.1),cc.scaleTo(0.9,0.9)).repeatForever());
        var startMenu = new cc.Menu(startitem);
        startMenu.setPosition(baselayer.getContentSize().width/2, baselayer.getContentSize().height/3);
        baselayer.addChild(startMenu);
    }
});

