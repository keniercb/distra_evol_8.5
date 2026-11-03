<?php

abstract class BaseDatReportegruposubgrupo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_logtaller.dat_reportegruposubgrupo');
        $this->hasColumn(
                'idreportegruposubgrupo', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_reporteconcepto')
        );
        $this->hasColumn(
                'idreporteparalizacion', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idgruposubgrupo', 'numeric', null,
                array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}
