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
        this.$pass_menu.hide();
    }
}
class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="game-menu">
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

        this.start();
    }

    start() {
        this.add_listening_events();
    }



   add_listening_events() {
        let outer = this;
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
        this.ctx.fillStyle = "rgba(248, 239, 230)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    }

}
class Player extends GameObject {
    constructor(playground, x, y, w, h, speed, who, photo) {
        // who is easy common difficult endless me
        super();
        this.playground = playground;
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
        let outer = this;
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
        this.skill_coldtime = 1.5;
        this.life = 3;
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
            if (this.end) {
                outer.playground.hide();
                outer.playground.game_map.$canvas.remove();
                outer.playground.root.menu.show();
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
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        this.skill_coldtime = 1.5;
        new Water(this.playground, this.x, this.y, w, h, vx, vy, photo, speed, move_length, this.playground.height * 0.01);
    }

    game_over(r) {
        var s = ``;
        if (r) {
            s += `胜利!`;
        }
        else {
            s += `胜败乃兵家常事，加油!`;
        }
        this.font = "20px";
        this.ctx.fillText(s, 10, 50);
        this.end = true;
    }

    update() {
        if (this.life === 0) {
            this.game_over(0);
        }
        if (this.words.length === 0) {
            this.game_over(1);
        }
        for (var i = 0; i<this.words.length; i++) {
            if (this.is_collision(this.words[i])) {
                this.life -= 1;
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
        this.ctx.beginPath();
        this.ctx.arc(this.playground.width*0.95, this.playground.height*0.1, 50*this.skill_coldtime, 0, 2*Math.PI);
        this.ctx.fillstyle = "red";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        // lift show
        for (var i=0; i<this.life; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.playground.width*(0.7+i*0.1), this.playground.height*0.9, 25, 0, 2*Math.PI);
            this.ctx.fillstyle = "red";
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.render();
    }

    render() {
        this.img.onload()
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
        for (let i = 0; i < this.playground.words.length; i ++ ) {
            if (this.playground.words[i] === this) {
                this.playground.words.splice(i, 1);
            }
        }

       this.destroy();
    }

    exhibition(x, y, w, h, photo) {
        var img = new Image();
        img.src = photo;
        let outer = this;
        img.onload = function() {
            outer.ctx.drawImage(img, x-w/2, y-h/2, outer.w*10, outer.h*10);
        }
        img.onload();
    }

    on_destroy() {
        var audio_html = $(`<audio id="audio" src=${this.path}.mp3></audio>`);
        this.playground.$playground.append(audio_html);
        var audio = $("#audio")[0];
        audio.play();
        let outer = this;
        audio.addEventListener('ended', function () {
            outer.exhibition(outer.x, outer.y, outer.w, outer.h, `${outer.path}.png`);
            audio_html.remove();
        }, false);
    }

    update(){
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

    show(mode) {
        this.$playground.show();
        this.words = [];
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.player = new Player(this, this.width/2, this.height/2, 100, 100, this.width*0.12, "me", "../../../static/material/images/me.png");
        if (mode === "common") {
            for (var i=0; i<10; i++) {
                var r = this.randomNum(1, 1999);
                this.words.push(new Word(this, 10, 10, 50, 50, this.width*0.12, mode, r));
            }
        }
        else {
        }
    }
    hide() {
        this.$playground.hide();
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
