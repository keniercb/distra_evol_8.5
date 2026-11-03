<?php

class PortalValidator
{

    public function desbloquearDocLog()
    {
        $ioc = ZendExt_IoC::getInstance();
        $global = ZendExt_GlobalConcept::getInstance();
        $idusuario = $global->Perfil->idusuario;
        try {
            $ioc->logistica->desbloqueardocByIdusuario($idusuario);
        } catch (Exception $e) {
            return false;
        }

        return true;
    }
}

