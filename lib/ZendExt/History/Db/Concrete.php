<?php
class ZendExt_History_Db_Concrete {
	private $_conn;
	private $_module = 'historial';
	private $_reference = 'historial';
	public function __construct() {
		$doctrineManager = Doctrine_Manager::getInstance();
		try {
			$this->_conn = $doctrineManager->getConnection($this->_module);
		} catch (Doctrine_Manager_Exception $e) {
			$transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
			$configApp = new ZendExt_App_Config();
			$configApp->addBdToConfig($this->_module, $this->_reference);
			$this->_conn = $transactionManager->openConections($this->_module);
		}
	}
	
	public function query($pSQL) {
		$pSQL .= ";";
		
		$query = $this->_conn->query ( $pSQL );
		
		return ($query != null) ? $query->fetchAll ( PDO::FETCH_ASSOC ) : false;
	}
}
