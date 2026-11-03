<?php
abstract class BaseDatProdorden extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.dat_prodorden');
        $this->hasColumn(
            'idprodorden', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datprodorden')
        );
        $this->hasColumn(
            'idorden', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idproducto', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idprodorigen', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcliente', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cancelar', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'motivo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        /*$this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuraop', 'numeric', null, array('notnull' => false, 'primary' => false));*/
    }

    public function Setup()
    {
        parent::setUp();
    }
}
