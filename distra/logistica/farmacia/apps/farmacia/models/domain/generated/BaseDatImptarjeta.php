<?php

abstract class BaseDatImptarjeta extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_imptarjeta');
        $this->hasColumn('idimptarjeta', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.dat_imptarjeta_idimptarjeta'));
        $this->hasColumn('nofarmacia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('numeroidentidad', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombrepaciente', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('snombrepaciente', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('apellidopaciente', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('sapellidopaciente', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('direccion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cmf', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('provincia', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('municipio', 'character varying', null, array('notnull' => true, 'primary' => false));
//        $this->hasColumn('codigomed', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('medicamento', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('dosis', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombremedico', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('snombremedico', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('apellidomedico', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('sapellidomedico', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nroregistro', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cmfarchivado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('policlinico', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hospital', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('otrasunidades', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaexpedicion', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}