<?php 
class DatRgperiodoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPeriodoesRecienG($idreciengraduado, $filtro, $inicio, $limite)
    {
        try {
            $datos = DatRgperiodo::getPeriodos($idreciengraduado, $filtro, $inicio, $limite);
            $resp->datos = $datos;
            $resp->cantidad = DatRgperiodo::cantPeriodos($idreciengraduado, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idreciengraduado, $denominacion, $fdesde, $fhasta)
    {
        try {
            $obj = new DatRgperiodo();
            $obj->idreciengraduado = $idreciengraduado;
            $obj->denominacion = $denominacion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idrgperiodo, $denominacion, $fdesde, $fhasta)
    {
        try {
            $obj = DatRgperiodo::getById($idrgperiodo);
            $obj->denominacion = $denominacion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idrgperiodo)
    {
        try {
            $obj = DatRgperiodo::getById($idrgperiodo);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}