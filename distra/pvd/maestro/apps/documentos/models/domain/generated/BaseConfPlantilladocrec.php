<?php
abstract class BaseConfPlantilladocrec extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_plantilladocrec');
        $this->hasColumn(
            'idplantilladocrec',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_plantilladocrec')
        );
        $this->hasColumn('idplantilladoc', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconfiguracion', 'character varying', 255, array('notnull' => true, 'primary' => false));
    }
}