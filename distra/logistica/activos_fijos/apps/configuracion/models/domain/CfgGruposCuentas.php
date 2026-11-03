<?php

/**
 *
 */
class CfgGruposCuentas extends BaseCfgGruposCuentas
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomGruposubgrupo', array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo'));
        $relations[] = array('cardinalidad' => 'many', 'relation' => 'CfgGruposCuentas',
            'properties' => array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new NomGruposubgrupo(), $relations);
    }

    /**
     *
     */
    public function getConfGruposCuentas($idestructura)
    {
        $query = new Doctrine_Query();

        return $query->select(
            'gc.idgrupocuenta as idgrupocuenta, gc.idgruposubgrupo as idgrupo,gc.idcuentaactivo as cuentaactivo,'
            . 'gc.idcuentadepreciacion as cuentadepreciacion'
        )
            ->from('CfgGruposCuentas gc')
            ->where('gc.idestructura = ?', array($idestructura))->fetchArray();
    }

}
