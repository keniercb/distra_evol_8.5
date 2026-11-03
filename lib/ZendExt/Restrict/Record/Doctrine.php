<?php

/**
 * Clase utilizada para compartimentar informacion de un modelo de dominio.
 *
 * @author     Yoandry Morejon Borbon
 * @package    ZendExt
 * @subpackage Restrict
 * @category   Framework.
 * @uses       Doctrine_Record, ZendExt_Query_SQL.
 * @copyright  UCID
 * @version    1.0-0
 */
class ZendExt_Restrict_Record_Doctrine extends Doctrine_Record
{

    /**
     * Agregando una compartimentacion al modelo de dominio.
     *
     * @param string         $_aliasRestrict   - Alias de la configuracion de la compartimentacion.
     * @param string         $_infSourceUri    - Identificacion unica de la fuente de informacion a compartimentar.
     * @param string | array $_domainUri       - Identificacion unica del o de los dominios de compartimentacion.
     * @param string         $_restrictTypeUri - Identificacion unica del tipo de criterio de compartimentacion.
     */
    public function hasRestrict(
        $_aliasRestrict, $_infSourceUri, $_domainUri, $_restrictTypeUri = 'clasisificacioninformacion'
    )
    {
        if (!is_array($_domainUri)) {
            $_domainUri = array($_domainUri);
        }

        //Obteniendo la configuracion de la compartimentacion
        $restrictConfig = $this->_getRestrictConfig($_infSourceUri, $_domainUri, $_restrictTypeUri);
        if (!is_array($restrictConfig) || count($restrictConfig) == 0) {
            throw new ZendExt_Exception('ZERRD001');
        }

        //Obteniendo los modelos de dominio de la configuracion de la compartimentacion.
        $restrictConfig['tablafuenteinf'] = $this->getTable()->getComponentName();
        $restrictConfig['campoidfuente'] = $this->getTable()->getIdentifier();
        $registry = Zend_Registry::getInstance();
        if (!isset($registry->restrict)) {
            $registry->restrict = array();
        }
        $registry->restrict[$_aliasRestrict]['standardconfig'] = $restrictConfig;
        $restrictConfig['tablafuentedominio']
            = 'ZendExt_Restrict_Domain_' . $this->_transformTableSchemaNameToDoctrineRecord(
                $restrictConfig['tablafuentedominio']
            );

        //Agregando la relacion con la tabla donde se compartimenta la informacion del dominio.
        foreach ($restrictConfig['tabladominio'] as $key => $tabladominio) {
            $restrictConfig['tabladominio'][$key]
                = 'ZendExt_Restrict_Domain_' . $this->_transformTableSchemaNameToDoctrineRecord($tabladominio);
            $this->hasOne(
                $restrictConfig['tabladominio'][$key],
                array('local' => $restrictConfig['campoidfuente'], 'foreign' => $restrictConfig['campoiddominio'][$key])
            );
        }
        $this->hasOne(
            $restrictConfig['tablafuentedominio'],
            array('local' => $restrictConfig['campoidfuente'], 'foreign' => $restrictConfig['campoidfuente'])
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatRolusuariodominio',
            array('local' => $restrictConfig['campoidfuente'], 'foreign' => 'idtipodominio')
        );
        $registry->restrict[$_aliasRestrict]['doctrineconfig'] = $restrictConfig;
    }

