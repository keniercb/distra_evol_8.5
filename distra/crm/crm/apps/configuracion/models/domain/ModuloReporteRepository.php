<?php
/**
 * ModuloReporteRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class ModuloReporteRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'distinctId' => array('statement'=>'idmodulo <> ?'),
            'equalIdentificador'=> array('statement'=>'identificador ilike ?'),
            'equalDenom'=> array('statement'=>'denominacion ilike ?'),
        );
        parent::__construct('ModuloReporte', '', 'idmodulo', $filters);
    }
}