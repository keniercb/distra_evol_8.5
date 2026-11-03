<?php

abstract class BaseDatMaterial extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_material');
        $this->hasColumn(
            'idmaterial', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datmaterial')
        );
        $this->hasColumn('idindicador', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidadreal', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importecuc', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importecup', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactividad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('porplan', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aprobado', 'boolean', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('noaplicargastoatrabajador', 'boolean', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrosvales', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ignorarexistencia', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddeposito', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('deposito', 'character varying', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precio', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precioalternativo', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoperacionm', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pendiente', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('enproceso', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('facturado', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('entidad', 'character varying', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproductoentidad', 'numeric', 19, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

