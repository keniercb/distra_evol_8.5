<?php

class ZendExt_Db_Role_Pgsql extends ZendExt_Db_Role_Abstract {
	
	protected $sqlList = array(
			'createRole'=>'CREATE ROLE ',
			'dropRole'=>'DROP ROLE ',
			'alterRole'=>'ALTER ROLE ',
			'rename'=>'RENAME TO ',
			'encrypted'=>'ENCRYPTED ',
			'password'=>'PASSWORD ',
			'canLogin'=>'LOGIN ',
			'superUser'=>'SUPERUSER ',
			'noInherit'=>'NOINHERIT ',
			'Inherit'=>'INHERIT ',
			'canCreateDb'=>'CREATEDB ',
			'canCreateRole'=>'CREATEROLE ',
			'accountExpires'=>'VALID UNTIL ',
			'owner'=>'OWNER',
			'grant'=>'GRANT',
			'revoke'=>'REVOKE',
			'alter'=>'ALTER ',
			'SEL'=>'SELECT',
			'INS'=>'INSERT',
			'UPD'=>'UPDATE',
			'CRT'=>'CREATE',
			'DEL'=>'DELETE',
			'REF'=>'REFERENCES',
			'TRIG'=>'TRIGGER',
			'USG'=>'USAGE',
			'TMP'=>'TEMP',
			'EXEC'=>'EXECUTE',
			'CONN'=>'CONNECT',
			'OWN'=>'OWNER',
			'to'=>' TO ',
			'from'=>' FROM ',
			'on'=>' ON ',
			'not'=>'NO',
			'end'=>';'
		);
	
	public $canLogin = true; 
	
	public $superUser = false;
	
	public $inherit = false; 
	
	public $canCreateDb = false;
	
	public $canCreateRole = false;
	
	public $canUpdateCat = false;
	
	public $dateExpires;
	
	public $timeExpires;

	public $encrypted = true;
	
	protected $Access = array();
	
	protected $Deny = array();
	
	public function __construct($conn = null) {
		if ($conn instanceof Doctrine_Connection)
			$this->conn = $conn;
		else {
			$dm = Doctrine_Manager::getInstance();
			if (is_string($conn))
				$this->conn = $dm->getConnection($conn);
			else
				$this->conn = $dm->getCurrentConnection();
		}
	}
	
	public function accountExpires($date, $time) {
		$this->dateExpires = $date;
		$this->timeExpires = $time;
	}
	
	public static function finByRoleName($roleName, Doctrine_Connection $conn = null) {
		$instance = new self($conn);
		$dm = Doctrine_Manager::getInstance();
		$currentConnName = $dm->getCurrentConnection()->getName();
		$dm->setCurrentConnection($instance->conn->getName());
		$role = Doctrine::getTable('PgAuthid')->findBySql('rolname LIKE ?', array($roleName));
		if ($role->getData() != null) {
			$instance->lastFindObject = $role[0];
			$instance->roleName = $role[0]->rolname;
			$instance->superUser = $role[0]->rolsuper;
			$instance->canUpdateCat = $role[0]->rolcatupdate;
			$instance->canCreateDb = $role[0]->rolcreatedb;
			$instance->canCreateRole = $role[0]->rolcreaterole;
			$expires = explode(' ', $role[0]->rolvaliduntil);
			$instance->dateExpires = $expires[0];
			$instance->timeExpires = $expires[1];
			$instance->new = false;
		}
		else
			$instance = null;
		$dm->setCurrentConnection($currentConnName);
		return $instance;
	}
	
	public function find($oid, Doctrine_Connection $conn = null) {
		$instance = new self($conn);
		$dm = Doctrine_Manager::getInstance();
		$currentConnName = $dm->getCurrentConnection()->getName();
		$dm->setCurrentConnection($instance->conn->getName());
		$role = Doctrine::getTable('PgAuthid')->find($oid);
		if ($role->getData() != null) {
			$instance->lastFindObject = $role;
			$instance->roleName = $role->rolname;
			$instance->superUser = $role->rolsuper;
			$instance->canUpdateCat = $role->rolcatupdate;
			$instance->canCreateDb = $role->rolcreatedb;
			$instance->canCreateRole = $role->rolcreaterole;
            $instance->inherit = $role->rolinherit;
            $instance->password = $role->rolpassword;
			$instance->new = false;
		}
		else
			$instance = null;
		$dm->setCurrentConnection($currentConnName);
		return $instance;
	}
	
