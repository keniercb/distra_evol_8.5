<?php

/**
 * Clase utilizada para compartimentar informacion, agregando a una consulta de tipo ZendExt_Query_SQL los filtros correspondientes.
 *
 * @author     Yoandry Morejon Borbon
 * @package    ZendExt
 * @subpackage Query
 * @category   Framework.
 * @uses       ZendExt_Restrict_Query_Config, ZendExt_Restict_Query_Abstract, ZendExt_Query_SQL.
 * @copyright  UCID
 * @version    1.0-0
 */
class ZendExt_Restrict_Query_SQL extends ZendExt_Restrict_Query_Abstract
{

    /**
     * Restringe una colsulta de tipo ZendExt_Query_SQL de acuerdo a la configuracion de la compartimentacion.
     *
     * @param ZendExt_Query_SQL             $queryObject       - Objeto consulta.
     * @param ZendExt_Restrict_Query_Config $restrictionConfig - Configuracion de la compartimentacion.
     *
     * @return ZendExt_Query_SQL - Consulta compartimentada.
     */
    public function restrict($_queryObject, ZendExt_Restrict_Query_Config $_restrictionConfig, $idUser = null)
    {
        if (!$_queryObject instanceof ZendExt_Query_SQL) {
            throw new ZendExt_Exception('ZERQSQL001');
        }

        //Obteniendo los datos de la configuracion inicial de la compartimentacion.
        if (!$idUser) {
            $idUser = ZendExt_GlobalConcept :: getInstance()->Perfil->idusuario ?
                ZendExt_GlobalConcept :: getInstance()->Perfil->idusuario
                : Zend_Registry :: getInstance()->session->perfil['idusuario'];
        }
        if ($idUser) {
            $inf = $_restrictionConfig->informationSource->alias;

            //Obteniendo la posicion del usuario autenticado.
            $userPosition = ZendExt_Query_SQL::create()->select('posiciondominio')->from('mod_seguridad.seg_usuario')
                ->where('idusuario = ?', $idUser)->fetchOne();

            //Obteniendo el resto de los datos de la configuracion de la compartimentacion.
            $objConfComp = $this->_getRestrictConfig($_restrictionConfig);

            //Generando un numero aleatorio para agregar a los alias.
            $rn = (string)rand(1, 10000);

            $idDom = array();
            $filterDom = '';
            foreach ($_restrictionConfig->domain->id as $uri => $id) {
                if (!is_null($id)) {
                    if ($filterDom != '') {
                        $filterDom .= ' AND ';
                    } else {
                        $filterDom = '(';
                    }
                    $filterDom .= "infcomp{$rn}.{$objConfComp['campoiddominio'][$uri]} = ?";
                    array_push($idDom, $id);
                }

            }
            if (count($idDom)) {
                $filterDom .= ') AND ';
            }

            //Restringiendo la consulta
            $_queryObject->addSelect(
                "(infcomp{$rn}.dominiousuario [{$userPosition}][1] | COALESCE(infcompusr{$rn}.permisos[1], '0')) as insertar"
            )
                ->addSelect(
                    "(infcomp{$rn}.dominiousuario [{$userPosition}][2] | COALESCE(infcompusr{$rn}.permisos[2], '0')) as modificar"
                )
                ->addSelect(
                    "(infcomp{$rn}.dominiousuario [{$userPosition}][3] | COALESCE(infcompusr{$rn}.permisos[3], '0')) as eliminar"
                )
                ->addSelect(
                    "(infcomp{$rn}.dominiousuario [{$userPosition}][4] | COALESCE(infcompusr{$rn}.permisos[4], '0')) as lectura"
                )
                ->addSelect(
                    "(infcomp{$rn}.dominiousuario [{$userPosition}][5] | COALESCE(infcompusr{$rn}.permisos[5], '0')) as compartimentar"
                )
                ->leftJoin(
                    "{$objConfComp['tablafuentedominio']} infcomp{$rn} ON ({$filterDom} {$inf}.{$objConfComp['campoidfuente']} = infcomp{$rn}.{$objConfComp['campoidfuente']})",
                    $idDom
                )
                ->leftJoin(
                    "{$objConfComp['tablafuentedominio']}_usuario infcompusr{$rn} ON ({$filterDom} {$inf}.{$objConfComp['campoidfuente']} = infcompusr{$rn}.{$objConfComp['campoidfuente']} AND infcompusr{$rn}.idusuario = {$idUser})",
                    $idDom
                )
                ->addWhere(
                    "infcomp{$rn}.dominiousuario [{$userPosition}][4] = '1' OR infcompusr{$rn}.permisos[4] = '1'"
                );
        }
        return $_queryObject;
    }

