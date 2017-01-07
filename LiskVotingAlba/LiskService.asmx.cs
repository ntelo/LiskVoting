
using LiskApiWrapper;
using LiskApiWrapper.Contracts;
//using LiskSqlDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

namespace aurelia_vs_ts
{
    /// <summary>
    /// Summary description for LiskService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [ScriptService]
    public class LiskService : System.Web.Services.WebService
    {
      

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public LiskAccount GetAccount(string address)
        {
            LiskApi api = new LiskApi();
            return api.GetAccount(address);
        }

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public LiskDelegates GetVotedDelegates(string address)
        {
            LiskApi api = new LiskApi();
            return api.GetVotedDelegates(address);
        }

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<Contracts> GetTopForgers()
        {
            LiskApi api = new LiskApi();
            return api.GetTop10ForgersBlockers();
        }

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<Contracts> GetTopMissedBlockers()
        {
            LiskApi api = new LiskApi();
            return api.GetTopMissedBlockers();
        }

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<Contracts> GetTop25MissersInstantStats24h()
        {
            
            LiskApi api = new LiskApi();
            return api.GetTop25MissersInstantStats24h();
        }

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<Contracts> GetTop25ForgersInstantStats24h()
        {
            LiskApi api = new LiskApi();
            return api.GetTop25ForgersInstantStats24h();
        }

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<Contracts> GetInstantStats24h()
        {
            LiskApi api = new LiskApi();
            return api.GetInstantStats24h();
        }

        public class LiskVoterAccountExtended
        {
            public LiskAccount LiskAccount { get; set; }
            public List<VoterUsernameAccount> VotersInAcount { get; set; }
        }


        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<Peers> GetPeers()
        {
            LiskApi api = new LiskApi();
            return api.GetPeersView();
        }

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<PeerState> GetPeersStates()
        {
            LiskApi api = new LiskApi();
            return api.GetPeersStates();
        }



        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<PeersBlockx100> GetPeersBlockGroup()
        {
            LiskApi api = new LiskApi();
            return api.GetPeersBlockGroup();
        }


    

        [WebMethod, ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public List<Contracts> GetTop202Stats(string address)
        {
            LiskApi api = new LiskApi();
            return api.GetTop200(address).delegates;
        }
 

    }
}
