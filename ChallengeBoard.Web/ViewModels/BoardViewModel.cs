using System.Collections.Generic;
using ChallengeBoard.Web.Models;

namespace ChallengeBoard.Web.ViewModels {
    public class BoardViewModel {
        public List<Card> Challenges { get; set; }
        public User CurrentUser { get; set; }
        public int TotalPoints { get; set; }
        public bool IsAuthenticated { get; set; }
        public List<FeedViewModel> History { get; set; }
    }
}