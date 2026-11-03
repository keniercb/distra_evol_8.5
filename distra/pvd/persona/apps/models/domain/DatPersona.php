<?php

/**
 * Class DatPersona
 */
class DatPersona extends BaseDatPersona {

    /**
     * @var
     */
    protected $objEstructuraService;

    /**
     * @var
     */
    protected $objStaticInfo;

    /**
     * Constructor
     */
    public function setUp() {
        parent:: setUp();
        $this->hasMany('DatContacto', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatPersonaentidad', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatFenotipo', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatDatosnacimiento', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('SegAccesosindominio', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatNacionalidad', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatFoto', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatDireccion', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatCiudadania', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatDocidentidad', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatFonetica', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        //Relacion con tablas del esquema "mod_personaext"
        $this->hasMany('DatSancion', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatIdioma', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatCuentabancaria', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatCondecoracion', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatAfiliacion', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatEstanciaexterior', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatEstadosalud', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatAfeccion', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatEducacion', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatCategorizacion', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatCategoria', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatGradomilitar', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatTallaje', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatCaracteristicasocial', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatRegimentrabajo', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idpersona
     *
     * @return Doctrine_Record
     */
    public function getById($idpersona) {
        try {
            $query = Doctrine_Query::create()->from('DatPersona')->whereIn('idpersona', $this->reflectArray($idpersona));

            return $query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data) {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    /**
     * @param $idpersona
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getAll($idpersona) {
        try {
            $query = Doctrine_Query::create()->from('DatPersona dp')->leftJoin('dp.DatSexopersona dsx')->leftJoin(
                            'dp.DatFoto df'
                    )->where('dp.idpersona = ?', $idpersona);

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getPersonasActivas(array $idpersona, $filtro, $limit, $start = 0, $idcargos = array(), $sincargo = 'false') {
        try {
            $this->objStaticInfo = new EnlacesStaticosService();
            $sexos = $this->objStaticInfo->getImgSexo();

            $sql = "SELECT dp.*, ddi.numero as numid";
            if ($sincargo == 'false') {
                $sql .= ",
                                    nc.denominacion as denomcargo,
                                    nc.idnomcargo";
            }
            $sql .= "	,(CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto,'escape')
                    WHEN dp.sexo = 1 THEN '$sexos->male' ElSE '$sexos->famale' END) as foto,
                    (CASE WHEN dp.sexo = 0 THEN 'Femenino' ELSE 'Masculino' END) AS denomsexo
                    
                    FROM mod_persona.dat_persona dp
					LEFT JOIN mod_persona.dat_foto dpfot ON (dpfot.idpersona = dp.idpersona and dpfot.principal = 1)
					LEFT JOIN mod_persona.dat_docidentidad ddi ON (ddi.idpersona = dp.idpersona and ddi.principal = 1)
					";
            if ($sincargo == 'false') {
                $sql .= " 
                    INNER JOIN mod_persona.dat_personaentidad pe ON dp.idpersona = pe.idpersona AND ((pe.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= pe.fhasta OR pe.fhasta is null))) 
                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                    INNER JOIN mod_estructuracomp.dat_cargo dc ON sl.idcargo = dc.idcargo AND (dc.idproyecto = 0) 
                    INNER JOIN mod_estructuracomp.nom_cargo nc ON dc.idnomcargo = nc.idnomcargo
                ";
            }
            $sql .= " WHERE dp.feliminado is null";

            if (count($idpersona) > 0) {
                $sql .= " AND dp.idpersona IN (" . implode(',', $idpersona) . ") ";
            }
            if ($idcargos && $sincargo == 'false') {
                $sql .= " AND sl.idcargo IN (" . implode(',', $idcargos) . ") ";
            }
            if (!empty($filtro)) {
                $whereAdd = "dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or
                 dp.papel ilike '%$filtro%' or dp.sapel ilike '%$filtro%' or ddi.numero like '%$filtro%'";
                $sql .= " AND (" . $whereAdd . ")";
            }
            if ($limit > 0) {
                $sql .= " limit {$limit} offset {$start}";
            }
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantPersonasActivas(array $idpersona, $filtro, $idcargos = array(), $sincargo = 'false') {
        try {
            $sql = "SELECT count(dp.idpersona) as cantidad
					FROM mod_persona.dat_persona dp
					LEFT JOIN mod_persona.dat_foto dpfot ON (dpfot.idpersona = dp.idpersona and dpfot.principal = 1)
					LEFT JOIN mod_persona.dat_docidentidad ddi ON (ddi.idpersona = dp.idpersona and ddi.principal = 1)
					";

            if ($sincargo == 'false') {
                $sql .= " INNER JOIN mod_persona.dat_personaentidad pe ON dp.idpersona = pe.idpersona AND ((pe.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= pe.fhasta OR pe.fhasta is null))) 
					      INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
					";
            }

            $sql .= " WHERE dp.feliminado is null";

            if (count($idpersona) > 0) {
                //$query->andWhereIn('dp.idpersona', $idpersona);
                $sql .= " AND dp.idpersona IN (" . implode(',', idpersona) . ") ";
            }
            if ($idcargos && $sincargo == 'false') {
                $sql .= " AND sl.idcargo IN (" . implode(',', $idcargos) . ") ";
            }
            if (!empty($filtro)) {
                $whereAdd = "dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or
                 dp.papel ilike '%$filtro%' or dp.sapel ilike '%$filtro%' or ddi.numero like '%$filtro%'";
                //$query->andWhere($whereAdd);
                $sql .= " AND (" . $whereAdd . ")";
            }

            //return $query->execute()->toArray();
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            //die($sql);
            $result = $conn->fetchAll($sql);
            return $result[0]['cantidad'];
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Agregar a una consulta las sentencias necesarias para obtener los datos personales.
     *
     * @param Doctrine_Query $objDoctrineQuery Consulta a la cual se le quiere agregar las sentencias DQL.
     * @param string $aliasTablaReferencia Alias de la clase de dominio que tiene relación con la clase DatPersona.
     *
     * @return Doctrine_Query Consulta modificada con las sentencias que devuelven los datos personales.
     */
    public function agregarDqlDatosPersona(
            Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect, $includeTablas, $relation
    ) {
        if ($includeDqlSelect) {
            $addSelect = "$aliasTabla.idpersona AS idpersona,
            $aliasTabla.nombre AS nombre, $aliasTabla.snombre AS snombre,
            $aliasTabla.papel AS papel, $aliasTabla.sapel AS sapel,$aliasTabla.sexo AS sexo";
            $objDoctrineQuery->addSelect($addSelect);
        }
        $this->setRelations($objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $relation);
        if (is_array($includeTablas) && !empty($includeTablas)) {
            foreach ($includeTablas as $v) {
                $tabla = $v['tabla'] . ' ' . $v['alia'];
                if ($v['relacion']) {
                    switch (strtolower($v['relacion'])) {
                        case 'leftjoin':
                            $objDoctrineQuery->leftJoin("$aliasTabla.$tabla");
                            break;
                        default:
                            $objDoctrineQuery->innerJoin("$aliasTabla.$tabla");
                            break;
                    }
                } else {
                    $objDoctrineQuery->innerJoin("$aliasTabla.$tabla");
                }
            }
        }

        return $objDoctrineQuery;
    }

    /**
     * @param Doctrine_Query $objDoctrineQuery
     * @param                $aliasTablaReferencia
     * @param                $aliasTabla
     * @param                $relation
     */
    protected function setRelations(Doctrine_Query &$objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $relation) {
        switch (strtolower($relation)) {
            case 'leftjoin':
                $objDoctrineQuery->leftJoin("$aliasTablaReferencia.DatPersona $aliasTabla");
                break;
            default:
                $objDoctrineQuery->innerJoin("$aliasTablaReferencia.DatPersona $aliasTabla");
                break;
        }
    }

    /**
     * @param array $arrIdPersonas
     *
     * @return array|Doctrine_Collection|Doctrine_Exception|Exception
     */
    public function DevolverPersonasArregloId(array $arrIdPersonas) {
        try {
            if (count($arrIdPersonas) > 0) {
                $query = new Doctrine_Query();
                $selectPe = 'dp.idpersona, doc.numero,doc.iddocidentidad, dp.nombre, dp.snombre,
                     dp.papel, dp.sapel, dp.sexo';
                $result = $query->select($selectPe)->from('DatPersona dp')->leftJoin('dp.DatDocidentidad doc')->whereIn(
                                'doc.principal = 1 and dp.idpersona', $arrIdPersonas
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

                return $result;
            } else {
                return array();
            }
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param int $start
     * @param array $identidad
     * @param array $idcargo
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getPrincipalesDatosPersona(
            array $idpersona, $filtro, $limit, $start = 0, array $identidad, array $idcargo, $boolfoto = 'true', $boolcargo = 'true', $boolcategoria = 'true', $boolregimen = 'true'
    ) {

        if ($boolfoto == null) {
            $boolfoto = 'true';
        }
        if ($boolcargo == null) {
            $boolcargo = 'true';
        }
        if ($boolcategoria == null) {
            $boolcategoria = 'true';
        }
        if ($boolregimen == null) {
            $boolregimen = 'false';
        }

        try {

            $query = Doctrine_Query::create()->from('DatPersona dp')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->Where(
                    'dp.feliminado IS NULL'
            );
            if ($boolfoto == 'true' && $boolcategoria == 'true') {
                $this->addSelectDQLPersona($query, 'dp', true, true);
            } else
            if ($boolfoto == 'false' && $boolcategoria == 'true') {
                $this->addSelectDQLPersonaF($query, 'dp', true, true);
            } else
            if ($boolfoto == 'true' && $boolcategoria == 'false') {
                $this->addSelectDQLP($query, 'dp', true, true);
            } else
            if ($boolfoto == 'false' && $boolcategoria == 'false') {
                $this->addSelectDQLPersonaC($query, 'dp', true, true);
            }
            /*             * *****************************Agregando los datos del regimen de trabajo de la persona************************************* */
            if ($boolcargo == 'true' || count($identidad) > 0 || count($idcargo) > 0) {
                $objOcupacion = new SituacionLaboralRepository();
                $objOcupacion->addDQLOcupacion($query, 'dp', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);
                $query->addSelect('dslab.idcargo');
            }
            if ($boolregimen == 'true') {
                $objRegimentrabajo = new DatRegimentrabajo();
                $objRegimentrabajo->addDQLRegimenTrabajo($query, 'dp', 'drt', 'leftJoin', false);
                $query->addSelect('drt.*');
            }


            /*             * *****************************Agregando los datos del regimen de trabajo de la persona************************************* */
            if ($limit > 0) {
                $query->limit($limit)->offset($start);
            }
            if (count($idpersona) > 0) {
                $query->andWhereIn('dp.idpersona', $idpersona);
            }
            if (count($identidad) > 0) {
                $query->andWhereIn('dpentd.identidad', $identidad);
            }
            if (count($idcargo) > 0) {
                $query->andWhereIn('dslab.idcargo', $idcargo);
            }
            if (!empty($filtro)) {
                $addWhere = "dpident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'" . " or dp.snombre ilike '%$filtro%'
                or dp.papel ilike '%$filtro%' or dp.sapel ilike '%$filtro%'";
                $query->addWhere($addWhere);
            }
            return $query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param Doctrine_Query $objDQ
     * @param                $aT
     * @param bool $inOT
     */
    public function addSelectDQLPersona(Doctrine_Query &$objDQ, $aT, $inOT = false) {
        $this->objStaticInfo = new EnlacesStaticosService();
        $sexos = $this->objStaticInfo->getImgSexo();
        if ($inOT === true) {
            $objDQ->leftJoin("$aT.DatDatosnacimiento dpnac")->leftJoin(
                            "$aT.DatDocidentidad dpident WITH dpident.principal = 1"
                    )->leftJoin("dpident.NomTipodocidentidad ntpident")->leftJoin("$aT.DatFoto dpfot WITH dpfot.principal = 1")
                    ->leftJoin(
                            "$aT.DatCategoria dctg WITH dctg.fdesde <= now() AND (now() <= dctg.fhasta OR dctg.fhasta is null)"
                    )->leftJoin("dctg.NomCategoriapersona ncatego")->leftJoin(
                    "$aT.DatGradomilitar dgm WITH dgm.fdesde <= now() AND (now() <= dgm.fhasta OR dgm.fhasta is null)"
            );
        }
        $otherData = $inOT === true ? ", dpnac.fechanacimiento as fechanacimiento,  dpnac.idprovincia as idprovincian,
        dpnac.idmunicipio as idmunicipion,dpnac.idpais as idpaisn,
        date_part('year',age(dpnac.fechanacimiento)) as edad, dpident.iddocidentidad as iddocidentidad,
                        ntpident.denominacion as denomtipodocidentidad, dpident.numero AS numid,
                        dpfot.idfoto as idfoto, (CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto,'escape')
                        WHEN $aT.sexo = 1 THEN '$sexos->male' ElSE '$sexos->famale' END) as foto,
                         dctg.idcategoriapersona as categoriapersona,ncatego.denominacion as denomcategoriapersona,
                         ncatego.idpadre as idpadrecategoria, dgm.idgrado as idgrado " : ' ';

        $addSelect = "$aT.idpersona, $aT.idpersona as idpersona, $aT.nombre as nombre,
         $aT.snombre as snombre, $aT.sapel as sapel,$aT.idsuin as idsuin,
          $aT.papel as papel, $aT.fregistro as fregistro, $aT.feliminado as feliminado,
           (CASE WHEN $aT.sexo = 0 THEN 'Femenino' ELSE 'Masculino' END) AS denomsexo, $aT.sexo as sexo,
            (CASE WHEN $aT.snombre is not null THEN $aT.nombre||' '|| $aT.snombre||' '|| $aT.papel||' '||  $aT.sapel
                    	ELSE $aT.nombre||' '|| $aT.papel||' '||  $aT.sapel END) as nombreapellidos $otherData";
        $objDQ->addSelect($addSelect);
    }

    public function addSelectDQLPersonaF(Doctrine_Query &$objDQ, $aT, $inOT = false) {
        $this->objStaticInfo = new EnlacesStaticosService();
        $sexos = $this->objStaticInfo->getImgSexo();
        if ($inOT === true) {
            $objDQ->leftJoin("$aT.DatDatosnacimiento dpnac")->leftJoin(
                    "$aT.DatDocidentidad dpident WITH dpident.principal = 1"
            )->leftJoin("dpident.NomTipodocidentidad ntpident")->leftJoin(
                    "$aT.DatCategoria dctg WITH dctg.fdesde <= now() AND (now() <= dctg.fhasta OR dctg.fhasta is null)"
            )->leftJoin("dctg.NomCategoriapersona ncatego")->leftJoin(
                    "$aT.DatGradomilitar dgm WITH dgm.fdesde <= now() AND (now() <= dgm.fhasta OR dgm.fhasta is null)"
            );
        }
        $otherData = $inOT === true ? ", dpnac.fechanacimiento as fechanacimiento, dpident.iddocidentidad as iddocidentidad,
                        ntpident.denominacion as denomtipodocidentidad, dpident.numero AS numid,
                         dctg.idcategoriapersona as categoriapersona,ncatego.denominacion as denomcategoriapersona,
                         ncatego.idpadre as idpadrecategoria, dgm.idgrado as idgrado " : ' ';

        $addSelect = "$aT.idpersona, $aT.idpersona as idpersona, $aT.nombre as nombre,
         $aT.snombre as snombre, $aT.sapel as sapel,$aT.idsuin as idsuin,
          $aT.papel as papel, $aT.fregistro as fregistro, $aT.feliminado as feliminado,
           (CASE WHEN $aT.sexo = 0 THEN 'Femenino' ELSE 'Masculino' END) AS denomsexo, $aT.sexo as sexo,
            (CASE WHEN $aT.snombre is not null THEN $aT.nombre||' '|| $aT.snombre||' '|| $aT.papel||' '||  $aT.sapel
                    	ELSE $aT.nombre||' '|| $aT.papel||' '||  $aT.sapel END) as nombreapellidos $otherData";
        $objDQ->addSelect($addSelect);
    }

    public function addSelectDQLPersonaC(Doctrine_Query &$objDQ, $aT, $inOT = false) {
        $this->objStaticInfo = new EnlacesStaticosService();
        $sexos = $this->objStaticInfo->getImgSexo();
        if ($inOT === true) {
            $objDQ->leftJoin("$aT.DatDatosnacimiento dpnac")->leftJoin(
                    "$aT.DatDocidentidad dpident WITH dpident.principal = 1"
            )->leftJoin("dpident.NomTipodocidentidad ntpident")->leftJoin(
                    "$aT.DatGradomilitar dgm WITH dgm.fdesde <= now() AND (now() <= dgm.fhasta OR dgm.fhasta is null)"
            );
        }
        $otherData = $inOT === true ? ", dpnac.fechanacimiento as fechanacimiento, dpident.iddocidentidad as iddocidentidad,
                        ntpident.denominacion as denomtipodocidentidad, dpident.numero AS numid,dgm.idgrado as idgrado " : ' ';

        $addSelect = "$aT.idpersona, $aT.idpersona as idpersona, $aT.nombre as nombre,
         $aT.snombre as snombre, $aT.sapel as sapel,$aT.idsuin as idsuin,
          $aT.papel as papel, $aT.fregistro as fregistro, $aT.feliminado as feliminado,
           (CASE WHEN $aT.sexo = 0 THEN 'Femenino' ELSE 'Masculino' END) AS denomsexo, $aT.sexo as sexo,
            (CASE WHEN $aT.snombre is not null THEN $aT.nombre||' '|| $aT.snombre||' '|| $aT.papel||' '||  $aT.sapel
                    	ELSE $aT.nombre||' '|| $aT.papel||' '||  $aT.sapel END) as nombreapellidos $otherData";
        $objDQ->addSelect($addSelect);
    }

    public function addSelectDQLP(Doctrine_Query &$objDQ, $aT, $inOT = false) {
        $this->objStaticInfo = new EnlacesStaticosService();
        $sexos = $this->objStaticInfo->getImgSexo();
        if ($inOT === true) {
            $objDQ->leftJoin("$aT.DatDatosnacimiento dpnac")->leftJoin(
                    "$aT.DatDocidentidad dpident WITH dpident.principal = 1"
            )->leftJoin("dpident.NomTipodocidentidad ntpident")->leftJoin("$aT.DatFoto dpfot WITH dpfot.principal = 1")->leftJoin(
                    "$aT.DatGradomilitar dgm WITH dgm.fdesde <= now() AND (now() <= dgm.fhasta OR dgm.fhasta is null)"
            );
        }
        $otherData = $inOT === true ? ", dpnac.fechanacimiento as fechanacimiento, dpident.iddocidentidad as iddocidentidad,
                        ntpident.denominacion as denomtipodocidentidad, dpident.numero AS numid,
                        dpfot.idfoto as idfoto, (CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto,'escape')
                        WHEN $aT.sexo = 1 THEN '$sexos->male' ElSE '$sexos->famale' END) as foto,
                         dgm.idgrado as idgrado " : ' ';

        $addSelect = "$aT.idpersona, $aT.idpersona as idpersona, $aT.nombre as nombre,
         $aT.snombre as snombre, $aT.sapel as sapel,$aT.idsuin as idsuin,
          $aT.papel as papel, $aT.fregistro as fregistro, $aT.feliminado as feliminado,
           (CASE WHEN $aT.sexo = 0 THEN 'Femenino' ELSE 'Masculino' END) AS denomsexo, $aT.sexo as sexo,
            (CASE WHEN $aT.snombre is not null THEN $aT.nombre||' '|| $aT.snombre||' '|| $aT.papel||' '||  $aT.sapel
                    	ELSE $aT.nombre||' '|| $aT.papel||' '||  $aT.sapel END) as nombreapellidos $otherData";
        $objDQ->addSelect($addSelect);
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param array $identidad
     * @param array $idcargo
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantPrincipalesDatosPersona(array $idpersona, $filtro, array $identidad, array $idcargo) {
        try {
            $query = Doctrine_Query::create()->from('DatPersona dp')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->Where(
                    'dp.feliminado IS NULL'
            );
            $this->addSelectDQLPersona($query, 'dp', true, true);
            $objOcupacion = new SituacionLaboralRepository();
            $objOcupacion->addDQLOcupacion($query, 'dp', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);

            if (count($idpersona) > 0) {
                $query->andWhereIn('dp.idpersona', $idpersona);
            }
            if (count($identidad) > 0) {
                $query->andWhereIn('dpentd.identidad', $identidad);
            }
            if (count($idcargo) > 0) {
                $query->andWhereIn('dslab.idcargo', $idcargo);
            }
            if (!empty($filtro)) {
                $addWhere = "dpident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%'
                or dp.papel ilike '%$filtro%' or dp.sapel ilike '%$filtro%'";
                $query->addWhere($addWhere);
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param Doctrine_Query $objDQ
     * @param                $aTR
     * @param                $aT
     * @param string $typeR
     * @param                $inDQL
     * @param bool $inOT
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function addDQLPersona(Doctrine_Query &$objDQ, $aTR, $aT, $typeR = 'leftJoin', $inDQL, $inOT = false) {
        try {
            switch (strtolower($typeR)) {
                case 'leftjoin':
                    $objDQ->leftJoin("$aTR.DatPersona $aT");
                    break;
                default:
                    $objDQ->innerJoin("$aTR.DatPersona $aT");
                    break;
            }
            if ($inDQL) {
                $this->addSelectDQLPersona($objDQ, $aT, $inOT);
            } elseif ($inOT === true) {
                $objDQ->leftJoin("$aT.DatDatosnacimiento dpnac")->leftJoin(
                        "$aT.DatDocidentidad dpident WITH dpident.principal = 1"
                )->leftJoin("dpident.NomTipodocidentidad ntpident")->leftJoin("$aT.DatFoto dpfot WITH dpfot.principal = 1");
            }

            return $objDQ;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $idEntidad
     * @param      $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getPersonaToAlta($idEntidad, $filtro, $limit = null, $start = 0) {
        try {
            $addWhere = "dp.idpersona NOT IN (SELECT pe.idpersona
                FROM DatPersonaentidad pe WHERE pe.identidad = $idEntidad
                 AND (pe.fhasta >= now() OR pe.fhasta IS NULL))";
            $query = Doctrine_Query::create()->from('DatPersona dp')->where(
                            'now() <= dp.feliminado OR dp.feliminado IS NULL'
                    )->andWhere($addWhere)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }
            $this->addSelectDQLPersona($query, 'dp', true);
            Utiles::personaBy($query, $filtro, 'dp');

            return $query->addSelect("date_part('year',age(dpnac.fechanacimiento)) as annos")->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idEntidad
     * @param $filtro
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantPersonaToAlta($idEntidad, $filtro) {
        try {
            $whereAdd = "dp.idpersona NOT IN (SELECT pe.idpersona
                FROM DatPersonaentidad pe WHERE pe.identidad = $idEntidad
                   AND (pe.fhasta >= now() OR pe.fhasta IS NULL))";
            $query = Doctrine_Query::create()->from('DatPersona dp')->where(
                            'now() <= dp.feliminado OR dp.feliminado IS NULL'
                    )->andWhere($whereAdd)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            Utiles::personaBy($query, $filtro, 'dp');

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function restPerson(array $ids) {
        try {
            $query = Doctrine_Query::create()->update('DatPersona')->whereIn('idpersona', $ids)->set('feliminado', 'null');
            $query->execute();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEspecialidadByCargo($idcargo) {
        try {
            $sql = "SELECT ne.denespecialidad, ne.codespecialidad
				 FROM mod_estructuracomp.dat_cargo AS dc
				 INNER JOIN mod_datosmaestros.nom_especialidad AS ne ON (dc.idespecialidadpreparacion = ne.idespecialidad)
				 WHERE dc.idcargo = $idcargo";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);

            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function ImportarPersona($array_datos, $array_tallaje, $array_medio, $array_sanciones, $array_condecoracion, $array_ingresos, $array_nivel, $array_estudios, $array_familiar, $array_afecciones, $idestructura) {

        $objPersona = new DatPersona();
        $arrayrepetidos = array();
        $count = 0;
        unset($array_datos[1]);
        unset($array_tallaje[1]);
        unset($array_medio[1]);
        unset($array_sanciones[1]);
        unset($array_condecoracion[1]);
        unset($array_ingresos[1]);
        unset($array_nivel[1]);
        unset($array_estudios[1]);
        unset($array_familiar[1]);
        unset($array_afecciones[1]);

        if (!empty($array_datos)) {
            foreach ($array_datos as $r) {
                $numero = $r['A'];
                $nombre = $r['B'];
                $snombre = $r['C'];
                $papel = $r['D'];
                $sapel = $r['E'];
                $sex = $r['F'];
                $fn = date("d/m/Y", PHPExcel_Shared_Date::ExcelToPHP($r['G']));
                $fnacimiento = "'" . $fn . "'";
                $nompadre = "'" . $r['H'] . "'";
                $nommadre = "'" . $r['I'] . "'";
                $rcivil = "'" . $r['J'] . "'";
                $tomo = "'" . $r['K'] . "'";
                $folio = "'" . $r['L'] . "'";
                $colorojos = $r['M'];
                $colorpiel = $r['N'];
                $colorpelo = $r['O'];
                $gsanguineo = $r['P'];
                $municipio = $r['Q'];
                $direccion = "'" . $r['R'] . "'";
                $telf = $r['S'];
                $cel = $r['T'];
                $correo = $r['U'];

                if ($sex == 'Masculino') {
                    $sexo = 1;
                } else {
                    $sexo = 0;
                }
                if (strlen($numero) == 6) {
                    $tipodocidentidad = 3;
                }
                if (strlen($numero) == 11) {
                    $tipodocidentidad = 1;
                }
                $sql = "SELECT p.idpersona,concat(p.nombre,'',p.snombre,' ',p.sapel,' ',p.sapel) as nombrecompleto,doc.numero
				 FROM mod_persona.dat_persona AS p
				 INNER JOIN mod_persona.dat_docidentidad AS doc ON (p.idpersona = doc.idpersona)
				 WHERE doc.numero ILIKE '%$numero%'";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $result = $conn->fetchAll($sql);

                if (count($result) == 0) {
                    if (!empty($nombre)) {
                        $objPersona->nombre = $nombre;
                    }
                    if (!empty($snombre)) {
                        $objPersona->snombre = $snombre;
                    }
                    if (!empty($papel)) {
                        $objPersona->papel = $papel;
                    }
                    if (!empty($sapel)) {
                        $objPersona->sapel = $sapel;
                    }
                    if (!empty($sexo)) {
                        $objPersona->sexo = $sexo;
                    }if (!empty($idestructura)) {
                        $objPersona->idestructura = $idestructura;
                    }
                    $objPersona->save();
                    $idpersona = $objPersona->idpersona;

                    if (!empty($idpersona)) {

                        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
                        $sqldoc = "INSERT INTO mod_persona.dat_datosnacimiento(
                       fechanacimiento, nombrepadre, nombremadre, registrocivil, tomo,folio,idpais,idpersona)
                       VALUES ($fnacimiento,$nompadre,$nommadre,$rcivil,$tomo,$folio,1,$idpersona);";
                        $conn->fetchAll($sqldoc);
                    }
                    $objDireccion = new DatDireccion();
                    if (!empty($idpersona)) {
                        $sql = "SELECT dp.iddpt,dp.idpadre
                         FROM mod_datosmaestros.nom_dpt AS dp
                         WHERE dp.denominacion ILIKE '%$municipio%'";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $result = $conn->fetchAll($sql);

                        if (count($result) > 0) {
                            $idmunicipio = $result[0]['iddpt'];
                            $idprovincia = $result[0]['idpadre'];
                            $objDireccion->idmunicipio = $idmunicipio;
                            $objDireccion->idprovincia = $idprovincia;
                        }
                        if (!empty($direccion)) {
                            $objDireccion->direccion = $direccion;
                        }
                        $objDireccion->idpersona = $idpersona;

                        $objDireccion->save();
                    }
                    $objDocIden = new DatDocidentidad();
                    if (!empty($idpersona)) {
                        if (!empty($numero)) {
                            $objDocIden->numero = $numero;
                            $objDocIden->idtipodocidentidad = $tipodocidentidad;
                            $objDocIden->principal = 1;
                        }
                        $objDocIden->idpersona = $idpersona;
                        $objDocIden->save();
                    }
                    $objFenotipo = new DatFenotipo();
                    if (!empty($idpersona)) {

                        $sql = "SELECT n.idcolorojos
                         FROM mod_persona.nom_colorojos AS n
                         WHERE n.denominacion ILIKE '%$colorojos%'";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $ojo = $conn->fetchAll($sql);

                        $ojos = $ojo[0]['idcolorojos'];

                        $sql = "SELECT n.idcolorpelo
                         FROM mod_persona.nom_colorpelo AS n
                         WHERE n.denominacion ILIKE '%$colorpelo%'";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $pelo = $conn->fetchAll($sql);

                        $p = $pelo[0]['idcolorpelo'];

                        $sql = "SELECT n.idcolorpiel
                         FROM mod_persona.nom_colorpiel AS n
                         WHERE n.denominacion ILIKE '%$colorpiel%'";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $piel = $conn->fetchAll($sql);

                        $pi = $piel[0]['idcolorpiel'];

                        $sql = "SELECT g.idgruposanguineo
                         FROM mod_persona.nom_gruposanguineo AS g
                         WHERE g.denominacion ILIKE '%$gsanguineo%'";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $sangre = $conn->fetchAll($sql);

                        $gs = $sangre[0]['idgruposanguineo'];

                        $objFenotipo->idpersona = $idpersona;
                        $objFenotipo->idcolorojos = $ojos;
                        $objFenotipo->idcolorpelo = $p;
                        $objFenotipo->idcolorpiel = $pi;
                        $objFenotipo->idgruposanguineo = $gs;

                        $objFenotipo->save();
                    }
                    $objtContacto = new DatContacto();
                    if (!empty($idpersona)) {
                        if (!empty($telf)) {
                            $objtContacto->contacto = $telf;
                        }
                        $objtContacto->idpersona = $idpersona;
                        $objtContacto->idtipomediocontacto = 4;
                        $objtContacto->idtipocontacto = 1;
                        $objtContacto->save();
                    }
                    if (!empty($idpersona)) {
                        if (!empty($cel)) {
                            $objtContacto->contacto = $cel;
                        }
                        $objtContacto->idpersona = $idpersona;
                        $objtContacto->idtipomediocontacto = 3;
                        $objtContacto->idtipocontacto = 1;
                        $objtContacto->save();
                    }
                    if (!empty($idpersona)) {
                        if (!empty($correo)) {
                            $objtContacto->contacto = $correo;
                        }
                        $objtContacto->idpersona = $idpersona;
                        $objtContacto->idtipomediocontacto = 1;
                        $objtContacto->idtipocontacto = 1;
                        $objtContacto->save();
                    }
                    $objTallaje = new Confprendanorma();
                    foreach ($array_tallaje as $t) {
                        $ci = $t['D'];
                        $prenda = $t['A'];
                        $norma = $t['B'];
                        $talla = $t['C'];
                        if ($ci == $numero) {
                            if ($prenda != null) {
                                $sql = "SELECT p.idprenda
                         FROM mod_personaext.nom_prenda AS p
                         WHERE p.denominacion ILIKE '%$prenda%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlprenda = $conn->fetchAll($sql);

                                $idprenda = $sqlprenda[0]['idprenda'];
                            }
                            if ($norma != null) {
                                $sql = "SELECT p.idnorma
                         FROM mod_personaext.nom_norma AS p
                         WHERE p.denominacion ILIKE '%$norma%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlnorma = $conn->fetchAll($sql);

                                $idnorma = $sqlnorma[0]['idnorma'];
                            }
                            if ($talla != null) {
                                $sql = "SELECT p.idtalla
                         FROM mod_personaext.nom_talla AS p
                         WHERE p.denominacion ILIKE '%$talla%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqltalla = $conn->fetchAll($sql);

                                $idtalla = $sqltalla[0]['idtalla'];
                            }
                            $objTallaje->idprenda = $idprenda;
                            $objTallaje->idnorma = $idnorma;
                            $objTallaje->idtalla = $idtalla;
                            $objTallaje->save();
                        }
                    }
                    /* $objMedio = new DatPersonamedio();
                      foreach($array_medio as $m){
                      $medio = $m['A'];
                      $asignacion = $m['B'];
                      $fdesde = $m['C'];
                      if($m['D'] == $numero){
                      if($asignacion!=null){
                      $sql = "SELECT a.idasignacion
                      FROM mod_personaext.nom_asignacion AS a
                      WHERE a.denominacion ILIKE '%$asignacion%'";
                      $mg = Doctrine_Manager::getInstance();
                      $conn = $mg->getCurrentConnection();
                      $sqlasignacion = $conn->fetchAll($sql);

                      $idasignacion = $sqlasignacion[0]['idasignacion'];
                      }
                      $objMedio->idasignacion = $idasignacion;
                      $objMedio->idmedio = $idmedio;
                      $objMedio->idpersona = $idpersona;
                      $objMedio->fdesde = $fdesde;
                      $objMedio->save();
                      }

                      } */
                    $objSancion = new DatSancion();
                    foreach ($array_sanciones as $s) {
                        $sancion = $s['A'];
                        $motivo = $s['B'];
                        $fimposicion = $s['C'];
                        if ($s['D'] == $numero) {
                            if ($sancion != null) {
                                $sql = "SELECT s.idsancion
                         FROM mod_personaext.nom_sancion AS s
                         WHERE s.denominacion ILIKE '%$sancion%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlsancion = $conn->fetchAll($sql);

                                $idsancion = $sqlsancion[0]['idsancion'];
                            }
                            if ($motivo != null) {
                                $sql = "SELECT s.idmotivosancion
                         FROM mod_personaext.nom_motivosancion AS s
                         WHERE s.denominacion ILIKE '%$motivo%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlmotivosancion = $conn->fetchAll($sql);

                                $idmotivosancion = $sqlmotivosancion[0]['idmotivosancion'];
                            }

                            $objSancion->idsancion = $idsancion;
                            $objSancion->idmotivosancion = $idmotivosancion;
                            $objSancion->idpersona = $idpersona;
                            $objSancion->fimposicion = $fimposicion;
                            $objSancion->save();
                        }
                    }
                    $objCondecoracion = new DatCondecoracion();
                    foreach ($array_condecoracion as $c) {
                        $condecoracion = $c['A'];
                        if ($c['B'] == $numero) {
                            if ($condecoracion != null) {
                                $sql = "SELECT a.idcondecoracion
                         FROM mod_personaext.nom_condecoracion AS a
                         WHERE a.denominacion ILIKE '%$condecoracion%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlcondecoracion = $conn->fetchAll($sql);

                                $idcondecoracion = $sqlcondecoracion[0]['idcondecoracion'];
                            }
                            $objCondecoracion->idcondecoracion = $idcondecoracion;
                            $objCondecoracion->idpersona = $idpersona;
                            $objCondecoracion->save();
                        }
                    }
                    $objIngreso = new DatIngreso();
                    foreach ($array_ingresos as $i) {
                        $tipoingreso = $i['A'];
                        $cuantia = $i['B'];
                        $moneda = $i['C'];
                        if ($i['D'] == $numero) {
                            if ($tipoingreso != null) {
                                $sql = "SELECT t.idtipoingreso
                         FROM mod_personaext.nom_tipoingreso AS t
                         WHERE t.denominacion ILIKE '%$tipoingreso%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlingreso = $conn->fetchAll($sql);

                                $idtipoingreso = $sqlingreso[0]['idtipoingreso'];
                            }
                            if ($moneda != null) {
                                $sql = "SELECT t.idmoneda
                         FROM mod_datosmaestros.nom_moneda AS t
                         WHERE t.codigoiso ILIKE '%$moneda%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlmoneda = $conn->fetchAll($sql);

                                $idmoneda = $sqlmoneda[0]['idmoneda'];
                            }
                            $objIngreso->idmoneda = $idmoneda;
                            $objIngreso->cuantia = $cuantia;
                            $objIngreso->idtipoingreso = $idtipoingreso;
                            $objIngreso->idpersona = $idpersona;
                            $objIngreso->save();
                        }
                    }
                    $objNivel = new DatNiveleducacional();
                    foreach ($array_nivel as $n) {
                        $nivel = $n['A'];
                        $titulo = $n['B'];
                        $fdesde = $n['C'];
                        if ($n['D'] == $numero) {
                            if ($nivel != null) {
                                $sql = "SELECT a.idniveleducacional
                         FROM mod_personaext.nom_niveleducacional AS a
                         WHERE a.denominacion ILIKE '%$nivel%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlnivel = $conn->fetchAll($sql);

                                $idnivel = $sqlnivel[0]['idniveleducacional'];
                            }
                            if ($titulo != null) {
                                $sql = "SELECT a.idtitulo
                         FROM mod_personaext.nom_titulo AS a
                         WHERE a.denominacion ILIKE '%$titulo%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqltitulo = $conn->fetchAll($sql);

                                $idtitulo = $sqltitulo[0]['idtitulo'];
                            }
                            $objNivel->idniveleducacional = $idnivel;
                            $objNivel->idtitulo = $idtitulo;
                            $objNivel->idpersona = $idpersona;
                            $objNivel->fdesde = $fdesde;
                            $objNivel->save();
                        }
                    }
                    $objEstudio = new DatEducacion();
                    foreach ($array_estudios as $e) {
                        $tipoformacion = $e['A'];
                        $modoformacion = $e['B'];
                        $centro = $e['C'];
                        if ($e['D'] == $numero) {
                            if ($tipoformacion != null) {
                                $sql = "SELECT t.idtipoformacion
                         FROM mod_personaext.nom_tipoformacion AS t
                         WHERE t.denominacion ILIKE '%$tipoformacion%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqltipo = $conn->fetchAll($sql);

                                $idtipoformacion = $sqltipo[0]['idtipoformacion'];
                            }
                            if ($modoformacion != null) {
                                $sql = "SELECT a.idmodoformacion
                         FROM mod_personaext.nom_modoformacion AS a
                         WHERE a.denominacion ILIKE '%$modoformacion%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlmodo = $conn->fetchAll($sql);

                                $idmodoformacion = $sqlmodo[0]['idmodoformacion'];
                            }
                            if ($centro != null) {
                                $sql = "SELECT a.idcentroestudio
                         FROM mod_personaext.nom_centroestudio AS a
                         WHERE a.denominacion ILIKE '%$centro%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlcentro = $conn->fetchAll($sql);

                                $idcentroestudio = $sqlcentro[0]['idcentroestudio'];
                            }
                            $objEstudio->idtipoformacion = $idtipoformacion;
                            $objEstudio->idmodoformacion = $idmodoformacion;
                            $objEstudio->idcentroestudio = $idcentroestudio;
                            $objEstudio->idpersona = $idpersona;
                            $objEstudio->fdesde = $fdesde;
                            $objEstudio->save();
                        }
                    }
                    $objFamilia = new DatFamiliar();
                    foreach ($array_familiar as $f) {
                        $nombre = $f['A'];
                        $parentesco = $f['B'];
                        if ($f['C'] == $numero) {
                            if ($parentesco != null) {
                                $sql = "SELECT a.idparentesco
                         FROM mod_personaext.nom_parentesco AS a
                         WHERE a.denominacion ILIKE '%$parentesco%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlparentesco = $conn->fetchAll($sql);

                                $idparentesco = $sqlparentesco[0]['idparentesco'];
                            }
                            $objFamilia->idparentesco = $idparentesco;
                            $objFamilia->nombre = $nombre;
                            $objFamilia->idpersona = $idpersona;
                            $objFamilia->save();
                        }
                    }
                    $objAfeccion = new DatAfeccion();
                    foreach ($array_afecciones as $a) {
                        $padecimiento = $a['A'];
                        $fdesde = $a['B'];
                        $estado = $a['C'];
                        if ($a['D'] == $numero) {
                            if ($padecimiento != null) {
                                $sql = "SELECT a.idpadecimiento
                         FROM mod_personaext.nom_padecimiento AS a
                         WHERE a.denominacion ILIKE '%$padecimiento%'";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $sqlpadecimiento = $conn->fetchAll($sql);

                                $idpadecimiento = $sqlpadecimiento[0]['idpadecimiento'];
                            }

                            $objAfeccion->idpadecimiento = $idpadecimiento;
                            $objAfeccion->fdesde = $fdesde;
                            $objAfeccion->idpersona = $idpersona;
                            $objAfeccion->save();
                        }
                    }
                } else {
                    $arrayrepetidos[$count] = $result[0]['nombrecompleto'];
                }
            }
        }

        if (count($arrayrepetidos) == 0) {
            return true;
        } else if (count($array_datos) == 1 && count($arrayrepetidos) == 1) {
            return false;
        }
    }

    public function getColor($idpersona) {
        $sql = "SELECT df.idpersona ,nc.denominacion,nc.idcolorpiel  FROM  mod_persona.dat_fenotipo as df
                               left join mod_persona.nom_colorpiel as nc on(df.idcolorpiel=nc.idcolorpiel)
                                 WHERE df.idpersona = $idpersona ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function getIntegracionPolitica($idpersona) {
        $sql = "SELECT df.idpersona ,nc.denominacion,nc.idorganizacion  FROM  mod_personaext.dat_afiliacion as df
                               left join mod_personaext.nom_organizacion as nc on(df.idorganizacion=nc.idorganizacion)
                                 WHERE df.idpersona = $idpersona ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function getDatosPersonaService($where, $arrParams) {
        //print_r($arrParams);die;
        $response = new stdClass();
        try {
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $sql = "SELECT DISTINCT dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.fregistro::date, 
            (CASE WHEN dp.sexo = 1 THEN 'MASCULINO' ELSE 'FEMENINO' END) as sexo, de.denominacion as entidad,
            deop.denominacion as area, nc.denominacion as cargo, nco.denominacion as categocupacional, ddn.fechanacimiento,
            encode(df.foto,'escape') as foto
            FROM mod_persona.dat_persona dp
            INNER JOIN mod_persona.dat_docidentidad dpi ON (dpi.idpersona = dp.idpersona and dpi.principal = 1)
            LEFT JOIN mod_persona.dat_personaentidad dpe ON (dpe.idpersona = dp.idpersona AND (dpe.fhasta IS NULL OR dpe.fhasta >= now()))
            LEFT JOIN mod_persona.dat_situacionlaboral dsl ON (dsl.idpersonaentidad = dpe.idpersonaentidad AND (dsl.fhasta IS NULL OR dsl.fhasta >= now()) AND dsl.principal = 1)
            LEFT JOIN mod_persona.dat_foto df ON (dp.idpersona = df.idpersona and df.fdesde < CURRENT_DATE and(df.fhasta is null OR df.fhasta >= CURRENT_DATE))
            LEFT JOIN mod_persona.dat_datosnacimiento ddn ON (ddn.idpersona = dp.idpersona)
            LEFT JOIN mod_estructuracomp.dat_estructura de ON (de.idestructura = dpe.identidad)
            LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = dsl.idarea)
            LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dsl.idcargo)
            LEFT JOIN mod_estructuracomp.dat_cargocivil dcc ON (dcc.idcargo = dc.idcargo)
            LEFT JOIN mod_estructuracomp.nom_categocup nco ON (nco.idcategocup = dcc.idcategocup)
            LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
            LEFT JOIN mod_persona.dat_contacto dcon ON (dcon.idpersona = dp.idpersona)            
            WHERE dp.feliminado IS NULL {$where}";
            $response->respuesta = $conn->fetchAll($sql, $arrParams);
            return $response;
        } catch (Exception $e) {
            $response->codigo = 'OK';
            $response->error = 'Ha ocurrido un error durante la obtención de los datos';
            return $response;
        }
    }

    public function getDatosFichaBasicaPersona($where) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT  dp.idpersona, dpi.numero as numid,dp.nombre||' '||CASE WHEN dp.snombre is not NULL THEN dp.snombre 
            ELSE '' END||' '||dp.papel||' '||dp.sapel as nombreapellidos,
            (CASE WHEN dp.sexo = 1 THEN 'Masculino' ELSE 'Femenino' END) as sexo, de.denominacion as denomentidad,
            deop.denominacion as denomarea, nc.denominacion as denomcargo,
            encode(df.foto,'escape') as foto,
            (SELECT 
             min(sl.fdesde)
            FROM 
              mod_persona.dat_situacionlaboral sl
              where sl.idpersonaentidad = dpe.idpersonaentidad) as fdesdeentidad,
              dsl.fdesde as fdesdecargo, ns.salario||' pesos' as salario
            FROM mod_persona.dat_persona dp
            INNER JOIN mod_persona.dat_docidentidad dpi ON (dpi.idpersona = dp.idpersona and dpi.principal = 1)
            LEFT JOIN mod_persona.dat_personaentidad dpe ON (dpe.idpersona = dp.idpersona AND (dpe.fhasta IS NULL OR dpe.fhasta >= now()))
            LEFT JOIN mod_persona.dat_situacionlaboral dsl ON (dsl.idpersonaentidad = dpe.idpersonaentidad AND (dsl.estado = 0) AND dsl.principal = 1)
            LEFT JOIN mod_persona.dat_foto df ON (dp.idpersona = df.idpersona and df.fdesde < CURRENT_DATE and(df.fhasta is null OR df.fhasta >= CURRENT_DATE))
            LEFT JOIN mod_estructuracomp.dat_estructura de ON (de.idestructura = dpe.identidad and de.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = dsl.idarea and deop.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dsl.idcargo and dc.idproyecto = 0)            
            LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
            LEFT JOIN mod_estructuracomp.nom_salario ns ON (ns.idsalario = dc.idsalario)           
            WHERE dp.feliminado IS NULL  and " . $where;
        return $conn->fetchAll($sql);
    }

    public function getByIdPersona($idpersona) {
        $query = Doctrine_Query::create()
                ->select("pe.idpersonaentidad")
                ->from('DatPersonaentidad pe')
                ->where(
                "pe.idpersona = '$idpersona'
                AND (now() <= pe.fhasta OR pe.fhasta is null)"
        );
        return $query->execute()->toArray();
    }

    public function getDatosBasicosPersona($numid, $nombre, $snombre, $papel, $sapel, $cargos, $compartimentacion, $limit = 50, $start = 0) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT  dp.idpersona, dpi.numero as numid
            , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos,
            encode(df.foto,'escape') as foto
            FROM mod_persona.dat_persona dp            
            LEFT JOIN mod_persona.dat_personaentidad AS pe ON (dp.idpersona = pe.idpersona AND pe.fdesde < CURRENT_DATE and(pe.fhasta IS NULL OR pe.fhasta >= CURRENT_DATE)) 
            LEFT JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND sl.fdesde < CURRENT_DATE and(sl.fhasta IS NULL OR sl.fhasta >= CURRENT_DATE))
            LEFT JOIN mod_persona.dat_docidentidad dpi ON (dpi.idpersona = dp.idpersona and dpi.principal = 1)
            LEFT JOIN mod_persona.dat_foto df ON (dp.idpersona = df.idpersona and df.fdesde < CURRENT_DATE and(df.fhasta is null OR df.fhasta >= CURRENT_DATE))         
            WHERE dp.feliminado IS NULL";

        $cadenaReemplazar = $vocales = array("a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "u", " ");
        $cadenaBuscar = $vocales = array("á", "é", "í", "ó", "ú", "à", "è", "ì", "ò", "ù", "ü", "'");

        if (count($cargos) > 0 && $compartimentacion == 2) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        if (!empty($numid)) {
            $sql .= " AND dpi.numero LIKE '%$numid%'";
        }
        if (!empty($nombre)) {
            $nombre = trim($nombre);
            $nombre = mb_strtolower($nombre, "UTF-8");
            $nombre = str_replace($cadenaBuscar, $cadenaReemplazar, $nombre);
            $sql .= " AND mod_persona.sustituiryconvertir(dp.nombre) like '{$nombre}%' ";
        }
        if (!empty($snombre)) {
            $snombre = trim($snombre);
            $snombre = mb_strtolower($snombre, "UTF-8");
            $snombre = str_replace($cadenaBuscar, $cadenaReemplazar, $snombre);
            $sql .= " AND mod_persona.sustituiryconvertir(dp.snombre) like '{$snombre}%' ";
        }
        if (!empty($papel)) {
            $papel = trim($papel);
            $papel = mb_strtolower($papel, "UTF-8");
            $papel = str_replace($cadenaBuscar, $cadenaReemplazar, $papel);
            $sql .= "  AND mod_persona.sustituiryconvertir(dp.papel) like '{$papel}%' ";
        }
        if (!empty($sapel)) {
            $sapel = trim($sapel);
            $sapel = mb_strtolower($sapel, "UTF-8");
            $sapel = str_replace($cadenaBuscar, $cadenaReemplazar, $sapel);
            $sql .= "  AND mod_persona.sustituiryconvertir(dp.sapel) like '{$sapel}%' ";
        }
        $sql .= "  ORDER BY dp.papel LIMIT {$limit} OFFSET {$start}";

        return $conn->fetchAll($sql);
    }

    public function getCompartimentacionByIdusuario($idusuario) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT c.*
            FROM mod_rrhhmaestro.seg_usuariocompartimentacion c       
            WHERE c.idusuario = $idusuario";
        return $conn->fetchAll($sql);
    }

    public function getDatosFichaPersona($idpersona) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT  dp.idpersona, ddn.fechanacimiento
            , (CASE WHEN dp.sexo = 1 THEN 'Masculino' ELSE 'Femenino' END) as sexo
            , date_part('year',age(ddn.fechanacimiento)) AS edad
            , dpi.numero as numid
            , sl.idarea as idarea
            , sl.idcargo as idcargo
            , sl.ueb as ueb
            , pe.identidad as identidad
            , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos,
            encode(df.foto,'escape') as foto,
            nco.denominacion as colorojos,
            ncp.denominacion as colorpiel,
            ncpe.denominacion as colorpelo,
            ddf.pesocorporal,
            ddf.estatura,
            ngs.denominacion as gruposanguineo,
            nec.denominacion as estadocivil,
            (CASE WHEN desa.estadosalud = 0 THEN 'Bueno' WHEN desa.estadosalud = 1 THEN 'Regular' ELSE 'Malo' END) as estadosalud
            FROM mod_persona.dat_persona dp
            LEFT JOIN mod_persona.dat_datosnacimiento ddn ON (ddn.idpersona = dp.idpersona)
            LEFT JOIN mod_personaext.dat_estadosalud desa ON (desa.idpersona = dp.idpersona)
            LEFT JOIN mod_personaext.dat_caracteristicasocial dcs ON (dcs.idpersona = dp.idpersona)
            LEFT JOIN mod_personaext.nom_estadocivil nec ON (dcs.idestadocivil = nec.idestadocivil)
            LEFT JOIN mod_persona.dat_fenotipo ddf ON (ddf.idpersona = dp.idpersona)
            LEFT JOIN mod_persona.nom_colorojos nco ON (ddf.idcolorojos = nco.idcolorojos)
            LEFT JOIN mod_persona.nom_colorpiel ncp ON (ddf.idcolorpiel = ncp.idcolorpiel)
            LEFT JOIN mod_persona.nom_colorpelo ncpe ON (ddf.idcolorpelo = ncpe.idcolorpelo)
            LEFT JOIN mod_persona.nom_gruposanguineo ngs ON (ddf.idgruposanguineo = ngs.idgruposanguineo)
            LEFT JOIN mod_persona.dat_personaentidad AS pe ON (dp.idpersona = pe.idpersona AND pe.fdesde < CURRENT_DATE and(pe.fhasta IS NULL OR pe.fhasta >= CURRENT_DATE)) 
            LEFT JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND sl.fdesde < CURRENT_DATE and(sl.fhasta IS NULL OR sl.fhasta >= CURRENT_DATE))
            LEFT JOIN mod_persona.dat_docidentidad dpi ON (dpi.idpersona = dp.idpersona and dpi.principal = 1)
            LEFT JOIN mod_persona.dat_foto df ON (dp.idpersona = df.idpersona and df.fdesde < CURRENT_DATE and(df.fhasta is null OR df.fhasta >= CURRENT_DATE))         
            WHERE dp.feliminado IS NULL ";
        if (!empty($idpersona)) {
            $sql .= " AND dp.idpersona = '$idpersona'";
        }
        return $conn->fetchAll($sql);
    }

    public function getProvMunPersonas() {
        try {
            $sqlprov = "SELECT DISTINCT dd.idprovincia, n.denominacion
                FROM mod_persona.dat_direccion dd
                INNER JOIN mod_datosmaestros.nom_dpt n ON (dd.idprovincia = n.iddpt)
                ORDER BY dd.idprovincia";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $prov = $conn->fetchAll($sqlprov);
            $sqlmun = "SELECT DISTINCT dd.idmunicipio, n.denominacion
                FROM mod_persona.dat_direccion dd
                INNER JOIN mod_datosmaestros.nom_dpt n ON (dd.idmunicipio = n.iddpt)
                ORDER BY dd.idmunicipio";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $mun = $conn->fetchAll($sqlmun);
            $result->provincias = $prov;
            $result->municipios = $mun;
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getPersonasByMultiplesParametros($numid, $idprovincia, $idmunicipio, $cargos, $fnacimiento, $contacto) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT  dp.idpersona, ddn.fechanacimiento
            , (CASE WHEN dp.sexo = 1 THEN 'Masculino' ELSE 'Femenino' END) as sexo
            , date_part('year',age(ddn.fechanacimiento)) AS edad
            , dpi.numero as numid, dc.contacto
            , sl.idarea as idarea
            , sl.idcargo as idcargo, nce.denominacion as cargo
            , pe.identidad as identidad
            , dptm.denominacion AS municipio
            , dptp.denominacion AS provincia
            , (CASE WHEN (dp.snombre = '' OR dp.snombre is null) 
                THEN (dp.nombre ||' '|| dp.papel ||' '|| dp.sapel) 
                ELSE (dp.nombre ||' '||dp.snombre ||' '|| dp.papel ||' '|| dp.sapel) END) as nombreyapellidos,
            encode(df.foto,'escape') as foto
            FROM mod_persona.dat_persona dp
            LEFT JOIN mod_persona.dat_direccion dd ON (dd.idpersona = dp.idpersona AND dd.oficial = 1)
            LEFT JOIN mod_persona.dat_contacto dc ON (dc.idpersona = dp.idpersona)
            LEFT JOIN mod_persona.dat_datosnacimiento ddn ON (ddn.idpersona = dp.idpersona)
            LEFT JOIN mod_persona.dat_personaentidad AS pe ON (dp.idpersona = pe.idpersona AND pe.fdesde < CURRENT_DATE and(pe.fhasta IS NULL OR pe.fhasta >= CURRENT_DATE)) 
            LEFT JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND sl.estado = 0)
            LEFT JOIN mod_persona.dat_docidentidad dpi ON (dpi.idpersona = dp.idpersona and dpi.principal = 1)
            LEFT JOIN mod_persona.dat_foto df ON (dp.idpersona = df.idpersona and df.fdesde < CURRENT_DATE and(df.fhasta is null OR df.fhasta >= CURRENT_DATE))  
            LEFT JOIN mod_datosmaestros.nom_dpt AS dptm ON (dd.idmunicipio = dptm.iddpt)
            LEFT JOIN mod_datosmaestros.nom_dpt AS dptp ON (dd.idprovincia = dptp.iddpt)
            LEFT JOIN mod_estructuracomp.dat_cargo dce ON (sl.idcargo = dce.idcargo AND dce.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.nom_cargo nce ON (dce.idnomcargo = nce.idnomcargo)       
            WHERE dp.feliminado IS NULL";
        if ($numid) {
            $sql = $sql . " AND dpi.numero ilike '%$numid%'";
        }
        if ($idprovincia) {
            $sql = $sql . " AND dd.idprovincia = $idprovincia";
        }
        if ($idmunicipio) {
            $sql = $sql . " AND dd.idmunicipio = $idmunicipio";
        }
        if ($cargos) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        if ($fnacimiento) {
            $sql = $sql . " AND ddn.fechanacimiento = '$fnacimiento'";
        }
        if ($contacto) {
            $sql = $sql . " AND dc.contacto  ilike '%$contacto%'";
        }

        return $conn->fetchAll($sql);
    }

    public function getPersonasCumplenAnnos($fdesde, $fhasta) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        $sql = "SELECT dp.idpersona, ddn.fechanacimiento
                        , (CASE WHEN dp.sexo = 1 THEN 'Masculino' ELSE 'Femenino' END) as sexo
                        , date_part('year',age(ddn.fechanacimiento)) AS edad
                        , dpi.numero as numid
                        , sl.idarea as idarea
                        , sl.idcargo as idcargo, nce.denominacion as cargo
                        , pe.identidad as identidad
                        , dptm.denominacion AS municipio
                        , dptp.denominacion AS provincia
                        , (CASE WHEN (dp.snombre = '' OR dp.snombre is null) 
                                THEN (dp.nombre ||' '|| dp.papel ||' '|| dp.sapel) 
                                ELSE (dp.nombre ||' '||dp.snombre ||' '|| dp.papel ||' '|| dp.sapel) END) as nombreyapellidos
                        , encode(df.foto,'escape') as foto

                FROM mod_persona.dat_persona dp
                LEFT JOIN mod_persona.dat_direccion dd ON (dd.idpersona = dp.idpersona AND dd.oficial = 1)
                LEFT JOIN mod_persona.dat_datosnacimiento ddn ON (ddn.idpersona = dp.idpersona)
                LEFT JOIN mod_persona.dat_docidentidad dpi ON (dpi.idpersona = dp.idpersona and dpi.principal = 1)
                LEFT JOIN mod_persona.dat_personaentidad AS pe ON (dp.idpersona = pe.idpersona AND pe.fdesde < CURRENT_DATE and(pe.fhasta IS NULL OR pe.fhasta >= CURRENT_DATE)) 
                LEFT JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND sl.estado = 0 AND sl.principal = 1)
                LEFT JOIN mod_estructuracomp.dat_cargo dce ON (sl.idcargo = dce.idcargo AND dce.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.nom_cargo nce ON (dce.idnomcargo = nce.idnomcargo) 
                LEFT JOIN mod_datosmaestros.nom_dpt AS dptm ON (dd.idmunicipio = dptm.iddpt)
                LEFT JOIN mod_datosmaestros.nom_dpt AS dptp ON (dd.idprovincia = dptp.iddpt)
                LEFT JOIN mod_persona.dat_foto df ON (dp.idpersona = df.idpersona and df.principal = 1 and df.fdesde < CURRENT_DATE and(df.fhasta is null OR df.fhasta >= CURRENT_DATE))

                WHERE dp.feliminado IS NULL AND ddn.fechanacimiento is not null

                    AND ((split_part(ddn.fechanacimiento::text, '/', 2)||split_part(ddn.fechanacimiento::text, '/', 1)) 
                        IN (SELECT (split_part(i::text, '/', 2)||split_part(i::text, '/', 1)) FROM (select i::date from generate_series('$fdesde', '$fhasta', '1 day'::interval) i) as serie))
                        OR
                        ((split_part(ddn.fechanacimiento::text, '/', 2)||split_part(ddn.fechanacimiento::text, '/', 1)) = (split_part('$fhasta'::text, '/', 2)||split_part('$fhasta'::text, '/', 1))) ";

        return $conn->fetchAll($sql);
    }

    public function getCargosByNumid($numid) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        $sql = "SELECT               
               pe.identidad
              , sl.fdesde
              , sl.fhasta
              , sl.idarea as idarea
              , nce.denominacion as cargo
              , tc.denominacion as tipocontrato
              , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                               WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                                THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                               WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                                THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                               ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
                      END AS nombreyapellidos
              FROM mod_persona.dat_situacionlaboral AS sl
              INNER JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = sl.idcargo)
              INNER JOIN mod_estructuracomp.nom_cargo nce ON (dc.idnomcargo = nce.idnomcargo) 
              INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
              INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
              INNER JOIN mod_persona.dat_docidentidad AS ident
                ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                  AND (ident.fhasta > now() OR ident.fhasta IS NULL))				
              INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
              WHERE dp.feliminado IS NULL AND sl.estado = 0 AND ident.numero = '$numid'";

        return $conn->fetchAll($sql);
    }

    public function getDatosPersonaById($arraypersonas) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT DISTINCT
                  dp.idpersona, 
                  dpi.numero as ci,
                  dp.nombre||' '||CASE WHEN dp.snombre is not NULL THEN dp.snombre 
                            ELSE '' END||' '||dp.papel||' '||dp.sapel as nombreapellidos,
                  (CASE WHEN dp.sexo = 1 THEN 'MASCULINO' ELSE 'FEMENINO' END) as sexo,
                  date_part('year',age(ddn.fechanacimiento)) as edad,
                  de.denominacion as entidad,
                  deop.denominacion as area, 
                  nc.denominacion as cargo, 
                  nco.denominacion as categocupacional, 
                  ddn.fechanacimiento
                FROM 
                  mod_persona.dat_persona dp
                  INNER JOIN mod_persona.dat_docidentidad dpi ON (dpi.idpersona = dp.idpersona and dpi.principal = 1)
                  LEFT JOIN mod_persona.dat_personaentidad dpe ON (dpe.idpersona = dp.idpersona AND (dpe.fhasta IS NULL OR dpe.fhasta >= now()))
                  LEFT JOIN mod_persona.dat_situacionlaboral dsl ON (dsl.idpersonaentidad = dpe.idpersonaentidad AND (dsl.fhasta IS NULL OR dsl.fhasta >= now()) AND dsl.principal = 1)
                  LEFT JOIN mod_persona.dat_datosnacimiento ddn ON (ddn.idpersona = dp.idpersona)
                  LEFT JOIN mod_estructuracomp.dat_estructura de ON (de.idestructura = dpe.identidad)
                  LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = dsl.idarea)
                  LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dsl.idcargo)
                  LEFT JOIN mod_estructuracomp.dat_cargocivil dcc ON (dcc.idcargo = dc.idcargo)
                  LEFT JOIN mod_estructuracomp.nom_categocup nco ON (nco.idcategocup = dcc.idcategocup)
                  LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
                  where dp.feliminado IS NULL and dp.idpersona in (" . implode(',', $arraypersonas) . ");";
        return $conn->fetchAll($sql);
    }

}