    /**
     * Compartimentando la informacion (Agregando...)
     *
     * @param string          $_aliasRestrict    - Alias de la restriccion o compartimentacion creada en el modelo.
     * @param numeric | array $_idDomain         - Identificador(es) del o de los dominios de compartimentacion (Si es un arreglo debe ser asociativo y como dimensiones deben estar las uri de las tablas dominio).
     * @param numeric         $_idUser           - Identificador del usuario.
     * @param array           $_arrayPermissions - Listado de permisos.
     */
    public function addRestrict($_aliasRestrict, $_idDomain, $_idUser, $_arrayPermissions)
    {
        //Obteniendo una instancia del resgistro.
        $registry = Zend_Registry::getInstance();

        //Obteniendo la configuracion de la compartimentacion
        $restrictConfig = $registry->restrict[$_aliasRestrict]['doctrineconfig'];
        if (!is_array($restrictConfig) || count($restrictConfig) == 0) {
            throw new ZendExt_Exception('ZERRD001');
        }

        //Obteniendo o creando una instancia del modelo de dominio a compartimentar.
        $filter = array();
        $filter[] = $this->{$restrictConfig['campoidfuente']};
        $textFilter = '';
        if (is_array($_idDomain)) {
            foreach ($_idDomain as $uri => $idDom) {
                $textFilter .= " AND {$restrictConfig['campoiddominio'][$uri]} = ?";
                $filter[] = $idDom;
            }
        } else {
            $textFilter = " AND {$restrictConfig['campoiddominio']} = ?";
            $filter[] = $_idDomain;
        }
        $objInfRestrict = Doctrine::getTable($restrictConfig['tablafuentedominio'])->findByDql(
            "{$restrictConfig['campoidfuente']} = ? {$textFilter}", $filter
        );
        if ($objInfRestrict->count()) {
            $objInfRestrict = $objInfRestrict[0];
        } else {
            $objInfRestrict = new $restrictConfig['tablafuentedominio']();
            $objInfRestrict->{$restrictConfig['campoidfuente']} = $this->{$restrictConfig['campoidfuente']};
            if (!is_array($_idDomain)) {
                $objInfRestrict->{$restrictConfig['campoiddominio']} = $_idDomain;
            } else {
                foreach ($_idDomain as $uri => $idDom) {
                    $objInfRestrict->{$restrictConfig['campoiddominio'][$uri]} = $idDom;
                }
            }
            //$objInfRestrictUsuario->idusuario = 
        }

        //Obteniendo la posicion que ocupa el usuario en el arreglo de bit.
        $userPosition = null;
        if (isset($registry->arrayUsersPositions)) {
            foreach ($registry->arrayUsersPositions as $regUserPosition) {
                if ($regUserPosition['idusuario'] == $_idUser) {
                    $userPosition = $regUserPosition;
                    break;
                }
            }
        }
        if (is_null($userPosition)) {
            //Obteniendo la posicion que ocupa el usuario en el arreglo de bit.
            $userPosition = Doctrine_Query::create()->select("posiciondominio")
                ->from('ZendExt_Restrict_Domain_SegUsuario')
                ->where('idusuario = ?', $_idUser)
                ->fetchOne()
                ->toArray();
            if (!isset($registry->arrayUsersPositions)) {
                $registry->arrayUsersPositions = array();
            }
            $registry->arrayUsersPositions = array_unique(
                array_merge($registry->arrayUsersPositions, array($userPosition))
            );
        }

        //Conformando el arreglo de usuarios y permisos por la posicion que le corresponde en el arreglo de bit.
        $arrayUsersPositionUpdate = array();
        if ($objInfRestrict->dominiousuario) {
            $arrayUsersPositionUpdate = explode(
                '},{', str_replace('}}', '', str_replace('{{', '', $objInfRestrict->dominiousuario))
            );
        }
        $maxDomain = count($arrayUsersPositionUpdate);
        if ($userPosition['posiciondominio'] > $maxDomain + 1) {
            for ($i = $maxDomain; $i < $userPosition['posiciondominio']; $i++) {
                $arrayUsersPositionUpdate[$i] = '0,0,0,0';
            }
        }
        $ins = ($_arrayPermissions[0]) ? $_arrayPermissions[0] : 0;
        $upd = ($_arrayPermissions[1]) ? $_arrayPermissions[1] : 0;
        $del = ($_arrayPermissions[2]) ? $_arrayPermissions[2] : 0;
        $sel = ($_arrayPermissions[3]) ? $_arrayPermissions[3] : 0;
        $arrayUsersPositionUpdate[$userPosition['posiciondominio'] - 1] = "$ins,$upd,$del,$sel";

        //Actualizando el vector de dominios de la informacion (compartimentando informacion).
        $objInfRestrict->dominiousuario = '{{' . implode('},{', $arrayUsersPositionUpdate) . '}}';
        $objInfRestrict->save();

        $restrictTablafuentedominioUsuario = $restrictConfig['tablafuentedominio'] . 'Usuario';
        $filter[] = $_idUser;
        $objInfRestrictUsuario = Doctrine::getTable($restrictTablafuentedominioUsuario)->findByDql(
            "{$restrictConfig['campoidfuente']} = ? {$textFilter} AND idusuario = ?", $filter
        );
        if ($objInfRestrictUsuario->count()) {
            $objInfRestrictUsuario = $objInfRestrictUsuario[0];
        } else {
            $objInfRestrictUsuario = new $restrictTablafuentedominioUsuario();
            $objInfRestrictUsuario->{$restrictConfig['campoidfuente']} = $this->{$restrictConfig['campoidfuente']};
            if (!is_array($_idDomain)) {
                $objInfRestrictUsuario->{$restrictConfig['campoiddominio']} = $_idDomain;
            } else {
                foreach ($_idDomain as $uri => $idDom) {
                    $objInfRestrictUsuario->{$restrictConfig['campoiddominio'][$uri]} = $idDom;
                }
            }
            $objInfRestrictUsuario->idusuario = $_idUser;
        }
        $objInfRestrictUsuario->permisos = '{' . "$ins,$upd,$del,$sel" . '}';
        $objInfRestrictUsuario->save();
    }

