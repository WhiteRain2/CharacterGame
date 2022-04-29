class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="game-menu">
    <audio autoplay loop class="game-menu-audio" id="back_audio" src="../../../static/material/audio/menu.mp3"></audio>
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
        <br>
        <div class="game-menu-field-item game-menu-field-item-settings">
            更多
        </div>
    </div>
</div>
`);
        this.root.$main_game.append(this.$menu);
        this.hide();
        this.$pass_mode = this.$menu.find('.game-menu-field-item-pass-mode');
        this.$audio = $("#back_audio")[0];
        this.$audio.volume = 0.1;
        this.$grade_mode = this.$menu.find('.game-menu-field-item-grade-mode');
        this.$explain = this.$menu.find('.game-menu-field-item-explain');
        this.$settings = this.$menu.find('.game-menu-field-item-settings');
        this.src = false;
        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$menu.click(function () {
            if (!outer.src) {
                outer.$audio.volume = 0.1;
                outer.$audio.play();
                outer.src = true;
            }
        });
        this.$pass_mode.click(function () {
            outer.hide();
            outer.pass_menu = new PassMode(outer);
        });
        this.$grade_mode.click(function () {
            outer.hide();
            outer.root.playground.show("grade");
        });
        this.$explain.click(function () {
            outer.hide();
            new Explain(outer.root);
        });
        this.$settings.click(function () {
            outer.hide();
            new More(outer.root);
        });
    }

    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}

