class Explain {
    constructor(root) {
        this.root = root;
        this.$game_explain = $(`
<div class="game-explain">
    <div class="game-explain-frame">
        <div class="game-explain-frame-text">
            <p>
            中国汉字，博大精深，源远流长。
            炎黄子孙，华夏儿女，定当弘扬。
            </p>
            <p>
            汉字构造精巧，行美旨远，它的美，美在真情，美在精髓，美在风骨，美在形体。
            </p>
            <p>
            本游戏旨在让更多的人们认识到汉字的魅力，在趣味中认识汉字，学习汉字，弘扬汉字。弘扬中华文化之瑰宝，感悟中华民族之灵魂！
            </p>
            <p>
            本游戏适用人群：任何热爱中国汉字的人们！
            </p>
            <p>
            操作方式：鼠标左键控制毛笔移动，右键发射墨水。
            </p>
        </div>
    </div>
</div>
        `);
        this.root.$main_game.append(this.$game_explain);
        this.start();
    }
    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$game_explain.click(function(){
            outer.$game_explain.remove();
            outer.root.menu.show();
        });
    }
}


