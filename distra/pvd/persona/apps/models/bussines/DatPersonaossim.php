<?php

/**
 * Short description for class
 * Long description for class (if any)...
 *
 * @category   PhpStorm
 * @package    distra
 * @subpackage Wand
 * @copyright  Copyright (c) 2005-2015 XETID (http://www.xetid.cu)
 * @license    http://framework.zend.com/license   BSD License
 * @version    Release: @package_version@
 */
class DatPersonaossim extends BaseDatPersona
{
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
    public function setUp()
    {
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
        $this->hasMany('DatGradomilitar', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatTallaje', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatCaracteristicasocial', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatRegimentrabajo', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    public function getById($idpersona)
    {
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
    public function reflectArray($data)
    {
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
    public function getAll($idpersona)
    {
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
     * Agregar a una consulta las sentencias necesarias para obtener los datos personales.
     *
     * @param Doctrine_Query $objDoctrineQuery Consulta a la cual se le quiere agregar las sentencias DQL.
     * @param string $aliasTablaReferencia Alias de la clase de dominio que tiene relación con la clase DatPersona.
     *
     * @return Doctrine_Query Consulta modificada con las sentencias que devuelven los datos personales.
     */
    public function agregarDqlDatosPersona(
        Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect, $includeTablas, $relation
    )
    {
        if ($includeDqlSelect) {
            $addSelect
                = "$aliasTabla.idpersona AS idpersona,
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
    protected function setRelations(Doctrine_Query &$objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $relation)
    {
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
        array $idpersona, $filtro, $limit, $start = 0, array $identidad, array $idcargo
    )
    {
        try {
            $query = Doctrine_Query::create()->from('DatPersona dp')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->Where(
                'dp.feliminado IS NULL'
            );
            self::addSelectDQLPersona($query, 'dp', true, true);
            $objOcupacion = new SituacionLaboralRepository();
            $objOcupacion->addDQLOcupacion($query, 'dp', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);
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
                $addWhere = "dpident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%' " .
                    "or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%' or dp.sapel ilike '%$filtro%'";
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
    /*public function addSelectDQLPersona(Doctrine_Query &$objDQ, $aT, $inOT = false)
    {
        $this->objStaticInfo = new EnlacesStaticosService();
        $sexos = $this->objStaticInfo->getImgSexo();

        if ($inOT === true) {
            $objDQ->leftJoin("$aT.DatDatosnacimiento dpnac")
                ->leftJoin("$aT.DatDocidentidad dpident WITH dpident.principal = 1")
                ->leftJoin("dpident.NomTipodocidentidad ntpident")
                ->leftJoin("$aT.DatFoto dpfot WITH dpfot.principal = 1")
                ->leftJoin("$aT.DatCategorizacion dctg")
                ->leftJoin('dctg.NomCategoriapersona ncateg')
                ->leftJoin("$aT.DatDireccion dir")
                ->leftJoin("$aT.DatEducacion est")
                ->leftJoin("est.NomFacultadestudio fac")
                ->leftJoin("est.NomTipoformacion tf")
                ->leftJoin("est.NomTitulo titu")
                ->leftJoin("est.NomModoformacion modf");

        }
        $otherData = $inOT === true
            ? ", dpnac.fechanacimiento as fechanacimiento,dpnac.nombrepadre as nombrepadre,
     * dpnac.nombremadre as nombremadre, dpident.iddocidentidad as iddocidentidad,
                        ntpident.denominacion as denomtipodocidentidad, dpident.numero AS numid,
     * dpfot.idfoto as idfoto, (CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto, 'base64')
                        WHEN $aT.sexo = 1 THEN '$sexos->male' ElSE '$sexos->famale' END) as foto,
                        dctg.idcategorizacion,ncateg.idcategoria ,ncateg.denominacion as categoria,
                        dir.*,est.*,fac.*,tf.*,titu.*,modf.*"
            : ' ';
        $addSelect = "$aT.idpersona, $aT.idpersona as idpersona, $aT.nombre as nombre,
         $aT.snombre as snombre, $aT.sapel as sapel,
          $aT.papel as papel, $aT.fregistro as fregistro, $aT.feliminado as feliminado,
           (CASE WHEN $aT.sexo = 0 THEN 'Femenino' ELSE 'Masculino' END) AS denomsexo, $aT.sexo as sexo,
            (CASE WHEN $aT.snombre is not null THEN $aT.nombre||' '|| $aT.snombre||' '|| $aT.papel||' '||  $aT.sapel
                    	ELSE $aT.nombre||' '|| $aT.papel||' '||  $aT.sapel END) as nombreapellidos $otherData";
        $objDQ->addSelect($addSelect);
    }*/
    /**
     * Cambio de la funcionalidad 11/02/2016
     *
     * @param Doctrine_Query $objDQ
     * @param                $aT
     * @param bool|false $inOT
     */
    public function addSelectDQLPersona(Doctrine_Query &$objDQ, $aT, $inOT = false)
    {
        $this->objStaticInfo = new EnlacesStaticosService();
        $sexos = $this->objStaticInfo->getImgSexo();
        if ($inOT === true) {
            $objDQ->leftJoin("$aT.DatDatosnacimiento dpnac")->leftJoin(
                "$aT.DatDocidentidad dpident WITH dpident.principal = 1"
            )->leftJoin("$aT.DatDireccion dir WITH dir.oficial = 1")->leftJoin("dpident.NomTipodocidentidad ntpident")
                ->leftJoin("$aT.DatFoto dpfot WITH dpfot.principal = 1");

        }
        $otherData = $inOT === true ? ", dpnac.fechanacimiento as fechanacimiento, dpident.iddocidentidad as iddocidentidad,dir.iddireccion,
            dir.idprovincia, dir.idmunicipio, dir.direccion,
                        ntpident.denominacion as denomtipodocidentidad, dpident.numero AS numid,
                        dpfot.idfoto as idfoto, (CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto,'escape')
                        WHEN $aT.sexo = 1 THEN '$sexos->male' ElSE '$sexos->famale' END) as foto" : ' ';
        /*, (CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto,'escape')
                        WHEN $aT.sexo = 1 THEN '$sexos->male' ElSE '$sexos->famale' END) as foto*/
        $addSelect
            = "$aT.idpersona, $aT.idpersona as idpersona, $aT.nombre as nombre,
         $aT.snombre as snombre, $aT.sapel as sapel,
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
    public function getCantPrincipalesDatosPersona(array $idpersona, $filtro, array $identidad, array $idcargo)
    {
        try {
            $query = Doctrine_Query::create()->from('DatPersona dp')->leftJoin(
                "dp.DatDocidentidad dpident WITH dpident.principal = 1"
            )->Where('dp.feliminado IS NULL');
            $objOcupacion = new SituacionLaboralRepository();
            $objOcupacion->addDQLOcupacion($query, 'dp', array('dpentd', 'dslab', 'nsitu'), 'leftjoin');
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
                $addWhere = "dpident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%' " . "or dp.snombre ilike '%$filtro%'
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
    public function addDQLPersona(Doctrine_Query &$objDQ, $aTR, $aT, $typeR = 'leftJoin', $inDQL, $inOT = false)
    {
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
}