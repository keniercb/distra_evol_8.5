<?php
abstract class BaseConfPlantillafuncionalidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_plantillafuncionalidad');
        $this->hasColumn('idplantillafuncionalidad', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idplantilla', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconfiguracion', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}