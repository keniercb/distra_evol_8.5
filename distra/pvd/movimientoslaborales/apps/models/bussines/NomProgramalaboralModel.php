<?php 
class NomProgramalaboralModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getProgramas($filtro, $inicio, $limit)
    {
        try {
            $datos = NomProgramalaboral::getProgramas($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomProgramalaboral::cantProgramas($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getProgramasActivos()
    {
        try {
            $datos = NomProgramalaboral::getProgramasActivos();
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

    public function addPrograma($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomProgramalaboral();
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

    public function updatePrograma($idproglab, $denom, $desc, $fdesde, $fhasta)
    {
        try {
            $obj = NomProgramalaboral::getById($idproglab);
            $existe = NomProgramalaboral::existeDenom($denom);
            $cant = count($existe);
            if ($cant == 0 || $existe[0]['idprogramalaboral'] == $idproglab) {
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

    public function deletePrograma($idprogramalaboral)
    {
        try {
            $obj = NomProgramalaboral::getById($idprogramalaboral);
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
        return NomProgramalaboral::existeDenom($denominacion);
    }
}