<?php 
class DatRgtareaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTareas($idreciengraduado, $filtro, $inicio, $limite)
    {
        try {
            $datos = DatRgtarea::getTareas($idreciengraduado, $filtro, $inicio, $limite);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = DatRgtarea::cantTareas($idreciengraduado, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idreciengraduado, $tarea)
    {
        try {
            $obj = new DatRgtarea();
            $obj->idreciengraduado = $idreciengraduado;
            $obj->tarea = $tarea;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idrgtarea, $tarea)
    {
        try {
            $obj = DatRgtarea::getById($idrgtarea);
            $obj->tarea = $tarea;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idrgtarea)
    {
        try {
            $obj = DatRgtarea::getById($idrgtarea);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}