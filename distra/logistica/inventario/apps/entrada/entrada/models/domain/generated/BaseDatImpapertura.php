<?php

abstract class BaseDatImpapertura extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_impapertura');
        $this->hasColumn('idimpapertura', 'numeric', null,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_impapertura'));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        //$this->hasColumn('codigoempresa', 'character varying', null, array('notnull' => false, 'primary' => false));
        //$this->hasColumn('nombreempresa', 'character varying', null, array('notnull' => false, 'primary' => false));
        //$this->hasColumn('codigodeposito', 'character varying', null, array('notnull' => false, 'primary' => false));
        //$this->hasColumn('nombredeposito', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigoproducto', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcionproducto', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('um', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('clasificacioncontable', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minimo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('maximo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('categoria', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafabricacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechavencimiento', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precio', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'character varying', null, array('notnull' => false, 'primary' => false));
        //$this->hasColumn('precioalt', 'character varying', null, array('notnull' => false, 'primary' => false));
        //$this->hasColumn('importealt', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaproduccion', 'character varying', null, array('notnull' => false, 'primary' => false));      
        $this->hasColumn('nrolote', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechavencimientolote', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidadlote', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigofabricante', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ubicacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('naturaleza', 'character varying', null, array('notnull' => false, 'primary' => false));  
        $this->hasColumn('municipios', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('organismos', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('errorfecha', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nro', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
