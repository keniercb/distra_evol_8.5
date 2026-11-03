<?php

/**
 * SupervisorWorker
 * Worker de actualizar el vector de la compartimentacion.
 *
 * @author Angel Rafael Sanchez Napoles
 */
class ZendExt_Restrict_Worker extends Amqp_Worker_Abstract
{

    /**
     * __construct
     * Constructor de la clase.
     *
     * @param string $idProcess
     */
    public function __construct($idProcess = '')
    {
        parent::__construct($idProcess);
    }

    /**
     * work
     * Realiza las tareas de supervición o monitoreo.
     *
     * @param mixed $args
     */
    public function work($args)
    {
        $_idrestrictInfo = $args->idrestrictInfo;
        $_idusser = $args->idusuario;
        $_uriSource = $args->fuente ? $args->fuente : 'datosgenerales';
        $_configDomain = $args->dominio ? $args->dominio : array('ambito' => null);
        $_configRestrictType = $args->criterio ? $args->criterio : array('clasificacion' => null);
        $_reloadConfig = $args->recargar;
        if ($args->option == 'delete') {
            return $this->removeRestrict(
                $_uriSource, $_idusser, $_configDomain, $_configRestrictType, $_idrestrictInfo, $_reloadConfig
            );
        } else {
            return $this->addRestrict(
                $_uriSource, $_configDomain, $_configRestrictType, $_idrestrictInfo, $_idusser, $_reloadConfig
            );
        }
    }

    public function removeRestrict(
        $_uriSource, $_usserRestrict, $_configDomain = array('ambito' => null),
        $_configRestrictType = array('clasificacion' => null), $_idrestrictInfo = null, $_reloadConfig = false
    )
    {
        if ($_reloadConfig) {
            $_restrictConfig = $this->_getRestrictConfig($_uriSource, $_configRestrictType, $_configDomain);
            $this->saveRestrictConfigIntoCache($_restrictConfig);

            $_ussersConfig = $this->loadUssersConfig($_restrictConfig, $_configDomain);
            $this->saveUssersConfigIntoCache($_ussersConfig);
        } else {
            $_restrictConfig = $this->loadRestrictConfigFromCache($_uriSource, $_configRestrictType, $_configDomain);
            if (!$_restrictConfig) {
                $_restrictConfig = $this->_getRestrictConfig($_uriSource, $_configRestrictType, $_configDomain);
                $this->saveRestrictConfigIntoCache($_restrictConfig);
            }
            $_ussersConfig = $this->loadUssersConfigFromCache($_restrictConfig, $_configDomain);
            if (!$_ussersConfig) {
                $_ussersConfig = $this->loadUssersConfig($_restrictConfig, $_configDomain);
                $this->saveUssersConfigIntoCache($_ussersConfig);
            }
        }
        $_infoObject = $this->getInfoRestrict($_restrictConfig, $_idrestrictInfo, $_configDomain, $_configRestrictType);
        if (count($_infoObject) > 0) {
            $this->removeInfoRestrict($_restrictConfig, $_infoObject, $_usserRestrict, $_configDomain);
        }
    }

