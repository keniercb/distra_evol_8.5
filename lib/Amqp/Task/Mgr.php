<?php
/**
 * Amqp_Task_Mgr
 * 
 * Clase manejadora de tareas (ie: Tareas de notificación, supervición etc...).
 * @package Amqp
 * @subpackage Task
 * @author Equipo de arquitectura UCID.
 * @version 1.0
 * 
 */
class Amqp_Task_Mgr {

    private $observable;

    public function __construct() {
        $this->observable = new Amqp_Observable('task');
    }

    public function runTask($task, $arguments, $properties = array(), $state = 0, $routingKey = null) {
        $data = json_encode(array('task_name' => $task, 'arguments' => $arguments, 'state' => $state)); 		
        $this->observable->publish($data, $properties, $routingKey);
        $this->observable->close();
    }

}