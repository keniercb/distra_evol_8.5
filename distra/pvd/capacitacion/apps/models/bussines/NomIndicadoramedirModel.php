<?php 
class NomIndicadoramedirModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getIndicadores($filtro, $inicio, $limit)
    {
        try {
            $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $datos = NomIndicadoramedir::getIndicadores($filtro, $inicio, $limit, $identidad);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    if (empty($val['descripcion'])) {
                        $datos[$i]['descripcion'] = 'Sin descripci&oacute;n';
                    } else {
                        $datos[$i]['descripcion'] = $val['descripcion'];
                    }
                    $escala = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalasPorId($val['idescala']);
                    $datos[$i]['escala'] = $escala->denominacion;
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomIndicadoramedir::cantIndicadores($filtro, $identidad);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getIndicadoresActivos()
    {
        try {
            $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $datos = NomIndicadoramedir::getIndicadoresActivos($identidad);
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
                $escala = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalasPorId($val['idescala']);
                $datos[$i]['escala'] = $escala->denominacion;
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addIndicador($denominacion, $descripcion, $fdesde, $fhasta, $idescala)
    {
        try {
            $obj = new NomIndicadoramedir();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->idescala = $idescala;
            $obj->identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateIndicador($idindicador, $denominacion, $descripcion, $fdesde, $fhasta, $idescala)
    {
        //try {
            $obj = NomIndicadoramedir::getById($idindicador);
            $denom = NomIndicadoramedir::existeDenom($denominacion, $_SESSION['Zeolides']['entidad']->idestructura);
            if (count($denom) == 0 || $denom[0]['idindicador'] == $idindicador) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->idescala = $idescala;
                $obj->save();
                return true;
            } else {
                return false;
            }
        /*} catch (Exception $e) {
            return false;
        }*/
    }

    public function deleteIndicador($idindicador)
    {
        try {
            $obj = NomIndicadoramedir::getById($idindicador);
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
        return NomIndicadoramedir::existeDenom($denominacion, $_SESSION['Zeolides']['entidad']->idestructura);
    }
}