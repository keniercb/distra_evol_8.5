<?php

class NomTipoTramite extends BaseNomTipoTramite
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatTipoTramiteEntidad', array('local' => 'idtipotramite', 'foreign' => 'idtipotramite'));
    }

}
