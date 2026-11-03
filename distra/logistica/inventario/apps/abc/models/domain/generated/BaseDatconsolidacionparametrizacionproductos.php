<?php

class BaseDatconsolidacionparametrizacionproductos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logabc.dat_consolidacionparametrizacionproductos');
        $this->hasColumn(
            'idconsolidacionparametrizacionproductos', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logabc.sec_consolidacionparametrizacionproductos')
        );
        $this->hasColumn(
            'idparametrosinventario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'presupuestoplanificado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'presupuestoreal', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcentrologistico', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconfperiodosclasificacionabc', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('codigo', 'varchar', 255, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
