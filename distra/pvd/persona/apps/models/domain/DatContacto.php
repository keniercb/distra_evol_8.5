<?php

/**
 * Class DatContacto
 */
class DatContacto extends BaseDatContacto
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomTipocontacto', array('local' => 'idtipocontacto', 'foreign' => 'idtipocontacto'));
        $arr = array('local' => 'idtipomediocontacto', 'foreign' => 'idtipomediocontacto');
        $this->hasOne('NomTipomediocontacto', $arr);
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcontacto
     *
     * @return Doctrine_Record
     */
    public function getById(array $idcontacto)
    {
        if (count($idcontacto) > 0) {
            $query = Doctrine_Query::create()->from('DatContacto')->whereIn('idcontacto', $idcontacto);

            return $query->execute();
        }
    }

    /**
     * @param array $idpersona
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getContactos(array $idpersona, $filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dc.*, ntc.denominacion as denomtipocontacto, ntmc.denominacion as denomtipomediocontacto'
            )->from('DatContacto dc')->innerJoin('dc.NomTipocontacto ntc')->innerJoin('dc.NomTipomediocontacto ntmc')
                ->whereIn('dc.idpersona', $idpersona);
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
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantContactos(array $idpersona, $filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('DatContacto dc')->innerJoin('dc.NomTipocontacto ntc')->innerJoin(
                'dc.NomTipomediocontacto ntmc'
            )->whereIn('dc.idpersona', $idpersona);
            return $query->count();
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
    public function getContactosOficiales(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dc.*, ntc.denominacion as denomtipocontacto, ntmc.denominacion as denomtipomediocontacto'
            )->from('DatContacto dc')->innerJoin('dc.NomTipocontacto ntc')->innerJoin('dc.NomTipomediocontacto ntmc')
                ->whereIn('dc.idpersona', $idpersona)->andWhere('dc.oficial = ?', 1);

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $ids
     * @param array $idpersona
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delContactos(array $ids, array $idpersona)
    {
        try {
            if (count($ids) > 0) {
                $query = Doctrine_Query::create()->delete('DatContacto')->whereIn('idcontacto', $ids);
                if (count($idpersona) > 0) {
                    $query->andWhereIn('idpersona', $idpersona);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $idmedio
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getContactoByMedio(array $idpersona, array $idmedio, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dc.*, ntc.denominacion as denomtipocontacto, ntmc.denominacion as denomtipomediocontacto'
            )->from('DatContacto dc')->innerJoin('dc.NomTipocontacto ntc')->innerJoin('dc.NomTipomediocontacto ntmc')
                ->whereIn('dc.idpersona', $idpersona)->andWhereIn('ntmc.idtipomediocontacto', $idmedio);
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
     * @param       $idmedio
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantContactoByMedio(array $idpersona, array $idmedio)
    {
        try {
            $query = Doctrine_Query::create()->from('DatContacto dc')->innerJoin('dc.NomTipocontacto ntc')->innerJoin(
                'dc.NomTipomediocontacto ntmc'
            )->whereIn('dc.idpersona', $idpersona)->andWhereIn('ntmc.idtipomediocontacto', $idmedio);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function addDQLContacto(
        Doctrine_Query &$objDQ, $aTR, $aT, $typeR = 'leftJoin', $oficial = true, $inDQL = false
    )
    {
        $with = $oficial ? "WITH $aT.oficial = 1" : '';
        try {
            switch (strtolower($typeR)) {
                case 'leftjoin':
                    $objDQ->leftJoin("$aTR.DatContacto $aT $with")->leftJoin("$aT.NomTipocontacto ntc")->leftJoin(
                        "$aT.NomTipomediocontacto ntmc"
                    );
                    break;
                default:
                    $objDQ->innerJoin("$aTR.DatContacto $aT $with")->innerJoin("$aT.NomTipocontacto ntc")->innerJoin(
                        "$aT.NomTipomediocontacto ntmc"
                    );
                    break;
            }
            if ($inDQL) {
                $this->addSelectDQLContacto($objDQ, $aT, 'ntc', 'ntmc');
                $sLink = new EnlacesStaticosService();
                $idEmail = $sLink->getCorreoElectronico();
                $idTelef = $sLink->getTelefono();
                $objDQ->leftJoin("$aTR.DatContacto dc001 WITH dc001.idtipomediocontacto = $idEmail")->leftJoin(
                    "$aTR.DatContacto dc002 WITH dc002.idtipomediocontacto = $idTelef"
                )->addSelect('dc001.contacto as email, dc002.contacto as telefono');
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function addSelectDQLContacto(Doctrine_Query &$objDQ, $aT, $aT0, $aT1)
    {
        $select
            = "$aT.idcontacto as idcontacto, $aT.contacto as contacto, $aT.oficial as contactooficial
        , $aT.idtipomediocontacto as idtipomediocontacto, $aT.idtipocontacto as idtipocontacto,
         $aT0.denominacion as denomtipocontacto
        , $aT1.denominacion as denomtipomediocontacto";
        $objDQ->addSelect($select);
    }

    /**
     * @author Ing. Orestes Rodríguez Lorenzo
     * @param $idpersona (Tipo: numeric) Identificador de la persona
     * @param $todos (Tipo: boolean) Bandera que deternina si se obtienen todos los correos o el principal (por defecto: false)
     * @return (Tipo: array) Arreglo con los correos de la persona
     */
    public function obtenerCorreoByIdPers($idpersona, $todos)
    {
        $query = Doctrine_Query::create()
            ->select('dc.idpersona, dc.contacto')
            ->from('DatContacto dc')
            ->whereIn('dc.idpersona', $idpersona)
            ->andWhere('dc.idtipomediocontacto = ?', 2);
        if (!$todos) {
            $query->andWhere('dc.oficial = ?', 1);
        }
        return $query->fetchArray();
    }
}

