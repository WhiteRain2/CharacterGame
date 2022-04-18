class Player extends GameObject {
    constructor(playground, x, y, w, h, speed, who, photo) {
        // who is easy common difficult endless me
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = 0;
        this.vy = 0;
        this.speed = speed;
        this.who = who;
        this.ctx = this.playground.game_map.ctx;
        this.photo = photo;
        this.move_length = 0;
        this.eps = 0.1;
        this.img = new Image();
        this.img.src = this.photo;
        let outer = this;
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
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
        let outer = this;
        // close the menu of right
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.$playground.mousedown(function(e){
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 1) {
                outer.move_to(e.clientX-rect.left, e.clientY-rect.top);
            }
            else if (e.which === 3) {
                outer.shoot(e.clientX-rect.left, e.clientY-rect.top);
            }
        });
    }

    shoot(tx, ty) {
        let x = this.x-this.w/2, y = this.y-this.h/2;
        let w = this.w * 0.2, h = this.h * 0.2;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let photo = "../../../static/material/images/water.png";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new Water(this.playground, this.x, this.y, w, h, vx, vy, photo, speed, move_length, this.playground.height * 0.01);
    }



    update() { 
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
        }
        else {
            let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        this.render();
    }

    render() {
        this.img.onload()
    }

}
