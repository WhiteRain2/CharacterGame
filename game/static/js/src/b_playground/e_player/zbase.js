class Player extends GameObject {
    constructor(playground, x, y, radius, who) {
        // who is easy common difficult endless me
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.who = who;
        this.ctx = this.playground.game_map.ctx;
    }

    render() {

    }

}
