<?php

/**
 * Xmpp_Bosh_Standard_Interface
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Bosh_Standard
 * @version 1.0
 */

interface Xmpp_Bosh_Standard_Interface
{
  public function init($config = array());

  public static function getInstance();

  public function attach();
}
