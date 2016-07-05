class ChallengeCards {
    constructor(user) {
        this.user = user;
        this.registerClickEvent();
    }
    registerClickEvent() {
        var self = this;
        var cards = document.getElementsByClassName("card");        
        for (var i = 0; i < cards.length; i++) {
            (function() {
                cards[i].addEventListener("click", function(e) {
                    e.preventDefault();

                    self.updateChallengeCard(this);
                    self.updateChallengeOnServer(this, 1);

                });
                var card = cards[i];
                var count = cards[i].getElementsByClassName('card-count--subtr');
                if(count.length == 0)
                    return;

                count[0].addEventListener("click", function(e) {
                    
                    e.preventDefault();
                    e.stopPropagation();

                    self.updateChallengeCardSubtract(card);
                    self.updateChallengeOnServer(card, -1);
                });
            }());
        }
    }
    updateChallengeCard(card) {
        
        var cardIsMarkedAsComplete = card.classList.contains("card--complete");
        var cardIsSingleOnly = card.classList.contains("card--single");
        var points = card.getAttribute('data-points');

        if (cardIsMarkedAsComplete && cardIsSingleOnly) {
            points = points * -1;
            card.classList.remove("card--complete"); 
        } else {
            card.classList.add("card--complete"); 
            if(!cardIsSingleOnly) {
                var currentCount = card.getElementsByClassName('card-count--number')[0];
                currentCount.textContent = parseInt(currentCount.textContent) + 1;
            }
        }        

        var event = new CustomEvent("challengeCardSaved", { "detail": points });
        document.dispatchEvent(event);
    }
    updateChallengeCardSubtract(card) {
        var cardIsMarkedAsComplete = card.classList.contains("card--complete");
        
        var points = card.getAttribute('data-points');
        //if (cardIsMarkedAsComplete) {
            points = points * -1;
        //} else {
            //card.classList.add("card--complete");
        //}
        console.log(card);
        var currentCount = card.getElementsByClassName('card-count--number')[0];
        currentCount.textContent = parseInt(currentCount.textContent) - 1;
        var event = new CustomEvent("challengeCardSaved", { "detail": points });
        document.dispatchEvent(event);
    }
    updateChallengeOnServer(card, count) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/board/togglechallenge');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status !== 200) {
                //Something went wrong message.
                // return to login form
                var username = document.getElementById("user-hide").textContent;
                window.location.href = "/signin";
                return;
            }             
        };
        xhr.send(JSON.stringify({ 
            id: card.dataset.id,
            currentUser: this.user,
            boardName: document.getElementById("Cards").dataset.board,
            single: card.classList.contains("card--single"),
            count: count
        }));
    }
}
module.exports = ChallengeCards;