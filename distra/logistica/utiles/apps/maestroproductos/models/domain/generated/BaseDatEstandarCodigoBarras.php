<?php

abstract class BaseDatEstandarCodigoBarras extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_estandarcodigobarras');
        $this->hasColumn(
            'idestandarcodigobarra', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datestandarcodigobarras')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'bandera', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'formato', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'sequenciaporentidad', 'boolean', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}