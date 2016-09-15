using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ChallengeBoard.Web.Models;
using ChallengeBoard.Web.ViewModels;
using ChallengeBoard.Web.Shared.Attributes;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace ChallengeBoard.Web.Controllers {
    public class BoardController : RavenSessionController {
        [ImportModelStateFromTempData]
        public ActionResult Index(string boardName, string userName) {

            var viewmodel = RavenSession
                .Query<Board>()
                .TransformWith<BoardViewModelTransformer, BoardViewModel>()
                .FirstOrDefault(x => x.UserName == userName && x.BoardName == boardName);

            if (viewmodel == null) {
                return View("Register", new RegisterViewModel() { BoardName = boardName }); //TODO
            }

            viewmodel.IsAuthenticated = userName == HttpContext.User.Identity.Name && HttpContext.User.Identity.IsAuthenticated;

            if (viewmodel.Board.IsPublic == false && viewmodel.IsAuthenticated) {
                return RedirectToAction("Index", "SignIn");
            }
            
            return View("Index", viewmodel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ExportModelStateToTempData]
        public ActionResult Register(RegisterViewModel model) {
            if (!ModelState.IsValid) return RedirectToAction("Index", new { boardName = model.BoardName });

            User user;           
            if (TryCreateAndStoreUser(model, out user) == false) {
                ModelState.AddModelError("Email", "E-postadressen används redan");
                return RedirectToAction("Index", new { boardName = model.BoardName });
            }

            CreateBoardAndDefinition(model, user);

            RavenSession.SaveChanges();
            SignInManager.SignIn(user, isPersistent: false, rememberBrowser: false);

            return RedirectToAction("Index", "Board", new { boardName = model.BoardName, userName = user.UserName });
        }

        private bool TryCreateAndStoreUser(RegisterViewModel model, out User user) {
            user = new User {
                Email = model.Email,
                UserName = model.UserName,
                IsPublic = true,
                Name = model.Name,
                Boards = new List<string> { model.BoardName },
                DefaultBoard = model.BoardName
            };

            RavenSession.Store(user);

            return UserManager.Create(user, model.Password).Succeeded;
        }

        private void CreateBoardAndDefinition(RegisterViewModel model, User user) {
            var exampleCard1 = new Card { Id = Guid.NewGuid().ToString(), Text = "Skapa en utmaningsbräda", Category = Category.Misc, Points = 1 };
            var exampleCard2 = new Card { Id = Guid.NewGuid().ToString(), Text = "Skapa din första utmaning", Category = Category.Health, Points = 1 };

            var boardDefinition = new BoardDefinition {
                Name = model.BoardName,
                Cards = new List<Card> {
                    exampleCard1, exampleCard2
                }
            };

            RavenSession.Store(boardDefinition);

            var board = new Board {
                BoardName = model.BoardName,
                BoardDefinitionId = boardDefinition.Id,
                UserName = model.UserName,
                UserId = user.Id,
                BoardActivityList = new List<Activity> { new Activity { CardId = exampleCard1.Id, Name = exampleCard1.Text, TimeStamp = DateTime.Now } },
                IsPublic = true
            };

            RavenSession.Store(board);
        }
    }
}