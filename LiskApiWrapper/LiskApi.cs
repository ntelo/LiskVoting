
using LiskApiWrapper.Contracts;
//using LiskSqlDatabase;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Data.Linq;

using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Npgsql;
using RestSharp;
using RestSharp.Authenticators;

namespace LiskApiWrapper
{
    //http://www.asp.net/web-api/overview/advanced/calling-a-web-api-from-a-net-client
    public class LiskApi
    {

         string baseUrl = ConfigurationManager.AppSettings["ApibaseUrl"].ToString();
        //ApibaseUrlssl
        string baseUrlssl = ConfigurationManager.AppSettings["ApibaseUrlssl"].ToString();

        string ParentNodeAccount = ConfigurationManager.AppSettings["ParentNodeAccount"].ToString();

       // string PosgresConnstring = ConfigurationManager.AppSettings["postgres"];
        public LiskDelegates GetVotedDelegates(string address)
        {

            string jsonResult;
            LiskDelegates result = new LiskDelegates();


            try
            {
                HttpWebRequest http = (HttpWebRequest)WebRequest.Create(baseUrl + string.Format("/api/accounts/delegates/?address={0}", address));
                http.Method = "GET";
                WebResponse response = http.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<LiskDelegates>(jsonResult);
            }
            catch (Exception ex)
            {
                //SendEmail("ERROR LiskApi GetVotedDelegates", "ntelo@hotmail.com", "ERROR LiskApi GetVotedDelegates" + ex.Message);
            }



            return result;


        }

        public LiskAccount GetAccount(string address)
        {
            string jsonResult;
            LiskAccount result = new LiskAccount();

            try
            {
                HttpWebRequest http = (HttpWebRequest)WebRequest.Create(baseUrl + string.Format("/api/accounts?address={0}", address));
                http.Method = "GET";
                WebResponse response = http.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<LiskAccount>(jsonResult);
            }
            catch(Exception ex)
            {
                result.account = new Account();

            }
 
            return result;
        }

        public BlockChainHeight GetBlockChainHeight(string baseUrl)
        {
            string jsonResult;
            BlockChainHeight result = new BlockChainHeight();
            if (!baseUrl.EndsWith("/"))
                baseUrl = baseUrl.Trim() + "/";

            try
            {
                HttpWebRequest http = (HttpWebRequest)WebRequest.Create(baseUrl + "api/blocks/getHeight");
                http.Method = "GET";
                WebResponse response = http.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<BlockChainHeight>(jsonResult);
            }
            catch(Exception ex)
            {
                //if (result == null)
                //    result = new BlockChainHeight();

                //SendEmail("ERROR LiskApi GetBlockChainHeight", "ntelo@hotmail.com", "ERROR LiskApi GetBlockChainHeight" + ex.Message);
            }
           
            return result;
        }


        public LiskVoterAccount GetVotersInAccount(string address)
        {
            LiskAccount account = GetAccount(address);
            string publicKey = account.account.publicKey;
            string jsonResult;
            LiskVoterAccount result = new LiskVoterAccount();

            try
            {
                HttpWebRequest http = (HttpWebRequest)WebRequest.Create(baseUrl + string.Format("/api/delegates/voters?publicKey={0}", publicKey));
                http.Method = "GET";
                WebResponse response = http.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<LiskVoterAccount>(jsonResult);
            }
            catch (Exception ex)
            {
               // SendEmail("ERROR LiskApi GetVotersInAccount", "ntelo@hotmail.com", "ERROR LiskApi GetVotersInAccount" + ex.Message);
            }



            return result;
        }

        public FogedAccount GetForgedByAccount(string publicKey)
        {
            string jsonResult;
            FogedAccount result = new FogedAccount();

            try
            {
                HttpWebRequest http = (HttpWebRequest)WebRequest.Create(baseUrl + string.Format("/api/delegates/forging/getForgedByAccount?generatorPublicKey={0}", publicKey));
                http.Method = "GET";
                WebResponse response = http.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<FogedAccount>(jsonResult);
            }
            catch (Exception ex)
            {
               // SendEmail("ERROR LiskApi GetForgedByAccount", "ntelo@hotmail.com", "ERROR LiskApi GetForgedByAccount" + ex.Message);
            }

            return result;

        }

        public TransactionResponse SendTransaction(TransactionRequest obj)
        {
            string jsonResult;
            TransactionResponse result = new TransactionResponse();
            try
            {

                string serializedObject = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                HttpWebRequest request = WebRequest.CreateHttp(baseUrl + "/api/transactions");
                request.Method = "PUT";
                request.AllowWriteStreamBuffering = false;
                request.ContentType = "application/json";
                request.Accept = "Accept=application/json";
                request.SendChunked = false;
                request.ContentLength = serializedObject.Length;
                using (var writer = new StreamWriter(request.GetRequestStream()))
                {
                    writer.Write(serializedObject);
                }
                var response = request.GetResponse() as HttpWebResponse;

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<TransactionResponse>(jsonResult);
            }
            catch (Exception ex)
            {
               // SendEmail("ERROR LiskApi SendTransaction", "ntelo@hotmail.com", "ERROR LiskApi SendTransaction" + ex.Message);
            }

            return result;

   

        }



