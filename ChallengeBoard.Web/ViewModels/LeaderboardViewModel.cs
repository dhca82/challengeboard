using System.Collections.Generic;

namespace ChallengeBoard.Web.ViewModels {
    public class LeaderboardViewModel {
        public class Item {
            public string DisplayName { get; set; }
            public int Points { get; set; }
        }
        public List<Item> Items { get; set; }
    }
}