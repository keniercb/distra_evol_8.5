<?php


abstract class BaseDatCierreventa extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_cierreventa');
        $this->hasColumn(
            'idcierreventa', 'numeric', null,
            array(
                'notnull' => true, 'primary' => true
            )
        );
        $this->hasColumn(
            'idusuario', 'numeric', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'identidad', 'numeric', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'fecha', 'date', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'hora', 'time without time zone', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'total', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}