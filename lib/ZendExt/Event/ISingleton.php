<?php
/**
 * Interfaz para definir un singleton para los eventos
 * @author Ernesto Herrera Morales
 * @copyright: UCID-ERP-Cuba
 * @package: ZendExt_Event
 * @version: 1.0-0
 */
interface ZendExt_Event_ISingleton {
    /*
     * getInstance 
     * @return ZendExt_Event_Abstract subclass
     */
    static public function getInstance();
}

