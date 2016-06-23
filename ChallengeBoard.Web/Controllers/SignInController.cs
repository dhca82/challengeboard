using System.Web.Mvc;
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
            var success = model.UserNameOrEmail.Contains("@") ? 
                SignInWithEmail(model.UserNameOrEmail, model.Password) : 
                SignInWithUserName(model.UserNameOrEmail, model.Password);

            if (success) return RedirectToAction("Index", "Board", new { boardName = CurrentUser.DefaultBoard, userName = CurrentUser.UserName });

            ModelState.AddModelError("Password", "Felaktigt användarnamn eller lösenord");
            return RedirectToAction("Index");
        }

        private bool SignInWithUserName(string username, string password) {
            return SignInManager.PasswordSignIn(username, password, false, false) == SignInStatus.Success;
        }

        private bool SignInWithEmail(string email, string password) {
            var user = UserManager.FindByEmail(email);
            if (!UserManager.CheckPassword(user, password)) return false;
            SignInManager.SignIn(user, false, false);
            return true;
        }
    }
}