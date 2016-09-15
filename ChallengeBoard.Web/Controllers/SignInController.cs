using System.Linq;
using System.Web.Mvc;
using ChallengeBoard.Web.Models;
using ChallengeBoard.Web.Shared.Attributes;
using ChallengeBoard.Web.ViewModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace ChallengeBoard.Web.Controllers {
    public class SignInController : RavenSessionController {

        [ImportModelStateFromTempData]
        public ActionResult Index() { 
            return View();
        }

        [ExportModelStateToTempData]
        public ActionResult SignIn(SignInViewModel model) {
            User user;
            var success = model.UserNameOrEmail.Contains("@") ? 
                TrySignInWithEmail(model.UserNameOrEmail, model.Password, out user) : 
                TrySignInWithUserName(model.UserNameOrEmail, model.Password, out user);            
                      
            if (success) return RedirectToAction("Index", "Board", new { boardName = user.DefaultBoard, userName = user.UserName });

            ModelState.AddModelError("Password", "Felaktigt användarnamn eller lösenord");
            return RedirectToAction("Index");
        }

        private bool TrySignInWithUserName(string username, string password, out User user) {
            //user = UserManager.FindByName(username);
            //var success = SignInManager.PasswordSignIn(username, password, false, false) == SignInStatus.Success;
            user = RavenSession.Query<User>().FirstOrDefault(x => x.UserName == username);
            if (user == null || UserManager.CheckPassword(user, password) == false) {
                user = null;
                return false;
            }
            SignInManager.SignIn(user, false, false);
            return true;
        }

        private bool TrySignInWithEmail(string email, string password, out User user) {
            user = UserManager.FindByEmail(email);
            if (!UserManager.CheckPassword(user, password)) {
                user = null;
                return false;
            }
            SignInManager.SignIn(user, false, false);
            return true;
        }
    }
}