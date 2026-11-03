<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 * */
class BaseDatInscripcionInmueble extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_inscripcioninmueble');
        
        $this->hasColumn('idinscripcion', 'numeric', 19, array(
            'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpatrimonio.sec_datinmueble')
            );
        $this->hasColumn('idregnunericoactivo', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idseccion', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddptprovincia', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddptmunicipio', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('modregimen', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tomo', 'character varying', 30, array('notnull' => false, 'primary' => false));
        $this->hasColumn('folio', 'character varying', 30, array('notnull' => false, 'primary' => false));
        $this->hasColumn('finca', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nroresolucion', 'character varying', 30, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainscripcion', 'date', array('notnull' => false, 'primary' => false));
       
    }
}
