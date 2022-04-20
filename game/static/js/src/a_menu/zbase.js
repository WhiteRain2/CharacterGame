class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="game-menu">
    <audio class="game-menu-audio" id="menu_audio" autoplay="autoplay" src="http://music.163.com/song/media/outer/url?id=1853863650.mp3"></audio>
    <div class="game-menu-field">
        <div class="game-menu-field-item game-menu-field-item-pass-mode">
            关卡模式
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-grade-mode">
            积分模式
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-explain">
            游戏说明
        </div>
    </div>
</div>
`);
        this.root.$main_game.append(this.$menu);
        this.$pass_mode = this.$menu.find('.game-menu-field-item-pass-mode');
        this.$grade_mode = this.$menu.find('.game-menu-field-item-grade-mode');
        this.$explain = this.$menu.find('.game-menu-field-item-explain');
        this.menu_audio = $('#menu_audio')[0];
        this.menu_audio.volume = 0.1;
        this.src = false;
        this.start();
    }

    start() {
        this.add_listening_events();
    }



   add_listening_events() {
        let outer = this;
       this.$menu.click(function() {
           if (!outer.src) {
               outer.menu_audio.volume = 0.1;
               outer.menu_audio.play();
               outer.src = true;
           }
       });
       this.$pass_mode.click(function(){
           outer.hide();
           outer.pass_menu = new PassMode(outer);
       });
       this.$grade_mode.click(function(){
           outer.hide();
           outer.root.playground.show("grade");
       });
       this.$explain.click(function(){
           console.log('YES');
           // outer.root.settings.logout_on_remote();
       });
   }

    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}