    public function _getRestrictConfig($_fuente, $_criterio, $_dominio)
    {
        //Obteniendo los datos de la configuracion inicial de la compartimentacion.
        $infSource = $_fuente;
        $restType = $_criterio;
        $arrayRestType = array();
        foreach ($restType as $_res => $_val) {
            $arrayRestType[] = $_res;
        }
        if (count($arrayRestType)) {
            $resType = implode("','", $arrayRestType);
        } else {
            return null;
        }

        $arrayDomType = array();
        foreach ($_dominio as $dom => $val) {
            $arrayDomType[] = $dom;
        }
        $domType = '';
        if (count($arrayDomType)) {
            $domType = implode(",", $arrayDomType);
        } else {
            return null;
        }

        //Obteniendo configuracion de la compartimentacion.
        $querySQL = ZendExt_Query_SQL::create();
        $querySQL->select("fdom.fuente as tablafuentedominio")
            ->from("mod_compartimentacion.dat_fuentedominio fdom")
            ->addSelect("confinf.campo as campoidfuente,fdatinf.uri,fdatinf.idfuentedato as idsource")
            ->innerJoin(
                "mod_compartimentacion.dat_fuentedato fdatinf ON (fdom.idfuenteinformacion = fdatinf.idfuentedato AND fdatinf.uri = ?)",
                $infSource
            )
            ->innerJoin(
                "mod_compartimentacion.dat_configfuentedato confinf ON (fdatinf.idfuentedato = confinf.idfuentedato AND confinf.pk = 1)"
            );

        if ($domType) {
            $querySQL->addSelect(
                "fdatdom.fuente as tabladominio, confdom.campo as campoiddominio, fdatdom.uri as uridominio, fdom.idtipodominio, confdomarbol.padre, confdomlft.campo as lft, confdomrgt.campo as rgt"
            )
                ->innerJoin(
                    "mod_compartimentacion.dat_fuentedato fdatdom ON (fdom.idtipodominio = fdatdom.idfuentedato AND fdatdom.uri IN ('$domType'))"
                )
                ->innerJoin(
                    "mod_compartimentacion.dat_configfuentedato confdom ON (fdatdom.idfuentedato = confdom.idfuentedato AND confdom.pk = 1)"
                )
                ->leftJoin(
                    "mod_compartimentacion.dat_configfuentedato confdomarbol ON (fdatdom.idfuentedato = confdomarbol.idfuentedato AND confdomarbol.padre = 1)"
                )
                ->leftJoin(
                    "mod_compartimentacion.dat_configfuentedato confdomlft ON (fdatdom.idfuentedato = confdomlft.idfuentedato AND confdomlft.identificador = 'lft')"
                )
                ->leftJoin(
                    "mod_compartimentacion.dat_configfuentedato confdomrgt ON (fdatdom.idfuentedato = confdomrgt.idfuentedato AND confdomrgt.identificador = 'rgt')"
                );
        }

        $objConfComp['source'] = $querySQL->fetchAll();
        $querySQL = ZendExt_Query_SQL::create();
        $objConfCompType = $querySQL->select(
            "fdatcmp.uri,fdatcmp.fuente as tablatipocomp, confcmp.campo as campoidtipocomp, fdatcmp.idfuentedato as idtipocriteriocomp"
        )
            ->from("mod_compartimentacion.dat_fuentedato fdatcmp")
            ->innerJoin(
                "mod_compartimentacion.dat_configfuentedato confcmp ON (fdatcmp.uri IN ('$resType') AND fdatcmp.idfuentedato = confcmp.idfuentedato AND confcmp.pk = 1)"
            )
            ->fetchAll();
        $objConfComp['type'] = $objConfCompType;
        foreach ($objConfComp['source'] as $i => $elConfComp) {
            $objConfComp['source'][$i]['type'] = $objConfCompType;
        }
        if ($domType) {
            $objConfComp['domain'] = array();
            foreach ($objConfComp['source'] as $i => $elConfComp) {
                if (!$elConfComp['tabladominio']) {
                    $tempObjConfComp['tabladominio'] = null;
                    $tempObjConfComp['campoiddominio'] = null;
                    $tempObjConfComp['idtipodominio'] = null;
                    $tempObjConfComp['lft'] = null;
                    $tempObjConfComp['rgt'] = null;
                } else {
                    $tempObjConfComp['tabladominio'] = $elConfComp['tabladominio'];
                    $tempObjConfComp['campoiddominio'] = $elConfComp['campoiddominio'];
                    $tempObjConfComp['idtipodominio'] = $elConfComp['idtipodominio'];
                    $tempObjConfComp['lft'] = $elConfComp['lft'];
                    $tempObjConfComp['rgt'] = $elConfComp['rgt'];
                }
                $objConfComp['domain'][$elConfComp['uridominio']] = $tempObjConfComp;
            }
        }
        //print_r($objConfComp);die;
        return $objConfComp;
    }

    public function saveRestrictConfigIntoCache($_restrictConfig)
    {

    }

