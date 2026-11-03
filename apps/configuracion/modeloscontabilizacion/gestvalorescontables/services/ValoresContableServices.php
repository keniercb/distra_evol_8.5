<?php

class ValoresContableServices extends ZendExt_Model
{

    public function ValoresContableServices()
    {
        parent::ZendExt_Model();
    }

    /**
     *    Este servicio obtiene un Valor Contable por su identificador
     */
    public function obtenerValorContablePorId($idvalorcontable)
    {
        if (is_numeric($idvalorcontable)) {
            return NomValoresContables::GetById($idvalorcontable, true);
        }
    }

}
