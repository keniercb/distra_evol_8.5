<?php

class NomTipobalanceModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnomTipobalance($nomTipobalance)
    {
        $nomTipobalance->save();
    }

    public function modificarnomTipobalance($nomTipobalance)
    {
        $nomTipobalance->save();
    }

    public function eliminarnomTipobalance($nomTipobalance)
    {
        return $nomTipobalance->delete();

    }

    public function existencia($denominacion, $id)
    {
        if (count(NomTipobalance::verificarexistetcia($denominacion, $id))
            != 0
        ) {
            return true;
        } else {
            return false;
        }
    }
}


