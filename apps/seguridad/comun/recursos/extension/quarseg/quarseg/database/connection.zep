namespace Quarseg\Database;

class Connection
{
	private keys;
	private static scope;
	private static scopes;

	private static instance = null;
	private static validScope = null;

	private function __construct()
	{
		var keyStore;
		let keyStore = new Key\Store(this);// Quarseg\Database\Key\Store(this)				
		let this->keys = keyStore->getKeys();
		let self::scopes = keyStore->getScopes();	
	}
	public function createPermissions(conn_array,rol ="zeolides" ){
		var keyStore, clave, conn,connectionClass;
		let connectionClass = "PDO";
		//print_r(conn_array);
 		let conn = new {connectionClass}(conn_array["driver"] . ":host=" . conn_array["host"] . ";port=" . conn_array["port"] . ";dbname=" . conn_array["database"], conn_array["user"], conn_array["password"]);
		
		let keyStore = new Key\Store(this);// Quarseg\Database\Key\Store(this)

		if(array_key_exists(rol,this->keys)){
			let clave = this->keys[rol];
			
			//creating the rol
			conn->exec(
				"CREATE ROLE ".rol ." SUPERUSER NOINHERIT NOCREATEDB NOCREATEROLE LOGIN; 
				ALTER ROLE ".rol." ENCRYPTED PASSWORD \'".clave."\';");
		
		}
		else{
			throw new \ZendExt_Exception("COMPEXT_002");
		}	
	}
	public function getKeys(){
		return 	this->keys;
	}
	public function getScopes(){
		return 	self::scopes;
	}
	public function createAllRol(conn_array,rol ="zeolides"){
		var keyStore, clave, conn, connectionClass, key;
		let keyStore = this->keys;
		let connectionClass = "PDO";
		let conn = new {connectionClass}(conn_array["driver"] . ":host=" . conn_array["host"] . ";port=" . conn_array["port"] . ";dbname=" . conn_array["database"], conn_array["user"], conn_array["password"]);
		for key,clave in keyStore{
		    conn->exec(
				"CREATE ROLE ".key ." SUPERUSER NOINHERIT NOCREATEDB NOCREATEROLE LOGIN; 
				ALTER ROLE ".key." ENCRYPTED PASSWORD \'".clave."\';");
		}
	}
	public function defaultConn(host, port, driver, database, user, password){
		var conn,connectionClass;
		let connectionClass = "PDO";
		let conn = new {connectionClass}(driver . ":host=" . host . ";port=" . port . ";dbname=" . database, user, password);
		return conn;
	}

	public static function getInstance(scope,file)
	{
		if self::instance == null {
			let self::instance = new self;
		}
		var reflector;
		var reflectedClass;
		let self::validScope = get_class(scope);
	        let reflector = new \Reflection();
		let reflectedClass = new \ReflectionClass(self::validScope);
		let self::scope = scope;
		if(!isset self::scopes[self::validScope]){			
			throw new \ZendExt_Exception("COMPEXT_003");
		}	
		
		//if sha1(file_get_contents(file)) != self::scopes[self::validScope] {
			//throw new \ZendExt_Exception("COMPEXT_003");
		//}		
		return self::instance;
	}

	public function getConnection(host, port, driver, database, schemas, user)
	{

		if (isset this->keys[user]) {
			self::scope->setQdbConn(
				this->createConnection(
					host, port, driver, database, schemas, user, this->keys[user]
				)
			);
		} else {
			var array1 = [];
			let array1[] = user;
			throw new \ZendExt_Exception("COMPEXT_001",null,array1);
		}
	}

	public function createConnection(host, port, driver, database, schemas, user, password)
	{
		var connectionClass = "PDO";
		var pdoConnection;
		var value;
		var data;
		var databaseControlHash = "";
		var hashControl = "";
		var pdoFetchNum = 3;
	    var error;

		if (port == "" && driver == "pgsql") {
			let port = "5432";
		}		
		let pdoConnection = new {connectionClass}(driver . ":host=" . host . ";port=" . port . ";dbname=" . database, user, password);		
        if driver == "pgsql" {		
        	pdoConnection->exec("SET DATESTYLE TO European,SQL;");
	        if schemas {
	        	pdoConnection->exec("SET search_path = pg_catalog, " . schemas);
	        }
	    }
	let data = pdoConnection->query("SELECT (tg.oid::text || p.oid::text) as oidhash
	    	FROM pg_class c
	    	left JOIN pg_trigger tg on tg.tgrelid = c.oid
	    	left JOIN pg_proc p on p.oid = tg.tgfoid
	    	WHERE c.relkind = 'r'::char and (tg.tgname = 't_cid') order by(tg.oid) asc")
	    	->fetchAll(pdoFetchNum);
	    let error = pdoConnection->errorInfo();		
		if error[2] == "" {
			for value in data {
				let hashControl .= value[0];
			}
			let hashControl = sha1(hashControl);
			if _SERVER["DOCUMENT_ROOT"]!=""{
			let databaseControlHash = json_decode(
				file_get_contents(dirname(_SERVER["DOCUMENT_ROOT"]) . "/apps/comun/database.hash")
			);
			} else{
			var direccion;
			let direccion=_SERVER["PWD"];
			let databaseControlHash = json_decode(
				file_get_contents(direccion . "/../../../apps/comun/database.hash")
			);
			}		
			if hashControl != databaseControlHash->{database} {
				throw new \ZendExt_Exception("COMPEXT_004");
			}
		}
        return pdoConnection;
	}
}
