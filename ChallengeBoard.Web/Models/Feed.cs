using System;

namespace ChallengeBoard.Web.Models {
    public class Feed {
        public string UserId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string ChallengeId { get; set; }
    }

    public class FeedViewModel {
        public DateTime TimeStamp { get; set; }
        public string Challenge { get; set; }
        public string UserId { get; set; }
    }
}