<?php

/**
 * Xmpp_Bosh_Helper_Config
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Bosh_Helper
 * @version 1.0
 */

require_once 'Zend/Config/Ini.php';

class Xmpp_Bosh_Helper_Config
{
  private static $_instance = null;
  private $_config = null;

  /**
   *
   * Enter description here ...
   */
  static public function getInstance()
  {
    if(self::$_instance === null)
    {
      self::$_instance = new self();
      self::$_instance->init();
    }

    return self::$_instance;
  }

  /**
   *
   * Enter description here ...
   */
  private function __construct()
  {
  }

  /**
   *
   * Enter description here ...
   */
  private function init()
  {
    if($this->_config === null)
    {
      $bosh = Xmpp_BASE_PATH . '/Bosh/Config/Bosh.ini';
      $this->_config = new Zend_Config_Ini($bosh);
    }
  }

  /**
   *
   * Enter description here ...
   * @return array
   */
  public function toArray()
  {
    $config = array();
    $config['boshOut'] = (isset($this->_config->bosh->out) && $this->_config->bosh->out) ? true : false;
    $config['boshSsl'] = (isset($this->_config->bosh->ssl) && $this->_config->bosh->ssl) ? true : false;
    $config['boshCaInfo'] = (isset($this->_config->bosh->caInfo) && $this->_config->bosh->caInfo) ? "" : "";
    $config['boshSslVerifyPeer'] = (isset($this->_config->bosh->sslVerifyPeer) && $this->_config->bosh->sslVerifyPeer) ? true : false;
    $config['boshSslVerifyHost'] = (isset($this->_config->bosh->sslVerifyHost)) ? $this->_config->bosh->sslVerifyHost : 1;
    $config['boshPort'] = (isset($this->_config->bosh->port)) ? $this->_config->bosh->port : 5280;
    $config['boshHost'] = (isset($this->_config->bosh->host)) ? $this->_config->bosh->bost : 'localhost';
    $config['mode'] = (isset($this->_config->bosh->mode)) ? $this->_config->bosh->mode : 'cgi';

    return $config;
  }
}