    /**
     * Compartimentando la informacion (Borrando)
     *
     * @param string          $_aliasRestrict - Alias de la restriccion o compartimentacion creada en el modelo.
     * @param numeric         $_idUser        - Identificador del usuario.
     * @param numeric | array $_idDomain      - Identificador(es) del o de los dominios de compartimentacion (Si es un arreglo debe ser asociativo y como dimensiones deben estar las uri de las tablas dominio).
     */
    public function deleteRestrict($_aliasRestrict, $_idUser, $_idDomain = null)
    {
        //Obteniendo una instancia del resgistro.
        $registry = Zend_Registry::getInstance();

        //Obteniendo la configuracion de la compartimentacion
        $restrictConfig = $registry->restrict[$_aliasRestrict]['doctrineconfig'];
        if (!is_array($restrictConfig) || count($restrictConfig) == 0) {
            throw new ZendExt_Exception('ZERRD001');
        }

        //Obteniendo las instanciaa del modelo de dominio a compartimentar.
        $filter = array();
        $filter[] = $this->{$restrictConfig['campoidfuente']};
        $textFilter = '';
        if (is_array($_idDomain)) {
            foreach ($_idDomain as $uri => $idDom) {
                $textFilter .= " AND {$restrictConfig['campoiddominio'][$uri]} = ?";
                $filter[] = $idDom;
            }
        } elseif (!is_null($_idDomain)) {
            $textFilter = " AND {$restrictConfig['campoiddominio']} = ?";
            $filter[] = $_idDomain;
        }
        $listInfRestrictObj = Doctrine::getTable($restrictConfig['tablafuentedominio'])->findByDql(
            "{$restrictConfig['campoidfuente']} = ? {$textFilter}", $filter
        );
        if ($listInfRestrictObj->count()) {
            //Obteniendo la posicion que ocupa el usuario en el arreglo de bit.
            $userPosition = null;
            if ($registry->arrayUsersPositions) {
                foreach ($registry->arrayUsersPositions as $regUserPosition) {
                    if ($regUserPosition['idusuario'] == $_idUser) {
                        $userPosition = $regUserPosition;
                        break;
                    }
                }
            }
            if (is_null($userPosition)) {
                //Obteniendo la posicion que ocupa el usuario en el arreglo de bit.
                $userPosition = Doctrine_Query::create()->select("posiciondominio")->from(
                    'ZendExt_Restrict_Domain_SegUsuario'
                )->where('idusuario = ?', $_idUser)->fetchOne();
                if (!is_array($registry->arrayUsersPositions)) {
                    $registry->arrayUsersPositions = array();
                }
                $registry->arrayUsersPositions = array_unique(
                    array_merge($registry->arrayUsersPositions, array($userPosition))
                );
            }
            foreach ($listInfRestrictObj as $objInfRestrict) {
                //Conformando el arreglo de usuarios y permisos por la posicion que le corresponde en el arreglo de bit.
                $arrayUsersPositionDelete = array();
                if ($objInfRestrict->dominiousuario) {
                    $arrayUsersPositionDelete = explode(
                        '},{', str_replace('}}', '', str_replace('{{', '', $objInfRestrict->dominiousuario))
                    );
                }
                $arrayUsersPositionDelete[$userPosition['posiciondominio'] - 1] = "0,0,0,0";

                //Actualizando el vector de dominios de la informacion (compartimentando informacion).
                $objInfRestrict->dominiousuario = '{{' . implode('},{', $arrayUsersPositionDelete) . '}}';
                $objInfRestrict->save();
            }
        }

        $restrictTablafuentedominioUsuario = $restrictConfig['tablafuentedominio'] . 'Usuario';
        $filter[] = $_idUser;
        $listInfRestrictUsuarioObj = Doctrine::getTable($restrictTablafuentedominioUsuario)->findByDql(
            "{$restrictConfig['campoidfuente']} = ? {$textFilter} AND idusuario = ?", $filter
        );
        if ($listInfRestrictUsuarioObj->count()) {
            foreach ($listInfRestrictUsuarioObj as $objInfRestrictUsuario) {
                $objInfRestrictUsuario->delete();
            }
        }
    }

