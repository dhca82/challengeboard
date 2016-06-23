class UserInfo {
    constructor(user) {
        this.user = user;        
    }
    init() {
        this.registerEvents();
    }
    registerEvents() {
        var event = new Event("challengeCardSaved");
        document.addEventListener("challengeCardSaved", event => this.updateProgressBar(event.detail));
    }
   
    updateProgressBar(points) {
        console.log(points);
        var scoreboard = document.getElementById('intro-score');
        var currentPoints = parseInt(scoreboard.textContent);        
        var newScore = currentPoints + parseInt(points);
        scoreboard.textContent = newScore;            
    }
}
module.exports = UserInfo;