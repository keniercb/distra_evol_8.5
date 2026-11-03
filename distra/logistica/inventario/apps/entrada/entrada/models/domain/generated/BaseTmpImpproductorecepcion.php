<?php

abstract class BaseTmpImpproductorecepcion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.tmp_impproductorecepcion');
        $this->hasColumn(
            'idimpproducto', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_impproductorecepcion')
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('codigoproducto', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('codigoauxiliar', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacionproducto', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcionproducto', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('um', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('naturaleza', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('almacenamiento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('formaalmacenamiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('marca', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('modelo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('elementogasto', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('clasificacioncontable', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrolote', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nroserie', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigobarra', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
