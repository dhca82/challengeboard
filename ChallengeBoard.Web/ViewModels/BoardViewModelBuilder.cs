using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChallengeBoard.Web.Extensions;
using ChallengeBoard.Web.Indexes;
using ChallengeBoard.Web.Models;
using Raven.Client;
using Raven.Client.Linq;

namespace ChallengeBoard.Web.ViewModels {
    public static class BoardViewModelBuilder {
        public static BoardViewModel Build(IDocumentSession ravenSession, Board board, User user) {

            var challenges = board.Challenges?.OrderByDescending(m => m.Text).ToList(); //ravenSession.Query<Card>().OrderByDescending(m => m.Text).ToList();

            var model = new BoardViewModel {
                Challenges = challenges?.Where(m => m.Hide == false).ToList() ?? new List<Card>(),
                TotalPoints = challenges?.Sum(x => x.NumberOfCompletions(user) * x.Points) ?? 0,
                CurrentUser = user,
                IsAuthenticated = HttpContext.Current.User.Identity.Name == user.UserName,
                History = ravenSession.Query<Feed, Feed_FeedViewModel>()                
                    .ProjectFromIndexFieldsInto<FeedViewModel>()
                    .Where(x => x.UserId == user.Id)
                    .OrderByDescending(m => m.TimeStamp)
                    .ToList()
            };
            return model;
        }
    }
}