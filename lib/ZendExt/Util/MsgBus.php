<?php
/**
 * ZendExt_MsgBus
 * Zend_Ext_MsgBus -> sendMsg("ProyectManager.Project.Created",array('proyectName':"Test", appsdirectory)).
 * Zend_Ext_MsgBus->onMsg(array(this,"onMsg"))
 *
 */
class ZendExt_Util_MsgBus {

	private $bus;

        public static $singleton;

	private $listeners;

	private function __construct(){
            $this->bus = new ZendExt_Util_Observable();
            $this->bus->addListener("message");
            $this->bus->on("message",array($this,"recieveMessage"));


	}
	public function sendMsg($msg, $params=null) {
		$this->bus->fireEvent("message",array("msg"=> $msg,"params"=>$params));
	}
	public function onMessage($scope){
		$this->listeners[] = $scope;
	}
	public function recieveMessage($params){
		foreach($this->listeners as $listener)
		{
			$listener[0]->{$listener[1]}($params["msg"],$params["params"]);
		}
	}
        public static function getInstance()
        {
            if(is_null(self::$singleton)){
                self::$singleton = new self();
            }
            return self::$singleton;

        }
}


