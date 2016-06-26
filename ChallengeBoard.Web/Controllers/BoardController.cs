using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Security.Policy;
using System.Web.Mvc;
using ChallengeBoard.Web.Extensions;
using ChallengeBoard.Web.Indexes;
using ChallengeBoard.Web.Models;
using ChallengeBoard.Web.ViewModels;
using ChallengeBoard.Web.Shared.Attributes;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Raven.Client;
using Raven.Client.Indexes;
using Raven.Client.Linq;


namespace ChallengeBoard.Web.Controllers {





    //public class Board_Name : AbstractIndexCreationTask<Board> {
    //    public Board_Name() {
    //        Map = boards =>
    //            from board in boards
    //            select new {
    //                Name = board.Name,
    //                Users = board.Users.SelectMany(x => x.UserName)
    //            };
    //    }
    //}

    public class BoardViewModel {        
        public string Name { get; set; }
        public string UserName { get; set; }
        public int TotalPoints { get; set; }
        public List<CardViewModel> Cards { get; set; }
    }

    public class CardViewModel {
        public string Id { get; set; }
        public string Text { get; set; }
        public int Points { get; set; }
        public bool Selected { get; set; }
    }

    public class Board {        
        public Board() {
            CompletedCards = new List<string>();
        }
        public string BoardLayoutId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string BoardName { get; set; }
        public List<string> CompletedCards { get; set; }
    }

    public class BoardDefinition {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<Card> Cards { get; set; }
    }

    public class BoardViewModelTransformer : AbstractTransformerCreationTask<Board> {
        public BoardViewModelTransformer() {
            TransformResults = boards =>
                from board in boards
                //let user = LoadDocument<User>(board.UserId) 
                let definition = LoadDocument<BoardDefinition>(board.BoardLayoutId)               
                select new BoardViewModel {
                    Name = definition.Name,
                    UserName = board.UserName,
                    Cards = definition.Cards.Select(x => new CardViewModel {
                        Text = x.Text,
                        Selected = board.CompletedCards.Contains(x.Id),
                        Points = x.Points
                    }).ToList()
                };
        }
    }


    public class BoardController : RavenSessionController {

        [ImportModelStateFromTempData]
        public ActionResult Index(string boardName, string userName) {

            //var challenges = new List<Card> {new Card {Text = "Spring 10 km", Category = Category.Health}};
            //var newboard = new Board {
            //    Name = "meridium",
            //    Cards = challenges
            //};
            //RavenSession.Store(newboard);


            var viewmodel = RavenSession
                .Query<Board>()
                .TransformWith<BoardViewModelTransformer, BoardViewModel>()
                .FirstOrDefault(x => x.UserName == userName && x.Name == boardName);


            
            

            //.Customize(x => x.Include<User>(u => u.UserName))


                //
                //.ToList();


            //var board = RavenSession.Query<Board>().FirstOrDefault(x => x.Name == boardName);

            //if (board == null) {
            //    return View("Register", new RegisterViewModel() { BoardName = boardName }); //TODO
            //}

            //var user = GetUser(userName);

            //if (user.IsPublic == false && HttpContext.User.Identity.IsAuthenticated == false) {
            //    return RedirectToAction("Index", "SignIn");
            //}
            
            //var model = BoardViewModelBuilder.Build(RavenSession, board, user);
            //return View("Index", model);
            return new EmptyResult();
   

        }

        //[ImportModelStateFromTempData]
        //public ActionResult Index(string userName) {
        //    var user = GetUser(userName);

        //    if (user == null) return View("Register", new RegisterViewModel {UserName = userName.ToLower()});

        //    if (user.IsPublic == false && HttpContext.User.Identity.IsAuthenticated == false) {
        //        return RedirectToAction("Index", "SignIn");
        //    }

        //    var model = BoardViewModelBuilder.Build(RavenSession, user);
        //    return View("Index", model);
            
        //}

        private User GetUser(string userName) {
            if (CurrentUser != null && CurrentUser.UserName == userName) {
                return CurrentUser;
            }            
            return RavenSession.Query<User>().FirstOrDefault(x => x.UserName == userName.ToLower());
        }

        [HttpPost]
        public ActionResult ToggleChallenge(string id, string currentUser, bool single) {
            if (HttpContext.User.Identity.Name != currentUser) {
                return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
            }
            if (single) {
                CurrentUser.CompletedChallenges.Toggle(id);
            }
            else {
                CurrentUser.CompletedChallenges.Add(id);
            }

            RavenSession.Store(CurrentUser);

            UpdateFeed(CurrentUser, id);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        private void UpdateFeed(User user, string id) {
            var feedEntry = new Feed {
                UserId = user.Id,
                TimeStamp = DateTime.Now,
                ChallengeId = id
            };
            RavenSession.Store(feedEntry);
        }

        [HttpPost]
        public ActionResult ToggleChallengeSubtract(string id, string currentUser) {            
            if (HttpContext.User.Identity.Name != currentUser) {
                return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
            }
            CurrentUser.CompletedChallenges.Remove(id);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ExportModelStateToTempData]
        public ActionResult Register(RegisterViewModel model) {
            if (!ModelState.IsValid) return RedirectToAction("Index", new { boardName = model.BoardName });
            
            var user = new User {
                Email = model.Email,
                UserName = model.UserName,
                IsPublic = true, 
                Name = model.Name,
                Boards = new List<string> { model.BoardName }
            };

            RavenSession.Store(user);

            var result = UserManager.Create(user, model.Password);

            if (result.Succeeded == false) {
                ModelState.AddModelError("Email", "E-postadressen används redan");
                return RedirectToAction("Index", new { boardName = model.BoardName });
            }


            var board = new Board {
                Name = model.BoardName,
                Users = new List<string> { model.UserName }
            };
            RavenSession.Store(board);

            RavenSession.SaveChanges();
            SignInManager.SignIn(user, isPersistent: false, rememberBrowser: false);

            return RedirectToAction("Index", "Board", new { boardName = board.Name, userName = user.UserName });
        }
    }
}