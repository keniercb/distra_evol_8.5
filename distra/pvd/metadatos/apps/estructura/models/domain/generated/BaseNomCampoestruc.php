<?php

/**
 * Class BaseNomCampoestruc
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2014 xetid
 */
abstract class BaseNomCampoestruc extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_campoestruc');
        $this->hasColumn(
             'idcampoestruc', 'numeric', null, array(
                                'notnull'  => true, 'primary' => true,
                                'sequence' => 'mod_estructuracomp.sec_campoestruc')
        );
        $this->hasColumn('actual', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('eliminable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconcepto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('longitud', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombremostrar', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('obligatorio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('regex', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tipocampo', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('visible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('visual', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}