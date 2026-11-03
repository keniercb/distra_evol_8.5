<?php 
class DatAccidentecostoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCostos($idaccidente, $filtro, $inicio, $limite)
    {
        try {
            $datos = DatAccidentecosto::getCostos($idaccidente, $filtro, $inicio, $limite);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = DatAccidentecosto::cantCostos($idaccidente, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idaccidente, $denominacion, $importe)
    {
        try {
            $obj = new DatAccidentecosto();
            $obj->idaccidente = $idaccidente;
            $obj->denominacion = $denominacion;
            $obj->importe = $importe;
            $obj->idusuario = $_SESSION['Zeolides']['perfil']['idusuario'];
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idaccidentecosto, $denominacion, $importe)
    {
        try {
            $obj = DatAccidentecosto::getById($idaccidentecosto);
            $obj->denominacion = $denominacion;
            $obj->importe = $importe;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idaccidentecosto)
    {
        try {
            $obj = DatAccidentecosto::getById($idaccidentecosto);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}