using System.Collections.Generic;

namespace ChallengeBoard.Web.Models {
    public class Board {
        public string Name { get; set; }
        public List<Card> Challenges { get; set; } 
        public List<string> Users { get; set; } 
    }
}