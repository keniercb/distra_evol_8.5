<?php

/**
 * Clase utilizada para compartimentar informacion, agregando a una consulta de tipo Doctrine_Query los filtros correspondientes.
 *
 * @author     Yoandry Morejon Borbon
 * @package    ZendExt
 * @subpackage Restrict
 * @category   Framework.
 * @uses       ZendExt_Restrict_Query_Config, ZendExt_Restict_Query_Abstract, Doctrine_Query.
 * @copyright  UCID
 * @version    1.0-0
 */
class ZendExt_Restrict_Query_DQL extends ZendExt_Restrict_Query_Abstract
{

    /**
     * Restringir una consulta DQL teniendo en cuenta la compartimentacion de la informacion.
     *
     * @param mixed                         $_queryObject       , objeto consulta de tipo Doctrine_Query.
     * @param ZendExt_Query_Restrict_Config $_restrictionConfig , configuracion de la compartimentacion.
     *
     * @return mixed,
     */
    public function restrict($_queryObject, ZendExt_Restrict_Query_Config $_restrictionConfig, $idUser = null)
    {
        if (!$_queryObject instanceof Doctrine_Query) {
            throw new ZendExt_Exception('ZERQDQL001');
        }

        //Obteniendo los datos de la configuracion inicial de la compartimentacion.
        if (!$idUser) {
            $idUser = ZendExt_GlobalConcept::getInstance()->Perfil->idusuario ?
                ZendExt_GlobalConcept::getInstance()->Perfil->idusuario
                : Zend_Registry :: getInstance()->session->perfil['idusuario'];
        }
        $inf = $_restrictionConfig->informationSource->alias;
        $uriRestType = $_restrictionConfig->restrictionType->uri;
        $rest = $_restrictionConfig->restrictionType->alias;
        if ($idUser) {
            //Obteniendo la posicion del usuario autenticado.
            $userPosition = ZendExt_Query_SQL::create()->select('posiciondominio')->from('mod_seguridad.seg_usuario')
                ->where("idusuario = ?", $idUser)->fetchOne();

            //Obteniendo el resto de los datos de la configuracion de la compartimentacion.
            $objConfComp = $this->_getRestrictConfig($_restrictionConfig);

            //Obteniendo el identificador del tipo de criterio de compartimentacion.
            $idRestType = $objConfComp['idtipocomp'];

            //Generando un numero aleatorio para agregar a los alias.
            $rn = (string)rand(1, 10000);

            $idDom = array();
            $idDomType = array();
            $filterDom = '';
            $filterRolDom = '';
            $filterRolDomType = '';
            $domPadreIsNull = '';
            $domPadreIsNoNull = '';
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

            //Restringiendo la consulta
            $_queryObject->addSelect(
                "((COALESCE(infcomp{$rn}.dominiousuario [{$userPosition}][1], '0') |
  								  (COALESCE(confcomp{$rn}.permisodominio [1], '0') & COALESCE(rol{$rn}.dominio, '0')) | 
  								  (COALESCE (confcomp{$rn}.permisofueradominio [1], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNull) |
  								  (COALESCE(confcomp{$rn}.permisohijosdominio [1], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNoNull)) = '1') as insertar"
            )
                ->addSelect(
                    "((COALESCE(infcomp{$rn}.dominiousuario [{$userPosition}][2], '0') |
  								  (COALESCE(confcomp{$rn}.permisodominio [2], '0') & COALESCE(rol{$rn}.dominio, '0')) | 
  								  (COALESCE (confcomp{$rn}.permisofueradominio [2], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNull) |
  								  (COALESCE(confcomp{$rn}.permisohijosdominio [2], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNoNull)) = '1') as modificar"
                )
                ->addSelect(
                    "((COALESCE(infcomp{$rn}.dominiousuario [{$userPosition}][3], '0') |
  								  (COALESCE(confcomp{$rn}.permisodominio [3], '0') & COALESCE(rol{$rn}.dominio, '0')) | 
  								  (COALESCE (confcomp{$rn}.permisofueradominio [3], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNull) |
  								  (COALESCE(confcomp{$rn}.permisohijosdominio [3], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNoNull)) = '1') as eliminar"
                )
                ->addSelect(
                    "((COALESCE(infcomp{$rn}.dominiousuario [{$userPosition}][4], '0') |
  								  (COALESCE(confcomp{$rn}.permisodominio [4], '0') & COALESCE(rol{$rn}.dominio, '0')) | 
  								  (COALESCE (confcomp{$rn}.permisofueradominio [4], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNull) |
  								  (COALESCE(confcomp{$rn}.permisohijosdominio [4], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNoNull)) = '1') as lectura"
                )
                ->addSelect(
                    "((COALESCE(infcomp{$rn}.dominiousuario [{$userPosition}][5], '0') |
  								  (COALESCE(confcomp{$rn}.permisodominio [5], '0') & COALESCE(rol{$rn}.dominio, '0')) | 
  								  (COALESCE (confcomp{$rn}.permisofueradominio [5], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNull) |
  								  (COALESCE(confcomp{$rn}.permisohijosdominio [5], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNoNull)) = '1') as compartimentar"
                )
                ->leftJoin(
                    "{$inf}.ZendExt_Restrict_Domain_DatRolusuariodominio rol{$rn} ON ({$filterRolDom} {$filterRolDomType} rol{$rn}.idusuario = ?)",
                    array_merge($idDom, $idDomType, array($idUser))
                )
                ->leftJoin(
                    "rol{$rn}.ZendExt_Restrict_Domain_DatConfcompartimentacion confcomp{$rn} ON (rol{$rn}.idtipodominio = confcomp{$rn}.idtipodominio AND rol{$rn}.idrolanalista = confcomp{$rn}.idrolanalista AND confcomp{$rn}.idtipocriteriocompartimentacion = ? AND confcomp{$rn}.idcriterioinformacion = {$rest}.idclasificacioninformacion)",
                    $objConfComp['idtipocriteriocomp']
                )
                ->leftJoin(
                    "{$inf}.{$objConfComp['tablafuentedominio']} infcomp{$rn} ON ({$filterDom} {$inf}.{$objConfComp['campoidfuente']} = infcomp{$rn}.{$objConfComp['campoidfuente']})",
                    $idDom
                );

            if ($objConfComp['padre']) {
                foreach ($_restrictionConfig->domain->id as $uri => $id) {
                    $_queryObject->leftJoin(
                        "{$inf}.{$objConfComp['tabladominio'][$uri]} dom{$uri}{$rn} ON (dom{$uri}{$rn}.{$objConfComp['campoiddominio'][$uri]} = infcomp{$rn}.{$objConfComp['campoiddominio'][$uri]})"
                    )
                        ->leftJoin(
                            "dom{$uri}{$rn}.{$objConfComp['tabladominio'][$uri]} dompadre{$uri}{$rn} ON (dompadre{$uri}{$rn}.{$objConfComp['lft'][$uri]} < dom{$uri}{$rn}.{$objConfComp['lft'][$uri]} AND dompadre{$uri}{$rn}.{$objConfComp['rgt'][$uri]} > dom{$uri}{$rn}.{$objConfComp['rgt'][$uri]})"
                        );
                }
            }

            $_queryObject->addWhere(
                "(COALESCE(infcomp{$rn}.dominiousuario [{$userPosition}][4], '0') |
  								 (COALESCE(confcomp{$rn}.permisodominio [4], '0') & COALESCE(rol{$rn}.dominio, '0')) |
  								 (COALESCE (confcomp{$rn}.permisofueradominio [4], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNull) |
  								 (COALESCE(confcomp{$rn}.permisohijosdominio [4], '0') & ~COALESCE(rol{$rn}.dominio, '0') $domPadreIsNoNull)) = '1'"
            );
        }
        return $_queryObject;
    }

