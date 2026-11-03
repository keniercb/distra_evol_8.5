<?php
/**
 * PlantillaRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class PlantillaRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'distinctId' => array('statement'=>'p.idplantilla <> ?'),
            'equalDenom'=> array('statement'=>'p.denominacion ilike ?'),
            'equalIdentidad'=> array('statement'=>'p.identidad = ?'),
        );
        parent::__construct('Plantilla', 'p', 'idplantilla', $filters);
    }

    public function getPlantillas($filters)
    {

        $query = $this->getBasicDqlQuery()
            ->addSelect("pe.*, (encode(pe.img,'escape')) as img")//,
            ->leftJoin('p.PlantillaEstructura pe');

        $query = $this->getDqlQueryBuilder($query, $filters);

        return $query->fetchArray();
    }
}