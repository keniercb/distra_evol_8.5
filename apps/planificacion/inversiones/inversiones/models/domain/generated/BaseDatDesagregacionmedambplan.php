<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/03/16
 * Time: 9:23
 */
abstract class BaseDatDesagregacionmedambplan extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_desagregacionmedambplan');
        $this->hasColumn('iddesagregacionmedambplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_desagregacionmedambplan'));
        $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddesagregacionplan', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}