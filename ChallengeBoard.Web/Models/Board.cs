using System;
using System.Collections.Generic;

namespace ChallengeBoard.Web.Controllers {
    public class Board {        
        public Board() {
            BoardActivityList = new List<Activity>();
        }
        public string Id { get; set; }
        public string BoardDefinitionId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }      
        public string BoardName { get; set; }  
        public bool IsPublic { get; set; }
        public List<Activity> BoardActivityList { get; set; }
    }

    public class Activity {
        public string CardId { get; set; }
        public string Name { get; set; }
        public string Points { get; set; }
        public DateTime TimeStamp { get; set; }
    }

}