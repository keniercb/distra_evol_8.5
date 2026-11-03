<?php

abstract class BaseDatCategoriadistribucion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_categoriadistribucion');

        $this->hasColumn(
            'idcategoria', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logdistribucion.sec_datcategoriadistribucion')
        );
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