    /**
     * Obteniendo la configuracion de la compartimentacion.
     *
     * @param string         $_infSourceUri    - Identificacion unica de la fuente de informacion a compartimentar.
     * @param string | array $_domainUri       - Identificacion unica del o de los dominios de compartimentacion.
     * @param string         $_restrictTypeUri - Identificacion unica del tipo de criterio de compartimentacion.
     *
     * @return array - Configuracion de la compartimentacion.
     */
    protected function _getRestrictConfig($_infSourceUri, $_domainUri, $_restrictTypeUri)
    {
        $domainUri = implode("','", $_domainUri);
        $querySQL = ZendExt_Query_SQL::create();
        $objConfComp = $querySQL->select("fdom.fuente as tablafuentedominio")
            ->from("mod_compartimentacion.dat_fuentedominio fdom")
            ->innerJoin(
                "mod_compartimentacion.dat_fuentedato fdatinf ON (fdom.idfuenteinformacion = fdatinf.idfuentedato AND fdatinf.uri = ?)",
                $_infSourceUri
            )
            ->addSelect("fdatdom.fuente as tabladominio, confdom.campo as campoiddominio, fdatdom.uri")
            ->innerJoin(
                "mod_compartimentacion.dat_fuentedato fdatdom ON (fdom.idtipodominio = fdatdom.idfuentedato AND fdatdom.uri IN ('$domainUri'))"
            )
            ->innerJoin(
                "mod_compartimentacion.dat_configfuentedato confdom ON (fdatdom.idfuentedato = confdom.idfuentedato AND confdom.pk = 1)"
            )
            ->orderBy("confdom.idconfigfuentedato", "ASC")
            ->fetchAll();

        $querySQL = ZendExt_Query_SQL::create();
        $objConfCompType = $querySQL->select("fdatcmp.fuente as tablatipocomp, confcmp.campo as campoidtipocomp")->from(
            "mod_compartimentacion.dat_fuentedato fdatcmp"
        )->innerJoin(
            "mod_compartimentacion.dat_configfuentedato confcmp ON (fdatcmp.uri = ? AND fdatcmp.idfuentedato = confcmp.idfuentedato AND confcmp.pk = 1)",
            $_restrictTypeUri
        )->fetchAll();
        $tempObjConfComp = $objConfComp[0];
        foreach ($objConfComp as $elConfComp) {
            if (!is_array($tempObjConfComp['tabladominio'])) {
                $tempObjConfComp['tabladominio'] = array();
                $tempObjConfComp['campoiddominio'] = array();
            }
            $tempObjConfComp['tabladominio'][$elConfComp['uri']] = $elConfComp['tabladominio'];
            $tempObjConfComp['campoiddominio'][$elConfComp['uri']] = $elConfComp['campoiddominio'];
            unset($tempObjConfComp['uri']);
        }
        return array_merge($tempObjConfComp, $objConfCompType[0]);
    }

    /**
     * Transforma el nombre de una entidad de la base de datos (esquema1.tabla1) al estandar de Doctrine.
     *
     * @param string $tableSchemaName - Nombre de una entidad de la base de datos (esquema1.tabla1).
     *
     * @return string - Nombre del mdelo de dominio correspondiente a la tabla.
     */
    protected function _transformTableSchemaNameToDoctrineRecord($tableSchemaName)
    {
        $tableSchemaArray = explode('.', $tableSchemaName);
        $posTable = 0;
        if (count($tableSchemaArray) > 1) {
            $posTable = 1;
        }
        return str_replace(' ', '', ucwords(str_replace('_', ' ', $tableSchemaArray[$posTable])));
    }

