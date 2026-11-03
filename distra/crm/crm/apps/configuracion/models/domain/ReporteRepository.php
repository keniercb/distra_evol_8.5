<?php
/**
 * ReporteRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class ReporteRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'distinctId' => array('statement'=>'r.idreporte <> ?'),
            'equalDenom'=> array('statement'=>'r.denominacion ilike ?'),
            'equalParent'=> array('statement'=>'r.idpadre = ?'),
            'equalIdmodulo'=> array('statement'=>'r.idmodulo = ?'),
        );
        parent::__construct('Reporte', 'r', 'idreporte', $filters);
    }

//    public function getCountReportesInModules($idsmodule)
//    {
//        return $this->getBasicDqlQuery()
//            ->whereIn('idmodulo', $idsmodule)
//            ->count();
//    }

    public function getRecordsByIdentifModule($identifmodulo, $filters)
    {
        $query = $this->getBasicDqlQuery()
                ->innerJoin('r.ModuloReporte m')
                ->where('m.identificador ilike ?', $identifmodulo);

        $filterReporsitory = new ReporteFiltroRepository();
        $query = $filterReporsitory->concatDqlFiltersData($query, 'r');

        return $this->getDqlQueryBuilder($query, $filters)->fetchArray();
    }
}