    /**
     * Restringe una colsulta de tipo ZendExt_Query_SQL de acuerdo a la configuracion de la compartimentacion.
     *
     * @param ZendExt_Query_SQL             $queryObject       - Objeto consulta.
     * @param ZendExt_Restrict_Query_Config $restrictionConfig - Configuracion de la compartimentacion.
     *
     * @return ZendExt_Query_SQL - Consulta compartimentada.
     */
    public function restrictExt(
        $_queryObject, ZendExt_Restrict_Query_Config $_restrictionConfig, $idUser = null, $idDomain = null
    )
    {
        if (!$_queryObject instanceof ZendExt_Query_SQL) {
            throw new ZendExt_Exception('ZERQSQL001');
        }
        //Obteniendo el resto de los datos de la configuracion de la compartimentacion.
        $objConfComp = $this->_getRestrictConfig($_restrictionConfig);
        if (!$idUser) {
            $idUser = ZendExt_GlobalConcept :: getInstance()->Perfil->idusuario ?
                ZendExt_GlobalConcept :: getInstance()->Perfil->idusuario
                : Zend_Registry :: getInstance()->session->perfil['idusuario'];
        }
        if (!$idUser /*|| !$idDomain*/ || !$objConfComp['padre'] || count($_restrictionConfig->domain->id) != 1) {
            return $this->restrict($_queryObject, $_restrictionConfig, $idUser);
        }
        //Cargar todos los dominios al que el usuario puede acceder en caso de que no tenga un dominio especifico seleccionado
        $_idDomains = array();
        if (!$idDomain) {
            $_qDomain = Doctrine_Query::create();
            $_dominios = ZendExt_Query_SQL::create()->select('idelementodominio')->from(
                'mod_compartimentacion.dat_rolusuariodominio'
            )->where('idusuario = ?', $idUser)->fetchAll();
            if ($_dominios[0]['idelementodominio']) {
                foreach ($_dominios as $_domUs) {
                    $_idDomains[] = $_domUs['idelementodominio'];
                }
            } else {
                return $this->restrict($_queryObject, $_restrictionConfig, $idUser);
            }
        }
        if ($idUser) {
            $inf = $_restrictionConfig->informationSource->alias;
            $uriRestType = $_restrictionConfig->restrictionType->uri;
            $rest = $_restrictionConfig->restrictionType->alias;

            //Obteniendo la posicion del usuario autenticado.
            $userPosition = ZendExt_Query_SQL::create()->select('posiciondominio')->from('mod_seguridad.seg_usuario')
                ->where('idusuario = ?', $idUser)->fetchOne();


            //Obteniendo el identificador del tipo de criterio de compartimentacion.
            $idRestType = $objConfComp['idtipocomp'];

            //Generando un numero aleatorio para agregar a los alias.
            $rn = (string)rand(1, 10000);

            $idDom = array();
            $idDomType = array();
            $filterDom = '';
            $filterRolDom = '';
            $filterRolDomType = '';
            $filterDomTblPcpalRel = '';
            $domPadreIsNull = '';
            $domPadreIsNoNull = '';
            $_paramRol = array($idUser);

            foreach ($_restrictionConfig->domain->id as $uri => $id) {
                if (!is_null($id)) {
                    if ($filterDom != '') {
                        $filterDom .= ' AND ';
                        $filterRolDom .= ' AND ';
                    } else {
                        $filterDom = '(';
                        $filterRolDom = '(';
                    }
                    $filterDom .= "infcomp{$rn}.{$objConfComp['campoiddominio'][$uri]} = ?";
                    $filterRolDom .= "rol{$rn}.idelementodominio = ?";
                    array_push($idDom, $id);
                }
                if ($filterRolDomType != '') {
                    $filterRolDomType .= ' OR ';
                } else {
                    $filterRolDomType .= '(';
                }
                $filterRolDomType .= "rol{$rn}.idtipodominio = ?";
                array_push($idDomType, $objConfComp['idtipodominio'][$uri]);
                if ($objConfComp['padre']) {
                    $domPadreIsNull .= " & ~COALESCE(dompadre{$uri}{$rn}.dominio, '0')";
                    $domPadreIsNoNull .= " & COALESCE(dompadre{$uri}{$rn}.dominio, '0')";
                }
                if ($idDomain) {
                    $filterDomTblPcpalRel .= " AND rol{$rn}.idelementodominio = ? ";
                    $_paramRol[] = $idDomain;
                } else {
                    $filterDomTblPcpalRel
                        .= " AND rol{$rn}.idelementodominio IN ( " . implode(',', $_idDomains) . " ) ";
                }
            }
            if (count($idDom)) {
                $filterDom .= ') AND ';
                $filterRolDom .= ') AND ';
            }
            if (count($idDomType)) {
                $filterRolDomType .= ') AND ';
            }
            if (!$domPadreIsNoNull) {
                $domPadreIsNoNull = " & '0'";
            }

            $_queryObject->addSelect($this->createSelectExt($rn, 'insertar', $objConfComp['campoiddominio'][$uri]))
                ->addSelect($this->createSelectExt($rn, 'modificar', $objConfComp['campoiddominio'][$uri]))
                ->addSelect($this->createSelectExt($rn, 'eliminar', $objConfComp['campoiddominio'][$uri]))
                ->addSelect($this->createSelectExt($rn, 'lectura', $objConfComp['campoiddominio'][$uri]))
                ->addSelect($this->createSelectExt($rn, 'compartimentar', $objConfComp['campoiddominio'][$uri]))
                ->leftJoin(
                    "mod_compartimentacion.dat_rolusuariodominio rol{$rn} ON ({$filterRolDom} {$filterRolDomType} rol{$rn}.idusuario = ? {$filterDomTblPcpalRel})",
                    array_merge($idDom, $idDomType, $_paramRol)
                )
                ->leftJoin(
                    "mod_compartimentacion.dat_confcompartimentacion confcomp{$rn} ON (rol{$rn}.idtipodominio = confcomp{$rn}.idtipodominio AND rol{$rn}.idrolanalista = confcomp{$rn}.idrolanalista AND confcomp{$rn}.idtipocriteriocompartimentacion = ? AND confcomp{$rn}.idcriterioinformacion = {$rest}.idclasificacioninformacion)",
                    $objConfComp['idtipocriteriocomp']
                )
                ->leftJoin(
                    "{$objConfComp['tablafuentedominio']} infcomp{$rn} ON ({$filterDom} {$inf}.{$objConfComp['campoidfuente']} = infcomp{$rn}.{$objConfComp['campoidfuente']})",
                    $idDom
                )
                //NUEVO
                ->leftJoin(
                    "{$objConfComp['tablafuentedominio']}_usuario usuariocomp{$rn} ON (usuariocomp{$rn}.{$objConfComp['campoidfuente']} = infcomp{$rn}.{$objConfComp['campoidfuente']} AND usuariocomp{$rn}.idusuario = rol{$rn}.idusuario)"
                );

            foreach ($_restrictionConfig->domain->id as $uri => $id) {
                //Restringiendo la consulta
                //Contruyo la subconsulta para la posicion en el dominio
                $_par = implode(',', $_idDomains);
                $_onPosUsuario = (!$idDomain)
                    ? "{$objConfComp['tabladominio'][$uri]} posusuario{$uri}{$rn} ON (posusuario{$uri}{$rn}.{$objConfComp['campoiddominio'][$uri]} IN ({$_par}))"
                    : "{$objConfComp['tabladominio'][$uri]} posusuario{$uri}{$rn} ON (posusuario{$uri}{$rn}.{$objConfComp['campoiddominio'][$uri]} = ?)";
                $_paramsPos = ($idDomain) ? $idDomain : null;
                //Restrinjo la consulta
                $_queryObject->leftJoin(
                    "{$objConfComp['tabladominio'][$uri]} dom{$uri}{$rn} ON (dom{$uri}{$rn}.{$objConfComp['campoiddominio'][$uri]} = infcomp{$rn}.{$objConfComp['campoiddominio'][$uri]})"
                )
                    ->leftJoin(
                        "{$objConfComp['tabladominio'][$uri]} dompadre{$uri}{$rn} ON (dompadre{$uri}{$rn}.{$objConfComp['lft'][$uri]} < dom{$uri}{$rn}.{$objConfComp['lft'][$uri]} AND dompadre{$uri}{$rn}.{$objConfComp['rgt'][$uri]} > dom{$uri}{$rn}.{$objConfComp['rgt'][$uri]})"
                    )
                    //NUEVO
                    ->leftJoin($_onPosUsuario, $_paramsPos)
                    ->leftJoin(
                        "{$objConfComp['tabladominio'][$uri]} intodomain{$rn} ON (dom{$uri}{$rn}.{$objConfComp['lft'][$uri]} > posusuario{$uri}{$rn}.{$objConfComp['lft'][$uri]} AND dom{$uri}{$rn}.{$objConfComp['lft'][$uri]} < posusuario{$uri}{$rn}.{$objConfComp['lft'][$uri]})"
                    )
                    ->leftJoin(
                        "{$objConfComp['tabladominio'][$uri]} outdomain{$rn} ON (dom{$uri}{$rn}.{$objConfComp['lft'][$uri]} < posusuario{$uri}{$rn}.{$objConfComp['lft'][$uri]} OR dom{$uri}{$rn}.{$objConfComp['lft'][$uri]} > posusuario{$uri}{$rn}.{$objConfComp['lft'][$uri]})"
                    )
                    ->leftJoin(
                        "{$objConfComp['tabladominio'][$uri]} indomain{$rn} ON (dom{$uri}{$rn}.{$objConfComp['campoiddominio'][$uri]} = posusuario{$uri}{$rn}.{$objConfComp['campoiddominio'][$uri]})"
                    );


                $_queryObject->addWhere(
                    "(intodomain{$rn}.{$objConfComp['campoiddominio'][$uri]} is NOT NULL AND (COALESCE(confcomp{$rn}.permisohijosdominio [4], '0') = '1')) OR
                                        (indomain{$rn}.{$objConfComp['campoiddominio'][$uri]} is NOT NULL AND (COALESCE(confcomp{$rn}.permisodominio [4], '0') = '1')) OR
                                        (outdomain{$rn}.{$objConfComp['campoiddominio'][$uri]} is NOT NULL AND (COALESCE (confcomp{$rn}.permisofueradominio [4], '0') = '1')) OR
                                        (COALESCE(usuariocomp{$rn}.permisos[4], '0') = '1')"
                );
            }
        }
        return $_queryObject;
    }

