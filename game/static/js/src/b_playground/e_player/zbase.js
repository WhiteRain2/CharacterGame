class Player extends GameObject {
    constructor(playground, x, y, w, h, speed, who, photo) {
        // who is easy common difficult endless me
        super();
        this.playground = playground;
        this.mode = this.playground.mode;
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
        this.end_buff = 0;
        let outer = this;
        this.te = 0;  //set time for attached
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
        this.skill_coldtime = 0.9;
        this.life = 3;
        //grade
        this.init = 5;
        this.score = 0;
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
                if (outer.end_buff > 180)
                    location.reload();
                else
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
        let speed = this.playground.height * 0.7;
        let move_length = this.playground.height * 1;
        this.skill_coldtime = 0.9;
        new Water(this.playground, this.x, this.y, w, h, vx, vy, photo, speed, move_length, this.playground.height * 0.01);
    }

    game_over(r) {
        this.end_buff ++;
        let photo = "../../../static/material/images/";
        if (r) photo += "up.png";
        else photo += "down.png";
        var img = new Image();
        img.src = photo;
        let outer = this;

        img.onload = function() {
            outer.ctx.drawImage(img, outer.playground.width/2-250, outer.playground.height/2-250, outer.playground.width/3, outer.playground.height/2);
        }
        img.onload();
        this.end = true;
    }

    Load_CDimg(x, y, r) {
        let photo = "../../../static/material/images/cdImg.png";
        var img = new Image();
        img.src = photo;
        let outer = this;
        img.onload = function() {
            outer.ctx.drawImage(img, x, y, r, r);
        }
        img.onload();
    }


    grade_mode() {
        for (let i=0; i<this.init; i++) {
            var r = this.playground.randomNum(1, 900);
            var cur_mode = "common";
            this.words.push(new Word(this.playground, 10, 10, 50,50, this.playground.width*0.12, cur_mode, r));
            cur_mode = "different";
        }
        this.init += 5;
    }

    update() {
        if (this.mode === "grade") {
            var s = `当前得分: ${this.score}`;
            this.ctx.font = "normal normal 20px Verdana";
            this.ctx.fillText("haha", this.playground.width/2, this.playground.height*0.2, this.playground.width);
        }
        this.te ++;
        if (this.life === 0) {
            this.win = false;
            this.game_over(false);
        }
        if (this.words.length === 0) {
            if (this.mode !== "grade") {
                this.win = true;
                this.game_over(true);
            }
            else {
                this.grade_mode();
            }
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
        var r = (0.9 - this.skill_coldtime) * (this.playground.height / 15);
        var cur_x = this.playground.width * 0.92;
        var cur_y = this.playground.height * 0.12;
        this.ctx.beginPath();
        this.ctx.arc(cur_x, cur_y, r + this.skill_coldtime*(this.playground.height/15), 0, 2*Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
        this.Load_CDimg(cur_x-r, cur_y-r, 2*r);
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
        if (!this.end)
            this.img.onload()
        else {
            this.game_over(this.win);
        }
    }

}
