<?php 
class NomTipoinvalidezModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTipos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomTipoinvalidez::getTipos($filtro, $inicio, $limit);
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
            $resp->cantidad = NomTipoinvalidez::cantTipos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTiposActivos()
    {
        try {
            $datos = NomTipoinvalidez::getTiposActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addTipo($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomTipoinvalidez();
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

    public function updateTipo($idtipoinvalidez, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomTipoinvalidez::getById($idtipoinvalidez);
            $denom = NomTipoinvalidez::existeDenom($denominacion);
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

    public function deleteTipo($idtipoinvalidez)
    {
        try {
            $obj = NomTipoinvalidez::getById($idtipoinvalidez);
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
        return NomTipoinvalidez::existeDenom($denominacion);
    }
}