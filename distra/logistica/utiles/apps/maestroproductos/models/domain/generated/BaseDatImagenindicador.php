<?php

abstract class BaseDatImagenindicador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_imagenindicador');
        $this->hasColumn(
            'idimagenindicador', 'decimal', null,
            array(
                'type'    => 'decimal', 'fixed' => false, 'unsigned' => false,
                'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datimagenindicador'
            )
        );
        $this->hasColumn(
            'idindicador', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idimagen', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'principal', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
