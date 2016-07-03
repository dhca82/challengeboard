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
using Raven.Client.Linq;


namespace ChallengeBoard.Web.Controllers {
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

            if (viewmodel == null) {
                return View("Register", new RegisterViewModel() { BoardName = boardName }); //TODO
            }

            viewmodel.IsAuthenticated = userName == HttpContext.User.Identity.Name && HttpContext.User.Identity.IsAuthenticated;

            if (viewmodel.IsPublic == false && viewmodel.IsAuthenticated) {
                return RedirectToAction("Index", "SignIn");
            }
            
            return View("Index", viewmodel);
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
                BoardName = model.BoardName,
                UserName = model.UserName,
                UserId = user.Id
            };
            RavenSession.Store(board);

            RavenSession.SaveChanges();
            SignInManager.SignIn(user, isPersistent: false, rememberBrowser: false);

            return RedirectToAction("Index", "Board", new { boardName = board.BoardName, userName = user.UserName });
        }
    }
}