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

    show() {
        this.$playground.show();
    }
    hide() {
        this.$playground.hide();
    }
}
