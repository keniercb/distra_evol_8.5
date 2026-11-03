<?php 
class NomModalidadempleoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getModalidades($filtro, $inicio, $limit)
    {
        try {
            $datos = NomModalidadempleo::getModalidades($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomModalidadempleo::cantModalidadempleos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getModalidadesActivos()
    {
        try {
            $datos = NomModalidadempleo::getModalidadesActivos();
            foreach ($datos as $i => $val) {
                if (empty($val['descripcion'])) {
                    $datos[$i]['descripcion'] = 'Sin descripci&oacute;n';
                } else {
                    $datos[$i]['descripcion'] = $val['descripcion'];
                }
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addModalidadempleo($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomModalidadempleo();
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

    public function updateModalidadempleo($idmodalidadempleo, $denom, $desc, $fdesde, $fhasta)
    {
        try {
            $obj = NomModalidadempleo::getById($idmodalidadempleo);
            $existe = NomModalidadempleo::existeDenom($denom);
            $cant = count($existe);
            if ($cant == 0 || $existe[0]['idmodalidadempleolaboral'] == $idmodalidadempleo) {
                $obj->denominacion = $denom;
                $obj->descripcion = $desc;
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

    public function deleteModalidadempleo($idmodalidadempleo)
    {
        try {
            $obj = NomModalidadempleo::getById($idmodalidadempleo);
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
        return NomModalidadempleo::existeDenom($denominacion);
    }
}