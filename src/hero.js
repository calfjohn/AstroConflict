
var CONST_MOVE_SPEED = 100;
var CONST_INCREASE_BASE_ANGEL = 3;
var CONST_INCREASE_TOWER_ANGEL = 3;
var CONST_CD_TIME = 2;
var CONST_SPEED2_DURATION = 5;
var CONST_CDHALF_DURATION = 5;
var CONST_TOWER_TO_BASE_DIS = 20;
var CONST_LIFE = 5;
var STATUS =  {IDLE: "idle", MOVE: "move", ROLL: "roll", SHOOT: "shoot", DEAD: "dead", WIN: "win"};

var Hero = cc.Node.extend({
    colortype: null,
    base: null,
    base_light: null,
    tower: null,
    tower_light: null,
    aimer: null,
    initPos: null,
    base_angel:0,
    tower_angel: 0,
    status: STATUS.IDLE,
    radius: 25,
    mass: 200,
    isClockWise: true,
    isCDing: false,
    lastCDTime: 0,
    speed: CONST_MOVE_SPEED,
    cd: CONST_CD_TIME,
    life: CONST_LIFE,
    ctor: function(colortype) {
        this._super();

        this.colortype = colortype;

        //add entity
        var baseFrameName = "";
        var baselightFrameName = "";
        var towerFramName = "";
        var towerlightFrameName = "";
        var aimerFrameName = "";
        if(this.colortype == g_ColorType.blue)
        {
            baseFrameName = res.blue_base;
            baselightFrameName = res.blue_baselight;
            towerFramName = res.blue_tower;
            towerlightFrameName = res.blue_towerlight;
            aimerFrameName = res.blue_aimer;
            this.initPos = cc.p(200,cc.winSize.height/2);
            this.tower_angel = 45;
            this.base_angel = 45;
        }
        else if(this.colortype == g_ColorType.red)
        {
            baseFrameName = res.red_base;
            baselightFrameName = res.red_baselight;
            towerFramName = res.red_tower;
            towerlightFrameName = res.red_towerlight;
            aimerFrameName = res.red_aimer;
            this.initPos = cc.p(cc.winSize.width-200, cc.winSize.height/2);
            this.tower_angel = -135;
            this.base_angel = -135;
        }
        else
            cc.log("error character color");
        this.base  = new cc.Sprite(baseFrameName);
        this.addChild(this.base,1);

        this.base_light = new cc.Sprite(baselightFrameName);
        this.addChild(this.base_light,2)

        this.tower = new cc.Sprite(towerFramName);
        this.addChild(this.tower,3);

        this.tower_light = new cc.Sprite(towerlightFrameName);
        this.addChild(this.tower_light,4);

        this.aimer = new cc.Sprite(aimerFrameName);
        this.addChild(this.aimer,5);
        this.aimer.setVisible(false);
        this.aimer.setScale(1.5);

        this.setPosition(this.initPos);
        this.tower.setRotation(this.tower_angel);
        this.tower_light.setRotation(this.tower_angel);
        this.aimer.setRotation(this.base_angel);
    },
    setStatus: function(status){
        this.status = status;
    },
    shoot: function()
    {
        if(!this.isCDing) {
            var mask;
            if (this.colortype == g_ColorType.blue) mask = 1;
            else mask = 2;
            var angle = cc.degreesToRadians(this.tower_angel);
            var pos1 = cc.pRotateByAngle(cc.p(BULLET_RADUIS + this.radius, 0), cc.p(0,0), cc.PI/2 - angle);
            pos = cc.pAdd(this.getPosition(), pos1);
            bulletController.spawnBullet(1, mask, pos, angle);
            this.lastCDTime = this.cd;
            this.isCDing = true;

            var particle = new cc.ParticleSystem(res.shoot);
            this.addChild(particle, 10);
            particle.setPosition(pos1);
            particle.setAutoRemoveOnFinish(true);
        }
    },
    setSpeed2: function()
    {
        if(this.speed == CONST_MOVE_SPEED)
        {
            this.speed = CONST_MOVE_SPEED * 2;
            this.scheduleOnce(function(dt){
                this.speed = CONST_MOVE_SPEED;
            },CONST_SPEED2_DURATION);
        }
    },
    setCDHalf: function()
    {
       if(this.cd  == CONST_CD_TIME)
       {
           this.cd = CONST_CD_TIME/2;
           this.scheduleOnce(function(dt){

           },CONST_CDHALF_DURATION);
       }
    },
    updateMove: function(dt){
        var cur_pos = this.getPosition();
        var base_angel_degrees = cc.degreesToRadians(this.base_angel);
        var new_pos = cc.p(cur_pos.x + this.speed * Math.sin(base_angel_degrees)*dt,cur_pos.y + this.speed * Math.cos(base_angel_degrees)*dt);
        this.setPosition(new_pos);
    },
    updateTowerRoll: function(dt){
        var new_angel;
        if(this.isClockWise)
            new_angel = (this.tower_angel + CONST_INCREASE_TOWER_ANGEL)%360;
        else
            new_angel = (this.tower_angel - CONST_INCREASE_BASE_ANGEL)%360;
        this.tower_angel = new_angel;
        this.tower.setRotation(new_angel);
        this.tower_light.setRotation(new_angel);
    },
    updateBaseRoll: function(dt){
        var new_angel;
        if(this.isClockWise)
            new_angel = (this.base_angel + CONST_INCREASE_BASE_ANGEL)%360;
        else
            new_angel = (this.base_angel - CONST_INCREASE_BASE_ANGEL)%360;
        this.base_angel = new_angel;
        this.aimer.setRotation(new_angel);

    },
    update: function(dt){
        if(this.isCDing)
        {
            this.lastCDTime -= dt;
            if(this.lastCDTime<=0) {
                this.isCDing = false;
                this.lastCDTime = 0;
                this.base_light.setOpacity(255);
                this.tower_light.setOpacity(255);
            }
            else
            {
                var opc = (this.cd - this.lastCDTime)/this.cd*255;
                this.base_light.setOpacity(opc);
                this.tower_light.setOpacity(opc);
            }
        }
        switch(this.status)
        {
            case STATUS.IDLE:
                break;
            case STATUS.MOVE:
                this.updateMove(dt);
                break;
            case STATUS.ROLL:
                this.updateBaseRoll(dt);
                this.updateTowerRoll(dt);
                this.updateMove(dt);
                break;
            case STATUS.SHOOT:
                break;
        }
    },
    getlife: function()
    {
        if(this.life != CONST_LIFE)
        {
            this.life ++;
            var event = new cc.EventCustom("lifeplus_event");
            event.setUserData(this.colortype);
            cc.eventManager.dispatchEvent(event);
        }
    },
    losslife: function(){
        this.life --;
        var event = new cc.EventCustom("lifeminus_event");
        event.setUserData(this.colortype);
        cc.eventManager.dispatchEvent(event);
        if(this.life <= 0 )
        {
            //gameover;
            this.status = STATUS.DEAD;
            currentLayer.unscheduleUpdate();
            var filename = this.colortype == g_ColorType.blue ?g_ColorType.red: g_ColorType.blue;
            var gameoverLayer = new GameOverLayer(filename);
            currentLayer.addChild(gameoverLayer,100);
        }
    }


});