    public function loadUssersConfig($_restrictConfig, $_aliasDominio, $_idusuario = null)
    {
        //Obtengo los usuarios y sus posiciones en el vector
        if ($_idusuario) {
            $ussersPosition = ZendExt_Query_SQL::create()->select('posiciondominio,idusuario')->from(
                'mod_seguridad.seg_usuario'
            )->where('idusuario = ?', $idUser)->fetchOne();
        } else {
            $ussersPosition = ZendExt_Query_SQL::create()->select('posiciondominio,idusuario')->from(
                'mod_seguridad.seg_usuario'
            )->fetchAll();
        }
        $ussersId = array();
        $_ussersIndexPos = array();
        $_ussersIndexId = array();
        foreach ($ussersPosition as $_usser) {
            $ussersId[] = $_usser['idusuario'];
            $_ussersIndexPos[$_usser['posiciondominio']] = $_usser;
            $_ussersIndexId[$_usser['idusuario']] = $_usser;
        }

        //Obtengo la configuracion por roles y criterios
        $_domainsId = array();
        $_domainsIdText = '';
        $_domainsObjects = $_restrictConfig['domain'];
        foreach ($_domainsObjects as $_domain) {
            $_domainsId[] = $_domain['idtipodominio'];
        }
        $_domainsIdText = implode(",", $_domainsId);
        $_restrictLevels = ZendExt_Query_SQL::create()
            ->select(
                'confrest.idrolanalista,confrest.idtipodominio,confrest.idtipocriteriocompartimentacion,confrest.idcriterioinformacion,confrest.permisodominio,confrest.permisofueradominio,confrest.permisohijosdominio,confrest.revocaraccesodenegado,rolusser.idusuario,rolusser.idelementodominio,rolusser.dominio'
            )
            ->from('mod_compartimentacion.dat_confcompartimentacion confrest')
            ->where("confrest.idtipodominio IN ({$_domainsIdText})");

        $usserList = implode(',', $ussersId);
        $_onDomain
            = "confrest.idtipodominio = rolusser.idtipodominio AND rolusser.idusuario IN ({$usserList}) AND confrest.idrolanalista = rolusser.idrolanalista";
        foreach ($_aliasDominio as $_dom => $_id) {
            if ($_domainsObjects[$_dom]['idtipodominio']) {
                $_restDomain .= " ( rolusser.idtipodominio = " . $_domainsObjects[$_dom]['idtipodominio'];
                /* if ($_id != null) {
                  $_restDomain .= " AND rolusser.idelementodominio = {$_id} ";
                  } */
                $_restDomain .= ") OR";
            }
        }
        if ($_restDomain) {
            $_onDomain .= ' AND (' . $_restDomain . ")";
            $_onDomain = str_replace("OR)", ")", $_onDomain);
        }

        $_restrictLevels->innerJoin("mod_compartimentacion.dat_rolusuariodominio rolusser ON ({$_onDomain})");

        $_levels = $_restrictLevels->fetchAll();
        $listDomain = array();

        foreach ($_levels as $_ind => $_lev) {
            if ($_ussersIndexId[$_lev['idusuario']]) {
                $_usserConf = $_ussersIndexId[$_lev['idusuario']];
                $_usserConf['roles'] = $_ussersIndexId[$_lev['idusuario']]['roles']
                    ? $_ussersIndexId[$_lev['idusuario']]['roles'] : array();

                $confType = array(
                    'en'      => $_lev['permisodominio'],
                    'fuera'   => $_lev['permisofueradominio'],
                    'dentro'  => $_lev['permisohijosdominio'],
                    'revocar' => $_lev['revocaraccesodenegado']
                );
                if (!$listDomain[$_lev['idtipodominio']][$_lev['idelementodominio']]) {
                    $_idDomainType = $_lev['idtipodominio'];
                    $_domType = ZendExt_Query_SQL::create()->select(
                        'domtype.*,confdom.campo as id,confdom.identificador as idId,confdomlft.campo as lft,confdomlft.identificador as lftId,confdomrgt.campo as rgt,confdomrgt.identificador as rgtId,confdom.pk'
                    )
                        ->from('mod_compartimentacion.dat_fuentedato domtype')
                        ->innerJoin(
                            "mod_compartimentacion.dat_configfuentedato confdom ON (domtype.idfuentedato = confdom.idfuentedato AND confdom.pk = 1)"
                        )
                        ->leftJoin(
                            "mod_compartimentacion.dat_configfuentedato confdomlft ON (domtype.idfuentedato = confdomlft.idfuentedato AND confdomlft.identificador = 'lft')"
                        )
                        ->leftJoin(
                            "mod_compartimentacion.dat_configfuentedato confdomrgt ON (domtype.idfuentedato = confdomrgt.idfuentedato AND confdomrgt.identificador = 'rgt')"
                        )
                        ->where("domtype.idfuentedato = {$_idDomainType}")
                        ->fetchAll();
                    $_domType = $_domType[0];
                    $_domEl = ZendExt_Query_SQL::create()
                        ->select('dom.*')
                        ->from("{$_domType['fuente']} as dom")
                        ->where($_domType['id'] . ' = ' . $_lev['idelementodominio'])
                        ->fetchAll();
                    if (!$listDomain[$_lev['idtipodominio']]) {
                        $listDomain[$_lev['idtipodominio']] = array();
                    }
                    if (!$listDomain[$_lev['idtipodominio']][$_lev['idelementodominio']]) {
                        $listDomain[$_lev['idtipodominio']][$_lev['idelementodominio']] = array();
                    }
                    $listDomain[$_lev['idtipodominio']][$_lev['idelementodominio']] = array(
                        'idelementodominio' => $_lev['idelementodominio'],
                        'lft'               => $_domType['lft'] ? $_domEl[0][$_domType['lft']] : null,
                        'rgt'               => $_domType['rgt'] ? $_domEl[0][$_domType['rgt']] : null
                    );
                }
                $cofDomain = $listDomain[$_lev['idtipodominio']][$_lev['idelementodominio']];
                if (!$_usserConf['roles']) {
                    $_usserConf['roles'] = array();
                    if (!$_usserConf['roles'][$_lev['idrolanalista']]) {
                        $_usserConf['roles'][$_lev['idrolanalista']] = array(
                            'idrol'     => $_lev['idrolanalista'],
                            'idusuario' => $_lev['idusuario']
                        );
                        //DOMINIOS
                        if (!$_usserConf['roles'][$_lev['idrolanalista']]['dominios']) {
                            $_usserConf['roles'][$_lev['idrolanalista']]['dominios'] = array();
                            if (!$_usserConf['roles'][$_lev['idrolanalista']]['dominios'][$_lev['idtipodominio']]) {
                                $_usserConf['roles'][$_lev['idrolanalista']]['dominios'][$_lev['idtipodominio']]
                                    = array(
                                    'idtipodominio' => $_lev['idtipodominio']
                                );
                            }
                        }
                        //CRITERIOS
                        if (!$_usserConf['roles'][$_lev['idrolanalista']]['criterios']) {
                            $_usserConf['roles'][$_lev['idrolanalista']]['criterios'] = array();
                            if (!$_usserConf['roles'][$_lev['idrolanalista']]['criterios'][$_lev['idtipocriteriocompartimentacion']]) {
                                $_usserConf['roles'][$_lev['idrolanalista']]['criterios'][$_lev['idtipocriteriocompartimentacion']]
                                    = array(
                                    'idtipocriteriocompartimentacion' => $_lev['idtipocriteriocompartimentacion']
                                );
                                if (!$_usserConf['roles'][$_lev['idrolanalista']]['criterios'][$_lev['idtipocriteriocompartimentacion']][$_lev['idtipodominio']]) {
                                    $_usserConf['roles'][$_lev['idrolanalista']]['criterios'][$_lev['idtipocriteriocompartimentacion']][$_lev['idtipodominio']]
                                        = array(
                                        'idtipodominio' => $_lev['idtipodominio']
                                    );
                                }
                            }
                        }
                    }
                }
                /*
                  $_usserConf['roles'] = array(
                  $_lev['idrolanalista'] => array(
                  'dominios' => array(
                  $_lev['idtipodominio'] => array(
                  $_lev['idelementodominio'] => $cofDomain
                  )
                  ),
                  'criterios' => array(
                  $_lev['idtipocriteriocompartimentacion'] => array(
                  $_lev['idtipodominio'] => $confType
                  )
                  )
                  )
                  );
                 */
                $_usserConf['roles'][$_lev['idrolanalista']]['dominios'][$_lev['idtipodominio']][$_lev['idelementodominio']]
                    = $cofDomain;
                $_usserConf['roles'][$_lev['idrolanalista']]['criterios'][$_lev['idtipocriteriocompartimentacion']][$_lev['idtipodominio']][$_lev['idcriterioinformacion']]
                    = $confType;

                $_ussersIndexId[$_lev['idusuario']] = $_usserConf;
                $_ussersIndexPos[$_usserConf['posiciondominio']] = $_usserConf;
            }
        }
        $ussersConfig = array(
            'indexedById'    => $_ussersIndexId,
            'indexedByIndex' => $_ussersIndexPos
        );
        return $ussersConfig;
    }

