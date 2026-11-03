<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 26/10/2017
 * Time: 11:18
 */

class CapacitacionService extends ZendExt_Model
{

    public function getAccionesByPersona($activo, $idpersona)
    {
        $objModel = new DatAccionparticipanteModel();
        return $objModel->getAccionesByPersona($activo, $idpersona);
    }
}