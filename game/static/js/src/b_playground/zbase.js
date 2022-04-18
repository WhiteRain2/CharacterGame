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

    show(mode) {
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.player = new Player(this, this.width/2, this.height/2, 100, 100, this.width*0.12, "me", "../../../static/material/images/me.png");
        this.words = [];
        if (mode === "common") {
            for (var i=0; i<10; i++) {
                var r = this.randomNum(1, 1999);
                this.words.push(new Word(this, 10, 10, 50, 50, this.width*0.12, mode, r));
            }
        }
        else {
        }
    }
    hide() {
        this.$playground.hide();
    }
}
