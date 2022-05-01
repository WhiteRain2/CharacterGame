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
        this.img.onload = function () {
            outer.ctx.drawImage(outer.img, outer.x - outer.w / 2, outer.y - outer.h / 2, outer.w, outer.h);
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
        var d = this.get_dist(this.x - this.w / 2, this.y - this.h / 2, word.x - word.w / 2, word.y - word.h / 2);
        if (d <= this.w / 2 + word.w / 2) return true;
        else return false;
    }

    add_listening_events() {
        if (this.end) return;
        let outer = this;
        // close the menu of right
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.$playground.mousedown(function (e) {
            if (outer.end) {
                if (outer.end_buff > 180) {
                    // save score
                    let pre_score = outer.playground.root.settings.score;
                    if (pre_score < outer.score) {
                        $.ajax({
                            url: "http://8.130.98.108/settings/modify/",
                            type: "GET",
                            data: {
                                score: outer.score,
                            },
                            success: function (resp) {
                                if (resp.result === "success") {
                                    location.reload();
                                } else {
                                    outer.$login_error_message.html(resp.result);
                                }
                            }
                        });
                    }
                    location.reload();
                }
                return;
            }
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 1) {
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            }
            else if (e.which === 3) {
                if (outer.skill_coldtime <= outer.eps)
                    outer.shoot(e.clientX - rect.left, e.clientY - rect.top);
            }
        });
    }

    shoot(tx, ty) {
        let x = this.x - this.w / 2, y = this.y - this.h / 2;
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
        this.end_buff++;
        let photo = "../../../static/material/images/";
        if (r) photo += "up.png";
        else photo += "down.png";
        var img = new Image();
        img.src = photo;
        let outer = this;

        img.onload = function () {
            outer.ctx.drawImage(img, outer.playground.width / 2 - 250, outer.playground.height / 2 - 250, outer.playground.width / 3, outer.playground.height / 2);
        }
        img.onload();
        this.end = true;
    }

    Load_CDimg(x, y, r) {
        let photo = "../../../static/material/images/cdImg.png";
        var img = new Image();
        img.src = photo;
        let outer = this;
        img.onload = function () {
            outer.ctx.drawImage(img, x, y, r, r);
        }
        img.onload();
    }


    on_destroy() {
        this.playground.hide();
        for (let i = 0; i < this.playground.words.length; i++) {
            this.playground.words[i].destroy();
        }
        this.words.length = 0;
        this.playground.game_map.destroy();
    }

    grade_mode() {
        var sx = this.playground.width;
        var sy = this.playground.height;
        var pos = [
            [sx * 0.1, sy * 0.1],
            [sx * 0.1, sy * 0.9],
            [sx * 0.9, sy * 0.1],
            [sx * 0.9, sy * 0.9]
        ];
        var word_a = sy * 0.07;
        for (let i = 0; i < this.init; i++) {
            var r = this.playground.randomNum(1, 900);
            var p = Math.floor(Math.random() * 4);
            var cur_mode = "common";
            this.words.push(new Word(this.playground, pos[p][0], pos[p][1], word_a, word_a, this.playground.width * 0.1, cur_mode, r));
            cur_mode = "different";
        }
        this.init += 5;
    }

    show_grade_score(score) {
        var num = [];
        while (score != 0) {
            num.push(score % 10);
            score = parseInt(score / 10);
        }
        var score_path = "../../../static/material/images/score_img";
        var r = this.playground.width * 0.02;
        var cur_x = this.playground.width / 2 - r;
        var cur_y = this.playground.height * 0.07;
        var interval = this.playground.width * 0.015;
        var k = 0;
        for (var i = num.length - 1; i >= 0; i--) {
            var score_img = new Image();
            score_img.src = `${score_path}/${num[i]}.png`;
            let outer = this;
            score_img.onload = function () {
                outer.ctx.drawImage(score_img, cur_x + k * interval, cur_y, r, r);
                k++;
            }
            score_img.onload();
            var ico_img = new Image();
            ico_img.src = `${score_path}/ico.png`;
            ico_img.onload = function () {
                outer.ctx.drawImage(ico_img, cur_x * 0.95, cur_y, r, r);
            }
            ico_img.onload();
        }
    }

    update() {
        // show grade score
        if (this.mode === "grade") {
            this.show_grade_score(this.score);
        }

        this.te++;
        if (this.life <= 0) {
            this.win = false;
            this.game_over(false);
        }
        if (this.words.length <= 0) {
            if (this.mode !== "grade") {
                this.win = true;
                this.game_over(true);
            }
            else {
                this.grade_mode();
            }
        }
        if (this.te > 60)
            for (var i = 0; i < this.words.length; i++) {
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
        this.ctx.arc(cur_x, cur_y, r + this.skill_coldtime * (this.playground.height / 15), 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
        this.Load_CDimg(cur_x - r, cur_y - r, 2 * r);
        // life img
        var life_img = new Image();
        life_img.src = "../../../static/material/images/life.png";
        let outer = this;
        life_img.onload = function (x, y, r) {
            outer.ctx.drawImage(life_img, x, y, r, r);
        };
        for (var i = 0; i < this.life; i++) {
            life_img.onload(this.playground.width * (0.8 + i * 0.07), this.playground.height * 0.85, this.playground.width * 0.04);
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
