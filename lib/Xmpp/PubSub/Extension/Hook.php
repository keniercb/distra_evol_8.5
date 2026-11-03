<?php

/**
 * Xmpp_PubSub_Extension_Hook
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_PubSub_Extension
 * @version 1.0
 */

require_once 'Xmpp/PubSub/Helper/Configure.php';

class Xmpp_PubSub_Extension_Hook
{
  protected  $_playload;

  public function __construct()
  {
  }

  /**
   *
   * Se utilza para saber si la autenticación
   * de la entidad es satisfactorio con el
   * servidor jabber
   *
   * @param array $playload
   * @param JAXL $jaxl
   */
  public function postAuth($playload, Xmpp_Jaxl $jaxl)
  {
    $jaxl->resume();
  }

  /**
   *
   * Se utilza para saber si la autenticación
   * de la entidad falló en el servidor jabber
   *
   * @param array $playload
   * @param JAXL $jaxl
   */
  public function postAuthFailure($playload, Xmpp_Jaxl $jaxl)
  {
    $jaxl->resume();
  }

  /**
   *
   * Se utiliza para realizar cualquier acción
   * después de desconexión con el servidor
   * jabber.
   *
   * @param array $playload
   * @param JAXL $jaxl
   */
  public function postDisconnect($playload, Xmpp_Jaxl $jaxl)
  {
    $jaxl->shutdown();
  }

  /**
   *
   * Obtiene el resultado final de la
   * interacción con el servicio pubsub
   * del servidor jabberd.
   *
   * @param array $playload
   * @param JAXL $jaxl
   * @return void
   */
  public function playLoad($playload, Xmpp_Jaxl $jaxl)
  {
    $this->_playload = $playload;
    $jaxl->resume();
  }

  /**
   *
   * Devuelve el resultado final de la
   * interacción con el servicio pubsub
   * del servidor jabberd.
   *
   * @return array
   */
  public function response()
  {
    return $this->_playload;
  }
}
