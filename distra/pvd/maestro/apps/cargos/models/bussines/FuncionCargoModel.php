<?php
class FuncionCargoModel extends ZendExt_Model
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

    public function getFuncionCargo($limit, $start, $arr)

    {
        $obj = new FuncionCargo();
        $arreglo= implode(',', $arr);
        $result['datos'] = $obj->getFuncionCargo($limit, $start, $arreglo);

       // $result['cantidad'] = $obj->getCantFuncionCargo($idestructura);
        return $result;
    }

    public function getCargos($limit, $start, $filtro)
    {
        $obj = new ConfEspcargo();
        $result['datos'] = $obj->getCargos($limit, $start, $filtro);
        $result['cantidad'] = count($obj->getCantCargos($filtro));
        return $result;
    }

    public function addFuncioncargo($denominacion, $idestructura,$especifica)
    {
        try {
            $existe = FuncionCargo::getEspCargoByIdDenom($denominacion, $idestructura);
            if (count($existe) == 0) {
                $obj = new FuncionCargo();
                $obj->idestructura = $idestructura;
                $obj->denominacion = $denominacion;
                $obj->especifica = $especifica;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    public function updateFuncioncargo($denominacion, $idestructura, $idfunccargo)
    {
        try {
            $existe = FuncionCargo::getEspCargoByIdDenom($denominacion, $idestructura);

            if (count($existe) == 0 || $existe[0]['idfunccargo'] == $idfunccargo) {

                $obj = FuncionCargo::getById($idfunccargo);
                $obj->idestructura = $idestructura;
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

    public function deleteFuncioncargo($idfunccargo)
    {
        try {
            $obj = FuncionCargo::getById($idfunccargo);
            $obj->delete();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return false;
            }
        }
    }
}