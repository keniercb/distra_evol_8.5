<?php
class EstructcontrolService extends ZendExt_Model
{
    public function getEstructurasControlByDominioyEstructura($iddominio, $idestructura)
    {
        $objModel = new DatDominioestructuracontrolModel();
        return $objModel->getEstructurascontrolByDominioyEstructura($iddominio, $idestructura);
    }

    public function getControladosByDominioEstructuraPersona($iddominio, $idestructura, $idpersona)
    {
        $objModel = new DatDominioestructuracontrolModel();
        return $objModel->getControladosByDominioEstructuraPersona($iddominio, $idestructura, $idpersona);
    }

     public function getControledByDominioEstructuraPersonaPluriempleo($iddominio, $idestructura, $idpersona)
    {
        $objModel = new DatDominioestructuracontrolModel();
        return $objModel->getControladosByDominioEstructuraPersonaPluriempleo($iddominio, $idestructura, $idpersona);
    }


    public function getControlerByDominioEstructuraPersonaPluriempleo($iddominio, $idestructura, $idpersona)
    {
        $DEC = new DatDominioestructuracontrol();
        $controlador = $DEC->getControladorByDominioEstructuraPersona($iddominio, $idestructura, $idpersona);
        return $controlador;
    }

    public function getEstructurasControlTiene($iddominio, $idestructura)
    {
        $objModel = new DatDominioestructuracontrolModel();
        return $objModel->getControladosTiene($iddominio, $idestructura);
    }

    public function getEstructurascontrolEvaluaciones($iddominio, $idestructura)
    {
        $objModel = new DatDominioestructuracontrolModel();
        return $objModel->getEstructurascontrolEvaluaciones($iddominio, $idestructura);
    }
}