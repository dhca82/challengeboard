using System.Collections.Generic;

namespace ChallengeBoard.Web.Controllers {
    public class Board {        
        public Board() {
            CompletedCards = new List<string>();
        }
        public string Id { get; set; }
        public string BoardLayoutId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string BoardName { get; set; }
        public bool IsPublic { get; set; }
        public List<string> CompletedCards { get; set; }
    }
}