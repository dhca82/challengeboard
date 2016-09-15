using System.Linq;
using ChallengeBoard.Web.Controllers;
using ChallengeBoard.Web.Models;
using Raven.Client.Indexes;

namespace ChallengeBoard.Web.ViewModels {
    public class LeaderboardViewModelTransformer : AbstractTransformerCreationTask<Board> {
        public LeaderboardViewModelTransformer() {
            TransformResults = boards =>                
                from board in boards
                let user = LoadDocument<User>(board.UserId)
                let definition = LoadDocument<BoardDefinition>(board.BoardDefinitionId)
                let completedCards = definition.Cards.Where(x => board.BoardActivityList.Any(a => a.CardId == x.Id))
                select new LeaderboardViewModel.Item {
                    DisplayName = user.Name,
                    Points = completedCards.Sum(card => card.Points * board.BoardActivityList.Count(x => x.CardId == card.Id))                    
                };
        }
    }
}