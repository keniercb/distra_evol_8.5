<?php
class ZendExt_History_ADTHistory {
	private $_db;
	
	private $_history_manager;
	
	function __construct() {
		$this->_db = ZendExt_History_Db_Singleton::getInstance ();
		$this->_history_manager = new ZendExt_History_Concrete_HistoryManager ( );
	
	}
	function Tables($limit, $offset, $schema) {
		if ($this->_db) {
			if (! $schema || $schema == 'todo') {
				return $this->_history_manager->getTables ( $limit, $offset );
			} else {
				
				return $this->_history_manager->getTablesbyschema ( $schema,$limit, $offset );
			}
		} else
			throw new ZendExt_Exception ( 'E' );
	}
	
	function getHistorial($limit, $offset) {
		if ($this->_db)
			return $this->_history_manager->getHistorial ( $limit, $offset );
		else
			throw new ZendExt_Exception ( 'E' );
	}
	function CreateHistorial($tables, $user) {
		if ($this->_db)
			return $this->_history_manager->CreateHistorial ( $tables, $user );
		else
			throw new ZendExt_Exception ( 'E' );
	}
	function DropHistorial($tables) {
		if ($this->_db)
			return $this->_history_manager->DropHistorial ( $tables );
		else
			throw new ZendExt_Exception ( 'E' );
	}
	function CountTables($schema) {
		if ($this->_db)
			return $this->_history_manager->countTables ($schema);
		else
			throw new ZendExt_Exception ( 'E' );
	}
	function Count($table) {
		if ($this->_db)
			return $this->_history_manager->counthistorial ( $table );
		else
			throw new ZendExt_Exception ( 'E' );
	}
	function Table($table) {
		if ($this->_db)
			return $this->_history_manager->Table ( $table );
		else
			throw new ZendExt_Exception ( 'E' );
	}
	function Schema() {
		if ($this->_db)
			return $this->_history_manager->Schema ();
		else
			throw new ZendExt_Exception ( 'E' );
	}
	function TableAll($table, $limit, $offset) {
		if ($this->_db)
			return $this->_history_manager->TableAll ( $table, $limit, $offset );
		else
			throw new ZendExt_Exception ( 'E' );
	}
	function FieldTable($table,$bandera) {
		if ($this->_db)
			return $this->_history_manager->FieldTable ( $table,$bandera );
		else
			throw new ZendExt_Exception ( 'E' );
	}

}
