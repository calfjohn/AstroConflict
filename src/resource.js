var audioEngine = cc.audioEngine;

var res = {
    blue_aimer : "res/blue_aimer.png",
    blue_base : "res/blue_base.png",
    blue_baselight: "res/blue_baselight.png",
    blue_tower : "res/blue_tower.png",
    blue_towerlight : "res/blue_towerlight.png",
    blue_life: "res/blue_life.png",
    blue_bubble: "res/blue_bubble.png",
    red_aimer : "res/red_aimer.png",
    red_base : "res/red_base.png",
    red_baselight: "res/red_baselight.png",
    red_tower : "res/red_tower.png",
    red_towerlight: "res/red_towerlight.png",
    red_life: "res/red_life.png",
    red_bubble: "res/red_bubble.png",
    game_bk : "res/game_bk.jpg",
    game_border : "res/game_border.png",
    item_rush: "res/itemRush.png",
    item_disappear: "res/itemDisappear.png",
    item_sbullet: "res/itemSbullet.png",
    item_hpplus: "res/itemHpPlus.png",
    item_cdhalf: "res/itemCDHalf.png",
    item_speed2: "res/itemSpeed2.png",
    life_frame: "res/life_frame.png",
    audio_collision: "res/collision1.wav",
    audio_shoot_1: "res/lasershoot2.wav",
    audio_explosion: "res/explosion1.wav",
    audio_item_show: "res/itemshow.wav",
    audio_item_taken: "res/itemtaken.wav",
    star1: "res/star1.png",
    star2: "res/star2.png",
    star3: "res/star3.png",
    key_dot: "res/key_dot.png",
    key_slash: "res/key_slash.png",
    key_X: "res/key_X.png",
    key_Z: "res/key_Z.png",
    logo_png: "res/logo.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}