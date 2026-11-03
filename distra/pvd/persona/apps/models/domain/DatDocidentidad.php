<?php

class DatDocidentidad extends BaseDatDocidentidad
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomTipodocidentidad', array('local' => 'idtipodocidentidad', 'foreign' => 'idtipodocidentidad'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $iddocidentidad
     *
     * @return Doctrine_Record
     */
    public function getById(array $iddocidentidad)
    {
        try {
            if (count($iddocidentidad) > 0) {
                $query = Doctrine_Query::create()->from('DatDocidentidad')->whereIn('iddocidentidad', $iddocidentidad);

                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $idpersona
     * @param null $filtro
     * @param      $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getDocIdentidadByPersona($idpersona, $filtro = null, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dci.*, nti.denominacion as denomtipodocidentidad, nti.maxcaracter as maxcaracter,
                nti.type as type, nti.mincaracter as mincaracter,
                (CASE
                WHEN dci.fdesde <= now() and (now() <= dci.fhasta or dci.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico'
            )->from('DatDocidentidad dci')->innerJoin('dci.NomTipodocidentidad nti')->where(
                'dci.idpersona = ?', $idpersona
            );
            //Modificacion realizada el 20160217
            //->orderBy('dci.fdesde', 'DESC');//
            //->orderBy(' DESC');
            //print_r($query->getSqlQuery());die;
            if ($limit) {
                $query->limit($limit)->offset($start);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $idpersona
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantDocIdentidadByPersona($idpersona, $filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->select('dci.*, nti.denominacion as denomtipodocidentidad')->from(
                'DatDocidentidad dci'
            )->innerJoin('dci.NomTipodocidentidad nti')->where('dci.idpersona = ?', $idpersona);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idDocIdentidad
     * @param null $idpersona
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delDocIdentidad(array $idDocIdentidad, $idpersona = null)
    {
        try {
            if (count($idDocIdentidad) > 0) {
                $query = Doctrine_Query::create()->delete('DatDocidentidad')->whereIn('iddocidentidad', $idDocIdentidad);
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
     * @param      $numero
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getDocIdentidadByNumero($idtipodocidentidad, $numero, $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->select('dci.*')->from('DatDocidentidad dci')->where(
                "(now() <= dci.fhasta OR dci.fhasta is null)"
            );
            if (!empty($idtipodocidentidad)) {
                $query->addWhere("dci.idtipodocidentidad = '$idtipodocidentidad'");
            }
            if (!empty($numero)) {
                $query->addWhere("dci.numero = '$numero'");
            }
            if (!empty($idpersona)) {
                $query->addWhere("dci.idpersona <> '$idpersona'");
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idpersona
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getDocIdentidadPrincipalByPersona($idpersona)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dci.*,nti.denominacion as denomtipodocidentidad, nti.maxcaracter as maxcaracter, nti.type as type, nti.mincaracter as mincaracter'
            )->from('DatDocidentidad dci')->innerJoin('dci.NomTipodocidentidad nti')->where(
                "dci.principal = 1 AND (now() <= dci.fhasta OR dci.fhasta is null)"
            );
            if (!empty($idpersona)) {
                $query->addWhere("dci.idpersona = '$idpersona'");
            }
            $result = $query->execute()->toArray();

            return $result[0];
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    //Para obtener el numero de matricula para el mariel.
    public function getMatriculaByPersona($idpersona)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dci.numero'
            )->from('DatDocidentidad dci')
                ->where("dci.idtipodocidentidad = 5 AND (now() <= dci.fhasta OR dci.fhasta is null)");
            if (!empty($idpersona)) {
                $query->addWhere("dci.idpersona = '$idpersona'");
            }
            $result = $query->execute()->toArray();

            return $result[0]['numero'];
        } catch (Doctrine_Exception $e) {
            return '';
        }
    }
}
