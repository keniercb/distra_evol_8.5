<?php

/**
 * Class DatReservacargo
 */
class DatReservacargo extends BaseDatReservacargo
{
    /**
     * @var
     */
    protected $_objEstructuraService;

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersonaentidad', array('local' => 'idpersonaentidad', 'foreign' => 'idpersonaentidad'));
        //$this->hasMany('DatCargo', array('local' => 'idcargo', 'foreign' => 'idcargo'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idreservacargo
     *
     * @return Doctrine_Record
     */
    public function getById($idreservacargo)
    {
        $res = Utiles::reflectArray($idreservacargo);
        if (count($res) > 0) {
            $query = Doctrine_Query::create()->from('DatReservacargo')->whereIn('idreservacargo', $res);

            return $query->execute();
        }
    }

    /**
     * @param      $filtro
     * @param      $cargo
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getReserva($filtro, $cargo, $limit = null, $start = 0)
    {
        $this->_objEstructuraService = new EyCServices();
        $objPersona = new DatPersona();
        try {
            $select
                = "dp.idpersona, dpen.idpersonaentidad, dpen.identidad, dpen.entidad ,
                dpr.idreservacargo as idreservacargo,
                dpr.idcargo as idcargo, dpr.fdesde as fdesde, dpr.fhasta as fhasta, dpr.sustituto";
            $innerDatPersonaentidad
                = 'dp.DatPersonaentidad dpen WITH dpen.fdesde <= now()
            AND (now() <= dpen.fhasta OR dpen.fhasta is null)';
            $query = Doctrine_Query::create()->select($select)->from('DatPersona dp')
                ->innerJoin($innerDatPersonaentidad)
                ->innerJoin('dpen.DatReservacargo dpr')->setHydrationMode(Doctrine::HYDRATE_SCALAR)
                ->where('dp.feliminado IS NULL OR dp.feliminado > now()');
            $objPersona->addSelectDQLPersona($query, 'dp', true);
            Utiles::personaBy($query, $filtro, 'dp', 'dpident');
            if (count($cargo) > 0) {
                $query->andWhereIn('dpr.idcargo', $cargo);
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            //$query = $this->_objEstructuraService->agregarDQLDatosCargo($query, 'dpr', 'dc', 'innerjoin', true);
            return $query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $filtro
     * @param $cargo
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantReserva($filtro, $cargo)
    {
        $this->_objEstructuraService = new EyCServices();
        //$objPersona = new DatPersona();
        try {
            $innerDatPersonaentodad
                = 'dp.DatPersonaentidad dpen WITH dpen.fdesde <= now()
             AND (now() <= dpen.fhasta OR dpen.fhasta is null)';
            $query = Doctrine_Query::create()->from('DatPersona dp')->leftJoin(
                "dp.DatDocidentidad dpident WITH dpident.principal = 1"
            )->innerJoin($innerDatPersonaentodad)->innerJoin('dpen.DatReservacargo dpr')->where(
                'dp.feliminado IS NULL OR dp.feliminado > now()'
            );
            //$objPersona->addSelectDQLPersona($query, 'dp', true);
            Utiles::personaBy($query, $filtro, 'dp', 'dpident');
            if (count($cargo) > 0) {
                $query->andWhereIn('dpr.idcargo', $cargo);
            }

            //$query = $this->_objEstructuraService->agregarDQLDatosCargo($query, 'dpr', 'dc', 'innerjoin', true);
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $filtro
     * @param      $idEntidad
     * @param      $idCargo
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getPersonasToReserva($filtro, $idEntidad, $idCargo, $limit = null, $start = 0)
    {
        try {
            $objPersona = new DatPersona();
            $select
                = 'dp.idpersona, dpen.idpersonaentidad as idpersonaentidad, dpen.entidad as entidad,
                dpen.fdesde as falta, dpen.fhasta as fbaja, dme.fdesde as fdesde, dme.fhasta as fhasta,
                dme.idsituacionlaboralp as idsituacionlaboralp, dme.cargo as cargo, dme.area as area,
                ns.denominacion as denomsituacion, ns.color as color, drc.idreservacargo as idreservacargo';
            $innerpersonaEntidad
                = 'dp.DatPersonaentidad dpen WITH dpen.fdesde <= now()
            AND (now() <= dpen.fhasta OR dpen.fhasta is null)';
            $leftDatreserva
                = "dpen.DatReservacargo drc WITH drc.fdesde <= now()
                AND (now() <= drc.fhasta OR drc.fhasta is null) AND drc.idcargo <> $idCargo";
            $leftDatSituacion
                = 'dpen.DatSituacionlaboral dme WITH dme.fdesde <= now()
                 AND (now() <= dme.fhasta OR dme.fhasta is null)';
            $query = Doctrine_Query::create()->select($select)->from('DatPersona dp')->innerJoin($innerpersonaEntidad)
                ->leftJoin($leftDatreserva)->leftJoin($leftDatSituacion)->leftJoin(
                    'dme.NomSituacion ns'
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $objPersona->addSelectDQLPersona($query, 'dp', true);
            Utiles::personaBy($query, $filtro, 'dp', 'dpident');
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }
            if (!empty($idEntidad)) {
                $query->andWhere('dpen.identidad = ?', $idEntidad);
            }

            return $query->execute();

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $filtro
     * @param $idEntidad
     * @param $idCargo
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantPersonasToReserva($filtro, $idEntidad, $idCargo)
    {
        try {
            $objPersona = new DatPersona();
            $innerPersonaentidad
                = 'dp.DatPersonaentidad dpen WITH dpen.fdesde <= now()
                AND (now() <= dpen.fhasta OR dpen.fhasta is null)';
            $leftResercaCargo
                = "dpen.DatReservacargo drc WITH drc.fdesde <= now()
                AND (now() <= drc.fhasta OR drc.fhasta is null) AND drc.idcargo <> $idCargo";
            $leftDatSituacion
                = 'dpen.DatSituacionlaboral dme WITH dme.fdesde <= now()
                AND (now() <= dme.fhasta OR dme.fhasta is null)';
            $query = Doctrine_Query::create()->from('DatPersona dp')->innerJoin($innerPersonaentidad)->leftJoin(
                $leftResercaCargo
            )->leftJoin($leftDatSituacion)->leftJoin('dme.NomSituacion ns')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $objPersona->addSelectDQLPersona($query, 'dp', true);
            Utiles::personaBy($query, $filtro, 'dp', 'dpident');
            if (!empty($idEntidad)) {
                $query->andWhere('dpen.identidad = ?', $idEntidad);
            }

            return $query->count();

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $id
     *
     * @throws Doctrine_Query_Exception
     */
    public function delReservaCargo($id)
    {
        if (!empty($id)) {
            Doctrine_Query::create()->delete('DatReservacargo')->whereIn('idreservacargo', Utiles::reflectArray($id))
                ->execute();
        }
    }
}

