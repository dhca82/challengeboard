using System.Collections.Generic;

namespace ChallengeBoard.Web.Models {


    public class DenormalizedUser {
        public string UserName { get; set; }
        public string Name { get; set; }
        public int TotalPoints { get; set; }
        public List<string> CompletedChallenges { get; set; } 
    }
}