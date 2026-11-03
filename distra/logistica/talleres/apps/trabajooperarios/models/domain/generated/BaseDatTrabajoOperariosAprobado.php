<?php

abstract class BaseDatTrabajoOperariosAprobado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_trabajooperariosaprobado');
        $this->hasColumn(
            'idaprobado', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_trabajooperariosaprobado')
        );
        $this->hasColumn('idtrabajooperarios', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('operacion', 'numeric', 1, array('notnull' => true, 'primary' => false));
    }


    public function Setup()
    {
        parent::setUp();
    }


}