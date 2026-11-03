<?php
abstract class BaseDatAjuste extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_ajuste');
        $this->hasColumn('idajuste', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuarioalm', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuarioesp', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idinventario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('contabilizadopor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
