class PassMode {
    constructor(menu) {
        this.menu = menu;
        this.$pass_menu = $(`
<div class="game-menu-passmode">
    <div class="game-menu-passmode-field">
        <div class="game-menu-passmode-field-item game-menu-passmode-field-item-easy">
            探花
        </div>
        <br>
        <div class="game-menu-passmode-field-item game-menu-passmode-field-item-common">
            榜眼
        </div>
        <br>
        <div class="game-menu-passmode-field-item game-menu-passmode-field-item-difficult">
            状元
        </div>
        <br>
        <div class="game-menu-passmode-field-item game-menu-passmode-field-item-exit">
            返回
        </div>
    </div>
</div>
`);
        this.menu.root.$main_game.append(this.$pass_menu);
        this.$easy_mode = this.$pass_menu.find('.game-menu-passmode-field-item-easy');
        this.$common_mode = this.$pass_menu.find('.game-menu-passmode-field-item-common');
        this.$difficult_mode = this.$pass_menu.find('.game-menu-passmode-field-item-difficult');
        this.$exit = this.$pass_menu.find('.game-menu-passmode-field-item-exit');
        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$easy_mode.click(function(){
            outer.hide();
            outer.menu.root.playground.show("easy");
        });
        this.$common_mode.click(function(){
            outer.hide();
            outer.menu.root.playground.show("common");
        });
        this.$difficult_mode.click(function(){
            outer.hide();
            outer.menu.root.playground.show("difficult");
        });
        this.$exit.click(function(){
            outer.hide();
            outer.menu.show();
        });
    }

    show() {
        this.$pass_menu.show();
    }
    hide() {
        this.$pass_menu.remove();
    }
}
class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="game-menu">
    <audio class="game-menu-audio" id="menu_audio" autoplay="autoplay" src="http://music.163.com/song/media/outer/url?id=1853863650.mp3"></audio>
    <div class="game-menu-field">
        <div class="game-menu-field-item game-menu-field-item-pass-mode">
            关卡模式
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-grade-mode">
            积分模式
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-explain">
            游戏说明
        </div>
    </div>
