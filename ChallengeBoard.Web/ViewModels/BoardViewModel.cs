using System.Collections.Generic;
using System.Security.Permissions;

namespace ChallengeBoard.Web.Controllers {
    public class BoardViewModel {   
        public string UserName { get; set; }
        public string BoardName { get; set; }
        public Board Board { get; set; }   
        public int TotalPoints { get; set; }        
        public List<CardViewModel> Cards { get; set; }
        public bool IsAuthenticated { get; set; }
    }
}