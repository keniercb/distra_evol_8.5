<?php
/**
 * SolicitudNegocioAreaImplicadaRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class SolicitudNegocioAreaImplicadaRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'equalSolicitud'=> array('statement'=>'snai.idsolicitud = ?'),
        );
        parent::__construct('SolicitudNegocioAreaImplicada', 'snai', 'idarea', $filters);
    }
}