using System.Linq;
using ChallengeBoard.Web.Models;
using Raven.Abstractions.Indexing;
using Raven.Client.Indexes;

namespace ChallengeBoard.Web.Indexes {
    public class User_TotalPoints : AbstractIndexCreationTask<User, User_TotalPoints.Result> {
        public class Result {
            public int TotalPoints { get; set; }
        }
        public User_TotalPoints() {
            Map = users =>
                from user in users
                where user.IsPublic
                select new {
                    TotalPoints = user.CompletedChallenges.Sum(x => LoadDocument<Card>(x).Points)
                };
            Stores.Add(x => x.TotalPoints, FieldStorage.Yes);
        }
    }
}