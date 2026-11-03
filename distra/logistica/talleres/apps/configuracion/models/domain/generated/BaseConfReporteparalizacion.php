<?php

abstract class BaseConfReporteparalizacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_logtaller.conf_reporteparalizacion');
        $this->hasColumn(
                'idreporteparalizacion', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_reporteparalizacion')
        );
        $this->hasColumn(
                'denominacion', 'character varying', 100,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'activo', 'numeric', null,
                array('default' => 1, 'notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}