</div>
`);
        this.root.$main_game.append(this.$menu);
        this.$pass_mode = this.$menu.find('.game-menu-field-item-pass-mode');
        this.$grade_mode = this.$menu.find('.game-menu-field-item-grade-mode');
        this.$explain = this.$menu.find('.game-menu-field-item-explain');
        this.menu_audio = $('#menu_audio')[0];
        this.menu_audio.volume = 0.1;
        this.src = false;
        this.start();
    }

    start() {
        this.add_listening_events();
    }



   add_listening_events() {
        let outer = this;
       this.$menu.click(function() {
           if (!outer.src) {
               outer.menu_audio.volume = 0.1;
               outer.menu_audio.play();
               outer.src = true;
           }
       });
       this.$pass_mode.click(function(){
           outer.hide();
           outer.pass_menu = new PassMode(outer);
       });
       this.$grade_mode.click(function(){
           outer.hide();
           outer.root.playground.show("grade");
       });
       this.$explain.click(function(){
           console.log('YES');
           // outer.root.settings.logout_on_remote();
       });
   }

    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}

let GAME_OBJECT = [];

class GameObject {
    constructor() {
        GAME_OBJECT.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
        this.uuid = this.create_uuid();
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i ++ ) {
            let x = parseInt(Math.floor(Math.random() * 10));  // 返回[0, 1)之间的数
            res += x;
        }
        return res;
    }

    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    late_update() {  // 在每一帧的最后执行一次
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < GAME_OBJECT.length; i ++ ) {
            if (GAME_OBJECT[i] === this) {
                GAME_OBJECT.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < GAME_OBJECT.length; i ++ ) {
        let obj = GAME_OBJECT[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    for (let i = 0; i < GAME_OBJECT.length; i ++ ) {
        let obj = GAME_OBJECT[i];
        obj.late_update();
    }

    last_timestamp = timestamp;

    requestAnimationFrame(GAME_ANIMATION);
}


requestAnimationFrame(GAME_ANIMATION);

class Water extends GameObject {
    constructor(playground, x, y, w, h, vx, vy, photo, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.img = new Image();
        this.img.src = photo;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
        let outer = this;
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.words.length; i ++ ) {
            let word = this.playground.words[i];
            if (this.is_collision(word)) {
                this.attack(word);
                break;
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(word) {
        var d = this.get_dist(this.x-this.w/2, this.y-this.h/2, word.x-word.w/2, word.y-word.h/2);
        if (d <= this.w/2 + word.w/2) return true;
        else return false;
    }

    attack(word) {
        this.destroy();
        word.is_attacked();
    }

    render() {
        this.img.onload();
    }
}

class GameMap extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
        this.$canvas.focus();
    }


    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(248, 239, 230, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    }

    update() {
        this.render();
    }


    render() {
        this.ctx.fillStyle = "rgba(248, 239, 230, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    }

}
class Player extends GameObject {
    constructor(playground, x, y, w, h, speed, who, photo) {
        // who is easy common difficult endless me
        super();
        this.playground = playground;
        this.mode = this.playground.mode;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = 0;
        this.vy = 0;
        this.speed = speed;
        this.who = who;
        this.words = this.playground.words;
        this.ctx = this.playground.game_map.ctx;
        this.photo = photo;
        this.move_length = 0;
        this.eps = 0.1;
        this.img = new Image();
        this.img.src = this.photo;
        this.end = false;
        this.end_buff = 0;
        let outer = this;
        this.te = 0;  //set time for attached
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
        this.skill_coldtime = 0.9;
        this.life = 3;
        //grade
        this.init = 5;
        this.score = 0;
    }

    start() {
        this.add_listening_events();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_collision(word) {
        var d = this.get_dist(this.x-this.w/2, this.y-this.h/2, word.x-word.w/2, word.y-word.h/2);
        if (d <= this.w/2 + word.w/2) return true;
        else return false;
    }

    add_listening_events() {
        let outer = this;
        // close the menu of right
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.$playground.mousedown(function(e){
            if (outer.end) {
                if (outer.end_buff > 180)
                    location.reload();
                else
                    return;
            }
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 1) {
                outer.move_to(e.clientX-rect.left, e.clientY-rect.top);
            }
            else if (e.which === 3) {
                if (outer.skill_coldtime <= outer.eps)
                    outer.shoot(e.clientX-rect.left, e.clientY-rect.top);
            }
        });
    }

    shoot(tx, ty) {
        let x = this.x-this.w/2, y = this.y-this.h/2;
        let w = this.w * 0.2, h = this.h * 0.2;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let photo = "../../../static/material/images/water.png";
        let speed = this.playground.height * 0.7;
        let move_length = this.playground.height * 1;
        this.skill_coldtime = 0.9;
        new Water(this.playground, this.x, this.y, w, h, vx, vy, photo, speed, move_length, this.playground.height * 0.01);
    }

    game_over(r) {
        this.end_buff ++;
        let photo = "../../../static/material/images/";
        if (r) photo += "up.png";
        else photo += "down.png";
        var img = new Image();
        img.src = photo;
        let outer = this;

        img.onload = function() {
            outer.ctx.drawImage(img, outer.playground.width/2-250, outer.playground.height/2-250, outer.playground.width/3, outer.playground.height/2);
        }
        img.onload();
        this.end = true;
    }

    Load_CDimg(x, y, r) {
        let photo = "../../../static/material/images/cdImg.png";
        var img = new Image();
        img.src = photo;
        let outer = this;
        img.onload = function() {
            outer.ctx.drawImage(img, x, y, r, r);
        }
        img.onload();
    }


    grade_mode() {
        var sx = this.playground.width;
        var sy = this.playground.height;
        var pos = [
            [sx*0.1, sy*0.1],
            [sx*0.1, sy*0.9],
            [sx*0.9, sy*0.1],
            [sx*0.9, sy*0.9]
        ];
        var word_a = sy * 0.07;
        for (let i=0; i<this.init; i++) {
            var r = this.playground.randomNum(1, 900);
            var p = Math.floor(Math.random()*4);
            var cur_mode = "common";
            this.words.push(new Word(this.playground, pos[p][0], pos[p][1], word_a, word_a, this.playground.width*0.1, cur_mode, r));
            cur_mode = "different";
        }
        this.init += 5;
    }

    show_grade_score(score) {
        var num = [];
        while (score != 0) {
            num.push(score % 10);
            score = parseInt(score / 10);
        }
        var score_path = "../../../static/material/images/score_img";
        var r = this.playground.width * 0.02;
        var cur_x = this.playground.width / 2 - r;
        var cur_y = this.playground.height * 0.07;
        var interval = this.playground.width * 0.015;
        var k = 0;
        for (var i=num.length-1; i>=0; i--) {
            var score_img = new Image();
            score_img.src = `${score_path}/${num[i]}.png`;
            let outer = this;
            score_img.onload = function() {
                outer.ctx.drawImage(score_img, cur_x + k*interval, cur_y, r, r);
                k ++;
            }
            score_img.onload();
            var ico_img = new Image();
            ico_img.src = `${score_path}/ico.png`;
            ico_img.onload = function() {
                outer.ctx.drawImage(ico_img, cur_x*0.95, cur_y, r, r);
            }
            ico_img.onload();
        }
    }

    update() {
        // show grade score
        if (this.mode === "grade") {
            this.show_grade_score(this.score);
        }

        this.te ++;
        if (this.life === 0) {
            this.win = false;
            this.game_over(false);
        }
        if (this.words.length === 0) {
            if (this.mode !== "grade") {
                this.win = true;
                this.game_over(true);
            }
            else {
                this.grade_mode();
            }
        }
        if (this.te > 60)
            for (var i = 0; i<this.words.length; i++) {
                if (this.is_collision(this.words[i])) {
                    this.life -= 1;
                    this.te = 0;
                }
            }
        // player moved
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
        }
        else {
            let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        // skill CD
        if (this.skill_coldtime > this.eps)
            this.skill_coldtime -= this.timedelta / 1000;
        // CD image
        var r = (0.9 - this.skill_coldtime) * (this.playground.height / 15);
        var cur_x = this.playground.width * 0.92;
        var cur_y = this.playground.height * 0.12;
        this.ctx.beginPath();
        this.ctx.arc(cur_x, cur_y, r + this.skill_coldtime*(this.playground.height/15), 0, 2*Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
        this.Load_CDimg(cur_x-r, cur_y-r, 2*r);
        // life img
        var life_img = new Image();
        life_img.src = "../../../static/material/images/life.png";
        let outer = this;
        life_img.onload = function(x, y, r) {
            outer.ctx.drawImage(life_img, x, y, r, r);
        };
        for (var i=0; i<this.life; i++) {
            life_img.onload(this.playground.width*(0.8+i*0.07), this.playground.height*0.85, this.playground.width * 0.04);
        }

        this.render();
    }

    render() {
        if (!this.end)
            this.img.onload()
        else {
            this.game_over(this.win);
        }
    }

}
class Word extends GameObject{
    constructor(playground, x, y, w, h, speed, mode, id) {
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
        this.ctx = this.playground.game_map.ctx;
        this.move_length = 0;
        this.eps = 0.1;
        this.img = new Image();
        this.path = `../../../static/material/words/${mode}/${id}`;
        this.img.src = this.path+'.png';
        let outer = this;
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
        this.mode = mode;
        this.id = id;
        this.end = false;
        this.dt = 0;
    }

    start() {
        let tx = Math.random() * this.playground.width;
        let ty = Math.random() * this.playground.height;
        this.move_to(tx, ty);

    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked() {
        var real_mode = this.playground.mode;
        if (real_mode === "grade") {
            this.playground.player.score += this.playground.player.init / 5 - 1;
        }
        for (let i = 0; i < this.playground.words.length; i ++ ) {
            if (this.playground.words[i] === this) {
                this.playground.words.splice(i, 1);
            }
        }
        this.show_audio();
        this.end = true;
    }

    show_audio() {
        var audio_html = $(`<audio id="audio" src=${this.path}.mp3></audio>`);
        this.playground.$playground.append(audio_html);
        var audio = $("#audio")[0];
        audio.volume = 1;
        audio.play();
        let outer = this;
        audio.addEventListener('ended', function () {
            audio_html.remove();
        }, false);
    }

    update() {
        if (this.end) {
            this.vx = this.vy = 0;
            this.w *= 1.005;
            this.h *= 1.005;
            this.dt += this.timedelta / 1000;
            if (this.dt > 2) {
                this.destroy();
            }
        }
        else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx, ty);
            }
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        this.render();
    }

    render() {
        this.img.onload();
    }
}
class PlayGround {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="game-playground"></div>`);
        
        this.hide();
        this.root.$main_game.append(this.$playground);

        this.start();
    }

    start() {
    }

    randomNum(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1:
                return parseInt(Math.random()*minNum+1,10); 
                break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
                break; 
            default: 
                return 0; 
                break; 
        } 
    }

    create_words(num, mode, max) {
        var sx = this.width;
        var sy = this.height;
        var pos = [
            [sx*0.1, sy*0.1],
            [sx*0.1, sy*0.9],
            [sx*0.9, sy*0.1],
            [sx*0.9, sy*0.9]
        ];
        var word_a = sy * 0.07;
        for (let i=0; i<num; i++) {
            var r = this.randomNum(1, max);
            var p = Math.floor(Math.random() * 4);
            this.words.push(new Word(this, pos[p][0], pos[p][1], word_a, word_a, sx*0.1, mode, r));
        }
    }

    show(mode) {
        this.mode = mode;
        this.$playground.show();
        this.words = [];
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.player = new Player(this, this.width/2, this.height/2, 100, 100, this.width*0.12, "me", "../../../static/material/images/me.png");
        if (mode === "common") {
            this.create_words(10, mode, 1999);
        }
        else if (mode === "difficult"){
            this.create_words(15, mode, 974);
        }
        else if (mode === "easy") {
            this.create_words(6, mode, 599);
        }
        else {
            // grade mode player solved
        }
    }

    hide() {
        this.$playground.hide();
    }
}
class ProBar {
    constructor(root) {
        this.root = root;
        this.$pro_bar = $(`
        <div class="game-menu">
            <div class="progress">
                <div class="pro-bar"></div>
            </div>
        </div>
            `);
        this.root.$main_game.append(this.$pro_bar);
        this.start();
    }
    start() { 
        t = setInterval(this.progress, 60); 
    }
    progress() { 
        var i = 0;
        if (i < 100) { 
            i++; 
            bar.style.width = i + "%"; 
            bar.innerHTML = i + " %"; 
        }
        else { 
            clearInterval(t);
        }
    }
    stop() { 
        clearInterval(t); 
    }

}
export class MainGame {
    constructor(id) {
        this.id = id;
        this.$main_game = $('#'+id);
        this.menu = new GameMenu(this);
        this.playground = new PlayGround(this);

        this.start();
    }
    start() {}
}
