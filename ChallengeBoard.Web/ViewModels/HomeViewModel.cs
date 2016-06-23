using System.ComponentModel.DataAnnotations;

namespace ChallengeBoard.Web.ViewModels {
    public class HomeViewModel {
        [Required(ErrorMessage = "Ange ett namn")]
        [RegularExpression("^[a-z0-9-]+$", ErrorMessage = "Namnet får endast innehålla bokstäver, siffror och \"-\"")]
        public string BoardName { get; set; }
    }
}



