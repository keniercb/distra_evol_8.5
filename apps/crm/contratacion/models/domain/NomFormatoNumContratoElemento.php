<?php

class NomFormatoNumContratoElemento extends BaseNomFormatoNumContratoElemento
{
    public function setUp()
    {
        parent::setUp();
		$this->hasOne('NomFormatoNumContrato', array('local' => 'idformatonumcontrato', 'foreign' => 'idformatonumcontrato'));
		$this->hasOne('NomFormatoNumContratoElementoFecha', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
        $this->hasOne('NomFormatoNumContratoElementoTexto', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
        $this->hasOne('NomFormatoNumContratoElementoNumerico', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
		$this->hasOne('NomFormatoNumContratoElementoNomenclador', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
		$this->hasOne('NomFormatoNumContratoElementoParametro', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
    }
}