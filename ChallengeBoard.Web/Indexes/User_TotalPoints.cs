using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Security.Policy;
using System.Web.Mvc;
using ChallengeBoard.Web.Controllers;
using ChallengeBoard.Web.Models;
using Raven.Abstractions.Indexing;
using Raven.Client;
using Raven.Client.Indexes;
using Raven.Client.Linq;

namespace ChallengeBoard.Web.Indexes {


 



 

 

    public class UserNameTransformer : AbstractTransformerCreationTask<User> {
        public class Result {
            public string UserName;
        }
        public UserNameTransformer() {
            TransformResults = users => from user in users                                        
                                        select new Result {                                             
                                            UserName = user.UserName,     
                                        };
        }
    }

    public class RavenTest : RavenSessionController {
        public ActionResult Index(string username, string boardname) {
            var board = RavenSession.Query<Board>()
                        .Where(x => x.Users.Contains(username))
                        .TransformWith<BoardViewModelTransformer, BoardViewModel>()
                        .FirstOrDefault(x => x.Name == boardname);




            return View();
        }
    }








    //public class User_TotalPoints : AbstractIndexCreationTask<User, User_TotalPoints.Result> {
    //    public class Result {
    //        public int TotalPoints { get; set; }
    //    }
    //    public User_TotalPoints() {
    //        Map = users =>
    //            from user in users
    //            where user.IsPublic
    //            select new {
    //                TotalPoints = user.CompletedChallenges.Sum(x => LoadDocument<Card>(x).Points)
    //            };
    //        Stores.Add(x => x.TotalPoints, FieldStorage.Yes);
    //    }
    //}
}