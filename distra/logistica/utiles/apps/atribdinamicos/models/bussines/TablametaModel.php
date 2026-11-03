<?php

/**
 * @class     TablametaModel
 * @package
 * @author    Osleidy Quiala
 * @copyright 2017 XETID
 * @version   1.0
 */
class TablametaModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 
     * @param array $datos
     * @return boolean
     */
    public function guardarTablaMeta($datos)
    {
        $record = Doctrine_Query::create()
            ->from('DatTablaMeta')
            ->where(
                "esquema = '{$datos['esquema']}' AND tabla = '{$datos['tabla']}' "
                . "AND columnaref = '{$datos['columnaref']}' AND datoref = '{$datos['datoref']}'"
            )
            ->fetchOne();
        $idtablameta = $record->idtablameta;
        $datos['eliminados'][] = -1;
        Doctrine_Query::create()->delete('DatAtributoTabla')
            ->where('idtablameta = ?', $idtablameta)
            ->whereIn('idatribagrupacion', $datos['eliminados'])
            ->execute();
        if (!$idtablameta) {
            $record = new DatTablaMeta();
            $record->synchronizeWithArray($datos);
            $record->save();
            $idtablameta = $record->idtablameta;
        } elseif (count($datos['adicionados']) == 0) {
            $sql = "DELETE FROM mod_logmetadata.dat_tablameta tm WHERE tm.idtablameta = ? "
                . "AND (SELECT count(at.idatributotabla) FROM mod_logmetadata.dat_atributotabla at "
                . "WHERE at.idtablameta = tm.idtablameta) = 0";
            Doctrine_Manager::connection()->execute($sql, array($idtablameta));
        }
        foreach ($datos['adicionados'] as $id) {
            $obj = Doctrine_Query::create()->from('DatAtributoTabla')
                ->where('idtablameta = ? AND idatribagrupacion = ?', array($idtablameta, $id))
                ->fetchOne();
            if (!$obj->idatributotabla) {
                $obj = new DatAtributoTabla();
                $obj->idtablameta = $idtablameta;
                $obj->idatribagrupacion = $id;
                $obj->save();
            }
        }
        return true;
    }

    public function delTablaMeta($params)
    {
        $tablaMeta = Doctrine::getTable('DatTablaMeta')->findByDql(
            " esquema = '{$params->esquema}' AND tabla = '{$params->tabla}' AND columnaref = '{$params->columnaref}' "
            . "AND datoref = '{$params->datoref}' "
        );
        if (isset($tablaMeta[0])) {
            $tablaMeta[0]->delete();
        }
    }

    public function getAtribPropiedades($filtro)
    {
        $query = Doctrine_Query::create()
            ->select(
                'aa.idatribagrupacion, cfga.propiedades AS propiedades, cfga.codigoui AS codigoui, '
                . 'cfga.tipodato AS tipodato, cfga.nombre AS nombre, cfga.idatributo AS idatributo'
            )
            ->from('DatAtribAgrupacion  aa')
            ->innerJoin('aa.ConfAtributo cfga')
            ->innerJoin('aa.DatAtributoTabla ta')
            ->innerJoin('ta.DatTablaMeta t')
            ->where(
                "t.esquema = '{$filtro['esquema']}' AND t.tabla = '{$filtro['tabla']}' "
                . "AND t.columnaref = '{$filtro['columnaref']}' AND t.datoref = '{$filtro['datoref']}'"
            )
            ->orderBy('aa.idatribagrupacion');
        $result = $query->fetchArray();
        $json = json_encode($result, JSON_UNESCAPED_UNICODE);
//        $json = stripslashes(json_encode($result, JSON_UNESCAPED_UNICODE));
        return $json;
    }

}
