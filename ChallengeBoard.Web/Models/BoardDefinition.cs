using System.Collections.Generic;
using ChallengeBoard.Web.Models;

namespace ChallengeBoard.Web.Controllers {
    public class BoardDefinition {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<Card> Cards { get; set; }
    }
}