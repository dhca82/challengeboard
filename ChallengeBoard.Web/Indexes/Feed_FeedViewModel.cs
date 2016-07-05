//using System.Linq;
//using ChallengeBoard.Web.Models;
//using Raven.Abstractions.Indexing;
//using Raven.Client.Indexes;

//namespace ChallengeBoard.Web.Indexes {
//    public class Feed_FeedViewModel : AbstractIndexCreationTask<Feed, FeedViewModel> {
//        public Feed_FeedViewModel() {
//            Map = items => from item in items
//                select new FeedViewModel {
//                    Challenge = LoadDocument<Card>(item.ChallengeId).Text,
//                    TimeStamp = item.TimeStamp,
//                    UserId = item.UserId,
//                };
//            Stores.Add(x => x.Challenge, FieldStorage.Yes);
//        }
//    }
//}