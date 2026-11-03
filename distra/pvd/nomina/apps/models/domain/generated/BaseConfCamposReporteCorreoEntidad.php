<?php

abstract class BaseConfCamposReporteCorreoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_nomina.conf_camposreportecorreoentidad');
        $this->hasColumn('idcamporeportecorreoentidad', 'numeric', 19, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_nomina.sec_camposreportecorreo'));
        $this->hasColumn('identidad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcamporeportecorreo', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('ConfCamposReporteCorreo', array(
            'local' => 'idestructuramodelodominaentidad',
            'foreign' => 'idestructuramodelodominaentidad'
        ));
    }

}

