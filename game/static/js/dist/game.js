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
            outer.root.playground.show();
        });
        this.$grade_mode.click(function(){
            console.log('YES');
            outer.hide();
            outer.root.playground.show();
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

class PlayGround {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<h1>haha</h1>`);
        this.hide();
        this.root.$main_game.append(this.$playground);
        this.start();
    }
    start() {
    }

    show() {
        this.$playground.show();
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
