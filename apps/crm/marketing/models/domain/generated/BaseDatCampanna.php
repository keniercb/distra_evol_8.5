<?php

abstract class BaseDatCampanna extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.dat_campanna');
        $this->hasColumn('idcampanna', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_campanna'));
        $this->hasColumn('denominacion', 'character varying', 255,array('notnull' => true,'primary' => false));
        $this->hasColumn('codigo', 'character varying', 255,array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255,array('primary' => false));
        $this->hasColumn('idmoneda', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('costofijo', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantrespuestas', 'numeric', 19,array( 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255,array('primary' => false));
        $this->hasColumn('idprioridad', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', 19,array('notnull' => true, 'primary' => false));
    }

}