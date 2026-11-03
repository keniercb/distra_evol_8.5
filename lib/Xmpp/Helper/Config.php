<?php

/**
 * Xmpp_Helper_Config
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Helper
 * @version 1.0
 */

require_once 'Zend/Config/Ini.php';

class Xmpp_Helper_Config
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
      $xmpp = Xmpp_BASE_PATH . '/Config/Xmpp.ini';
      $this->_config = new Zend_Config_Ini($xmpp);
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
    $config['host'] = $this->_config->xmpp->host;
    $config['port'] = $this->_config->xmpp->port;
    $config['domian'] = $this->_config->xmpp->domian;
    $config['user'] = $this->_config->xmpp->user;
    $config['pass'] = $this->_config->xmpp->pass;
    $config['logLevel'] = $this->_config->xmpp->logLevel;
    $config['authType'] = $this->_config->xmpp->authType;

    return $config;
  }
}