	public function getSqlForUpdate() {
		if ($this->lastFindObject->rolname != $this->roleName)
			$sqlRename =  $this->sqlList['alterRole'] . $this->lastFindObject->rolname . ' ' . $this->sqlList['rename'] . $this->roleName. $this->sqlList['end'];
		$sqlAlterRol = $this->sqlList['alterRole'] . $this->roleName . ' ';
		$sql = '';
		if ($this->lastFindObject->rolcanlogin != $this->canLogin)
			$sql .= ((!$this->canLogin) ? $this->sqlList['not'] : '') . $this->sqlList['canLogin'];
			
		if ($this->lastFindObject->rolinherit != $this->inherit)
			$sql .= ((!$this->inherit) ? $this->sqlList['not'] : '') . $this->sqlList['Inherit'];
			
		if ($this->password) {
			$sql .= ($this->encrypted) ? $this->sqlList['encrypted'] : '';
			$sql .= $this->sqlList['password'] . "'$this->password' ";
		}
		if ($this->lastFindObject->rolsuper != $this->superUser)
			$sql .= ((!$this->superUser) ? $this->sqlList['not'] : '') . $this->sqlList['superUser'];
		if ($this->lastFindObject->rolcreatedb != $this->canCreateDb)
			$sql .= ((!$this->canCreateDb) ? $this->sqlList['not'] : '') . $this->sqlList['canCreateDb'];
		if ($this->lastFindObject->rolcreaterole != $this->canCreateRole)
			$sql .= ((!$this->canCreateRole) ? $this->sqlList['not'] : '') . $this->sqlList['canCreateRole'];
		$expires = explode(' ', $this->lastFindObject->rolvaliduntil);
		if ($this->dateExpires != $expires[0] || $this->timeExpires != $expires[1]) {
			if ($this->dateExpires != 'infinity' && $this->dateExpires != '') {
				$sql .= $this->sqlList['accountExpires'] . "'{$this->dateExpires}";
				$sql .= ($this->timeExpires) ? " {$this->timeExpires}' " : "' ";
			}
			else
				$sql .= $this->sqlList['accountExpires'] . "'infinity'";
		}
		if ($sql != '')
			$sql = $sqlRename . $sqlAlterRol . $sql . $this->sqlList['end'];
		else $sql = $sqlRename;
		return $sql;
	}
	
	public function getSqlForCreate() {
		$sql = '';
		$sql .= $this->sqlList['createRole'] . $this->roleName . ' ';
		$sql .= ($this->canLogin) ? $this->sqlList['canLogin'] : '';
		$sql .= ($this->encrypted) ? $this->sqlList['encrypted'] : '';
		$sql .= $this->sqlList['password'] . "'$this->password' ";
		$sql .= ($this->superUser) ? $this->sqlList['superUser'] : '';
		$sql .= (!$this->inherit) ? $this->sqlList['noInherit'] : '';
		$sql .= ($this->canCreateDb) ? $this->sqlList['canCreateDb'] : '';
		$sql .= ($this->canCreateRole) ? $this->sqlList['canCreateRole'] : '';
		if ($this->dateExpires) {
			$sql .= $this->sqlList['accountExpires'] . "'{$this->dateExpires}";
			$sql .= ($this->timeExpires) ? " {$this->timeExpires}' " : "' ";
		}
		else
			$sql .= $this->sqlList['accountExpires'] . "'infinity'";
		$sql .= $this->sqlList['end'];
		return $sql;
	}

	public function getSqlForDelete() {
		$sql = $this->sqlList['dropRole'] . $this->roleName . $this->sqlList['end'];
		return $sql;
	}

	public function save(Doctrine_Connection $conn = null) {
		if (is_null($conn))
			$conn = $this->conn;
	if (isset($this->lastFindObject->rolcatupdate) && $this->lastFindObject->rolcatupdate != $this->canUpdateCat) {
			$this->lastFindObject->rolcatupdate = $this->canUpdateCat;
			$this->lastFindObject->save($conn);
		}
		parent::save($conn);
		
	}


	public function getDatabases($gestor, $user, $pass, $ipgestorbd){
		$rsa = new ZendExt_RSA_Facade();
		$bdArr = array();
		$dm = Doctrine_Manager::getInstance();
		$nameCurrentConn = $dm->getCurrentConnection()->getName();
		$conn = $dm->openConnection("$gestor://$user:$pass@$ipgestorbd/template1", 'pg_catalog');
		$bdArr = PgDatabase::getPgsqlDatabases($conn);
		$dm->setCurrentConnection($nameCurrentConn);
		return $bdArr;	

	}

