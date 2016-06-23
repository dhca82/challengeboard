using System.Web;
using System.Web.Mvc;
using ChallengeBoard.Web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using MvcPWy;
using Raven.Client;

namespace ChallengeBoard.Web.Controllers {
    public class RavenSessionController : Controller {
        private ApplicationUserManager _userManager;
        public IDocumentSession RavenSession { get; protected set; }

        public RavenSessionController() {
                
        }

        public RavenSessionController(ApplicationUserManager userManager) {
            UserManager = userManager;
        }

        public ApplicationUserManager UserManager {
            get {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set {
                _userManager = value;
            }
        }

        private ApplicationSignInManager _signInManager;
        private User _currentUser;

        public ApplicationSignInManager SignInManager {
            get {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set { _signInManager = value; }
        }

        public User CurrentUser {
            get {
                if(_currentUser != null) return _currentUser;
                var userid = System.Web.HttpContext.Current.User.Identity.GetUserId();
                _currentUser = userid == null ? null : UserManager.FindById(userid);
                return _currentUser;
            }
            private set { _currentUser = value; }
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext) {
            RavenSession = MvcApplication.Store.OpenSession();
        }

        protected override void OnActionExecuted(ActionExecutedContext filterContext) {
            if (filterContext.IsChildAction) return;
            using (RavenSession) {
                if (filterContext.Exception != null) return;
                if (RavenSession != null) {
                    RavenSession.SaveChanges();
                }                    
            }
        }
    }
}
