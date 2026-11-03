<?php

/**
 *
 */
abstract class BaseDatImportar extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('dat_importartmp');
        $this->hasColumn(
            'idimportar', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datimportartmp')
        );
        $this->hasColumn('idprod', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestatustecnico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcolorprim', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactividad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('capacidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipocombustible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaadq', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nromotor1', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nroserie', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nromatricula', 'character varying', 100, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
