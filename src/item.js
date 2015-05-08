
var STYLE = {speed2:0,sbullet:1,disapper:2,cdhalf:3,rush:4,hpplus:5};

var CONST_ITEMLIFE = 8;
var CONST_BLINK_TIME = 2;

var Item = cc.Sprite.extend({
    style: null,
    curlifetime: 0,
    isBlinking: false,
    ctor: function(style) {
        var filename;
        switch(style)
        {
            case STYLE.rush:
                filename = res.item_rush;
                break;
            case STYLE.disapper:
                filename = res.item_disappear;
                break;
            case STYLE.sbullet:
                filename = res.item_sbullet;
                break;
            case STYLE.hpplus:
                filename = res.item_hpplus;
                break;
            case STYLE.cdhalf:
                filename = res.item_cdhalf;
                break;
            case STYLE.speed2:
                filename = res.item_speed2;
                break;
            default :
                filename = "";
        }
        this._super(filename);
        this.style = style;

        this.attr({
            x: cc.winSize.width * Math.ceil(Math.random()*9)*0.1,
            y: cc.winSize.height * Math.ceil(Math.random()*9)*0.1,
            scale: 0.8
        });

        g_ItemPool.push(this);

        this.scheduleUpdate();
    },
    update: function(dt)
    {
        this.curlifetime += dt;
        if(this.curlifetime > CONST_ITEMLIFE - CONST_BLINK_TIME && !this.isBlinking)
        {
            this.runAction(cc.blink(CONST_BLINK_TIME,5));
            this.isBlinking = true;
        }
        else if(this.curlifetime > CONST_ITEMLIFE)
        {
            g_ItemPool.splice(g_ItemPool.indexOf(this),1);
            this.removeFromParent();
        }
    },
    setCollision: function(who)
    {
        this.unscheduleUpdate();
        g_ItemPool.splice(g_ItemPool.indexOf(this),1);
        this.removeFromParent();

        //do real function
        var mask;
        if(who.colortype == g_ColorType.blue)
        {
            mask = 1;
        }
        else
        {
            mask = 2;
        }

        audioEngine.playEffect(res.audio_item_taken);

        switch(this.style)
        {
            case STYLE.rush:
                bulletController.changeAngle(mask);
                break;
            case STYLE.disapper:
                //bulletController.weakBullet(mask);
                who.setStealth();
                break;
            case STYLE.sbullet:
                bulletController.spawnBullet(2, mask, who.getPosition(), cc.degreesToRadians(who.tower_angel));
                break;
            case STYLE.hpplus:
                who.getlife();
                break;
            case STYLE.cdhalf:
                who.setCDHalf();
                break;
            case STYLE.speed2:
                who.setSpeed2();
                break;
            default :
                ;
        }
    }

});
