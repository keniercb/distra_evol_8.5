<?php
class ZendExt_Restrict_Domain_SegUsuario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.seg_usuario');
        $this->hasColumn('accesodirecto', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('activo', 'boolean', null, array('notnull' => false, 'primary' => false, 'default' => false));
        $this->hasColumn('caduca', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('contrasenabd', 'character varying', 50, array('notnull' => true, 'primary' => false));
        $this->hasColumn('contrasenna', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estado', 'character', 1, array('notnull' => false, 'primary' => false, 'default' => 0));
        $this->hasColumn('iddesktop', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddominio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ididioma', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtema', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_seguridad.sec_segusuario')
        );
        $this->hasColumn('ip', 'character varying', 250, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreusuario', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('perfilxml', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('posiciondominio', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        //$this->hasOne ( 'NomTema', array ('local' => 'idtema', 'foreign' => 'idtema' ) );
        //$this->hasOne ( 'DatPersona', array ('local' => 'idpersona', 'foreign' => 'idpersona' ) );
        //$this->hasOne ( 'NomIdioma', array ('local' => 'ididioma', 'foreign' => 'ididioma' ) );
        //$this->hasOne ( 'NomDesktop', array ('local' => 'iddesktop', 'foreign' => 'iddesktop' ) );
        $this->hasMany(
            'ZendExt_Restrict_Domain_DatCompartimentacionModelo',
            array('local' => 'posiciondominio', 'foreign' => 'dominiousuario')
        );
        //$this->hasMany ( 'ZendExt_Restrict_Domain_DatCompartimentacionDatosgenerales',
        // array ('local'=>'posiciondominio', 'foreign' => 'dominiousuario' ) );
        parent::setUp();
    }
} 
