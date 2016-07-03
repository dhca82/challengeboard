using System.Collections.Generic;

namespace ChallengeBoard.Web.Controllers {
    public class BoardViewModel {        
        public string Name { get; set; }
        public string UserName { get; set; }
        public int TotalPoints { get; set; }
        public bool IsPublic { get; set; }
        public List<CardViewModel> Cards { get; set; }
        public bool IsAuthenticated { get; set; }
    }
}