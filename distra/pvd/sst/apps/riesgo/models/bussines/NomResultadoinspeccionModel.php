<?php 
class NomResultadoinspeccionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getResultadoinspeccion($filtro, $inicio, $limit)
    {
        try {
            $datos = NomResultadoinspeccion::getResultadoInspeccion($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomResultadoinspeccion::cantResultadoInspeccion($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getResultadoinspeccionActivos()
    {
        try {
            $datos = NomResultadoinspeccion::getResultadoInspeccionActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomResultadoinspeccion();
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

    public function update($idresultadoinspeccion, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomResultadoinspeccion::getById($idresultadoinspeccion);
            die($idresultadoinspeccion);
            $denom = NomResultadoinspeccion::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idresultadoinspeccion'] == $idresultadoinspeccion) {
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

    public function delete($idresultadoinspeccion)
    {
        try {
            $obj = NomResultadoinspeccion::getById($idresultadoinspeccion);
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
        return NomResultadoinspeccion::existeDenom($denominacion);
    }
}