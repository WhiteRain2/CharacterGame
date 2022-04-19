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
        this.words = this.playground.words;
        this.ctx = this.playground.game_map.ctx;
        this.photo = photo;
        this.move_length = 0;
        this.eps = 0.1;
        this.img = new Image();
        this.img.src = this.photo;
        this.end = false;
        let outer = this;
        this.te = 0;  //set time for attached
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
        this.skill_coldtime = 1.5;
        this.life = 3;
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

    is_collision(word) {
        var d = this.get_dist(this.x-this.w/2, this.y-this.h/2, word.x-word.w/2, word.y-word.h/2);
        if (d <= this.w/2 + word.w/2) return true;
        else return false;
    }

    add_listening_events() {
        let outer = this;
        // close the menu of right
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.$playground.mousedown(function(e){
            if (outer.end) {
                location.reload();
                return;
            }
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 1) {
                outer.move_to(e.clientX-rect.left, e.clientY-rect.top);
            }
            else if (e.which === 3) {
                if (outer.skill_coldtime <= outer.eps)
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
        this.skill_coldtime = 1.5;
        new Water(this.playground, this.x, this.y, w, h, vx, vy, photo, speed, move_length, this.playground.height * 0.01);
    }

    game_over(r) {
        let photo = "../../../static/material/images/";
        if (r) photo += "up.png";
        else photo += "down.png";
        var img = new Image();
        img.src = photo;
        let outer = this;

        img.onload = function() {
            outer.ctx.drawImage(img, outer.playground.width/2-250, outer.playground.height/2-250, 500, 500);
        }
        img.onload();
        for (var i=0; i<500000; i++);
        this.end = true;
    }

    update() {
        this.te ++;
        if (this.life === 0) {
            this.game_over(false);
        }
        if (this.words.length === 0) {
            this.game_over(true);
        }
        if (this.te > 60)
            for (var i = 0; i<this.words.length; i++) {
                if (this.is_collision(this.words[i])) {
                    this.life -= 1;
                    this.te = 0;
                }
            }
        // player moved
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
        // skill CD
        if (this.skill_coldtime > this.eps)
            this.skill_coldtime -= this.timedelta / 1000;
        // CD image
        this.ctx.beginPath();
        this.ctx.arc(this.playground.width*0.95, this.playground.height*0.1, 50*this.skill_coldtime, 0, 2*Math.PI);
        this.ctx.fillstyle = "red";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        // lift show
        for (var i=0; i<this.life; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.playground.width*(0.7+i*0.1), this.playground.height*0.9, 25, 0, 2*Math.PI);
            this.ctx.fillstyle = "red";
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.render();
    }

    render() {
        this.img.onload()
    }

}
