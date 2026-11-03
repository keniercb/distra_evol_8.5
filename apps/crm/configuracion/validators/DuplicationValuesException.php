<?php

/**
 * DuplicationValuesException
 * 
 * @author Tte. Darien Cabrera O.
 * @package Model.
 * @subpackage Excepciones del dominio.
 * @copyright UCID
 * @version 1.0
 */
class DuplicationValuesException extends Exception
{
    public function __construct($message, $code, Exception $previous)
    {
        parent::__construct((empty($message))?'Existe duplicidad de valores.':$message, $code, $previous);
    }
}