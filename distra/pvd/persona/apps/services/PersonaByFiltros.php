<?php

class PersonaByFiltros extends ZendExt_Model
{
    /**
     * @var Parametros de filtro
     */
    protected $idPersona
    , $idEntidad
    , $idCargo
    , $idEstructura
    , $pNombreyApellidos
    , $numIdentidad

    , $limit = null
    , $start = 0;

    /**
     * @var Obtener datos
     */
    protected $personaBasicData = true //Incluye la foto
    , $datosNacimiento = false
    , $datosIdentidad = false
    , $situacionLaboral = false
    , $datosContacto = false
    , $datosDireccion = false;

    protected $relacionBasicData = true
    , $relacionNacimiento = true
    , $relacionIdentidad = true
    , $relacionSituacionLaboral = true
    , $relacionContacto = true
    , $relacionDireccion = true;

    private $query, $resp;

    /**
     * @param bool $personaBasicData
     */
    function __construct($personaBasicData = true)
    {
        $this->personaBasicData = (bool)$personaBasicData;
        $this->limit = null;
        $this->start = 0;
        $this->resp = new stdClass();
        $this->resp->data = array();
        $this->resp->quantity = 0;
        $this->pNombreyApellidos = new stdClass();
        $this->pNombreyApellidos->minMayus = true;
    }

    public function getPersonaFiltro($personaBasicData)
    {
        return new self($personaBasicData);
    }

    /**
     * @param mixed $idCargo
     */
    public function setParamIdCargo($idCargo, $innerJoin = null)
    {
        $this->idCargo = Utiles::reflectArray($idCargo);
        $this->relacionSituacionLaboral = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionSituacionLaboral;
    }

    /**
     * @param mixed $idEntidad
     */
    public function setParamIdEntidad($idEntidad, $innerJoin = null)
    {
        $this->idEntidad = Utiles::reflectArray($idEntidad);
        $this->relacionSituacionLaboral = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionSituacionLaboral;
    }

    /**
     * @param Parametros $idEstructura
     */
    public function setParamIdEstructura($idEstructura, $innerJoin = null)
    {
        $this->idEstructura = Utiles::reflectArray($idEstructura);
        $this->relacionSituacionLaboral = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionSituacionLaboral;
    }

    /**
     * @param $noIdentidad
     * @param null $innerJoin
     */
    public function setParamNoIdentidad($noIdentidad, $innerJoin = null)
    {
        $this->numIdentidad = $noIdentidad;
        $this->pNombreyApellidos->numid = $noIdentidad;
        $this->relacionIdentidad = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionIdentidad;
    }

    /**
     * @param mixed $idPersona
     */
    public function setParamIdPersona($idPersona, $innerJoin = null)
    {
        $this->idPersona = Utiles::reflectArray($idPersona);
        $this->relacionBasicData = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionBasicData;
    }

    /**
     * @param string $nombre
     * @param string $snombre
     * @param string $papel
     * @param string $sapel
     * @param bool $innerJoin
     */
    public function setParamNombreyApellido($nombre = null, $snombre = null, $papel = null,
                                            $sapel = null, $innerJoin = null)
    {
        $arg = array(
            'nombre' => $nombre,
            'snombre' => $snombre,
            'papel' => $papel,
            'sapel' => $sapel
        );
        foreach ($arg as $k => $v) {
            if (!empty($v))
                $this->pNombreyApellidos->$k = $v;
        }
        $this->relacionBasicData = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionBasicData;
    }

    /**
     * @param null $limit
     */
    public function setLimit($limit = null)
    {
        $this->limit = $limit;
    }

    /**
     * @param int $start
     */
    public function setStart($start = 0)
    {
        $this->start = $start;
    }

    /**
     * @param Obtener $datosContacto
     */
    public function incluirDatosContacto($datosContacto = false, $innerJoin = null)
    {
        $this->datosContacto = (bool)$datosContacto;
        $this->relacionContacto = $innerJoin === true || $innerJoin === false ? $innerJoin : $this->relacionContacto;
    }

    /**
     * @param Obtener $datosDireccion
     */
    public function incluirDatosDireccion($datosDireccion = false, $innerJoin = null)
    {
        $this->datosDireccion = $datosDireccion;
        $this->relacionDireccion = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionDireccion;
    }

    /**
     * @param Obtener $datosIdentidad
     */
    public function incluirDatosIdentidad($datosIdentidad = false, $innerJoin = null)
    {
        $this->datosIdentidad = $datosIdentidad;
        $this->relacionIdentidad = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionIdentidad;
    }

    /**
     * @param Obtener $datosNacimiento
     */
    public function incluirDatosNacimiento($datosNacimiento = false, $innerJoin = null)
    {
        $this->datosNacimiento = $datosNacimiento;
        $this->relacionNacimiento = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionNacimiento;
    }

    /**
     * @param Obtener $personaBasicData
     */
    public function incluirPersonaBasicData($personaBasicData = false, $innerJoin = null)
    {
        $this->personaBasicData = $personaBasicData;
        $this->relacionBasicData = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionBasicData;
    }

    /**
     * @param Obtener $situacionLaboral
     */
    public function incluirDatosSituacionLaboral($situacionLaboral = false, $innerJoin = null)
    {
        $this->situacionLaboral = $situacionLaboral;
        $this->relacionSituacionLaboral = $innerJoin === true || $innerJoin === false ?
            (bool)$innerJoin : $this->relacionSituacionLaboral;
    }

