using System.Linq;
using Raven.Client.Indexes;

namespace ChallengeBoard.Web.Controllers {
    public class BoardViewModelTransformer : AbstractTransformerCreationTask<Board> {
        public BoardViewModelTransformer() {
            TransformResults = boards =>
                from board in boards
                let definition = LoadDocument<BoardDefinition>(board.BoardLayoutId) 
                let completedCards = definition.Cards.Where(x => board.CompletedCards.Contains(x.Id))
                select new BoardViewModel {
                    Name = definition.Name,
                    UserName = board.UserName,
                    TotalPoints = completedCards.Sum(x => x.Points),
                    IsPublic = board.IsPublic,
                    Cards = definition.Cards.Select(x => new CardViewModel {
                        Id = x.Id,
                        Text = x.Text,
                        Points = x.Points,                        
                        Category = x.Category,
                        Hide = x.Hide,
                        Single = x.Single,
                        Selected = completedCards.Contains(x)
                    }).ToList()
                };
        }
    }
}