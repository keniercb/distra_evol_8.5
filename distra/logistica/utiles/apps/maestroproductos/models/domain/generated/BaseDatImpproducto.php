<?php

abstract class BaseDatImpproducto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_impproducto');
        $this->hasColumn(
            'idimpproducto', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_impproducto')
        );
        $this->hasColumn('codigoproducto', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('codigoauxiliar', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacionproducto', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcionproducto', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('um', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('naturaleza', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('almacenamiento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('utiloherramienta', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('formaalmacenamiento', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('grupo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('marca', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('modelo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('elementogasto', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('elementogastoalternativo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('referencia', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigobarra', 'character varying', null, array('notnull' => false, 'primary' => false));

        
        
   
    }

    public function Setup()
    {
        parent::setUp();
    }

}
