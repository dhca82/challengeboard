using System.Linq;
using System.Web.Mvc;
using ChallengeBoard.Web.Indexes;
using ChallengeBoard.Web.Models;
using ChallengeBoard.Web.ViewModels;
using Raven.Client;

namespace ChallengeBoard.Web.Controllers {
    public class LeaderboardController : RavenSessionController {
        [HttpPost]
        public ActionResult Index() {          
            var model = new LeaderboardViewModel {
                //Users = RavenSession.Query<User, User_TotalPoints>()
                //    .ProjectFromIndexFieldsInto<UserWithTotalPoints>()                    
                //    .OrderByDescending(x => x.TotalPoints)
                //    .Take(10)
                //    .ToList()
            };
            return PartialView(model);
        }     
    }

    public class UserWithTotalPoints : User {
        public int TotalPoints { get; set; }
    }
}
