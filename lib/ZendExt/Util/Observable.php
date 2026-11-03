<?php
/**
 * ZendExt_Observable
 * $person = new Observable();
 * $person->addEvents("personinerted")
 * $person->on("personinerted",function)
 * 
 */
class ZendExt_Util_Observable
{
	
	private $events;
	
	function on($observerName,$scopeFn){
		$event  = $this-> events[$observerName];
		if($event){			
			$event-> addListeners($scopeFn);
		}
	}
	
	function un($observerName,$scopeFn){
		$event  = $this-> events[$observerName];
		if($event)
			$event -> removeListeners($scopeFn);
	}
	
	function fireEvent( $observerName,$params){		
		$event  = $this-> events[$observerName];
		if($event)
			$event-> fire($params);
	}
	
	function addListener($observerName){
		
		$event = new ZendExt_Util_Event($observerName);
		$this-> events[$observerName] = $event ;
	}

}
