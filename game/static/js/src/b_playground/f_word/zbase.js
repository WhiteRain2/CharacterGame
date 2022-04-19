class Word extends GameObject{
    constructor(playground, x, y, w, h, speed, mode, id) {
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
        this.ctx = this.playground.game_map.ctx;
        this.move_length = 0;
        this.eps = 0.1;
        this.img = new Image();
        this.path = `../../../static/material/words/${mode}/${id}`;
        this.img.src = this.path+'.png';
        let outer = this;
        this.img.onload = function() {
            outer.ctx.drawImage(outer.img, outer.x-outer.w/2, outer.y-outer.h/2, outer.w, outer.h);
        }
        this.mode = mode;
        this.id = id;
    }

    start() {
        let tx = Math.random() * this.playground.width;
        let ty = Math.random() * this.playground.height;
        this.move_to(tx, ty);

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

    is_attacked() {
        for (let i = 0; i < this.playground.words.length; i ++ ) {
            if (this.playground.words[i] === this) {
                this.playground.words.splice(i, 1);
            }
        }

       this.destroy();
    }

    exhibition(x, y, w, h, photo) {
        var img = new Image();
        img.src = photo;
        let outer = this;
        img.onload = function() {
            outer.ctx.drawImage(img, x-w/2, y-h/2, outer.w*10, outer.h*10);
        }
        img.onload();
    }

    on_destroy() {
        var audio_html = $(`<audio id="audio" src=${this.path}.mp3></audio>`);
        this.playground.$playground.append(audio_html);
        var audio = $("#audio")[0];
        audio.play();
        let outer = this;
        audio.addEventListener('ended', function () {
            outer.exhibition(outer.x, outer.y, outer.w, outer.h, `${outer.path}.png`);
            audio_html.remove();
        }, false);
    }

    update(){
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        this.render();
    }

    render() {
        this.img.onload();
    }
}
