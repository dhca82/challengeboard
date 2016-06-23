using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using RavenDB.AspNet.Identity;

namespace ChallengeBoard.Web.Models {
    public class User : IdentityUser {
        public User() {
            CompletedChallenges = new List<string>();
        }    
        public bool IsPublic { get; set; }
        public List<string> CompletedChallenges { get; set; }
        public string Name { get; set; }
        public string DefaultBoard { get; set; }

        public List<string> Boards { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User> manager) {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }
}