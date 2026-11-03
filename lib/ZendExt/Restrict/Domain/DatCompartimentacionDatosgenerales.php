<?php
class ZendExt_Restrict_Domain_DatCompartimentacionDatosgenerales extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_compartimentacion_datosgenerales');
        $this->hasColumn('iddatosgenerales', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idambito', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('dominiousuario', 'ARRAY', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne('DatDatosgenerales', array('local' => 'iddatosgenerales', 'foreign' => 'iddatosgenerales'));
        $this->hasOne('ZendExt_Restrict_Domain_NomAmbitos', array('local' => 'idambito', 'foreign' => 'idambito'));
        $this->hasOne(
            'ZendExt_Restrict_Domain_SegUsuario', array('local' => 'dominiousuario', 'foreign' => 'posiciondominio')
        );
        parent::setUp();
    }
} 
