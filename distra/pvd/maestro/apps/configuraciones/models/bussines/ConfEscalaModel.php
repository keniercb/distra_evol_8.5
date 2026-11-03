<?php
class ConfEscalaModel extends ZendExt_Model
{

    public function getEscalas($filtro, $inicio, $limit)
    {
        try {
            $datos = ConfEscala::getEscalas($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = ConfEscala::cantEscalas($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEscalasActivas($tipo)
    {
        try {
            $datos = ConfEscala::getEscalasActivas($tipo);
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getValoresByEscala($idescala, $filtro, $start, $limit)
    {
        try {
            $obj = ConfEscala::getById($idescala);
//            print('<pre>');
//            print_r($obj->toArray());die;
            if ($obj->tipo == 1) {
                $datos = DatEscalacualitativa::getValoresByEscala($idescala, $filtro, $start, $limit);
            } else {
                $datos = DatEscalanumerica::getValoresByEscala($idescala, $filtro, $start, $limit);
            }
            if (count($datos)==0) {
                $datos = Array();
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDenomValorByIdEscalaIdValor($idescala, $idvalor)
    {
        try {
            $obj = ConfEscala::getById($idescala);
            if ($obj->tipo == 1) {
                $datos = NomValorcualitativo::getById($idvalor);
                return $datos->denominacion;
            } else {
                $datos = DatEscalanumerica::getById($idvalor);
                return $datos->valor;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getValorByIdEscalaIdValor($idescala, $idvalor)
    {
        try {
            $result = new stdClass();
            $obj = ConfEscala::getById($idescala);
            if ($obj->tipo == 1) {
                $datos = NomValorcualitativo::getById($idvalor);
                $ec = DatEscalacualitativa::getEscalaCulitativa($idescala, $idvalor);
                $result->valor = $datos->denominacion;               
                $result->peso = $ec[0]['peso'];
                $result->tipo = 1;
            } else {
                $datos = DatEscalanumerica::getById($idvalor);
                $result->valor = $datos->valor;
                $result->tipo = 0;
            }
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }


    public function addEscala($denominacion, $descripcion, $fdesde, $fhasta, $tipo)
    {
        try {
            $obj = new ConfEscala();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->tipo = $tipo;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateEscala($idescala, $denominacion, $descripcion, $fdesde, $fhasta, $tipo)
    {
        try {
            $obj = ConfEscala::getById($idescala);
            $denom = ConfEscala::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idescala'] == $obj->idescala) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->tipo = $tipo;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteEscala($idescala)
    {
        try {
            $obj = ConfEscala::getById($idescala);
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
        return ConfEscala::existeDenom($denominacion);
    }
}