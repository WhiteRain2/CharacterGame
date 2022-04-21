class ProBar {
    constructor(root) {
        this.root = root;
        this.$pro_bar = $(`
	<div class="ProBar">
		<div class="channel">
		   汉字大作战 游戏资源加载中...
		</div>
		<div class="container">
			<div class="loader">
				<div style="--i:1;--color:#FD79A8"></div>
				<div style="--i:2;--color:#0984E3"></div>
				<div style="--i:3;--color:#00B894"></div>
				<div style="--i:4;--color:#FDCB6E"></div>
			</div>
		</div>
	</div>
            `);
        this.$audio = $(`
            <audio class="src-audio" id="audio" autoplay="autoplay" loop src="http://music.163.com/song/media/outer/url?id=1853863650.mp3"></audio>
        `);
        this.$button = $(`
            <div class="src-button">
                <div class="text">点击界面加载游戏</div>
            </div>
        `);
        this.root.$main_game.append(this.$audio);
        this.root.$main_game.append(this.$button);
        this.player = $("#audio")[0];
        this.start();
    }
    start() { 
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$button.click(function(){
            outer.$button.remove();
            outer.root.$main_game.append(outer.$audio);
            outer.root.$main_game.append(outer.$pro_bar);
            outer.player.play();
            outer.player.volume = 0.1;
        });
        this.$pro_bar.mouseover(function(){
            while (outer.player.currentTime > 8) {
                outer.$pro_bar.remove();
                outer.root.menu.show();
                return;
            }
        });
    }
}
