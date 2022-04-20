class ProBar {
    constructor(root) {
        this.root = root;
        this.$pro_bar = $(`
        <div class="game-menu">
            <div class="progress">
                <div class="pro-bar"></div>
            </div>
        </div>
            `);
        this.root.$main_game.append(this.$pro_bar);
        this.start();
    }
    start() { 
        t = setInterval(this.progress, 60); 
    }
    progress() { 
        var i = 0;
        if (i < 100) { 
            i++; 
            bar.style.width = i + "%"; 
            bar.innerHTML = i + " %"; 
        }
        else { 
            clearInterval(t);
        }
    }
    stop() { 
        clearInterval(t); 
    }

}
