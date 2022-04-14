export class MainGame {
            constructor(id) {
                        this.id = id;
                        console.log('Succ');
                        this.$test = $(`
                        <h1>hahaha</h1>
                        <img src="../static/material/words/difficult/7/7.mp3"></img>
                        <audio controls src="../static/material/words/difficult/7/7.mp3"></audio>
                                `);
                this.$test.show();
                this.star();
             }
    star() {
    }
}
