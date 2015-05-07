var GameMenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.initMenuLayer();
    },
    initMenuLayer: function(){
        var baselayer = new cc.LayerColor.create(cc.color(0,0,0,100));
        baselayer.ignoreAnchorPointForPosition(false);
        baselayer.setAnchorPoint(cc.p(0.5,0.5));
        baselayer.setContentSize(cc.size(cc.winSize.width * 3/4, cc.winSize.height*3/4));
        baselayer.setPosition(cc.winSize.width/2,cc.winSize.height);
        this.addChild(baselayer);
        baselayer.runAction(cc.moveBy(0.8,cc.p(0,-cc.winSize.height/2)).easing(cc.easeBackOut()));

        ////add logo and key tip
        //var key_z = new cc.Sprite(res.key_Z);
        //key_z.setPosition(cc.p(180, baselayer.getContentSize().height*2/5));
        //baselayer.addChild(key_z);
        //
        //var key_x = new cc.Sprite(res.key_X);
        //key_x.setPosition(cc.p(180, baselayer.getContentSize().height/5));
        //baselayer.addChild(key_x);
        //
        //var controllabel = new cc.LabelTTF("← Control Move And Direction →", "", 15);
        //controllabel.setPosition(cc.p(baselayer.getContentSize().width/2, baselayer.getContentSize().height*2/5));
        //controllabel.setColor(cc.color(100,100,100,100));
        //baselayer.addChild(controllabel);
        //
        //var key_dot = new cc.Sprite(res.key_dot);
        //key_dot.setPosition(cc.p(baselayer.getContentSize().width-180, baselayer.getContentSize().height*2/5));
        //baselayer.addChild(key_dot);
        //
        //var key_slash = new cc.Sprite(res.key_slash);
        //key_slash.setPosition(cc.p(baselayer.getContentSize().width-180, baselayer.getContentSize().height/5));
        //baselayer.addChild(key_slash);
        //
        //var shootlabel = new cc.LabelTTF("← Click To Shoot →", "", 15);
        //shootlabel.setPosition(cc.p(baselayer.getContentSize().width/2, baselayer.getContentSize().height/5));
        //shootlabel.setColor(cc.color(100,100,100,100));
        //baselayer.addChild(shootlabel);

        var logo = new cc.Sprite(res.logo_png);
        logo.setPosition(cc.p(baselayer.getContentSize().width/2, baselayer.getContentSize().height*4/5));
        baselayer.addChild(logo);

        var startitem = new cc.MenuItemImage(res.key_dot, res.key_dot, function(pSender){
            audioEngine.playEffect(res.audio_item_taken);
            this.runAction(cc.sequence(cc.moveBy(0.8,cc.p(0,cc.winSize.height*3/4)).easing(cc.easeBackOut()),cc.callFunc(function(sender){
                currentLayer.onStartGame();
            })));
        },this);
        startitem.runAction(cc.sequence(cc.scaleTo(0.8,1.2),cc.scaleTo(0.8,0.8)).repeatForever());
        var startMenu = new cc.Menu(startitem);
        startMenu.setPosition(baselayer.getContentSize().width/2, baselayer.getContentSize().height/3);
        baselayer.addChild(startMenu);
    }
});

