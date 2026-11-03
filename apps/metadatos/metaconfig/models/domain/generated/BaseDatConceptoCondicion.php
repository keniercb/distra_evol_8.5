<?php

/**
 * Class BaseNomConceptopropiedad
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
abstract class BaseDatConceptoCondicion extends Doctrine_Record
{
    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_conceptocondicion');
        $this->hasColumn('idconceptocondicion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idusuarioconcepto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idorgano', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconcepto', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function Setup()
    {
        parent::setUp();
    }
}