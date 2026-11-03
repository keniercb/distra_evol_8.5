<?php

class DatActividadentidadindustrial extends BaseDatActividadentidadindustrial {

    public function setUp() {

        parent::setUp();
        $this->hasOne('DatProduccionindustrial', array('local' => 'idproduccionindustrial', 'foreign' => 'idproduccionindustrial'));
        $this->hasOne('DatCartatecindustrialactividad', array('local' => 'idproduccionindustrial', 'foreign' => 'idproduccionindustrial'));
        $this->hasOne('DatActividadentidad', array('local' => 'idactividadentidad', 'foreign' => 'idactividadentidad'));
    }

}
