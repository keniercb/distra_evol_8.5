<?php
abstract class BaseDatDocBalanceo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_docbalanceo');
        $this->hasColumn(
            'iddocbalanceo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn('fechacreacion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaaprobacion', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
