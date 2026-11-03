<?php
/**
 * ReporteFilterRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class ReporteFilterRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'distinctId' => array('statement'=>'rf.idfiltro <> ?'),
            'equalDenom'=> array('statement'=>'rf.denominacion ilike ?'),
            'equalIdReporte' => array('statement'=>'rf.idreporte = ?'),
        );
        parent::__construct('ReporteFiltro', 'rf', 'idfiltro', $filters);
    }

    public function getListReporteFilters($filters)
    {
        return $this->getDqlQueryBuilder($this->getDqlQueryWidthBasicData(), $filters)->fetchArray();
    }

    public function getFilterNomencladorById($idfilter)
    {
        return  Doctrine_Query::create()
                ->from('ReporteFiltroNomenclador')
                ->where('idfiltro = ?', $idfilter)
                ->fetchOne();
    }

    public function concatDqlFiltersData($query, $alias)
    {
        return $query->addSelect('rf.*, rft.*, rfn.* , rfnom.*')
                    ->leftJoin($alias.'.ReporteFiltro as rf')
                    ->leftJoin('rf.ReporteFiltroTexto as rft')
                    ->leftJoin('rf.ReporteFiltroNumerico as rfn')
                    ->leftJoin('rf.ReporteFiltroNomenclador as rfnom')
                    ->orderBy('rf.orden');
    }

    private function getDqlQueryWidthBasicData()
    {
        return $this->getBasicDqlQuery()
            ->addSelect("rft.longitudminima as longitudminima, rft.longitudmaxima as longitudmaxima")
            ->addSelect("rfn.valorminimo as valorminimo, rfn.valormaximo as valormaximo")
            ->addSelect("rfnom.nomidentificador as nomidentificador, rfnom.nomdenominacion as nomdenominacion")
            ->addSelect("rfnom.tipofuentedatos as tipofuentedatos, rfnom.sentenciasql as sentenciasql")
            ->addSelect("rfnom.nomservicio as nomservicio")
            ->leftJoin('rf.ReporteFiltroTexto as rft')
            ->leftJoin('rf.ReporteFiltroNumerico as rfn')
            ->leftJoin('rf.ReporteFiltroNomenclador as rfnom');
    }
}