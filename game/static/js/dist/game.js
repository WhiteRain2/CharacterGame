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
        this.ctx.fillStyle = "rgba(248, 239, 230, 0.2)";
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
        this.speed = speed;
        this.who = who;
        this.ctx = this.playground.game_map.ctx;
        this.photo = photo;
        this.img = new Image();
        this.img.src = this.photo;
        let outer = this;
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x, outer.y, outer.w, outer.h);
        }
        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        this.playground.$playground.mousedown(function(e){
            if (e.which === 1) {
                console.log(e.clientX);
            }
        });
    }

    update() {
        this.render();
    }

    render() {
       this.img.onload()
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

    show(mode) {
        this.$playground.show();
        
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.player = new Player(this, this.width/2-50, this.height/2-50, 100, 100, 0, "me", "../../../static/material/images/me.png");
        if (mode === "easy") {
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
