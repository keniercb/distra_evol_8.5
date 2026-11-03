<?php

/**
 * BaseNomGruposubgrupohoja
 *
 * @package    Activos Fijos Tangibles
 * @subpackage Nomencladores
 * @author     Jorge Luis Cuellar Mondeja
 * @version    2.0
 */
abstract class BaseNomGruposubgrupohoja extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_gruposubgrupohoja');
        $this->hasColumn('idgruposubgrupo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('vidautil', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tasafiscalmin', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tasafiscalmax', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('porcientorecuperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