    public function getDQL(Doctrine_Query &$qObj, $aR, $aT = 'dp0', $rltion = null)
    {
        $this->generarSolicitud($qObj, $aR, $aT, $rltion);
    }

    private function generarSolicitud(Doctrine_Query &$qObj = null, $aR = null, $aT = 'dp0', $rltion = null)
    {
        $objPersona = new DatPersona();
        if (!empty($qObj)) {
            $objPersona->addDQLPersona(
                $qObj, $aR, $aT, $rltion, $this->personaBasicData,
                ($this->datosNacimiento || $this->datosIdentidad || $this->numIdentidad)
            );
            if (count($this->idPersona) > 0) {
                $query->whereIn("$aT.idpersona", $this->idPersona);
            }
            if ($this->pNombreyApellidos) {
                Utiles::personaBy(
                    $query, $this->pNombreyApellidos, $aT,
                    $this->datosIdentidad || $this->numIdentidad ? 'dpident' : null
                );
            }
            $this->query = $qObj;
        } else {
            $query = Doctrine_Query::create()
                ->select('dp0.idpersona')
                ->from('DatPersona dp0')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            if ($this->personaBasicData) {
                $b = $this->datosNacimiento || $this->datosIdentidad || $this->numIdentidad;
                $objPersona->addSelectDQLPersona($query, 'dp0', ($b));
            }
            if (count($this->idPersona) > 0) {
                $query->whereIn('dp0.idpersona', $this->idPersona);
            }
            if (count($this->pNombreyApellidos) > 0) {
                $dA = $this->datosIdentidad || $this->numIdentidad ? 'dpident' : null;
                Utiles::personaBy($query, $this->pNombreyApellidos, 'dp0', $dA);
            }
            $this->query = $query;
        }
        $this->generarDependecias();
    }

    private function generarDependecias()
    {
        $this->includeDQLSituacionLaboral($this->query);
        $this->includeDQLDatosContacto($this->query);
        $this->includeDQLDatosDireccion($this->query);
    }

    private function includeDQLSituacionLaboral(Doctrine_Query &$qObj)
    {
        $unido = false;
        $relacion = ($this->relacionSituacionLaboral === true) ? 'innerjoin' : 'leftjoin';
        if ($this->situacionLaboral) {
            $objOcupacion = new SituacionLaboralRepository();
            $aliasTablas = array('dpentd', 'dslab', 'nsitu');
            $objOcupacion->addDQLOcupacion($qObj, 'dp0', $aliasTablas, $relacion, true, true, true);
            $unido = true;
        }
        $qObj = $this->includeFunction($qObj, $unido, $relacion);
    }

    /**
     * @param Doctrine_Query $qObj
     * @param $unido
     * @param $relacion
     * @return Doctrine_Query
     * @throws Doctrine_Exception
     * @throws Exception
     */
    private function includeFunction(Doctrine_Query &$qObj, $unido, $relacion)
    {
        if (count($this->idEntidad) > 0 || count($this->idCargo) > 0 || count($this->idEstructura) > 0) {
            if (!$unido) {
                $objOcupacion = new SituacionLaboralRepository();
                $objOcupacion->addDQLOcupacion($qObj, 'dp0', array('dpentd', 'dslab', 'nsitu'), $relacion);
                $unido = true;
            }

            if (count($this->idEntidad) > 0) {
                $qObj->andWhereIn('dpentd.identidad', $this->idEntidad);
            }
            if (count($this->idCargo) > 0) {
                $qObj->andWhereIn('dslab.idcargo', $this->idCargo);
            }
            if (count($this->idEstructura) > 0) {
                $qObj->andWhereIn('dslab.idcargo', Utiles::getArryOfCargos($this->idCargo, true));
                return $qObj;
            }
            return $qObj;
        }
        return $qObj;
    }

    private function includeDQLDatosContacto(Doctrine_Query &$qObj)
    {
        if ($this->datosContacto) {
            $relacion = ($this->relacionContacto === true) ? 'innerjoin' : 'leftjoin';
            $objContacto = new DatContacto();
            $objContacto->addDQLContacto($qObj, 'dp0', 'dcontacto0', $relacion, true, true);
        }
    }

    private function includeDQLDatosDireccion(Doctrine_Query &$qObj)
    {
        if ($this->datosDireccion) {
            $relacion = ($this->relacionDireccion === true) ? 'innerjoin' : 'leftjoin';
            $objContacto = new DatDireccion();
            $objContacto->addDQLDireccion($qObj, 'dp0', 'ddireccion0', $relacion, true, true);
        }
    }

    public function getBusqueda($force = false)
    {
        return ((count($this->resp->data) > 0) && !$force)
            ? $this->resp
            : $this->ejecutarBusqueda();
    }

    public function ejecutarBusqueda()
    {
        $this->generarSolicitud();

        if ($this->query instanceof Doctrine_Query) {
            if ($this->limit > 0) {
                $this->query->limit($this->limit)
                    ->offset($this->start);
            }
            try {
                $this->resp->data = $this->query->execute();
                $this->query->removeDqlQueryPart('limit');
                $this->query->removeDqlQueryPart('select');
                $this->resp->quantity = $this->limit > 0 ? $this->query->count() : count($this->resp->data);
                return $this->resp;
            } catch (Doctrine_Exception $e) {
                throw $e;
            }
        }
    }
} 