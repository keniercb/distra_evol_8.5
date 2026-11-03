<?php

class DatIdentificacionInmuebleIng extends BaseIdentificacionInmuebleIng{
    public function setUp() {
        parent::setUp();
        $this->hasOne('DatRegnumerico', array('local' => 'idindentificacioninmuebleing', 'foreign' => 'idregnumerico'));
        $this->hasOne('NomEstatustecnico', array('local' => 'idestatustecnico', 'foreign' => 'idestatustecnico'));
        $this->hasOne('NomTipoObra', array('local' => 'idtipoobra', 'foreign' => 'idtipoobra'));
        $this->hasOne('NomEstatusoperativo', array('local' => 'idestadooperativo', 'foreign' => 'idestatusoperativo'));

    }
}