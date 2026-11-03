<?php

/**
 * ZendExt_Event_Notification
 * Clase para manejar eventos que desencadenan avisos o notificaciones.
 *
 * @author Ernesto Herrera Morales
 * @copyright UCID-ERP-Cuba.
 * @package ZendExt_Event
 * @version 1.0-0
 */
final class ZendExt_Event_Notification extends ZendExt_Event_Abstract implements ZendExt_Event_ISingleton {

    /**
     * Instancia del administrador de tareas.
     * 
     * @var Amqp_Task_Mgr $_taskRunner
     */
    private $_taskRunner = null;
    /**
     * Identificador del usuario que genera el evento.
     * 
     * @var string $_sender
     */
    private $_sender;
    
    /**
     * Nombre de la conexión actual
     * 
     * @var string $_currentModule
     */
    private $_currentModule;
    
    
    /**
     * Instancia de un evento que ha sido ejecutado.
     * 
     * @var HisEventoDespachado $_eventDispatched
     */
    private $_eventDispatched;
    
    /**
     * Instancia de la propia clase.
     * 
     * @var ZendExt_Event_Notification  $_instance
     */
    private static $_instance = null; 
    

    /**
     * Identificador de las tareas de notificación.
     */
    const NOTIFICATION_TASK = 'notification';
    
    /**
     * Identificador del módulo de notificaciones.
     */
    const NOTIFICATION_MODULE = 'notificaciones';
    
    /**
     * __construct
     * 
     * Constructor de la clase.
     */
    private function __construct() {        
        try {
            $doctrineManager = Doctrine_Manager :: getInstance();
            $this->_currentModule = $doctrineManager->getCurrentConnection()->getName();
            $this->_sender = ZendExt_GlobalConcept :: getInstance()->Perfil->idusuario;
            $this->_taskRunner = new Amqp_Task_Mgr();
        } catch (Exception $e) {throw $e;
            /*try {              
                $doctrineManager->setCurrentConnection(self :: NOTIFICATION_MODULE);
            } catch (Doctrine_Manager_Exception $ee) {
                $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
				$configApp = new ZendExt_App_Config();
				$configApp->addBdToConfig(self :: NOTIFICATION_MODULE, self :: NOTIFICATION_MODULE_REFERENCE);
				$transactionManager->openConections(self :: NOTIFICATION_MODULE);
				$doctrineManager->setCurrentConnection(self :: NOTIFICATION_MODULE);
            }
            $eventDispatched = new HisEventoDespachado();
            $eventDispatched->exito = 0;
            $eventDispatched->detalles = '[' . $e->getCode() . '] ' .  $e->getMessage();
            $eventDispatched->originadopor = $this->_sender;
            $this->_eventDispatched = $eventDispatched;*/
        }
    }

    /*
     * getInstance
     * Devuelve una única instancia de la clase
     * 
     * @return ZendExt_Event_Notification
     */

    static public function getInstance() {
        if (self :: $_instance == null)
            self :: $_instance = new self();
        return self :: $_instance;
    }

    /*
     * dispatch
     * Ejecuta un evento del sistema que genera notificaciones.
     *
     * @param String  $eventName    Nombre del evento
     * @param array   $serviceArgs  Argumentos del servicio de validación del envío de los avisos.  
     * @param boolean $aspected     
     * @return void
     */

    public function dispatch($eventName, $serviceArgs = null, $aspected = false) {        
		$register = Zend_Registry::getInstance();
        $incidencia = $register::get('incidencia');

        $arguments = array_merge(func_get_args(), array('sender'=>$this->_sender,'fecha'=> date('Y-m-d H:i:s'),'incidencia'=> json_decode($incidencia)));
        if($this->_taskRunner instanceof Amqp_Task_Mgr){                        
            $this->_taskRunner->runTask(self :: NOTIFICATION_TASK, $arguments);
        }
        else{
            /*$idevento = DatEventoModel :: getIdByName($eventName);
            if($idevento){
                $this->_eventDispatched->idevento = $idevento;
                $this->_eventDispatched->save();
            }            
            Doctrine_Manager :: getInstance()->setCurrentConnection($this->_currentModule);*/
        }
    }

}