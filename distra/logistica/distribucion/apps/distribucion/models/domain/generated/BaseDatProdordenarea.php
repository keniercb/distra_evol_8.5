<?php
abstract class BaseDatProdordenarea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_prodordenarea');
        $this->hasColumn(
            'idprodordenarea', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datprodordenarea')
        );
        $this->hasColumn(
            'idareaproducto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idprodorden', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
