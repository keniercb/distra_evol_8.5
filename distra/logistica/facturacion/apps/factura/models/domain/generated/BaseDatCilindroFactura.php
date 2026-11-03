<?php

abstract class BaseDatCilindroFactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_cilindrofactura');
        $this->hasColumn(
            'idcilindrofactura', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datcilindrofactura')
        );
        $this->hasColumn(
            'iddocumento', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmovimiento', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idelementofactura', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idumedida', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'factorconversion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnomcilindro', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'capacidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'calculo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}
