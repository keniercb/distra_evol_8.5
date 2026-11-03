<?php

class RecuperacionesModel extends ZendExt_Model
{

    private $sql;
    private $sqlTotal;
    private $paramsCompartimentacion = array();
    private $arrTablasVisitadas;
    private $direccionModulo;
    private $generarSQLModel;

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->sql = '';
        $this->sqlTotal = '';
        $this->arrTablasVisitadas = array();
    }

    public function __construct()
    {
        parent::ZendExt_Model();
        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $this->direccionModulo = str_replace('web', 'apps', $dir_www) . '/reccomplejas/';
        $this->generarSQLModel = null;
    }

    public function obtenerReporteInicial($idconfiguracion, $condiciones, $orden = array(), $limit = 25, $start = 0)
    {

        //Pregunta si tiene alguna busqueda configurada por defecto y recoje sus datos
        $search = DatBusqueda::getSearchSavedByDefault($idconfiguracion, $this->global->Perfil->idusuario);

        if ($search)
        {
            $config = json_decode($search[0]['configuracion']);
            $selectores = $config->selectores;
            $condiciones = $config->condiciones;
            $orden = $config->orden;
            $operacion = $config->operacion;
        }
        $extraParams['idusuario'] = $this->global->Perfil->idusuario;

        $this->generaSQLs($idconfiguracion, array(), $condiciones, $orden, array(), $limit, $start, $extraParams);

        return $this->ejecutarSQL();
    }

    public function getParamsCompartimentacion()
    {
        return $this->paramsCompartimentacion;
    }

    public function getSQL()
    {
        return $this->sql;
    }

    public function getSQLTotal()
    {
        return $this->sqlTotal;
    }

    public function getTablasVisitadasToString()
    {
        $str = '';
        $i = false;
        foreach ($this->arrTablasVisitadas as $tabla)
        {
            if ($i == false)
            {
                //$str .= $tabla['tabla'];
                $str .= $tabla;
            } else
            {
                //$str .= ','.$tabla['tabla'];
                $str .= ',' . $tabla;
            }
            $i = true;
        }

        return $str;
    }

    public function cargarNomenclador($idconfiguracion, $idcampo, $tipo)
    {
        $objXML = new ReadXmlRec($idconfiguracion);
        if ($tipo == 'NOMENCLADOR')
        {
            $arrConfigCondicion = $objXML->getXML('configuracion_condicion.xml');
            $query = Doctrine_Manager::getInstance();
            foreach ($arrConfigCondicion as $configCond)
            {
                if ($idcampo == $configCond['idcampo'])
                {
                    $sql = 'SELECT ' . $configCond['idtabla'] . ' as idvalor, ' .
                            $configCond['campo'] . ' as denom FROM ' . $configCond['esquema'] . '.' . $configCond['tabla'];
                    if (!empty($configCond['sqlfilter']))
                    {
                        $sql .= ' WHERE ' . $configCond['sqlfilter'];
                    }

                    return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                }
            }
            exit('El campo no se encontro en el fichero configuracion_mostrar.xml');
        } else
        {
            $objFormatCond = $objXML->getXML('campo_multievaluado.xml');
            $result = array();
            foreach ($objFormatCond as $campo)
            {
                if ($campo['idcampo'] == $idcampo)
                {
                    foreach ($campo as $valor)
                    {
                        $arrAux['idvalor'] = $valor['valor'] . '';
                        $arrAux['denom'] = $valor['denominacion'] . '';
                        $result[] = $arrAux;
                    }
                    break;
                }
            }

            return $result;
        }
    }

    public function cargarArbol($idconfiguracion, $idcampo, $node)
    {
        $objXML = new ReadXmlRec($idconfiguracion);
        $this->includeFileCompartimentacion($idconfiguracion);

        $arrConfigCondicion = $objXML->getXML('configuracion_condicion.xml');

        foreach ($arrConfigCondicion as $configCond)
        {
            if ($idcampo == $configCond['idcampo'])
            {
                if (strpos($configCond['sqlfilter'], '{php}') !== false)
                {
                    //Verifica la existencia de codigo PHP a ejcutar.
                    $methodName = str_replace('{php}', '', $configCond['sqlfilter']);
                    //Evalua el codigo php definido como funcion en el fichero de compartimentacion.php
                    if (function_exists($methodName))
                    {
                        $params['idconfiguracion'] = $idconfiguracion;
                        $params['campo'] = $configCond;
                        $params['node'] = $node;
                        $params['global'] = $this->global;
                        return call_user_func($methodName, $params);
                    } else
                    {
                        exit("No se encontro la funcion {$methodName} en el fichero de compartimentacion.php");
                    }
                } else
                {
                    exit("No se ha definido ninguna funcion de busqueda");
                }
            }
        }
        exit('No se encontro una configuracion para este campo');
    }

    private function includeFileCompartimentacion($idconfiguracion)
    {
        $dirFile = $this->direccionModulo . '/comun/recursos/config_reccomplejas/config_' . $idconfiguracion
                . '/compartimentacion.php';
        require_once($dirFile);
    }

    //Funcion que devuelve el resultado del resporte junto con las columnas y los indices para formar el Gridpanel en el que se van a representar
    public function obtenerReporte(
    $idconfiguracion, $pCampos, $pCondiciones = array(), $orderby = "", $pOperacion = array(), $limit = 20, $start = 0
    )
    {
        $datos = $this->ejecutarSQL($idconfiguracion, $pCampos, $pCondiciones, $orderby, $pOperacion, $limit, $start);

        $result = null;
        $cm = array();
        $idx = array();
        if ($datos != 0)
        {
            if (count($pOperacion) == 0)
            {
                foreach ($pCampos as $campo)
                {
                    $cm[] = array('dataIndex' => utf8_decode('_' . $campo[2]), 'sortable' => true,
                        'header' => utf8_decode($campo[0]));
                    $idx[] = array('name' => utf8_decode('_' . $campo[2]));
                }
            } else
            {
                //Caso en el que quiero hallar la cantidad total.
                if ($pOperacion[2] == -1)
                {
                    $cm[] = array('dataIndex' => utf8_decode($pOperacion[1]), 'sortable' => true,
                        'header' => utf8_decode($pOperacion[1]));
                    $idx[] = array('name' => utf8_decode($pOperacion[1]));
                } else
                {
                    //Columna con los valores
                    $cm[] = array('dataIndex' => utf8_decode($pOperacion[0]), 'sortable' => true,
                        'header' => utf8_decode($pOperacion[0]));
                    $idx[] = array('name' => utf8_decode($pOperacion[0]));
                    //Columna con las denominaciones
                    $cm[] = array('dataIndex' => utf8_decode($pOperacion[4]), 'sortable' => true,
                        'header' => utf8_decode($pOperacion[4]));
                    $idx[] = array('name' => utf8_decode($pOperacion[4]));
                }
            }
            if (count($datos) > 18)
            {
                for ($i = 0; $i < 18; $i++)
                {
                    $result[] = $datos[$i];
                }
            } else
            {
                $result = $datos;
            }
            // $this->CorregirAlgunosCampos($result, $cm, '0'); //parche
        } else
        {
            $result = $datos;
        }

        $r['columnas'] = $cm;
        $r['indices'] = $idx;
        $r['resultado'] = array('datos' => $result, 'cantidad' => 18);

        //$r['sql'] = $this->getSQL();
        return $r;
    }

    public function getSQLRipeado()
    {
        return $this->generarSQLModel->getSQLRipeado();
    }

    public function generaSQLs(
    $idconfiguracion, $pCampos, $pCondiciones = array(), $orderby = array(), $pOperacion = null, $limit = 20, $start = 0, $extraParams = array()
    )
    {
        $count = 0;
        if (count($pCondiciones) > 0)
        {
            foreach ($pCondiciones as $r)
            {
                $idcampo = $r->idcampo;
                $sql = "SELECT con.usarreemplazar
				FROM mod_reccomplejas2.dat_configcondicion as con
                WHERE con.idcampo = $idcampo ";
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
                /*                 * *********************MINUSCULA********************************* */
                if ($result[0]['usarreemplazar'] == 'MINUSCULA')
                {
                    $cadenaReemplazar = $vocales = array("á", "é", "í", "ó", "ú", "a", "e", "i", "o", "u", "u", " ");
                    $cadenaBuscar = $vocales = array("á", "é", "í", "ó", "ú", "à", "è", "ì", "ò", "ù", "ü", "'");
                    $nombre = trim($r->valor);
                    $nombre = mb_strtolower($nombre, "UTF-8");
                    $nombre = str_replace($cadenaBuscar, $cadenaReemplazar, $nombre);

                    $pCondiciones[$count]->valor = $nombre;
                }

                /*                 * ****************MINUSCULA SIN TILDE***************************** */
                if ($result[0]['usarreemplazar'] == 'MINUSCULA SIN TILDE')
                {
                    $cadenaReemplazar = $vocales = array("a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "u", " ");
                    $cadenaBuscar = $vocales = array("á", "é", "í", "ó", "ú", "à", "è", "ì", "ò", "ù", "ü", "'");
                    $nombre = trim($r->valor);
                    $nombre = mb_strtolower($nombre, "UTF-8");
                    $nombre = str_replace($cadenaBuscar, $cadenaReemplazar, $nombre);
                    $pCondiciones[$count]->valor = $nombre;
                }

                /*                 * ******************************MAYUSCULA********************************** */
                if ($result[0]['usarreemplazar'] == 'MAYUSCULA')
                {
                    $cadenaReemplazar = $vocales = array("A", "E", "I", "O", "U", "A", "E", "I", "O", "U", "U", " ");
                    $cadenaBuscar = $vocales = array("Á", "É", "Í", "Ó", "Ú", "À", "È", "Ì", "Ò", "Ù", "Ü", "'");
                    $nombre = trim($r->valor);
                    $nombre = mb_strtolower($nombre, "UTF-8");
                    $nombre = str_replace($cadenaBuscar, $cadenaReemplazar, $nombre);

                    $pCondiciones[$count]->valor = $nombre;
                }

                /*                 * *************************MAYUSCULA SIN TILDE*********************** */
                if ($result[0]['usarreemplazar'] == 'MAYUSCULA SIN TILDE')
                {
                    $cadenaReemplazar = $vocales = array("A", "E", "I", "O", "U", "A", "E", "I", "O", "U", "U", " ");
                    $cadenaBuscar = $vocales = array("Á", "É", "Í", "Ó", "Ú", "À", "È", "Ì", "Ò", "Ù", "Ü", "'");
                    $nombre = trim($r->valor);
                    $nombre = mb_strtolower($nombre, "UTF-8");
                    $nombre = str_replace($cadenaBuscar, $cadenaReemplazar, $nombre);

                    //Nombre en minuscula
                    $cadenaReemplazarminuscula = $vocales = array("a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "u", " ");
                    $cadenaBuscarminuscula = $vocales = array("á", "é", "í", "ó", "ú", "à", "è", "ì", "ò", "ù", "ü", "'");
                    $nombreminuscula = trim($nombre);
                    $nombreminuscula = mb_strtolower($nombreminuscula, "UTF-8");
                    $nombreminuscula = str_replace($cadenaBuscarminuscula, $cadenaReemplazarminuscula, $nombreminuscula);

                    $pCondiciones[$count]->valor = $nombreminuscula;
                }

                /*                 * *******************************NINGUNO************************************ */
                if ($result[0]['usarreemplazar'] == 'NINGUNO')
                {
                    $nombre = $r->valor;
                    $pCondiciones[$count]->valor = $nombre;
                }

                /*                 * **********************************HORA***************************************** */
                if ($pCondiciones[$count]->tipo == 'HORA')
                {
                    $pCondiciones[$count]->valor = "cast('" . $pCondiciones[$count]->valor . "' as time)";
                }

                $count++;
            }
        }

        $objXML = new ReadXmlRec($idconfiguracion);
        $arrConfigCondicion = $objXML->getXML('configuracion_condicion.xml');
        $arrConfigMostrar = $objXML->getXML('configuracion_mostrar.xml');
        $xmlFilters = $objXML->getXML('filtros_rol.xml');
        $arrFilters = array(); //Filtros que se van a adicionar en el join de la tabla relacionada con el campo

        if ($extraParams['idusuario'])
        {
            if (!empty($xmlFilters))
            {
                $roles = ZendExt_IoC::getInstance()->seguridad->getRolesbyUser($extraParams['idusuario']);

                foreach ($roles as $role)
                {
                    if ($xmlFilters->{'role_' . $role['idrol']})
                    {
                        foreach ($xmlFilters->{'role_' . $role['idrol']}->filter as $key => $xmlFilter)
                        {
                            $condicion['condicion'] = (String) $xmlFilter['condicion'];
                            $condicion['valor'] = (String) $xmlFilter['valor'];
                            $logico = (String) $xmlFilter['logico'];
                            /*
                             * Verifica que el logico no se quede vacio cuando lo preceda una condicion producto de
                             * restricciones de mas de un rol
                             */
                            if (empty($logico) && !empty($arrFilters))
                            {
                                $logico = 'AND';
                            }
                            $condicion['logico'] = $logico;
                            $condicion['idcampo'] = (String) $xmlFilter['idcampo'];
                            $condicion['tipo'] = (String) $xmlFilter['tipodato'];
                            $condicion['esquema'] = (String) $xmlFilter['esquema'];
                            $condicion['tabla'] = (String) $xmlFilter['tabla'];
                            $condicion['campo'] = (String) $xmlFilter['campo'];
                            $condicion['idtabla'] = (String) $xmlFilter['idtabla'];
                            $condicion['usarcondicion'] = (String) $xmlFilter['usarcondicion'];
                            $condicion['sqlwhere'] = (String) $xmlFilter['sqlwhere'];
                            $arrFilters[] = $condicion;
                        }
                    }
                }
            }
        }

        //Obtiene todos los campos ocultos de la configuracion
        $hiddenFields = json_decode(
                file_get_contents(
                        $this->direccionModulo . "comun/recursos/config_reccomplejas/config_{$idconfiguracion}/json/hiddenFields.json"
                )
        );
        $dirSelectores = $this->direccionModulo . "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
        $arrSelectores = $this->getHojas(json_decode(file_get_contents($dirSelectores)));

        $arrCampos = array();
        $arrCondiciones = array();
        $arrOperacion = array();

        $i = 0;
        if (is_array($pOperacion))
        {
            foreach ($pOperacion as $po)
            {
                foreach ($arrConfigMostrar as $confMostrar)
                {

                    if ($po->idcampo == $confMostrar['idcampo'])
                    {

                        $arrOperacion[$i]['text'] = $po->campo;
                        $arrOperacion[$i]['idcampo'] = $po->idcampo;
                        $arrOperacion[$i]['tipoOperacion'] = $po->tipoOperacion;
                        $arrOperacion[$i]['nombreOperacion'] = $po->nombreOperacion;
                        $arrOperacion[$i]['nombreCampo'] = (String) $confMostrar['campo'];
                        $arrOperacion[$i]['esquema'] = (String) $confMostrar['esquema'];
                        $arrOperacion[$i]['tabla'] = (String) $confMostrar['tabla'];
                        $arrOperacion[$i]['idtabla'] = ''; //(String) $confMostrar['idtabla'];
                        $i++;
                    }
                }
            }
        } else
        {
            if (empty($pOperacion->idcampo))
            { //Caso en que mando a calcular el total de personas
                $arrOperacion['text'] = $pOperacion->campo;
                $arrOperacion['idcampo'] = $pOperacion->idcampo;
                $arrOperacion['tipoOperacion'] = $pOperacion->tipoOperacion;
                $arrOperacion['nombreOperacion'] = $pOperacion->nombreOperacion;
                $arrOperacion['nombreCampo'] = '';
                $arrOperacion['tipo'] = '';
                $arrOperacion['esquema'] = '';
                $arrOperacion['tabla'] = '';
                $arrOperacion['idtabla'] = '';
            } else
            {
                foreach ($arrConfigMostrar as $confMostrar)
                {
                    if ($pOperacion->idcampo == $confMostrar['idcampo'])
                    {
                        $arrOperacion[0]['text'] = $pOperacion->campo;
                        $arrOperacion[0]['idcampo'] = $pOperacion->idcampo;
                        $arrOperacion[0]['tipoOperacion'] = $pOperacion->tipoOperacion;
                        $arrOperacion[0]['nombreOperacion'] = $pOperacion->nombreOperacion;
                        $arrOperacion[0]['nombreCampo'] = (String) $confMostrar['campo'];
                        $arrOperacion[0]['esquema'] = (String) $confMostrar['esquema'];
                        $arrOperacion[0]['tabla'] = (String) $confMostrar['tabla'];
                        $arrOperacion[0]['idtabla'] = ''; //(String) $confMostrar['idtabla'];
                        break;
                    }
                }
            }
        }
        $i = 0;
        //Si el arreglo esta vacio lee el json para recoger los campos obligatorios
        if (empty($pCampos))
        {
            //Combina los elementos ocultos con los elemenos a mostrar para generar la consulta
            $arrSelectores = array_merge($arrSelectores, $hiddenFields);
            foreach ($arrSelectores as $campo)
            {

                if ($campo->obligatorio == 1)
                {
                    foreach ($arrConfigMostrar as $confMostrar)
                    {
                        if ($campo->idcampo == $confMostrar['idcampo'])
                        {
                            $arrCampos[$i]['text'] = $campo->text;
                            $arrCampos[$i]['idcampo'] = $campo->idcampo;
                            $arrCampos[$i]['campo'] = $campo->campo;
                            $arrCampos[$i]['alias'] = $campo->alias;
                            $arrCampos[$i]['tipo'] = $campo->tipodato;
                            $arrCampos[$i]['esquema'] = $campo->esquema;
                            $arrCampos[$i]['tabla'] = $campo->tabla;
                            $arrCampos[$i]['sqlselect'] = (String) $confMostrar['sqlselect'];
                            ++$i;
                            break;
                        }
                    }
                }
            }
        } else
        {

            //Combina los elementos ocultos con los elemenos a mostrar para generar la consulta
            $pCampos = array_merge($pCampos, $hiddenFields);
            //Sino preparo el arreglo de campos para darselo a la clase generadora del SQL
            foreach ($pCampos as $campo)
            {
                foreach ($arrSelectores as $selector)
                {
                    if ($campo->idcampo == $selector->idcampo)
                    {
                        $arrCampos[$i]['text'] = $selector->text;
                        $arrCampos[$i]['idcampo'] = $selector->idcampo;
                        $arrCampos[$i]['campo'] = $selector->campo;
                        $arrCampos[$i]['alias'] = $selector->alias;
                        $arrCampos[$i]['tipo'] = $selector->tipodato;
                        $arrCampos[$i]['esquema'] = $selector->esquema;
                        $arrCampos[$i]['tabla'] = $selector->tabla;
                        $arrCampos[$i]['sqlselect'] = $selector->sqlselect;
                        ++$i;
                        break;
                    }
                }
            }
            foreach ($hiddenFields as $hidden)
            {
                $arrCampos[$i]['text'] = $hidden->text;
                $arrCampos[$i]['idcampo'] = $hidden->idcampo;
                $arrCampos[$i]['campo'] = $hidden->campo;
                $arrCampos[$i]['alias'] = $hidden->alias;
                $arrCampos[$i]['tipo'] = $hidden->tipodato;
                $arrCampos[$i]['esquema'] = $hidden->esquema;
                $arrCampos[$i]['tabla'] = $hidden->tabla;
                $arrCampos[$i]['sqlselect'] = $hidden->sqlselect;
                ++$i;
            }
        }
        //}
        //Agrega al campo en caso de que se pueda usar como condicion el dato de sqlWhere
        foreach ($arrCampos as &$campo)
        {

            foreach ($arrConfigCondicion as $confCondicion)
            {
                if ($campo['idcampo'] == $confCondicion['idcampo'])
                {
                    if ((String) $confCondicion['usarcondicion'] == '1')
                    {
                        $campo['idtabla'] = (String) $confCondicion['idtabla'];
                        $campo['usarcondicion'] = (String) $confCondicion['usarcondicion'];
                        $campo['tipo'] = (String) $confCondicion['tipodato'];
                        $campo['sqlwhere'] = (String) $confCondicion['sqlwhere'];
                        break;
                    }
                }
            }
        }
        $i = 0; //Vuelvo a poner $i en 0 (Esto es importante)
        //Preparo el arreglo de condiciones para darselo a la clase generadora del SQL
        foreach ($pCondiciones as $k => $condicion)
        {

            if ($condicion->tipo == 'pabierto' || $condicion->tipo == 'pcerrado')
            {

                $arrCondiciones[$i]['condicion'] = '';
                $arrCondiciones[$i]['valor'] = '';
                $arrCondiciones[$i]['logico'] = $condicion->logico;
                $arrCondiciones[$i]['tipo'] = $condicion->tipo;
                $arrCondiciones[$i]['idcampo'] = '';
                $arrCondiciones[$i]['campo'] = '';
                $arrCondiciones[$i]['esquema'] = '';
                $arrCondiciones[$i]['tabla'] = '';
                $arrCondiciones[$i]['idtabla'] = '';
                $i++;
            } else
            {

                foreach ($arrConfigCondicion as $confCondicion)
                {

                    if ($condicion->idcampo == $confCondicion['idcampo'])
                    {
                        $arrCondiciones[$i]['condicion'] = $condicion->condicion;
                        $arrCondiciones[$i]['operador'] = $condicion->operador;
                        $arrCondiciones[$i]['valor'] = $condicion->valor;

                        if (count($pCondiciones) - 1 != $k)
                            $arrCondiciones[$i]['logico'] = $condicion->logico;
                        else
                            $arrCondiciones[$i]['logico'] = '';
                        $arrCondiciones[$i]['tipo'] = $condicion->tipo;
                        $arrCondiciones[$i]['idcampo'] = $condicion->idcampo;
                        $arrCondiciones[$i]['esquema'] = (String) $confCondicion['esquema'];
                        $arrCondiciones[$i]['tabla'] = (String) $confCondicion['tabla'];
                        $arrCondiciones[$i]['campo'] = (String) $confCondicion['campo'];
                        $arrCondiciones[$i]['idtabla'] = (String) $confCondicion['idtabla'];
                        $arrCondiciones[$i]['usarcondicion'] = (String) $confCondicion['usarcondicion'];
                        $arrCondiciones[$i]['tipo'] = (String) $confCondicion['tipodato'];
                        $arrCondiciones[$i]['sqlwhere'] = (String) $confCondicion['sqlwhere'];
                        $i++;
                        break;
                    }
                }
            }
        }

        $this->generarSQLModel = new generarSQLModel(
                $idconfiguracion, $arrCampos, $arrCondiciones, $orderby, $arrOperacion, $limit, $start, $arrFilters, $extraParams
        );
        
        $this->sql = $this->generarSQLModel->getSQL();
        

        $this->sqlTotal = $this->generarSQLModel->getSQLTotal();

        $this->paramsCompartimentacion = $this->generarSQLModel->getParamsCompartimentacion();
        $this->arrTablasVisitadas = $this->generarSQLModel->getArrTablasCondiciones();
    }

    public function generaSQLsExportar(
    $idconfiguracion, $pCampos, $pCondiciones = array(), $orderby = array(), $pOperacion = null, $extraParams = array()
    )
    {

        $objXML = new ReadXmlRec($idconfiguracion);
        $arrConfigCondicion = $objXML->getXML('configuracion_condicion.xml');
        $arrConfigMostrar = $objXML->getXML('configuracion_mostrar.xml');
        $xmlFilters = $objXML->getXML('filtros_rol.xml');
        $arrFilters = array(); //Filtros que se van a adicionar en el join de la tabla relacionada con el campo

        if ($extraParams['idusuario'])
        {
            if (!empty($xmlFilters))
            {
                $roles = ZendExt_IoC::getInstance()->seguridad->getRolesbyUser($extraParams['idusuario']);
                foreach ($roles as $role)
                {
                    if ($xmlFilters->{'role_' . $role['idrol']})
                    {
                        foreach ($xmlFilters->{'role_' . $role['idrol']}->filter as $key => $xmlFilter)
                        {
                            $condicion['condicion'] = (String) $xmlFilter['condicion'];
                            $condicion['valor'] = (String) $xmlFilter['valor'];
                            $logico = (String) $xmlFilter['logico'];
                            /*
                             * Verifica que el logico no se quede vacio cuando lo preceda una condicion producto de
                             * restricciones de mas de un rol
                             */
                            if (empty($logico) && !empty($arrFilters))
                            {
                                $logico = 'AND';
                            }
                            $condicion['logico'] = $logico;
                            $condicion['idcampo'] = (String) $xmlFilter['idcampo'];
                            $condicion['tipo'] = (String) $xmlFilter['tipodato'];
                            $condicion['esquema'] = (String) $xmlFilter['esquema'];
                            $condicion['tabla'] = (String) $xmlFilter['tabla'];
                            $condicion['campo'] = (String) $xmlFilter['campo'];
                            $condicion['idtabla'] = (String) $xmlFilter['idtabla'];
                            $condicion['usarcondicion'] = (String) $xmlFilter['usarcondicion'];
                            $condicion['sqlwhere'] = (String) $xmlFilter['sqlwhere'];
                            $arrFilters[] = $condicion;
                        }
                    }
                }
            }
        }

        //Obtiene todos los campos ocultos de la configuracion
        $hiddenFields = json_decode(
                file_get_contents(
                        $this->direccionModulo . "comun/recursos/config_reccomplejas/config_{$idconfiguracion}/json/hiddenFields.json"
                )
        );
        $dirSelectores = $this->direccionModulo . "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
        $arrSelectores = $this->getHojas(json_decode(file_get_contents($dirSelectores)));

        $arrCampos = array();
        $arrCondiciones = array();
        $arrOperacion = array();
        $i = 0;
        if (!empty($pOperacion->idcampo))
        {
            if (empty($pOperacion->idcampo))
            { //Caso en que mando a calcular el total de personas
                $arrOperacion['text'] = $pOperacion->campo;
                $arrOperacion['idcampo'] = $pOperacion->idcampo;
                $arrOperacion['tipoOperacion'] = $pOperacion->tipoOperacion;
                $arrOperacion['nombreOperacion'] = $pOperacion->nombreOperacion;
                $arrOperacion['nombreCampo'] = '';
                $arrOperacion['tipo'] = '';
                $arrOperacion['esquema'] = '';
                $arrOperacion['tabla'] = '';
                $arrOperacion['idtabla'] = '';
                ++$i;
            } else
            {
                foreach ($arrConfigMostrar as $confMostrar)
                {
                    if ($pOperacion->idcampo == $confMostrar['idcampo'])
                    {
                        $arrOperacion['text'] = $pOperacion->campo;
                        $arrOperacion['idcampo'] = $pOperacion->idcampo;
                        $arrOperacion['tipoOperacion'] = $pOperacion->tipoOperacion;
                        $arrOperacion['nombreOperacion'] = $pOperacion->nombreOperacion;
                        $arrOperacion['nombreCampo'] = (String) $confMostrar['campo'];
                        $arrOperacion['esquema'] = (String) $confMostrar['esquema'];
                        $arrOperacion['tabla'] = (String) $confMostrar['tabla'];
                        $arrOperacion['idtabla'] = ''; //(String) $confMostrar['idtabla'];
                        ++$i;
                        break;
                    }
                }
            }
        } else
        {

            //Si el arreglo esta vacio lee el json para recoger los campos obligatorios
            if (empty($pCampos))
            {
                //Combina los elementos ocultos con los elemenos a mostrar para generar la consulta
                $arrSelectores = array_merge($arrSelectores, $hiddenFields);
                foreach ($arrSelectores as $campo)
                {

                    if ($campo->obligatorio == 1)
                    {
                        foreach ($arrConfigMostrar as $confMostrar)
                        {
                            if ($campo->idcampo == $confMostrar['idcampo'])
                            {
                                $arrCampos[$i]['text'] = $campo->text;
                                $arrCampos[$i]['idcampo'] = $campo->idcampo;
                                $arrCampos[$i]['campo'] = $campo->campo;
                                $arrCampos[$i]['alias'] = $campo->alias;
                                $arrCampos[$i]['tipo'] = $campo->tipodato;
                                $arrCampos[$i]['esquema'] = $campo->esquema;
                                $arrCampos[$i]['tabla'] = $campo->tabla;
                                $arrCampos[$i]['sqlselect'] = (String) $confMostrar['sqlselect'];
                                ++$i;
                                break;
                            }
                        }
                    }
                }
            } else
            {

                //Combina los elementos ocultos con los elemenos a mostrar para generar la consulta
                $pCampos = array_merge($pCampos, $hiddenFields);
                //Sino preparo el arreglo de campos para darselo a la clase generadora del SQL
                foreach ($pCampos as $campo)
                {
                    foreach ($arrSelectores as $selector)
                    {
                        if ($campo->idcampo == $selector->idcampo)
                        {
                            $arrCampos[$i]['text'] = $selector->text;
                            $arrCampos[$i]['idcampo'] = $selector->idcampo;
                            $arrCampos[$i]['campo'] = $selector->campo;
                            $arrCampos[$i]['alias'] = $selector->alias;
                            $arrCampos[$i]['tipo'] = $selector->tipodato;
                            $arrCampos[$i]['esquema'] = $selector->esquema;
                            $arrCampos[$i]['tabla'] = $selector->tabla;
                            $arrCampos[$i]['sqlselect'] = $selector->sqlselect;
                            ++$i;
                            break;
                        }
                    }
                }
                foreach ($hiddenFields as $hidden)
                {
                    $arrCampos[$i]['text'] = $hidden->text;
                    $arrCampos[$i]['idcampo'] = $hidden->idcampo;
                    $arrCampos[$i]['campo'] = $hidden->campo;
                    $arrCampos[$i]['alias'] = $hidden->alias;
                    $arrCampos[$i]['tipo'] = $hidden->tipodato;
                    $arrCampos[$i]['esquema'] = $hidden->esquema;
                    $arrCampos[$i]['tabla'] = $hidden->tabla;
                    $arrCampos[$i]['sqlselect'] = $hidden->sqlselect;
                    ++$i;
                }
            }
        }

        //Agrega al campo en caso de que se pueda usar como condicion el dato de sqlWhere
        foreach ($arrCampos as &$campo)
        {

            foreach ($arrConfigCondicion as $confCondicion)
            {
                if ($campo['idcampo'] == $confCondicion['idcampo'])
                {
                    if ((String) $confCondicion['usarcondicion'] == '1')
                    {
                        $campo['idtabla'] = (String) $confCondicion['idtabla'];
                        $campo['usarcondicion'] = (String) $confCondicion['usarcondicion'];
                        $campo['tipo'] = (String) $confCondicion['tipodato'];
                        $campo['sqlwhere'] = (String) $confCondicion['sqlwhere'];
                        break;
                    }
                }
            }
        }
        $i = 0; //Vuelvo a poner $i en 0 (Esto es importante)
        //Preparo el arreglo de condiciones para darselo a la clase generadora del SQL
        foreach ($pCondiciones as $k => $condicion)
        {

            if ($condicion->tipo == 'pabierto' || $condicion->tipo == 'pcerrado')
            {

                $arrCondiciones[$i]['condicion'] = '';
                $arrCondiciones[$i]['valor'] = '';
                $arrCondiciones[$i]['logico'] = $condicion->logico;
                $arrCondiciones[$i]['tipo'] = $condicion->tipo;
                $arrCondiciones[$i]['idcampo'] = '';
                $arrCondiciones[$i]['campo'] = '';
                $arrCondiciones[$i]['esquema'] = '';
                $arrCondiciones[$i]['tabla'] = '';
                $arrCondiciones[$i]['idtabla'] = '';
                $i++;
            } else
            {

                foreach ($arrConfigCondicion as $confCondicion)
                {

                    if ($condicion->idcampo == $confCondicion['idcampo'])
                    {
                        $arrCondiciones[$i]['condicion'] = $condicion->condicion;
                        $arrCondiciones[$i]['operador'] = $condicion->operador;
                        $arrCondiciones[$i]['valor'] = $condicion->valor;

                        if (count($pCondiciones) - 1 != $k)
                            $arrCondiciones[$i]['logico'] = $condicion->logico;
                        else
                            $arrCondiciones[$i]['logico'] = '';
                        $arrCondiciones[$i]['tipo'] = $condicion->tipo;
                        $arrCondiciones[$i]['idcampo'] = $condicion->idcampo;
                        $arrCondiciones[$i]['esquema'] = (String) $confCondicion['esquema'];
                        $arrCondiciones[$i]['tabla'] = (String) $confCondicion['tabla'];
                        $arrCondiciones[$i]['campo'] = (String) $confCondicion['campo'];
                        $arrCondiciones[$i]['idtabla'] = (String) $confCondicion['idtabla'];
                        $arrCondiciones[$i]['usarcondicion'] = (String) $confCondicion['usarcondicion'];
                        $arrCondiciones[$i]['tipo'] = (String) $confCondicion['tipodato'];
                        $arrCondiciones[$i]['sqlwhere'] = (String) $confCondicion['sqlwhere'];
                        $i++;
                        break;
                    }
                }
            }
        }

        $this->generarSQLModel = new generarSQLExportarModel(
                $idconfiguracion, $arrCampos, $arrCondiciones, $orderby, $arrOperacion, $arrFilters, $extraParams
        );

        $this->sql = $this->generarSQLModel->getSQL();

        $this->sqlTotal = $this->generarSQLModel->getSQLTotal();

        $this->paramsCompartimentacion = $this->generarSQLModel->getParamsCompartimentacion();
        $this->arrTablasVisitadas = $this->generarSQLModel->getArrTablasCondiciones();
    }

    public function ejecutarSQL($operacion = 0)
    {
        $query = Doctrine_Manager::getInstance();
        $result = new stdClass();

        $query->getCurrentConnection()->execute("SET enable_seqscan TO FALSE;");
        $query->getCurrentConnection()->execute("SET enable_indexscan TO TRUE;");

		$query->getCurrentConnection()->execute("SET enable_seqscan TO FALSE;");
		$query->getCurrentConnection()->execute("SET enable_indexscan TO TRUE;");
		
        $result->datos = $query->getCurrentConnection()->execute($this->sql, $this->paramsCompartimentacion)->fetchAll(
                PDO::FETCH_ASSOC
        );
		if($operacion < 1){
			$temp = $query->getCurrentConnection()->execute($this->sqlTotal, $this->paramsCompartimentacion)->fetchAll(
					PDO::FETCH_ASSOC
			);
			$result->cantidad = $temp[0]['cantidad'];
		}
       else{
			$result->cantidad = count($result->datos);
		}

        $result->sqlPrueba = $this->sql;

        return $result;
    }

    public function ejecutarSQLParam($pSql, $idconfiguracion = '')
    {
        $paramsCompartimentacion = null;
        if ($idconfiguracion == '')
        {
            $query = Doctrine_Manager::getInstance();
            $datos = $query->getCurrentConnection()->execute($pSql, $this->paramsCompartimentacion)->fetchAll(
                    PDO::FETCH_ASSOC
            );

            return $datos;
        } else
        {

            /* $dirFicheroCompartimentar
              = $this->direccionModulo . 'comun/recursos/config_' . $idconfiguracion . '/compartimentacion.php'; */

            $dir_www = $_SERVER['DOCUMENT_ROOT'];
            $dirFicheroCompartimentar = str_replace('web', 'apps', $dir_www) . '/reccomplejas/comun/recursos/config_reccomplejas/config_'
                    . $idconfiguracion . '/compartimentacion.php';

            require_once($dirFicheroCompartimentar);
            $query = Doctrine_Manager::getInstance();
            $datos = $query->getCurrentConnection()->execute($pSql, $paramsCompartimentacion)->fetchAll(
                    PDO::FETCH_ASSOC
            );

            return $datos;
        }
    }

    /*  Servicio de búsqueda
      $parametros[0] = equivale al idaviso
      $parametros[1] = equivale al idevento
     */

    public function actualizaAvisoBusqueda($params)
    {
        $sqlfinal = '';
        $sqlinicial = 'SELECT distinct 1 FROM (';
        $sqlwhere = '';
        $sqlBusquedaPorAviso = 'SELECT b.idbusqueda, b.idusuario, b.arrideventos, b.idconfiguracion, c.denominacion FROM mod_reccomplejas.dat_busqueda b
							INNER JOIN mod_reccomplejas.nom_configuracion c ON b.idconfiguracion = c.idconfiguracion
							WHERE b.idaviso = ' . $params['idaviso'];

        $busqueda = $this->getDatos($sqlBusquedaPorAviso);
        if ($busqueda[0]['idbusqueda'] == null)
        {
            return array('success' => false, 'data' => array());
        }
        $sqlCantBusqueda = 'SELECT count(b.idbusqueda) as cantidad FROM mod_reccomplejas.dat_busqueda b WHERE b.idbusqueda = '
                . $busqueda[0]['idbusqueda'];
        $arrCant = $this->getDatos($sqlCantBusqueda);
        if ($arrCant[0]['cantidad'] == 0)
        {
            return array('success' => false, 'data' => array());
        }
        if ($busqueda[0]['arrideventos'] != '')
        {
            $sqlwhere = ') as consulta WHERE consulta._idtablabase = ' . $params['idevento']
                    . ' AND consulta._idtablabase NOT IN (' . $busqueda[0]['arrideventos'] . ')';
        } else
        {
            $sqlwhere = ') as consulta WHERE consulta._idtablabase = ' . $params['idevento'];
        }
        $datosbusqueda = $this->getSqlBusqueda($busqueda[0]['idconfiguracion'], $busqueda[0]['idbusqueda']);
        $sqlfinal = $sqlinicial . $datosbusqueda->sql . $sqlwhere;
        $datosbusqueda->params[1] = $busqueda[0]['idusuario']; //Id del usuario que creó el aviso.
        $result = $this->getDatos($sqlfinal, $datosbusqueda->params);

        if (empty($result))
        {
            return array('success' => false, 'data' => array());
        } else
        {
            $sqlDatosGenerales = 'SELECT d.denominacion, d.contenido FROM mod_incidencia.dat_datosgenerales d WHERE d.iddatosgenerales = '
                    . $params['idevento'];
            $datoGeneral = $this->getDatos($sqlDatosGenerales);

            $denomRecurso = strtolower($busqueda[0]['denominacion']);
            $data = array('Denominación de ' . $denomRecurso => $datoGeneral[0]['denominacion'],
                'Descripción de ' . $denomRecurso => $datoGeneral[0]['contenido']);
            /* if($busqueda[0]['arrideventos'] != ''){
              $busqueda[0]['arrideventos'] = $busqueda[0]['arrideventos'].','.$params['idevento'];
              }
              else{
              $busqueda[0]['arrideventos'] = $params['idevento'];
              } */
            $arrIdEventos = ($busqueda[0]['arrideventos'] != '') ? explode(',', $busqueda[0]['arrideventos']) : array();
            if (!in_array($params['idevento'], $arrIdEventos))
            {
                if ($busqueda[0]['arrideventos'] != '')
                {
                    $busqueda[0]['arrideventos'] = $busqueda[0]['arrideventos'] . ',' . $params['idevento'];
                } else
                {
                    $busqueda[0]['arrideventos'] = $params['idevento'];
                }

                $sqlUpdate = "UPDATE mod_reccomplejas.dat_busqueda SET arrideventos = '" . $busqueda[0]['arrideventos']
                        . "' WHERE idbusqueda = " . $busqueda[0]['idbusqueda'];
                $objDoctrineManager = Doctrine_Manager::getInstance();
                $result = $objDoctrineManager->getCurrentConnection()->execute($sqlUpdate);

                return array('success' => true, 'data' => $data);
            }

            return array('success' => false, 'data' => array());
        }
    }

    public function getDatos($sql, $params = null)
    {
        $query = Doctrine_Manager::getInstance();
        if ($params != null)
        {
            $result = $query->getCurrentConnection()->execute($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
        } else
        {
            $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        }

        return $result;
    }

    public function getSqlBusqueda($idconfiguracion, $idbusqueda, $limit = '', $start = '')
    {
        $objDatSelectores = new DatSelectores();
        $arrSelectores = $objDatSelectores->getSelectores($idbusqueda);
        $campos = array();
        foreach ($arrSelectores as $selector)
        {
            $arrAux = array();
            $arrAux[] = 'a';
            $arrAux[] = '';
            $arrAux[] = $selector['idmostrar'];
            $arrAux[] = $selector['idmetadato'];
            $campos[] = $arrAux;
        }
        $objDatCondiciones = new DatCondiciones();
        $arrCondiciones = $objDatCondiciones->getCondiciones($idbusqueda);
        $condiciones = array();
        foreach ($arrCondiciones as $condicion)
        {
            $arrAux = array();
            $arrAux[] = $condicion['condicion'];
            $arrAux[] = $condicion['valor'];
            $arrAux[] = $condicion['logico'];
            $arrAux[] = $condicion['idcondicion'];
            $arrAux[] = $condicion['idmetadato'];
            $arrAux[] = $condicion['tipo'];
            $condiciones[] = $arrAux;
        }
        $objDatOperacion = new DatOperacion();
        $arrOperaciones = $objDatOperacion->getOperacion($idbusqueda);
        $objDatOrden = new DatOrden();
        $arrOrden = $objDatOrden->getOrden($idbusqueda);
        $orderby = array();
        foreach ($arrOrden as $orden)
        {
            $arrAux = array();
            $arrAux[] = $orden['tipoorden'];
            $arrAux[] = $orden['idmostrar'];
            $arrAux[] = $orden['idmetadato'];
            $orderby[] = $arrAux;
        }
        $this->generaSQLs($idconfiguracion, $campos, $condiciones, $orderby, $arrOperaciones, $limit, $start);
        $result = new stdClass();
        $result->sql = $this->sql;
        $result->params = $this->paramsCompartimentacion;

        return $result;
    }

    public function activarDesactivarAviso()
    {
        
    }

    /**
     * Metodo recursivo para obtener las hojas del arbol de selectores
     *
     * @author Ing. Javier Rodriguez Lopez
     *
     * @param array $selectores
     *
     * @return array $array
     */
    public function getHojas($selectores)
    {
        $array = array();
        foreach ($selectores as $campo)
        {
            if (empty($campo->campo))
            {
                $childrens = $this->getHojas($campo->children);
                $array = array_merge($array, $childrens);
            } else
            {
                $array[] = $campo;
            }
        }

        return $array;
    }

    public function getTreeFields($idconfiguracion, $idusuario)
    {
        $direccion = $this->direccionModulo .
                "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
        $selectores = file_get_contents($direccion);
        $role = ZendExt_IoC::getInstance()->seguridad->getRolesbyUser($idusuario);

        //Lee el xml de acceso
        $objXML = new ReadXmlRec($idconfiguracion);
        $listAcceso = $objXML->getXML('acceso_rol.xml');

        if ($listAcceso->{'role_' . $role[0]['idrol']})
        {
            $strAccess = (String) $listAcceso->{'role_' . $role[0]['idrol']}['access'];
            $arrAccess = explode(',', $strAccess);
            $selectores = json_decode($selectores);
            $this->changeTreeFields($selectores, $arrAccess);

            return json_encode($selectores);
        }

        return $selectores;
    }

    private function changeTreeFields(&$selectores, $arrAccess)
    {
        foreach ($selectores as $key => $selector)
        {
            if ($selector->obligatorio != 1)
            {

                if (!in_array($selector->idcampo, $arrAccess))
                {
                    array_splice($selectores, $key, 1);
                } else
                {
                    if (count($selector->children) > 0)
                    {
                        $this->changeTreeFields($selector->children, $arrAccess);
                    }
                }
            }
        }
    }

    /*     * ****************Funcion para pintar encabezado de un excel exportando************************ */

    public function fnPintarEncabezado(&$objPHPExcel, $campos)
    {
        //CODIGO DE PHP EXEL
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Exportando datos');
        $count = 1;
        foreach ($campos as $c)
        {
            $letra = ($count < 27) ? chr($count + 64) : 'A' . chr($count + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letra . '1', $c->text);
            $this->fnAlinearTexto($objPHPExcel, $letra . '1', 'center', 'center', 0);
            $this->fnFuenteTexto($objPHPExcel, $letra . '1', 'Arial', 12, true);
            $this->fnPintarBordes($objPHPExcel, $letra . '1', 'right', PHPExcel_Style_Border::BORDER_DOUBLE);
            $this->fnPintarBordes($objPHPExcel, $letra . '1', 'left', PHPExcel_Style_Border::BORDER_DOUBLE);
            $this->fnPintarBordes($objPHPExcel, $letra . '1', 'bottom', PHPExcel_Style_Border::BORDER_DOUBLE);
            $this->fnPintarBordes($objPHPExcel, $letra . '1', 'top', PHPExcel_Style_Border::BORDER_DOUBLE);
            //Cambiandole la dimensión a las filas
            $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(40);
            //Cambiandole la dimensión a las columnas
            $objPHPExcel->getActiveSheet()->getColumnDimension($letra)->setWidth(35);
            $count++;
        }
    }

    /*     * *******************Funcion para pintar el cuerpo del excel************************** */

    public function fnPintarCuerpo(&$objPHPExcel, $result, $campos)
    {
        $count = 1;
        foreach ($campos as $c)
        {
            $numerocelda = 2;
            $letra = ($count < 27) ? chr($count + 64) : 'A' . chr($count + 38);
            foreach ($result->datos as $r)
            {

                $objPHPExcel->getActiveSheet()->setCellValue($letra . $numerocelda, $r[$c->alias]);
                $this->fnAlinearTexto($objPHPExcel, $letra . $numerocelda, 'center', 'center', 0);
                $this->fnFuenteTexto($objPHPExcel, $letra . $numerocelda, 'Arial', 12);
                $this->fnPintarBordes($objPHPExcel, $letra . $numerocelda, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letra . $numerocelda, 'left', PHPExcel_Style_Border::BORDER_DOUBLE);
                $this->fnPintarBordes($objPHPExcel, $letra . $numerocelda, 'bottom', PHPExcel_Style_Border::BORDER_DOUBLE);
                $this->fnPintarBordes($objPHPExcel, $letra . $numerocelda, 'top', PHPExcel_Style_Border::BORDER_DOUBLE);
                $numerocelda++;
            }
            $count++;
        }
    }

    /** Funcionalidad para alinear los textos de las celdas
     */
    public function fnAlinearTexto(&$objPHPExcel, $celda, $hor, $ver, $rot)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()->applyFromArray(
                array(
                    'horizontal' => $hor,
                    'vertical' => $ver,
                    'rotation' => $rot, //0 ó 90
                    'wrap' => TRUE
                )
        );
    }

    /** Funcionalidad para dar la fuente a los textos
     */
    public function fnFuenteTexto(&$objPHPExcel, $celda, $name, $size, $bold = false)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()->applyFromArray(
                array(
                    'name' => $name,
                    'bold' => $bold,
                    'italic' => FALSE,
                    'strike' => FALSE,
                    'size' => $size,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
        );
    }

    /** Funcionalidad para el formato numérico
     */
    public function fnFormatoNumeros(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getNumberFormat()->applyFromArray(
                array(
                    'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
                )
        );
    }

    /** Funcionalidad para crear los bordes de las celdas
     */
    public function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()->applyFromArray(
                array(
                    $lado => array(
                        'style' => $tipoborde,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
        );
    }

   /* public function obtenerReporteExportar($idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start, $extraParams)
    {
        $count = 0;
        if (count($operacion) == 1 || count($operacion) == 0)
        {

            $operacionNew->campo = $operacion[0]->campo;
            $operacionNew->idcampo = $operacion[0]->idcampo;
            $operacionNew->tooltip = $operacion[0]->tooltip;
            $operacionNew->tipoOperacion = $operacion[0]->tipoOperacion;
            $operacionNew->nombreOperacion = $operacion[0]->nombreOperacion;

            //Generar el sql

            $this->generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, $operacionNew, $limit, $start, $extraParams
            );
            $result = $this->ejecutarSQL();
        } else
        {
            $objRecuperacionesModel = new RecuperacionesModel();

            $operacionNew->campo = $operacion[0]->campo;
            $operacionNew->idcampo = $operacion[0]->idcampo;
            $operacionNew->tooltip = $operacion[0]->tooltip;
            $operacionNew->tipoOperacion = $operacion[0]->tipoOperacion;
            $operacionNew->nombreOperacion = $operacion[0]->nombreOperacion;

            $this->generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, $operacionNew, $limit, $start, $extraParams
            );

            $result = $this->ejecutarSQL();

            $consulta = explode('LEFT JOIN', $result->sqlPrueba); //consulta[1]-------------los left join

            $consultausar = $consulta[1];

            if (count($consulta) == 2)
            {
                $consulta = explode('WHERE', $consulta[1]);
                $consultausar = $consulta[0];
            }


            $verrepeticionab1 = substr_count($consultausar, "ab1");



            $consultatotal = explode('GROUP BY', $consulta[2]); //$consultatotal[0]----------losleft join

            $verrepeticionab2 = substr_count($consultatotal[0], "ab2");

            $consultaalias = explode(' ', $consultatotal[0]); //$consultatotal[0]


            $operacionNew->campo = $operacion[1]->campo;
            $operacionNew->idcampo = $operacion[1]->idcampo;
            $operacionNew->tooltip = $operacion[1]->tooltip;
            $operacionNew->tipoOperacion = $operacion[1]->tipoOperacion;
            $operacionNew->nombreOperacion = $operacion[1]->nombreOperacion;

            $this->generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, $operacionNew, $limit, $start, $extraParams
            );

            $result1 = $this->ejecutarSQL();

            $consul1 = explode('WHERE', $result1->sqlPrueba); //consulta[0]

            $consultwhere = explode('GROUP BY', $consul1[1]); //consulta[0]

            $verb1 = substr_count($consul1[0], "ab1");
            $verb2 = substr_count($consultatotal[0], "ab2");

            if ($verrepeticionab1 > 0 && $verb1 > 0)
            {
                $buscar = 'ab1';
                $reemplazar = 'ab5';
                $cadena = $consultausar;
                $cadenatotal = $consultatotal[0];

                $consultausar = str_replace($buscar, $reemplazar, $cadena);
                $consultatotal[0] = str_replace($buscar, $reemplazar, $cadenatotal);
            }

            if ($verrepeticionab2 > 0 && $verb2 > 0)
            {
                $buscar = 'ab2';
                $reemplazar = 'ab6';
                $cadena = $consultatotal[0];
                $cadenatotal = $consultatotal[1];
                $alias = $consultaalias[2];

                $consultatotal[0] = str_replace($buscar, $reemplazar, $cadena);
                $consultatotal[1] = str_replace($buscar, $reemplazar, $cadenatotal);
                $consultaalias[2] = str_replace($buscar, $reemplazar, $alias);
            }

            $arrayposicion = array();
            $arraytipo = array();
            $contadortipo = 0;
            for ($i = 0; $i < count($result->datos); $i++)
            {

                if (count($consulta) >= 2)
                {
                    if ($consultatotal[0] != '' || $consultatotal[0] != null)
                    {
                        $consultacompleta = $consul1[0] . ' LEFT JOIN' . $consultausar . ' LEFT JOIN' . $consultatotal[0] . 'AND' . ' ' . $consultaalias[2] . '.denominacion ilike' . ' ' . "'%" . $result->datos[$i][$operacion[0]->campo] . "%'" . ' GROUP BY' . $consultwhere[1];
                    } else if ($operacion[0]->campo == 'Edad')
                    {
                        $valor = $result->datos[$i][$operacion[0]->campo];

                        $aliasconsulta = explode(' ', $consultausar);

                        $valorconsulta = explode(' ', $valor);
                        $tablafunction = "date_part('year',age($aliasconsulta[2].fechanacimiento))";

                        $consultacompleta = $consul1[0] . " LEFT JOIN" . $consultausar . " WHERE " . $tablafunction . " =" . $valorconsulta[0] . ' GROUP BY' . $consultwhere[1];
                    }
                } else
                {

                    if ($operacion[0]->campo == 'No. Identidad')
                    {
                        $consultacompleta = $consul1[0] . ' LEFT JOIN' . $consultausar . 'WHERE ab0.feliminado IS NULL AND' . ' ' . 'ab1.numero ilike' . ' ' . "'%" . $result->datos[$i][$operacion[0]->campo] . "%'" . ' GROUP BY' . $consultwhere[1];
                    } else if ($operacion[0]->campo == 'Estatura')
                    {
                        $consultacompleta = $consul1[0] . ' LEFT JOIN' . $consultausar . 'WHERE ab0.feliminado IS NULL AND' . ' ' . 'ab1.estatura =' . $result->datos[$i][$operacion[0]->campo] . ' GROUP BY' . $consultwhere[1];
                    } else if ($operacion[1]->campo == 'Edad')
                    {
                        $campobd = strtolower($operacion[0]->campo);
                        if ($operacion[0]->campo == 'Sexo')
                        {
                            if ($result->datos[$i][$operacion[0]->campo] == 'Masculino')
                            {
                                $valor = 1;
                            } else
                            {
                                $valor = 0;
                            }
                            $consultacompleta = $consul1[0] . 'WHERE ab0.feliminado IS NULL AND' . ' ' . 'ab0' . '.' . $campobd . '=' . $valor . ' GROUP BY' . $consultwhere[1];
                        } else
                        {
                            $consultacompleta = $consul1[0] . 'WHERE ab0.feliminado IS NULL AND' . ' ' . $operacion[1]->esquema . $operacion[1]->tabla . '.' . $campobd . '=' . $result->datos[$i][$operacion[0]->campo] . 'GROUP BY' . $consultwhere[1];
                        }
                    }
                }

                $valor = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($consultacompleta);

                if (count($valor) > 0)
                {
                    if ($contadortipo == 0)
                    {
                        $arraytipo[$contadortipo] = $valor[0][$operacion[1]->campo];
                        $contadortipo++;
                    } else
                    {
                        if (!in_array($valor[0][$operacion[1]->campo], $arraytipo))
                        {
                            $arraytipo[$contadortipo] = $valor[0][$operacion[1]->campo];
                            $contadortipo++;
                        }
                    }
                }
                $control = 0;
                while ($control < count($valor))
                {
                    $result->datos[$i][$operacion[1]->nombreOperacion] = $valor[$control][$operacion[1]->nombreOperacion];
                    $result->datos[$i][$operacion[1]->campo] = $valor[$control][$operacion[1]->campo];
                    $result->datos[$i][$result->datos[$i][$operacion[1]->campo]] = $valor[$control][$operacion[1]->nombreOperacion];

                    $arrayposicion[$control]['denominacion'] = $valor[$control][$operacion[1]->campo];
                    $arrayposicion[$control][$valor[$control][$operacion[1]->campo]] = $arrayposicion[$control][$valor[$control][$operacion[1]->campo]] + $valor[$control][$operacion[1]->nombreOperacion];
                    $control++;
                }
            }

            $contgraficar = 0;
            $cantidad = count($result->datos);
            $result->datos[$cantidad][$operacion[0]->campo] = 'TOTAL';

            for ($i = 0; $i < count($arrayposicion); $i++)
            {
                for ($j = 0; $j < count($arraytipo); $j++)
                {
                    $result->datos[$cantidad][$arraytipo[$j]] = $result->datos[$cantidad][$arraytipo[$j]] + $arrayposicion[$i][$arraytipo[$j]];
                    $contgraficar = $contgraficar + $arrayposicion[$i][$arraytipo[$j]];
                }
            }

            $result->datos[$cantidad]['Cant'] = $contgraficar;
        }

        return $result;
    }*/

    public function obtenerValorCampo($tabla, $esquema, $campo)
    {
        if($campo=='Edad'){
            $consulta ="SELECT DISTINCT(date_part('year',age(".$esquema.".".$tabla.".fechanacimiento)) || 'años') as denominacion" ." FROM ".$esquema.".".$tabla;
        }

        else if($campo=='Sexo'){
            $consulta ="SELECT DISTINCT ((CASE WHEN ".$esquema.'.'.$tabla.".sexo =". 0 ." THEN"."'". Femenino ."'"." WHEN ".$esquema.'.'.$tabla.".sexo =". 1 ." THEN". "'". Masculino ."'" ."END)) as denominacion  FROM ".$esquema.".".$tabla;
        }
        else if($campo=='No. Identidad'){
            $consulta = 'SELECT ' .$esquema.'.'.$tabla.'.numero as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Estatura'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.'dat_fenotipo'.'.estatura) as denominacion FROM mod_persona.dat_persona
			INNER JOIN mod_persona.dat_fenotipo on (mod_persona.dat_fenotipo.idpersona = mod_persona.dat_persona.idpersona)';

        }
        else if($campo=='Contacto'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.contacto) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Nombre'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.nombre) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Primer Apellido'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.papel) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Segundo Apellido'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.sapel) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='País'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.nombrepais) as denominacion FROM '.$esquema.'.'.$tabla;

        }
		else if($campo=='Cuantía'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.cuantia) as denominacion FROM '.$esquema.'.'.$tabla;

        }
		else if($campo=='Provincia'){
            $consulta ='SELECT DISTINCT(' .$esquema.'.'.$tabla.'.denominacion) FROM '.$esquema.'.'.$tabla.' WHERE '.$esquema.'.'.$tabla.'.idnivelestructural= 16';

        }
		 else if($campo=='Municipio'){
			$consulta ='SELECT DISTINCT(' .$esquema.'.'.$tabla.'.denominacion) FROM '.$esquema.'.'.$tabla.' WHERE '.$esquema.'.'.$tabla.'.idnivelestructural= 17';

		}	
        else {
            $consulta ='SELECT DISTINCT(' .$esquema.'.'.$tabla.'.denominacion) FROM '.$esquema.'.'.$tabla;
        }


        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($consulta);
        for($i = 0;$i<count($result);$i++){
            if($result[$i]['denominacion']==''){
                $result[$i]['denominacion']='0';
            }
        }
        return $result;
    }

    public function obtenerReporteCompleto($idconfiguracion, $campos, $condiciones, $operacion, $orderby, $limit, $start, $extraParams)
    {
        $count = 0;
        if (count($operacion) <= 0)
        {
            //Generar el sql
            RecuperacionesModel::generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, array()/* $operacionNew */, $limit, $start, $extraParams
            );
            $result = RecuperacionesModel::ejecutarSQL();
            return $result;
        }
        else if (count($operacion) == 1)
        {
            //Generar el sql
            RecuperacionesModel::generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start, $extraParams
            );
            
            $total = 0;
            $result = RecuperacionesModel::ejecutarSQL(1);

            foreach ($result->datos as $r)
            {
                if ($r['Cantidad'] != '' || $r['Cantidad'] != null || $r['Cantidad'] != 0)
                {
                    $total = $total + $r['Cantidad'];
                }
            }
            $posicion = count($result->datos);
            $result->datos[$posicion]['Cantidad'] = $total;
            $result->datos[$posicion][$operacion[0]->campo] = 'TOTAL';
            return $result;
        } else
        {
            RecuperacionesModel::generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start, $extraParams
            );

            $stdresult= RecuperacionesModel::ejecutarSQL(2);

            /*Transformo el arreglo para que se renderize bien en el grid*/
            $count = 0;
            $result = new stdClass();

            for($i = 0;$i<count($stdresult->datos);$i++){
                       $result->datos[$count][$operacion[0]->nombreOperacion] = $stdresult->datos[$i][$operacion[0]->nombreOperacion];
                       $result->datos[$count][$operacion[0]->campo] = $stdresult->datos[$i][$operacion[0]->campo];
                       $result->datos[$count][$operacion[1]->nombreOperacion] = $stdresult->datos[$i][$operacion[1]->nombreOperacion];
                       $result->datos[$count][$operacion[1]->campo] = $stdresult->datos[$i][$operacion[1]->campo];
                       $result->datos[$count][$stdresult->datos[$i][$operacion[1]->campo]] = $stdresult->datos[$i][$operacion[1]->nombreOperacion];
                       for($j = 0;$j<count($stdresult->datos);$j++){
                           if( $result->datos[$count][$operacion[0]->campo]==$stdresult->datos[$j][$operacion[0]->campo]){
                               $result->datos[$count][$stdresult->datos[$j][$operacion[1]->campo]] = $stdresult->datos[$j][$operacion[1]->nombreOperacion];
                               $result->datos[$count]['total'] = $result->datos[$count]['total'] + $stdresult->datos[$j][$operacion[1]->nombreOperacion];
                           }
                       }
                $count++;
        }
            $resultadofinal = $this->elimina_duplicados($result->datos,$operacion[0]->campo);

            $resultadofinal->sqlPrueba = $stdresult->sqlPrueba;

            $resultadofinal->datos[count($resultadofinal->datos)][$operacion[0]->campo] = 'TOTAL';
			
			$valorcampo = $this->obtenerValorCampo($operacion[1]->tabla,$operacion[1]->esquema,$operacion[1]->campo);

            foreach($valorcampo as $p){
                $contador = 0;
                foreach($resultadofinal->datos as $r){
                    $contador = $contador +  $r[$p['denominacion']];

                }
                $resultadofinal->datos[count($resultadofinal->datos)-1][$p['denominacion']] = $contador;
                $resultadofinal->datos[count($resultadofinal->datos)-1]['total'] =  $resultadofinal->datos[count($resultadofinal->datos)-1]['total']+ $contador;
            }
			$resultadofinal->cantidad = count($resultadofinal->datos);

           return  $resultadofinal;
        }

    }

    private function elimina_duplicados($array, $campo)
    {
        foreach ($array as $sub)
        {
            $cmp[] = $sub[$campo];
        }
        $unique = array_unique($cmp);
        foreach ($unique as $k => $campo)
        {
            $resultado->datos[] = $array[$k];
        }
        return $resultado;
    }

    public function obtenerReporteServicioSoap($idconfiguracion, $campos, $condiciones, $operacion, $orderby, $limit, $start, $extraParams, $idbusqueda)
    {
        $iduser = $extraParams['idusuario'];
        $consultaconfirmar = "SELECT  ab0.idusuario
										  FROM mod_reccomplejas2.dat_busquedausuario ab0
										  WHERE ab0.idusuario = $iduser AND ab0.idbusqueda = $idbusqueda";
        $verificar = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($consultaconfirmar);

        if (count($verificar) > 0)
        {
            $count = 0;
            if (count($operacion) <= 0)
            {
                //Generar el sql
                RecuperacionesModel::generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, array()/* $operacionNew */, $limit, $start, $extraParams
                );
                $resultadofinal = RecuperacionesModel::ejecutarSQL();

            }
            else if (count($operacion) == 1)
            {
                //Generar el sql
                RecuperacionesModel::generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start, $extraParams
                );

                $total = 0;
                $resultadofinal = RecuperacionesModel::ejecutarSQL(1);

                foreach ($resultadofinal->datos as $r)
                {
                    if ($r['Cantidad'] != '' || $r['Cantidad'] != null || $r['Cantidad'] != 0)
                    {
                        $total = $total + $r['Cantidad'];
                    }
                }
                $posicion = count($resultadofinal->datos);
                $resultadofinal->datos[$posicion]['Cantidad'] = $total;
                $resultadofinal->datos[$posicion][$operacion[0]->campo] = 'TOTAL';


            } else
            {
                RecuperacionesModel::generaSQLs(
                    $idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start, $extraParams
                );

                $stdresult= RecuperacionesModel::ejecutarSQL(2);

                /*Transformo el arreglo para que se renderize bien en el grid*/
                $count = 0;
                $result = new stdClass();

                for($i = 0;$i<count($stdresult->datos);$i++){
                    $result->datos[$count][$operacion[0]->nombreOperacion] = $stdresult->datos[$i][$operacion[0]->nombreOperacion];
                    $result->datos[$count][$operacion[0]->campo] = $stdresult->datos[$i][$operacion[0]->campo];
                    $result->datos[$count][$operacion[1]->nombreOperacion] = $stdresult->datos[$i][$operacion[1]->nombreOperacion];
                    $result->datos[$count][$operacion[1]->campo] = $stdresult->datos[$i][$operacion[1]->campo];
                    $result->datos[$count][$stdresult->datos[$i][$operacion[1]->campo]] = $stdresult->datos[$i][$operacion[1]->nombreOperacion];
                    for($j = 0;$j<count($stdresult->datos);$j++){
                        if( $result->datos[$count][$operacion[0]->campo]==$stdresult->datos[$j][$operacion[0]->campo]){
                            $result->datos[$count][$stdresult->datos[$j][$operacion[1]->campo]] = $stdresult->datos[$j][$operacion[1]->nombreOperacion];
                            $result->datos[$count]['total'] = $result->datos[$count]['total'] + $stdresult->datos[$j][$operacion[1]->nombreOperacion];
                        }
                    }
                    $count++;
                }
                $resultadofinal = $this->elimina_duplicados($result->datos,$operacion[0]->campo);

                $resultadofinal->sqlPrueba = $stdresult->sqlPrueba;

                $resultadofinal->datos[count($resultadofinal->datos)][$operacion[0]->campo] = 'TOTAL';

                $valorcampo = $this->obtenerValorCampo($operacion[1]->tabla,$operacion[1]->esquema,$operacion[1]->campo);

                foreach($valorcampo as $p){
                    $contador = 0;
                    foreach($resultadofinal->datos as $r){
                        $contador = $contador +  $r[$p['denominacion']];

                    }
                    $resultadofinal->datos[count($resultadofinal->datos)-1][$p['denominacion']] = $contador;
                    $resultadofinal->datos[count($resultadofinal->datos)-1]['total'] =  $resultadofinal->datos[count($resultadofinal->datos)-1]['total']+ $contador;
                }
                $resultadofinal->cantidad = count($resultadofinal->datos);

            }
            $arrayapk = array();
            $contapk = 0;

            if (count($operacion) == 1)
            {
                foreach ($resultadofinal->datos as $r)
                {
                    $arrayapk[$contapk]['1'] = 'Cantidad' . ' ' . $r[$operacion[0]->nombreOperacion];
                    $arrayapk[$contapk]['campo'] = $r[$operacion[0]->campo];
                    $contapk++;
                }
            } else
            {
                foreach ($resultadofinal->datos as $r)
                {
                    $campo = 1;
                    foreach ($valorcampo as $a)
                    {

                        if ($arrayapk[0]['campo'] == null || $arrayapk[0]['campo'] == '')
                        {

                            if ($r[$a['denominacion']] != null || $r[$a['denominacion']] != '')
                            {
                                $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . $r[$a['denominacion']];
                            } else
                            {
                                $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . '0';
                            }
                            $arrayapk[$contapk]['campo'] = $r[$operacion[0]->campo];
                        } else
                            if ($r[$operacion[0]->campo] != $arrayapk[$contapk]['campo'])
                            {
                                $contapk++;
                                if ($r[$a['denominacion']] != null || $r[$a['denominacion']] != '')
                                {
                                    $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . $r[$a['denominacion']];
                                } else
                                {
                                    $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . '0';
                                }
                                $arrayapk[$contapk]['campo'] = $r[$operacion[0]->campo];
                                $campo++;
                            } else
                            {
                                $campo++;
                                if ($r[$a['denominacion']] != null || $r[$a['denominacion']] != '')
                                {
                                    $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . $r[$a['denominacion']];
                                } else
                                {
                                    $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . '0';
                                }
                            }
                    }
                }
            }
            return $arrayapk;

        } else
        {
            return "La busqueda seleccionada no es del usuario logueado";
        }
    }

    /*public function obtenerServicioBusqueda($idbusqueda, $idusuario)
    {

        if ($idusuario == false)
        {
            $arrayusuario = array();
            $arrayusuario['idusuario'] = $this->global->Perfil->idusuario;
        } else
        {
            $arrayusuario = array('idusuario' => $idusuario);
        }
        $objDatBusqueda = new DatBusqueda();
        $busqueda = $objDatBusqueda->getBusquedaById($idbusqueda);
        $datos = json_decode($busqueda->configuracion);

        $key = 0;
        foreach ($datos->selectores as $r)
        {
            if ($r->esquema == 'mod_persona' || $r->esquema == 'mod_personaext')
            {
                $idcampo = $r->idcampo;
                $c = "SELECT c.denominacion as text,c.descripcion as qtip,c.idconfiguracion as idconfiguracion   FROM mod_reccomplejas2.dat_campo c
                  WHERE c.idcampo = $idcampo";
                $texto = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($c);

                $idconfiguracion = $texto[0]['idconfiguracion'];
                $stdCampos[$key]->text = $texto[0]['text'];
                $stdCampos[$key]->qtip = $texto[0]['qtip'];
                $stdCampos[$key]->idcampo = $r->idcampo;
                $stdCampos[$key]->esquema = $r->esquema;
                $stdCampos[$key]->tabla = $r->tabla;
                $stdCampos[$key]->campo = $r->campo;
                $stdCampos[$key]->alias = $r->alias;
                $stdCampos[$key]->obligatorio = $r->obligatorio;
                $stdCampos[$key]->anchocolumna = $r->anchocolumna;
                $stdCampos[$key]->expander = $r->expander;
                $stdCampos[$key]->renderer = $r->renderer;
                $stdCampos[$key]->agruparcampo = $r->agruparcampo;
                $key++;
            }
        }
        if (count($datos->condiciones) > 0)
        {
            foreach ($datos->condiciones as $key => $r)
            {
                $stdCond[$key]->condicion = $r->condicion;
                $stdCond[$key]->valor = $r->valor;
                $stdCond[$key]->logico = $r->logico;
                $stdCond[$key]->idcampo = $r->idcampo;
                $stdCond[$key]->tipo = $r->tipo;
            }
        } else
        {
            $stdCond = array();
        }

        if (count($datos->operacion) > 0)
        {
            foreach ($datos->operacion as $key => $r)
            {
                $stdOperaciones[$key]->campo = $r->campo;
                $stdOperaciones[$key]->idcampo = $r->idcampo;
                $stdOperaciones[$key]->tooltip = $r->tooltip;
                $stdOperaciones[$key]->tipoOperacion = $r->tipoOperacion;
                if ($key == 1)
                {
                    $stdOperaciones[$key]->nombreOperacion = 'Cant';
                } else
                {
                    $stdOperaciones[$key]->nombreOperacion = $r->nombreOperacion;
                }
                $stdOperaciones[$key]->esquema = $r->esquema;
                $stdOperaciones[$key]->tabla = $r->tabla;
            }
        } else
        {
            $stdOperaciones = array();
        }

        $result = RecuperacionesModel::obtenerReporteServicioSoap($idconfiguracion, $stdCampos, $stdCond, $stdOperaciones, array(), 18, 0, $arrayusuario, $idbusqueda);

        return $result;
    }*/
   /*************************************Servicio que implementa la apk *********************************************/
    public function obtenerServicioBusqueda($idbusqueda)
    {
        $objDatBusqueda = new DatBusqueda();
        $busqueda = $objDatBusqueda->getBusquedaById($idbusqueda);

        $datos = json_decode($busqueda->configuracion);

        $consulta = $busqueda->sqlbusqueda;

        if (count($datos->operacion) > 0)
        {
            foreach ($datos->operacion as $key => $r)
            {
                $stdOperaciones[$key]->campo = $r->campo;
                $stdOperaciones[$key]->idcampo = $r->idcampo;
                $stdOperaciones[$key]->tooltip = $r->tooltip;
                $stdOperaciones[$key]->tipoOperacion = $r->tipoOperacion;
                if ($key == 1)
                {
                    $stdOperaciones[$key]->nombreOperacion = 'Cant';
                } else
                {
                    $stdOperaciones[$key]->nombreOperacion = $r->nombreOperacion;
                }
                $stdOperaciones[$key]->esquema = $r->esquema;
                $stdOperaciones[$key]->tabla = $r->tabla;
            }
        }
        else
        {
            $stdOperaciones = array();
        }

 /**************************Empieza el metodo******************************/
        if (count($stdOperaciones) <= 0)
        {
            $resultadofinal->datos = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($consulta);

        }
        else if (count($stdOperaciones) == 1)
        {
            $resultadofinal->datos = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($consulta);
            $total = 0;
            foreach ($resultadofinal->datos as $r)
            {
                if ($r['Cantidad'] != '' || $r['Cantidad'] != null || $r['Cantidad'] != 0)
                {
                    $total = $total + $r['Cantidad'];
                }
            }
            $posicion = count($resultadofinal->datos);
            $resultadofinal->datos[$posicion]['Cantidad'] = $total;
            $resultadofinal->datos[$posicion][$stdOperaciones[0]->campo] = 'TOTAL';

        }
        else
        {
            $stdresult->datos = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($consulta);

            $count = 0;
            $result = new stdClass();

            for($i = 0;$i<count($stdresult->datos);$i++){
                $result->datos[$count][$stdOperaciones[0]->nombreOperacion] = $stdresult->datos[$i][$stdOperaciones[0]->nombreOperacion];
                $result->datos[$count][$stdOperaciones[0]->campo] = $stdresult->datos[$i][$stdOperaciones[0]->campo];
                $result->datos[$count][$stdOperaciones[1]->nombreOperacion] = $stdresult->datos[$i][$stdOperaciones[0]->nombreOperacion];
                $result->datos[$count][$stdOperaciones[1]->campo] = $stdresult->datos[$i][$stdOperaciones[1]->campo];
                $result->datos[$count][$stdresult->datos[$i][$stdOperaciones[1]->campo]] = $stdresult->datos[$i][$stdOperaciones[1]->nombreOperacion];
                for($j = 0;$j<count($stdresult->datos);$j++){

                    if( $result->datos[$count][$stdOperaciones[0]->campo]==$stdresult->datos[$j][$stdOperaciones[0]->campo]){
                        $result->datos[$count][$stdresult->datos[$j][$stdOperaciones[1]->campo]] = $stdresult->datos[$j][$stdOperaciones[0]->nombreOperacion];
                        $result->datos[$count]['total'] = $result->datos[$count]['total'] + $stdresult->datos[$j][$stdOperaciones[0]->nombreOperacion];
                    }
                }
                $count++;
            }
            $resultadofinal = $this->elimina_duplicados($result->datos,$stdOperaciones[0]->campo);

            $resultadofinal->sqlPrueba = $consulta;

            $resultadofinal->datos[count($resultadofinal->datos)][$stdOperaciones[0]->campo] = 'TOTAL';

            $valorcampo = $this->obtenerValorCampo($stdOperaciones[1]->tabla,$stdOperaciones[1]->esquema,$stdOperaciones[1]->campo);

            foreach($valorcampo as $p){
                $contador = 0;
                foreach($resultadofinal->datos as $r){
                    $contador = $contador +  $r[$p['denominacion']];

                }
                $resultadofinal->datos[count($resultadofinal->datos)-1][$p['denominacion']] = $contador;
                $resultadofinal->datos[count($resultadofinal->datos)-1]['total'] =  $resultadofinal->datos[count($resultadofinal->datos)-1]['total']+ $contador;
            }
            $resultadofinal->cantidad = count($resultadofinal->datos);

        }
        $arrayapk = array();
        $contapk = 0;

        if (count($stdOperaciones) == 1)
        {
            foreach ($resultadofinal->datos as $r)
            {
                $arrayapk[$contapk]['1'] = 'Cantidad' . ' ' . $r[$stdOperaciones[0]->nombreOperacion];
                $arrayapk[$contapk]['campo'] = $r[$stdOperaciones[0]->campo];
                $contapk++;
            }
        } else
        {
            foreach ($resultadofinal->datos as $r)
            {
                $campo = 1;
                foreach ($valorcampo as $a)
                {

                    if ($arrayapk[0]['campo'] == null || $arrayapk[0]['campo'] == '')
                    {

                        if ($r[$a['denominacion']] != null || $r[$a['denominacion']] != '')
                        {
                            $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . $r[$a['denominacion']];
                        } else
                        {
                            $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . '0';
                        }
                        $arrayapk[$contapk]['campo'] = $r[$stdOperaciones[0]->campo];
                    } else
                        if ($r[$stdOperaciones[0]->campo] != $arrayapk[$contapk]['campo'])
                        {
                            $contapk++;
                            if ($r[$a['denominacion']] != null || $r[$a['denominacion']] != '')
                            {
                                $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . $r[$a['denominacion']];
                            } else
                            {
                                $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . '0';
                            }
                            $arrayapk[$contapk]['campo'] = $r[$stdOperaciones[0]->campo];
                            $campo++;
                        } else
                        {
                            $campo++;
                            if ($r[$a['denominacion']] != null || $r[$a['denominacion']] != '')
                            {
                                $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . $r[$a['denominacion']];
                            } else
                            {
                                $arrayapk[$contapk][$campo] = $a['denominacion'] . ' ' . '0';
                            }
                        }
                }
            }
        }
        return $arrayapk;

    }

}
