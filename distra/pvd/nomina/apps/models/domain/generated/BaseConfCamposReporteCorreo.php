<?php

abstract class BaseConfCamposReporteCorreo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_nomina.conf_camposreportecorreo');
        $this->hasColumn('idcamporeportecorreo', 'numeric', 19, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_nomina.sec_camposreportecorreo'));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idformula', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('mostrarvacaciones', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('mostrarsnc', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estotal', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }

    public function setUp(){

        parent::setUp();

        $this->hasOne('ConfCamposReporteCorreoEntidad', array(
            'local' => 'idestructuramodelodominaentidad',
            'foreign' => 'idestructuramodelodominaentidad'
        ));
    }
}

