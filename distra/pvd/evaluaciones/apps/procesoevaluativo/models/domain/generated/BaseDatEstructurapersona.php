<?php
abstract class BaseDatEstructurapersona extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_estructurapersona');
        $this->hasColumn(
            'idestructurapersona', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_estructurapersona')
        );
        $this->hasColumn('idestructuraevaluativa', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idprocesoplanilla', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechadesactivacion', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nopersona', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}