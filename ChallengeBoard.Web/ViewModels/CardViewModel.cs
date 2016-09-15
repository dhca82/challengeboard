using ChallengeBoard.Web.Models;

namespace ChallengeBoard.Web.ViewModels {
    public class CardViewModel {
        public Card Card { get; set; }
        public bool Selected { get; set; }
        public int NumberOfCompletions { get; set; }
    }
}