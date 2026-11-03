<?php

/* * ***************************************************
 * Clase para generar un sql.
 * 													*
 * @author Ing. Javier Rodriguez Lopez
 * @package PVD
 * @subpackage Reccomplejas
 * @version 2.0
 * @copyright UCID-ERP Cuba 10
 * ************************************************* */

class generarSQLExportarModel extends ZendExt_Model
{

    private $sql; //Variable para guardar la consulta final.
    private $sqlTotal; //Variable para guardar la consulta final pero con COUNT(*) para conocer el total.
    private $select; //Variable para guardar los campos a mostrar.
    private $from; //Variable para guardar el from
    private $where; //Variable para guardar las condiciones
    private $orderBy; //Variable donde se va a guardar por que campo se desea ordenar
    private $operacion; //Variable donde se va a guardar el tipo de operaci�n que se desea hacer y sobre que campo se va a hacer.
    private $arrFilters;
    private $camposOrderBy;
    private $groupBy;
    private $extraParams;
    private $arrTablasVisitadas; //Arreglo donde voy a guardar cada una de las tablas que visito asi como el idpersisteJoin y si persite o no.
    private $arrAlias; //Arreglo donde voy a guardar cada uno de los alias de las tablas que visito.
    private $cantTablasVisitadas; //Variable que almacena la cantidad de tablas visitadas.
    private $arrTablasCondiciones; //Arreglo donde voy a guardar las tablas que se utilizaron en las condiciones
    private $dominio;
    private $idconfiguracion;
    //Arreglos cargados de los XML
    private $arrMapeo;
    private $arrConfigMostrar;
    private $arrValoresFormtMostrar;
    private $dirFicheroCompartimentar;
    private $paramsCompartimentacion = array();
    private $selectCompartimentacion;
    private $fromCompartimentacion;
    private $whereCompartimentacion;

    private $arrpKeys;

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function generarSQLModel()
    {
        parent::ZendExt_Model();
    }

    public function __construct(
        $idconfiguracion, $pCampos, $pCondiciones = "", $pOrderBy = array(), $pOperacion = "", $arrFilters = array(), $extraParams = array()
    ) {
        parent::ZendExt_Model();

        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $this->dirFicheroCompartimentar
            = str_replace('web', 'apps', $dir_www) . '/reccomplejas/comun/recursos/config_reccomplejas/config_'
            . $idconfiguracion . '/compartimentacion.php';

        require_once($this->dirFicheroCompartimentar);

        if (function_exists('compartimentar_' . $idconfiguracion)) {
            $methodName = 'compartimentar_' . $idconfiguracion;
            $result = $methodName($extraParams);

            $this->selectCompartimentacion = $result['selectCompartimentacion'];
            $this->fromCompartimentacion = $result['fromCompartimentacion'];
            $this->whereCompartimentacion = $result['whereCompartimentacion'];
            $this->paramsCompartimentacion = $result['paramsCompartimentacion'];
        }

        //Creo un objeto de la clase XML que es la clase que tiene el metodo para leer los xml.
        $objXML = new ReadXmlRec($idconfiguracion);

        $this->campos = $pCampos;
        $this->condiciones = $pCondiciones;
        $this->camposOrderBy = $pOrderBy;
        $this->extraParams = $extraParams;
        $this->idconfiguracion = $idconfiguracion;

        //Obtiene las llaves primarias de la tabla base
        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $dirFielpKey = str_replace('web', 'apps', $dir_www)
            . "/reccomplejas/comun/recursos/config_reccomplejas/config_{$idconfiguracion}/json/pkeys.json";
        $this->arrpKeys = json_decode(file_get_contents($dirFielpKey));

        $this->sql = '';
        $this->sqlTotal = '';
        $this->select = 'SELECT ';
        $this->from = ' FROM ';
        $this->where = ' WHERE ';
        $this->groupBy = '';
        $this->operacion = $pOperacion;
        $this->orderBy = ' ORDER BY ';
        $this->arrFilters = $arrFilters;

        $this->dominio = ""; // Id del dominion por el cual el usuario entro al sistema
        $this->arrTablasVisitadas = array();
        $this->arrAlias = array();
        $this->cantTablasVisitadas = 0;
        $this->arrTablasCondiciones = array();

        //Voy cargando todos los xml
        $this->arrMapeo = $objXML->getXML('mapeo.xml');
        $this->arrConfigMostrar = $objXML->getXML('configuracion_mostrar.xml');
        $this->arrValoresFormtMostrar = $objXML->getXML('campo_multievaluado.xml');
    }

    /**
     * Devuelve las partes del SQL
     *
     * @return type stdClass
     */
    public function getSQLRipeado()
    {
        $objSql = new stdClass();
        $objSql->select = $this->select;
        $objSql->from = $this->from;
        $objSql->where = $this->where;
        $objSql->groupBy = $this->groupBy;
        $objSql->orderBy = $this->orderBy;

        return $objSql;
    }

