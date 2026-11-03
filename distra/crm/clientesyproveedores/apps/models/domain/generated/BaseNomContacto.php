<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 17/03/2015
 * Time: 3:40
 */

class BaseNomContacto extends Doctrine_Record{
    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.nom_contacto');
        $this->hasColumn('idcontacto', 'decimal', 19, array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_nomcontacto', 'primary' => true));
        $this->hasColumn('nombre', 'string', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cargo', 'string', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('correocontacto', 'string', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('telefono', 'string', 30, array('notnull' => false, 'primary' => false));
        $this->hasColumn('movil', 'string', 30, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dpa', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('direccion', 'string', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('foto', 'bytea', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('direccionempresa', 'decimal', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idclientesproveedores', 'decimal', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'decimal', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('facultad', 'string', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('numeroidentidad', 'string', 255, array('notnull' => true, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }
}