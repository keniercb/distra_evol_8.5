<?php 
class NomParteSistemaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPartesistemas($filtro, $inicio, $limit, $idsistema)
    {
        try {
            $datos = NomPartesistema::getPartesistemas($filtro, $inicio, $limit, $idsistema);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomPartesistema::cantPartesistemas($filtro, $idsistema);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getPartesistemasActivos()
    {
        try {
            $datos = NomPartesistema::getPartesistemasActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addPartesistema($idsistema, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomPartesistema();
            $obj->denominacion = $denominacion;
            $obj->idsistema = $idsistema;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updatePartesistema($idpartesistema, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomPartesistema::getById($idpartesistema);
            $existe = NomPartesistema::existeDenom($denominacion);
            if (count($existe) == 0 || $existe[0]['idpartesistema'] == $idpartesistema) {
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

    public function deletePartesistema($idpartesistema)
    {
        try {
            $obj = NomPartesistema::getById($idpartesistema);
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
        return NomPartesistema::existeDenom($denominacion);
    }
}