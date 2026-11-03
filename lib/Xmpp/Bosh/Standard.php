<?php

/**
 * Xmpp_Bosh_Standard
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Bosh
 * @version 1.0
 */

require_once 'Xmpp/Helper/Build.php';
require_once 'Xmpp/Bosh/Extension/Hook.php';
require_once 'Xmpp/Bosh/Standard/Interface.php';

class Xmpp_Bosh_Standard implements Xmpp_Bosh_Standard_Interface
{
  protected static $_instance = null;
  protected $_jaxl;

  /**
   *
   * Enter description here ...
   */
  protected function __construct()
  {
  }

  /**
   *
   * Valores de inicialización que se utiliza
   * para la comunicación con el servidor de jabber.
   *
   * @param array $settins
   * @return void
   * @throws Xmpp_Exception_Auth
   */
  public function init($config = array())
  {
    $this->_jaxl = Xmpp_Helper_Build::buildJAXL($config);

    $hook = new Xmpp_Bosh_Extension_Hook();

    $this->_jaxl->requires(array('JAXL0206'));
    $this->_jaxl->addPlugin('jaxl_post_auth', array($hook, 'postAuth'));
    $this->_jaxl->addPlugin('jaxl_post_auth_failure', array($hook, 'postAuthFailure'));
    $this->_jaxl->addPlugin('jaxl_post_disconnect', array($hook, 'postDisconnect'));
    $this->_jaxl->startCore('bosh');

    if(!$this->_jaxl->auth)
    {
      $result = array(
	  		  'type' => 'error',
	          'errorType' => 'auth',
	          'errorCondition' => "Login fail",
	          'errorCode' => 500
      );

      Xmpp_Helper_Build::buildResult($result);
    }
  }

  /**
   *
   * Construye un objeto Xmpp_Bosh_Standard
   *
   * @return Xmpp_Bosh_Standard
   */
  public static function getInstance()
  {
    if(self::$_instance === null)
    {
      self::$_instance = new self();
    }

    return self::$_instance;
  }

  /**
   *
   * Obtiene las parametros de comunicación
   * para el componente strophe
   * @return array
   */
  public function attach()
  {
    $result = array(
    		'sid'  => $this->_jaxl->bosh['sid'],
    		'rid'  => $this->_jaxl->bosh['rid'],
    		'url'  => $this->_jaxl->bosh['url'],
    		'jid'  => $this->_jaxl->bosh['jid'],
    		'bare' => $this->_jaxl->bareJid
    );

    return $result;
  }
}