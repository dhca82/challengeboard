using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Autofac;
using ChallengeBoard.Web.Indexes;
using ChallengeBoard.Web.Models;
using MvcPWy;
using Raven.Client;
using Raven.Client.Document;
using Raven.Client.Indexes;

namespace ChallengeBoard.Web {
    public class MvcApplication : HttpApplication {
        public static DocumentStore Store;
        protected void Application_Start() {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            Store = new DocumentStore() { ConnectionStringName = "RavenDB" };
            Store.Initialize();
            var builder = new ContainerBuilder();

            //Store.Conventions.RegisterIdConvention<User>((dbname, commands, user) => "users/" + user.UserName);

            builder.Register(c => {
                var store = new DocumentStore {
                    ConnectionStringName = "RavenDB",
                    DefaultDatabase = "RavenDB"
                }.Initialize();

                return store;

            }).As<IDocumentStore>().SingleInstance();

            builder.Register(c => c.Resolve<IDocumentStore>().OpenAsyncSession()).As<IAsyncDocumentSession>().InstancePerLifetimeScope();

            //IndexCreation.CreateIndexes(typeof(User_TotalPoints).Assembly, Store);
            IndexCreation.CreateIndexes(typeof(BoardViewModelTransformer).Assembly, Store);
            IndexCreation.CreateIndexes(typeof(Board_Name).Assembly, Store);
            IndexCreation.CreateIndexes(typeof(Feed_FeedViewModel).Assembly, Store);
        }
    }
}
