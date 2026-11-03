<?php

class CamposContableServices extends ZendExt_Model
{

    public function CamposContableServices()
    {
        parent::ZendExt_Model();
    }

    /**
     *    Este servicio obtiene un Campo Contable por su identificador
     */
    public function obtenerCampoContablePorId($idCampo)
    {
        if (is_numeric($idCampo)) {
            return NomCamposContables::GetById($idCampo, true);
        }
    }

}