    /**
     * Obtener los usuarios con permiso a la informacion.
     *
     * @param array   $_aliasRestrict   - Alias de la restriccion o compartimentacion creada en el modelo de dominio.
     * @param array   $_arrIdUser       - Listado de identifiadores de usuario (opcional, null por defecto).
     * @param boolean $_includeUserAuth - Incluir usuario autenticado (opcional, false por defecto).
     *
     * @return array - Listado de usuarios con sus permisos y elementos del dominio a los que tiene acceso.
     */
    public function getUssers($_aliasRestrict, $_arrIdUser = null, $_includeUserAuth = false)
    {
        //Obteniendo una instancia del resgistro.
        $registry = Zend_Registry::getInstance();

        //Obteniendo la configuracion de la compartimentacion
        $restrictConfig = $registry->restrict[$_aliasRestrict]['standardconfig'];
        $queryUserPermissions = ZendExt_Query_SQL::create()->select(
            "u.idusuario, u.idpersona, fdom.permisos[1] = '1' as insertar, fdom.permisos[2] = '1' as modificar, fdom.permisos[3] = '1' as eliminar, fdom.permisos[4] = '1' as lectura"
        )
            ->from("{$restrictConfig['tablafuentedominio']}_usuario fdom")
            ->orderBy("u.idusuario", "ASC");
        $textSel = '';
        $uriDomain = array();
        foreach ($restrictConfig['campoiddominio'] as $uri => $fieldIdDom) {
            if ($textSel != '') {
                $textSel .= ', ';
            }
            $textSel .= "fdom.{$fieldIdDom} as $uri";
            array_push($uriDomain, $uri);
            $queryUserPermissions->addWhere("fdom.{$fieldIdDom} <> 0");
            $queryUserPermissions->orderBy("fdom.{$fieldIdDom}", "ASC");
        }
        //Obteniendo el identificador del usuario autenticado, para incluirlo o no en el arreglo de permisos
        $idUser = ZendExt_GlobalConcept::getInstance()->Perfil->idusuario;
        //Preprando el filtro de usuarios
        if (is_array($_arrIdUser)) {
            if (!$_includeUserAuth) {
                $arrFilterUser = array_diff($_arrIdUser, array($idUser));
            } else {
                $arrFilterUser = $_arrIdUser;
            }
            $filterUserText = 'u.idusuario IN (' . implode(array_fill(0, count($arrFilterUser), '?'), ',') . ')  AND';
            $filterUser = array_merge($arrFilterUser, array($this->{$restrictConfig['campoidfuente']}));
        } elseif (!$_includeUserAuth) {
            $filterUserText = 'fdom.idusuario <> ?  AND';
            $filterUser = array($idUser, $this->{$restrictConfig['campoidfuente']});
        } else {
            $filterUser = $this->{$restrictConfig['campoidfuente']};
        }
        $usersPermissStm = $queryUserPermissions->addSelect($textSel)
            ->innerJoin("mod_seguridad.seg_usuario u ON (u.idusuario = fdom.idusuario)")
            ->addWhere("$filterUserText fdom.{$restrictConfig['campoidfuente']} = ?", $filterUser)
            ->fetchAll();
        $currentUserPermission = $usersPermissStm;
        //print_r($currentUserPermission);die;
        $arrayUsers = array();
        $idCurrentUser = array();
        $i = 0;
        $arrayIdPersons = array();
        while ($currentUserPermission[$i]) {
            if (!$idCurrentUser[$currentUserPermission[$i]['idusuario']]) {
                $arrayIdPersons[] = $currentUserPermission[$i]['idpersona'];
                $arrayUsers[] = array(
                    'idusuario' => $currentUserPermission[$i]['idusuario'],
                    'idpersona' => $currentUserPermission[$i]['idpersona'],
                    'insertar'  => $currentUserPermission[$i]['insertar'],
                    'modificar' => $currentUserPermission[$i]['modificar'],
                    'eliminar'  => $currentUserPermission[$i]['eliminar'],
                    'lectura'   => $currentUserPermission[$i]['lectura']
                );
                $idCurrentUser[$currentUserPermission[$i]['idusuario']] = true;
                $idCurrentDomain[0] = 0;
                $j[0] = 0;
            }
            $i++;
        }
        $arrayPersons = ZendExt_IoC::getInstance()->pvd->BuscarPersonaPorArreglodeID($arrayIdPersons);
        $arrayUsersTemp = $arrayUsers;
        foreach ($arrayPersons as $person) {
            foreach ($arrayUsersTemp as $key => $user) {
                if ($person['idpersona'] == $user['idpersona']) {
                    $arrayUsers[$key]['nombres'] = $person['nombre'];
                    $arrayUsers[$key]['snombre'] = $person['snombre'];
                    $arrayUsers[$key]['papellido'] = $person['papel'];
                    $arrayUsers[$key]['sapellido'] = $person['sapel'];
                    break;
                }
            }
        }
        //print_r($arrayUsers);die;
        return $arrayUsers;
    }

