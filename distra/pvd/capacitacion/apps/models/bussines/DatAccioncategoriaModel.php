<?php 
class DatAccioncategoriaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAccionesCateorias($idaccion, $start = 0, $limit = null)
    {
        try {
            $obj = new DatAccioncategoria();
            $datos = $obj->getCategoriasByAccion($idaccion, $start, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantAcciones($idaccion);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addCategoria($idaccion, $arrayidcategoria)
    {
        try {
            foreach ($arrayidcategoria as $idcategoria) {
                $obj = new DatAccioncategoria();
                $obj->idaccion = $idaccion;
                $obj->idcategoria = $idcategoria;
                $obj->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteCategoris($idaccioncategoria)
    {
        try {
            $obj = DatAccioncategoria::getById($idaccioncategoria);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}