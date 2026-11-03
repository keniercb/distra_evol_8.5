<?php

abstract class BaseDatRegistroTarjeta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_registrotarjeta');

        $this->hasColumn(
            'idregistrotarjeta', 'numeric', null,  array(
                'notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_datregistrotarjeta"
            )
        );
        $this->hasColumn(
            'idproducto',  'numeric', 1,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtarjetamedicamento',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'origenprescripcion',  'character varing', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nroregistro',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'especialidad',  'character varing', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'dosis',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechaemision',  'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechaexpiracion',  'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechaoperacion',  'date', null,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'operacion',  'numeric', 1,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idproductocambio',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}
