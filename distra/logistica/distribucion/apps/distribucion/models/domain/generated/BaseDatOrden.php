<?php
abstract class BaseDatOrden extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_orden');
        $this->hasColumn('idconcepto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estadosum', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechav', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuariojesp', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoferta', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idorden', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('planextraplan', 'character varying', 3, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
