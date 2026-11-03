<?php

class DatRegimentrabajo extends BaseDatRegimentrabajo
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
     * @param $idregimentrabajop
     *
     * @throws Doctrine_Exception
     * @throws Exception
     * @return Doctrine_Record
     */
    public function getById($idregimentrabajop)
    {
        //return Doctrine::getTable('DatRegimentrabajo')->find($idregimentrabajop);
        try {
            if (count($idregimentrabajop) > 0) {
                $query = Doctrine_Query::create()->from('DatRegimentrabajo')->whereIn(
                    'idregimentrabajop', $idregimentrabajop
                );

                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getRegimenTrabajoByPersona($idpersona, $filtro = null, $limit = null, $start = 0)
    {
        try {
            $select
                = "dd.*, (CASE
                WHEN dd.fdesde <= now() and (now() <= dd.fhasta or dd.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico";
            $query = Doctrine_Query::create()->select($select)->from('DatRegimentrabajo dd')->whereIn(
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

    public function getCantRegimenTrabajoByPersona($idpersona, $filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('DatRegimentrabajo')->whereIn('idpersona', $idpersona);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delRegimenTrabajo(array $idregimentrabajop, $idpersona = null)
    {
        try {
            if (count($idregimentrabajop) > 0) {
                $query = Doctrine_Query::create()->delete('DatRegimentrabajo')->whereIn(
                    'idregimentrabajop', $idregimentrabajop
                );
                if ($idpersona) {
                    $query->andWhere('idpersona = ?', $idpersona);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerRegimenActualPersona($idpersona,$idcargo, $actual)
    {
        $query = new Doctrine_Query();
        $result = $query->select()->from('DatRegimentrabajo')->where(
            "idpersona = ? and idcargo = ? and actual = ?", array($idpersona,$idcargo, $actual)
        )//->setHydrationMode(Doctrine::HYDRATE_ARRAY)
        ->execute();
        return $result;
    }

    /**
     * @param Doctrine_Query $objDQ
     * @param                $aTR
     * @param                $aT
     * @param string $typeR
     * @param bool $inDQL
     *
     * @throws Doctrine_Exception
     * @throws Exception
     * @internal param bool $inOT
     */
    public function addDQLRegimenTrabajo(Doctrine_Query &$objDQ, $aTR, $aT, $typeR = 'leftJoin', $inDQL = false)
    {
        try {
            switch (strtolower($typeR)) {
                case 'leftjoin':
                    $objDQ->leftJoin("$aTR.DatRegimentrabajo $aT WITH $aT.actual = 1");
                    break;
                default:
                    $objDQ->innerJoin("$aTR.DatRegimentrabajo $aT WITH $aT.actual = 1");
                    break;
            }
            if ($inDQL) {
                $this->addSelectDQLRegimenTrabajo($objDQ, $aT);
            }

            return $objDQ;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param Doctrine_Query $objDQ
     * @param                $aT
     *
     * @internal param bool $inOT
     */
    public function addSelectDQLRegimenTrabajo(Doctrine_Query &$objDQ, $aT)
    {
        $select
            = "$aT.idregimentrabajop as idregimentrabajop, $aT.actual as regimenactual, $aT.fdesde as desde
        , $aT.fhasta as hasta, $aT.idpersona as idpersona, $aT.idregimentrabajo as idregimentrabajo
        , $aT.idgrupodescanso as idgrupodescanso, $aT.idturnotrabajo as idturnotrabajo, $aT.idcargo as idcargo";
        $objDQ->addSelect($select);
    }

    /**
     * @param      $idpersona
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getRegimenByPerson($idpersona, $filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select("dd.*")->from('DatRegimentrabajo dd')->andWhere(
                'dd.fdesde <= now() and (now() <= dd.fhasta or dd.fhasta is null)'
            )->whereIn('dd.idpersona', $idpersona);
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            $objPersona = new DatPersona();
            $objPersona->addDQLPersona($query, 'dd', 'dp', 'leftJoin', true);

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

