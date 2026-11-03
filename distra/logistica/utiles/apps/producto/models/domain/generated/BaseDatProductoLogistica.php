<?php

abstract class BaseDatProductoLogistica extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_producto');
        $this->hasColumn(
            'idproducto', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_datproducto')
        );
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idumedida', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cronologia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('disponible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minimo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('maximo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('factorbase', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechavencimiento', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafabricacion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idclasificacioncontable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precioalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importealternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarca', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('propiedad', 'json', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('esbaja', 'numeric', null, array('notnull' => false, 'primary' => false));
		$this->hasColumn(
            'idelementogasto', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idelementogastoalt', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
       $this->hasColumn('idnaturaleza', 'numeric', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('idgruposubgrupo', 'numeric', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
       $this->hasColumn('numerolote', 'character varying', 100, array('notnull' => false, 'primary' => false));
       $this->hasColumn('fechavencelote', 'date', null, array('notnull' => false, 'primary' => false));

    }

    
    public function Setup()
    {  
        parent::setUp();
    }

}
