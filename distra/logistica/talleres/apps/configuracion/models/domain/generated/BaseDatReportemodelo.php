<?php

abstract class BaseDatReportemodelo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_logtaller.dat_reportemodelo');
        $this->hasColumn(
                'idreportemodelo', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_reporteconcepto')
        );
        $this->hasColumn(
                'idreporteparalizacion', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idmodelo', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idmarca', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}
