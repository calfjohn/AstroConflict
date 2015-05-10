var currentLayer;

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
    rocker1: null,
    rocker2: null,
    gameover: false,
    ctor:function (flag) {
        this._super();

        ////add Bk
        //var bk =new cc.Sprite(res.game_bk);
        //bk.attr({
        //    x: cc.winSize.width/2,
        //    y: cc.winSize.height/2
        //});
        //this.addChild(bk,1);

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
        this.addChild(border,5);

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

        if(flag) {
            //this.initIntroduce(7);
            this.menu_layer = new GameMenuLayer();
            this.addChild(this.menu_layer,100);
        }
        else{
            this.onStartGame();
        }


        return true;
    },
    initIntroduce: function(tag){
        this.shootlabel = new cc.LabelTTF("← Click To Shoot →", "", 15);
        this.shootlabel.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/3));
        this.shootlabel.setColor(cc.color(100,100,100,100));
        this.addChild(this.shootlabel, tag);

        if(cc.sys.isMobile) return;

        //add logo and key tip
        this.key_z = new cc.Sprite(res.key_z);
        this.key_z.setPosition(cc.p(200, cc.winSize.height/5));
        this.addChild(this.key_z, tag);

        this.key_x = new cc.Sprite(res.key_x);
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
    },
    makeIntroduceEasy: function(){
        this.shootlabel.setString("Press keyboard Z, X, > or ?.");
        this.shootlabel.setFontSize(24);
        this.shootlabel.setColor(cc.color(255,0,0,255));

        if(cc.sys.isMobile) return;
        var x = 20, y = 50;
        var keyWidth = this.key_x.getContentSize().width/2;
        this.key_z.runAction(cc.moveTo(1, cc.p(x + keyWidth, y)));
        this.key_x.runAction(cc.moveTo(1, cc.p(x + keyWidth*3, y)));

        this.key_dot.runAction(cc.moveTo(1, cc.p(cc.winSize.width-x-keyWidth*3, y)));
        this.key_slash.runAction(cc.moveTo(1, cc.p(cc.winSize.width-keyWidth-x, y)));

        this.controllabel.runAction(cc.sequence(cc.fadeOut(1), cc.removeSelf()));
    },
    loadRocker : function(){
        this.rocker1 = new Rocker(res.base_png, res.knob_png, "DEFAULT");
        this.rocker1.callback = this.onCallbackBlue.bind(this);
        this.addChild(this.rocker1, 6);
        this.rocker1.setPosition(this.rocker1.radius + 50, this.rocker1.radius + 50);

        this.rocker2 = new Rocker(res.base_png, res.knob_png, "DEFAULT");
        this.rocker2.callback = this.onCallbackRed.bind(this);
        this.addChild(this.rocker2, 6);
        this.rocker2.setPosition(cc.winSize.width - this.rocker2.radius - 50, this.rocker2.radius + 50);
    },
    onCallbackBlue : function(sender){
        this.blue.onRun(this.rocker1);
    },
    onCallbackRed : function(sender){
        this.red.onRun(this.rocker2);
    },
    initButtonControl: function(){
        var touchEvent = function (sender, type) {
            var target;
            var layer = sender.getParent();
            if(layer.gameover) return;
            var tag = sender.getTag();
            if (tag == 90 || tag == 88){
                target = layer.blue;
            }
            else if (tag == 190 || tag == 191){
                target = layer.red;
            }
            else return;

            switch (type){
                case ccui.Widget.TOUCH_BEGAN:
                    //if(tag == 90 || tag == 190) target.startMove();
                    //else
                    if(tag == 88 || tag == 191) {
                        //target.setStatus(STATUS.ROLL);
                        target.aimer.setVisible(true);
                    }
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                case ccui.Widget.TOUCH_CANCELED:
                    //if(tag == 90 || tag == 190) target.stopMove();
                    //else
                    if(tag == 88 || tag == 191) {
                        target.setStatus(STATUS.IDLE);
                        if(!target.isCDing) target.shoot();
                            target.aimer.setVisible(false);
                    }
                    break;
                default:
                    break;
            }
        };

        var x = this.rocker1.radius+50, y = this.rocker1.radius + 50;
        //var button = new ccui.Button();
        //button.setTouchEnabled(true);
        //button.loadTextures(res.key_z, res.key_z_press, res.key_z);
        //button.addTouchEventListener(touchEvent, this);
        //button.setPosition(cc.p(x + button.getContentSize().width/2, y));
        //button.setTag(90);
        //this.addChild(button, 10);

        button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(res.shoot_png, res.shootpress_png, res.shootpress_png);
        button.addTouchEventListener(touchEvent, this);
        button.setPosition(cc.p(x + button.getContentSize().width*2, y));
        button.setOpacity(128);
        button.setTag(88);
        this.addChild(button, 100);

        //button = new ccui.Button();
        //button.setTouchEnabled(true);
        //button.loadTextures(res.key_dot, res.key_dot_press, res.key_dot);
        //button.addTouchEventListener(touchEvent, this);
        //button.setPosition(cc.p(cc.winSize.width-x-button.getContentSize().width*3/2, y));
        //button.setTag(190);
        //this.addChild(button, 100);

        button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(res.shoot_png, res.shootpress_png, res.shootpress_png);
        button.addTouchEventListener(touchEvent, this);
        button.setPosition(cc.p(cc.winSize.width-button.getContentSize().width*2-x, y));
        button.setOpacity(128);
        button.setTag(191);
        this.addChild(button, 100);
    },

    onStartGame: function()
    {
        if(this.menu_layer) {
            //this.makeIntroduceEasy();
            this.menu_layer.removeFromParent();
        }

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
                        if(this.blue_lifes[4 - this.blue_life_count])
                            this.blue_lifes[4 - this.blue_life_count].runAction(cc.sequence(jumpAction, cc.fadeOut(1), cc.removeSelf()));
                    }

                }
                else if(hero_type == g_ColorType.red)
                {
                    this.red_life_count --;
                    if(this.red_life_count>=0){
                        var jumpAction = cc.jumpBy(1, cc.p(-100, 0),  20, 3);
                        if(this.red_lifes[4 - this.red_life_count])
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

        //add ItemController
        this.ic = new ItemController(this);
        g_ItemPool = [];

        //add GameController
        this.gc = new GameController(this.blue,this.red);

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
        }.bind(this),2.5);

        this.loadRocker();
        //if(cc.sys.isMobile) {
            this.initButtonControl();
        //}
        //else {
        //    this.initKeyBoardControl();
        //}
    },
    update: function(dt){
        if(this.gameover) return;
        this.blue.update(dt);
        this.red.update(dt);
        bulletController.attacks(dt);
        this.gc.update(dt);
        this.ic.update(dt);
    }
});

