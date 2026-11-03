<?php

/**
 * Xmpp_Bosh_Extension_Hook
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Bosh_Extension
 * @version 1.0
 */

class Xmpp_Bosh_Extension_Hook
{

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
}