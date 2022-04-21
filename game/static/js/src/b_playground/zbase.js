class PlayGround {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="game-playground"></div>`);
        this.hide();
        this.root.$main_game.append(this.$playground);

        this.start();
    }

    start() {
    }

    randomNum(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1:
                return parseInt(Math.random()*minNum+1,10); 
                break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
                break; 
            default: 
                return 0; 
                break; 
        } 
    }

    create_words(num, mode, max) {
        var sx = this.width;
        var sy = this.height;
        var pos = [
            [sx*0.1, sy*0.1],
            [sx*0.1, sy*0.9],
            [sx*0.9, sy*0.1],
            [sx*0.9, sy*0.9]
        ];
        var word_a = sy * 0.07;
        for (let i=0; i<num; i++) {
            var r = this.randomNum(1, max);
            var p = Math.floor(Math.random() * 4);
            this.words.push(new Word(this, pos[p][0], pos[p][1], word_a, word_a, sx*0.1, mode, r));
        }
    }

    show(mode) {
        this.mode = mode;
        this.$playground.show();
        this.words = [];
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.player = new Player(this, this.width/2, this.height/2, 100, 100, this.width*0.12, "me", "../../../static/material/images/me.png");
        if (mode === "common") {
            this.create_words(10, mode, 1999);
        }
        else if (mode === "difficult"){
            this.create_words(15, mode, 974);
        }
        else if (mode === "easy") {
            this.create_words(6, mode, 599);
        }
        else {
            // grade mode player solved
        }
    }

    hide() {
        this.$playground.hide();
    }
}
