var GameSceneLayer = cc.Layer.extend({
    sprite:null,
    blue: null,
    red: null,
    gc: null,
    ic: null,
    blue_lifes: [],
    red_lifes: [],
    menu_layer: null,
    blue_life_count: 5,
    red_life_count:5,
    temp_90_pressed: false,
    temp_88_pressed: false,
    temp_190_pressed: false,
    temp_191_pressed: false,
    key_z: null,
    key_x: null,
    key_dot: null,
    key_slash: null,
    controllabel: null,
    shootlabel: null,
    ctor:function () {

        this._super();

        //add Bk
        var bk =new cc.Sprite(res.game_bk);
        bk.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2
        });
        this.addChild(bk,1);

        //add Hero
        this.blue = new Hero(g_ColorType.blue);
        this.addChild(this.blue,2);
        this.red = new Hero(g_ColorType.red);
        this.addChild(this.red,3);

        //add Border
        var border = new cc.Sprite(res.game_border);
        border.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2
        });
        this.addChild(border,5)

        //add Life
        for(var i =0 ; i < 5; i++)
        {
            var blue_life = new cc.Sprite(res.blue_life);
            blue_life.attr({
                x:25,
                y:cc.winSize.height - 90 - 60 * i
            });
            this.addChild(blue_life,6);
            this.blue_lifes[i] = blue_life;
            var red_life = new cc.Sprite(res.red_life);
            red_life.attr({
                x:cc.winSize.width - 25,
                y:cc.winSize.height - 90 - 60 * i
            });
            this.addChild(red_life,6);
            this.red_lifes[i] = red_life;
        }

        this.initIntroduce(7);
        this.menu_layer = new GameMenuLayer();
        this.addChild(this.menu_layer,100);

        return true;
    },
    initIntroduce: function(tag){
        //add logo and key tip
        this.key_z = new cc.Sprite(res.key_Z);
        this.key_z.setPosition(cc.p(200, cc.winSize.height/5));
        this.addChild(this.key_z, tag);

        this.key_x = new cc.Sprite(res.key_X);
        this.key_x.setPosition(cc.p(200, cc.winSize.height/3));
        this.addChild(this.key_x, tag);

        this.controllabel = new cc.LabelTTF("← Control Move And Direction →", "", 15);
        this.controllabel.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/5));
        this.controllabel.setColor(cc.color(100,100,100,100));
        this.addChild(this.controllabel, tag);

        this.key_dot = new cc.Sprite(res.key_dot);
        this.key_dot.setPosition(cc.p(cc.winSize.width-200, cc.winSize.height/5));
        this.addChild(this.key_dot, tag);

        this.key_slash = new cc.Sprite(res.key_slash);
        this.key_slash.setPosition(cc.p(cc.winSize.width-200, cc.winSize.height/3));
        this.addChild(this.key_slash, tag);

        this.shootlabel = new cc.LabelTTF("← Click To Shoot →", "", 15);
        this.shootlabel.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/3));
        this.shootlabel.setColor(cc.color(100,100,100,100));
        this.addChild(this.shootlabel, tag);
    },
    makeIntroduceEasy: function(){
        this.shootlabel.setString("← Press Keyboard, Please →");
        this.shootlabel.setColor(cc.color(255,0,0,255));

        var keyWidth = this.key_x.getContentSize().width/2;
        var pos = this.key_x.getPosition();
        this.key_z.runAction(cc.moveTo(2, cc.p(pos.x - keyWidth*3/5, pos.y)));
        this.key_x.runAction(cc.moveBy(1, cc.p(keyWidth*3/5, 0)));

        pos = this.key_slash.getPosition();
        this.key_dot.runAction(cc.moveTo(2, cc.p(pos.x - keyWidth*3/5, pos.y)));
        this.key_slash.runAction(cc.moveBy(1, cc.p(keyWidth*3/5, 0)));

        this.controllabel.runAction(cc.sequence(cc.fadeOut(1), cc.removeSelf()));
    },
    initKeyBoardControl: function()
    {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                var target = event.getCurrentTarget();
                if (target.shootlabel.visible) target.shootlabel.runAction(cc.sequence(cc.fadeOut(5), cc.removeSelf()));
                if(keyCode == 90)
                {
                    if(!target.temp_90_pressed && !target.temp_88_pressed)
                    {
                        if(target.key_z.visible) target.key_z.runAction(cc.sequence(cc.fadeOut(2), cc.removeSelf()));

                        target.temp_90_pressed = true;
                        target.blue.setStatus(STATUS.ROLL);
                        target.blue.aimer.setVisible(true);
                        //cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 88)
                {
                    if(!target.temp_88_pressed && !target.temp_90_pressed)
                    {
                        if(target.key_x.visible) target.key_x.runAction(cc.sequence(cc.fadeOut(2), cc.removeSelf()));

                        target.temp_88_pressed = true;
                        if(!target.blue.isCDing) target.blue.shoot();
                        //cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 190 && !g_IsAIEnable)
                {
                    if(!target.temp_190_pressed && !target.temp_191_pressed)
                    {
                        if(target.key_dot.visible) target.key_dot.runAction(cc.sequence(cc.fadeOut(2), cc.removeSelf()));

                        target.temp_190_pressed = true;
                        target.red.setStatus(STATUS.ROLL);
                        target.red.aimer.setVisible(true);
                        //cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 191 && !g_IsAIEnable)
                {
                    if(!target.temp_191_pressed && !target.temp_190_pressed)
                    {
                        if(target.key_slash.visible) target.key_slash.runAction(cc.sequence(cc.fadeOut(2), cc.removeSelf()));

                        target.temp_191_pressed = true;
                        if(!target.red.isCDing) target.red.shoot();
                        //cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
            },
            onKeyReleased: function(keyCode, event){
                var target = event.getCurrentTarget();
                if(keyCode == 90)
                {
                    if(target.temp_90_pressed)
                    {
                        target.temp_90_pressed = false;
                        target.blue.isClockWise = !target.blue.isClockWise;
                        target.blue.setStatus(STATUS.MOVE);
                        target.blue.aimer.setVisible(false);
                        //cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
                else if(keyCode == 88)
                {
                    if(target.temp_88_pressed)
                    {
                        target.temp_88_pressed = false;
                        target.blue.setStatus(STATUS.MOVE);
                        //cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
                else if(keyCode == 190 && !g_IsAIEnable)
                {
                    if(target.temp_190_pressed)
                    {
                        target.temp_190_pressed = false;
                        target.red.isClockWise = !target.red.isClockWise;
                        target.red.setStatus(STATUS.MOVE);
                        target.red.aimer.setVisible(false);
                        //cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
                else if(keyCode == 191 && !g_IsAIEnable)
                {
                    if(target.temp_191_pressed)
                    {
                        target.temp_191_pressed = false;
                        target.red.setStatus(STATUS.MOVE);
                        //cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
            }
        }, this);
    },
    onStartGame: function()
    {
        this.makeIntroduceEasy();
        this.menu_layer.removeFromParent();
        //add Custom Event
        var lifeminuslistener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "lifeminus_event",
            callback: function(event){
                var hero_type = event.getUserData();
                if(hero_type == g_ColorType.blue)
                {
                    this.blue_life_count --;
                    cc.log(this.blue_life_count);
                    if(this.blue_life_count>=0)
                    {
                        //this.blue_lifes[4 - this.blue_life_count].setTexture(res.life_frame);
                        var jumpAction = cc.jumpBy(1, cc.p(100, 0),  20, 3);
                        this.blue_lifes[4 - this.blue_life_count].runAction(cc.sequence(jumpAction, cc.fadeOut(1), cc.removeSelf()));
                    }

                }
                else if(hero_type == g_ColorType.red)
                {
                    this.red_life_count --;
                    if(this.red_life_count>=0){
                        var jumpAction = cc.jumpBy(1, cc.p(-100, 0),  20, 3);
                        this.red_lifes[4 - this.red_life_count].runAction(cc.sequence(jumpAction, cc.fadeOut(1), cc.removeSelf()));
                        //this.red_lifes[4 - this.red_life_count].setTexture(res.life_frame);
                    }
                }
            }.bind(this)

        });
        cc.eventManager.addListener(lifeminuslistener, 1);

        var lifepluslistener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "lifeplus_event",
            callback: function(event){
                var hero_type = event.getUserData();
                if(hero_type == g_ColorType.blue)
                {
                    this.blue_life_count ++;
                    cc.log(this.blue_life_count);
                    this.blue_lifes[5 - this.blue_life_count].setTexture(res.blue_life);

                }
                else if(hero_type == g_ColorType.red)
                {
                    this.red_life_count ++;
                    cc.log(this.red_life_count);
                    this.red_lifes[5 - this.red_life_count].setTexture(res.red_life);
                }
            }.bind(this)

        });
        cc.eventManager.addListener(lifepluslistener, 1);

        //after tips.
        this.blue.setStatus(STATUS.MOVE);
        this.red.setStatus(STATUS.MOVE);

        //add GameController
        this.gc = new GameController(this.blue,this.red);

        //add ItemController
        this.ic = new ItemController();

        //enable AI?
        //gc.setAIEnable(true);

        //add Update
        this.scheduleUpdate();

        //add Star
        this.schedule(function(dt){
            var random_count = Math.ceil(Math.random()*3);
            for(var i = 0;i < random_count;i++){
                var random_file = Math.ceil(Math.random()*3);
                var filename = "res/star" + random_file + ".png";
                var star = new cc.Sprite(filename);
                star.attr({
                    x: cc.winSize.width * Math.random(),
                    y: cc.winSize.height * Math.random(),
                    opacity: 0,
                    rotate: Math.random()
                });
                this.addChild(star,2);
                star.runAction(cc.sequence(cc.fadeIn(1.0),cc.delayTime(0.5),cc.fadeOut(1.0),cc.removeSelf()));
            }
        }.bind(this),0.1);

        this.initKeyBoardControl();
    },
    update: function(dt){
        this.blue.update(dt);
        this.red.update(dt);
        bulletController.attacks(dt);
        this.gc.update(dt);
        this.ic.update(dt);
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameSceneLayer();
        this.addChild(layer);
        currentLayer = layer;
    }
});

