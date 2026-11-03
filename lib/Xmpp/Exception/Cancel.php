<?php

/**
 * Xmpp_Exception_Cancel
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_Exception
 * @version 1.0
 */

class Xmpp_Exception_Cancel extends Exception
{
  public function __construct($message, $code)
  {
    parent::__construct($message, $code);
  }
}