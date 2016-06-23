using System.Linq;
using ChallengeBoard.Web.Models;

namespace ChallengeBoard.Web.Extensions {
    public static class ChallengeNumberOfCompletionsExtension {
        public static int NumberOfCompletions(this Card challenge, User user) {
            var count = user.CompletedChallenges.Count(s => challenge.Id == s);
            return count;
        }
    }
}