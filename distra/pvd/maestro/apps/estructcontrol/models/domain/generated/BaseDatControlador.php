<?php
abstract class BaseDatControlador extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_controlador');
        $this->hasColumn(
            'idcontrolador',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_controlador')
        );
        $this->hasColumn('idcargo', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idestructuracontrol', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}