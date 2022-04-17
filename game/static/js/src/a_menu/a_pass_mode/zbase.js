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
