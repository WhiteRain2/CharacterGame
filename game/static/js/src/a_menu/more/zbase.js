class More {
    constructor(root) {
        this.root = root;
        this.$more = $(`
        <div class="game-menu">
           <div class="game-menu-field">
                <div class="game-menu-field-item game-menu-field-item-list">
                    排行榜
                </div>
                <br>
                <div class="game-menu-field-item game-menu-field-item-remove">
                    退出登录
                </div>
                <br>
                <div class="game-menu-field-item game-menu-field-item-audio">
                    开/关声音
                </div>
            </div>
        </div>
        `);
        this.root.$main_game.append(this.$more);
        this.$field = this.$more.find('.game-menu-field');
        this.$list = this.$more.find('.game-menu-field-item-list');
        this.$remove = this.$more.find('.game-menu-field-item-remove');
        this.$close = this.$more.find('.game-menu-field-item-audio');
        this.$audio = $("#back_audio")[0];
        this.start();
    }
    start() {
        this.add_listening_events();
    }

    ShowList() {
        let outer = this;
        $.ajax({
            url: "http://172.16.0.3:8000/settings/getallInfo/",
            type: "GET",
            success: function (resp) {
                outer.plays = resp.result;
            }
        });
        if (!this.plays) return;
        this.names = Object.keys(outer.plays).sort(function (a, b) {
            return outer.plays[b] - outer.plays[a];
        });
        this.$field.hide();
        this.$list_field = $(`
    <div class="list"></div>
    <div class="list_button">返回</div>
        `);
        this.$more.append(this.$list_field);
        this.$list = this.$list_field.find('.list');
        for (var i in this.names) {
            var $item = $(`<div class="list-item">${i + 1} ${player} ${this.plays[player]}</div>`);
            this.$list.append($item);
        }
    }

    add_listening_events() {
        let outer = this;
        this.$list.click(function () {
            outer.ShowList();
        });
        this.$remove.click(function () {
            outer.root.settings.logout_on_remote();
        });
        this.$close.click(function () {
            if (!outer.$audio.paused) {
                outer.$audio.pause();
            }
            else {
                outer.$audio.play();
            }
        });
    }
}


