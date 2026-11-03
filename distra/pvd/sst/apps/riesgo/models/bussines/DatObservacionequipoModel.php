<?php 
class DatObservacionequipoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getObservacionByEquipo($idequipoaltoriesgo, $limit = null, $start = 0)
    {
        try {
            $obj = new DatObservacionequipo();
            $datos = $obj->getObservacionByEquipo($idequipoaltoriesgo, $limit, $start);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantObservacionByEquipo($idequipoaltoriesgo);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addObservacionequipo($idequipoaltoriesgo, $observacion)
    {
        try {
            $obj = new DatObservacionequipo();
            $obj->idequipoaltoriesgo = $idequipoaltoriesgo;
            $obj->observacion = $observacion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function updateObservacionequipo($idobservacionequipo, $idequipoaltoriesgo, $observacion)
    {
        try {
            $obj = DatObservacionequipo::getById($idobservacionequipo);
            $obj->idequipoaltoriesgo = $idequipoaltoriesgo;
            $obj->observacion = $observacion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function deleteObservacionequipo($idobservacionequipo)
    {
        try {
            $obj = DatObservacionequipo::getById($idobservacionequipo);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}