using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Raven.Imports.Newtonsoft.Json;

namespace ChallengeBoard.Web.Models {
    public class Card {
        public string Id { get; set; }
        public string Text { get; set; }
        public int Points { get; set; }
        public Category? Category { get; set; }
        public bool Hide { get; set; }
        public bool Single { get; set; }
        [JsonIgnore]
        public IEnumerable<SelectListItem> Categories {
            get {
                var categories =
                    from l in (Category[])Enum.GetValues(typeof(Category))
                    select new { ID = (int)l, Name = l.ToString() };
                return new SelectList(categories, "ID", "Name", this.Category);
            }
        }
    }
}