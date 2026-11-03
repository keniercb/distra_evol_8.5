<?php

class DatSubtipobalancebalance extends BaseDatSubtipobalancebalance
{

    public function setUp()
    {
        parent::setUp();

        $this->hasMany(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
            'NomSubtipobalance', array('local' => 'idsubtipobalance',
                                       'foreign' => 'idsubtipobalance')
        );
        $this->hasOne(
            'NomBalance',
            array('local' => 'idbalance', 'foreign' => 'idbalance')
        );
    }

}
