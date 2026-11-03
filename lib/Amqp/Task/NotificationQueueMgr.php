<?php

/**
 * Created by PhpStorm.
 * User: root
 * Date: 5/12/16
 * Time: 11:24
 */
class Amqp_Task_NotificationQueueMgr
{
    private $observable;

    public function __construct() {
        $this->observable = new Amqp_Observable('queue');
    }

    public function runTask($task, $arguments, $properties = array(), $state = 0, $routingKey = null) {
        $data = json_encode(array('task_name' => $task, 'arguments' => $arguments, 'state' => $state));
        $this->observable->publish($data, $properties, $routingKey);
        $this->observable->close();
    }
}