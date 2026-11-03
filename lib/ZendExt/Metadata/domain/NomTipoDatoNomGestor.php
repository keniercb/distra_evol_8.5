<?php

class NomTipoDatoNomGestor extends BaseNomTipoDatoNomGestor
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCampo', array('local' => 'idtipodatogestor', 'foreign' => 'idtipodatogestor'));
        $this->hasOne('NomGestor', array('local' => 'idgestor', 'foreign' => 'idgestor'));
        $this->hasOne('NomTipoDato', array('local' => 'idtipodato', 'foreign' => 'idtipodato'));
    }

}