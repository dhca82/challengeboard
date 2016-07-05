using System.Linq;
using ChallengeBoard.Web.Controllers;
using Raven.Client.Indexes;

namespace ChallengeBoard.Web.ViewModels {
    public class BoardViewModelTransformer : AbstractTransformerCreationTask<Board> {
        public BoardViewModelTransformer() {
            TransformResults = boards =>
                from board in boards
                let definition = LoadDocument<BoardDefinition>(board.BoardDefinitionId) 
                let completedCards = definition.Cards.Where(x => board.BoardActivityList.Any(a => a.CardId == x.Id))
                select new BoardViewModel {
                    Board = board,
                    UserName = board.UserName,
                    BoardName = board.BoardName,
                    TotalPoints = completedCards.Sum(card => card.Points * board.BoardActivityList.Count(x => x.CardId == card.Id)),
                    Cards = definition.Cards.Where(card => card.Hide == false).Select(card => new CardViewModel {
                        Card = card,
                        Selected = completedCards.Contains(card),
                        NumberOfCompletions = board.BoardActivityList.Count(x => x.CardId == card.Id)
                    }).ToList()
                };
        }
    }
}