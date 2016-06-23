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

            var user = UserManager.FindByEmail(model.Email);

            if (UserManager.CheckPassword(user, model.Password)) {
                SignInManager.SignIn(user, false, false);
                return RedirectToAction("Index", "Board", new { boardName = user.DefaultBoard, userName = user.UserName });
            }
            
            return RedirectToAction("Index");
        }
    }
}