    /**
     * Obtener los usuarios con permiso a la informacion.
     *
     * @param array   $_aliasRestrict   - Alias de la restriccion o compartimentacion creada en el modelo de dominio.
     * @param array   $_arrIdUser       - Listado de identifiadores de usuario (opcional, null por defecto).
     * @param boolean $_includeUserAuth - Incluir usuario autenticado (opcional, false por defecto).
     *
     * @return array - Listado de usuarios con sus permisos y elementos del dominio a los que tiene acceso.
     */
    public function getUsers($_aliasRestrict, $_arrIdUser = null, $_includeUserAuth = false)
    {
        //Obteniendo una instancia del resgistro.
        $registry = Zend_Registry::getInstance();

        //Obteniendo la configuracion de la compartimentacion
        $restrictConfig = $registry->restrict[$_aliasRestrict]['standardconfig'];
        $queryUserPermissions = ZendExt_Query_SQL::create()->select(
            "u.idusuario, u.idpersona, fdom.dominiousuario[u.posiciondominio][1] = '1' as insertar, fdom.dominiousuario[u.posiciondominio][2] = '1' as modificar, fdom.dominiousuario[u.posiciondominio][3] = '1' as eliminar, fdom.dominiousuario[u.posiciondominio][4] = '1' as lectura"
        )
            ->from("{$restrictConfig['tablafuentedominio']} fdom")
            ->orderBy("u.idusuario", "ASC");
        $textSel = '';
        $uriDomain = array();
        foreach ($restrictConfig['campoiddominio'] as $uri => $fieldIdDom) {
            if ($textSel != '') {
                $textSel .= ', ';
            }
            $textSel .= "fdom.{$fieldIdDom} as $uri";
            array_push($uriDomain, $uri);
            $queryUserPermissions->addWhere("fdom.{$fieldIdDom} <> 0");
            $queryUserPermissions->orderBy("fdom.{$fieldIdDom}", "ASC");
        }
        //Obteniendo el identificador del usuario autenticado, para incluirlo o no en el arreglo de permisos
        $idUser = ZendExt_GlobalConcept::getInstance()->Perfil->idusuario;
        //Preprando el filtro de usuarios
        if (is_array($_arrIdUser)) {
            if (!$_includeUserAuth) {
                $arrFilterUser = array_diff($_arrIdUser, array($idUser));
            } else {
                $arrFilterUser = $_arrIdUser;
            }
            $filterUserText = 'u.idusuario IN (' . implode(array_fill(0, count($arrFilterUser), '?'), ',') . ')  AND';
            $filterUser = array_merge($arrFilterUser, array($this->{$restrictConfig['campoidfuente']}));
        } elseif (!$_includeUserAuth) {
            $filterUserText = 'u.idusuario <> ?  AND';
            $filterUser = array($idUser, $this->{$restrictConfig['campoidfuente']});
        } else {
            $filterUser = $this->{$restrictConfig['campoidfuente']};
        }
        $usersPermissStm = $queryUserPermissions->addSelect($textSel)
            ->innerJoin(
                "mod_seguridad.seg_usuario u ON ($filterUserText fdom.{$restrictConfig['campoidfuente']} = ? AND (fdom.dominiousuario[u.posiciondominio][1] = '1' OR fdom.dominiousuario[u.posiciondominio][2] = '1' OR fdom.dominiousuario[u.posiciondominio][3] = '1' OR fdom.dominiousuario[u.posiciondominio][4] = '1') = true)",
                $filterUser
            )
            ->execute();
        $currentUserPermission = $usersPermissStm->fetch(PDO::FETCH_ASSOC);
        $arrayUsers = array();
        $idCurrentUser = 0;
        $idCurrentDomain = array();
        $j = array();
        $i = 0;
        $temp = null;
        $arrayIdPersons = array();
        while ($currentUserPermission) {
            if ($idCurrentUser != $currentUserPermission['idusuario']) {
                $i++;
                $arrayIdPersons[$i - 1] = $currentUserPermission['idpersona'];
                $arrayUsers[$i - 1]['idusuario'] = $currentUserPermission['idusuario'];
                $arrayUsers[$i - 1]['idpersona'] = $currentUserPermission['idpersona'];
                $arrayUsers[$i - 1]['insertar'] = $currentUserPermission['insertar'];
                $arrayUsers[$i - 1]['modificar'] = $currentUserPermission['modificar'];
                $arrayUsers[$i - 1]['eliminar'] = $currentUserPermission['eliminar'];
                $arrayUsers[$i - 1]['lectura'] = $currentUserPermission['lectura'];
                $idCurrentUser = $currentUserPermission['idusuario'];
                $idCurrentDomain[0] = 0;
                $j[0] = 0;
            }
            $temp = & $arrayUsers[$i - 1];
            $temp1 = & $temp;
            foreach ($uriDomain as $index => $uri) {
                if ($idCurrentDomain[$index] != $currentUserPermission[$uri]) {
                    if ($temp1 == $temp) {
                        $temp[$uri][$j[$index]]['id'] = $currentUserPermission[$uri];
                        $temp1 = & $temp[$uri][$j[$index]];
                    } else {
                        $temp1[$uri][$j[$index]]['id'] = $currentUserPermission[$uri];
                        $temp1 = & $temp1[$uri][$j[$index]];
                    }
                    $j[$index + 1] = 0;
                    $idCurrentDomain[$index + 1] = 0;
                    $j[$index]++;
                } else {
                    if ($temp1 == $temp) {
                        $temp1 = & $temp[$uri][$j[$index] - 1];
                    } else {
                        $temp1 = & $temp1[$uri][$j[$index] - 1];
                    }
                }
                $idCurrentDomain[$index] = $currentUserPermission[$uri];
            }
            $currentUserPermission = $usersPermissStm->fetch(PDO::FETCH_ASSOC);
        }
        $arrayPersons = ZendExt_IoC::getInstance()->pvd->BuscarPersonaPorArreglodeID($arrayIdPersons);
        $arrayUsersTemp = $arrayUsers;
        foreach ($arrayPersons as $person) {
            foreach ($arrayUsersTemp as $key => $user) {
                if ($person['idpersona'] == $user['idpersona']) {
                    $arrayUsers[$key]['nombres'] = $person['nombre'];
                    $arrayUsers[$key]['snombre'] = $person['snombre'];
                    $arrayUsers[$key]['papellido'] = $person['papel'];
                    $arrayUsers[$key]['sapellido'] = $person['sapel'];
                    break;
                }
            }
        }
        return $arrayUsers;
    }

