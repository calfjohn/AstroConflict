var EARTH = 15;
var EORB  = 10;
//              sun,    mercury         venus    Earth   Mars               jupiter         saturn  uranus  neptune pluto
var scales = [  80,    EARTH*0.38,   EARTH*0.9,  EARTH,  EARTH*0.533,       EARTH*2.2,     EARTH*2,     20,     15,     10];
var dtss   = [   0,     57,             108,     149,     228,              500,            600,      700,   800,    900];
var OPs    = [  0,      EORB *.2,      EORB*.6,  EORB,   EORB*1.8,          EORB*5,         EORB*7,  EORB*9,  EORB*12,  EORB*25];
var ZERO = cc.p(0,0);

var Star = cc.Node.extend({
    mass:1,
    radius:10,
    onEnter:function(){
        this._super();
        //this._setRadius();
        this._makeRounded();
    },
    _makeRounded:function(){
        if(Star.whRate && this.sprite)
        {
            this.sprite.setScaleY(this.sprite.getScale()*Star.whRate);
        }

    }
});


var Sun = Star.extend({
    mass: Infinity,
    radius:scales[0],
    sprite:null,
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.sol);
        this.sprite.setBlendFunc(cc.SRC_ALPHA,cc.ONE);
        this.addChild(this.sprite);
        //this._setRadius()
        Sun.ins = this;
    }
});

var MainBelt = cc.Node.extend({
    dts:(dtss[4]+dtss[5])/2.2,
    orbitPeriod:(OPs[4]+OPs[5])/2,
    _orbitSpeed:0,
    ctor:function(){
        this._super();
        this.sprite = new cc.ParticleSystem(res.asteroids);
        this.addChild(this.sprite);
        this.sprite.setStartRadius(this.dts);
        this.sprite.setEndRadius(this.dts);
        this.sprite.setPosition(0,0);
        this._orbitSpeed = -360/this.orbitPeriod;
        this.sprite.setRotatePerSecond(this._orbitSpeed);
        this.sprite.setEmissionRate(Infinity);
        this.sprite.setLife(Infinity);
    }
});