<?php

abstract class BaseDatTrabajoOperariosDetallado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_trabajooperariosdetallado');
        $this->hasColumn(
            'idtrabajooperariosdetallado', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_trabajooperariosdetallado')
        );
        $this->hasColumn('idtrabajooperarios', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('minimo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('maximo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('coeficiente', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dimension', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importebase', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('gastosbase', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importecobrar', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrodoc', 'varchar', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('actividad', 'varchar', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactividad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('um', 'varchar', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocfactura', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }


    public function Setup()
    {
        parent::setUp();
    }


}
