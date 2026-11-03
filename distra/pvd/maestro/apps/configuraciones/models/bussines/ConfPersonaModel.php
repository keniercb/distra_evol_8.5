<?php

/**
 * @name ConfRegistrounicoModel - Clase de logica de negocio para la configuracion de loc conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfPersonaModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function getCfgpersona()
    {
        $obj = new ConfPersona();
        $datos = $obj->getFirma();
        foreach ($datos as $key => $value) {
            $name = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona($value['idpersona']);
            $result[$key]->nombreapellidos = $name->data[0]['nombreapellidos'];
            $result[$key]->idpersona = $value['idpersona'];
            $result[$key]->idfirma = $value['idfirma'];
            $result[$key]->identidad = $value['identidad'];
            $result[$key]->elabora = $value['elabora'];
            $result[$key]->aprueba = $value['aprueba'];
        }
        return $result;
    }

    public function addConf($idepersona, $aprueba, $elabora)
    {
        $obj = new ConfPersona();
        $identidad = $this->global->Estructura->idestructura;

        $obj->idpersona = $idepersona;
        $obj->identidad = $identidad;

        if ($elabora == 'true') {
            $obj->elabora = 1;
        } else {
            $obj->elabora = 0;
        }
        if ($aprueba == 'true') {
            $obj->aprueba = 1;
        } else {
            $obj->aprueba = 0;
        }
//print_r($obj->toArray());die;
        $obj->save();
    }

    public function delConf($idfirma)
    {
        $identidad = $this->global->Estructura->idestructura;
        foreach ($idfirma as $k => $v) {
            $query = new Doctrine_Query ();
            try {
                $query->delete()->from('ConfPersona')->where("idfirma = '$v' and identidad='$identidad '")->execute();
            } catch (Exception $e) {
                if ($e->GetCode() == 23503) {
                    return false;
                }
            }
        }
        return true;

    }

    public function updConf($idfirma,$idepersona, $aprueba, $elabora)
    {

        try {
        $result = ConfPersona::updConf($idfirma,$idepersona, $aprueba, $elabora);
            return $result;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }


}
