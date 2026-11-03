<?php

abstract class BaseDatOportunidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.dat_oportunidad');
        $this->hasColumn('idoportunidad', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_oportunidad'));
        $this->hasColumn('denominacion', 'character varying', 255,array('primary' => false));
        $this->hasColumn('ingresoestimado', 'numeric', 19,array('primary' => false));
        $this->hasColumn('fecha', 'date', null,array('primary' => false));
        $this->hasColumn('idusuario', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255,array('primary' => false));
        $this->hasColumn('idcampanna', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idprioridad', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcanal', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipo', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', 19,array('notnull' => true, 'primary' => false));
    }

}