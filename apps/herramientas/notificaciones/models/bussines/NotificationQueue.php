<?php

/**
 * Created by PhpStorm.
 * User: root
 * Date: 2/12/16
 * Time: 9:59
 */
class NotificationQueue extends ZendExt_Model
{
    const TYPE_EMAIL = 0;
    const TYPE_XMPP = 1;

    private $queue;
    private $type;

    public function __construct ($type = self::TYPE_EMAIL) {
        $this->queue = new SplQueue();
        $this->type = $type;
    }

    public function getQueue () {
        return $this->queue;
    }

    public function processQueue () {
        $this->queue->setIteratorMode(SplDoublyLinkedList::IT_MODE_DELETE);
        foreach ($this->queue as $data) {
            array_unshift($data, $this->type);

            $this->publishMsg(json_decode(json_encode($data)));
        }
    }

    private function publishMsg ($data) {
        $mgr = new Amqp_Task_NotificationQueueMgr();
        $mgr->runTask('notification_queue', $data);
    }
}