    public function getSQL()
    {
        $this->generarFrom();
        $this->generarWhere();
        $this->generarSelect();
        $this->generarGroupByOperacion();
        $this->generarOrderBy();

        $this->sql = $this->select . $this->from . $this->where . $this->groupBy .
            $this->orderBy ;

        $selectCount = 'SELECT COUNT (DISTINCT ';

        if ($this->arrpKeys) {
            foreach ($this->arrpKeys as $i => $pKey) {
                if ($i != 0) {
                    $selectCount .= ',';
                }
                $selectCount .= "ab0.{$pKey->campo}";
            }
        }
        $this->sqlTotal = $selectCount . ') as cantidad' . $this->from . $this->where . $this->groupBy;

        return $this->sql;
    }

    public function getSQLTotal()
    {
        return $this->sqlTotal;
    }

    public function getArrTablasVisitadas()
    {
        return $this->arrTablasVisitadas;
    }

    public function getArrTablasCondiciones()
    {
        return $this->arrTablasCondiciones;
    }

    public function getParamsCompartimentacion()
    {
        return $this->paramsCompartimentacion;
    }

    /**
     * Genera todos los join de la consulta
     */
    private function generarFrom()
    {
        $join = ''; //Variable para hacer las uniones
        if (count($this->operacion) > 0) {
            foreach ($this->arrMapeo as $campoXML) { //Recorro el arreglo de mapeo para encontrar el mapeo de esa tabla
                if ($this->operacion['idcampo'] == $campoXML['idcampo']) {
                    $tabla = $this->operacion['esquema'] . '.' . $this->operacion['tabla'];
                    $this->operacion['persisteJoin'] = $campoXML['persisteJoin']
                        . ''; //Le agrego al arreglo de campos el el atributo 'persisteJoin' para poder utilizarlo para conformar el select
                    $this->operacion['idpersisteJoin'] = $campoXML['idpersisteJoin']
                        . ''; ////Le agrego al arreglo de campos el el atributo 'idpersisteJoin' para poder utilizarlo para conformar el select
                    if (count($campoXML->camino->paso) >= 1) {
                        foreach ($campoXML->camino->paso as $paso) {
                            $tablaInicial = $paso->inicio['esquema'] . '.' . $paso->inicio['tabla'];
                            if ($this->cantTablasVisitadas < 1) {
                                $join .= $tablaInicial . " " . $this->getAlia(
                                        $tablaInicial, $paso->inicio['idpersisteJoin'],
                                        $paso->inicio['persisteJoin'] . ''
                                    ) . " ";
                            }
                            $tablaFinal = $paso->final['esquema'] . '.' . $paso->final['tabla'];
                            if ($this->existeAlia(
                                    $tablaFinal, $paso->final['idpersisteJoin'], $paso->final['persisteJoin']
                                ) == false
                            ) { //Pregunto para saber si no se ha hecho la conexion a esa tabla.
                                $join .= $paso->final['tipoConexion'] . ' ' . $tablaFinal . ' ' . $this->getAlia(
                                        $tablaFinal, $paso->final['idpersisteJoin'] . '',
                                        $paso->final['persisteJoin'] . ''
                                    ) . ' ON(';
                                //Aqui trato cuando halla mas de una variable en la parte del ON(...) del JOIN
                                foreach ($paso->final->on as $on) {
                                    $join .= ' ' . $on['logico'] . ' ';
                                    if ($on['campoinicial'] == '(' || $on['campoinicial'] == ')') {
                                        $join .= $on['campoinicial'];
                                        continue;
                                    }
                                    if (strpos($on['campofinal'], '{consulta}') !== false) {
                                        if (strpos($on['campofinal'], '{alias}') !== false) {
                                            $on['campofinal'] = str_replace(
                                                '{alias}', $this->getAlia(
                                                    $tablaFinal, $paso->final['idpersisteJoin'],
                                                    $paso->final['persisteJoin']
                                                ), $on['campofinal']
                                            );
                                        }
                                        $join .= str_replace('{consulta}', '', $on['campofinal']);
                                    } else {
                                        $join .= $this->getAlia(
                                                $tablaFinal, $paso->final['idpersisteJoin'],
                                                $paso->final['persisteJoin']
                                            ) . '.' . $on['campofinal'];
                                    }
                                    $join .= ' ' . utf8_decode($on['operador']) . ' ';

                                    if (strpos($on['campoinicial'], '{consulta}') !== false) {
                                        if (strpos($on['campoinicial'], '{alias}') !== false) {
                                            $on['campoinicial'] = str_replace(
                                                '{alias}', $this->getAlia(
                                                    $tablaInicial, $paso->inicio['idpersisteJoin'] . '',
                                                    $paso->inicio['persisteJoin'] . ''
                                                ), $on['campoinicial']
                                            );
                                        }
                                        $join .= str_replace('{consulta}', '', $on['campoinicial']);
                                    } else {
                                        $join .= $this->getAlia(
                                                $tablaInicial, $paso->inicio['idpersisteJoin'] . '',
                                                $paso->inicio['persisteJoin'] . ''
                                            ) . '.' . $on['campoinicial'];
                                    }
                                }
                                $join .= ') ';
                            }
                        }
                    } else {
                        $join .= $tabla . " " . $this->getAlia(
                                $tabla, $this->operacion['idpersisteJoin'], $this->operacion['persisteJoin']
                            ) . " ";
                    }
                }
            }
        } else {
            if (count($this->campos) > 0) {
                foreach ($this->campos as &$campo)
                { //Empiezo a hacer el JOIN por los campos, despu�s hago lo mismo para las condiciones.
                    foreach ($this->arrMapeo as $campoXML)
                    { //Recorro el arreglo de mapeo para encontrar el mapeo de esa tabla
                        if ($campo['idcampo'] == $campoXML['idcampo']) {
                            $tabla = $campo['esquema'] . '.' . $campo['tabla'];
                            //Le agrego al arreglo de campos el atributo 'persisteJoin' para poder utilizarlo para conformar el select
                            $campo['persisteJoin'] = $campoXML['persisteJoin'] . '';
                            //Le agrego al arreglo de campos el el atributo 'idpersisteJoin' para poder utilizarlo para conformar el select
                            $campo['idpersisteJoin'] = $campoXML['idpersisteJoin'] . '';

                            //Si el campo presenta sql where
//                            if($campo['usarcondicion'] == '1' && !empty($campo['sqlwhere'])){
//                                $totalCondiciones = count($this->condiciones);
//
//                                if($totalCondiciones > 0){
//                                    $this->condiciones[$totalCondiciones-1]['logico'] = 'AND';
//                                }
//                                $this->condiciones[] = $campo;
//                            }

                            if ($this->cantTablasVisitadas < 1 && count($campoXML->camino->paso) == 0) {
                                //Como es la primera tabla no lleva JOIN, solo tengo que concatenarla al FROM.
                                $join .= $tabla . " " . $this->getAlia(
                                        $tabla, $campo['idpersisteJoin'], $campoXML['persisteJoin'] . ''
                                    ) . " ";
                            } else {
                                //Cantidad de pasos a realizar para el join a la tabla del campo
                                $cantPasos = count($campoXML->camino->paso);
                                if ($cantPasos >= 1) {
                                    $iterator = 0;
                                    foreach ($campoXML->camino->paso as $paso) {
                                        $tablaInicial = $paso->inicio['esquema'] . '.' . $paso->inicio['tabla'];
                                        if ($this->cantTablasVisitadas < 1) {
                                            $join .= $tablaInicial . " " . $this->getAlia(
                                                    $tablaInicial, $paso->inicio['idpersisteJoin'],
                                                    $paso->inicio['persisteJoin'] . ''
                                                ) . " ";
                                        }
                                        $tablaFinal = $paso->final['esquema'] . '.' . $paso->final['tabla'];
                                        if ($this->existeAlia(
                                                $tablaFinal, $paso->final['idpersisteJoin'],
                                                $paso->final['persisteJoin']
                                            ) == false
                                        ) {
                                            $join .= $paso->final['tipoConexion'] . ' ' . $tablaFinal . ' ' .
                                                $this->getAlia(
                                                    $tablaFinal, (String)$paso->final['idpersisteJoin'],
                                                    (String)$paso->final['persisteJoin']
                                                ) . ' ON(';
                                            //Aqui trato cuando halla mas de una variable en la parte del ON(...) del JOIN
                                            foreach ($paso->final->on as $on) {
                                                $join .= ' ' . $on['logico'] . ' ';
                                                if ($on['campoinicial'] == '(' || $on['campoinicial'] == ')') {
                                                    $join .= $on['campoinicial'];
                                                    continue;
                                                }

                                                if (strpos($on['campoinicial'], '{php}') !== false) {
                                                    //Verifica la existencia de codigo PHP a ejcutar.
                                                    $methodName = str_replace('{php}', '', $on['campoinicial']);
                                                    //Evalua el codigo php definido como funcion en el fichero de compartimentacion.php
                                                    if (function_exists($methodName)) {
                                                        $on['campoinicial'] = call_user_func($methodName);
                                                    }
                                                }

                                                if (strpos($on['campofinal'], '{php}') !== false) {
                                                    //Verifica la existencia de codigo PHP a ejcutar.
                                                    $methodName = str_replace('{php}', '', $on['campofinal']);
                                                    //Evalua el codigo php definido como funcion en el fichero de compartimentacion.php
                                                    if (function_exists($methodName)) {
                                                        $on['campofinal'] = call_user_func($methodName);
                                                    }
                                                }

                                                if (strpos($on['campofinal'], '{consulta}') !== false) {
                                                    if (strpos($on['campofinal'], '{alias}') !== false) {
                                                        $on['campofinal'] = str_replace(
                                                            '{alias}', $this->getAlia(
                                                                $tablaFinal, $paso->final['idpersisteJoin'],
                                                                $paso->final['persisteJoin']
                                                            ), $on['campofinal']
                                                        );
                                                    }
                                                    $join .= str_replace('{consulta}', '', $on['campofinal']);
                                                } else {
                                                    $join .= $this->getAlia(
                                                            $tablaFinal, $paso->final['idpersisteJoin'],
                                                            $paso->final['persisteJoin']
                                                        ) . '.' . $on['campofinal'];
                                                }
                                                $join .= ' ' . utf8_decode($on['operador']) . ' ';

                                                if (strpos($on['campoinicial'], '{consulta}') !== false) {
                                                    if (strpos($on['campoinicial'], '{alias}') !== false) {
                                                        $on['campoinicial'] = str_replace(
                                                            '{alias}', $this->getAlia(
                                                                $tablaInicial, $paso->inicio['idpersisteJoin'] . '',
                                                                $paso->inicio['persisteJoin'] . ''
                                                            ), $on['campoinicial']
                                                        );
                                                    }
                                                    $join .= str_replace('{consulta}', '', $on['campoinicial']);
                                                } else {
                                                    $join .= $this->getAlia(
                                                            $tablaInicial, $paso->inicio['idpersisteJoin'] . '',
                                                            $paso->inicio['persisteJoin'] . ''
                                                        ) . '.' . $on['campoinicial'];
                                                }
                                            }


                                            $join .= ') ';
                                        }
                                        ++$iterator;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                exit('Error, debe seleccionar algun campo a mostrar.');
            }
        }

        if (!empty($this->arrFilters)) {
            //Si tiene condiciones coje la ultima y le adiciona un operador logico
            if (!empty($this->condiciones)) {
                $this->condiciones[count($this->condiciones) - 1]['logico'] = 'AND';
            }
            //Adiciona un parentesis abierto al final
            $condicion['tipo'] = 'pabierto';
            array_unshift($this->arrFilters, $condicion);

            //Setea un operador logico a los campos que no lo posean
            $c = count($this->arrFilters) - 1;
            foreach ($this->arrFilters as $k => &$f) {
                if (empty($f['logico']) && $k < $c) {
                    $f['logico'] = 'AND';
                }
            }

            //Adiciona un parentesis cerrado al final
            $condicion['tipo'] = 'pcerrado';
            array_push($this->arrFilters, $condicion);

            $this->condiciones = array_merge($this->condiciones, $this->arrFilters);
        }

        if (count($this->condiciones) > 0) {
            foreach ($this->condiciones as &$condicion) {
                foreach ($this->arrMapeo as $condMapeoXML) {
                    if ($condicion['idcampo'] == $condMapeoXML['idcampo'] && $condicion['tipo'] != 'pabierto'
                        && $condicion['tipo'] != 'pcerrado'
                    ) {
                        //Le agrego al arreglo de condiciones el el atributo 'persisteJoin' para poder utilizarlo para conformar el where
                        $condicion['persisteJoin'] = $condMapeoXML['persisteJoin'] . '';
                        //Le agrego al arreglo de condiciones el el atributo 'idpersisteJoin' para poder utilizarlo para conformar el where
                        $condicion['idpersisteJoin'] = $condMapeoXML['idpersisteJoin'] . '';
                        $cantPasos = count($condMapeoXML->camino->paso);
                        if ($cantPasos >= 1) {
                            $iterator = 0;
                            foreach ($condMapeoXML->camino->paso as $paso) {
                                $tablaInicial = $paso->inicio['esquema'] . '.' . $paso->inicio['tabla'];
                                $tablaFinal = $paso->final['esquema'] . '.' . $paso->final['tabla'];
                                $this->addTablaCondicion($paso->final['esquema'] . '.' . $paso->final['tabla']);

                                if ($this->existeAlia(
                                        $tablaFinal, $paso->final['idpersisteJoin'], $paso->final['persisteJoin']
                                    ) == false
                                ) { //Pregunto para saber si ya est� hecha la conexi�n a esa tabla.
                                    $join .= $paso->final['tipoConexion'] . ' ' . $tablaFinal . ' ' . $this->getAlia(
                                            $tablaFinal, $paso->final['idpersisteJoin'] . '',
                                            $paso->final['persisteJoin'] . ''
                                        ) . ' ON(';
                                    //Aqui trato cuando halla mas de una variable en la parte del ON(...) del JOIN
                                    foreach ($paso->final->on as $on) {
                                        $join .= ' ' . $on['logico'] . ' ';
                                        if ($on['campoinicial'] == '(' || $on['campoinicial'] == ')') {
                                            $join .= $on['campoinicial'];
                                            continue;
                                        }

                                        if (is_numeric($on['campofinal'] . '') == true
                                            || strpos($on['campofinal'], '{consulta}') !== false
                                        ) {
                                            $join .= str_replace('{consulta}', '', $on['campofinal']);
                                        } else {
                                            if (strpos($on['campofinal'], '{alias}') !== false) {
                                                $join .= str_replace(
                                                    '{alias}', $this->getAlia(
                                                        $tablaFinal, $paso->final['idpersisteJoin'],
                                                        $paso->final['persisteJoin']
                                                    ), $on['campofinal']
                                                );
                                            } else {
                                                $join .= $this->getAlia(
                                                        $tablaFinal, $paso->final['idpersisteJoin'],
                                                        $paso->final['persisteJoin']
                                                    ) . '.' . $on['campofinal'];
                                            }
                                        }
                                        $join .= ' ' . utf8_decode($on['operador']) . ' ';
                                        if (is_numeric($on['campoinicial'] . '') == true
                                            || strpos($on['campoinicial'], '{consulta}') !== false
                                        ) {
                                            $join .= str_replace('{consulta}', '', $on['campoinicial']);
                                        } else {
                                            $join .= $this->getAlia(
                                                    $tablaInicial, $paso->inicio['idpersisteJoin'] . '',
                                                    $paso->inicio['persisteJoin'] . ''
                                                ) . '.' . $on['campoinicial'];
                                        }
                                    }
                                    //@TODO...

                                    $join .= ') ';
                                }
                                ++$iterator;
                            }
                        }
                    }
                }
            }
        }
        $this->from .= $join;
        $this->from .= $this->fromCompartimentacion; //Concateno esta variable que contiene las conexiones a las tablas de compartimentaci�n
    }

    /**
     * Funcion para adicionar una tabla al arrTablasCondiciones
     *
     * @param: $esquemaTabla Tabla a adicionar en el arrTablasCondiciones
     */
    private function addTablaCondicion($esquemaTabla)
    {
        if (!in_array($esquemaTabla, $this->arrTablasCondiciones)) {
            $this->arrTablasCondiciones[] = $esquemaTabla;
        }
    }

    /*
     * Genera la parte del select de la consulta
     */
    private function generarSelect()
    {
        $this->select .= $this->selectCompartimentacion;
        if (count($this->operacion) > 0) {
            /* if($this->operacion['text'] == 'Total'){
              $this->select .= $this->operacion['tipoOperacion'].'('.$this->getAlia($this->operacion['esquema'].'.'.$this->operacion['tabla'], $this->operacion['idpersisteJoin'], $this->operacion['persisteJoin']).'.'.$this->operacion['nombreCampo']
              .') as "'.$this->operacion['nombreOperacion'].'"';
              } */
            $this->select .= $this->operacion['tipoOperacion'] . '(' . $this->getAlia(
                    $this->operacion['esquema'] . '.' . $this->operacion['tabla'], $this->operacion['idpersisteJoin'],
                    $this->operacion['persisteJoin']
                ) . '.' . $this->operacion['nombreCampo']
                . ') as "' . $this->operacion['nombreOperacion'] . '",' . $this->getAlia(
                    $this->operacion['esquema'] . '.' . $this->operacion['tabla'], $this->operacion['idpersisteJoin'],
                    $this->operacion['persisteJoin']
                ) . '.' . $this->operacion['nombreCampo']
                . ' as "' . $this->operacion['text'] . '"';

        } else {
            if (count($this->campos) > 0) {
                if ($this->arrpKeys) {
                    foreach ($this->arrpKeys as $i => $pKey) {
                        $this->select .= "ab0.{$pKey->campo} AS pkey{$i},";
                    }
                }

                foreach ($this->campos as $campo) {
                    $alias = empty($campo['alias']) ? '_' . $campo['idcampo'] : $campo['alias'];

                    if ($campo['tipo'] == 'MULTIPLESVALORES') {
                        foreach ($this->arrValoresFormtMostrar as $formatMostrar) { //Voy campo por campo
                            if ($campo['idcampo'] == $formatMostrar['idcampo']) {
                                $this->select .= '(CASE';
                                foreach ($formatMostrar->valores as $valor)
                                { //Aqui voy revisando cada uno de los posibles valores que pude tomar
                                    $this->select .= ' WHEN ' . $this->getAlia(
                                            $campo['esquema'] . '.' . $campo['tabla'], $campo['idpersisteJoin'],
                                            $campo['persisteJoin']
                                        ) . "." . $campo['campo']
                                        . ' = \'' . $valor['valor'] . '\' THEN \'' . $valor['denominacion'] . '\'';
                                }
                                $this->select .= ' ELSE \'NO CONOCIDO\' END) AS "' . $alias . '",';
                                break;
                            }
                        }
                    } elseif (!empty($campo['sqlselect'])) {
                        $strConfMostrar = $campo['sqlselect'];
                        if (strpos($campo['sqlselect'], '{alias}') !== false) {
                            $strConfMostrar = str_replace(
                                '{alias}', $this->getAlia(
                                    $campo['esquema'] . '.' . $campo['tabla'], $campo['idpersisteJoin'],
                                    $campo['persisteJoin']
                                ), $strConfMostrar
                            );
                        }
                        if (strpos($campo['sqlselect'], '{campo}') !== false) {
                            $strConfMostrar = str_replace(
                                '{campo}', $this->getAlia(
                                    $campo['esquema'] . '.' . $campo['tabla'], $campo['idpersisteJoin'],
                                    $campo['persisteJoin']
                                ) . '.' . $campo['campo'], $strConfMostrar
                            );
                        }
                        if (strpos($campo['sqlselect'], '{consulta}') !== false) {
                            $this->select
                                .= ' (' . str_replace('{consulta}', '', $strConfMostrar) . ')  AS "' . $alias . '",';
                        } else {
                            $this->select .= ' (' . $strConfMostrar . ')  AS "' . $alias . '",';
                        }

                    } else {
                        $this->select .= $this->getAlia(
                                $campo['esquema'] . '.' . $campo['tabla'], $campo['idpersisteJoin'],
                                $campo['persisteJoin']
                            ) . '.' . $campo['campo'] . " AS \"" . $alias . "\","; //Formato 'alia.campo'
                    }
                }
                $this->select = substr($this->select, 0, -1); //Elimino la ultima coma
            } else {
                exit("Debe seleccionar algun campo a mostrar.");
            }
        }
    }

    /*
     * Funcion que genera la parte del where de la consulta
     */
    private function generarWhere()
    {
        if (count($this->condiciones) > 0) {

            foreach ($this->condiciones as $condicion) {

                if ($condicion['tipo'] == 'pabierto') {
                    $this->where .= '(';
                } else {
                    if ($condicion['tipo'] == 'pcerrado') {
                        $this->where .= ') ' . ($condicion['logico'] != '' ? $condicion['logico'] . ' ' : '');
                    } else {
                        if ($condicion['usarcondicion'] == '0') { //Verifica que el campo se pueda usar como condicion
                            break;
                        }
                        //Caso por defecto en el que no lleva formato ni necesita de nigun sql auxiliar
                        //Campo de la condicion
                        if ($condicion['tipo'] == 'NOMENCLADOR' || $condicion['tipo'] == 'ARBOL'
                            || $condicion['tipo'] == 'NOMENCLADORCOMPLEJO'
                        ) {
                            $campoCondicion = $condicion['idtabla'];
                        } else {
                            $campoCondicion = $condicion['campo'];
                        }

                        //Caso en que se omite el valor que debe tomar la condicion, pues se pregunta por is null o not null.
                        if ($condicion['condicion'] == 'IS NULL' || $condicion['condicion'] == 'IS NOT NULL') {
                            $this->where .= $this->getAlia(
                                    $condicion['esquema'] . '.' . $condicion['tabla'],
                                    $condicion['idpersisteJoin'] . '',
                                    $condicion['persisteJoin'] . ''
                                )
                                . '.' . $campoCondicion . ' ' . $this->getOperador($condicion) . ' '
                                . $condicion['logico'] . ' ';
                            continue;
                        }

                        //Caso en que se omite el valor que debe tomar la condicion, pues se pregunta por is null o not null.
                        if ($condicion['condicion'] == 'IN' || $condicion['condicion'] == 'NOT IN') {
                            $this->isFunctionExecute($condicion);
                            $this->where .= $this->getAlia(
                                    $condicion['esquema'] . '.' . $condicion['tabla'],
                                    $condicion['idpersisteJoin'] . '',
                                    $condicion['persisteJoin'] . ''
                                )
                                . '.' . $campoCondicion . ' ' . $this->getOperador($condicion)
                                . ' (' . $condicion['valor'] . ') ' . $condicion['logico'] . ' ';
                            continue;
                        }

                        //Verifica la existencia de codigo PHP a ejcutar.
                        if (strpos($condicion['valor'], '{php}') !== false) {
                            $methodName = str_replace('{php}', '', $condicion['valor']);
                            //Evalua el codigo php definido como funcion en el fichero de compartimentacion.php
                            if (function_exists($methodName)) {
                                $condicion['valor'] = call_user_func($methodName);
                            }
                        }

                        $strSQLFuncion = '';
                        if (!empty($condicion['sqlwhere'])) {
                            $strSQLFuncion = $condicion['sqlwhere'];
                            if (strpos($strSQLFuncion, '{campo}') !== false) {

                                $strSQLFuncion = str_replace(
                                    '{campo}', $this->getAlia(
                                        $condicion['esquema'] . '.' . $condicion['tabla'],
                                        $condicion['idpersisteJoin'] . '', $condicion['persisteJoin'] . ''
                                    )
                                    . '.' . $campoCondicion, $strSQLFuncion
                                );

                            }

                            if (strpos($strSQLFuncion, '{valor}') !== false) {
                                $strSQLFuncion = str_replace('{valor}', $condicion['valor'], $strSQLFuncion);
                            }

                            if (strpos($strSQLFuncion, '{condicion}') !== false) {
                                $strSQLFuncion = str_replace(
                                    '{condicion}', $this->getOperador($condicion), $strSQLFuncion
                                );
                            }

                            if (strpos($strSQLFuncion, '{alias}') !== false) {
                                $strSQLFuncion = str_replace(
                                    '{alias}', $this->getAlia(
                                        $condicion['esquema'] . '.' . $condicion['tabla'],
                                        $condicion['idpersisteJoin'] . '', $condicion['persisteJoin'] . ''
                                    ), $strSQLFuncion
                                );
                            }

                            //Representa una consulta a la BD y ese resultado se compara con el valor con que el usuario filtra la busqueda
                            if (strpos($strSQLFuncion, '{consulta}') !== false
                            ) {
                                $strSQLFuncion = str_replace('{consulta}', '', $strSQLFuncion);
                            }
                        }

                        if($strSQLFuncion == '') {
                            $strSQLFuncion = $this->getAlia(
                                $condicion['esquema'] . '.' . $condicion['tabla'], $condicion['idpersisteJoin'] . '',
                                $condicion['persisteJoin']).'.'.$campoCondicion;
                        } else {
                            $strSQLFuncion = $strSQLFuncion;
                        }

                        $this->where .= $strSQLFuncion . ' ' . $this->getOperador($condicion)
                            . $this->getValorCond($condicion) . $condicion['logico'] . ' ';
                    }
                }
            }
        } else {
            $this->where = '';
        }

        //Agrego las condiciones que llegan por compartimentacion
        if ($this->whereCompartimentacion != '') {
            if ($this->where == '') {
                $this->where .= ' WHERE ' . $this->whereCompartimentacion;
            } else {
                $this->where .= ' AND ' . $this->whereCompartimentacion;
            }
        }
    }

    private function isFunctionExecute(&$condicion){
        //Verifica la existencia de codigo PHP a ejcutar.
        if (strpos($condicion['valor'], '{php}') !== false) {
            $methodName = str_replace('{php}', '', $condicion['valor']);
            //Evalua el codigo php definido como funcion en el fichero de compartimentacion.php
            if (function_exists($methodName)) {
                $condicion['valor'] = call_user_func($methodName);
            }
        }
    }

    /*
     * Funcion que devuelve el alias de acuerdo a la tabla o lo crea en caso de que no exista
     */
    private function getAlia($tabla, $idpersisteJoin, $persisteJoin)
    {
        $existe = false;
        $alia = '';
        foreach ($this->arrTablasVisitadas as $key => $tablaVisitada)
        { //Busco la tabla para saber si ya fue visitada, en caso de que exista devuelvo el alias generado para ella.
            if ($tablaVisitada['tabla'] == $tabla && $tablaVisitada['persisteJoin'] == $persisteJoin
                && $tablaVisitada['idpersisteJoin'] == $idpersisteJoin
            ) {
                $existe = true;
                //Tanto la tabla como el alias comparten la misma posici�n en sus arreglos correspondientes.
                $alia = $this->arrAlias[$key];
            }
        }
        if ($existe == false) { //Caso en que no exista un alia para esta tabla con esas caracteristicas
            $alia = 'a' . $idpersisteJoin . 'b' . $this->cantTablasVisitadas;
            $this->arrAlias[$this->cantTablasVisitadas] = $alia; //Creo el alias para la tabla
            $arrAux = array('tabla' => $tabla, 'idpersisteJoin' => $idpersisteJoin, 'persisteJoin' => $persisteJoin);
            //Registro la tabla con esas caracteristicas en el arreglo de tablas visitadas
            $this->arrTablasVisitadas[$this->cantTablasVisitadas++] = $arrAux;
        }

        return $alia;
    }

    /**
     * Verifica si ya existe el alias para una tabla dada.
     *
     * @param $tabla
     * @param $idpersisteJoin
     * @param $persisteJoin
     *
     * @return bool
     */
    private function existeAlia($tabla, $idpersisteJoin, $persisteJoin)
    {
        $existe = false;
        foreach ($this->arrTablasVisitadas as $key => $tablaVisitada) { //Busco la tabla para saber si ya fue visitada.
            if ($tablaVisitada['tabla'] == $tabla && $tablaVisitada['persisteJoin'] == $persisteJoin
                && $tablaVisitada['idpersisteJoin'] == $idpersisteJoin
            ) {
                $existe = true;
            }
        }

        return $existe;
    }

    //Genera el GROUP BY cuando se esta elaborando una operacion
    private function generarGroupByOperacion()
    {
        $result = '';
        if (count($this->operacion) > 0) {

            $result = ' GROUP BY ' . $this->getAlia(
                    $this->operacion['esquema'] . '.' . $this->operacion['tabla'], $this->operacion['idpersisteJoin'],
                    $this->operacion['persisteJoin']
                ) . '.' . $this->operacion['nombreCampo'];

        }
        $this->groupBy = $result;
    }

    /**
     * Genera la sintaxis del ORDER BY de una consulta
     */
    private function generarOrderBy()
    {
        $temp = '';
        if (count($this->camposOrderBy) > 0) {
            $cantCamposOperacion = count($this->operacion);
            foreach ($this->camposOrderBy as $llave => $campoOrdenar) {
                if ($cantCamposOperacion > 0) {
                    foreach ($this->arrConfigMostrar as $confMostrar) {
                        if ($this->operacion['idcampo'] == $confMostrar['idcampo']) {
                            if ($confMostrar['llevaformato'] == "0" && $confMostrar['multiplesvalores'] == "0") {
                                $temp .= $this->getAlia(
                                        $this->operacion['esquema'] . '.' . $this->operacion['tabla'],
                                        $this->operacion['idpersisteJoin'], $this->operacion['persisteJoin']
                                    ) . '.' . $this->operacion['nombreCampo'];
                                break;
                            } else {
                                if ($confMostrar['multiplesvalores'] == "1"
                                    && $confMostrar['llevaformato'] == "0"
                                ) { //Caso para cuando un campo puede tomar multiples valores
                                } else {
                                    if ($confMostrar['llevaformato'] == "1"
                                        && $confMostrar['multiplesvalores'] == "0"
                                    ) { //Caso en el que lleva formato
                                        if ($confMostrar['sqlwhere'] != '') {
                                            if (strpos($confMostrar['sqlwhere'], '{alias}') !== false) {
                                                $temp .= ($llave > 0 ? ', ' : '') . '(' . str_replace(
                                                        '{alias}', $this->getAlia(
                                                            $this->operacion['esquema'] . '.'
                                                            . $this->operacion['tabla'],
                                                            $this->operacion['idpersisteJoin'],
                                                            $this->operacion['persisteJoin']
                                                        ), $confMostrar['sqlwhere']
                                                    ) . ')';
                                            }
                                            if (strpos($confMostrar['sqlwhere'], '{campo}') !== false) {
                                                $temp .= ($llave > 0 ? ', ' : '') . '(' . str_replace(
                                                        '{campo}', $this->getAlia(
                                                            $this->operacion['esquema'] . '.'
                                                            . $this->operacion['tabla'],
                                                            $this->operacion['idpersisteJoin'],
                                                            $this->operacion['persisteJoin']
                                                        ) . '.' . $this->operacion['nombreCampo'],
                                                        $confMostrar['sqlwhere']
                                                    ) . ')';
                                            }
                                            if (strpos($confMostrar['sqlwhere'], '{consulta}') !== false) {
                                                $temp .= ($llave > 0 ? ', ' : '') . '(' . str_replace(
                                                        '{consulta}', '', $confMostrar['sqlwhere']
                                                    ) . ')';
                                            }
                                        } else {
                                            exit("El atributo 'sqlwhere' est&aacute; vac&iacute;o.");
                                        }
                                    } else {
                                        exit("El campo no debe tener m&uacute;ltiples valores y llevar formato a la misma vez.");
                                    }
                                }
                            }
                        }
                    }
                    break;
                } else {
                    foreach ($this->campos as $campo) {
                        if ($campo['idcampo'] == $campoOrdenar->idcampo) {
                            $alias = empty($campo['alias']) ? '_' . $campo['idcampo'] : $campo['alias'];
                            $temp .= $alias . ' ' . $campoOrdenar->orden . ',';

                        }
                    }
                }
            }
            $this->orderBy .= substr($temp, 0, -1);;
        } else {
            $this->orderBy = '';
        }
    }



    /**
     * Devuelve el operador a utilizar.
     *
     * @param $cadena
     *
     * @return string
     */
    private function getOperador($condicion)
    {
        if (isset($condicion['operador'])
            && !empty($condicion['operador'])
        ) {//si se define un operador independientemente de la condicion de filtro para el valor
            return $condicion['operador'];
        }
        $cadena = $condicion['condicion'];
        if (strpos($cadena, '%') === false) {
            return $cadena;
        } else {
            return 'ILIKE';
        }
    }

    /**
     * Funcion que maneja y devuelve el valor de la condicion
     *
     * @param $condicion
     *
     * @return string
     */
    private function getValorCond($condicion)
    {
        if (strpos($condicion['valor'], '{php}') !== false) {
            //Verifica la existencia de codigo PHP a ejcutar.
            $methodName = str_replace('{php}', '', $condicion['valor']);
            //Evalua el codigo php definido como funcion en el fichero de compartimentacion.php
            if (function_exists($methodName)) {
                return call_user_func($methodName);
            }
        }

        if ($condicion['tipo'] == 'FECHA') {
            return ' \'' . $condicion['valor'] . '\' ';
        }

        if ($condicion['tipo'] == 'TEXTO') {
            $pos = strpos($condicion['condicion'], 'x');
            if ($pos === false) {
                return ' \'' . $condicion['valor'] . '\' ';
            } else {
                return ' \'' . str_replace('x', $condicion['valor'], $condicion['condicion']) . '\' ';
            }
        }
        return ' ' . $condicion['valor'] . ' ';
    }

}