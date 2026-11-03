<?php

/**
 * Amqp_Worker_Mgr
 * 
 * Clase manejadora de workers de tareas.
 * @package Amqp
 * @subpackage Worker
 * @author Equipo de Arquitectura UCID 
 * @version 1.0
 * @see Amq_Worker_Abstract
 * 
 */
class Amqp_Worker_Mgr {

    private $_observer;
    private $_xmlConfig;
    private $_workerResources;
    private static $_instance = null;

    const XML_TASK_ID = 'task';
    const TASK_INITIAL_STATE = 0;

    private function __construct($cmp = self :: XML_TASK_ID) {
        $this->_observer = new Amqp_Observable($cmp);
        $this->_xmlConfig = ZendExt_FastResponse::getXML(self :: XML_TASK_ID);
        $this->_workerResources = array();
    }

    private static function object2Array($d) {
        if (is_object($d)) {
            $d = get_object_vars($d);
        }
        if (is_array($d)) {
            return array_map(array(__CLASS__, __METHOD__), $d);
        } else {
            return $d;
        }
    }

    public static function getInstance($cmp = self :: XML_TASK_ID) {
        if (self :: $_instance == null)
            self :: $_instance = new self($cmp);
        return self :: $_instance;
    }

    private function createWorker($workername, $workerReference, $args, $task_name) {
        $id = uniqid('worker_');
        if (!is_array($args)) {
            if (is_object($args)) {
                $args = self :: object2Array($args);
            } elseif (is_scalar($args)) {
                $args = array($args);
            }
        }
        print_r($args);
        $argms = "\"" . addslashes(json_encode(array('arguments' => $args))) . "\"";
        $params = implode(' ', array($id, $workername, $workerReference, $argms, $task_name));
        echo $params . "\n";
        $proc_command = 'php dispatch.php ' . $params;
        $this->_workerResources[$id] = proc_open($proc_command, array(), $foo);
    }

    public function taskLoad(Rabbit_Message $msg) {
        $message = ($msg instanceof Rabbit_Message) ? $msg->getBody() : $msg;
        $body = json_decode($message);
        $body->state = $body->state ? $body->state : self :: TASK_INITIAL_STATE;
        $taskNode = $this->_xmlConfig->{$body->task_name};
        if ($taskNode) {
            if ($body->state === self :: TASK_INITIAL_STATE) {
                $args = $body->arguments;
                $workerReference = $taskNode->worker['reference'];
                $workerName = $taskNode->worker['class'];
                $this->createWorker($workerName, $workerReference, $args, $body->task_name);
            } else {
                $this->killWorker($body->state);
            }
        }
        //$this->_observer->queues->{'queue_' . self::XML_TASK_ID}->getChannel()->basic_ack($msg->getDeliveryTag());
    }

    private function killWorker($id) {
        echo "begin killing worker... \n";
        $process = $this->_workerResources[$id];
        $status = proc_get_status($process);
        if ($status['running'] == true) {
            echo "killing worker: " . $id . "\n";
            unset($this->_workerResources[$id]);
            proc_close($process);
            echo "Worker killed. \n";
        }
    }

    public function getActiveWorkers() {
        return $this->_workerResources;
    }

    public function waitTask($queue = null, $consumerTag = null) {
        $callback = array($this, 'taskLoad');
        $this->_observer->subscribe($callback, $queue, $consumerTag);
        $this->observable->close();
    }

}
