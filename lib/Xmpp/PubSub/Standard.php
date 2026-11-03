<?php

/**
 * Xmpp_PubSub_Standard
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Pubsub
 * @version 1.0
 */

require_once 'Xmpp/Helper/Build.php';
require_once 'Xmpp/PubSub/Helper/Configure.php';
require_once 'Xmpp/PubSub/Extension/Hook.php';
require_once 'Xmpp/PubSub/Standard/Interface.php';

class Xmpp_Pubsub_Standard implements Xmpp_Pubsub_Standard_Interface
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
   * @throws Xmpp_Exception_Cancel
   */
  public function init($config = array())
  {
    $this->_jaxl = Xmpp_Helper_Build::buildJAXL($config);

    $hook = new Xmpp_PubSub_Extension_Hook();

    $this->_jaxl->requires(array('JAXL0060'));
    $this->_jaxl->addPlugin('jaxl_post_auth', array($hook, 'postAuth'));
    $this->_jaxl->addPlugin('jaxl_post_auth_failure', array($hook, 'postAuthFailure'));
    $this->_jaxl->addPlugin('jaxl_post_disconnect', array($hook, 'postDisconnect'));

    try {
      $this->_jaxl->startCore('stream');
    }catch (JAXLException $e)
    {
      $result = array(
	  		   'type' => 'error',
	           'errorType' => 'cancel',
	           'errorCondition' => "Servidor apagado",
	           'errorCode' => 501
      );

      Xmpp_Helper_Build::buildResult($result);
    }

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
   * Enter description here ...
   *
   * @return Xmpp_Pubsub_Standard
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
   * Devuelve las subcripciones de los nodos
   * activos en el servicio.
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getNodeSubscriptions()
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getNodeSubscriptions', $to, $from, $callback);

    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Devuelve las afiliaciones de los nodos
   * activos en el servicio.
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getNodeAffiliations()
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getNodeAffiliations', $to, $from, $callback);

    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Subcribe una entidad a un nodo activo
   * en el servicio.
   *
   * @param string $node
   * @param string $subJid
   * @param array $options
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function subscribe($node, $subJid=false, $options = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $options = ($options != false) ? Xmpp_PubSub_Helper_Configure::subscriptionOption($options) : false;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('subscribe', $to, $from, $node, $callback, $subJid, $options);

    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Unsubcribe una entidad subcrita a un nodo
   * activo en el servicio.
   *
   * @param string $node
   * @param string $subJid
   * @param string $subid
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function unsubscribe($node, $subJid=false, $subId=false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('unsubscribe', $to, $from, $node, $callback, $subJid, $subId);

    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Devuelve las opciones de subcripción de una entidad
   * subcrita a un nodo activo en el servicio.
   *
   * @param string $node
   * @param string $subJid
   * @param string $subId
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getSubscriptionOption($node, $subJid=false, $subId = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getSubscriptionOption', $to, $from, $node, $callback, $subJid, $subId);

    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Devuelve las opciones permitidas por los nodos activos
   * en el serviciio.
   *
   * @param string $node
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getDefaultSubscriptionOption($node)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getDefaultSubscriptionOption', $to, $from, $node, $callback);

    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Permite modificar las opciones de subcripció de una
   * entidad a un nodo activo en el servicio.
   *
   * @param string $node
   * @param array $options
   * @param string $subJid
   * @param string $subId
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function setSubscriptionOption($node, $options, $subJid=false, $subId = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $options = ($options!= false ) ? Xmpp_PubSub_Helper_Configure::subscriptionOption($options) : false;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('setSubscriptionOption', $to, $from, $node, $options, $callback, $subJid, $subId);

    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Devuelve los items de un nodo activo en el servicio.
   *
   * @param string $node
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getNodeItems($node)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getNodeItems', $to, $from, $node, $callback);

    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Devuelve el item de un node activo en el servicio.
   *
   * @param string $node
   * @param array $itemID
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getNodeItemsByItemID($node, $itemID)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getNodeItemsByItemID', $to, $from, $node, $itemID, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Publica un item en un nodo activo del servicio.
   *
   * @param string $node
   * @param string $item
   * @param string $itemId
   * @param array $options
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function publishItem($node, $item, $itemId=false, $options=false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $options = ($options != false ) ? Xmpp_PubSub_Helper_Configure::publishOption($options) : false;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('publishItem', $to, $from, $node, $item, $callback, $itemId, $options);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Elimina un item de un nodo activo en el servicio.
   *
   * @param string $node
   * @param string $itemId
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function deleteItem($node, $itemId)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('deleteItem', $to, $from, $node, $itemId, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Crea un nodo en el servicio.
   *
   * @param string $node
   * @param array $configure
   * @param string $type
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function createNode($node, $configure = false, $type = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $configure = ($configure != false) ? Xmpp_PubSub_Helper_Configure::createNode($configure) : false;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('createNode', $to, $from, $node, $callback, $configure, $type);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Modifica la configuración de un nodo
   * activo en el servicio.
   *
   * @param string $node
   * @param array $configure
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function configureNode($node, $configure)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $configure = ($configure != false) ? Xmpp_PubSub_Helper_Configure::updateNode($configure) : false;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('configureNode', $to, $from, $node, $configure, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Devuelve la configuración de un nodo
   * activo en el servicio
   *
   * @param string $node
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getNodeConfig($node)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getNodeConfig', $to, $from, $node, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Devuelve la configuración por defecto
   * de los nodos del servicio.
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getDefaultNodeConfig()
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getDefaultNodeConfig', $to, $from, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Elimina un nodo activo en el servicio.
   *
   * @param string $node
   * @param string $redirectURI
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function deleteNode($node, $redirectURI=false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('deleteNode', $to, $from, $node, $callback, $redirectURI);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Elimina los items de un nodo activo
   * en el servicio.
   *
   * @param string $node
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function purgeNode($node)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('purgeNode', $to, $from, $node, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Devuelve las subcripciones de un nodo
   * activo en el servicio.
   *
   * @param string $node
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getSubscriberList($node)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getSubscriberList', $to, $from, $node, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Modifica las subcripciones de algunas
   * entidades subcritas a un nodo activo
   * en el servicio.
   *
   * @param string $node
   * @param array $jid
   * @param array $subscription
   * @param array $subid
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function updateSubscription($node, $jid, $subscription, $subid = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('updateSubscription', $to, $from, $node, $jid, $subscription, $subid, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Devuelve los afiliados de un nodo
   * activo en el servicio.
   *
   * @param string $node
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function getAffiliationList($node)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('getAffiliationList', $to, $from, $node, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Modifica las afiliaciones de algunas
   * entidades alfiliadas a un nodo activo
   * en el servicio.
   *
   * @param string $node
   * @param array $jid
   * @param array $affiliation
   *
   * @return bool
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function updateAffiliation($node, $jid, $affiliation)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('updateAffiliation', $to, $from, $node, $jid, $affiliation, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return $bool;
  }

  /**
   *
   * Modifica las afiliaciones de algunas
   * entidades alfiliadas a un nodo activo
   * en el servicio.
   *
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function discoFeatures()
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('discoFeatures', $to, $from, $callback);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Modifica las afiliaciones de algunas
   * entidades alfiliadas a un nodo activo
   * en el servicio.
   *
   * @param $node
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function discoNodes($node = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('discoNodes', $to, $from, $callback, $node);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Modifica las afiliaciones de algunas
   * entidades alfiliadas a un nodo activo
   * en el servicio.
   *
   * @param $node
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function discoNodeInfo($node = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('discoNodeInfo', $to, $from, $callback, $node);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Modifica las afiliaciones de algunas
   * entidades alfiliadas a un nodo activo
   * en el servicio.
   *
   * @param $node
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function discoNodeMeta($node = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('discoNodeMeta', $to, $from, $callback, $node);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }

  /**
   *
   * Modifica las afiliaciones de algunas
   * entidades alfiliadas a un nodo activo
   * en el servicio.
   *
   * @param $node
   * @return array
   * @throws Xmpp_Exception_Auth
   * @throws Xmpp_Exception_Cancel
   * @throws Xmpp_Exception_Modify
   */
  public function discoNodeItems($node = false)
  {
    $hook = new Xmpp_PubSub_Extension_Hook();
    $to =   $this->_jaxl->service;
    $from = $this->_jaxl->bareJid;
    $callback = array($hook, 'playLoad');

    $this->_jaxl->JAXL0060('discoNodeItems', $to, $from, $callback, $node);
    $this->_jaxl->wait();
    $result = $hook->response();
    $bool   = Xmpp_Helper_Build::buildResult($result);

    return ($bool == true) ? $result : array();
  }
}


