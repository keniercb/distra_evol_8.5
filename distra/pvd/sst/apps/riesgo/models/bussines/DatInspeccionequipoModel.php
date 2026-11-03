<?php 
class DatInspeccionequipoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getInspeccionesByEquipo($idequipoaltoriesgo, $limit = null, $start = 0)
    {
        try {
            $obj = new DatInspeccionequipo();
            $datos = $obj->getInspeccionByEquipo($idequipoaltoriesgo, $limit, $start);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantInspeccionByEquipo($idequipoaltoriesgo);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addInspeccionequipo($idequipoaltoriesgo, $idtipoinspeccion, $idresultadoinspeccion, $fplan,
        $finspeccion)
    {
        try {
            $obj = new DatInspeccionequipo();
            $obj->idequipoaltoriesgo = $idequipoaltoriesgo;
            $obj->idtipoinspeccion = $idtipoinspeccion;
            $obj->idresultadoinspeccion = $idresultadoinspeccion;
            $obj->fplan = $fplan;
            $obj->finspeccion = $finspeccion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function updateInspeccionequipo($idinspeccionequipo, $idequipoaltoriesgo, $idtipoinspeccion,
        $idresultadoinspeccion, $fplan, $finspeccion)
    {
        try {
            $obj = DatInspeccionequipo::getById($idinspeccionequipo);
            $obj->idequipoaltoriesgo = $idequipoaltoriesgo;
            $obj->idtipoinspeccion = $idtipoinspeccion;
            $obj->idresultadoinspeccion = $idresultadoinspeccion;
            $obj->fplan = $fplan;
            $obj->finspeccion = (empty($finspeccion))?null: $finspeccion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function deleteInspeccionequipo($idinspeccionequipo)
    {
        try {
            $obj = DatInspeccionequipo::getById($idinspeccionequipo);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}