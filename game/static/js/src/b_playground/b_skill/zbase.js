class Water extends GameObject {
    constructor(playground, x, y, w, h, vx, vy, photo, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.img = new Image();
        this.img.src = photo;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
        let outer = this;
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
        this.start();
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

  //      for (let i = 0; i < this.playground.players.length; i ++ ) {
  //          let player = this.playground.players[i];
  //          if (this.player !== player && this.is_collision(player)) {
  //              this.attack(player);
  //          }
  //      }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    render() {
        this.img.onload();
    }
}

