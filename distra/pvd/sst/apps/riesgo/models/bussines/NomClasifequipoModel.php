<?php 
class NomClasifequipoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getClasificaciones($filtro, $inicio, $limit)
    {
        try {
            $datos = NomClasifequipo::getClasificaciones($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomClasifequipo::cantClasificaciones($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getClasificacionesActivos()
    {
        try {
            $datos = NomClasifequipo::getClasificacionesActivos();
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
            $obj = new NomClasifequipo();
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

    public function update($idclasifequipo, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomClasifequipo::getById($idclasifequipo);
            $denom = NomClasifequipo::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idclasifequipo'] == $idclasifequipo) {
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

    public function delete($idclasifequipo)
    {
        try {
            $obj = NomClasifequipo::getById($idclasifequipo);
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
        return NomClasifequipo::existeDenom($denominacion);
    }
}