<?php

abstract class BaseNomProductoservicio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_productoservicio');
        $this->hasColumn(
            'idnomproductoservicio', 'decimal', null,
            array(
                'type'    => 'decimal', 'fixed' => false, 'unsigned' => false,
                'primary' => true, 'sequence' => 'sec_productoservicio'
            )
        );
        $this->hasColumn(
            'idnomproducto', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idservicio', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
