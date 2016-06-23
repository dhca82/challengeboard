using System.Collections.Generic;

namespace ChallengeBoard.Web.Extensions {
    public static class ListToggleExtension {
        public static void Toggle(this List<string> list, string id) {
            if (list == null) {
                return;
            }
            if (list.Contains(id)) {
                list.Remove(id);
            }
            else {
                list.Add(id);
            }
        }
 
    }
}