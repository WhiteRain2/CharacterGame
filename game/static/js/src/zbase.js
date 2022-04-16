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
