<?php

class NomSubtipobalanceModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    function eliminarrelaciones($id, $tipo)
    {
        //Buscar relaciones dependiendo de lo que se que se quiere eliminar
        if ($tipo != "balance") {
            $rel = NomSubtipobalance::BuscarRelaciones($id, $tipo);
            if ($rel) { //Si tiene relaciones no se puede eliminar
                return 21;
            } else {
                if ($tipo == "tipobalance") {
                    $model = new NomTipobalanceModel();
                    $result = $model->eliminarnom_tipobalance(
                        Doctrine::getTable('NomTipobalance')->find($id)
                    );
                } else {
                    $result = $this->eliminarnomSubtipobalance(
                        Doctrine::getTable('NomSubtipobalance')->find($id)
                    );
                }
            }
        } else {
            $model = new NomBalanceModel();
            $arr = NomSubtipobalance::eliminarasociacion($id);
            $model->eliminarnom_balance($arr);
            $result = $model->eliminarnom_balance(
                Doctrine::getTable('NomBalance')->find($id)
            );
        }

        if ($result) {
            return 1;
        } else {
            return 3;
        }


    }

    public function existenciasub($denominacion, $id)
    {
        if (count(NomSubtipobalance::verificarexistetciasub($denominacion, $id))
            != 0
        ) {
            return true;
        } else {
            return false;
        }
    }

    public function insertarnomSubtipobalance($nomSubtipobalance)
    {
        $nomSubtipobalance->save();
    }

    public function modificarnomSubtipobalance($nomSubtipobalance)
    {
        $nomSubtipobalance->save();
    }

    public function eliminarnomSubtipobalance($nomSubtipobalance)
    {
        return $nomSubtipobalance->delete();
    }
}


