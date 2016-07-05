using System.Linq;
using System.Web.Mvc;
using ChallengeBoard.Web.ViewModels;
using Raven.Client.Linq;

namespace ChallengeBoard.Web.Controllers {
    public class LeaderboardController : RavenSessionController {
        [HttpPost]
        public ActionResult Index(string id) {
            var items = RavenSession
                .Query<Board>()
                .Where(x => x.Id == id && x.IsPublic)
                .TransformWith<LeaderboardViewModelTransformer, LeaderboardViewModel.Item>()
                .OrderByDescending(x => x.Points)
                .Take(10)
                .ToList();
            
            var model = new LeaderboardViewModel {
               Items = items
            };
            return PartialView(model);
        }
    }
}
