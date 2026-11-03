<?php

/**
 *
 */
class NomEstatusoperativo extends BaseNomEstatusoperativo
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEstatustecnicoEstatusoperativo',
            array('local' => 'idestatusoperativo', 'foreign' => 'idestatusoperativo')
        );
    }

    /**
     *
     */
    private function getSelect($alias = 'e', $posAlias = '')
    {
        return "
                  {$alias}.idestatusoperativo as idestatusoperativo{$posAlias},
                  {$alias}.denominacion as denominacion{$posAlias},
                  {$alias}.estado as estado{$posAlias},
                  {$alias}.denominacion as estado
              ";
    }

    /**
     *
     */
    private function getWhere(
    $query, $alias, $aliasEstTec, $aliasEstTecEstOper, $parametros
    )
    {
        if (!$query) {
            $query = new Doctrine_Query();
            $query->from("NomEstatusoperativo {$alias}");
        }

        if ($parametros['denominacion']) {
            $query->addWhere(
                "{$alias}.denominacion iLike '%{$parametros['denominacion']}%'"
            );
        }

        if ($parametros['idestatusoperativo']) {
            $query->addWhere(
                "{$alias}.idestatusoperativo = ?", array($parametros['idestatusoperativo'])
            );
        }

        if ($parametros['disponible']) {
            $query->addWhere(
                "{$aliasEstTecEstOper}.disponible = ?", array($parametros['disponible'])
            );
        }

        if ($parametros['afectacdt']) {
            $query->addWhere(
                "{$aliasEstTecEstOper}.afectacdt = ?", array($parametros['afectacdt'])
            );
        }

        if ($parametros['pordefecto']) {
            $query->addWhere(
                "{$aliasEstTecEstOper}.pordefecto = ?", array($parametros['pordefecto'])
            );
        }

        if ($parametros['estado']) {
            $query->addWhere(
                "{$alias}.estado = ?", array($parametros['estado'])
            );
        }

        if ($parametros['idestatustecnico']) {
            $query->addWhere(
                "{$aliasEstTecEstOper}.idestatustecnico = ?", array($parametros['idestatustecnico'])
            );
        }

        if ($parametros['idpadre']) {
            $query->addWhere(
                "{$aliasEstTec}.idestatustecnico = ?", array($parametros['idpadre'])
            );
        }

        if ($parametros['deprecia']) {
            $query->addWhere(
                "{$aliasEstTec}.deprecia = ?", array($parametros['deprecia'])
            );
        }

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        return $query;
    }

    /**
     *
     */
    public function getEstatusOperativos($parametros)
    {
        $query = self::getWhere(false, 'eo', 'et', 'eto', $parametros);

        $query->innerJoin('eo.DatEstatustecnicoEstatusoperativo eto');
        $query->innerJoin('eto.NomEstatustecnico et');

        $query->addSelect(
            'eo.idestatusoperativo as id, eo.idestatusoperativo, eo.denominacion, eo.estado, 
             eto.disponible as disponible, eto.afectacdt as afectacdt, eto.pordefecto as pordefecto'
        );

        $query->orderBy('eo.idestatusoperativo DESC');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getCantEstatusOperativos($parametros)
    {
        unset($parametros['start']);
        unset($parametros['limit']);

        $query = self::getWhere(false, 'eo', 'et', 'eto', $parametros);

        $query->innerJoin('eo.DatEstatustecnicoEstatusoperativo eto');
        $query->innerJoin('eto.NomEstatustecnico et');

        $query->addSelect(
            'eo.idestatusoperativo as id, eo.idestatusoperativo, eo.denominacion, eo.estado,
             eto.disponible as disponible, eto.afectacdt as afectacdt, eto.pordefecto as pordefecto'
        );

        return $query->count();
    }

    /**
     *
     */
    public function getIdsEstOperativosDadoIdsEstTecnico($idestatustecnico)
    {
        $query = new Doctrine_Query();
        $respuesta = array();

        $query->from('NomEstatusoperativo eo')
            ->innerJoin('eo.DatEstatustecnicoEstatusoperativo eto');

        $query->addSelect('eo.idestatusoperativo');
        $query->addWhere('eto.idestatustecnico = ?', $idestatustecnico);
        $resp = $query->fetchArray();

        foreach ($resp as $value) {
            $respuesta[] = $value['idestatusoperativo'];
        }

        return $respuesta;
    }

    /**
     *
     */
    public function getJoinEstadoOperativo(
    Doctrine_Query $query, $aliasTbOrigen, $aliasPropio = 'estadotecnico', $innerJoin = false
    )
    {

        if ($innerJoin) {
            $query->innerJoin(
                "{$aliasTbOrigen}.NomEstatusoperativo {$aliasPropio}"
            );
        } else {
            $query->leftJoin(
                "{$aliasTbOrigen}.NomEstatusoperativo {$aliasPropio}"
            );
        }

        return $query;
    }

    /**
     * return integer (0) - No duplicado, (-1) - Duplicado con el mismo estado técnico,
     * (idestatusoperativo) - Duplicado con en otro estado técnico
     */
    public function isEstOperDuplicado($denominacion, $idestatusoperativo)
    {
        $estaus = Doctrine::getTable('NomEstatusoperativo')->findByDql(
            "denominacion iLike '{$denominacion}'"
        );

        if (count($estaus)) {

            $estausTecEstatusOper = Doctrine::getTable('DatEstatustecnicoEstatusoperativo')
            ->findByDql(
                "idestatusoperativo = ? and idestatustecnico = ?",
                array($estaus[0]->idestatusoperativo, $idestatusoperativo)
            );

            if (count($estausTecEstatusOper)) {
                return -1; // Duplicado con el mismo estado técnico
            }

            return $estaus[0]->idestatusoperativo; // Duplicado con en otro estado técnico
        }

        return 0; // No duplicado
    }

}
