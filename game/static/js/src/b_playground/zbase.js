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
        this.player = new Player(this, this.width/2-50, this.height/2-50, 100, 100,5, "me", "../../../static/material/images/me.png");
        if (mode === "easy") {
        }
        else {
        }
    }
    hide() {
        this.$playground.hide();
    }
}
