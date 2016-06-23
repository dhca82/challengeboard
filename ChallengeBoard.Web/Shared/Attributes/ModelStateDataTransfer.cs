using System.Web.Mvc;

namespace ChallengeBoard.Web.Shared.Attributes {
    public abstract class ModelStateTempDataTransfer : ActionFilterAttribute {
        protected static readonly string Key = typeof(ModelStateTempDataTransfer).FullName;
    }
}