    public function saveUssersConfigIntoCache($_ussersConfig)
    {

    }

    public function loadRestrictConfigFromCache()
    {

    }

    public function loadUssersConfigFromCache()
    {

    }

    public function getInfoRestrict(
        $_restrictConfig, $_idrestrictInfo = null, $_configDomain = array('ambito' => null),
        $_configRestrictType = array('clasificacion' => null)
    )
    {
        $infoRestrict = array();
        foreach ($_restrictConfig['source'] as $_source) {
            $_sourceTable = $_source['tablafuentedominio'];
            $_fieldIdSourceTable = $_source['campoidfuente'];
            $querySQL = ZendExt_Query_SQL::create();
            $querySQL->select("source.*")
                ->from("{$_sourceTable} as source");
            if ($_source['lft'] != null && $_source['rgt'] != null) {
                $querySQL->addSelect("domain.{$_source['lft']} as lft,domain.{$_source['rgt']} as rgt")
                    ->innerJoin(
                        "{$_source['tabladominio']} domain ON (domain.{$_source['campoiddominio']} = source.{$_source['campoiddominio']})"
                    );
            }
            if ($_idrestrictInfo != null) {
                $querySQL->where("source.{$_fieldIdSourceTable} = ?", $_idrestrictInfo);
            }
            foreach ($_configDomain as $_uriDomain => $_domain) {
                if ($_domain != null) {
                    $querySQL->addWhere(
                        "source.{$_restrictConfig['domain'][$_uriDomain]['campoiddominio']} = ?", $_domain
                    );
                }
            }
            $infoRestrictTmp = $querySQL->fetchAll();
            if (count($infoRestrictTmp) > 0) {
                $infoRestrict[$_source['uri']] = $infoRestrictTmp;
            } else {
                $_infoArray = array(
                    '_new'           => true,
                    'dominiousuario' => '{{0,0,0,0}}'
                );
                if ($_idrestrictInfo != null) {
                    $_infoArray[$_fieldIdSourceTable] = $_idrestrictInfo;
                }
                foreach ($_configDomain as $_uriDomain => $_domain) {
                    if ($_domain != null) {
                        $_infoArray[$_restrictConfig['domain'][$_uriDomain]['campoiddominio']] = $_domain;
                        $_infoArray[$_restrictConfig['domain'][$_uriDomain]['lft']] = null;
                        $_infoArray[$_restrictConfig['domain'][$_uriDomain]['rgt']] = null;

                        if ($_restrictConfig['domain'][$_uriDomain]['lft']
                            && $_restrictConfig['domain'][$_uriDomain]['rgt']
                        ) {
                            $_domElement = ZendExt_Query_SQL::create()->select('dom.*')
                                ->from("{$_restrictConfig['domain'][$_uriDomain]['tabladominio']} dom")
                                ->where("{$_restrictConfig['domain'][$_uriDomain]['campoiddominio']} = ?", $_domain)
                                ->fetchAll();
                            $_infoArray[$_restrictConfig['domain'][$_uriDomain]['lft']]
                                = $_domElement[0][$_restrictConfig['domain'][$_uriDomain]['lft']];
                            $_infoArray[$_restrictConfig['domain'][$_uriDomain]['rgt']]
                                = $_domElement[0][$_restrictConfig['domain'][$_uriDomain]['rgt']];
                        }
                    }
                }
                foreach ($_configRestrictType as $_uriRestrictType => $_restrict) {
                    if ($_restrict != null) {
                        foreach ($_restrictConfig['type'] as $_restrictConf) {
                            if ($_restrictConf['uri'] == $_uriRestrictType) {
                                $_infoArray[$_restrictConf['campoidtipocomp']] = $_restrict;
                            }
                        }
                    }
                }
                $infoRestrict[$_source['uri']] = array(
                    $_infoArray
                );
            }
        }
        return $infoRestrict;
    }

