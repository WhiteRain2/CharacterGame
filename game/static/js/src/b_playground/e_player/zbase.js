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

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }


    add_listening_events() {
        this.playground.$playground.mousedown(function(e){
            if (e.which === 1) {
                this.move_to(e.clientX, e.clientY);
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
