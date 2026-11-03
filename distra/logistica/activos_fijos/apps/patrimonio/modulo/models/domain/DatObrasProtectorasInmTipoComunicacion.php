
<?php

class DatObrasProtectorasInmTipoComunicacion extends BaseDatObrasProtectorasInmTipoComunicacion{
    public function setUp() {
        parent::setUp();
        $this->hasOne('DatObrasProtectorasInmuebleIng', array('local' => 'idobrasing', 'foreign' => 'idobrasing'));
         $this->hasOne('NomTipoComunicacion', array('local' => 'idtipocomunicacion', 'foreign' => 'idcomunicacion'));
    }
}