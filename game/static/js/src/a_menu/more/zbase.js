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
                    声音设置
                </div>
                <div class="game-menu-field-item game-menu-field-item-back">
                    返回
                </div>
            </div>
            <div class="score-list">
                <div class="score-list-title">汉字风云榜</div>
                <div class="score-list-every"></div>
                <div class="score-list-prev score-list-button">上一页</div>
                <div class="score-list-back score-list-button">返回</div>
                <div class="score-list-next score-list-button">下一页</div>
            </div>
        </div>
            `);
        this.$more.append(this.$list_field);
        this.$list_field = this.$more.find('.score-list');
        this.$list_field.hide();
        this.root.$main_game.append(this.$more);
        this.$field = this.$more.find('.game-menu-field');
        this.$list = this.$more.find('.game-menu-field-item-list');
        this.$remove = this.$more.find('.game-menu-field-item-remove');
        this.$more_back = this.$more.find('.game-menu-field-item-back');
        this.$close = this.$more.find('.game-menu-field-item-audio');
        this.$List = this.$more.find('.score-list-every');
        this.$list_back = this.$more.find('.score-list-back');
        this.$prev = this.$more.find('.score-list-prev');
        this.$next = this.$more.find('.score-list-next');
        this.$audio = $("#back_audio")[0];
        this.start();
    }
    start() {
        this.add_listening_events();
    }

    ShowList() {
        let outer = this;
        $.ajax({
            url: "http://8.130.98.108/settings/getallInfo/",
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
        this.$list_field.show();
        for (var i = 0; i < this.names.length; i++) {
            var name = this.names[i];
            var $item = $(
                `<div class="list-item">
                    <span class="list-item-num list-item-every">${i + 1}</span> 
                    <span class="list-item-name list-item-every">${name}</span>
                    <span class="list-item-score list-item-every">${this.plays[name]}</span>
                </div>`
            );
            this.$List.append($item);
        }
        this.list_items = outer.$List.children();
        this.list_ct = this.list_items.length;
        this.$List.empty();
        for (var i=0; i<8; i++) {
            this.$List.append(this.list_items[i]);
        }
        this.add_listening_events_back(8);
    }

    add_listening_events() {
        let outer = this;
        this.$list.click(function () {
            outer.ShowList();
            return;
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
        this.$more_back.click(function () {
            outer.$more.remove();
            outer.root.menu.show();
        });
    }

    add_listening_events_back(k) {
        let outer = this;
        let j = 1;
        this.$prev.click(function () {
            console.log(j);
            if (j === 0) return;
            outer.$List.empty();
            for (let i=k*(j-1); i < Math.min(outer.list_ct, k*j); i++) {
                console.log(`i==${i}`);
                outer.$List.append(outer.list_items[i]);
            }
            j --;
        });
        this.$next.click(function () {
            if (k*j >= outer.list_ct) return;
            outer.$List.empty();
            for (let i=k*j; i < Math.max(outer.list_ct, k*(j+1)); i++) {
                outer.$List.append(outer.list_items[i]);
            }
            j ++;
        });
        this.$list_back.click(function () {
            outer.$List.empty();
            outer.$list_field.hide();
            outer.$field.show();
        });
    }
}


