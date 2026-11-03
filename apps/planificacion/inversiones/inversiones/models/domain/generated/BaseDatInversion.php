
<?php

abstract class BaseDatInversion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_inversion');
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_inversion'));
        $this->hasColumn('idtipoinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('analpostinversiones', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipoinversionprograma', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idformapropiedad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcaracteristica', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmedioambiente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddatdesempenno', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idobjetivo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idprovincia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fasttrack', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadoinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadoaprobacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idefectocomercial', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cuadrada', 'numeric', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcumplimientoinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idprograma', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idgrupoobra', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadoplaninversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idsectorestrategico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preparacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcontenido', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('eliminada', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

