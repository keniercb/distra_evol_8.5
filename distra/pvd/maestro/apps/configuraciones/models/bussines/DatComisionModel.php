<?php
class DatComisionModel extends ZendExt_Model
{

    public function getComisiones($filtro, $inicio, $limit)
    {
        try {
            $idestructura =  $_SESSION['Zeolides']['entidad']->idestructura;
            $datos = DatComision::getComisiones($idestructura, $filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
                    foreach ($val['DatDominiocomision'] as $t=>$dominio) {
                        if ($t > 0) {
                            $datos[$i]['dominio'] .= ', ';
                            $datos[$i]['iddominios'] .= ',';
                        }
                        $datos[$i]['dominio'] .= $dominio['NomDominio'][0]['denominacion'];
                        $datos[$i]['iddominios'] .= $dominio['iddominio'];
                    }
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = DatComision::cantComisiones($idestructura, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getComisionesActivas($tipo)
    {
        try {
            $datos = DatComision::getComisionesActivas($tipo);
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($denominacion, $descripcion, $fdesde, $fhasta, $dominios)
    {
        try {
            $idestructura =  $_SESSION['Zeolides']['entidad']->idestructura;
            $denom = DatComision::existeDenom($denominacion, $idestructura);
            if (count($denom) == 0) {
                $obj = new DatComision();
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->identidad = $idestructura;
                $obj->save();
                foreach ($dominios as $v) {
                    $objDom = new DatDominiocomision();
                    $objDom->iddominio = $v;
                    $objDom->idcomision = $obj->idcomision;
                    $objDom->save();
                }
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idcomision, $denominacion, $descripcion, $fdesde, $fhasta, $dominios)
    {
        try {
            $obj = DatComision::getById($idcomision);
            $denom = DatComision::existeDenom($denominacion, $obj->identidad);
            if (count($denom) == 0 || $denom[0]['idcomision'] == $obj->idcomision) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->save();
                DatDominiocomision::deleteByComision($idcomision);
                foreach ($dominios as $v) {
                    $objDom = new DatDominiocomision();
                    $objDom->iddominio = $v;
                    $objDom->idcomision = $obj->idcomision;
                    $objDom->save();
                }
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idcomision)
    {
        try {
            $obj = DatComision::getById($idcomision);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}