    /**
     * Obtener los dominios de compartimentacion a los que el usuario autenticado tiene permiso.
     *
     * @param string  $_aliasRestrict       - Alias de la restriccion o compartimentacion creada en el modelo de dominio.
     * @param array   $_selectDomainUri     - Listado de identificaciones unicas de los dominios de compartimentacion a buscar.
     * @param array   $_filterDomainIdByUri - Listado de identificadores de dominios de compartimentacion por los que se desea filtrar.
     * @param numeric $_idUser              - Identificador del usuario.
     *
     * @return array - Listado de dominios de compartimentacion a los que el usuario tiene acceso
     */
    public function getDomains(
        $_aliasRestrict, $_selectDomainUri = array(), $_filterDomainIdByUri = array(), $_idUser = null
    )
    {
        //Obteniendo una instancia del resgistro.
        $registry = Zend_Registry::getInstance();

        //Obteniendo la configuracion de la compartimentacion
        $restrictConfig = $registry->restrict[$_aliasRestrict]['standardconfig'];

        //Obteniendo el identificador del usuario
        if (is_null($_idUser)) {
            $idUser = ZendExt_GlobalConcept::getInstance()->Perfil->idusuario;
        } else {
            $idUser = $_idUser;
        }
        $textSel = '';
        $uriDomain = array();
        $queryDomain = ZendExt_Query_SQL::create()->from("{$restrictConfig['tablafuentedominio']} fdom");
        foreach ($restrictConfig['campoiddominio'] as $uri => $fieldIdDom) {
            if (count($_selectDomainUri) == 0 || array_search($uri, $_selectDomainUri) !== false) {
                if ($textSel != '') {
                    $textSel .= ', ';
                }
                $textSel .= "fdom.{$fieldIdDom} as $uri";
                $uriDomain[] = $uri;
                $queryDomain->addWhere("fdom.{$fieldIdDom} <> 0");
                $queryDomain->orderBy("fdom.{$fieldIdDom}", "ASC");
            }
        }
        $queryDomain->select("u.idusuario, {$textSel}")
            ->innerJoin(
                "mod_seguridad.seg_usuario u ON (u.idusuario = ? AND fdom.{$restrictConfig['campoidfuente']} = ? AND (fdom.dominiousuario[u.posiciondominio][1] = '1' OR fdom.dominiousuario[u.posiciondominio][2] = '1' OR fdom.dominiousuario[u.posiciondominio][3] = '1' OR fdom.dominiousuario[u.posiciondominio][4] = '1') = true)",
                array($idUser, $this->{$restrictConfig['campoidfuente']})
            );
        if (count($_filterDomainIdByUri) > 0) {
            foreach ($_filterDomainIdByUri as $uri => $id) {
                $queryDomain->addWhere("fdom.{$restrictConfig['campoiddominio'][$uri]} = ?", $id);
            }
        }
        $domainsStm = $queryDomain->execute();
        $currentUserPermission = $domainsStm->fetch(PDO::FETCH_ASSOC);
        $arrayUsers = array();
        $idCurrentUser = 0;
        $idCurrentDomain = array();
        $j = array();
        $i = 0;
        $temp = null;
        while ($currentUserPermission) {
            if ($idCurrentUser != $currentUserPermission['idusuario']) {
                $i++;
                $idCurrentUser = $currentUserPermission['idusuario'];
                $idCurrentDomain[0] = 0;
                $j[0] = 0;
            }
            $temp = & $arrayUsers;
            $temp1 = & $temp;
            foreach ($uriDomain as $index => $uri) {
                if ($idCurrentDomain[$index] != $currentUserPermission[$uri]) {
                    if ($temp1 == $temp) {
                        $temp[$uri][$j[$index]]['id'] = $currentUserPermission[$uri];
                        $temp1 = & $temp[$uri][$j[$index]];
                    } else {
                        $temp1[$uri][$j[$index]]['id'] = $currentUserPermission[$uri];
                        $temp1 = & $temp1[$uri][$j[$index]];
                    }
                    $j[$index + 1] = 0;
                    $idCurrentDomain[$index + 1] = 0;
                    $j[$index]++;
                } else {
                    if ($temp1 == $temp) {
                        $temp1 = & $temp[$uri][$j[$index] - 1];
                    } else {
                        $temp1 = & $temp1[$uri][$j[$index] - 1];
                    }
                }
                $idCurrentDomain[$index] = $currentUserPermission[$uri];
            }
            $currentUserPermission = $domainsStm->fetch(PDO::FETCH_ASSOC);
        }
        return $arrayUsers;
    }

