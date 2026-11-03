<?php 
class DatAccionaseguramientoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAseguramientos($idaccion)
    {
        try {
            $obj = new DatAccionaseguramiento();
            $datos = $obj->getAseguramientosByAccionTodos($idaccion);
            if (count($datos)==0) {
                $datos = Array();
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getAseguramientosByAccion($idaccion, $start = 0, $limit = null)
    {
        try {
            $obj = new DatAccionaseguramiento();
            $datos = $obj->getAseguramientosByAccion($idaccion, $start, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantAseg($idaccion);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addAseguramiento($idaccion, $arrayidaseguramiento)
    {
        try {
            DatAccionaseguramiento::eliminarByAccion($idaccion);
            foreach ($arrayidaseguramiento as $idaseguramiento) {
                $obj = new DatAccionaseguramiento();
                $obj->idaccion = $idaccion;
                $obj->idaseguramiento = $idaseguramiento;
                $obj->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteAseg($idaccionaseguramiento)
    {
        try {
            $obj = DatAccionaseguramiento::getById($idaccionaseguramiento);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}