        //used to load sql server
        public LiskDelegates GetTop200(string address=null)
        {
            LiskDelegates result200Delegates = new LiskDelegates();
            result200Delegates.success = true;


            try
            {

                #region top 200 deledates
                result200Delegates.delegates = new List<Contracts.Contracts>();

                List<Task<LiskDelegates>> tasksDelegates = new List<Task<LiskDelegates>>();

                Task<LiskDelegates> t = Task.Factory.StartNew(() =>
                {
                    return GetDelegates(0);
                });

                Task<LiskDelegates> t1 = Task.Factory.StartNew(() =>
                {
                    return GetDelegates(101);
                });

                tasksDelegates.Add(t);
                tasksDelegates.Add(t1);

                Task.WhenAll(tasksDelegates.ToArray());

                if (t.Result != null && t.Result.delegates != null)
                    result200Delegates.delegates.AddRange(t.Result.delegates);
                if (t1.Result != null && t1.Result.delegates != null)
                    result200Delegates.delegates.AddRange(t1.Result.delegates);
                #endregion

                //get forged
                #region Forged
                List<Task<FogedAccount>> tasksForged = new List<Task<FogedAccount>>();

                foreach (Contracts.Contracts var in result200Delegates.delegates)
                {
                    Task<FogedAccount> t3 = Task.Factory.StartNew(() =>
                    {

                        return GetForgedByAccount(var.publicKey);

                    });

                    tasksForged.Add(t3);


                }

                Task.WhenAll(tasksForged.ToArray());
                #endregion

                //get accounts
                #region account
                List<Task<LiskAccount>> tasksAccount = new List<Task<LiskAccount>>();

                foreach (Contracts.Contracts var in result200Delegates.delegates)
                {
                    Task<LiskAccount> t3 = Task.Factory.StartNew(() =>
                    {

                        return GetAccount(var.address);

                    });

                    tasksAccount.Add(t3);


                }

                Task.WhenAll(tasksAccount.ToArray());
                #endregion


                // NumberVotesMade
                #region NumberVotesMade
                List<Task<LiskDelegates>> tasksVotedDelegates = new List<Task<LiskDelegates>>();

                foreach (Contracts.Contracts var in result200Delegates.delegates)
                {
                    Task<LiskDelegates> t4 = Task.Factory.StartNew(() =>
                    {

                        return GetVotedDelegates(var.address);

                    });

                    tasksVotedDelegates.Add(t4);


                }
                Task.WhenAll(tasksVotedDelegates.ToArray());


                for (int i = 0; i < result200Delegates.delegates.Count; i++)
                {
                    result200Delegates.delegates[i].Forged = tasksForged[i].Result.forged;
                    result200Delegates.delegates[i].NumberVotesMade = tasksVotedDelegates[i].Result.delegates.ToArray().Length;
                }

                #endregion

                // NumberVotesReceived

                #region NumberVotesReceived
                List<Task<LiskVoterAccount>> tasksVotedReceivesDelegates = new List<Task<LiskVoterAccount>>();

                foreach (Contracts.Contracts var in result200Delegates.delegates)
                {
                    Task<LiskVoterAccount> t4 = Task.Factory.StartNew(() =>
                    {

                        return GetVotersInAccount(var.address);

                    });

                    tasksVotedReceivesDelegates.Add(t4);


                }
                Task.WhenAll(tasksVotedReceivesDelegates.ToArray());



                #endregion


                for (int i = 0; i < result200Delegates.delegates.Count; i++)
                {
                    result200Delegates.delegates[i].Forged = tasksForged[i].Result.forged;
                    result200Delegates.delegates[i].NumberVotesMade = tasksVotedDelegates[i].Result.delegates.ToArray().Length;
                    result200Delegates.delegates[i].NumberVotesReceived = tasksVotedReceivesDelegates[i].Result.accounts.ToArray().Length;

                    result200Delegates.delegates[i].NumberVotesReceivedWithoutTop200 = tasksVotedReceivesDelegates[i].Result.accounts.Select(s => s.address).Where(x => !result200Delegates.delegates.Select(s => s.address).Contains(x)).Count();

                    result200Delegates.delegates[i].balance = tasksAccount[i].Result.account.balance;

                    if (!string.IsNullOrEmpty(address))
                    {
                        //  List<Contracts.Contracts> temp = tasksVotedDelegates[i].Result.delegates.ToList();

                        result200Delegates.delegates[i].VotedOnMe = tasksVotedDelegates[i].Result.delegates.Where(a => a.address.Trim() == address.Trim()).Count() > 0 ? true : false;

                    }

                }
            }
            catch (Exception ex)
            {
                //SendEmail("ERROR LiskApi GetTop200", "ntelo@hotmail.com", "ERROR LiskApi GetTop200" + ex.Message);
            }

            return result200Delegates;

        }
    

