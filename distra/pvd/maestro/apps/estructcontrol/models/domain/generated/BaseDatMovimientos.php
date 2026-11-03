<?php
abstract class BaseDatMovimientos extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.dat_movimientos');
        $this->hasColumn(
            'idmovimiento',
            'numeric',
            null,
            array ('notnull' => false,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_movimientos')
        );
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('accion', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idcontrolador', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idcargo', 'numeric', null, array ('notnull' => false,'primary' => false));
    }
}