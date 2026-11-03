<?php

/**
 * Xmpp_Jaxl
 *
 * @author Linea de automatica centro MTA -> UICD
 * @package Xmpp
 * @version 1.0
 */
if (!defined('JAXL_BASE_PATH') || !defined('Xmpp_BASE_PATH')) {
    define('Xmpp_BASE_PATH', dirname(__FILE__));
    define('JAXL_BASE_PATH', Xmpp_BASE_PATH . '/JAXL');
}

require_once JAXL_BASE_PATH . '/core/jaxl.class.php';

class Xmpp_Jaxl extends JAXL {

    private $_wait;

    /**
     * Constructor de la clase
     * 
     * @param array $config
     */
    public function __construct($config=array()) {
        parent::__construct($config);
        $this->_wait = true;
        $this->service = isset($config['service']) ? $config['service'] : 'pubsub.' . $this->domain;
    }

    function startCore() {
        $argv = func_get_args();
        $mode = $argv[0];
        if ($mode) {
            switch ($mode) {
                case 'stream':
                    $this->addPlugin('jaxl_post_connect', array($this, 'startStream'));
                    break;
                case 'component':
                    $this->addPlugin('jaxl_post_connect', array($this, 'startComponent'));
                    break;
                case 'bosh':
                    $this->startBosh();
                    break;
                default:
                    break;
            }
        }

        if ($this->mode == 'cli') {
            try {
                if ($this->connect()) {
                    while ($this->stream && $this->_wait) {
                        $this->getXML();
                    }
                }
            } catch (JAXLException $e) {
                throw $e;
            }
        }
    }

    public function resume() {
        $this->_wait = false;
    }

    public function wait() {
        $this->_wait = true;
        while ($this->stream && $this->_wait) {
            $this->getXML();
        }
    }

}