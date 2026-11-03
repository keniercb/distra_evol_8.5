<?php

/**
 * Class NomCausalimitacion
 */
class NomCausalimitacion extends BaseNomCausalimitacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcausalimitacion
     *
     * @return Doctrine_Record
     */
    public function getById($idcausalimitacion)
    {
        return Doctrine::getTable('NomCausalimitacion')->find($idcausalimitacion);
    }

    public function getcausas()
    {
        try {
            $query = Doctrine_Query::create()->select('idcausalimitacion as idcausa, denominacion as dencausa')->from(
                'NomCausalimitacion'
            );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcausalimitacion
     *
     * @return array|Doctrine_Exception|Exception
     */
    public function getAllCausa($filtro = null)
    {
        $queryObj = Doctrine_Query::create();
        $queryObj->select(
            'idcausalimitacion as idnomenclador, idcausalimitacion, denominacion, abreviatura, fdesde, 
            fhasta ,descripcion, abreviatura'
        )->from('NomCausalimitacion')->orderBy('idcausalimitacion ASC');
        if ($filtro != null) {
            $queryObj->addWhere("denominacion ilike '%$filtro%' or descripcion ilike ' % $filtro % '");
        }

        return $queryObj->fetchArray();
    }

    /**
     * @param null $filtro
     *
     * @return Doctrine_Exception|Exception|int
     */
    public function getCantAllCausas($filtro = null)
    {
        try {
            $queryObj = Doctrine_Query::create();
            $queryObj->select('COUNT(idcausalimitacion)')->from('NomCausalimitacion');
            if ($filtro != null) {
                $queryObj->addWhere("denominacion ilike '%$filtro%' or descripcion ilike ' % $filtro % '");
            }

            return $queryObj;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getActiveCausa()
    {
        try {
            $query = Doctrine_Query::create()->select('*')->from('NomCausalimitacion')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de servicios activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveCausa()
    {
        try {
            $query = Doctrine_Query::create()->from('NomCausalimitacion')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $denom
     * @param null $idservicio
     *
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idcausalimitacion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCausalimitacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere(
                    "denominacion ilike '$denom'"
                );
            if (!empty($idcausalimitacion)) {
                $query->andWhere("idcausalimitacion <> ?", $idcausalimitacion);
            }
            $result = $query->count();
            if ($result > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            print_r('Error....!!!!!!!!, NomCausalimitacion.php');
            throw $e;
        }
    }

}
