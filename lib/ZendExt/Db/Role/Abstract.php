<?php

abstract class ZendExt_Db_Role_Abstract {
	
	public $roleName;
	
	public $password;
	
	protected $conn;
	
	public $new = true;
	
	public $lastFindObject = null;
	
	abstract public function __construct($conn = null);
	
	public function getSql() {
		if ($this->new)
			$sql = $this->getSqlForCreate();
		else
			$sql = $this->getSqlForUpdate();
		return $sql;
	}
	
	abstract public function getSqlForUpdate();
	
	abstract public function getSqlForCreate();
	
	abstract public function getSqlForDelete();
	
	public function save(Doctrine_Connection $conn = null) {
		if (is_null($conn))
			$conn = $this->conn;
		$sql = $this->getSql();
		if ($sql)
			$conn->exec($sql);
	}

	public function delete(Doctrine_Connection $conn = null) {
		if (is_null($conn))
			$conn = $this->conn;
		$conn->exec($this->getSqlForDelete());
	}
}
