<?php

/**
 *
 */
class NomEstatustecnico extends BaseNomEstatustecnico
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEstatustecnicoEntidad', array('local' => 'idestatustecnico', 'foreign' => 'idestatustecnico')
        );
        $this->hasOne(
            'DatEstatustecnicoEstatusoperativo',
            array('local' => 'idestatustecnico',
            'foreign' => 'idestatustecnico')
        );
        $this->hasMany(
            'DatMovRegnumericoActivo', array('local' => 'idestatustecnico',
            'foreign' => 'idestatustecnico')
        );
    }

    /**
     *
     */
    public function getEstatusTecnicos($parametros = array())
    {
        $query = self::getWhere(false, 'et', $parametros);
        $query->select('et.idestatustecnico');
        $query->addSelect(self::getSelect('et'));
        if ($parametros['idestructura']) {
            $query->leftJoin(
                "et.DatEstatustecnicoEntidad ete "
                . "ON ete.idestatustecnico = et.idestatustecnico "
                . "AND ete.idestructuracomun = {$parametros['idestructura']}"
            );
            $query->addSelect("(ete.idestructuracomun is not null) AS usarentidad");
        }
        return $query->fetchArray();
    }

    /**
     *
     */
    public function getEstatusTecUsanEntidad($idEstructura)
    {
        $query = new Doctrine_Query();
        $query->from('NomEstatustecnico et');
        $query->innerJoin('et.DatEstatustecnicoEntidad ete');
        $query->addWhere('ete.idestructuracomun = ? AND et.estado = ?', array($idEstructura, 1));

        return $query->fetchArray();
    }

    /**
     *
     */
    private function getSelect($alias = 'e', $posAlias = '')
    {
        return "
                {$alias}.idestatustecnico as idestatustecnico{$posAlias},
                {$alias}.deprecia as deprecia{$posAlias},
                {$alias}.denominacion as denominacion{$posAlias},
                {$alias}.estado as estado{$posAlias},
                {$alias}.fechainicio as fechainicio{$posAlias},
                {$alias}.fechafin as fechafin{$posAlias}
            ";
    }

    /**
     *
     */
    private function getWhere($query, $alias, $parametros)
    {
        if (!$query) {
            $query = new Doctrine_Query();
            $query->from("NomEstatustecnico {$alias}");
        }

        if ($parametros['denominacion']) {
            $query->addWhere(
                "{$alias}.denominacion iLike '%{$parametros['denominacion']}%'"
            );
        }

        if ($parametros['query']) {
            $query->addWhere(
                "{$alias}.denominacion iLike '%{$parametros['query']}%'"
            );
        }
        if ($parametros['criterio']) {
            $query->addWhere(
                "{$alias}.denominacion iLike '%{$parametros['criterio']}%'"
            );
        }

        if ($parametros['idestatustecnico']) {
            $query->addWhere(
                "{$alias}.idestatustecnico = ?", array($parametros['idestatustecnico'])
            );
        }

        if ($parametros['deprecia']) {
            $query->addWhere(
                "{$alias}.deprecia = ?", array($parametros['deprecia'])
            );
        }

        if ($parametros['estado']) {
            $query->addWhere(
                "{$alias}.estado = ?", array($parametros['estado'])
            );
        }

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        $fechaSistema = date('d/m/Y');

        //1 es false, 2 true
        if ($parametros['incluirvencidas'] != 2) {
            $query->addWhere(
                "({$alias}.fechainicio <= '{$fechaSistema}' AND {$alias}.fechafin >= '{$fechaSistema}')" .
                " OR {$alias}.fechafin is null"
            );
        }

        return $query;
    }

    /**
     *
     */
    public function getCantEstatusTecnicos($parametros)
    {
        unset($parametros['start']);
        unset($parametros['limit']);

        $query = self::getWhere(false, 'et', $parametros);
        $query->leftJoin('et.DatEstatustecnicoEntidad ete');

        return $query->count();
    }

    /**
     * Devolver objeto Doctrine_Query de NomEstatustecnico relacionado tanto por innerJoin
     * como leftJoin en dependencia de la parametrización que se le haga al método
     *
     * @param $query         Doctrine_Query De la clase la cual se quiere relacionar
     *                       con la clase NomEstatustecnico
     * @param $aliasTbOrigen Alias que se utilizara
     */
    public function getJoinEstadoTecnico(
    Doctrine_Query $query, $aliasTbOrigen, $aliasPropio = 'estadotecnico', $parametros = array(), $innerJoin = false
    )
    {
        if ($innerJoin) {
            $query->innerJoin(
                "{$aliasTbOrigen}.NomEstatustecnico {$aliasPropio}"
            );
        } else {
            $query->leftJoin(
                "{$aliasTbOrigen}.NomEstatustecnico {$aliasPropio}"
            );
        }

        if (count($parametros)) {
            $query = self::getWhere($query, $aliasPropio, $parametros);
        }

        return $query;
    }

    /**
     * Devuele solo los estados técnicos con algún estado operativo por defecto
     */
    public function getEstatusTecConEstatusOperDefault($parametros = array())
    {
        $query = self::getWhere(false, 'e', $parametros);
        $query->addSelect(self::getSelect('e'));

        $estructura = 'Estructura';

        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->$estructura->idestructura;

        if ($parametros['idestructura']) {
            $idEstructura = $parametros['idestructura'];
        }
        $query->addWhere("nom.idestructuracomun = ?", array($idEstructura));

        $query->addSelect('e.idestatustecnico');
        $query->innerJoin('e.DatEstatustecnicoEstatusoperativo relacion');
        $query->innerJoin('e.DatEstatustecnicoEntidad nom');
        $query->innerJoin('relacion.NomEstatusoperativo eoperativo');

        $query->addWhere(
            'e.estado = 1 AND eoperativo.estado = 1 AND relacion.pordefecto = 1'
        );

        return $query->fetchArray();
    }

}
