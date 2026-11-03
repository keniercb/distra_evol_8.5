<?php
abstract class BaseDatControlado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_controlado');
        $this->hasColumn(
            'idcontrolado',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_controlado')
        );
        $this->hasColumn('idcargo', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idarea', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idcontrolador', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}