var SolarSystem = cc.Layer.extend({
    onEnter:function () {
        this._super();

        var offset = 180;
        var whRate = cc.visibleRect.width/(cc.visibleRect.height-offset);
        this.setScaleY(1/whRate);
        Star.whRate = whRate;

        var sun = new Sun();
        sun.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, offset/2)));
        this.addChild(sun);

        var astBelt = new MainBelt;
        sun.addChild(astBelt);
    }
});


var GameScene = cc.Scene.extend({
    _newGame:false,
    ctor:function(flag){
        this._super();
        this._newGame = flag;
        bulletController.reset();
    },
    onEnter:function () {
        this._super();

        var background = new cc.Sprite(res.game_bk);
        this.addChild(background);
        background.setPosition(cc.visibleRect.center);

        this.addChild(new SolarSystem);

        var layer = new GameSceneLayer(this._newGame);
        this.addChild(layer);
        currentLayer = layer;

        var touchEvent = function (sender, type) {
            switch (type){
                case ccui.Widget.TOUCH_BEGAN:
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    cc.LoaderScene.preload(g_resources, function () {
                        cc.director.runScene(new GameScene(true));
                    }, this);
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
                default:
                    break;
            }
        };
        button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(res.shoot_png, res.shootpress_png, res.shootpress_png);
        button.addTouchEventListener(touchEvent, this);
        button.setPosition(cc.visibleRect.topRight);
        this.addChild(button);
    }
});