	public function getPgsqlSchemas($gestor, $user, $pass, $ipgestorbd, $namebd){
		$schemasArr = array();
		$dm = Doctrine_Manager::getInstance();
		$nameCurrentConn = $dm->getCurrentConnection()->getName(); 
		$conn = $dm->openConnection("$gestor://$user:$pass@$ipgestorbd/$namebd", 'information_schema');
		$schemas = Schemata::getPgsqlSchemasByDb($conn, $namebd);
		$dm->setCurrentConnection($nameCurrentConn);
		return $schemasArr;
	}

	public function getPgsqlTablas($gestor, $user, $pass, $ipgestorbd, $namebd, $esquema){
		$schemasArr = array();
		$dm = Doctrine_Manager::getInstance();
		$nameCurrentConn = $dm->getCurrentConnection()->getName(); 
		$conn = $dm->openConnection("$gestor://$user:$pass@$ipgestorbd/$namebd", 'information_schema');
		$schemas = Schemata::getPgsqlSchemasByDb($conn, $namebd);
		$dm->setCurrentConnection($nameCurrentConn);
		return $schemasArr;
	}
	
	function modifyAccess($arrayAccess, $arrayDeny, $conn, $user, $critery) {
		//$critery = $this->sqlList["$critery"];
		//die($critery);
		if(count($arrayAccess)){
			$this->createSqlForAccess($arrayAccess, $user, $critery);
				foreach ($this->Access as $sql)
					$conn->exec($sql);
		}
		if(count($arrayDeny)){
		    $this->createSqlForDeny($arrayDeny, $user, $critery);
		    	foreach($this->Deny as $sqlDeny)
		    		$conn->exec($sqlDeny);
		  }
	}
	
	private function createSqlForAccess($arrayAccess, $user, $critery){
			foreach($arrayAccess as $valores)
				$this->createArrayAccess($valores[0], $valores[1], $user, $critery);
		 }

	private function createSqlForDeny($arrayDeny, $user, $critery) {
			foreach($arrayDeny as $valores)
				$this->createArrayDeny($valores[0], $valores[1], $user, $critery);
		} 	 
		 
	private function createArrayAccess($key, $valores, $user, $critery) {
			$sentencias = ' ';
			$bandera = true;
			$semaforo = true;
		 		foreach ($valores as $valor){
		 			if($valor != 'OWN') {
		 				if($bandera) {
		 					$sentencias .= $this->sqlList[$valor];
		 					$bandera = false;
			 			}
			 			else 
			 				$sentencias .= ', '.$this->sqlList[$valor];
		 			}
		 			else {		 			
		 				$this->Access[] = $this->sqlList['alter'].$critery.' '.$key.' OWNER'.$this->sqlList['to'].$user.$this->sqlList['end'];
		 				if(count($valores) == 1)
		 					$semaforo = false;
		 				}	
		 		}
		 		if($critery == 'SECUENCE' || $critery == 'TABLE' && $semaforo)
		 			$this->Access[] = $this->sqlList['grant'].$sentencias.$this->sqlList['on'].$key.$this->sqlList['to'].$user.$this->sqlList['end'];
		 		elseif($semaforo) {
		 			if($critery == 'FUNCTION')
		 				$this->Access[] = $this->sqlList['grant'].$sentencias.$this->sqlList['on'].$critery.' '.$key.'()'.$this->sqlList['to'].$user.$this->sqlList['end'];
		 			else 
		 				$this->Access[] = $this->sqlList['grant'].$sentencias.$this->sqlList['on'].$critery.' '.$key.$this->sqlList['to'].$user.$this->sqlList['end'];	
		 		}
		}
		
	private function createArrayDeny($key, $valores, $user, $critery) {
			$sentencias = ' ';
			$bandera = true;
			$semaforo = true;
		 		foreach ($valores as $valor){
		 			if($bandera) {
		 				$sentencias .= $this->sqlList[$valor];
		 				$bandera = false;
			 		}
			 		else 
			 			$sentencias .= ', '.$this->sqlList[$valor];
		 		}
		 		if($critery == 'SECUENCE' || $critery == 'TABLE')
		 			$this->Deny[] = $this->sqlList['revoke'].$sentencias.$this->sqlList['on'].$key.$this->sqlList['from'].$user.$this->sqlList['end'];
		 		elseif($critery == 'FUNCTION')
		 			$this->Deny[] = $this->sqlList['revoke'].$sentencias.$this->sqlList['on'].$critery.' '.$key.'()'.$this->sqlList['from'].$user.$this->sqlList['end'];
		 		else 
		 			$this->Deny[] = $this->sqlList['revoke'].$sentencias.$this->sqlList['on'].$critery.' '.$key.$this->sqlList['from'].$user.$this->sqlList['end'];
		}
}
