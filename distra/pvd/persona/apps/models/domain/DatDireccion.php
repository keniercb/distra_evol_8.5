<?php

/**
 * Class DatDireccion
 */
class DatDireccion extends BaseDatDireccion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @params array $iddireccion
     *
     * @return Doctrine_Record
     */
    public function getById(array $iddireccion)
    {
        try {
            if (count($iddireccion) > 0) {
                $query = Doctrine_Query::create()->from('DatDireccion')->whereIn('iddireccion', $iddireccion);

                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getDireccionesByPesona(array $idpersona, $filtro, $limit = null, $start = 0)
    {
        try {
            $select
                = "dd.*, (CASE
                WHEN dd.fdesde <= now() and (now() <= dd.fhasta or dd.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico";
            $query = Doctrine_Query::create()->select($select)->from('DatDireccion dd')->whereIn(
                'dd.idpersona', $idpersona
            );
            if ($limit) {
                $query->limit($limit)->offset($start);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantDireccionesByPesona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatDireccion')->whereIn('idpersona', $idpersona);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idDirecciones
     * @param null $idpersona
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delDirecciones(array $idDirecciones, $idpersona = null)
    {
        try {
            if (count($idDirecciones) > 0) {
                $query = Doctrine_Query::create()->delete('DatDireccion')->whereIn('iddireccion', $idDirecciones);
                if ($idpersona) {
                    $query->andWhere('idpersona = ?', $idpersona);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getDireccionOficialByPersona(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->from('DatDireccion')->whereIn('idpersona', $idpersona)->andWhere(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function addDQLDireccion(
        Doctrine_Query &$objDQ, $aTR, $aT, $typeR = 'leftJoin', $oficial = true, $inDQL = false
    )
    {
        $with = "WITH $aT.fdesde <= now() and (now() <= $aT.fhasta or $aT.fhasta IS NULL) ";
        $with .= $oficial ? "AND $aT.oficial = 1" : '';
        try {
            switch (strtolower($typeR)) {
                case 'leftjoin':
                    $objDQ->leftJoin("$aTR.DatDireccion $aT $with");
                    break;
                default:
                    $objDQ->innerJoin("$aTR.DatDireccion $aT $with");
                    break;
            }
            if ($inDQL) {
                $this->addSelectDQLDireccion($objDQ, $aT);
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function addSelectDQLDireccion(Doctrine_Query &$objDQ, $aT)
    {
        $select
            = "$aT.iddireccion as iddireccion, $aT.idpais as idpais, $aT.idprovincia as idprovincia, $aT.idmunicipio as idmunicipio
        , $aT.direccion as direccion, $aT.idprovincia as idprovincia";
        $objDQ->addSelect($select);
    }
}

