<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/05/16
 * Time: 15:14
 */
class NomSituacion extends BaseNomSituacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomSituacion', array('local' => 'idpadre', 'foreign' => 'idsituacion'));
        $this->hasMany('NomSituacion', array('local' => 'idsituacion', 'foreign' => 'idpadre'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @params $idsituacion
     * @return Doctrine_Record
     */
    public function getById($idsituacion)
    {
        return Doctrine::getTable('NomSituacion')->find($idsituacion);
    }

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     * @param bool $activo
     * @return array
     * @throws Doctrine_Query_Exception
     */
    public function getSituacionLaboral($filtro, $limit, $start, $activo)
    {
        $query = Doctrine_Query::create()
            ->select('*, idsituacion as idnomenclador')
            ->from('NomSituacion')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if ($filtro) {
            $query->where("denominacion ILIKE '%$filtro%' OR descripcion ILIKE '%$filtro%'");
        }
        if ($limit) {
            $query->limit($limit)
                ->offset($start);
        }
        if ($activo === true) {
            $query->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
        }

        return $query->execute();
    }

    public function getCantSituacionLaboral($filtro, $activo)
    {
        $query = Doctrine_Query::create()
            ->from('NomSituacion');

        if ($filtro) {
            $query->where("denominacion ILIKE '%$filtro%' OR descripcion ILIKE '%$filtro%'");
        }
        if ($activo === true) {
            $query->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
        }

        return $query->count();
    }

    public function verifExiste($denom, $id = null)
    {
        $query = Doctrine_Query::create()
            ->from('NomSituacion')
            ->where("denominacion ILIKE '$denom'");

        if ($id) {
            $query->andWhere('idsituacion <> ?', $id);
        }
        return ($query->count() > 0) ? true : false;
    }

    public function deleteSitacionLaboral($id)
    {
        try {
            Doctrine_Query::create()
                ->delete('NomSituacion')
                ->whereIn('idsituacion', Utiles::reflectArray($id))
                ->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idsituacion
     * @return array|Doctrine_Exception|Exception
     */
    public function getAllSituation($activo, $cargoAsociado)
    {
        $queryObj = Doctrine_Query::create();
        $queryObj->select(
            'idsituacion as id, 
            denominacion as text, 
            fdesde, 
            fhasta,
            descripcion, 
            gestion, 
            color,*'
        )
            ->from('NomSituacion')
            ->orderBy('idsituacion ASC');

        if ($activo === true) {
            $queryObj->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
        }
        if ($cargoAsociado === false) {
            $queryObj->andWhere('asociadocargo = 0 OR idsituacion = idpadre');
        }
        if ($cargoAsociado === true) {
            $queryObj->andWhere('asociadocargo = 1 OR idsituacion = idpadre');
        }
        return $queryObj->fetchArray();
    }

    /**
     * @param null $filtro
     * @return Doctrine_Exception|Exception|int
     */
    public function getCantAllSituation($activo)
    {
        $query = Doctrine_Query::create()
            ->from('NomSituacion');
        if ($activo === true) {
            $query->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
        }

        return $query->count();
    }

    /**
     * @param $denom
     * @param null $idsituacion
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idsituacion, $idpadre)
    {
        $query = Doctrine_Query::create();
        $query->from('NomSituacion')
            ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
            ->andWhere("denominacion ilike '$denom'");
        if (!empty($idsituacion)) {
            $query->andWhere("idsituacion <> ?", $idsituacion);
        }
        if (!empty($idpadre)) {
            $query->andWhere('idpadre = ?', $idpadre);
        }
        $result = $query->count();
        if ($result > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param $idsituacion
     * @return array|Doctrine_Exception|Exception
     */
    public function getColorParent($idsituacion)
    {
        $queryObj = Doctrine_Query::create();
        $queryObj->select('idsituacion, color')
            ->from('NomSituacion')
            ->orderBy('idsituacion ASC');
        if (!empty($idsituacion)) {
            $queryObj->andWhere('idsituacion = ?', $idsituacion);
        }

        return $queryObj->fetchArray();
    }

    public function getSituacionByParams($id, $limit = null, $start = 0)
    {
        if (!empty($id)) {
            $query = Doctrine_Query::create()
                ->from('NomSituacion')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->orWhere("alia ILIKE '$id'");
            if (is_numeric($id)) {
                $query->whereIn('idsituacion', Utiles::reflectArray($id));
            }
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            return $query->execute();
        }
    }
}