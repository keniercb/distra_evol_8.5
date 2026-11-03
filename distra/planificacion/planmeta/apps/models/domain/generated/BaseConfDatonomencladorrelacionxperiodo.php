<?php

abstract class BaseConfDatonomencladorrelacionxperiodo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.conf_datonomencladorrelacionxperiodo');
        $this->hasColumn(
                'uritiponomencladororigen', 'varchar', 100, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'uritiponomencladordestino', 'varchar', 100, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'uridatonomencladororigen', 'varchar', 100, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'uridatonomencladordestino', 'varchar', 100, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp() {
        parent::setUp();
    }

}
