namespace Quarseg\Database\Key;

class Store
{
	private keys {
		get
	};
	private scopes {
		get
	};
	public function __construct(scope)
	{
		if (get_class(scope) != "Quarseg\\Database\\Connection") {			
			throw new \Exception("Restricted context.");
		}
		let this->keys = [            		  	
			"zeolides":"zeolides*2012.,",
                        "postgres":"postgres"
		];
        let this->scopes = [
            "ControlPanelModel":"dasdasdasdasdasdasdasdasd",
            "GenficheroController":"f8dacb454817a21a416cc65bc2e91b4994825603"
            ,						    "IndexController":"ca24c81307a94c673a11082a4331c510274167b0"
            ,						    "ZendExt_Aspect_TransactionManager":"ac800cc7d7d220071772e571744e05d6e591e968"

        ];
	}
}
