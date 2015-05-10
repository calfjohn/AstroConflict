var BULLET_SPEED = 400;
var BULLET_RADUIS = 20;

var bulletController = {
    bulletsA: [],
    bulletsB: [],
    reset: function(){
        this.bulletsA = [];
        this.bulletsB = [];
    },
    collision: function(obj1, obj2){
        var miniDistance = obj1.radius + obj2.radius;
        var blue_Pos = obj1.getPosition();
        var red_Pos = obj2.getPosition();
        var tempDistance = cc.pDistance(blue_Pos,red_Pos);

        if(tempDistance < miniDistance)
        {
            var angel = cc.pToAngle(cc.pSub(blue_Pos,red_Pos));
            var distance = miniDistance - tempDistance + 1;
            var distance1 = (1-obj1.mass/(obj1.mass+obj2.mass))*distance;
            var distance2 = distance - distance1;
            obj1.setPosition(cc.pRotateByAngle(cc.pAdd(cc.p(distance1,0),blue_Pos),blue_Pos,angel));
            obj2.setPosition(cc.pRotateByAngle(cc.pAdd(cc.p(-distance2,0),red_Pos),red_Pos,angel));

            if(obj1.duration) obj1.curDuration = obj1.duration + 1;
            if(obj2.duration) obj2.curDuration = obj2.duration + 1;

            if(obj1.duration && obj2.duration) this.collapse(cc.pMidpoint(blue_Pos, red_Pos));
            if(obj2.life) obj1.onCollide(obj2);
        }

    },
    proccessArray: function(bullets, mask, dt){
        for(var i = bullets.length-1; i >= 0; i--){
            var bullet =  bullets[i];

            //Role mask is attacking, then let's check the other role and bullets
            var bulletsX = mask === 1? this.bulletsB: this.bulletsA;
            for(var k = bulletsX.length-1; k >= 0; k--) {
                var bulletX =  bulletsX[k];
                this.collision(bullet, bulletX);
            }

            if(mask === 1) {
                var target = currentLayer.blue;
                if(!target.stealth) this.collision(bullet, target);
            }
            else if(mask ===2){
                var target = currentLayer.red;
                if(!target.stealth) this.collision(bullet, target);
            }

            bullet.curDuration = bullet.curDuration + dt;
            if(bullet.curDuration > bullet.duration){
                bullets.splice(i, 1);
                bullet.onTimeOut();
            }
            else{
                bullet.onUpdate(dt);
            }
        }
    },
    attacks: function(dt){
        this.proccessArray(this.bulletsA, 1, dt);
        this.proccessArray(this.bulletsB, 2, dt);
    },

    collapse: function(pos){
        var particle = new cc.ParticleSystem(res.collapse);
        currentLayer.addChild(particle, 10);
        particle.setPosition(pos);
        particle.setAutoRemoveOnFinish(true);
    }
};

bulletController.changeAngle = function(mask){
    var bulletsX = mask === 1? this.bulletsA: this.bulletsB;
    var pos = mask === 1? currentLayer.blue.getPosition(): currentLayer.red.getPosition();
    for(var k = bulletsX.length-1; k >= 0; k--) {
        var bullet =  bulletsX[k];
        angle = cc.pToAngle(cc.pSub(pos, bullet.getPosition()));
        angle = cc.PI/2 - angle;
        bullet.speed.x = BULLET_SPEED *Math.sin(angle);
        bullet.speed.y = BULLET_SPEED *Math.cos(angle);
    }
};

bulletController.weakBullet = function(mask){
    var bulletsX = mask === 1? this.bulletsA: this.bulletsB;
    for(var k = bulletsX.length-1; k >= 0; k--) {
        var bullet =  bulletsX[k];
        //bullet.curDuration += bullet.duration/2;
        bullet.curDuration = bullet.duration + 1;
    }
};


bulletController.spawnBullet = function (type, mask, pos, angle) {
    if(type === 1){
        BasicBullet.create(mask, pos, angle);
    }
    else if(type === 2){
        scatterBullet.create(mask, pos, angle);
    }
};

var BasicBullet = cc.Sprite.extend({
    ctor: function(mask){
        var bubblefilename;
        if(mask == 1)
            bubblefilename = res.blue_bubble;
        else
            bubblefilename = res.red_bubble;
        this._super(bubblefilename);
        this.mask = 0;  //1 is Role A, 2 is Role B, 0 is nobody
        this.speed = {x: BULLET_SPEED, y: BULLET_SPEED}; //traveling speed
        this.duration = 3;
        this.curDuration = 0;
        this.radius = BULLET_RADUIS;
        this.mass = 100;
    },
    onTimeOut: function(){
        this.runAction(cc.removeSelf());
    },
    onCollide: function(target){
        target.losslife();
        audioEngine.playEffect(res.audio_explosion);
    },
    onUpdate: function(dt){
        var selfPos = this.getPosition();
        var nextPos = cc.p(selfPos.x + this.speed.x*dt, selfPos.y + this.speed.y*dt);
        this.setPosition(nextPos);
        this.checkBorder();
        this.setOpacity(255*(1-this.curDuration/this.duration));
    },
    checkBorder: function() {
        var obj_pos = this.getPosition();
        if (obj_pos.x < 0) {
            this.setPositionX(cc.winSize.width);
        }
        else if (obj_pos.x > cc.winSize.width) {
            this.setPositionX(0);
        }
        else if (obj_pos.y < 0) {
            this.setPositionY(cc.winSize.height);
        }
        else if (obj_pos.y > cc.winSize.height) {
            this.setPositionY(0);
        }
    }
});

BasicBullet.create = function(mask, pos, angle){
    var sprite = new BasicBullet(mask);
    sprite.mask = mask;
    sprite.speed.x *= Math.sin(angle);
    sprite.speed.y *= Math.cos(angle);
    var tempMass = (cc.random0To1() + 1)*100;
    sprite.mass = tempMass;
    //sprite.mass.x = Math.abs(tempMass * Math.sin(angle));
    //sprite.mass.y = Math.abs(tempMass * Math.cos(angle));
    sprite.setPosition(pos);
    if(sprite.mask == 2)
    {
        bulletController.bulletsA.push(sprite);
    }
    else
    {
        bulletController.bulletsB.push(sprite);
    }
    currentLayer.addChild(sprite, 1);
    audioEngine.playEffect(res.audio_shoot_1);

    return sprite;
};

var scatterBullet = BasicBullet.extend({
});

scatterBullet.create = function(mask, pos, angle){
    for(var i = 0; i < 12; i++){
        BasicBullet.create(mask, pos, angle);
        angle += cc.PI/6;
    }
};