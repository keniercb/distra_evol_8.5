<?php

/**
 * @class     AgrupacionesModel
 * @package
 * @author    Osleidy Quiala
 * @copyright 2017 XETID
 * @version   1.0
 */
class AgrupacionesModel extends BaseModel
{
    private $confAgrupacion;

    public function __construct()
    {
        $this->confAgrupacion = new ConfAgrupacion();
        parent::__construct();
    }

    /**
     * Devuelve las agrupaciones de los atributos dinamicos.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarAgrupaciones($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('a.idagrupacion, a.denominacion')
            ->from('ConfAgrupacion a')
            ->where('a.idagrupacion <> 1')
            ->orderBy('a.idagrupacion');
        if ($filtro['criterio']) {
            $query->addWhere("a.denominacion ILIKE '%{$filtro['criterio']}%'");
        }
        if ($dql) {
            return $dql;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Adiciona una agrupación.
     * @param array $datos
     * @return array
     */
    public function adicionarAgrupacion($datos)
    {
        $record = new ConfAgrupacion();
        if ($datos['idagrupacion']) {
            $record->assignIdentifier($datos['idagrupacion']);
        }
        $record->synchronizeWithArray($datos);
        $record->save();
        return array('idagrupacion' => $record->idagrupacion);
    }

    /**
     * Verifica si la agrupacion dinamico existe.
     * @param array $filtro
     * @return boolean
     */
    public function existeAgrupacion($filtro)
    {
        $query = Doctrine_Query::create()
            ->select('g.idagrupacion')
            ->from('ConfAgrupacion g')
            ->where("g.denominacion ILIKE '{$filtro['denominacion']}'");
        if ($filtro['idagrupacion']) {
            $query->whereNotIn('g.idagrupacion', $filtro['idagrupacion']);
        }
        return $query->count() > 0;
    }

    /**
     * Elimina las agrupaciones especificadas.
     * @param array $idagrupaciones
     * @return boolean
     */
    public function eliminarAgrupaciones($idagrupaciones)
    {
        Doctrine_Query::create()->delete('ConfAgrupacion')->whereIn('idagrupacion', $idagrupaciones)->execute();
        return true;
    }

    public function getTreeAgrupaciones($filtro)
    {
        if ($filtro['esquema'] != '') {
            $tablameta = $this->getIdTablaMeta($filtro);
            $filtro['idtablameta'] = $tablameta->idtablameta ? $tablameta->idtablameta : -1;
        }
        if ($filtro['node'] == 0) {
            $query = $this->confAgrupacion->cargarAgrupaciones($filtro, true);
            $query->addSelect(
                    "a.denominacion AS text, (CASE WHEN (count(ag.idatribagrupacion) = (SELECT count(_at.idatribagrupacion) "
                    . "FROM DatAtributoTabla _at INNER JOIN _at.DatTablaMeta _tm INNER JOIN _at.DatAtribAgrupacion _ag "
                    . "WHERE _ag.idagrupacion = a.idagrupacion AND _tm.idtablameta = {$filtro['idtablameta']})) "
                    . "THEN true ELSE false END) AS checked, 'folder' AS iconCls, false AS leaf, "
                    . "{$filtro['node']} AS _parent"
                )
                ->innerJoin('a.DatAtribAgrupacion ag')
                ->groupBy('a.idagrupacion');
            $agrupaciones = $query->fetchArray();
        } else {
            $filtro['idagrupacion'] = $filtro['node'];
            $agrupaciones = $this->obtenerAtributosAgrupacion($filtro);
        }
        return $agrupaciones;
    }

    /**
     * 
     * @param array $filtro
     * @return Doctrine_Record
     */
    private function getIdTablaMeta($filtro)
    {
        $query = Doctrine_Query::create()
            ->from('DatTablaMeta t')
            ->where(
                "t.esquema = '{$filtro['esquema']}' AND t.tabla = '{$filtro['tabla']}' "
                . "AND t.columnaref = '{$filtro['columnaref']}' AND t.datoref = '{$filtro['datoref']}'"
            );
        return $query->fetchOne();
    }

    /**
     * 
     * @param array $filtro
     * @return array
     */
    private function obtenerAtributosAgrupacion($filtro)
    {
        $query = Doctrine_Query::create()
            ->select(
                "a.idatributo, ag.idatribagrupacion AS id, a.nombre AS denominacion, a.nombre AS text, "
                . "ag.idatribagrupacion AS idatribagrupacion, (CASE WHEN (SELECT count(_at.idatribagrupacion) "
                . "FROM DatAtributoTabla _at INNER JOIN _at.DatTablaMeta _tm INNER JOIN _at.DatAtribAgrupacion _ag "
                . "WHERE _ag.idatribagrupacion = ag.idatribagrupacion "
                . "AND _tm.idtablameta = {$filtro['idtablameta']}) > 0 THEN true ELSE false END) AS checked, "
                . "'indicadores' AS iconCls, true AS leaf, {$filtro['node']} AS _parent"
            )
            ->from('ConfAtributo a')
            ->innerJoin('a.DatAtribAgrupacion ag')
            ->where('ag.idagrupacion = ?', $filtro['idagrupacion'])
            ->orderBy('a.idatributo');
        if ($filtro['alias']) {
            $query->addWhere("a.denominacion ILIKE '%{$filtro['alias']}%'");
        }
        return $query->fetchArray();
    }

    /**
     * 
     * @param array $filtro
     * @return array
     */
    public function getCodUiAtributos($filtro)
    {
        $agrupMeta = Doctrine_Query::create()
            ->select('g.idagrupacion, g.denominacion, t.idtablameta AS idtablameta')
            ->from('ConfAgrupacion g')
            ->innerJoin('g.DatAtribAgrupacion aa')
            ->innerJoin('aa.DatAtributoTabla at')
            ->innerJoin('at.DatTablaMeta t')
            ->where(
                "t.esquema = '{$filtro['esquema']}' AND t.tabla = '{$filtro['tabla']}' "
                . "AND t.columnaref = '{$filtro['columnaref']}' AND t.datoref = '{$filtro['datoref']}'"
            )
            ->orderBy('g.idagrupacion')
            ->fetchArray();
        foreach ($agrupMeta as $key => $agrup) {
            $filtro['idagrupacion'] = $agrup['idagrupacion'];
            $filtro['idtablameta'] = $agrup['idtablameta'];
            $agrupMeta[$key]['atributos'] = $this->getAtribMeta($filtro);
        }
        return $agrupMeta;
    }

    /**
     * 
     * @param array $filtro
     * @return array
     */
    private function getAtribMeta($filtro)
    {
        $query = Doctrine_Query::create()
            ->select('a.idatributo, a.nombre, a.tipodato, a.codigoui, a.propiedades')
            ->from('ConfAtributo a')
            ->innerJoin('a.DatAtribAgrupacion aa')
            ->innerJoin('aa.DatAtributoTabla at')
            ->where(
                'at.idtablameta = ? AND aa.idagrupacion = ?', array($filtro['idtablameta'], $filtro['idagrupacion'])
            )
            ->orderBy('a.idatributo');
        return $query->fetchArray();
    }

}
