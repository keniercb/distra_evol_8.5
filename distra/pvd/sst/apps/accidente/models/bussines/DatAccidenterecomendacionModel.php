<?php 
class DatAccidenterecomendacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getRecomendaciones($idaccidente, $filtro, $inicio, $limite)
    {
        try {
            $datos = DatAccidenterecomendacion::getRecomendaciones($idaccidente, $filtro, $inicio, $limite);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = DatAccidenterecomendacion::cantRecomendaciones($idaccidente, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idaccidente, $recomendacion)
    {
        try {
            $obj = new DatAccidenterecomendacion();
            $obj->idaccidente = $idaccidente;
            $obj->recomendacion = $recomendacion;
            $obj->idusuario = $_SESSION['Zeolides']['perfil']['idusuario'];
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idaccidenterecomendacion, $recomendacion)
    {
        try {
            $obj = DatAccidenterecomendacion::getById($idaccidenterecomendacion);
            $obj->recomendacion = $recomendacion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idaccidenterecomendacion)
    {
        try {
            $obj = DatAccidenterecomendacion::getById($idaccidenterecomendacion);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}