<?php
abstract class BaseDatMovtransferencia extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_movtransferencia');
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idmovtransferencia', 'numeric', null, array('notnull' => true, 'primary' => true,
                                                         'sequence' => 'mod_loginventario.sec_datmovtransferencia')
        );
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuraubicacionorigen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idestructuraubicaciondestino', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

