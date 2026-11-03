<?php

/**
 * Class DatOcupaciontiempoguerra
 */
class DatOcupaciontiempoguerra extends BaseDatOcupaciontiempoguerra
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
     * @params array $idocupaciontiempoguerra
     * @return Doctrine_Record
     */
    public function getById(array $idocupaciontiempoguerra)
    {
        try {
            if (count($idocupaciontiempoguerra) > 0) {
                $query = Doctrine_Query::create()
                    ->from('DatOcupaciontiempoguerra')
                    ->whereIn('idocupaciontiempoguerra', $idocupaciontiempoguerra);
                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


    /**
     * @param array $idpersona
     * @param $filtro
     * @param null $limit
     * @param int $start
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCargosByPersona(array $idpersona, $filtro, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select("do.*, (CASE
                WHEN do.fdesde <= now() and (now() <= do.fhasta or do.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico")
                ->from('DatOcupaciontiempoguerra do')
                ->whereIn('do.idpersona', $idpersona);
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param $filtro
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantCargosByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatOcupaciontiempoguerra')
                ->whereIn('idpersona', $idpersona);
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idocupaciontiempoguerra
     * @param null $idpersona
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delCargosTiempoGuerra(array $idocupaciontiempoguerra, $idpersona = null)
    {
        try {
            if (count($idocupaciontiempoguerra) > 0) {
                $query = Doctrine_Query::create()
                    ->delete('DatOcupaciontiempoguerra')
                    ->whereIn('idocupaciontiempoguerra', $idocupaciontiempoguerra);

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
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCargosOficialByPersona(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatOcupaciontiempoguerra')
                ->whereIn('idpersona', $idpersona)
                ->andWhere('oficial = 1 and fdesde <= now() and (now() <= fhasta or fhasta is null)');
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function addDQLCargosTiempoG(Doctrine_Query &$objDQ, $aTR, $aT, $typeR = 'leftJoin', $oficial = true, $inDQL = false)
    {
        $WITH = "WITH $aT.fdesde <= now() and (now() <= $aT.fhasta or $aT.fhasta IS NULL) ";
        $WITH .= $oficial ? "AND $aT.oficial = 1" : '';
        try {
            switch (strtolower($typeR)) {
                case 'leftjoin':
                    $objDQ->leftJoin("$aTR.DatOcupaciontiempoguerra $aT $WITH");
                    break;
                default:
                    $objDQ->innerJoin("$aTR.DatOcupaciontiempoguerra $aT $WITH");
                    break;
            }

            if ($inDQL) {
                $this->addSelectDQLCargosTiempoG($objDQ, $aT);
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function addSelectDQLCargosTiempoG(Doctrine_Query &$objDQ, $aT)
    {
        $objDQ->addSelect("$aT.idocupaciontiempoguerra as idocupaciontiempoguerra, $aT.entidad as entidad, $aT.cargo as cargo");
    }


    /**
     * @param array $idpersona
     * @param $filtro
     * @param null $limit
     * @param int $start
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getTodoPersonaCargo(array $idpersona, $filtro, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select("do.*, (CASE
                WHEN do.fdesde <= now() and (now() <= do.fhasta or do.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico")
                ->from('DatOcupaciontiempoguerra do')
                ->whereIn('do.idpersona', $idpersona);
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

