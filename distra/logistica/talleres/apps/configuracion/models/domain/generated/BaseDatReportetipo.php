<?php

abstract class BaseDatReportetipo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_logtaller.dat_reportetipo');
        $this->hasColumn(
                'idreportetipo', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_reporteconcepto')
        );
        $this->hasColumn(
                'idreporteparalizacion', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idtipo', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}
