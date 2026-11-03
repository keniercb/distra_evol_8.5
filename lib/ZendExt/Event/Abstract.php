<?php
/**
 * Clase abstracta para la definición de un evento
 * @author: Ernesto Herrera Morales
 * @copyright: UCID-ERP-Cuba
 * @package: ZendExt_Event
 * @version: 1.0-0
 */
abstract class ZendExt_Event_Abstract {
	
	/*
     * Dispara un evento del sistema
     *
     * @param String $eventName
     * @param array $params
     * @return void
     */
    public abstract function dispatch($eventName, $params=array());
}

