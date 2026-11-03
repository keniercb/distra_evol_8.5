<?php

/**
 * BaseNomGruposubgrupo
 *
 * @package    Activos Fijos Tangibles
 * @subpackage Nomencladores
 * @author     Jorge Luis Cuellar Mondeja
 * @version    2.0
 */
abstract class BaseNomGruposubgrupo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_gruposubgrupo');
        $this->hasColumn(
            'idgruposubgrupo', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_nomgruposubgrupo')
        );
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarbol', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idformato', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordenizq', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordender', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nivel', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtabla', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtablageneral', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('arridtablas', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'arridtablasgenerales', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('type' => 'date', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('type' => 'date', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
