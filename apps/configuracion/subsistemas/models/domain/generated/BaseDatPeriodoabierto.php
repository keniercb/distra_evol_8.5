<?php

abstract class BaseDatPeriodoabierto extends Doctrine_Record {

    /**
     *  Cambiar la definición de la tabla
     * 
     */
    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.dat_periodoabierto');
        $this->hasColumn(
                'idperiodoabierto', 'numeric', 19,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_periodoabierto')
        );
        $this->hasColumn('idperiodo', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructurasubsist', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsubsistema', 'numeric', 19, array('notnull' => true, 'primary' => false));

        $this->hasColumn('observacionsolicitud', 'varchar', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuariosolicitud', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechasolicitud', 'date', array('default' => 'now()', 'notnull' => true, 'primary' => false));

        $this->hasColumn('observacionaprobacion', 'varchar', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuarioaprobacion', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaaprobacion', 'timestamp', array('notnull' => false, 'primary' => false));

        $this->hasColumn('idusuariocierre', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacierre', 'timestamp', array('notnull' => false, 'primary' => false));

        $this->hasColumn('estado', 'numeric', 1, array('notnull' => true, 'primary' => false));
    }

}
