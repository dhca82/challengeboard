using System.ComponentModel.DataAnnotations;

namespace ChallengeBoard.Web.ViewModels {
    public class RegisterViewModel {
        [Required]
        public string BoardName { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }
    }
}