<?php
abstract class BaseDatEstructuraevaluativa extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_estructuraevaluativa');
        $this->hasColumn(
            'idestructuraevaluativa', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_estructuraevaluativa')
        );
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpreprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}