<?php

class DatSubtipobalancebalanceactividadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatSubtipobalancebalanceactividad($datSubtipobalancebalanceactividad
    )
    {
        $datSubtipobalancebalanceactividad->save();
    }

    public function modificardatSubtipobalancebalanceactividad($datSubtipobalancebalanceactividad
    )
    {
        $datSubtipobalancebalanceactividad->save();
    }

    public function eliminardatSubtipobalancebalanceactividad($idsubtipobalancebalanceactividad
    )
    {
        $query = Doctrine_Query::create();
        $query->delete('DatSubtipobalancebalanceactividad')
            ->from('DatSubtipobalancebalanceactividad sbba ')
            ->where(
                'sbba.idsubtipobalancebalanceactividad = ?',
                $idsubtipobalancebalanceactividad
            )
            ->execute();
        return '24';
    }
}


