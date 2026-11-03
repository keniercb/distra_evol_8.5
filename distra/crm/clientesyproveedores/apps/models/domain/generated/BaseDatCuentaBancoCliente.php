<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 10/03/2015
 * Time: 9:43
 */

class BaseDatCuentaBancoCliente extends Doctrine_Record {
    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.dat_cuentabanccliente');
        $this->hasColumn('idcuentabancliente', 'decimal', 19, array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_datcuentabanccliente', 'primary' => true));
        $this->hasColumn('numerocuenta', 'string', 255, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('nombrecuenta', 'string', 255, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('idbanco', 'decimal', 19, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('idsucursal', 'decimal', 19, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('idmoneda', 'decimal', 19, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('predeterminado', 'decimal', 1, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('idclienteproveedores', 'decimal', 19, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('licenciabancaria', 'string', 11, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', 11, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', 11, array('fixed' => false, 'notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }
} 