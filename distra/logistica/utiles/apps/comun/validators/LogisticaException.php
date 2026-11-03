<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of LogisticaException
 *
 * @author kenier
 */
class LogisticaException extends ZendExt_Exception
{

    private $manejador;

    public function __construct($pIdException, $pInnerException = null, $values = false, $innerMsg = null)
    {
        parent::ZendExt_Exception($pIdException, $pInnerException, $values);
        $this->manejador = false;
        if (!is_null($innerMsg)) {
            $this->manejador = new LogisticaExceptionHandler($this, $innerMsg);
        }
    }
    
    public function handle()
    {
        if ($this->manejador !== false) {
            $this->manejador->handle();
        }else{
            parent::handle();
        }
    }
}
