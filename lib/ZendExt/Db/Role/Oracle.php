<?php

class ZendExt_Db_Role_Oracle extends ZendExt_Db_Role_Abstract {
	
	protected $oracleList = array(
			'createUser'=>'CREATE USER ',
			'createRole'=>'CREATE ROLE ',
			'dropRole'=>'DROP ROLE ',
			'dropUser'=>'DROP USER ',
			'alterRole'=>'ALTER ROLE ', 
			'rename'=>'RENAME TO ',
			'encrypted'=>'ENCRYPTED ',
			'password'=>'PASSWORD ',
			'owner'=>'OWNER',
			'grant'=>'GRANT',
			'revoke'=>'REVOKE',
			'alterUser'=>'ALTER USER ',
			'to'=>' TO ',
			'from'=>' FROM ',
			'on'=>' ON ',
			'not'=>'NO',
			'end'=>';',
			'by'=>'BY ',
			'identified'=>' IDENTIFIED ',
			'notIdentified'=>' NOT IDENTIFIED',
			'externally'=>'EXTERNALLY',
			'globally'=>'GLOBALLY',
			'as'=>' AS ',
			'cascade'=>' CASCADE'
		);

	public $externo;
	
	public $opcion;
	
	public $type;
		
	public function __construct($conn = NULL) {
		
	}
	
	public function findByRoleName($roleName, $conn) {
			$data = $this->transformData($this->getData( $roleName, $conn ));
			$instance = new ZendExt_Db_Role_Oracle();
			if ( count( $data ) ) {
				$instance->lastFindObject = $data;
				$instance->new = false;
			}
			else
				$instance = null;
			return $instance;
		}
	
	public static function find($oid, $conn = null) {
		
	}
		
	public function getSqlForUpdate() {
		$function = 'modify'.$this->type;
		return $this->$function();
	}
	
	public function getSqlForCreate() {
		$function = 'create'.$this->type;
		return $this->$function();
	}

	private function createOracleUser() {
		$sql = '';
		$sql .= $this->oracleList['createUser'] . $this->roleName;
		if($this->opcion == 1)
			$sql .= $this->oracleList['identified'].$this->oracleList['by'].$this->password;
		elseif ($this->opcion == 2)
			$sql .= $this->oracleList['identified'].$this->oracleList['externally'];
		else 
			$sql .= $this->oracleList['identified'].$this->oracleList['globally'].$this->oracleList['as'].$this->externo;
		$sql .= $this->sqlList['end'];
		return $sql;
	}
	
	private function createOracleRole() {
		$sql = '';
		$sql .= $this->oracleList['createRole'] . $this->roleName;
		if($this->opcion == 1)
			$sql .= $this->oracleList['notIdentified'];
		elseif ($this->opcion == 2)
			$sql .= $this->oracleList['identified'].$this->oracleList['by'].$this->password;
		elseif ($this->opcion == 2)
			$sql .= $this->oracleList['identified'].$this->oracleList['externally'];
		else 
			$sql .= $this->oracleList['identified'].$this->oracleList['globally'];
		$sql .= $this->sqlList['end'];
		return $sql;
	}
	
	private function modifyOracleUser() {
		$sql = '';
		$sql .= $this->oracleList['alterUser'] . $this->roleName;
		if($this->opcion == 1)
			$sql .= $this->oracleList['identified'].$this->oracleList['by'].$this->password;
		elseif ($this->opcion == 2)
			$sql .= $this->oracleList['identified'].$this->oracleList['externally'];
		else 
			$sql .= $this->oracleList['identified'].$this->oracleList['globally'].$this->oracleList['as'].$this->externo;
		$sql .= $this->sqlList['end'];
		return $sql;
	}
	
	public function getSqlForDelete() {
		$function = 'deleteOracle'.$this->type;
		return $this->$function();
	}

	private function deleteOracleUser() {
		$sql = $this->oracleList['dropUser'] . $this->roleName . $this->oracleList['cascade'];
		return $sql;
	}
	
	public function save($conn = null) {
		if (is_null($conn))
			$conn = $this->conn;
		$sql = $this->getSql();
		print_r($sql);die;
		if ($sql){
				$sqlExec = oci_parse($conn, $sql);
            	oci_execute($sqlExec);
			}		
	}
	
	public function delete($conn = null) {
		if (is_null($conn))
			$conn = $this->conn;
		$sqlDelete = $this->getSqlForDelete();
		if ($sqlDelete){
				$sqlExec = oci_parse($conn, $sqlDelete);
            	oci_execute($sqlExec);
			}
	}
	
	private function getData($user, $conn) {
		$orac = new Oracle();
		return $orac->getUserData($user, $conn);
	}
	
	private function transformData($array) {
		$result = array();
		foreach ($array as $valor) {
			$result['roleName'] = $valor['user'];
			$result['id'] = $valor['id'];
			$result['estado'] = $valor['estado'];
			$result['radiobutton3'] = $valor['radiobutton3'];
			$result['radiobutton2'] = $valor['radiobutton2'];
			$result['radiobutton1'] = $valor['radiobutton1'];
		}
		return $result;
	}
}
