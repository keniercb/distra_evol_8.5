<?php

/**
 * Created by PhpStorm.
 * User: kmilo
 * Date: 30/6/2018
 * Time: 14:29
 */
class CheckIntegrityValidator
{

    public function validarAccesoLogsAIDE()
    {
        if (!is_readable('/var/log/aide/aide.log'))
            throw new ZendExt_Exception('SEGINTEGRIDAD01');
        return true;
    }

    public function validarInstalacionAIDE(){
        if(!CheckintegrityController::estaInstaladoAIDE())
            throw new ZendExt_Exception('SEGINTEGRIDAD03');
        return true;
    }

    public function validarEscaneoActivo(){
        if(!HisIntegridadFicherosModel::cargarConfiguracion()->escaneoActivo)
            throw new ZendExt_Exception('SEGINTEGRIDAD04');
        return true;
    }


}