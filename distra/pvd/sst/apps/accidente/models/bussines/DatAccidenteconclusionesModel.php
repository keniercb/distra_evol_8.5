<?php 
class DatAccidenteconclusionesModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getConclusiones($idaccidente, $filtro, $inicio, $limite)
    {
        try {
            $datos = DatAccidenteconclusiones::getConclusiones($idaccidente, $filtro, $inicio, $limite);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = DatAccidenteconclusiones::cantConclusiones($idaccidente, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idaccidente, $conclusion)
    {
        try {
            $obj = new DatAccidenteconclusiones();
            $obj->idaccidente = $idaccidente;
            $obj->conclusion = $conclusion;
            $obj->idusuario = $_SESSION['Zeolides']['perfil']['idusuario'];
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idaccidenteconclusion, $conclusion)
    {
        try {
            $obj = DatAccidenteconclusiones::getById($idaccidenteconclusion);
            $obj->conclusion = $conclusion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idaccidenteconclusion)
    {
        try {
            $obj = DatAccidenteconclusiones::getById($idaccidenteconclusion);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}