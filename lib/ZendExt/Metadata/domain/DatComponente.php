<?php

class DatComponente extends BaseDatComponente
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatCampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasOne('DatCombo', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
        $this->hasOne('DatCampoNumerico', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
        $this->hasOne('DatCampoTexto', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
        $this->hasOne('DatAreaTexto', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
        $this->hasOne('DatFecha', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
        $this->hasOne('DatChequeo', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
        $this->hasOne('NomTipoComponente', array('local' => 'idtipocomponente', 'foreign' => 'idtipocomponente'));
        $this->hasMany(
            'NomExpresionRegular', array('local'    => 'idcomponente', 'foreign' => 'idexpresionregular',
                                         'refClass' => 'DatComponenteNomExpresionRegular')
        );
    }

}