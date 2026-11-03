<?php 
class DatAccidentecausaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCausas($idaccidente, $filtro, $inicio, $limite)
    {
        try {
            $datos = DatAccidentecausa::getCausas($idaccidente, $filtro, $inicio, $limite);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = DatAccidentecausa::cantCausas($idaccidente, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idaccidente, $idcausaaccidente, $descripcion)
    {
        try {
            $existeCausa = DatAccidentecausa::existeCausa($idaccidente, $idcausaaccidente);
            if (count($existeCausa) == 0) {
                $obj = new DatAccidentecausa();
                $obj->idaccidente = $idaccidente;
                $obj->idcausaaccidente = $idcausaaccidente;
                $obj->descripcion = $descripcion;
                $obj->save();
                return true;
            } else {
                return 2;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idaccidentecausa, $idcausaaccidente, $descripcion)
    {
        try {
            $obj = DatAccidentecausa::getById($idaccidentecausa);
            $existeCausa = DatAccidentecausa::existeCausa($obj->idaccidente, $idcausaaccidente);
            if (count($existeCausa) == 0 || $existeCausa[0]['idaccidentecausa'] == $idaccidentecausa) {
                $obj->idcausaaccidente = $idcausaaccidente;
                $obj->descripcion = $descripcion;
                $obj->save();
            return true;
            } else {
                return 2;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idaccidentecausa)
    {
        try {
            $obj = DatAccidentecausa::getById($idaccidentecausa);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}