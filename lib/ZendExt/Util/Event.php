<?php
/**
 * ZendExt_Util_Event
 */
class ZendExt_Util_Event{
	private $listeners;
	private $name;
	
	function __construct($name)
	{
		$this->name = $name;
		
	}
	function addListeners($scopefn){
		$this->listeners[] = $scopefn;		
	}
	function removeListeners($scopefn){
		$key  = array_search($this->listeners,$scopefn);
		if($key)
			unset($this->listeners[$key]);
	}
	function fire($params){
		foreach($this->listeners as $listener)
			$listener[0]->{$listener[1]}($params);
	}
}