    /**
     * $_random : Numero aleatorio generado para la consulta
     * $_permiso: alias del permisos que se generará
     * $_fieldIdDomain : Campo id de la tabla donde esta almacenado el dominio
     */
    public function createSelectExt($_random, $_permiso, $_fieldIdDomain)
    {
        $_permisos = array(
            'lectura'        => 4,
            'insertar'       => 1,
            'modificar'      => 2,
            'eliminar'       => 3,
            'compartimentar' => 5
        );
        $_selectPart = null;
        if ($_permisos[$_permiso]) {
            $_pos = $_permisos[$_permiso];
            $_selectPart = "
                CASE 
                    WHEN (intodomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND indomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND outdomain{$_random}.{$_fieldIdDomain} IS NOT NULL) THEN ((COALESCE(usuariocomp{$_random}.permisos[{$_pos}], '0') | (COALESCE(confcomp{$_random}.permisohijosdominio [{$_pos}], '0')) | (COALESCE(confcomp{$_random}.permisodominio [{$_pos}], '0')) | (COALESCE (confcomp{$_random}.permisofueradominio [{$_pos}], '0'))) = '1')
                    WHEN (intodomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND indomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND outdomain{$_random}.{$_fieldIdDomain} IS NULL) THEN ((COALESCE(usuariocomp{$_random}.permisos[{$_pos}], '0') | (COALESCE(confcomp{$_random}.permisohijosdominio [{$_pos}], '0')) | (COALESCE(confcomp{$_random}.permisodominio [{$_pos}], '0'))) = '1')
                    WHEN (intodomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND indomain{$_random}.{$_fieldIdDomain} IS NULL AND outdomain{$_random}.{$_fieldIdDomain} IS NOT NULL) THEN ((COALESCE(usuariocomp{$_random}.permisos[{$_pos}], '0') | (COALESCE(confcomp{$_random}.permisohijosdominio [{$_pos}], '0')) | (COALESCE (confcomp{$_random}.permisofueradominio [{$_pos}], '0'))) = '1')
                    WHEN (intodomain{$_random}.{$_fieldIdDomain} IS NULL AND indomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND outdomain{$_random}.{$_fieldIdDomain} IS NOT NULL) THEN ((COALESCE(usuariocomp{$_random}.permisos[{$_pos}], '0') | (COALESCE(confcomp{$_random}.permisodominio [{$_pos}], '0')) | (COALESCE (confcomp{$_random}.permisofueradominio [{$_pos}], '0'))) = '1')
                    WHEN (intodomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND indomain{$_random}.{$_fieldIdDomain} IS NULL AND outdomain{$_random}.{$_fieldIdDomain} IS NULL) THEN ((COALESCE(usuariocomp{$_random}.permisos[{$_pos}], '0') | (COALESCE(confcomp{$_random}.permisohijosdominio [{$_pos}], '0'))) = '1')
                    WHEN (indomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND intodomain{$_random}.{$_fieldIdDomain} IS NULL AND outdomain{$_random}.{$_fieldIdDomain} IS NULL) THEN ((COALESCE(usuariocomp{$_random}.permisos[{$_pos}], '0') | (COALESCE(confcomp{$_random}.permisodominio [{$_pos}], '0'))) = '1')
                    WHEN (outdomain{$_random}.{$_fieldIdDomain} IS NOT NULL AND indomain{$_random}.{$_fieldIdDomain} IS NULL AND intodomain{$_random}.{$_fieldIdDomain} IS NULL) THEN ((COALESCE(usuariocomp{$_random}.permisos[{$_pos}], '0') | (COALESCE (confcomp{$_random}.permisofueradominio [{$_pos}], '0'))) = '1')
                END AS {$_permiso}";
        }
        return $_selectPart;
    }

}