    /**
     * Obtener el listado de permisos del usuario autenticado.
     *
     * @param type $_aliasRestrict - Alias de la restriccion o compartimentacion creada en el modelo de dominio.
     * @param type $_idUser        - Identificador del usuario (opcional).
     *
     * @return array - Listado de permisos del usuario autenticado en la informacion.
     */
    public function getPermissions($_aliasRestrict, $_idUser = null)
    {
        //Obteniendo una instancia del resgistro.
        $registry = Zend_Registry::getInstance();

        //Obteniendo la configuracion de la compartimentacion
        $restrictConfig = $registry->restrict[$_aliasRestrict]['standardconfig'];

        //Obteniendo el identificador del usuario
        if (is_null($_idUser)) {
            $_idUser = ZendExt_GlobalConcept::getInstance()->Perfil->idusuario;
        }
        $permissionsStm = ZendExt_Query_SQL::create()->select(
            "fdom.dominiousuario[u.posiciondominio][1] = '1' as insertar, fdom.dominiousuario[u.posiciondominio][2] = '1' as actualizar, fdom.dominiousuario[u.posiciondominio][3] = '1' as eliminar, fdom.dominiousuario[u.posiciondominio][4] = '1' as lectura"
        )->from("{$restrictConfig['tablafuentedominio']} fdom")->innerJoin(
            "mod_seguridad.seg_usuario u ON (u.idusuario = ? AND fdom.{$restrictConfig['campoidfuente']} = ? AND (fdom.dominiousuario[u.posiciondominio][1] = '1' OR fdom.dominiousuario[u.posiciondominio][2] = '1' OR fdom.dominiousuario[u.posiciondominio][3] = '1' OR fdom.dominiousuario[u.posiciondominio][4] = '1') = true)",
            array($_idUser, $this->{$restrictConfig['campoidfuente']})
        )->execute();
        return $permissionsStm->fetch(PDO::FETCH_ASSOC);
    }

    /*
     * Desarrollado por Ponce
     * Metodo que dado el id modelo y un tipo de objeto (fte,ub) se elimina de la compartimentacion del modelo
     */

    public function deleteFteUbMod($p)
    {
        $con = Doctrine_Manager::getInstance()->getCurrentConnection();

        $where = ' idmodelo = ? ';
        $cond[] = $p['idmodelo'];
        if ($p['idfuenteinformacion']) {
            $where .= ' AND idactor = ? ';
            $cond[] = $p['idfuenteinformacion'];
        }
        if ($p['idubicacion']) {
            $where .= ' AND idubicacion = ? ';
            $cond[] = $p['idubicacion'];
        }
        if ($p['idusuario']) {
            $where .= ' AND idusuario = ? ';
            $cond[] = $p['idusuario'];
            $tbla = 'dat_compartimentacion_modelo_usuario';
        } else {
            $tbla = 'dat_compartimentacion_modelo';
        }
        $sql = "DELETE FROM mod_compartimentacion.{$tbla} WHERE " . $where . ';';
        //print_r($cond);
        //die($sql);
        $res = $con->execute($sql, $cond)->fetchAll(PDO::FETCH_ASSOC);
        return 1;
    }

}