        public LiskDelegates GetDelegates(int offSet)
        {
            string jsonResult;
            LiskDelegates result = new LiskDelegates();
            try
            {
                HttpWebRequest http = (HttpWebRequest)WebRequest.Create(baseUrl + string.Format("/api/delegates/?offset={0}", offSet));
                http.Method = "GET";
                WebResponse response = http.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<LiskDelegates>(jsonResult);
            }
            catch (Exception ex)
            {
                SendEmail("ERROR LiskApi GetDelegates ", "ntelo@hotmail.com", "ERROR LiskApi GetDelegates" + ex.Message);
            }
            
            return result;

        }

        private Contracts.Contracts GetDelegateByUsername(string username)
        {
            //http://164.132.201.52:7000/api/delegates/get?username=NTELO
            string jsonResult;
            LiskDelegates result = new LiskDelegates();
            try
            {
                HttpWebRequest http = (HttpWebRequest)WebRequest.Create(baseUrl + string.Format("/api/delegates/get?username=={0}", username));
                http.Method = "GET";
                WebResponse response = http.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<LiskDelegates>(jsonResult);
            }
            catch (Exception ex)
            {
                SendEmail("ERROR LiskApi GetDelegateByUsername", "ntelo@hotmail.com", "ERROR LiskApi GetDelegateByUsername" + ex.Message);
            }

            return result.delegates[0];

        }

        public List<Contracts.Contracts> GetTop25MissersInstantStats24h()
        {

            return this.GetDelegates(0).delegates.OrderByDescending(s=>s.missedblocks).Take(25).ToList();
        }

        public List<Contracts.Contracts> GetTop25ForgersInstantStats24h()
        {
            return this.GetDelegates(0).delegates.OrderByDescending(s => s.producedblocks).Take(25).ToList();
        }

        public List<Contracts.Contracts> GetInstantStats24h()
        {
            return this.GetDelegates(0).delegates.OrderBy(s => s.rate).ToList();
        }


        public List<Contracts.Contracts> GetTop10ForgersBlockers()
        {
            return this.GetDelegates(0).delegates.OrderByDescending(s => s.producedblocks).Take(10).ToList();
        }

        public List<Contracts.Contracts> GetTopMissedBlockers()
        {
            return this.GetDelegates(0).delegates.OrderByDescending(s => s.missedblocks).Take(10).ToList();
        }


        public List<Peers> GetPeers()
        {
            string jsonResult;
            PeersResponse result = new PeersResponse();

            try
            {
                HttpWebRequest http = (HttpWebRequest)WebRequest.Create(baseUrl + "/api/peers/");
                http.Method = "GET";
                WebResponse response = http.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    StreamReader sr = new StreamReader(stream);
                    jsonResult = sr.ReadToEnd();
                }
                result = JsonConvert.DeserializeObject<PeersResponse>(jsonResult);
            }
            catch (Exception ex)
            {
                result.peers = new List<Peers>();

            }

            return result.peers;
        }

        public List<Peers> GetPeersView()
        {
          return  this.GetPeers().OrderByDescending(s=>s.state).ToList();

        }

        public List<PeerState> GetPeersStates()
        {
            List<PeerState> res = new List<PeerState>();
            try
            {
                List <Peers> peers= this.GetPeersView();

              int stateBanned=  peers.Where(s => s.state == "0").Count();
              res.Add(new PeerState { state = "Banned", NumberStates = stateBanned });

              int stateDisconnected = peers.Where(s => s.state == "1").Count();
              res.Add(new PeerState { state = "Disconnected", NumberStates = stateDisconnected });

              int stateConnected = peers.Where(s => s.state == "2").Count();
              res.Add(new PeerState { state = "Connected", NumberStates = stateConnected });

            }
            catch (Exception ex)
            {
               
            }
            return res;

        }

        public List<PeersBlockx100> GetPeersBlockGroup()
        {
            List<PeersBlockx100> res = new List<PeersBlockx100>();
            try
            {
                List<Peers> peers = this.GetPeersView();

                List<string> gName = peers.Select(s => s.PeersBlockx100.ToString()).Distinct().ToList();

                foreach(string g in gName)
                {
                    int count = peers.Count(s => s.PeersBlockx100.ToString() == g);
                    res.Add(new PeersBlockx100 { Blockx100 = g, NumberPeers = count });
                }
               
            }
            catch (Exception ex)
            {
               // SendEmail("ERROR LiskApi GetPeersBlockGroup", "ntelo@hotmail.com", "ERROR LiskApi GetPeersBlockGroup" + ex.Message);
            }

            return res.OrderByDescending(s=>s.NumberPeers).ToList();

        }

    
        public bool SendEmail(string subject, string emailTo, string body)
        {
          
            return true;
        }


    }
}
