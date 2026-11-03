<?php

abstract class BaseDatPuestotrabajoRango extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_puestotrabajorango');
        $this->hasColumn(
            'idpuestotrabajorango', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_puestotrabajorango')
        );
        $this->hasColumn('idrango', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpuestotrabajo', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase
