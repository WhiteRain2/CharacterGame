export class MainGame {
    constructor(id) {
        this.id = id;
        this.$main_game = $('#' + id);
        this.settings = new Settings(this);
        this.menu = new GameMenu(this);
        // this.probar = new ProBar(this);
        this.playground = new PlayGround(this);

        this.start();
    }
    start() { }
}
