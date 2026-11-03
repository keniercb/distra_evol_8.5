<?php 
class NomEventoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getEventos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomEvento::getEventos($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomEvento::cantEventos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEventosActivos()
    {
        try {
            $datos = NomEvento::getEventosActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addEvento($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomEvento();
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

    public function updateEvento($idevento, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomEvento::getById($idevento);
            $exis = NomEvento::existeDenom($denominacion);
            if (count($exis) == 0 || $exis[0]['idevento'] == $idevento) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = (empty($fhasta))?null: $fhasta;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteEvento($idevento)
    {
        try {
            $obj = NomEvento::getById($idevento);
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
        return NomEvento::existeDenom($denominacion);
    }
}