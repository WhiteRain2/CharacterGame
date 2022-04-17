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
        if (mode === "pass") {
           // this.pass_mode = new PassMode(this);
        }
        else {
        }
    }
    hide() {
        this.$playground.hide();
    }
}
