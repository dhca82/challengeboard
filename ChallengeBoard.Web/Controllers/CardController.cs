using System;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace ChallengeBoard.Web.Controllers {
    public class CardController : RavenSessionController {

        [HttpPost]
        public ActionResult ToggleChallenge(string id, string currentUser, bool single, string boardName, int count) {
            if (HttpContext.User.Identity.Name != currentUser) return new HttpStatusCodeResult(HttpStatusCode.Forbidden);

            var board = RavenSession
                .Query<Board>()
                .FirstOrDefault(x => x.UserName == currentUser && x.BoardName == boardName);

            if (board == null) return new HttpStatusCodeResult(HttpStatusCode.NotFound);

            var definition = RavenSession.Load<BoardDefinition>(board.BoardDefinitionId);

            if (definition == null) return new HttpStatusCodeResult(HttpStatusCode.NotFound);

            var activityName = definition.Cards.FirstOrDefault(x => x.Id == id)?.Text;

            UpdateCompletedCards(single, board, id, count, activityName);
            RavenSession.Store(board);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        private static void UpdateCompletedCards(bool disallowMultiple, Board board, string id, int count, string activityName) {
            if (disallowMultiple) {
                var activity = board.BoardActivityList.FirstOrDefault(x => x.CardId == id);
                if (activity != null) {
                    board.BoardActivityList.Remove(activity);
                    return;
                }
                activity = new Activity {
                    CardId = id,
                    TimeStamp = DateTime.Now,
                    Name = activityName
                };
                board.BoardActivityList.Add(activity);
            }
            else if (count > 0) {
                var activity = new Activity {
                    CardId = id,
                    TimeStamp = DateTime.Now,
                    Name = activityName
                };
                for (var i = 0; i < count; i++) {
                    board.BoardActivityList.Add(activity);
                }
            }
            else {
                var itemsToRemove = board.BoardActivityList.Where(x => x.CardId == id).OrderByDescending(x => x.TimeStamp).Take(count * -1).ToList();
                foreach (var item in itemsToRemove) {
                    board.BoardActivityList.Remove(item);
                }
            }
        }
    }
}