    /**
     * Devuelve el resto de los elementos de la configuracion de la compartimentacion.
     *
     * @param $_restrictionConfig - Configuracion inicial de la compartimentacion.
     *
     * @return array - Listado de elementos de configuracion de la compartimentacion.
     */
    protected function _getRestrictConfig(ZendExt_Restrict_Query_Config $_restrictionConfig)
    {
        //Obteniendo configuracion de la compartimentacion.
        $objConfComp = parent::_getRestrictConfig($_restrictionConfig);

        //Transformando la compartimentacion de la informacion para Doctrine.
        $objConfComp['tablafuentedominio']
            = 'ZendExt_Restrict_Domain_' . $this->_transformTableSchemaNameToDoctrineRecord(
                $objConfComp['tablafuentedominio']
            );
        $tempDomainTable = $objConfComp['tabladominio'];
        foreach ($tempDomainTable as $uri => $tabla) {
            $objConfComp['tabladominio'][$uri]
                = 'ZendExt_Restrict_Domain_' . $this->_transformTableSchemaNameToDoctrineRecord($tabla);
        }

        return $objConfComp;
    }

    /**
     * Transforma el nombre de una entidad de la base de datos (esquema1.tabla1) al estandar de Doctrine.
     *
     * @param string $tableSchemaName - Nombre de una entidad de la base de datos (esquema1.tabla1).
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

}
