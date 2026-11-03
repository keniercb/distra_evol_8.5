<?php
    class ZendExt_Event {
        static private $_instance;
        static private $_xml;

        private function  __construct() {
            self :: $_xml = ZendExt_FastResponse::getXML('events');
        }

        static function getInstance () {
            if (! self::$_instance)
                self::$_instance = new self ();
            return self::$_instance;
        }

        function dispatch ($pEvent, $pParams = array ()) {
            $xml = self::$_xml->$pEvent;
            if ((string) $xml['enabled'] == '1') {
                foreach ($xml->observers->children () as $observer) {
                    $observerClassName = (string) $observer ['class'];
                    $observerMethodName = (string) $observer ['method'];
                    $observerInstance = new $observerClassName ();
                    call_user_func_array(array ($observerInstance, $observerMethodName), array ($pParams));
                }
            }
        }
    }