    public function removeInfoRestrict(
        $_restrictConfig, $_infoObject, $_usserRestrict, $_configDomain = array('ambito' => null)
    )
    {
        $_config = array();
        foreach ($_restrictConfig['source'] as $_sourceConfig) {
            $_config[$_sourceConfig['uri']] = array(
                'fieldId'       => $_sourceConfig['campoidfuente'],
                'tableName'     => $_sourceConfig['tablafuentedominio'],
                'fieldIdDomain' => $_sourceConfig['campoiddominio']
            );
        }
        foreach ($_infoObject as $_source => $_contain) {
            $_data = $_contain;
            foreach ($_data as $_infoUpdated) {
                if ($_usserRestrict['idusuario']) {
                    $_where
                        = "WHERE {$_config[$_source]['fieldId']} = '{$_infoUpdated[$_config[$_source]['fieldId']]}'";
                    try {
                        $conn = Zend_Registry::get('conexion');
                        //Obtengo los permisos para el usuario
                        $_whereRestrict = $_where . " AND idusuario = {$_usserRestrict['idusuario']}";
                        $_sqlUsserDelete = "DELETE FROM {$_config[$_source]['tableName']}_usuario {$_whereRestrict}";
                        //Verifico si el usuario existe
                        $_result = $conn->execute($_sqlUsserDelete);
                    } catch (Exception $_e) {
                        print_r($_e);
                        return false;
                    }
                }
                if ($_configDomain) {
                    foreach ($_configDomain as $_uriDomain => $_domainConfig) {
                        try {
                            if ($_domainConfig != null) {
                                $conn = Zend_Registry::get('conexion');
                                //Obtengo los permisos para el usuario
                                $_whereRestrict
                                    = "WHERE {$_config[$_source]['fieldId']} = '{$_infoUpdated[$_config[$_source]['fieldId']]}' AND {$_config[$_source]['fieldIdDomain']} = '{$_domainConfig}'";
                                $_sqlRestrictDelete = "DELETE FROM {$_config[$_source]['tableName']} {$_whereRestrict}";
                                //Verifico si el usuario existe
                                $_result = $conn->execute($_sqlRestrictDelete);
                            }
                        } catch (Exception $_e) {
                            print_r($_e);
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    public function addRestrict(
        $_uriSource, $_configDomain = array('ambito' => null), $_configRestrictType = array('clasificacion' => null),
        $_idrestrictInfo = null, $_usserRestrict = null, $_reloadConfig = false
    )
    {
        if ($_reloadConfig) {
            $_restrictConfig = $this->_getRestrictConfig($_uriSource, $_configRestrictType, $_configDomain);
            $this->saveRestrictConfigIntoCache($_restrictConfig);

            $_ussersConfig = $this->loadUssersConfig($_restrictConfig, $_configDomain);
            $this->saveUssersConfigIntoCache($_ussersConfig);
        } else {
            $_restrictConfig = $this->loadRestrictConfigFromCache($_uriSource, $_configRestrictType, $_configDomain);
            if (!$_restrictConfig) {
                $_restrictConfig = $this->_getRestrictConfig($_uriSource, $_configRestrictType, $_configDomain);
                $this->saveRestrictConfigIntoCache($_restrictConfig);
            }
            $_ussersConfig = $this->loadUssersConfigFromCache($_restrictConfig, $_configDomain);
            if (!$_ussersConfig) {
                $_ussersConfig = $this->loadUssersConfig($_restrictConfig, $_configDomain);
                $this->saveUssersConfigIntoCache($_ussersConfig);
            }
        }
        $_infoObject = $this->getInfoRestrict($_restrictConfig, $_idrestrictInfo, $_configDomain, $_configRestrictType);
        if (count($_infoObject) > 0) {
            $this->updateInfoRestrict(
                $_restrictConfig, $_ussersConfig, $_infoObject, $_configDomain, $_configRestrictType, $_usserRestrict
            );
        }
    }

    public function updateInfoRestrict(
        $_restrictConfig, $_ussersConfig, $_infoRestrict, $_configDomain, $_configRestrictType,
        $_usserRectrictOpt = null
    )
    {
        $_sourceIndexed = array();
        $_listInfoUpdated = array();
        foreach ($_restrictConfig['source'] as $_sourceConfig) {
            $_sourceIndexed[$_sourceConfig['uri']] = $_sourceConfig;
            $_listInfoUpdated[$_sourceConfig['uri']] = array(
                'config' => array(
                    'fieldId'       => $_sourceConfig['campoidfuente'],
                    'tableName'     => $_sourceConfig['tablafuentedominio'],
                    'fieldIdDomain' => $_sourceConfig['campoiddominio']
                ),
                'data'   => array()
            );
        }
        foreach ($_infoRestrict as $_source => $_infoList) {
            foreach ($_infoList as $_info) {
                $_infoObject = new stdClass();
                foreach ($_configDomain as $_uriDomain => $_idElementDomain) {
                    $_domainConfig = $_restrictConfig['domain'][$_uriDomain];
                    $_idDomain = $_sourceIndexed[$_source]['campoiddominio'];
                    $_idTypeRestrict = $_sourceIndexed[$_source]['type'][0]['campoidtipocomp'];
                    $_idInfoSource = $_sourceIndexed[$_source]['campoidfuente'];
                    $_lftIndex = $_sourceIndexed[$_source]['lft'];
                    $_rgtIndex = $_sourceIndexed[$_source]['rgt'];

                    $_domainValue = $_info[$_idDomain];
                    $_restrictValue = $_info[$_idTypeRestrict];
                    $_infoIdValue = $_info[$_idInfoSource];
                    if ($_idElementDomain != null) {
                        $_domainValue = $_idElementDomain;
                    }
                    foreach ($_configRestrictType as $_uriTypeRestrict => $_restrict) {
                        if ($_restrict != null) {
                            $_restrictValue = $_restrict;
                        }
                    }
                    $_infoObject->{$_idInfoSource} = $_info[$_idInfoSource];
                    $_infoObject->{$_idTypeRestrict} = $_restrictValue;
                    $_infoObject->{$_idDomain} = $_domainValue;
                    $_infoObject->_new = $_info['_new'] ? true : false;
                    $_config = array(
                        'domain' => array(
                            'fieldId'     => $_restrictConfig['domain'][$_uriDomain]['campoiddominio'],
                            'tableName'   => $_restrictConfig['domain'][$_uriDomain]['tabladominio'],
                            'domainType'  => $_restrictConfig['domain'][$_uriDomain]['idtipodominio'],
                            'domainValue' => $_idElementDomain,
                            'lftField'    => $_restrictConfig['domain'][$_uriDomain]['lft'],
                            'rgtField'    => $_restrictConfig['domain'][$_uriDomain]['rgt']
                        ),
                        'source' => array(
                            'fieldId'       => $_idInfoSource,
                            'tableName'     => $_sourceIndexed[$_source]['tablafuentedominio'],
                            'fieldIdDomain' => $_sourceIndexed[$_source]['campoiddominio']
                        ),
                        'type'   => array(
                            'fieldId'       => $_idTypeRestrict,
                            'tableName'     => $_sourceIndexed[$_source]['type'][0]['tablatipocomp'],
                            'restrictValue' => $_restrictValue,
                            'restrictType'  => $_sourceIndexed[$_source]['type'][0]['idtipocriteriocomp']
                        )
                    );
                    $_infoObject->dominiousuario
                        = "{{" . implode('},{', $this->createVector($_config, $_ussersConfig, $_info)) . "}}";

                    $_listInfoUpdated[$_source]['data'][] = $_infoObject;
                }
            }
        }
        if ($_usserRectrictOpt) {
            $_listInfoUpdated['usser'] = $_usserRectrictOpt;
        }
        return $this->saveListInfoUpdate($_listInfoUpdated);
    }

    public function createVector($_config, $_ussersConf, $_info)
    {
        $_vector = $_info['dominiousuario'];
        $_vector = str_replace('{{', '', $_vector);
        $_vector = str_replace('}}', '', $_vector);
        $_vector = explode('},{', $_vector);
        foreach ($_ussersConf['indexedById'] as $_idUsser => $_usserConfig) {

            if (!$_vector[$_usserConfig['posiciondominio']]) {
                $_vector = $this->createUsserIndex($_vector, $_usserConfig['posiciondominio']);
            }
            $_vUsser = explode(',', $_vector[$_usserConfig['posiciondominio']]);
            //Busco el id del dominio en la configuracion
            $_lftValueInfo = $_info[$_config['domain']['lftField']];
            $_rgtValueInfo = $_info[$_config['domain']['rgtField']];
            if ($_lftValueInfo != null && $_rgtValueInfo != null) {
                $_domainObject = null;
                $_roleObject = null;
                if ($_usserConfig['roles']) {
                    foreach ($_usserConfig['roles'] as $_roleId => $_roleConfig) {
                        if ($_roleConfig['dominios'][$_config['domain']['domainType']]) {
                            $_domainObject = $_roleConfig['dominios'][$_config['domain']['domainType']];
                            /* if ($_config['domain']['domainValue'] != null) {
                              $_domainObject = $_roleConfig['dominios'][$_config['domain']['domainType']][$_config['domain']['domainValue']];
                              } */
                            if ($_roleConfig['criterios'][$_config['type']['restrictType']][$_config['domain']['domainType']]) {
                                $_roleObject
                                    = $_roleConfig['criterios'][$_config['type']['restrictType']][$_config['domain']['domainType']][$_config['type']['restrictValue']];
                            }
                            break;
                        }
                    }
                }
                if (!$_domainObject || !$_roleObject) {
                    $_vUsser = array(0, 0, 0, 0);
                } else {
                    //Creo el vector de posicion de la informacion
                    $_position = array(
                        'on'   => false,
                        'into' => false,
                        'out'  => false
                    );
                    if ($_domainObject['idtipodominio'] != null) {
                        //Reviso el comportamiento de la informacion para todos los dominios de ese usuario (en caso de no conocer el dominio especifico)
                        foreach ($_domainObject as $_id => $_domValues) {
                            if ($_id != 'idtipodominio') {
                                if ($_domValues[$_config['domain']['lftField']] != null
                                    && $_domValues[$_config['domain']['rgtField']] != null
                                ) {
                                    if ($_lftValueInfo > $_domValues[$_config['domain']['lftField']]
                                        && $_rgtValueInfo < $_domValues[$_config['domain']['rgtField']]
                                    ) {
                                        $_position['into'] = true;
                                    } else {
                                        if ($_lftValueInfo == $_domValues[$_config['domain']['lftField']]
                                            && $_rgtValueInfo == $_domValues[$_config['domain']['rgtField']]
                                        ) {
                                            $_position['on'] = true;
                                        } else {
                                            $_position['out'] = true;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        //Reviso el comportamineto de la informacion para el dominio especifico del usuario
                        if ($_domainObject[$_config['domain']['lftField']] != null
                            && $_domainObject[$_config['domain']['rgtField']] != null
                        ) {
                            if ($_lftValueInfo > $_domainObject[$_config['domain']['lftField']]
                                && $_rgtValueInfo < $_domainObject[$_config['domain']['rgtField']]
                            ) {
                                $_position['into'] = true;
                            } else {
                                if ($_lftValueInfo == $_domainObject[$_config['domain']['lftField']]
                                    && $_rgtValueInfo == $_domainObject[$_config['domain']['rgtField']]
                                ) {
                                    $_position['on'] = true;
                                } else {
                                    $_position['out'] = true;
                                }
                            }
                        }
                    }
                    if ($_position['on']) { //En caso de que la informacion este ubicada en el dominio del usuario
                        $_inRestriction = str_replace('{', '', $_roleObject['en']);
                        $_inRestriction = str_replace('}', '', $_inRestriction);
                        $_inRestriction = explode(',', $_inRestriction);
                        $_vUsser = $this->joinRestrictions($_vUsser, $_inRestriction);
                    }
                    if ($_position['into']) { //En caso de que la informacion este ubicada dentro del dominio del usuario
                        $_intoRestriction = str_replace('{', '', $_roleObject['dentro']);
                        $_intoRestriction = str_replace('}', '', $_intoRestriction);
                        $_intoRestriction = explode(',', $_intoRestriction);
                        $_vUsser = $this->joinRestrictions($_vUsser, $_intoRestriction);
                    }
                    if ($_position['out']) { //En caso de que la informacion este ubicada fuera del dominio del usuario
                        $_outRestriction = str_replace('{', '', $_roleObject['fuera']);
                        $_outRestriction = str_replace('}', '', $_outRestriction);
                        $_outRestriction = explode(',', $_outRestriction);
                        $_vUsser = $this->joinRestrictions($_vUsser, $_outRestriction);
                    }
                }
            }
            //Coloco el vector dentro del arreglo de vectores
            $_vector[$_usserConfig['posiciondominio'] - 1] = implode(',', $_vUsser);
        }
        return $_vector;
    }

    public function createUsserIndex($_vector, $_usserIndex)
    {
        if (!$_vector[$_usserIndex]) {
            for ($i = count($_vector); $i <= $_usserIndex; $i++) {
                if (!$_vector[$i]) {
                    $_vector[$i] = '0,0,0,0';
                }
            }
        }
        $_vector[$_usserIndex] = '0,0,0,0';
        return $_vector;
    }

    public function joinRestrictions($_oldRestriction, $_newRestriction)
    {
        $_restriction = $_oldRestriction;
        foreach ($_restriction as $i => $v) {
            $_restriction[$i] = $_newRestriction[$i] == 1 ? $_newRestriction[$i] : $_oldRestriction[$i];
        }
        return $_restriction;
    }

    public function saveListInfoUpdate($_listInfoUpdated)
    {
        foreach ($_listInfoUpdated as $_source => $_contain) {
            $_config = $_contain['config'];
            $_data = $_contain['data'];
            if ($_data) {
                foreach ($_data as $_infoUpdated) {
                    $_where
                        = "WHERE {$_config['fieldId']} = '{$_infoUpdated->{$_config['fieldId']}}' AND {$_config['fieldIdDomain']} = '{$_infoUpdated->{$_config['fieldIdDomain']}}'";

                    $_sqlUpdate = "UPDATE {$_config['tableName']} SET ";

                    $_sqlInsert = "INSERT INTO {$_config['tableName']} (<keys>) VALUES (<values>)";


                    $_insertKeys = "";
                    $_insertValues = "";
                    if ($_infoUpdated) {
                        foreach ($_infoUpdated as $_field => $_value) {
                            if ($_field != '_new') {
                                $_sqlUpdate .= " {$_field} = '{$_value}',";

                                $_insertKeys .= "{$_field},";
                                $_insertValues .= "'{$_value}',";
                            }
                        }
                    }
                    $_sqlUpdate .= ") {$_where}";
                    $_sqlUpdate = str_replace(",)", "", $_sqlUpdate);

                    $_sqlInsert = str_replace('<keys>', $_insertKeys, $_sqlInsert);
                    $_sqlInsert = str_replace('<values>', $_insertValues, $_sqlInsert);
                    $_sqlInsert = str_replace(",)", ")", $_sqlInsert);

                    try {
                        $conn = Zend_Registry::get('conexion');
                        if (!$_infoUpdated->_new) {
                            $_result = $conn->execute($_sqlUpdate);
                        } else {
                            $_result = $conn->execute($_sqlInsert);
                        }
                        if ($_listInfoUpdated['usser']) {
                            //Obtengo los permisos para el usuario
                            $_permisos = is_array($_listInfoUpdated['usser']['permisos']) ?
                                '{' . implode(',', $_listInfoUpdated['usser']['permisos']) . '}' : '{0,0,0,0}';
                            $_whereRestrict = $_where . "AND idusuario = {$_listInfoUpdated['usser']['idusuario']}";
                            $_sqlUsserUpdate
                                = "UPDATE {$_config['tableName']}_usuario SET permisos = '{$_permisos}' {$_whereRestrict}";
                            $_sqlUsserInsert
                                = "INSERT INTO {$_config['tableName']}_usuario ({$_config['fieldId']},{$_config['fieldIdDomain']},idusuario,permisos) VALUES ('{$_infoUpdated->{$_config['fieldId']}}','{$_infoUpdated->{$_config['fieldIdDomain']}}','{$_listInfoUpdated['usser']['idusuario']}','{$_permisos}')";
                            $_sqlUsserExist = "SELECT * FROM {$_config['tableName']}_usuario {$_whereRestrict}";
                            //Verifico si el usuario existe
                            $_existUsser = $conn->fetchAll($_sqlUsserExist);
                            if ($_existUsser[0]['idusuario'] != null) {
                                $_result = $conn->execute($_sqlUsserUpdate);
                            } else {
                                $_result = $conn->execute($_sqlUsserInsert);
                            }
                        }
                    } catch (Exception $_e) {
                        print_r($_e);
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public function findElementsRestricted($_restrictConfig, $_ussersConfig, $_idelements = null)
    {

    }

}