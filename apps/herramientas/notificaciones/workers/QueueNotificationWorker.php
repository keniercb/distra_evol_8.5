<?php

/**
 * Created by PhpStorm.
 * User: root
 * Date: 5/12/16
 * Time: 13:48
 */
class QueueNotificationWorker extends Amqp_Worker_Abstract
{
    public function __construct($idProcess)
    {
        parent:: __construct($idProcess);
    }

    public function work ($args)
    {
		//var_dump($args);die;
        $args = get_object_vars($args);
        if($args[0]){
            $this->sendJabberNotification($args);
        } else {
            $this->sendEmailNotification($args);
        }
    }

    private function sendJabberNotification($args)
    {
        $xml = new SimpleXMLElement(file_get_contents(DIR_ABS_MT."apps/comun/recursos/xml/servers.xml"));
        $sjabber = (string)$xml->jabber['denominacion'];
        $ioc = ZendExt_IoC::getInstance();
        if($sjabber != null) {
            $ioc->notification->sendJabberNotification(array($args[1]), $args[2], $sjabber);
        }
    }

    private function sendEmailNotification($args)
    {
		var_dump('por aqui no pasa');die;
        $xml = new SimpleXMLElement(file_get_contents(DIR_ABS_MT."apps/comun/recursos/xml/servers.xml"));
        $semail = (string)$xml->email['denominacion'];
        $ioc = ZendExt_IoC::getInstance();
        if($semail != null) {
            $ioc->notification->sendPHPEmail(array($args[1]), $args[2], $args[3], $semail);
        }
    }
}
