<?php

class ConfigurarValidator
{


    public function comprobarPermisosFicheroConfiguracionTraza()
    {

        if (!is_writable(Zend_Registry:: getInstance()->config->xml->traceconfig))
            throw new ZendExt_Exception('TRAZA001');
        return true;
    }



}