<?php

/**
 * ReporteRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class ReporteRepository extends BaseRepository {

    public function __construct() {
        $filters = array(
            'distinctId' => array('statement' => 'r.idreporte <> ?'),
            'equalDenom' => array('statement' => 'r.denominacion ilike ?'),
            'equalIdentificador' => array('statement' => 'r.identificador ilike ?'),
            'equalParent' => array('statement' => 'r.idpadre = ?'),
            'equalIdmodulo' => array('statement' => 'r.idmodulo = ?'),
        );
        parent::__construct('Reporte', 'r', 'idreporte', $filters);
    }

    public function getCountReportesInModules($idsmodule) {
        return $this->getBasicDqlQuery()
                        ->whereIn('idmodulo', $idsmodule)
                        ->count();
    }

    public function getRecordsByIdentifModule($moduleIdentificador, $filters) {
        $query = $this->getBasicDqlQuery()
                ->innerJoin('r.Module m')
                ->where('m.identificador ilike ? AND activo = 1', $moduleIdentificador);

        return $this->getDqlQueryBuilder($query, $filters)->fetchArray();
    }

    public function getReporteInfo($moduleIdentifr, $reporteIdentif) {
        $query = $this->getBasicDqlQuery()
                ->addSelect('rf.*, rft.*')
                ->innerJoin('r.Module m')
                ->where('m.identificador ilike ? and r.identificador ilike ?', array($moduleIdentifr, $reporteIdentif));

        $filterReporsitory = new ReporteFilterRepository();
        $query = $filterReporsitory->concatDqlFiltersData($query, 'r');

        return $query->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

}
