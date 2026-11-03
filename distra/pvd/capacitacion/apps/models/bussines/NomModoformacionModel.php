<?php 
class NomModoformacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getModos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomModoformacion::getModos($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    if (empty($val['descripcion'])) {
                        $datos[$i]['descripcion'] = 'Sin descripci&oacute;n';
                    } else {
                        $datos[$i]['descripcion'] = $val['descripcion'];
                    }
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomModoformacion::cantModos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getModosActivos()
    {
        try {
            $datos = NomModoformacion::getModosActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addModo($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomModoformacion();
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

    public function updateModo($idmodoformacion, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomModoformacion::getById($idmodoformacion);
            $denom = NomModoformacion::existeDenom($denominacion);
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

    public function deleteModo($idmodoformacion)
    {
        try {
            $obj = NomModoformacion::getById($idmodoformacion);
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
        return NomModoformacion::existeDenom($denominacion);
    }
}