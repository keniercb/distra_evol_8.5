<?php

/**
 * Xmpp_Helper_Build
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Helper
 * @version 1.0
 */

require_once 'Xmpp/Jaxl.php';
require_once 'Xmpp/Exception/Cancel.php';
require_once 'Xmpp/Exception/Auth.php';
require_once 'Xmpp/Exception/Modify.php';
require_once 'Xmpp/Helper/Config.php';

class Xmpp_Helper_Build
{
  /**
   *
   * Crea un una instancia de la clase JAXL para
   * su uso por el componente
   *
   * @param array $config
   * @return JAXL
   */
  static public function buildJAXL($config)
  {
    $dconfig = Xmpp_Helper_Config::getInstance()->toArray();

    $mconfig = array_merge($dconfig,$config);

    $mconfig['logPath'] =  Xmpp_BASE_PATH . '/Log/jaxl.log';
    $mconfig['pidPath'] =  JAXL_BASE_PATH . '/pid/jaxl.pid';
    $mconfig['boshCaInfo'] = (isset($mconfig['boshCaInfo']) && $mconfig['boshCaInfo']) ? Xmpp_BASE_PATH . '/Config/ca.crt' : "";

    $jaxl = new Xmpp_Jaxl($mconfig);

    return $jaxl;
  }

  /**
   *
   * Enter description here ...
   * @param array $result
   */
  static public function buildResult($result)
  {
    $bool = false;

    if(isset($result['type']))
    {
      switch ($result['type'])
      {
        case 'result':
          $bool = true;
          break;

        case 'error':
          switch ($result['errorType'])
          {
            case 'cancel':
              throw new Xmpp_Exception_Cancel($result['errorCondition'], $result['errorCode']);
              break;

            case 'modify':
              throw new Xmpp_Exception_Modify($result['errorCondition'], $result['errorCode']);
              break;

            case 'auth':
              throw new Xmpp_Exception_Auth($result['errorCondition'], $result['errorCode']);
              break;
          }
          break;
      }
    }

    return $bool;
  }
}

