var CONST_HERO_ITEM_MINDISTANCE = 50;

GameController = function(blue, red){
    //if(blue == undefined || red == undefined) return;

    this.blue = blue;
    this.red = red;
    this.timetoexcuteAI = 0;
    this.blue_cur_pos;
    this.update = function(dt) {//TODO:要加入dt

        //AI
        if(g_IsAIEnable)
        {
            this.timetoexcuteAI -= dt;
            if(this.timetoexcuteAI <= 0){
                this.blue_cur_pos = this.blue.getPosition();
                this.red.setStatus(STATUS.ROLL);
                this.timetoexcuteAI = CONST_CD_TIME*(1+g_AIConfig.scheduleFator*Math.random());
            }
            if(this.red.status == STATUS.ROLL)
            {
                this.blue_cur_pos = this.blue.getPosition();
                var angel = this.getAngel(this.red.getPosition(), this.blue_cur_pos);
                cc.log(angel-this.red.base_angel);
                if(Math.abs(angel-this.red.base_angel) < 5)
                {
                    this.red.shoot();
                    this.red.setStatus(STATUS.MOVE);
                }
            }
        }

        this.borderCross(dt);
        this.checkHeroCollision(dt);
        this.checkItemCollision(dt);
    };
    this.borderCross = function(dt)
    {
        //border cross.
        this.checkBorderCross(this.blue);
        this.checkBorderCross(this.red);

        //check collision
        this.checkHeroCollision(dt);
    };
    this.checkBorderCross = function(obj)
    {
        var obj_pos = obj.getPosition();
        if(obj_pos.x<0)
        {
            obj.setPositionX(cc.winSize.width);
        }
        else if(obj_pos.x>cc.winSize.width)
        {
            obj.setPositionX(0);
        }
        else if(obj_pos.y<0)
        {
            obj.setPositionY(cc.winSize.height);
        }
        else if(obj_pos.y>cc.winSize.height)
        {
            obj.setPositionY(0);
        }
    };
    this.checkHeroCollision = function(dt)
    {
        var miniDistance = this.blue.radius + this.red.radius;
        var blue_Pos = this.blue.getPosition();
        var red_Pos = this.red.getPosition();
        var tempDistance = cc.pDistance(blue_Pos,red_Pos);

        if(tempDistance < miniDistance)
        {
            var angel = cc.pToAngle(cc.pSub(blue_Pos,red_Pos));
            var distance = miniDistance - tempDistance + 1;
            var distance1 = (1-this.blue.mass/(this.blue.mass+this.red.mass))*distance;
            var distance2 = distance - distance1;
            this.blue.setPosition(cc.pRotateByAngle(cc.pAdd(cc.p(distance1,0),blue_Pos),blue_Pos,angel));
            this.red.setPosition(cc.pRotateByAngle(cc.pAdd(cc.p(-distance2,0),red_Pos),red_Pos,angel));
        }
    };
    this.checkItemCollision = function(dt)
    {
        //blue
        for(var index in g_ItemPool){
            if(cc.pDistance(this.blue.getPosition(),g_ItemPool[index].getPosition()) < CONST_HERO_ITEM_MINDISTANCE){
                g_ItemPool[index].setCollision(this.blue);
                return;
            }
        }

        //red
        for(var index in g_ItemPool){
            if(cc.pDistance(this.red.getPosition(),g_ItemPool[index].getPosition()) < CONST_HERO_ITEM_MINDISTANCE){
                g_ItemPool[index].setCollision(this.red);
                return;
            }
        }
    };

    //AI
    this.setAIEnable = function(isAIEnable)
    {
        g_IsAIEnable = isAIEnable;
    };
    this.getAngel = function(obj1, obj2)
    {
        if(obj1.x == obj2.x && obj1.y < obj2.y)
        {
            return 0;
        }
        else if(obj1.x == obj2.x && obj1.y > obj2.y)
        {
            return 180;
        }
        else if(obj1.x < obj2.x && obj1.y == obj2.y)
        {
            return 90;
        }
        else if(obj1.x > obj2.x && obj1.y == obj2.y)
        {
            return 270;
        }
        else if(obj1.x < obj2.x && obj1.y < obj2.y)
        {
            return Math.atan2(obj2.x-obj1.x,obj2.y-obj1.y);
        }
        else if(obj1.x < obj2.x && obj1.y > obj2.y)
        {
            return 90 + Math.atan2(obj1.y-obj2.y,obj2.x-obj1.x);
        }
        else if(obj1.x > obj2.x && obj1.y < obj2.y)
        {
            return 270 + Math.atan2(obj2.y-obj1.y,obj1.x-obj2.x);
        }
        else if(obj1.x > obj2.x && obj1.y > obj2.y)
        {
            return 180 + Math.atan2(obj1.x-obj2.x,obj1.y-obj2.y);
        }
        else
        {
            return 0;
        }

    }

};