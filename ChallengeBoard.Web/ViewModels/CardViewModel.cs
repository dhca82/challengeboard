using ChallengeBoard.Web.Models;

namespace ChallengeBoard.Web.Controllers {
    public class CardViewModel {
        public Card Card { get; set; }
        public bool Selected { get; set; }
        public int NumberOfCompletions { get; set; }
    }
}