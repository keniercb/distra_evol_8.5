<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 17/03/2015
 * Time: 3:40
 */

class BaseDatIdentificador extends Doctrine_Record{
    public function setTableDefinition() {
        $this->setTableName('mod_crmclienteproveedor.dat_identificador');
        $this->hasColumn('ididentificador', 'decimal', 19, array('notnull' => true, 'sequence' => 'mod_crmclienteproveedor.sec_identificador', 'primary' => true));
        $this->hasColumn('idtipocodigo', 'decimal', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'string', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idclienteproveedor', 'decimal', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }
}