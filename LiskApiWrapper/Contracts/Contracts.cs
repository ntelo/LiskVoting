
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiskApiWrapper.Contracts
{

    public class LiskDelegates
    {
        public bool success { get; set; }
        public List<Contracts> delegates { get; set; }

    }
    public class Contracts
    {
        public string username { get; set; }
        public string address { get; set; }
        public string publicKey { get; set; }
        public string vote { get; set; }
        public int producedblocks { get; set; }
        public int missedblocks { get; set; }
        public string virgin { get; set; }
        public int rate { get; set; }
        public decimal productivity { get; set; }

        public int NumberVotesMade { get; set; }

        public int NumberVotesReceived { get; set; }

        public decimal Forged { get; set; }

        public int NumberVotesReceivedWithoutTop200 { get; set; }
        public bool VotedOnMe { get; set; }

        decimal _balance;
        public decimal balance
        {
            get { return this._balance > 0 ? this._balance : 0; }
            set
            {
                this._balance = value;
            }
        }




    }

    public class LiskAccount
    {
        public bool success { get; set; }

        public Account account { get; set; }

    }
    public class Account
    {
        public string username { get; set; }
        public string address { get; set; }

        decimal _balance;
        public decimal balance
        {
            get { return this._balance > 0 ? this._balance : 0; }
            set
            {
                this._balance = value;
            }
        }

        decimal _unconfirmedBalance;
        public decimal unconfirmedBalance
        {
            get { return this._unconfirmedBalance > 0 ? this._unconfirmedBalance / 100000000 : 0; }
            set
            {
                this._unconfirmedBalance = value;
            }
        }
        public string publicKey { get; set; }
        public string unconfirmedSignature { get; set; }
        public string secondSignature { get; set; }

        public string secondPublicKey { get; set; }

        public string[] m_multisignatures { get; set; }
        public string[] u_multisignatures { get; set; }


    }


    public class LiskVoterAccount
    {
        public string success { get; set; }

        public List<VoterAccount> accounts { get; set; }
    }
    public class VoterAccount
    {

        public string address { get; set; }

        private decimal _balance;
        public decimal balance
        {
            get { return this._balance > 0 ? this._balance : 0; }
            set
            {
                this._balance = value;
            }
        }

    }

    public class VoterUsernameAccount
    {
        public string username { get; set; }
        public string address { get; set; }

        private decimal _balance;
        public decimal balance
        {
            get { return this._balance > 0 ? this._balance : 0; }
            set
            {
                this._balance = value;
            }
        }

    }


    public class FogedAccount
    {
        public bool success { get; set; }

        private decimal _fees;
        public decimal fees
        {
            get { return this._fees > 0 ? this._fees / 100000000 : 0; }
            set
            {
                this._fees = value;
            }
        }


        private decimal _rewards;
        public decimal rewards
        {
            get { return this._rewards > 0 ? this._rewards / 100000000 : 0; }
            set
            {
                this._rewards = value;
            }
        }


        private decimal _forged;
        public decimal forged {
            get { return this._forged > 0 ? this._forged / 100000000 : 0; }
            set
            {
                this._forged = value;
            }
        }


    }

    public class TransactionResponse
    {
        public string success { get; set; }
        public string transactionId { get; set; }
    }

    public class TransactionRequest
    {
        public string secret { get; set; }//"secret" : "Secret key of account",
        public long amount { get; set; }///* Amount of transaction * 10^8. Example: to send 1.1234 LISK, use 112340000 as amount */,
        public string recipientId { get; set; }//"Recipient of transaction. Address or username.",
        public string publicKey { get; set; } // "Public key of sender account, to verify secret passphrase in wallet. Optional, only for UI",

        public string secondSecret { get; set; }// "Secret key from second transaction, required if user uses second signature"

    }

    public class EvolutionStats
    {
        public string DayHour { get; set; }
        public string username { get; set; }
        public string address { get; set; }
        public DateTime lastdate { get; set; }
        public string lastdatestr { get; set; }
        public int missedBlocksTotal { get; set; }
        public int producedblocks { get; set; }

        public int forgedTotal { get; set; }

        public int votesmadeTotal { get; set; }
        public int votesreceivedTotal { get; set; }

     //   public List<GetStatsEvolutionByAdress_EvoGroupByHour_Map> evolutionData { get; set; }

    }

    public partial class MenAccounts
    {

        public string username { get; set; } // character varying(20)

        public string isDelegate { get; set; } // smallint

        public string address { get; set; } // character varying(22)
        public string publicKey { get; set; } // character varying(22)

        public decimal? balance { get; set; } // bigint
        public decimal? balancePercentTotal { get; set; } // bigint

        public decimal? vote { get; set; } // bigint

        public decimal? votePercentTotal { get; set; } // bigint

        public decimal? rate { get; set; } // bigint

        public string delegates { get; set; } // text

        public decimal? multimin { get; set; } // bigint

        public decimal? multilifetime { get; set; } // bigint

        public string blockId { get; set; } // character varying(20)

        public short? nameexist { get; set; } // smallint

        public decimal? producedblocks { get; set; } // bigint

        public decimal? missedblocks { get; set; } // bigint

        public decimal? fees { get; set; } // bigint

        public decimal? rewards { get; set; } // bigint
    }

    public class BlockChainHeight
    {
        public bool success { get; set; } // bigint

        public int height { get; set; } // bigint
    }


    public class PeersResponse
    {
        public bool success;
       public List<Peers> peers;
    }
    public class Peers
    {
      

        public string ip { get; set; }
        public string port { get; set; }

        public string state { get; set; }

        public string stateStr
        {
            get {
                string res = "";
                if (state == "0")
                    res = "Banned";

                if (state == "1")
                    res = "Disconnected";

                if (state == "2")
                    res = "Connected";

                return res;


                  
            }
           // set { this._PeersBlockx100 = height.HasValue ? height.Value : 0 / 1000; }
        }

        public string os { get; set; }

        public string version { get; set; }

        public string broadhash { get; set; }

        public Int64? height { get; set; }

        private Int64 _PeersBlockx100;
        public Int64 PeersBlockx100
        {
                get { return height.HasValue ? height.Value/ 1000 : 0; }
                set { this._PeersBlockx100 = height.HasValue ? height.Value / 1000 : 0; }
        }

    }

    public class PeerState
    {
        public string state;
        public int NumberStates;
      
    }
    public class PeersBlockx100
    {
        public string Blockx100;
        public long NumberPeers;
    }

    //public class Peers
    //{
    //    public int id { get; set; } 

    //    public string ip { get; set; }
    //    public string hostName { get; set; }

    //    public string port { get; set; }

    //    public string nodeUrl { get; set; }

    //    public string state { get; set; }

    //    public string os { get; set; }

    //    public string sharePort { get; set; }

    //    public string version { get; set; }

    //    public Int64 currentBlock { get; set; }

    //}


}
