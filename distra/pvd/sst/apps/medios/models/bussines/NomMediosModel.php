<?php 
class NomMediosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getMedios($filtro, $inicio, $limit)
    {
        try {
            $datos = NomMedios::getMedios($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripción':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomMedios::cantgetMedios($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }
//
    public function getMediosActivos()
    {
        try {
            $datos = NomMedios::getMediosActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }
//
    public function addMedios($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomMedios();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
//
    public function updateMedios($idmedio, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomMedios::getById($idmedio);
            $denom = NomMedios::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }
//
    public function deleteMedios($idmedio)
    {
        try {
            $obj = NomMedios::getById($idmedio);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function existeDenom($denominacion)
    {
        return NomMedios::existeDenom($denominacion);
    }
}