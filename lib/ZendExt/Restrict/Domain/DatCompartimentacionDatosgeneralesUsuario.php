<?php
class ZendExt_Restrict_Domain_DatCompartimentacionDatosgeneralesUsuario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_compartimentacion_datosgenerales_usuario');
        $this->hasColumn('iddatosgenerales', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idambito', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('permisos', 'ARRAY', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne('DatDatosgenerales', array('local' => 'iddatosgenerales', 'foreign' => 'iddatosgenerales'));
        $this->hasOne('ZendExt_Restrict_Domain_NomAmbitos', array('local' => 'idambito', 'foreign' => 'idambito'));
        $this->hasOne('ZendExt_Restrict_Domain_SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
        parent::setUp();
    }
} 
