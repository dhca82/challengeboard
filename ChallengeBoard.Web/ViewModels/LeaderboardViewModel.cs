using System.Collections.Generic;
using ChallengeBoard.Web.Controllers;

namespace ChallengeBoard.Web.ViewModels {
    public class LeaderboardViewModel {
        public List<UserWithTotalPoints> Users { get; set; }
    }
}