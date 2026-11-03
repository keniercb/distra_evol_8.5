<?php

abstract class BaseHisProductoTarjeta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.his_productotarjetamedicamento');

        $this->hasColumn(
            'idhproductotarjetamedicamento', 'numeric', null,  array(
            'notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_hisproductotarjetamedicamento"
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


    }

    public function Setup()
    {
        parent::setUp();
    }

}
