<?php

abstract class BaseDatProyecto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaproyecto.dat_proyecto');
        $this->hasColumn('idproyecto', 'character varying', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconfiguracion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdatos', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}