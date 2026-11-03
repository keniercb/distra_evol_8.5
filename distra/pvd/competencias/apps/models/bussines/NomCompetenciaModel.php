<?php 
class NomCompetenciaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCompetencias($filtro, $inicio, $limit)
    {
        try {
            $datos = NomCompetencia::getCompetencias($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomCompetencia::cantCompetencias($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCompetenciasActivas()
    {
        try {
            $datos = NomCompetencia::getCompetenciasActivas();
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addCompetencia($denominacion, $descripcion, $fdesde, $fhasta,$idescala)
    {
        try {
            $obj = new NomCompetencia();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->idescala = $idescala;
            $obj->fhasta = $fhasta;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateCompetencia($idcompetencia, $denominacion, $descripcion, $fdesde, $fhasta,$idescala)
    {

        //try {
            $obj = NomCompetencia::getById($idcompetencia);
            $denom = NomCompetencia::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idcompetencia'] == $idcompetencia) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = (empty($fhasta) || $fhasta == "") ? null : $fhasta;
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

    public function deleteCompetencia($idcompetencia)
    {
        try {
            $obj = NomCompetencia::getById($idcompetencia);
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
        return NomCompetencia::existeDenom($denominacion);
    }
}