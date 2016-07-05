using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
        public ActionResult ToggleChallenge(string id, string currentUser, bool single, string boardName, int count) {
            if (HttpContext.User.Identity.Name != currentUser) return new HttpStatusCodeResult(HttpStatusCode.Forbidden);

            var board = RavenSession
                .Query<Board>()
                .FirstOrDefault(x => x.UserName == currentUser && x.BoardName == boardName);

            if (board == null) return new HttpStatusCodeResult(HttpStatusCode.NotFound);

            var definition = RavenSession.Load<BoardDefinition>(board.BoardDefinitionId);

            if (definition == null) return new HttpStatusCodeResult(HttpStatusCode.NotFound);

            var activityName = definition.Cards.FirstOrDefault(x => x.Id == id)?.Text;

            UpdateCompletedCards(single, board, id, count, activityName);                                                               
            RavenSession.Store(board);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        private static void UpdateCompletedCards(bool disallowMultiple, Board board, string id, int count, string activityName) {
            if (disallowMultiple) {
                var activity = board.BoardActivityList.FirstOrDefault(x => x.CardId == id);
                if (activity != null) {
                    board.BoardActivityList.Remove(activity);
                    return;
                }
                activity = new Activity {
                    CardId = id,
                    TimeStamp = DateTime.Now,
                    Name = activityName
                };
                board.BoardActivityList.Add(activity);
            }
            else if (count > 0) {
                var activity = new Activity {
                    CardId = id,
                    TimeStamp = DateTime.Now,
                    Name = activityName
                };
                for (var i = 0; i < count; i++) {
                    board.BoardActivityList.Add(activity);
                }
            }
            else {                
                var itemsToRemove = board.BoardActivityList.Where(x => x.CardId == id).OrderByDescending(x => x.TimeStamp).Take(count*-1).ToList();
                foreach (var item in itemsToRemove) {
                    board.BoardActivityList.Remove(item);
                }                    
            }
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
                Boards = new List<string> { model.BoardName },
                DefaultBoard = model.BoardName
            };

            RavenSession.Store(user);

            var result = UserManager.Create(user, model.Password);

            if (result.Succeeded == false) {
                ModelState.AddModelError("Email", "E-postadressen används redan");
                return RedirectToAction("Index", new { boardName = model.BoardName });
            }

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

            RavenSession.SaveChanges();
            SignInManager.SignIn(user, isPersistent: false, rememberBrowser: false);

            return RedirectToAction("Index", "Board", new { boardName = model.BoardName, userName = user.UserName });
        }
    }
}