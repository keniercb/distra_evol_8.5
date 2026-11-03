<?php

abstract class BaseDatConceptoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_conceptoentidad');
        $this->hasColumn(
            'idnomconcepto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnomconceptoentidad', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_datcategoriaentidad')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
