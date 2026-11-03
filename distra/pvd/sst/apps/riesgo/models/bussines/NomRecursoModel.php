<?php 
class NomRecursoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getRecursos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomRecurso::getRecursos($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomRecurso::cantRecursos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getRecursosActivos()
    {
        try {
            $datos = NomRecurso::getRecursosActivos();
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addRecurso($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomRecurso();
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

    public function updateRecurso($idrecurso, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomRecurso::getById($idrecurso);
            $denom = NomRecurso::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idrecurso'] == $idrecurso) {
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

    public function deleteRecurso($idrecurso)
    {
        try {
            $obj = NomRecurso::getById($idrecurso);
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
        return NomRecurso::existeDenom($denominacion);
    }
}