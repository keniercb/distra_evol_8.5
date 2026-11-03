<?php

abstract class BaseDatProductoTarjeta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_productotarjetamedicamento');

        $this->hasColumn(
            'idproductotarjetamedicamento', 'numeric', null,  array(
            'notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_dadproductotarjetamedicamento"
            )
        );
        $this->hasColumn(
            'idcuadrobasico',  'numeric', 1,
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
            'aprobado',  'numeric', 1,
            array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'nombremedico',  'character varing', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'hospital',  'character varing', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'otrasunidades',  'character varing', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}
