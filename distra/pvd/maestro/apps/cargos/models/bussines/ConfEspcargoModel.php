<?php
class ConfEspcargoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $limit
     * @param $start
     * @param $idcargo
     * @return mixed
     */
    public function getHomologaciones($limit, $start, $idcargo)
    {
        $obj = new ConfEspcargo();
        $result['datos'] = $obj->getHomologaciones($limit, $start, $idcargo);
        $result['cantidad'] = $obj->getCantHomologaciones($idcargo);
        return $result;
    }

    public function getCargos($limit, $start, $filtro)
    {
        $obj = new ConfEspcargo();
        $result['datos'] = $obj->getCargos($limit, $start, $filtro);
        $result['cantidad'] = count($obj->getCantCargos($filtro));
        return $result;
    }

    public function addHomologacion($denominacion, $idcargo)
    {
        try {
            $existe = ConfEspcargo::getEspCargoByIdDenom($denominacion, $idcargo);
            if (count($existe) == 0) {
                $obj = new ConfEspcargo();
                $obj->idcargo = $idcargo;
                $obj->denominacion = $denominacion;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    public function updateHomologacion($denominacion, $idcargo, $idespcargo)
    {
        try {
            $existe = ConfEspcargo::getEspCargoByIdDenom($denominacion, $idcargo);
            if (count($existe) == 0 || $existe[0]['idespcargo'] == $idespcargo) {
                $obj = ConfEspcargo::getById($idespcargo);
                $obj->idcargo = $idcargo;
                $obj->denominacion = $denominacion;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    public function deleteHomologacion($idhomocargo)
    {
        try {
            $obj = ConfEspcargo::getById($idhomocargo);
            $obj->delete();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return false;
            }
        }
    }
}