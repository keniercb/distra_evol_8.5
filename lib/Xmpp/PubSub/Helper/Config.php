<?php

/**
 * Xmpp_PubSub_Helper_Config
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_PubSub_Helper
 * @version 1.0
 */

require_once 'Zend/Config/Ini.php';

class Xmpp_PubSub_Helper_Config
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
      $pubsub = Xmpp_BASE_PATH . '/PubSub/Config/Pubsub.ini';
      $this->_config = new Zend_Config_Ini($pubsub);
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
    $config['service'] = $this->_config->pubsub->service;

    return $config;
  }
}

