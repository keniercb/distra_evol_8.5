<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 17/03/2015
 * Time: 3:40
 */

class BaseDatFacultades extends Doctrine_Record{
    public function setTableDefinition() {
        $this->setTableName('mod_crmclienteproveedor.dat_facultad');
        $this->hasColumn('idfacultad', 'decimal', 19, array('notnull' => true, 'sequence' => 'mod_crmclienteproveedor.sec_facultad', 'primary' => true));
        $this->hasColumn('idtipofacultad', 'decimal', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcontacto', 'decimal', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }
}