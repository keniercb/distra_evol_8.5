<?php

/*
 * Clase que se encarga de cargar todos los datos necesarios para gestionar las nominas (Generacion, Certificacion, Aprobacion .... etc)
 * Ing. Frank Rodriguez Berroa
 * Ing. Yadir Martinez Vergara
 * 17/08/2016
 */

class DatGestionarNominasModel extends ZendExt_Model
{
    private $cache;
    var $d;
    var $erroresgenerales = array();
    var $erroresespecificos = array();
    var $conceptospdcalculados = array();
    var $conceptosrmcalculados = array();
    var $valoresnomina = array();
    var $valoresnominaindex = array();
    var $camposnomina = array();
    var $estnomina = array();
    var $retencionescalculadas = array();
    var $descuentoscalculados = array();
    var $subtotales = array();

    private function getCache( $key, $debug = false )
    {

        if(isset($this->cache) && isset($this->cache[$key]) ){
            /* file_put_contents('/var/www/data.txt',
                 $this->cache[$key].$key.chr(13)
             , FILE_APPEND);
 */
            return $this->cache[$key];
        }
        return 'NO-DATA-CACHE-LKJHGFDS';
    }

    private function setCache( $key, $response, $data = '')
    {
        $this->cache[$key] = $response;
        /*file_put_contents('/var/www/data1.txt',
            $data.chr(13)
            , FILE_APPEND);*/
        return $response;

    }

    /**
     * Constructor de la clase.
     */
    public function DatGestionarNominasModel()
    {
        parent::ZendExt_Model();
    }

    /* FUNCION PRINCIPAL, Permite generar, certificar y aprovar las nominas. Acumula y liquida en las submayores */

    public function generarNomina($idelaborarpago, $nombrearchivo, $arrayidnomina, $idplantillanominal, $accion, $modovisualizar, $estado, $identidad)
    {
        $register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'comun/recursos/datosnominas/' . $nombrearchivo;

        //Leyendo el archivo con la configuracion y los datos para generar la nomina
        $datosserializados = file_get_contents($direccion);
        $this->d = unserialize($datosserializados);
        $respuesta = new stdClass();
        $respuesta->errores = "";
        $objCargosocupados = new DatCargosOcupados();
        $objCodContable = new ConfigPersonaCodigoContable();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();


        //$this->guardarNumeroConsecutivoNomina($identidad, $idelaborarpago);
        /*
        $identidadesr = array(200530666, 200530718, 200530719, 200530720, 200530721);
        $identidadesr = array(200530721);
        foreach ($identidadesr as $ident){
            $arrelabpago = DatElaborarPagos::obtenePeriodoPagoEntidad($ident);
            foreach ($arrelabpago as $idelabp){

                $objDatConsecutivosNominaPorPagos = new DatConsecutivosNominaPorPagos();
                $objDatConsecutivosNominaPorPagos->idelaborarpagos = $idelabp['idelaborarpagos'];
                $objDatConsecutivosNominaPorPagos->consecutivo = -1;
                $objDatConsecutivosNominaPorPagos->anno = 2018;
                $objDatConsecutivosNominaPorPagos->save();
            }
        }
        */


        //Si la accion es generar o certificar nominas desaprobadas. O certificar nominas certificadas. Esto cumple para la actualizacion de las nominas certificadas
        if ((($accion == 'GENERAR' || $accion == 'CERTIFICAR') && $estado == 'DESAPROBADAS') || ($accion == 'CERTIFICAR' && $estado == 'CERTIFICADAS')) {
            /* Validaciones generales */
            if ($accion == 'GENERAR' || $accion == 'CERTIFICAR') {
                if (!empty($this->d->validaciones['todos'])) {
                    $respuesta->codigo = 'ERRORES';
                    $respuesta->errores = "";
                    foreach ($this->d->validaciones['todos'] as $te) {
                        $respuesta->errores .= $te . " <br>";
                    }
                    if ($accion == 'GENERAR') {

                        return $respuesta;
                    }
                }
            }
            if ($accion == 'CERTIFICAR') {
                /*Verifico errores antes de certificar*/
                if (!empty($this->d->validaciones['certificar'])) {
                    $respuesta->codigo = 'ERRORES';
                    foreach ($this->d->validaciones['certificar'] as $te) {
                        $respuesta->errores .= $te . " <br>";
                    }
                    return $respuesta;
                }

                /*Verifico dependencias con otros pagos*/
                $sql = "SELECT d.idtipopagodepencia, tp.sepagaadelantado, tp.denominacion
                        FROM mod_nomina.conf_tipopagodependencia d
                        INNER JOIN mod_nomina.nom_tipopago tp ON (tp.idtipopago = d.idtipopagodepencia)
                        WHERE d.idtipopago = ?";
                $rD = $conn->fetchAll($sql, array($this->d->pago[0]['idtipopago']));
                if (!empty($rD)) {/*Si hay dependencias*/
                    $fi = explode('/', $this->d->pago[0]['fechainicioperiodo']);
                    $ff = explode('/', $this->d->pago[0]['fechafinperiodo']);
                    if ($fi[1] == 12) {
                        $fi[1] = 0;
                        $fi[2] = $fi[2] + 1;
                    }

                    $fechainicioperiodo = $this->d->pago[0]['fechainicioperiodo'];
                    $fechafinperiodo = $this->d->pago[0]['fechafinperiodo'];

                    $siguiente_fi = mktime(0, 0, 0, $fi[1] + 1, $fi[0], $fi[2]);
                    $siguiente_ff = mktime(0, 0, 0, $ff[1] + 2, 0, $ff[2]);
                    $finiciosiguiente = date("d/m/Y", $siguiente_fi);
                    $ffinsiguiente = date("d/m/Y", $siguiente_ff);

                    $anterior_fi = mktime(0, 0, 0, $fi[1] - 1, $fi[0], $fi[2]);
                    $anterior_ff = mktime(0, 0, 0, $ff[1], 0, $ff[2]);
                    $finicioanterior = date("d/m/Y", $anterior_fi);
                    $ffinanterior = date("d/m/Y", $anterior_ff);

                    $conterror = 0;
                    $conterrorvacio = 0;
                    $msgerror = '';
                    foreach ($rD as $dp) {
                        $finicio = $fechainicioperiodo;
                        $ffin = $fechafinperiodo;

                        if ($this->d->pago[0]['sepagaadelantado'] == 1 && $dp['sepagaadelantado'] != 1) {
                            $finicio = $finicioanterior;
                            $ffin = $ffinanterior;
                        }

                        if ($this->d->pago[0]['sepagaadelantado'] != 1 && $dp['sepagaadelantado'] == 1) {
                            $finicio = $finiciosiguiente;
                            $ffin = $ffinsiguiente;
                        }

                        //Verifico que exista el periodo de pago
                        $sql = "SELECT dep.idelaborarpagos
                        FROM mod_nomina.dat_elaborarpagos dep
                        WHERE dep.identidad = ? AND dep.idtipopago = ? 
                        AND dep.fechainicioperiodo = '{$finicio}'::date AND dep.fechafinperiodo = '{$ffin}'::date";
                        $rperiodos = $conn->fetchAll($sql, array($this->d->pago[0]['identidad'], $dp['idtipopagodepencia']));
                        if (!empty($rperiodos)) {
                            //Verifico si el pago está certificado o aprobado para este periodo
                            $sql = "SELECT dep.idelaborarpagos
                            FROM mod_nomina.dat_elaborarpagos dep
                            INNER JOIN mod_nomina.dat_nomina dn ON (dn.idelaborarpago = dep.idelaborarpagos)
                            WHERE dep.identidad = ? AND dep.idtipopago = ? 
                            AND dep.fechainicioperiodo = '{$finicio}'::date AND dep.fechafinperiodo = '{$ffin}'::date
                            AND (dn.aprobada != 0)";
                            $r = $conn->fetchAll($sql, array($this->d->pago[0]['identidad'], $dp['idtipopagodepencia']));
                            if (empty($r)) {
                                $conterror++;
                                $msgerror .= $dp['denominacion'] . ", ";
                            }
                        } elseif (empty($rperiodos)) {
                            $conterrorvacio ++;
                            $msgerror .= $dp['denominacion'] . ", ";
                        }
                    }
                    //Dependencias
                    if ($conterror > 0) {
                        $msgnumeropagos = ($conterror > 1) ? " de los pagos: " : " del pago: ";
                        $msgnumeroencuentra = ($conterror > 1) ? " encuentran certificados." : " encuentra certificado.";
                        $respuesta->codigo = 'ERRORES';
                        $respuesta->errores = "El pago que está certificando depende" . $msgnumeropagos . "<b>" . trim($msgerror, ", ") . "</b>"
                            . " que no se" . $msgnumeroencuentra;
                        return $respuesta;
                    }
                    if ($conterrorvacio > 0) {
                        $msgnumeropagos = ($conterror > 1) ? " de los pagos: " : " del pago: ";
                        $msgnumeroencuentra = ($conterror > 1) ? " encuentran elaborado." : " encuentra elaborado.";
                        $respuesta->codigo = 'ERRORES';
                        $respuesta->errores = "El pago que está certificando depende" . $msgnumeropagos . "<b>" . trim($msgerror, ", ") . "</b>"
                            . " que no se" . $msgnumeroencuentra;
                        return $respuesta;
                    }
                }
            }

            /*Capturando los conceptos de pago salario*/
            $conceptopagosalario = array(); //neto
            foreach ($this->d->configestnomina as $campo) {
                if ($campo['esconceptopagosalario'] == 1) {
                    $conceptopagosalario[$campo['idestructuramodelodomina']]['datos'] = $campo;
                }
            }


            /* Calculo de la nómina */
            $contpersonas = 0;
            $arrPlantillas = array();
            $indicesArrayNominas = array();
            foreach ($arrayidnomina as $rnomina) {
                $indicesArrayNominas [$rnomina] = true;
            }
            foreach ($this->d->personas as $ip => $rpers) {
                /* Buscar la persona en una de las plantillas nominales */
                //$existe = $this->buscarPersonasNominas($arrayidnomina, $rpers, $modovisualizar);
                $existe = $this->buscarPersonasNominasIndexado($indicesArrayNominas, $rpers, $modovisualizar);
                if ($existe) {
                    $this->conceptospdcalculados[$rpers['idcargosocupados']] = array();
                    $this->conceptosrmcalculados[$rpers['idcargosocupados']] = array();
                    $this->valoresnomina[$contpersonas]['id'] = $rpers['idpersona'] . '-' . $rpers['idcargosocupados'];//print_r($this->d->configestnomina);die;
                    //Recorriendo los campos de las nominas

                    foreach ($this->d->configestnomina as $icn => $rcn) {
                        $valorconcepto = 0.00;
                        $idestrucnomina = $rcn['idestructuramodelodomina'];
                        $col = "c" . $idestrucnomina;

                        if ($rcn['idtipocampo'] == 1)/* Campos de persona */ {
                            $idvalormostrar = $rcn['idvalormostrar'];
                            $this->valoresnomina[$contpersonas][$col] = $rpers[$idvalormostrar];
                        } else if ($rcn['idtipocampo'] == 2)/* Campos de pago */ {
                            /* Compruebo si se acumula en días las vacaciones para el pluriempleo */
                            if ($rcn['acumulaliquida'] == 1 && !empty($rpers['referencia']) && $rpers['escargoprincipal'] != 1) {
                                $valorconcepto = 0.00;
                            } else {
                                $valorconcepto = $this->buscarValorConcepto($rpers, $rcn, $col);
                                if ($rcn['valoresnegativos'] == 1) {
                                    $valorn = $valorconcepto - (-$valorconcepto);
                                    if ($valorn < 0) {/* Si no se permiten campos negativos y el valor es negativo */
                                        $valorconcepto = number_format(0, 2, '.', '');
                                        $this->erroresespecificos['p' . $rpers['idpersona'] . '-' . $rpers['idcargosocupados']][$col][] = 'Valor negativo: ' . $valorn;
                                    }
                                }

                                /*Sumando el campo que es un concepto de pago de salario*/
                                if (!empty($conceptopagosalario)) {
                                    foreach ($conceptopagosalario as $c => $concep) {
                                        if ($c == $idestrucnomina) {
                                            $conceptopagosalario[$c]['suma'] += $valorconcepto;
                                        }
                                    }
                                }
                            }
                            $this->valoresnomina[$contpersonas][$col] = $valorconcepto;
                        } else if ($rcn['idtipocampo'] == 3)/* Campos agrupados */ {
                            $arrind = array();
                            if (!empty($rcn['indicadores'])) {
                                foreach ($rcn['indicadores'] as $vi) {
                                    $valorInd = 0.00;

                                    if (isset( $this->valoresnomina[$contpersonas]['c' . $vi])) {
                                        $valorInd = $this->valoresnomina[$contpersonas]['c' . $vi];
                                    }
                                    $arrind[] = array('idindicador' => $vi, 'valor' => $valorInd);
                                }
                            }
                            //Evaluando la expresion matematica
                            if (!empty($rcn['expresionacalcular'])) {
                                $valorC = $this->EvaluarExpresionMatematica($arrind, $rcn['expresionacalcular']);
                            } else {
                                $this->erroresespecificos['p' . $rpers['idpersona'] . '-' . $rpers['idcargosocupados']][$col][] = "No existe la fórmula a calcular para la columna " . $rcn['denominacion'] . ".";
                                $valorconcepto = number_format(0, 2, '.', '');
                            }
                            if ($valorC->codigo == 1) {
                                $valorconcepto = number_format($valorC->valor, 2, '.', '');
                            } else {
                                $this->erroresespecificos['p' . $rpers['idpersona'] . '-' . $rpers['idcargosocupados']][$col][] = $valorC->error;
                                $valorconcepto = number_format(0, 2, '.', '');
                            }

                            if ($rcn['valoresnegativos'] != 1) {
                                $valorn = $valorconcepto - (-$valorconcepto);

                                if ($valorn < 0) {/* Si no se permiten campos negativos y el valor es negativo */
                                    $valorconcepto = number_format(0, 2, '.', '');
                                    $this->erroresespecificos['p' . $rpers['idpersona'] . '-' . $rpers['idcargosocupados']][$col][] = 'Valor negativo: ' . $valorconcepto;
                                }
                            }
                            $this->valoresnomina[$contpersonas][$col] = $valorconcepto;


                            /*Sumando el campo que es un concepto de pago de salario*/
                            if (!empty($conceptopagosalario)) {
                                foreach ($conceptopagosalario as $c => $concep) {
                                    if ($c == $idestrucnomina) {
                                        $conceptopagosalario[$c]['suma'] += $valorconcepto;
                                    }
                                }
                            }
                        } else/* Campos referencias de nominas */ {
                            //Si es campo de nomina buscar el campo que lo condiciona (ese campo no puede ser 0)
                            $idestrucnominacond = 0;
                            foreach ($this->d->configestnomina as $rest) {
                                if ($rest['tbd'] == 1) {
                                    $idestrucnominacond = $rest['idestructuramodelodomina'];
                                    break;
                                }
                            }

                            $arrind = array();
                            if (!empty($rcn['indicadores'])) {
                                foreach ($rcn['indicadores'] as $vi) {
                                    $valorInd = 0.00;
                                    $a = explode('_', $vi);
                                    $tipnperiodobusquedaref = $a[0].'-'.$rcn['periodobusquedareferencianomina'];
                                    //if($rcn['tiporeferencia'] == 2 && ($this->d->camposrefnominas[$rpers['idpersona']][$rcn['idestructuramodelodomina']][$a[0]][$a[1]])){print_r($rcn['indicadores']);die;}
                                    if (isset($this->d->camposrefnominas[$rpers['idpersona']])) {
                                        if (isset($this->d->camposrefnominas[$rpers['idpersona']][$rcn['idestructuramodelodomina']] )) {
                                            if (isset($this->d->camposrefnominas[$rpers['idpersona']][$rcn['idestructuramodelodomina']][($rcn['tiporeferencia'] == 2)?$a[0]:$tipnperiodobusquedaref])) {
                                                if (array_key_exists($a[1],($rcn['tiporeferencia'] == 2)?$this->d->camposrefnominas[$rpers['idpersona']][$rcn['idestructuramodelodomina']][$a[0]]:$this->d->camposrefnominas[$rpers['idpersona']][$rcn['idestructuramodelodomina']][$tipnperiodobusquedaref]) ) {
                                                    //Si el campo de la estructura de nomina referencia a nominas por rangos de periodos especificos
                                                    if($rcn['tiporeferencia'] == 2){
                                                        $valorInd = $this->d->camposrefnominas[$rpers['idpersona']][$rcn['idestructuramodelodomina']][$a[0]][$a[1]];
                                                    //Si el campo de la estructura de nomina referencia a nominas por rangos de fechas
                                                    }else{
                                                        $valorInd = $this->d->camposrefnominas[$rpers['idpersona']][$rcn['idestructuramodelodomina']][$tipnperiodobusquedaref][$a[1]];

                                                    }


                                                }
                                            }
                                        }

                                    }
                                    $arrind[] = array('idindicador' => $vi, 'valor' => $valorInd);
                                }
                            }

                            //Evaluando la expresion matematica
                            if (!empty($rcn['expresionacalcular'])) {
                                $valorC = $this->EvaluarExpresionMatematica($arrind, $rcn['expresionacalcular']);
                            } else {
                                $this->erroresespecificos['p' . $rpers['idpersona'] . '-' . $rpers['idcargosocupados']][$col][] = "No existe la fórmula a calcular para la columna " . $rcn['denominacion'] . ".";
                                $valorconcepto = number_format(0, 2, '.', '');
                            }

                            if ($valorC->codigo == 1) {
                                $valorconcepto = number_format($valorC->valor, 2, '.', '');
                            } else {
                                $this->erroresespecificos['p' . $rpers['idpersona'] . '-' . $rpers['idcargosocupados']][$col][] = $valorC->error;
                                $valorconcepto = number_format(0, 2, '.', '');
                            }

                            if ($rcn['valoresnegativos'] != 1) {
                                $valorn = $valorconcepto - (-$valorconcepto);

                                if ($valorn < 0) {/* Si no se permiten campos negativos y el valor es negativo */
                                    $valorconcepto = number_format(0, 2, '.', '');
                                    $this->erroresespecificos['p' . $rpers['idpersona'] . '-' . $rpers['idcargosocupados']][$col][] = 'Valor negativo: ' . $valorconcepto;
                                }
                            }
                            if ($idestrucnominacond == 0) {
                                $this->valoresnomina[$contpersonas][$col] = $valorconcepto;
                            } else {
                                //$this->valoresnomina[$contpersonas][$col] = ($this->valoresnomina[$contpersonas]["c$idestrucnominacond"] != 0) ? $valorconcepto : 0.00;
                                $this->valoresnomina[$contpersonas][$col] = ($valorconcepto) ? $valorconcepto : 0.00;
                                //print_r($this->valoresnomina[$contpersonas]);die;
                            }

                        }
                    }


                    //Concatenando el orden y la denominacion de las plantillas nominales
                    $key =  md5('DatNomina::obtenerIdPlantillaNominalXIdNomina'. serialize( $rpers['idnomina']));
                    $cache = $this->getCache($key);
                    if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
                        $idplantillanominal = $cache;
                    else
                        // FIXME: DatNomina::obtenerIdPlantillaNominalXIdNomina no esta declarada cmo estatica
                        $idplantillanominal = $this->setCache($key,DatNomina::obtenerIdPlantillaNominalXIdNomina($rpers['idnomina']));

                    $key =  md5('ConfPlantillaNominal::obtenerOrdenYDenominacionXId'. serialize($idplantillanominal));
                    $cache = $this->getCache($key);
                    if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
                        $plantilla = $cache;
                    else
                        $plantilla = $this->setCache($key,ConfPlantillaNominal::obtenerOrdenYDenominacionXId($idplantillanominal));
                    //$plantilla = ConfPlantillaNominal::obtenerOrdenYDenominacionXId($idplantillanominal);

                    $divisor = 1;
                    $codigoorden = $this->fnOrganizarPlantillas($plantilla[0]['orden'], $divisor);
                    $this->valoresnomina[$contpersonas]['plantillanominal'] = $codigoorden . "-" . $plantilla[0]['orden'] . '-' . $plantilla[0]['denominacion'];


                    $key =  md5('$objCargosocupados->obtenerCentroCostoxCargoOcupadoText'. serialize($rpers['idcargosocupados']));
                    $cache = $this->getCache($key);
                    if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
                        $centrocosto = $cache;
                    else
                        $centrocosto = $this->setCache($key,$objCargosocupados->obtenerCentroCostoxCargoOcupadoText($rpers['idcargosocupados']));
                    //$centrocosto = $objCargosocupados->obtenerCentroCostoxCargoOcupadoText($rpers['idcargosocupados']);

                    $this->valoresnomina[$contpersonas]['idcentrocosto'] = $centrocosto;
                    $this->valoresnomina[$contpersonas]['idnomina'] = $rpers['idnomina'];
                    $this->valoresnomina[$contpersonas]['idpersona'] = $rpers['idpersona'];
                    $this->valoresnomina[$contpersonas]['nivel'] = $rpers['nivel'];
                    $this->valoresnomina[$contpersonas]['lft'] = $rpers['lft'];
                    $this->valoresnomina[$contpersonas]['cdgocontable'] = $objCodContable->obtenerCodDadoIdPersonaEntidad($rpers['idpersona'], $identidad);
                    $this->valoresnomina[$contpersonas]['idcargosocupados'] = $rpers['idcargosocupados'];
                    $this->valoresnomina[$contpersonas]['numerocuenta'] = $this->denomCuentaBancariaByPersona($rpers['idpersona']);
                    $this->valoresnomina[$contpersonas]['num_ideper'] = $this->denomNum_IdePersonaBancariaById($rpers['idpersona']);

                    $this->valoresnominaindex[$rpers['idnomina']][] = $this->valoresnomina[$contpersonas];

                    $contpersonas++;
                }
                $arrPlantillas[] = $rpers['idplantillanominal'];
            }

            $arrSubTotal = array();

            /* Conforme el arreglo de los campos y de estructura de la nomina - indices para el grid panel */
            $objDomainConceptosRM = new NomConceptoRM();
            $objDomainNomTipoRetencion = new NomTipoRetencion();
            $objDomainConceptosPD = new NomConceptoPercepcionDescuento();
            $objModeloNominaConceptos = new DatDatosModeloNominaConceptos();
            foreach ($this->d->configestnomina as $rcn) {
                //Campos
                $arrCampo = array();
                $arrCampo['indice'] = "c" . $rcn['idestructuramodelodomina'];
                $arrCampo['denominacion'] = $rcn['denominacion'];
                $arrCampo['tipocampo'] = $rcn['idtipocampo'];
                $arrCampo['orden'] = $rcn['orden'];
                $arrCampo['visible'] = $rcn['visible'] == 1 ? true : false;
                $arrCampo['descuento'] = ($rcn['descuento'] == 1) ? true : false;
                $arrCampo['total'] = $rcn['estotal'];
                //Valor Mostrar
                $xml = new NXML('campos_persona.xml');
                $x = $xml->LeerDatosCamposPersona(null, 1); //Cargo todos los campos del XML
                //print_r($x);die;
                $pos = 1;
                foreach ($x as $i => $v) {
                    $datosMostrarPersona[$pos]['valor'] = (string)$v->valor;
                    $datosMostrarPersona[$pos]['denominacion'] = (string)$v->denominacion;
                    $pos++;
                }
                if ($rcn['idtipocampo'] == 1) {
                    $arrCampo['mostrarvalor'] = $datosMostrarPersona[$rcn['idvalormostrar']]['denominacion'];
                } else if ($v['idtipocampo'] == 3) {
                    $arrCampo['mostrarvalor'] = $rcn['textoformula'];

                } else if ($v['idtipocampo'] == 4) {
                    $arrCampo['mostrarvalor'] = $rcn['textoformula'];

                } else {
                    $key =  md5('$objModeloNominaConceptos->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina'. serialize($rcn['idestructuramodelodomina']));
                    $cache = $this->getCache($key);
                    if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
                        $arrModeloNominaConceptos = $cache;
                    else
                        $arrModeloNominaConceptos = $this->setCache($key,$objModeloNominaConceptos->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($rcn['idestructuramodelodomina']));

                    //$arrModeloNominaConceptos = $objModeloNominaConceptos->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($rcn['idestructuramodelodomina']);
                    foreach ($arrModeloNominaConceptos as $s => $n) {
                        $arr = explode('_', $n['idconcepto']);
                        if (count($arr) == 3) {
                            $key =  md5('$objDomainConceptosRM->obtenerDenomXId'. serialize($arr[2]));
                            $cache = $this->getCache($key);
                            if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
                                $arrCampo['mostrarvalor'] = $cache;
                            else
                                $arrCampo['mostrarvalor'] = $this->setCache($key,$objDomainConceptosRM->obtenerDenomXId($arr[2]));

                            //$arrCampo['mostrarvalor'] = $objDomainConceptosRM->obtenerDenomXId($arr[2]);
                        } else if (count($arr) == 2) {
                            $key =  md5('$objDomainNomTipoRetencion->obtenerDenomXId'. serialize($arr[1]));
                            $cache = $this->getCache($key);
                            if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
                                $arrCampo['mostrarvalor'] = $cache;
                            else
                                $arrCampo['mostrarvalor'] = $this->setCache($key,$objDomainNomTipoRetencion->obtenerDenomXId($arr[1]));

                            //$arrCampo['mostrarvalor'] = $objDomainNomTipoRetencion->obtenerDenomXId($arr[1]);
                        } else if (count($arr) == 1) {
                            $arrCampo['mostrarvalor'] = 'Salario escala';
                        } else {

                            $key =  md5('$objDomainConceptosPD->obtenerDenomXId'. serialize($arr[1]));
                            $cache = $this->getCache($key);
                            if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
                                $arrCampo['mostrarvalor'] = $cache;
                            else
                                $arrCampo['mostrarvalor'] = $this->setCache($key,$objDomainConceptosPD->obtenerDenomXId($arr[4]));
                            //$arrCampo['mostrarvalor'] = $objDomainConceptosPD->obtenerDenomXId($arr[4]);
                        }
                    }
                }
                $this->camposnomina[] = $arrCampo;
                //Estructura$estnomina
                $arrEstructura = array();
                $arrEstructura['id'] = $rcn['idestructuramodelodomina'];
                $arrEstructura['denominacion'] = $rcn['denominacion'];
                $arrEstructura['tipocampo'] = $rcn['idtipocampo'];
                $arrEstructura['tipocamposcalcular'] = $rcn['tipo'];
                $arrEstructura['valormostrar'] = $rcn['idvalormostrar'];
                $arrEstructura['expmatcal'] = $rcn['expresionacalcular'];
                $arrEstructura['escampopersona'] = $rcn['escampopersona'];
                $arrEstructura['orden'] = $rcn['orden'];
                $arrEstructura['visible'] = ($rcn['visible'] == 1) ? true : false;
                $arrEstructura['descuento'] = ($rcn['descuento'] == 1) ? true : false;
                $arrEstructura['esconceptopagosalario'] = $rcn['esconceptopagosalario'];
                $camposcalcular = new stdClass();
                $camposcalcular->iddatosmodelonominaconceptos = $rcn['iddatosmodelonominaconceptos'];
                $camposcalcular->idconcepto = $rcn['idconcepto'];
                $camposcalcular->tipoconcepto = $rcn['tipo'];
                $rexplode = array();
                if ($rcn['tipo'] == 3) {
                    $rexplode = explode('_', $rcn['idconcepto']);
                }
                $camposcalcular->campo = $rexplode[count($rexplode) - 1];
                $arrEstructura['camposcalcular'] = $camposcalcular;
                $this->estnomina[$rcn['idestructuramodelodomina']] = $arrEstructura;
            }
            //Salvando las retenciones en el fichero
            file_put_contents($direccion, serialize($this->d));
            $this->camposnomina[] = array('indice' => "plantillanominal", 'denominacion' => "Plantilla nominal");

            if ($accion == 'CERTIFICAR') {
                /*Verifico que el neto total no sea 0*/
                if (!empty($conceptopagosalario)) {
                    $sumatotalcptpagosal = 0;
                    $denomconceptos = '';
                    foreach ($conceptopagosalario as $concep) {
                        $sumatotalcptpagosal += $concep['suma'];
                        $denomconceptos .= $concep['datos']['denominacion'] . ', ';
                    }

                    $denomconceptos = trim($denomconceptos, ', ');
                    if ($sumatotalcptpagosal <= 0) {
                        $msg = ((count($conceptopagosalario) == 1) ? 'El campo <b>' . $denomconceptos . '</b> es un concepto de pago de salario y su monto total no puede ser cero.'
                            : 'Los campos <b>' . $denomconceptos . '</b> son conceptos de pago de salario y sus montos totales no pueden ser cero.');
                        $respuesta->codigo = 'ERRORES';
                        $respuesta->errores = $msg;
                        return $respuesta;
                    }
                }

                //Validando que si la nomina es de Liquidacion de Vacaciones lo que se le este liquidando a las personas no sea mayor al saldo en el submayor
                $objVacaciones = new DatVacacionesPersonaModel();
                if($this->d->pago[0]['acumulavacaciones'] == 2){
                    $vac = $objVacaciones->validarPersonasSaldoLiquidacionVacaciones($this->d->personas, $this->d->vacaciones['submayor'], $this->d->pago[0]['acumulavacaciones'], $this->d->camposacumulanliquidan, $this->valoresnomina);
                    if($vac->codigo == 'NO-SALDO-NEGATIVO'){
                        $respuesta->codigo = $vac->codigo;
                        $respuesta->persona = $vac->persona;
                        return $respuesta;
                    }
                }

                /*Si el tipo de pago para este periodo, depende de un reporte se modifica su estado*/
                $this->fnModificarEstadoReporte($identidad, $idelaborarpago, 3);

                //Si se van a certificar las nominas y hay altas en el submayos de retenciones sin haberse contabilizado se muestra un error
                //Si la nomina no es de reintegros
                if ($this->d->pago[0]['reintegro'] != 1) {
                    $sql = "SELECT * FROM mod_rrhhmaestro.dat_moduloentidad  where identificador ilike 'nomina';";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $modulo = $conn->fetchAll($sql);
                    if (count($modulo) < 0) {
                        $sql = "select * from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $modulo = $conn->fetchAll($sql);
                    }
                    if ($modulo[0]['cobroypago'] == 1) {
                        //Carga inicial de las retenciones para validar quien no tiene comprobante
                        $arrpersonasretenciones = DatRetencionPersona::obtenerListadoRetencionesSinComprobante($identidad, $idelaborarpago);
                        $personassincomp = '';
                        foreach ($arrpersonasretenciones as $pret) {
                            if ($pret['idcomprobante'] == null) {
                                $sqlDatosPersona = "select * from mod_persona.dat_persona dp
						    where dp.idpersona = ?;";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($pret['idpersona']));
                                $personassincomp = $personassincomp . ' ' . $arrdatpersona[0]['nombre'] . ' ' . $arrdatpersona[0]['snombre'] . ' ' . $arrdatpersona[0]['papel'] . ' ' . $arrdatpersona[0]['sapel'] . ',';
                            }
                        }
                        //Si faltan personas por contabilizarle la carga inicial de las retenciones
                        if (strlen($personassincomp) > 0) {
                            $respuesta->cobrosypagos = -1;
                            $respuesta->personas = $personassincomp;
                            $respuesta->codigo = 'CERTIFICADA';
                            return $respuesta;
                        }
                    }
                }

                $sqltn = "SELECT  idtipopago FROM mod_nomina.dat_elaborarpagos where idelaborarpagos = $idelaborarpago;";
                $tipnom = $conn->fetchOne($sqltn);
                /*Si la accion es de certificacion se guarda estado -1 y los datos serializados */
                foreach ($this->valoresnominaindex as $idnomina => $rvalores) {
                    //Primero se elimina de nominadatos los posibles valores que existan de estas nominas
                    $idnominadatos = DatNominaDatos::obtenerIdDatosNominaArray($idnomina);
                    foreach ($idnominadatos as $rnd) {
                        $objDatNominaDatosDelete = Doctrine::getTable('DatNominaDatos')->find($rnd['idnominadatos']);
                        $objDatNominaDatosDelete->delete();
                    }
                    //implementando el guardado de datos en 
                    // Crear mapa de campos
                    // Obtener array de idnomina existentes
                    $objvacaciones = new DatVacacionesPersona();
                    $arrayIdnomina = $objvacaciones->obtenerIdnominaByIdentidad($identidad);
                    
                    $campos = $this->camposnomina;
                    $valores = $rvalores;

                    $map = array();
                    foreach ($campos as $def) {
                        if (isset($def['indice']) && isset($def['denominacion'])) {
                            $indice = $def['indice'];
                            $denominacion = $def['denominacion'];
                            $map[$indice] = $denominacion;
                        } else {
                            error_log("Indice o denominacion faltante en def: " . print_r($def, true));
                        }
                    }

                    // Procesar personas
                    $personas = array();
                    foreach ($valores as $fila) {
                        $json_data = array();
                        foreach ($map as $indice => $nombre) {
                            if (array_key_exists($indice, $fila)) {
                                $json_data[$nombre] = $fila[$indice];
                            }
                        }

                        // Agregar campos no mapeados
                        foreach ($fila as $indice => $valor) {
                            if (!isset($map[$indice])) {
                                $json_data[$indice] = $valor;
                            }
                        }

                        $personas[] = $json_data;
                    }

                    $json_string = json_encode($personas);

                    if (in_array($idnomina, $arrayIdnomina)) {
                        $query = "UPDATE mod_nomina.dat_nominadatos_json 
                        SET datos_json = ? 
                        WHERE idnomina = ? AND identidad = ?";
                        $stmt = $conn->execute($query, array($json_string, $idnomina, $identidad));
                    } else {
                        $query = "INSERT INTO mod_nomina.dat_nominadatos_json (idnomina, datos_json, identidad)
                        VALUES (?, ?, ?) 
                        ON CONFLICT (idnomina) 
                        DO UPDATE SET datos_json = EXCLUDED.datos_json";
                        $stmt = $conn->execute($query, array($idnomina, $json_string, $identidad));
                    }                    
                    
                    //Se salvan los valores en nominadatos
                    $objDatNominaDatos = new DatNominaDatos();
                    $objDatNominaDatos->idnomina = $idnomina;
                    $objDatNominaDatos->idplantillanominal = $idplantillanominal;
                    $objDatNominaDatos->campos = (string)serialize($this->camposnomina);
                    $objDatNominaDatos->valores = (string)serialize($rvalores);
                    $objDatNominaDatos->estructura = (string)serialize($this->estnomina);
                    $objDatNominaDatos->save();

                    if ($tipnom == 37) {
                        //Personas con Neto en cero
                        foreach ($rvalores as $k => $value) {
                            if ($value['c214'] == 0) {
                                $arrayNetoCero[] = $value['c40'];
                            }
                        }
                    }
                }

                // Guardando el numero consecutivo de la nomina para el periodo
                $this->guardarNumeroConsecutivoNomina($identidad, $idelaborarpago);

                //Si se estan certificando nominas desarobadas
                if ($estado != 'CERTIFICADAS') {
                    //$conn->beginTransaction();
                    /* Actualizar el estado de las nominas a certificadas */
                    $sqlN = "UPDATE mod_nomina.dat_nomina set aprobada = -1  WHERE idelaborarpago = ?";
                    $conn->fetchAll($sqlN, array($this->d->pago[0]['idelaborarpagos']));

                    $respuesta = new stdClass();

                    /* Se acumula o liquida en el submayor de vacaciones si el tipo de nomina acumula o liquida */
                    $vac = null;
                    if ($this->d->pago[0]['acumulavacaciones'] == 1 || $this->d->pago[0]['acumulavacaciones'] == 2 || $this->d->pago[0]['acumulavacaciones'] == 4) {
                        $objVacaciones = new DatVacacionesPersonaModel();
                        //$rexplodefpago = explode('/', $this->d->pago[0]['fechapago']);
                        //$periodovacaciones = $rexplodefpago[1].'-'.$rexplodefpago[2];
                        $rexplodefinicio = explode('/', $this->d->pago[0]['fechainicioperiodo']);
                        $periodovacaciones = $rexplodefinicio[1] . '-' . $rexplodefinicio[2];
                        $nominaactualizada = DatNomina::obtenerObj($arrayidnomina[0])->actualizada;
                        //print_r($this->d->vacaciones['submayor']);die;
                        $vac = $objVacaciones->acumulacionLiquidacionVacaciones($this->d->personas, $this->d->vacaciones['submayor'], $this->d->pago[0]['acumulavacaciones'], $this->d->camposacumulanliquidan, $this->valoresnomina, $periodovacaciones, $nominaactualizada, $identidad);
                    }

                    $respuesta->codigovac = -1;
                    $respuesta->personas = $arrayNetoCero;
                    $respuesta->count = count($arrayNetoCero);
                    $respuesta->codigo = 'CERTIFICADA';


                    /* Se guardan los montos de los conceptos contables */
                    $this->guardarMontosConceptos($idelaborarpago, $identidad);
                    $this->d->valoresnomina = $this->valoresnomina;
                    //Eliminando los datos de dat_datoscertificadoselaborarpagos para este periodo de pago
                    $sqlDelDC = "DELETE FROM mod_nomina.dat_datoscertificadoselaborarpago WHERE idelaborarpagos = ?;";
                    $conn->fetchAll($sqlDelDC, array($idelaborarpago));
                    /* Guardando los datos de los reportes que se emplearon para este pago */
                    $objDatosCertificados = new DatDatosCertificadosElaborarpago();
                    $objDatosCertificados->idelaborarpagos = $idelaborarpago;
                    $objDatosCertificados->datoscetificados = serialize($this->d);
                    $objDatosCertificados->save();
                    // Enviar los datos al servidor
                    $conn->commit();


                    //  Optimizacion para cuando el sistema este en FastCgi continue en backgroud
                    // la actualizacion de las retenciones y los descuentos y devuelva la respuesta
                    // Esto no se aplica cuando se corre como modulo de apache pero en los stack en modo prod trabaja sin problemas
                    /*if(isset($_SERVER['FCGI_ROLE'])) {
                        echo json_encode($respuesta);
                        fastcgi_finish_request();
                    }*/
                    

                    $conn->beginTransaction();
                    /*Guardando los conceptos calculados, para que no se vuelvan a calcular para otros pagos*/
                    $objDescCal = new DatDescuentosAplicadosPorPersonaModel();
                    $objDescCal->adicionarDescuentosAplicadosPersona($this->d->pago[0]['idelaborarpagos'], $this->descuentoscalculados);
                    $conn->commit();

                    //$conn->beginTransaction();
                    // Guardar acumulacionLiquidacionVacaciones de forma asincrona
                    if(isset($vac->listado)) {
                        foreach ($vac->listado as $item) {
                            $item->save();
                        }
                    }

                    // Comenzar una nueva transaccion
                    /* Aplicando las retenciones de las personas en el submayor */
                    $objRetenciones = new DatRetencionPersonaModel();//print_r($this->d->retenciones);die;
                    $objRetenciones->actualizarSubmayorRetenciones($this->d->personas, $this->d->retenciones, $this->retencionescalculadas, $identidad, $this->d->retencionesaplicadas, $this->d->pago[0]['ultimopagoenperiodo'], $this->d->pago[0]['idelaborarpagos']);

                    //$conn->commit();

                    $respuesta->codigovac = -1;
                    $respuesta->personas = $arrayNetoCero;
                    $respuesta->count = count($arrayNetoCero);
                    $respuesta->codigo = 'CERTIFICADA';

                    return $respuesta;
                } else {
                    //Cambiando el campo actualizada a 1
                    $sqlN = "UPDATE mod_nomina.dat_nomina set actualizada = 1  WHERE idelaborarpago = ?";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrN = $conn->fetchAll($sqlN, array($this->d->pago[0]['idelaborarpagos']));
                    //$conn->commit();

                    /*Elimino de conceptos certificados*/
                    $sql = "DELETE FROM mod_nomina.dat_conceptoelaborarpago WHERE idelaborarpagos = ?;";
                    $conn->execute($sql, array($idelaborarpago));

                    /*Elimino de datoscertificados*/
                    $sql = "DELETE FROM mod_nomina.dat_datoscertificadoselaborarpago WHERE idelaborarpagos = ?;";
                    $conn->execute($sql, array($idelaborarpago));

                    /* Se guardan los montos de los conceptos contables */
                    $this->guardarMontosConceptos($idelaborarpago, $identidad);
                    $this->d->valoresnomina = $this->valoresnomina;
                    /* Guardando los datos de los reportes que se emplearon para este pago */
                    $objDatosCertificados = new DatDatosCertificadosElaborarpago();
                    $objDatosCertificados->idelaborarpagos = $idelaborarpago;
                    $objDatosCertificados->datoscetificados = serialize($this->d);
                    $objDatosCertificados->save();

                    $respuesta->codigovac = -1;
                    $respuesta->personas = $arrayNetoCero;
                    $respuesta->count = count($arrayNetoCero);
                    $respuesta->codigo = 'ACTUALIZADA';
                    return $respuesta;
                }

            } else {
                //Guardando el numero consecutivo de la nomina en el fichero
                /* Guardando el archivo con los datos serializados de las nominas generadas */
                $this->d->valores = $this->valoresnomina;
                $this->d->campos = $this->camposnomina;
                $register = Zend_Registry::getInstance();
                $direccion = $register->config->modulo_path . 'comun/recursos/datosnominas/' . $nombrearchivo;
                file_put_contents($direccion, serialize($this->d));

                $respuesta = new stdClass();
                $respuesta->campos = $this->camposnomina;
                $respuesta->valores = $this->valoresnomina;
                $respuesta->errores = $this->erroresespecificos;
                $respuesta->codigo = 'GENERADA';
                return $respuesta;
            }
        } else if ($accion == 'GENERAR' && ($estado == 'CERTIFICADAS' || $estado == 'APROBADAS')) {

            //Si el modo de vizualizar es por plantillas
            if ($modovisualizar == 1) {
                //Datos nomina
                $rdatosnomina = DatNominaDatos::obtenerDatosNominaArray($arrayidnomina);
                foreach ($rdatosnomina as $rv) {
                    foreach (unserialize($rv['valores']) as $val) {
                        //Concatenando el orden y la denominacion de las plantillas nominales
                        $idplantillanominal = DatNomina::obtenerIdPlantillaNominalXIdNomina($val['idnomina']);
                        $plantilla = ConfPlantillaNominal::obtenerOrdenYDenominacionXId($idplantillanominal);
                        $divisor = 1;
                        $codigoorden = $this->fnOrganizarPlantillas($plantilla[0]['orden'], $divisor);
                        $val['plantillanominal'] = $codigoorden . "-" . $plantilla[0]['orden'] . '-' . $plantilla[0]['denominacion'];
                        $this->valoresnomina[] = $val;
                    }
                }
                $this->camposnomina = unserialize($rdatosnomina[0]['campos']);
                $respuesta = new stdClass();
                $respuesta->campos = $this->camposnomina;
                $respuesta->valores = $this->valoresnomina;
                $respuesta->errores = $this->erroresespecificos;
                $respuesta->codigo = 'GENERADA';
                return $respuesta;
                //Si se visualiza de forma general
            } else {
                //Datos nomina
                $rdatosnomina = DatNominaDatos::obtenerDatosNominaPorElaborarPago($idelaborarpago);
                foreach ($rdatosnomina as $rv) {
                    $nomina = unserialize($rv['valores']);
                    foreach ($nomina as $val) {
                        $this->valoresnomina[] = $val;
                    }
                }
                $this->camposnomina = unserialize($rdatosnomina[0]['campos']);

                $respuesta = new stdClass();
                $respuesta->campos = $this->camposnomina;
                $respuesta->valores = $this->valoresnomina;
                $respuesta->errores = $this->erroresespecificos;
                $respuesta->codigo = 'GENERADA';
                return $respuesta;
            }
        } else if ($accion == 'APROBAR') {
            //Verificar q si las nominas acumulan y liquidan hallan sido actualizadas
            $tiponomina = ConfigModeloNomina::obtenerIdTiposNominaporTipoPago($idelaborarpago)[0]['idtiponomina'];
            $acumulaliquida = NomTipoNomina::obtenerAcumulaLiquida($tiponomina);
            if ($acumulaliquida == 4) {
                $nominaactualizada = DatNomina::obtenerObj($arrayidnomina[0])->actualizada;
                if ($nominaactualizada == 0) {
                    $respuesta = new stdClass();
                    $respuesta->codigo = 'NO-ACTUALIZADA';
                    return $respuesta;
                }
            }
            //Validar que si la nomina postea los comprobantes esta halla sido contabilzada
            $sql = "select apertura from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            //postea comprobate
            $posteacomprobantes = $conn->fetchOne($sql);
            //Numero de comprobante de operaciones
            $comprobanteoperaciones = DatElaborarPagos::obtenerComprobanteOperacionesPeriodoPago($idelaborarpago);
            //Operacion contable
            $sqlop = "select operacioncontable from mod_nomina.nom_tiponomina where idtiponomina = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $operacioncontable = $conn->fetchOne($sqlop, array($tiponomina));
            if(($posteacomprobantes == 1 && ($operacioncontable)) && !$comprobanteoperaciones){
                $respuesta = new stdClass();
                $respuesta->codigo = 'NO-CONTABILIZADA';
                return $respuesta;
            }
            //Si acumula en el snc se valida, sino, se aprueba
            $acumulasnc = NomTipoNomina::obtenerAcumulaLiquidaSNC225($tiponomina);
            //Si la nomina acumula en el snc
            if ($acumulasnc == 1) {//print_r($acumulasnc);die;
                $camposregsalarionomina = ConfigRegistroSalarioTiempoServicio::obtenerListadoCamposRegistroSalario($tiponomina);
                if (count($camposregsalarionomina) > 0) {
                    $personasreporte = DatDatosCertificadosElaborarpago::obtenerDatosCertificadosSerializados($idelaborarpago);
                    $prep = unserialize($personasreporte);
                    //Si hay datos de las personas certificadas
                    if ($personasreporte) {
                        //Acumulando en el registro de salarios y tiepo de servicios
                        $result = GestRegistroSalarioTiempoServicioModel::acumularSNC225($identidad, $arrayidnomina, $camposregsalarionomina, $idelaborarpago, $prep->reportes, $tiponomina);
                        if ($result == 'OK') {
                            //Se procede a liquidar las vacaciones en el submayor
                            if ($acumulaliquida == 4) {
                                $rexplodefinicio = explode('/', $prep->pago[0]['fechainicioperiodo']);
                                $periodovacaciones = $rexplodefinicio[1] . '-' . $rexplodefinicio[2];
                                $vacaciones = DatVacacionesPersonaModel::acumulacionLiquidacionVacaciones($prep->personas, $prep->vacaciones['submayor'], $prep->pago[0]['acumulavacaciones'], $prep->camposacumulanliquidan, $prep->valoresnomina, $periodovacaciones, $nominaactualizada, $identidad);
                                //Si esta actualizada liquidar las vacaciones
                            }
                            //Se pasa a poner las nominas en estado = 1
                            foreach ($arrayidnomina as $ridn) {
                                $DomainDatNomina = Doctrine::getTable('DatNomina')->find($ridn);
                                //$DomainDatNomina->aprobada = 1;
                                $DomainDatNomina->acumuladasnc = 1;
                                $DomainDatNomina->save();
                            }
                            //Pasando a estado 1 todas las nominas
                            //Cambiandole el estado a todas las nominas
                            $sqlN = "UPDATE mod_nomina.dat_nomina set aprobada = 1  WHERE idelaborarpago = ?";
                            $conn->fetchAll($sqlN, array($idelaborarpago));
                            $conn->commit();

                            //Borrando el fichero *.dnomina del directorio apps\pvd\nomina\apps\comun\recursos\datosnominas para ahorrar espacio en el servidor
                            $register = Zend_Registry::getInstance();
                            $nombreArchivo = $idelaborarpago . ".dnomina";
                            $direccion = $register->config->modulo_path . 'comun/recursos/datosnominas/' . $nombreArchivo;
                            unlink($direccion);

                            $respuesta = new stdClass();
                            $respuesta->codigo = 'APROBADA';
                            return $respuesta;
                        } else {
                            $respuesta = new stdClass();
                            $respuesta->codigo = $result;
                            return $respuesta;
                        }
                    } else {
                        $respuesta = new stdClass();
                        $respuesta->codigo = 'NODATOSPERSONASCERTIFICADOS';
                        return $respuesta;
                    }
                } else {
                    $respuesta = new stdClass();
                    $respuesta->codigo = '-NO-CAMPOS-REGISTRO-SALARIO';
                    return $respuesta;
                }
                //Si no acumula
            } else {
                //Pasando a estado 1 todas las nominas
                //Cambiandole el estado a todas las nominas
                $sqlN = "UPDATE mod_nomina.dat_nomina set aprobada = 1  WHERE idelaborarpago = ?";
                $conn->fetchAll($sqlN, array($idelaborarpago));
                $conn->commit();

                //Borrando el fichero *.dnomina del directorio apps\pvd\nomina\apps\comun\recursos\datosnominas para ahorrar espacio en el servidor
                $register = Zend_Registry::getInstance();
                $nombreArchivo = $idelaborarpago . ".dnomina";
                $direccion = $register->config->modulo_path . 'comun/recursos/datosnominas/' . $nombreArchivo;
                unlink($direccion);

                $respuesta = new stdClass();
                $respuesta->codigo = 'APROBADA';
                return $respuesta;
            }
        }
    }

    public function denomCuentaBancariaByPersona($idpersona){
        $sql = "SELECT numerocuenta FROM mod_personaext.dat_cuentabancaria WHERE idpersona = $idpersona and fhasta is NULL;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $respuesta = $conn->fetchOne($sql);

        return $respuesta;
    }

    public function denomNum_IdePersonaBancariaById($idpersona){
        $sql = "SELECT numero FROM mod_persona.dat_docidentidad WHERE idpersona = $idpersona;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $respuesta = $conn->fetchOne($sql);

        return $respuesta;
    }


    // public function guardarNumeroConsecutivoNomina($identidad, $idelaborarpago)
    // {
    //     $mg = Doctrine_Manager::getInstance();
    //     $conn = $mg->getCurrentConnection();

    //     //Año del periodo
    //     $fechainicioperiodo = DatElaborarPagos::obtenerFechaInicioPeriodo($idelaborarpago, $identidad);
    //     list(, , $annoperiodo) = explode('/', $fechainicioperiodo);

    //     //Obteniendo los tipos de pago que tienen consecutivo de nomina
    //     $sql = "select idtipopago from mod_nomina.nom_tipopago where consecutivonomina = 1;";
    //     $arrconsecutivos = $conn->fetchAll($sql);
    //     $consecutivos = '';
    //     foreach ($arrconsecutivos as $c) {
    //         $consecutivos .= $c['idtipopago'] . ',';
    //     }
    //     $consecutivos = trim($consecutivos, ',');
    //     if (!empty($consecutivos)) {
    //         //Definiendo el numero de la nomina
    //         $sqlconsecutivos = "select max(dcn.consecutivo)   
    //         from mod_nomina.dat_elaborarpagos dep
    //         inner join mod_nomina.dat_consecutivosnominaporpagos dcn on(dcn.idelaborarpagos = dep.idelaborarpagos)
    //         inner join mod_nomina.dat_nomina dn on (dn.idelaborarpago = dep.idelaborarpagos and dn.aprobada <> 0)
    //         where dep.identidad = ?
    //         and dep.idelaborarpagos <> ?
    //         and date_part('year', dep.fechainicioperiodo::timestamp) = '" . $annoperiodo . "' 
    //         and dep.idtipopago in (" . $consecutivos . ");";
    //         $cantnumerosconsecutivosnominas = $conn->fetchOne($sqlconsecutivos, array($identidad, $idelaborarpago));
    //     } else
    //         $cantnumerosconsecutivosnominas = 0;

    //     //Guardando el numero consecutivo de la nomina en dat_consecutivosnominaporpagos
    //     $existeconsecutivo = DatConsecutivosNominaPorPagos::existeIdElaborarPagoConsecutivosNomina($idelaborarpago);
    //     if ($existeconsecutivo == 1) {
    //         $objDatConsecutivosNominaPorPagosDelete = DatConsecutivosNominaPorPagos::obtenerDatConsecutivosNominaPorIdElaborarPagos($idelaborarpago);
    //         $objDatConsecutivosNominaPorPagosDelete->delete();
    //     }
    //     $objDatConsecutivosNominaPorPagos = new DatConsecutivosNominaPorPagos();
    //     $objDatConsecutivosNominaPorPagos->idelaborarpagos = $idelaborarpago;
    //     $objDatConsecutivosNominaPorPagos->consecutivo = $cantnumerosconsecutivosnominas + 1;
    //     $objDatConsecutivosNominaPorPagos->anno = $annoperiodo;
    //     $objDatConsecutivosNominaPorPagos->save();
    // }

    public function guardarNumeroConsecutivoNomina($identidad, $idelaborarpago)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        
        try {
            // Forzar nivel SERIALIZABLE para evitar phantom reads
            // Establecer el nivel para TODAS las transacciones futuras en esta sesión
            $conn->execute("SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL SERIALIZABLE");
            
            // Iniciar transacción con nivel SERIALIZABLE
            $conn->beginTransaction();
            
            //Año del periodo
            $fechainicioperiodo = DatElaborarPagos::obtenerFechaInicioPeriodo($idelaborarpago, $identidad);
            list(, , $annoperiodo) = explode('/', $fechainicioperiodo);

            //Obteniendo los tipos de pago que tienen consecutivo de nomina
            $sql = "select idtipopago from mod_nomina.nom_tipopago where consecutivonomina = 1;";
            $arrconsecutivos = $conn->fetchAll($sql);
            $consecutivos = '';
            foreach ($arrconsecutivos as $c) {
                $consecutivos .= $c['idtipopago'] . ',';
            }
            $consecutivos = trim($consecutivos, ',');
            
            if (!empty($consecutivos)) {
                // Bloquear la tabla para evitar lecturas sucias
                $conn->execute("LOCK TABLE mod_nomina.dat_consecutivosnominaporpagos IN EXCLUSIVE MODE");
                
                //Definiendo el numero de la nomina - AHORA CON BLOQUEO
                $sqlconsecutivos = "select max(dcn.consecutivo)   
                from mod_nomina.dat_elaborarpagos dep
                inner join mod_nomina.dat_consecutivosnominaporpagos dcn on(dcn.idelaborarpagos = dep.idelaborarpagos)
                inner join mod_nomina.dat_nomina dn on (dn.idelaborarpago = dep.idelaborarpagos and dn.aprobada <> 0)
                where dep.identidad = ?
                and dep.idelaborarpagos <> ?
                and date_part('year', dep.fechainicioperiodo::timestamp) = '" . $annoperiodo . "' 
                and dep.idtipopago in (" . $consecutivos . ")";              
                $cantnumerosconsecutivosnominas = $conn->fetchOne($sqlconsecutivos, array($identidad, $idelaborarpago));
            } else {
                $cantnumerosconsecutivosnominas = 0;
            }

            //Guardando el numero consecutivo de la nomina en dat_consecutivosnominaporpagos
            $existeconsecutivo = DatConsecutivosNominaPorPagos::existeIdElaborarPagoConsecutivosNomina($idelaborarpago);
            if ($existeconsecutivo == 1) {
                $objDatConsecutivosNominaPorPagosDelete = DatConsecutivosNominaPorPagos::obtenerDatConsecutivosNominaPorIdElaborarPagos($idelaborarpago);
                $objDatConsecutivosNominaPorPagosDelete->delete();
            }
            
            // Verificar nuevamente que no exista conflicto
            $verificarConsecutivo = $conn->fetchOne(
                "SELECT COUNT(*) FROM mod_nomina.dat_consecutivosnominaporpagos 
                WHERE anno = ? AND consecutivo = ?",
                array($annoperiodo, $cantnumerosconsecutivosnominas + 1)
            );
            
            if ($verificarConsecutivo > 0) {
                // Si alguien más insertó el mismo consecutivo, recalcular
                $nuevoMaximo = $conn->fetchOne(
                    "SELECT MAX(consecutivo) FROM mod_nomina.dat_consecutivosnominaporpagos WHERE anno = ?",
                    array($annoperiodo)
                );
                $cantnumerosconsecutivosnominas = $nuevoMaximo ?: 0;
            }
            
            $objDatConsecutivosNominaPorPagos = new DatConsecutivosNominaPorPagos();
            $objDatConsecutivosNominaPorPagos->idelaborarpagos = $idelaborarpago;
            $objDatConsecutivosNominaPorPagos->consecutivo = $cantnumerosconsecutivosnominas + 1;
            $objDatConsecutivosNominaPorPagos->anno = $annoperiodo;
            $objDatConsecutivosNominaPorPagos->save();            
            $conn->commit();
            
        } catch (Exception $e) {
            $conn->rollback();
            // Log del error
            error_log("Error en guardarNumeroConsecutivoNomina: " . $e->getMessage());
            throw $e;
        } finally {
            // Restaurar el nivel de aislamiento por defecto si es necesario
            $conn->execute("SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL READ COMMITTED");
        }
    }

    //Funcion para buscar las personas que pertenecen a las plantillas nominales
    public function buscarPersonasNominas($arraynominas, $persona, $modovisualizar = null)
    {
        if ($modovisualizar == 2) {
            return true;
        } else {
            foreach ($arraynominas as $rnomina) {
                if ($persona['idnomina'] == $rnomina) {
                    return true;
                }
            }
        }
        return false;
    }

    //Funcion para buscar las personas que pertenecen a las plantillas nominales
    public function buscarPersonasNominasIndexado($indices, $persona, $modovisualizar = null)
    {
        if ($modovisualizar == 2) {
            return true;
        } else {
            if(isset($indices[$persona['idnomina']]))
                return true;
        }
        return false;
    }

    //Funcion para buscar el importe del concepto de la nomina
    private function buscarValorConcepto($persona, $concepto, $columna)
    {
        $rconceptopd = explode('_', $concepto['idconcepto']);
        $contcpd = count($rconceptopd);
        $idconceptopd = $rconceptopd[$contcpd - 1];
        $idsistemapago = -1;
        /* if ($this->d->pago[0]['sedesglosa'] == 1)
          {
          $idsistemapago = ($rconceptopd[0] != 0) ? $rconceptopd[0] : -1;
          } */

        //Si el concepto es el salario escala
        if ($concepto['tipo'] == 1) {
            //Si tiene situacion del servicio
            if ($persona['idsituacionlaboral']) {
                return $this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'];
                //Si no tiene situacion del servicio
            } else {
                return $this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'];
            }
            //Conceptos de percepcion y descuentos
        } else if ($concepto['tipo'] == 5) {
            $idperiodopago = ($this->d->pago[0]['sedesglosa'] != 1 ? -1 : $this->d->pago[0]['idperiodopago']);
            //Si el campo de la nomina esta como un concepto pd en formas y sistemas de pago
            if (isset( $this->d->configfsp[$this->d->pago[0]['idtipopago']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago]->conceptopd [$idconceptopd] )) {
                //Buscar la formula del concepto pd
                $valor = $this->calcularConceptoPD($idsistemapago, $idconceptopd, $persona, $columna);

                //Guardo el valor del concepto calculado
                $this->conceptospdcalculados[$persona['idcargosocupados']][$idconceptopd] = $valor;
                return $valor;
            } else {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepcion y descuento no esta configurado en formas y sistemas de pago para este tipo de pago, sistema de pago y periodo de pago';
                $this->conceptospdcalculados[$persona['idcargosocupados']][$idconceptopd] = number_format(0, 2, '.', '');
                /* $this->conceptospdcalculados[$persona['idcargosocupados']]->conceptospd[$idconceptopd][] = number_format(0, 2, '.', ''); */
                return number_format(0, 2, '.', '');
            }
        } else if ($concepto['tipo'] == 2) {
            $rretencion = explode('_', $concepto['idconcepto']);
            $contcpd = count($rretencion);
            $idtiporetencion = $rretencion[$contcpd - 1];
            return $this->calcularRetenciones($idsistemapago, $persona, $idtiporetencion, -1, $columna);
        } else if ($concepto['tipo'] == 3) {
            $rconceptorm = explode('_', $concepto['idconcepto']);
            $contcrm = count($rconceptorm);
            $idconceptorm = $rconceptorm[$contcrm - 1];
            $idsistemapago = ($rconceptorm[0] != 0) ? $rconceptorm[0] : -1;
            $valor = $this->calcularConceptoRetribucionMonetaria($idsistemapago, $persona, $idconceptorm, $columna);
            $this->conceptosrmcalculados[$persona['idcargosocupados']][$idconceptorm] = $valor;
            return $valor;
        } else {
            return number_format(0, 2, '.', '');
        }
    }

    //Funcion para calcular los importes de los conceptos pd
    private function calcularConceptoPD($idsistemapago, $idconceptopd, $persona, $columna)
    {

        /* Busco el idperiodopago en dependencia si el tipo de pago se desglosa o no */
        $idperiodopago = ($this->d->pago[0]['sedesglosa'] != 1 ? -1 : $this->d->pago[0]['idperiodopago']);

        //Si la persona no tiene sit. servicio
        if (empty($persona['idsituacionlaboral'])) {
            //Si el cargo ocupado no tiene configuraciones de conceptos de pd en los elementos salariales
            if (!isset($this->d->configescp[$persona['idcargosocupados']] )) {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El cargo ocupado de esta persona no tiene configurado elementos salariales al cargo';
                return number_format(0, 2, '.', '');
                //Si El cargo ocupado de esta persona no tiene configurado en los elementos salariales el sistema de pago para el cual esta configurado el concepto de percepcion y descuento
            } else if (!(isset( $this->d->configescp[$persona['idcargosocupados']]->sistemapago[$idsistemapago])) && $idsistemapago != -1) {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El cargo ocupado de esta persona no tiene configurado en los elementos salariales el sistema de pago para el cual esta configurado el concepto de percepcion y descuento';
                return number_format(0, 2, '.', '');
                //Si el cargo ocupado de esta persona no tiene configurado en los elementos salariales el sistema de pago para el cual esta configurado el concepto de percepcion y descuento
            } else if (!isset( $this->d->configescp[$persona['idcargosocupados']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago]) && $idperiodopago != -1) {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El cargo ocupado de esta persona no tiene configurado en los elementos salariales el mismo periodo de pago del pago a realizar';
                return number_format(0, 2, '.', '');
            } else if (!isset( $this->d->configescp[$persona['idcargosocupados']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago]->conceptopd[$idconceptopd]) && $idsistemapago != -1) {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El cargo ocupado de esta persona no tiene configurado en los elementos salariales el concepto de percepcion y descuento';
                return number_format(0, 2, '.', '');
            } else {
                /*Si el concepto ya se encuentra calculado se busca en el arreglo de conceptos calculados*/
                if (isset($this->conceptospdcalculados[$persona['idcargosocupados']][$idconceptopd] )) {
                    return $this->conceptospdcalculados[$persona['idcargosocupados']][$idconceptopd];
                    /*Si no esta calculado se calcula*/
                } else {
                    /*Si es un concepto aplicado en otro pago, no lo calculo*/
                    if (!isset( $this->d->conceptospddescuentosaplicados[$persona['idpersona']]->conceptodescuento[$idconceptopd])) {
                        return $this->calcularValorConceptoPD($idsistemapago, $this->d->configfsp[$this->d->pago[0]['idtipopago']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago]->conceptopd[$idconceptopd], $persona, $idconceptopd, $columna);
                    } else {
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepción y descuento ha sido aplicado en otro pago.';
                        return number_format(0, 2, '.', '');
                    }
                }
            }
        } else {
            //Si el cargo ocupado no tiene configuraciones de conceptos de pd en los elementos salariales
            if (!isset( $this->d->configesss[$persona['idcargosocupados']])) {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El cargo ocupado de esta persona no tiene configurado ningun elemento salarial a la situacion del servicio';
                return number_format(0, 2, '.', '');
                //Si El cargo ocupado de esta persona no tiene configurado en los elementos salariales el sistema de pago para el cual esta configurado el concepto de percepcion y descuento
            } else if (!(isset( $this->d->configesss[$persona['idcargosocupados']]->sistemapago[$idsistemapago])) && $idsistemapago != -1) {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El cargo ocupado de esta persona no tiene configurado en los elementos salariales el sistema de pago para el cual esta configurado el concepto de percepcion y descuento';
                return number_format(0, 2, '.', '');
                //Si el cargo ocupado de esta persona no tiene configurado en los elementos salariales el sistema de pago para el cual esta configurado el concepto de percepcion y descuento
            } else if (!isset($this->d->configesss[$persona['idcargosocupados']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago] ) && $idperiodopago != -1) {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El cargo ocupado de esta persona no tiene configurado en los elementos salariales el mismo periodo de pago del pago a realizar';
                return number_format(0, 2, '.', '');
            } else if (!isset( $this->d->configesss[$persona['idcargosocupados']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago]->conceptopd[$idconceptopd]) && $idsistemapago != -1) {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El cargo ocupado de esta persona no tiene configurado en los elementos salariales el concepto de percepcion y descuento';
                return number_format(0, 2, '.', '');
            } else {
                //Si el concepto ya se encuentra calculado se busca en el arreglo de conceptos calculados
                if (isset( $this->conceptospdcalculados[$persona['idcargosocupados']][$idconceptopd])) {
                    return $this->conceptospdcalculados[$persona['idcargosocupados']][$idconceptopd];
                    //Si no esta calculado se calcula
                } else {
                    /*Si es un concepto aplicado en otro pago, no lo calculo*/
                    if (!isset( $this->d->conceptospddescuentosaplicados[$persona['idpersona']]->conceptodescuento[$idconceptopd])) {
                        return $this->calcularValorConceptoPD($idsistemapago, $this->d->configfsp[$this->d->pago[0]['idtipopago']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago]->conceptopd[$idconceptopd], $persona, $idconceptopd, $columna);
                    } else {
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepción y descuento ha sido aplicado en otro pago.';
                        return number_format(0, 2, '.', '');
                    }
                }
            }
        }
    }

    private function calcularVariableGeneral($idvariable, $persona, $columna)
    {
        if (isset($this->d->variablesglobales[$idvariable])) {
            if ($this->d->variablesglobales[$idvariable]['valor'] || $this->d->variablesglobales[$idvariable]['valor'] != null) {
                $nivelconf = $this->d->variablesglobales[$idvariable]['idnivelconfiguracion'];
                if ($nivelconf == 1) {
                    return $this->d->variablesglobales[$idvariable]['valor'];
                } else if ($nivelconf == 2) {
                    return $this->d->variablesglobales[$idvariable]['valor'];
                } else {
                    if (isset( $this->d->variablesglobales[$idvariable]['cargos'][$persona['idcargo']])) {
                        return $this->d->variablesglobales[$idvariable]['cargos'][$persona['idcargo']];
                    } else {
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La variable global ' . $this->d->variablesglobales[$idvariable]['denominacion'] . ' no esta configurada para el cargo de la persona';
                        return number_format(0, 2, '.', '');
                    }
                }
            } else {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La variable global ' . $this->d->variablesglobales[$idvariable]['denominacion'] . ' del concepto de percepcion y descuento no esta configurada';
                return number_format(0, 2, '.', '');
            }
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La variable global del concepto de percepcion y descuento no existe en el nomenclador de variables globales';
            return number_format(0, 2, '.', '');
        }
    }

    private function calcularValorConceptoPD($idsistemapago, $confformulaconcepto, $persona, $idconceptopd, $columna)
    {
        $arrayind = array();
        //Recorriendo los indicadores de formula para evaluar
        foreach ($confformulaconcepto->indicadores as $rind) {
            $valor = 0;
            $rexplode = explode('_', $rind);
            $idvariable = $rexplode[1];
            switch ($rexplode[0]) {
                case 'VG': {
                    $valor = $this->calcularVariableGeneral($idvariable, $persona, $columna);
                    break;
                }
                case 'CRM': {
                    $valor = $this->calcularConceptoRetribucionMonetaria($idsistemapago, $persona, $rexplode[1], $columna);
                    break;
                }
                case 'VASP': {
                    //La formula tiene variables auxiliares
                    if (isset($confformulaconcepto->variable) && isset( $confformulaconcepto->variable[$idvariable])) {
                        //Buscando el valor de la persona en el reporte
                        $idpersona = $persona['idpersona'];
                        $idconfreporte = $confformulaconcepto->variable[$idvariable]->idconfreportescertificaciones;
                        $idconfvariabletiporeporte = $confformulaconcepto->variable[$idvariable]->idvariablesconfreportescertificaciones;
                        $valor = $this->obtenerValorPersonaReporte($idpersona, $persona['idcargosocupados'], $idconfreporte, $idconfvariabletiporeporte, $idconceptopd, $columna);
                    } else {
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La variable auxiliar contenida en la formula no esta configurada';
                        $valor = number_format(0, 2, '.', '');
                    }
                    break;
                }
                case 'CPDT': {
                    $valor = $this->calcularValorTarifaConceptoPD($idsistemapago, $persona, $idconceptopd, $idvariable, $columna);
                    break;
                }
                case 'SPC': {
                    //Si tiene situacion del servicio
                    if ($persona['idsituacionlaboral']) {
                        $valor = $this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'];
                        //Si no tiene situacion del servicio
                    } else {
                        $valor = $this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'];
                    }
                    break;
                }
                default : {
                    $valor = number_format(0, 2, '.', '');
                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El indicador ' . $rexplode[0] . ' no esta definido para la la formula del concepto';
                    break;
                }
            }
            $arrayind[] = array('idindicador' => $rind, 'valor' => $valor);
        }


        //Evaluando la expresion matematica
        if (!empty($confformulaconcepto->expresionacalcular)) {
            $valorind = $this->EvaluarExpresionMatematica($arrayind, $confformulaconcepto->expresionacalcular);
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepción y descuento (' . $this->d->conceptospd[$idconceptopd]->denominacion . ') no tiene una fórmula en formas y sistemas de pago.';
            return number_format(0, 2, '.', '');
        }
        if ($valorind->codigo == 1) {
            //Aplico el redondeo de acuerdo a los lugares decimales de la configuracion
            $precision = ($confformulaconcepto->lugaresdecimales != '' ? $confformulaconcepto->lugaresdecimales : 2);
            $valorConcepto = number_format($valorind->valor, $precision, '.', '');
            /*
            if (empty($valorind->valor)) {
                $this->descuentoscalculados[$persona['idpersona']][$idconceptopd] = $idconceptopd;
                return number_format(0, 2, '.', '');
            }*/
            
            /* Verifico si es un concepto de descuento y si se puede aplicar */
            if (!isset($this->d->conceptospddescuentos[$idconceptopd])) {
                return $valorConcepto;
            } else {
                
                if (!empty($this->d->conceptospddescuentos[$idconceptopd]['idformulaaplicardescuento'])) {
                    $secumple = $this->comprobarSeCumpleDescuentos($idsistemapago, $persona, $valorConcepto, $this->d->conceptospddescuentos[$idconceptopd]['expresionacalcular'], $this->d->conceptospddescuentos[$idconceptopd]['indicadores'], $columna);
                    if ($secumple) {
                        $this->descuentoscalculados[$persona['idpersona']][$idconceptopd] = $idconceptopd;
                        return $valorConcepto;
                    } else {
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepción y descuento no se pudo aplicar, no cumple con las condiciones.';
                        return number_format(0, 2, '.', '');
                    }
                } else {
                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepción y descuento no tiene configurado una fórmula para aplicar el descuento.';
                    return number_format(0, 2, '.', '');
                }
            }
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = $valorind->error;
            return number_format(0, 2, '.', '');
        }
    }

    //Funcion para buscar los valores de la persona en el reporte
    private function obtenerValorPersonaReporte($idpersona, $idcargosocupados, $idconfreporte, $idconfvariabletiporeporte, $idconceptopd, $columna)
    {
        // TODO La variable persona no esta definida en ningun lugar
        $persona = array();
        //Si la persona tiene reportes ese periodo de pago
        if (isset($this->d->reportes[$idpersona] )) {
            //Si la persona esta adicionada en el reporte
            if (isset( $this->d->reportes[$idpersona]->reporte[$idconfreporte])) {
                //Si la persona tiene valores en este reportes
                if (isset( $this->d->reportes[$idpersona]->reporte[$idconfreporte]->variable[$idconfvariabletiporeporte])) {
                    return $this->d->reportes[$idpersona]->reporte[$idconfreporte]->variable[$idconfvariabletiporeporte];
                } else {
                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La persona en el reporte ' . $this->d->reportes[$idpersona]->reporte[$idconfreporte]->tiporeporte . ' no tiene valores';
                    return number_format(0, 2, '.', '');
                }
            } else {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La persona no esta adicionada en el reporte:' . $this->d->reportes[$idpersona]->reporte[$idconfreporte]->tiporeporte;
                return number_format(0, 2, '.', '');
            }
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La persona no esta adicionada en ningun reporte en este periodo de pago';
            return number_format(0, 2, '.', '');
        }
    }

    //Funcion que calcula el concepto de retibucion monetaria
    private function calcularConceptoRetribucionMonetaria($idsistemapago, $persona, $idconceptorm, $columna)
    {
        //Si esta el concepto crm en la configuracion
        if (isset($idconceptorm, $this->d->conceptosrm)) {
            if (isset( $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago] )) {
                if (!isset( $this->conceptosrmcalculados[$persona['idcargosocupados']][$idconceptorm])) {
                    $arrayind = array();
                    $lugaresdecimales = $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['lugaresdecimales'];
                    foreach ($this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['indicadores'] as $rind) {
                        $valor = 0;
                        $rexplode = explode('_', $rind);
                        $idconcepto = $rexplode[1];
                        $sumaValor = 0;
                        switch ($rexplode[0]) {
                            case 'SPC': {
                                if ($persona['idsituacionlaboral'] != '') {
                                    $valor = ($this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'] != '') ? $this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'] : number_format(0, 2, '.', '');
                                } else {
                                    $valor = ($this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'] != '') ? $this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'] : number_format(0, 2, '.', '');
                                }

                                if (!empty($persona['referencia']) && $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['calcularpluriempleo'] == 1) {
                                    foreach ($persona['referencia'] as $rp) {
                                        $v = 0;
                                        if ($this->d->personas[$rp]['idsituacionlaboral'] != '') {
                                            $v = ($this->d->sueldoxcargo[$rp]['spcsitservicio'] != '') ? $this->d->sueldoxcargo[$rp]['spcsitservicio'] : number_format(0, 2, '.', '');
                                        } else {
                                            $v = ($this->d->sueldoxcargo[$rp]['spccargo'] != '') ? $this->d->sueldoxcargo[$rp]['spccargo'] : number_format(0, 2, '.', '');
                                        }
                                        $sumaValor += $v;
                                    }
                                }


                                break;
                            }
                            case 'CPD': {
                                $valor = $this->calcularConceptoPD($idsistemapago, $idconcepto, $persona, $columna);


                                if (!empty($persona['referencia']) && $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['calcularpluriempleo'] == 1) {
                                    foreach ($persona['referencia'] as $rp) {
                                        $idsp = ($idsistemapago == -1 ? -1 : -2);
                                        if ($this->d->personas[$rp]['idsituacionlaboral'] != '') {
                                            $idsp = $this->d->configesss[$rp]->sp;
                                        } else {
                                            $idsp = $this->d->configescp[$rp]->sp;
                                        }
                                        $sumaValor += $this->calcularConceptoPD($idsp, $idconcepto, $this->d->personas[$rp], $columna);
                                    }
                                }
                                $valor = $valor + $sumaValor;
                                break;
                            }
                            case 'RET': {
                                $valor = $this->calcularRetenciones($idsistemapago, $persona, NULL, 1, $columna);

                                if (!empty($persona['referencia']) && $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['calcularpluriempleo'] == 1) {
                                    foreach ($persona['referencia'] as $rp) {
                                        $idsp = ($idsistemapago == -1 ? -1 : -2);
                                        if ($this->d->personas[$rp]['idsituacionlaboral'] != '') {
                                            $idsp = $this->d->configesss[$rp]->sp;
                                        } else {
                                            $idsp = $this->d->configescp[$rp]->sp;
                                        }
                                        $sumaValor += $this->calcularRetenciones($idsistemapago, $this->d->personas[$rp], NULL, 1, $columna);
                                    }
                                }
                                $valor = $valor + $sumaValor;
                                break;
                            }
                            case 'CRM': {
                                if ($this->d->conceptosrm[$idconcepto]->sistemapago[$idsistemapago]['calcularperiodomensual'] != 1 || (
                                        $this->d->conceptosrm[$idconcepto]->sistemapago[$idsistemapago]['calcularperiodomensual'] == 1 && $this->d->secalculaaportequincenal != -1)
                                ) {
                                    $valor = $this->calcularConceptoRetribucionMonetaria($idsistemapago, $persona, $idconcepto, $columna);

                                    if (!empty($persona['referencia']) && $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['calcularpluriempleo'] == 1) {
                                        foreach ($persona['referencia'] as $rp) {
                                            $idsp = ($idsistemapago == -1 ? -1 : -2);
                                            if ($this->d->personas[$rp]['idsituacionlaboral'] != '') {
                                                $idsp = $this->d->configesss[$rp]->sp;
                                            } else {
                                                $idsp = $this->d->configescp[$rp]->sp;
                                            }
                                            $sumaValor += $this->calcularConceptoRetribucionMonetaria($idsistemapago, $this->d->personas[$rp], $idconcepto, $columna);
                                        }
                                    }
                                }
                                $valor = $valor + $sumaValor;
                                break;
                            }
                            case 'VG': {
                                $valor = $this->calcularVariableGeneral($idconcepto, $persona, $columna);

                                if (!empty($persona['referencia']) && $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['calcularpluriempleo'] == 1) {
                                    foreach ($persona['referencia'] as $rp) {
                                        $idsp = ($idsistemapago == -1 ? -1 : -2);
                                        if ($this->d->personas[$rp]['idsituacionlaboral'] != '') {
                                            $idsp = $this->d->configesss[$rp]->sp;
                                        } else {
                                            $idsp = $this->d->configescp[$rp]->sp;
                                        }
                                        $sumaValor += $this->calcularVariableGeneral($idconcepto, $this->d->personas[$rp], $columna);
                                    }
                                }
                                $valor = $valor + $sumaValor;
                                break;
                            }
                            default : {
                                $valor = number_format(0, 2, '.', '');
                                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El indicador ' . $rexplode[0] . ' no esta definido para la la formula del concepto';
                                break;
                            }
                        }

                        $arrayind[] = array('idindicador' => $rind, 'valor' => $valor);
                    }
                    //Evaluando la expresion matematica
                    if (!empty($this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['expresionacalcular'])) {
                        $valorind = $this->EvaluarExpresionMatematica($arrayind, $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['expresionacalcular']);
                    } else {
                        $valor = number_format(0, 2, '.', '');
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La fórmula del concepto general de nómina (' . $this->d->conceptosrm[$idconceptorm]->denominacion . ') no está configurada.';
                    }
                    $valorprimeraQuincena = 0;
                    /* Hago el calculo del valor de la quincena anterior */
                    if ($this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['calcularperiodomensual'] == 1 && $this->d->secalculaaportequincenal != -1) {

                        foreach ($this->d->nominasquincenaanterior as $nqa) {
                            $arrNominaQuincenaAnt = unserialize($nqa['valores']);
                            $encontrado = -1;
                            foreach ($arrNominaQuincenaAnt as $fn) {
                                if ($fn['id'] == "{$persona['idpersona']}" . "-" . "{$persona['idcargosocupados']}") {
                                    $valorprimeraQuincena = $fn[$columna];
                                    $encontrado = 1;
                                    break;
                                }
                            }
                            if ($encontrado != -1) {
                                break;
                            }
                        }
                    }

                    if ($valorind->codigo == 1) {
                        $valorConceptoRM = $valorind->valor + $valorprimeraQuincena;
                        //Aplico el redondeo de acuerdo a los lugares decimales de la configuracion
                        return number_format($valorConceptoRM, $lugaresdecimales, '.', '');
                    } else {
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = $valorind->error;
                        return number_format(0, 2, '.', '');
                    }
                } else {
                    return $this->conceptosrmcalculados[$persona['idcargosocupados']][$idconceptorm];
                }
            } else {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de la retribucion monetaria no esta configurado para este sistema de pago';
                return number_format(0, 2, '.', '');
            }
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de la retribucion monetaria no esta configurado para este tipo de pago';
            return number_format(0, 2, '.', '');
        }
    }

    //Funcion para calcular la tarifa del concepto
    private function calcularValorTarifaConceptoPD($idsistemapago, $persona, $idconceptopd, $idconceptopdttarifa, $columna)
    {
        if (isset( $this->d->conceptospd[$idconceptopd])) {
            if (isset( $this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa])) {
                $formacalculo = $this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa]['idformacalculo'];
                //Si la forma de calculo es un importe fijo
                if ($formacalculo == 1) {
                    return ($this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa]['importe'] != '' ? $this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa]['importe'] : number_format(0, 2, '.', ''));
                } //Si la forma de calculo es por formula
                else if ($formacalculo == 2) {
                    $arrayind = array();
                    foreach ($this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa]['indicadores'] as $rind) {
                        $valor = 0;
                        $rexplode = explode('_', $rind);
                        switch ($rexplode[0]) {
                            case 'SPC': {
                                if ($persona['idsituacionlaboral']) {
                                    $valor = ($this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'] != null) ? $this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'] : number_format(0, 2, '.', '');
                                } else {
                                    $valor = ($this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'] != null) ? $this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'] : number_format(0, 2, '.', '');
                                }
                                break;
                            }
                            case 'CRM': {
                                $valor = $this->calcularConceptoRetribucionMonetaria($idsistemapago, $persona, $rexplode[1], $columna);
                                break;
                            }
                            case 'VG': {
                                $valor = $this->calcularVariableGeneral($rexplode[1], $persona, $columna);
                                break;
                            }
                            default : {
                                $valor = number_format(0, 2, '.', '');
                                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El indicador ' . $rexplode[0] . ' no esta definido para la la formula del concepto';
                                break;
                            }
                        }
                        $arrayind[] = array('idindicador' => $rind, 'valor' => $valor);
                    }
                    //Evaluando la expresion matematica
                    if (!empty($this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa]['expresionacalcular'])) {
                        $valorind = $this->EvaluarExpresionMatematica($arrayind, $this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa]['expresionacalcular']);
                    } else {
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepción y descuento (' . $this->d->conceptospd[$idconceptopd]->denominacion . ') no tiene configurada una fórmula para la tarifa.';
                        return number_format(0, 2, '.', '');
                    }
                    if ($valorind->codigo == 1) {
                        //Aplico el redondeo de acuerdo a los lugares decimales de la configuracion
                        $lugaresdecimales = $this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa]['lugaresdecimales'];
                        return number_format($valorind->valor, $lugaresdecimales, '.', '');
                    } else {
                        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = $valorind->error;
                        return number_format(0, 2, '.', '');
                    }

                    //Si la forma de calculo es una escala de valores
                } else {
                    //Buscando la escala del concepto de la persona en los elementos salariales
                    $configconcepto = NULL;
                    $idperiodopago = ($this->d->pago[0]['sedesglosa'] != 1 ? -1 : $this->d->pago[0]['idperiodopago']);
                    if (empty($persona['idsituacionlaboral'])) {
                        $configconcepto = $this->d->configescp[$persona['idcargosocupados']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago]->conceptopd[$idconceptopd];
                    } else {
                        $configconcepto = $this->d->configesss[$persona['idcargosocupados']]->sistemapago[$idsistemapago]->periodopago[$idperiodopago]->conceptopd[$idconceptopd];
                    }

                    $conftarifaconcepto = $this->d->conceptospd[$idconceptopd]->conceptopdtarifa[$idconceptopdttarifa];


                    return $this->calcularValorEscalaConcepto($configconcepto, $conftarifaconcepto, $persona, $idconceptopd, $columna);
                }
            } else {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepcion y descuento no tiene la tarifa configurada';
                return number_format(0, 2, '.', '');
            }
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepcion y descuento no esta adicionado en el nomenclador';
            return number_format(0, 2, '.', '');
        }
    }

    /* Funcion para calcular el valor de la escala del concepto */

    private function calcularValorEscalaConcepto($confconcepto, $confTarifaEscala, $persona, $idconceptopd, $columna)
    {
        $cantidadEstructuraEscala = count($confTarifaEscala['estructuraescala']);
        if ($cantidadEstructuraEscala > 0) {
            if (count($confTarifaEscala['escala']) > 0) {
                /* Busco la estructura de la escala que es hoja */
                $estructuraHoja = array();
                foreach ($confTarifaEscala['estructuraescala'] as $e) {
                    if ($e['nivel'] == 1) {
                        $estructuraHoja = $e;
                        break;
                    }
                }

                if (!empty($estructuraHoja))/* Comienzo el calculo del valor de la escala partiendo de la estructura hoja */ {
                    switch ($estructuraHoja['idtipoentrada']) {
                        case 4: {//Seleccionado a la persona
                            if (isset($confconcepto->idescalatarifapersona)) {
                                if (isset( $confTarifaEscala['escala'][$confconcepto->idescalatarifapersona])) {
                                    return $confTarifaEscala['escala'][$confconcepto->idescalatarifapersona]['importe'];
                                } else {
                                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no existe';
                                    return number_format(0, 2, '.', '');
                                }
                            } else if (isset($confconcepto->idescalatarifa)) {
                                if (isset( $confTarifaEscala['escala'][$confconcepto->idescalatarifa])) {
                                    return $confTarifaEscala['escala'][$confconcepto->idescalatarifa]['importe'];
                                } else {
                                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no existe';
                                    return number_format(0, 2, '.', '');
                                }
                            } else {
                                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no esta configurada en elementos salariales';
                                return number_format(0, 2, '.', '');
                            }
                            break;
                        }
                        case 3: {
                            //Seleccionado al cargo
                            if (isset($confconcepto->idescalatarifacargo)) {
                                if (isset( $confTarifaEscala['escala'][$confconcepto->idescalatarifacargo])) {
                                    return $confTarifaEscala['escala'][$confconcepto->idescalatarifacargo]['importe'];
                                } else {
                                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no existe';
                                    return number_format(0, 2, '.', '');
                                }
                            } else if (isset($confconcepto->idescalatarifa)) {
                                if (isset( $confTarifaEscala['escala'][$confconcepto->idescalatarifa])) {
                                    return $confTarifaEscala['escala'][$confconcepto->idescalatarifa]['importe'];
                                } else {
                                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no existe';
                                    return number_format(0, 2, '.', '');
                                }
                            } else {
                                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no esta configurada en elementos salariales';
                                return number_format(0, 2, '.', '');
                            }
                            break;
                        }
                        case 1: {//Reporte
                            $valorReporte = $this->obtenerValorPersonaReporte($persona['idpersona'], $persona['idcargosocupados'], $estructuraHoja['idconfreportescertificaciones'], $estructuraHoja['idvariablesconfreportescertificaciones'], $idconceptopd, $columna);
                            if ($cantidadEstructuraEscala == 1) {
                                if (!empty($confTarifaEscala['escala'])) {
                                    return $this->calcularValorEscalaReporteConcepto($confTarifaEscala['escala'], $valorReporte, $persona, $idconceptopd, $columna);
                                } else {
                                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no tiene una escala configurada';
                                    return number_format(0, 2, '.', '');
                                }
                            } else {

                                $idestructuraescalaradyacente = $confTarifaEscala['dependencia'][$estructuraHoja['idestructuraescalar']]['idestructuraescalar'];
                                $idescalatarifa = -1;
                                if ($confTarifaEscala['estructuraescala'][$idestructuraescalaradyacente]['idtipoentrada'] == 4) {
                                    $idescalatarifa = $confconcepto->idescalatarifapersona;
                                } else if ($confTarifaEscala['estructuraescala'][$idestructuraescalaradyacente]['idtipoentrada'] == 3) {
                                    $idescalatarifa = $confconcepto->idescalatarifacargo;
                                } else {
                                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no esta configurado en elementos salariales';
                                    return number_format(0, 2, '.', '');
                                }

                                $arrEscalas = array();
                                foreach ($confTarifaEscala['escala'] as $e) {
                                    if ($e['idpadre'] == $idescalatarifa) {
                                        $arrEscalas[] = $e;
                                    }
                                }
                                if (!empty($arrEscalas)) {

                                    return $this->calcularValorEscalaReporteConcepto($arrEscalas, $valorReporte, $persona, $idconceptopd, $columna);
                                } else {
                                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no tiene una escala configurada';
                                    return number_format(0, 2, '.', '');
                                }
                            }
                            break;
                        }
                    }
                } else {
                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no tiene una estructura hoja';
                    return number_format(0, 2, '.', '');
                }
            } else {
                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no tiene valores';
                return number_format(0, 2, '.', '');
            }
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' no esta configurada';
            return number_format(0, 2, '.', '');
        }
    }

    /* Funcion que busca el valor de la escala en dependencia del valor del reporte y ceretificaciones */

    private function calcularValorEscalaReporteConcepto($arrEscala, $valor, $persona, $idconceptopd, $columna)
    {
        // FIXME: $confTarifaEscala no se encontraba definida y generaba noticias en el codigo php
        $confTarifaEscala = array('denominacion' => '');
        foreach ($arrEscala as $e) {
            $vi = $e['valorinicial'] == '' ? 0 : $e['valorinicial'];
            $vf = $e['valorfinal'] == '' ? 0 : $e['valorfinal'];
            switch ($e['idoperadorcomparacion']) {
                case 1: {
                    if ($vi == $valor) {
                        return $e['importe'];
                    }
                    break;
                }
                case 2: {
                    if ($valor < $vi) {
                        return $e['importe'];
                    }
                    break;
                }
                case 3: {
                    if ($valor > $vi) {
                        return $e['importe'];
                    }
                    break;
                }
                case 4: {
                    if ($valor >= $vi) {
                        return $e['importe'];
                    }
                    break;
                }
                case 5: {
                    if ($valor <= $vi) {
                        return $e['importe'];
                    }
                    break;
                }
                case 6: {
                    if ($valor >= $vi && $valor <= $vf) {
                        return $e['importe'];
                    }
                    break;
                }
                case 7: {
                    if ($valor > $vi && $valor < $vf) {
                        return $e['importe'];
                    }
                    break;
                }
            }
        }

        $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'No se encontro ningun valor de la escala del concepto de percepcion y descuento ' . $confTarifaEscala['denominacion'] . ' que coincida con los datos del reporte';
        return number_format(0, 2, '.', '');
    }

    /* Funcion para calcular las retenciones de la persona */

    private function calcularRetenciones($idsistemapago, $persona, $tiporetencion = NULL, $total = -1, $columna)
    {
        if (!empty($this->d->condicionesretenciones))/* Existen condiciones configuradas */ {
            if (isset( $this->d->retenciones[$persona['idpersona']])) /* La persona tiene retenciones */ {

                if ($total != -1) /* Calcular el total de retenciones */ {
                    if (isset( $this->retencionescalculadas[$persona['idcargosocupados']])) {
                        return number_format($this->retencionescalculadas[$persona['idcargosocupados']]['total'], 2, '.', '');
                    } else {
                        $valor = $this->calcularRetencionesAplicar($idsistemapago, $persona, $tiporetencion, $total, $columna);
                        return number_format($valor, 2, '.', '');
                    }
                } else /* Calcular una retencion */ {
                    if (isset( $this->d->retenciones[$persona['idpersona']]->tiporetencion[$tiporetencion])) {
                        /* Pregunto si la persona tiene retenciones aplicadas */
                        if (isset( $this->d->retencionesaplicadas[$persona['idpersona']])) {
                            /* Pregunto si la persona tiene retenciones aplicadas del tipo a calcular */
                            if (isset( $this->d->retencionesaplicadas[$persona['idpersona']]->tiporetencion[$tiporetencion])) {
                                return number_format(0, 2, '.', '');
                                $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La retención ha sido aplicada en otro pago.';
                            }
                        }
                        if (isset( $this->retencionescalculadas[$persona['idcargosocupados']])) {

                            if (isset( $this->retencionescalculadas[$persona['idcargosocupados']][$tiporetencion])) {
                                $retencion = 0;
                                foreach ($this->retencionescalculadas[$persona['idcargosocupados']][$tiporetencion] as $ret) {
                                    $retencion += $ret;
                                }
                                return number_format($retencion, 2, '.', '');
                            } else {
                                $valor = $this->calcularRetencionesAplicar($idsistemapago, $persona, $tiporetencion, $total, $columna);
                                return number_format($valor, 2, '.', '');
                            }
                        } else {
                            $valor = $this->calcularRetencionesAplicar($idsistemapago, $persona, $tiporetencion, $total, $columna);
                            return number_format($valor, 2, '.', '');
                        }
                    } else {
                        return number_format(0, 2, '.', '');
                    }
                }
            } else {
                return number_format(0, 2, '.', '');
            }
        } else {
            return number_format(0, 2, '.', '');
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'No hay condiciones configuradas de retenciones para este tipo de pago.';
        }
    }

    /* Funcion que busca y calcula las retenciones que se pueden aplicar a la persona */

    private function calcularRetencionesAplicar($idsistemapago, $persona, $tiporetencion = NULL, $total = -1, $columna)
    {

        $totalRetenciones = 0;
        $arrRetenciones = array();
        //Recorro todas las retenciones de la persona 
        foreach ($this->d->retenciones[$persona['idpersona']]->tiporetencion as $tr) {
            foreach ($tr as &$r) {
                $retencion = 0;
                //Si no tiene saldo limite se devuelve la mensualidad
                if ($r['saldolimite'] == 2) {
                    $retencion = $r['mensualidad'];
                //Si tiene saldo limite se descuenta hasta que no quede nada en el adeudo
                } else if ($r['saldolimite'] == 1) {
                    //Si no tiene saldo en el adeudo porque no se ha aplicado ninguna retencion
                    if($r['saldodeladeudo'] == null){
                        $retencion = $r['mensualidad'];
                    //Si tiene saldo en el adeudo
                    }else{
                        //Si el saldo en el adeudo es menor q la mensualidad se devuelve el saldo en el daeudo
                        if ($r['saldodeladeudo'] <= $r['mensualidad']) {
                            $retencion = $r['saldodeladeudo'];
                        //Si el saldo en el adeudo es mayor q la mensualidad
                        } else {
                            $retencion = $r['mensualidad'];
                        }
                    }
                }
                //if($persona['idpersona'] == 197 ){print_r($r);die;}
                $sumarAlTotal = 1;
                /* Verifico que este tipo de retencion no este aplicado para que sume al total de retenciones */
                /* Pregunto si la persona tiene retenciones aplicadas del tipo a calcular */
                if (isset( $this->d->retencionesaplicadas[$persona['idpersona']]->tiporetencion[$r['idtiporetencion']])) {
                    $this->retencionescalculadas[$persona['idcargosocupados']][$r['idtiporetencion']] = number_format(0, 2, '.', '');
                    $sumarAlTotal = -1;
                }
                if ($sumarAlTotal == 1) {
                    $r['retener'] = $retencion;
                    $totalRetenciones = $totalRetenciones + $retencion;
                    $arrRetenciones[] = $r;
                }
            }
        }//if($persona['idpersona'] == 197){print_r($this->d->retenciones[$persona['idpersona']]);die;}

        /* No se pudo calcular ninguna retencion, ya que todas fueron aplicadas en otros tipos de pagos
          El total es 0.00
         */
        if (empty($arrRetenciones)) {
            return number_format($totalRetenciones, 2, '.', '');
        }

        //Compruebo que se cumplan las condiciones
        $secumple = $this->comprobarSeCumpleRetenciones($idsistemapago, $persona, $totalRetenciones, $this->d->condicionesretenciones['expresionacalcularcumple'], $this->d->condicionesretenciones['indicadorescumple'], $columna);

        if ($secumple) {
            foreach ($arrRetenciones as $r) {
                if (!empty($tiporetencion)) {
                    if ($r['idtiporetencion'] == $tiporetencion) {/*Sumo el valor de las retenciones del mismo tipo*/
                        $this->retencionescalculadas[$persona['idcargosocupados']][$r['idtiporetencion']][$r['idretencionpersona']] = $r['retener'];
                    } /*else {
                        $this->retencionescalculadas[$persona['idcargosocupados']][$r['idtiporetencion']][$r['idretencionpersona']] = $r['retener'];
                    }*/
                } else {
                    $this->retencionescalculadas[$persona['idcargosocupados']][$r['idtiporetencion']][$r['idretencionpersona']] = $r['retener'];
                }
            }
            $this->retencionescalculadas[$persona['idcargosocupados']]['total'] = $totalRetenciones;
            if ($total != -1) {
                return number_format($totalRetenciones, 2, '.', '');
            } else {
                $retencion = 0;
                foreach ($this->retencionescalculadas[$persona['idcargosocupados']][$tiporetencion] as $ret) {
                    $retencion += $ret;
                }
                return number_format($retencion, 2, '.', '');
            }
        } else {
            //Paso a comprobar uno a uno las retenciones
            $totalRetenciones = 0;
            $this->retencionescalculadas[$persona['idcargosocupados']]['total'] = number_format(0, 2, '.', '');
            $fin = -1;
            foreach ($arrRetenciones as $r) {
                $secumple = false;
                $tr = $totalRetenciones + $r['retener'];
                if ($fin == -1) {
                    $expresioncalcular = ($r['tienelimitemaximo'] == 1 ? $this->d->condicionesretenciones['expresionacalcularlimite'] : $this->d->condicionesretenciones['expresionacalcularcumple']);
                    $arrindicadores = ($r['tienelimitemaximo'] == 1 ? $this->d->condicionesretenciones['indicadoreslimite'] : $this->d->condicionesretenciones['indicadorescumple']);

                    $expresioncalcular = empty($expresioncalcular) ? $this->d->condicionesretenciones['expresionacalcularcumple'] : $expresioncalcular;
                    $arrindicadores = empty($arrindicadores) ? $this->d->condicionesretenciones['indicadorescumple'] : $arrindicadores;

                    $secumple = $this->comprobarSeCumpleRetenciones($idsistemapago, $persona, $tr, $expresioncalcular, $arrindicadores, $columna);
                }
                if ($secumple) {
                    $totalRetenciones = $tr;
                    $this->retencionescalculadas[$persona['idcargosocupados']][$r['idtiporetencion']][$r['idretencionpersona']] = number_format($r['retener'], 2, '.', '');
                    $this->retencionescalculadas[$persona['idcargosocupados']]['total'] = number_format($totalRetenciones, 2, '.', '');
                } else {
                    $this->retencionescalculadas[$persona['idcargosocupados']][$r['idtiporetencion']][$r['idretencionpersona']] = number_format(0, 2, '.', '');
                    $fin = 1;
                }
            }
        }

        if ($total != -1) {
            return $this->retencionescalculadas[$persona['idcargosocupados']]['total'];
        } else {
            $retencion = 0;
            foreach ($this->retencionescalculadas[$persona['idcargosocupados']][$tiporetencion] as $ret) {
                $retencion += $ret;
            }
            return number_format($retencion, 2, '.', '');
        }
    }

    private function comprobarSeCumpleRetenciones($idsistemapago, $persona, $totalretencion, $expresioncalcular, $arrindicadores, $columna)
    {
        $arrayind = array();
        foreach ($arrindicadores as $rind) {
            $valor = 0;
            $rexplode = explode('_', $rind);
            switch ($rexplode[0]) {
                case 'SPC': {
                    if ($persona['idsituacionlaboral']) {
                        $valor = ($this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'] != null) ? $this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'] : number_format(0, 2, '.', '');
                    } else {
                        $valor = ($this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'] != null) ? $this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'] : number_format(0, 2, '.', '');
                    }
                    break;
                }
                case 'CRM': {
                    $valor = $this->calcularConceptoRetribucionMonetaria($idsistemapago, $persona, $rexplode[1], $columna);
                    break;
                }
                case 'VG': {
                    $valor = $this->calcularVariableGeneral($rexplode[1], $persona, $columna);
                    break;
                }
                case 'RET': {
                    $valor = $totalretencion;
                    break;
                }
                case 'ESTN': {
                    $idestructuranomina = $rexplode[1];
                    //Buscando a la persona en el arreglo de valores
                    foreach ($this->valoresnomina as $valores){
                        $idpersona = explode('-', $valores['id'])[0];
                        //Si es la persona en la nomina
                        if($persona['idpersona'] == $idpersona){
                            $valor = ($valores["c$idestructuranomina"])?$valores["c$idestructuranomina"]:0;
                        }

                    }
                    break;
                }
                default : {
                    $valor = number_format(0, 2, '.', '');
                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El indicador ' . $rexplode[0] . ' no esta definido para la formula para las condiciones de las retenciones';
                    break;
                }
            }
            $arrayind[] = array('idindicador' => $rind, 'valor' => $valor);
        }
        //Evaluando la expresion matematica
        if (!empty($expresioncalcular)) {
            $valorind = $this->EvaluarExpresionMatematica($arrayind, $expresioncalcular);
        } else {
            $valor = number_format(0, 2, '.', '');
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La fórmula para las condiciones de las retenciones no está definida.';
        }
        if ($valorind->codigo == 1) {
            return $valorind->valor == 1 ? true : false;
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = $valorind->error;
            return false;
        }
    }

    private function comprobarSeCumpleDescuentos(&$idsistemapago, &$persona, $valorDescuento, $expresioncalcular, $arrindicadores, &$columna)
    {
        $arrayind = array();
        foreach ($arrindicadores as $rind) {
            $valor = 0;
            $rexplode = explode('_', $rind);
            switch ($rexplode[0]) {
                case 'SPC': {
                    if ($persona['idsituacionlaboral']) {
                        $valor = ($this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'] != null) ? $this->d->sueldoxcargo[$persona['idcargosocupados']]['spcsitservicio'] : number_format(0, 2, '.', '');
                    } else {
                        $valor = ($this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'] != null) ? $this->d->sueldoxcargo[$persona['idcargosocupados']]['spccargo'] : number_format(0, 2, '.', '');
                    }
                    break;
                }
                case 'CRM': {
                    $valor = $this->calcularConceptoRetribucionMonetaria($idsistemapago, $persona, $rexplode[1], $columna);
                    break;
                }
                case 'VG': {
                    $valor = $this->calcularVariableGeneral($rexplode[1], $persona, $columna);
                    break;
                }
                case 'RET': {
                    $valor = $this->calcularRetenciones($idsistemapago, $persona, NULL, 1, $columna);
                    //Fixme: Se adiciona la definicion de la variable $idconceptorm  porque no existe
                    $idconceptorm = '';
                    $sumaValor = 0;
                    if (!empty($persona['referencia']) && $this->d->conceptosrm[$idconceptorm]->sistemapago[$idsistemapago]['calcularpluriempleo'] == 1) {
                        foreach ($persona['referencia'] as $rp) {
                            $idsp = ($idsistemapago == -1 ? -1 : -2);
                            if ($this->d->personas[$rp]['idsituacionlaboral'] != '') {
                                $idsp = $this->d->configesss[$rp]->sp;
                            } else {
                                $idsp = $this->d->configescp[$rp]->sp;
                            }
                            $sumaValor += $this->calcularRetenciones($idsistemapago, $this->d->personas[$rp], NULL, 1, $columna);
                        }
                    }
                    $valor = $valor + $sumaValor;
                    break;
                }
                default : {
                    $valor = number_format(0, 2, '.', '');
                    $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'El indicador ' . $rexplode[0] . ' no esta definido para la formula de los descuentos a aplicar.';
                    break;
                }
            }
            $arrayind[] = array('idindicador' => $rind, 'valor' => $valor);
        }
        //Evaluando la expresion matematica
        if (!empty($expresioncalcular)) {
            $valorind = $this->EvaluarExpresionMatematica($arrayind, $expresioncalcular);
        } else {
            $valor = number_format(0, 2, '.', '');
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = 'La fórmula de las condiciones de los descuentos a aplicar no está definida.';
        }
        if ($valorind->codigo == 1) {
            /*Si la resta del resultado de la formula con el valor del concepto de descuento es mayor o igual a 0, puedo aplicarlo*/
            if ($valorind->valor - $valorDescuento > 0 && $valorDescuento > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            $this->erroresespecificos['p' . $persona['idpersona'] . '-' . $persona['idcargosocupados']][$columna][] = $valorind->error;
            return false;
        }
    }

    /* Funcion que evalua la expresion matematica a calcular */

    public function EvaluarExpresionMatematica($arrIndicadoresValor, $expresionacalcular)
    {
        $key =  md5('this::EvaluarExpresionMatematica'. serialize( $arrIndicadoresValor ). $expresionacalcular);
        $cache = $this->getCache($key);
        if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
            return $cache;

        $r = new stdClass();
        /* Busco los indicadores dentro de la expresion matematica y compruebo que esten todos */
        /* Reemplaza los indicadores por sus valores */
        foreach ($arrIndicadoresValor as $i => $v) {
            $ind = 'I' . $v['idindicador'];
            /* Tiene en cuenta la exactitud de la variable */
            $expresionacalcular = preg_replace_callback(
                '/' . $ind . '(\D|\Z)/', function ($matches) use ($v) {
                return $v['valor'] . $matches[1];
            }, $expresionacalcular
            );
        }
        // FIXME: $resultadoexpresion no se encontraba definida por estar evaluada
        $resultadoexpresion = '';
        /* Reemplaza los operadores condicionales */
        $expresionacalcular = str_replace('SI_', ' if( ', $expresionacalcular);
        $expresionacalcular = str_replace('ENTONCES', ' ) ', $expresionacalcular);
        $expresionacalcular = str_replace('SINO', ' else ', $expresionacalcular);
        $expresionacalcular = str_replace('DEVOLVER', " \$resultadoexpresion = ", $expresionacalcular);

        /* Compruebo si quedaron indicadores sin reemplazar por su valor */
        $pos = strpos($expresionacalcular, 'I');
        if ($pos === FALSE) {

            /* Si me encuentro el operador if la expresion no se considera booleana y la expresion no es lineal */
            $esLineal = 1;
            if (strpos($expresionacalcular, 'if') !== FALSE) {
                $esbooleana = 0;
                $esLineal = 0;
            }

            /* Evaluo la expresion matematica y almaceno en la variable $resultadoexpresion el valor */
            try {
                /* Desabilito todos los errores */
                error_reporting(0);
                if ($esLineal == 1)
                    $expresionacalcular = "\$resultadoexpresion = " . $expresionacalcular . " ;";
                else
                    $expresionacalcular = "\$resultadoexpresion = NULL; " . $expresionacalcular;
                $resultado = eval($expresionacalcular);
                /* Si la funcion eval devuelve falso es que hubo error sino la expresion está bien */
                if ($resultado === false) {
                    $r->codigo = 3;
                    $r->valor = number_format(0, 2, '.', '');
                    $r->booleana = 0;
                    $r->expresionacalcular = $expresionacalcular;
                    $r->error = "Error de sintaxis en la formula a evaluar. Formula: " . $expresionacalcular;
                    return $r;
                }
            } catch (Exception $e) {
                throw $e;
            }

            $r->codigo = 1;
            $r->expresionacalcular = $expresionacalcular;
            $r->valor = $resultadoexpresion;

            /*
             * El valor a devolver siempre va a ser un objeto y con valor numérico
             * codigo: 1 ok, 3 error
             * booleana: 0 no, 1 si
             * valor: numero
             * error: Mensaje del error
             */
            return $this->setCache($key, $r);
        } else {
            $r->codigo = 3;
            $r->booleana = 0;
            $r->valor = number_format(0, 2, '.', '');
            $r->expresionacalcular = $expresionacalcular;
            $r->error = "Existe(n) " . substr_count($expresionacalcular, 'I') . " indicador(es) que no se encuentra(n) en la expresi&oacute;n matem&aacute;tica. Formula: " . $expresionacalcular;
            return $r;
        }
    }

    private function guardarMontosConceptos($idelaborarpago, $identidad)
    {
        //Dame los datos de las nominas aprobadas y las certificadas
        $objNomina = new DatNomina();
        $objNominaDatos = new DatNominaDatos();
        $objConfigConceptosContables = new ConfigConceptosContables();
        $arrayDatNomina = $objNomina->getNominasAprobadasCertificadas($idelaborarpago);
        $arraydatosccont = array();
        if (count($arrayDatNomina) > 0) {
            //BUSCANDO LOS CAMPOS DE LA NOMINA
            $sqlEstructurarCamposNomina = "select distinct estr.idestructuramodelodomina, estr.idtiponomina from mod_nomina.conf_estructuramodelosnomina estr
		                            inner join mod_nomina.conf_estructuramodelosnominaentidad ce on (ce.idestructuramodelodomina = estr.idestructuramodelodomina)
		                            inner join mod_nomina.nom_tiponomina nomtn on (nomtn.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									where elp.idelaborarpagos = ? and ce.idestructura = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrEstructuraTotalNomina = $conn->fetchAll($sqlEstructurarCamposNomina, array($idelaborarpago, $identidad));
            //ARRAY DE CONCEPTOS CONTABLES
            $arrayconceptoscontables = $objConfigConceptosContables->obtenerListadoTodosConfigConceptosContablesEntidad($arrEstructuraTotalNomina[0]['idtiponomina'], $identidad);
            $contccont = 0;
            if (count($arrayconceptoscontables) > 0) {
                foreach ($arrayconceptoscontables as $iccont => $rccont) {
                    $arraydatosccont[$contccont]['denominacion'] = $rccont['denominacion'];
                    $arraydatosccont[$contccont]['idestructuramodelodomina'] = $rccont['idestructuramodelodomina'];
                    $arraydatosccont[$contccont]['importeconceptocontable'] = number_format(0, 2, '.', '');
                    $contccont++;
                }
                //Buscando los centros de costo que estan en la entidad
                $sqlCentrosdeCosto = "select distinct(centrocosto.idcentrogrupo)
		                      from mod_contabilidadcosto.nom_centrocosto centrocosto
		                      inner join mod_nomina.dat_cargosocupados cocup on (cocup.idcentrocosto = centrocosto.idcentrogrupo)
		                      where centrocosto.idestructuracomun = $identidad";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrcentroscosto = $conn->fetchAll($sqlCentrosdeCosto);
                foreach ($arrayDatNomina as $i => $v) {
                    $datosnomina = $objNominaDatos->obtenerDatosNomina($v['idnomina']);
                    //RECORRIENDO LOS DATOS DE LAS NOMINAS
                    foreach ($datosnomina as $cd => $rdat) {
                        $valores = unserialize($rdat['valores']);
                        //RECORRIENDO LAS PERSONAS
                        foreach ($valores as $ip => $rp) {
                            //OBTENIENDO EL TOTAL DE LOS CONCEPTOS CONTABLES
                            foreach ($arraydatosccont as $iccf => $rccf) {
                                $idestructurarmodelo = $rccf['idestructuramodelodomina'];
                                $importeconccontable = $rp["c$idestructurarmodelo"];
                                $importefinal = number_format($rccf['importeconceptocontable'], 2, '.', '') + number_format($importeconccontable, 2, '.', '');
                                $arraydatosccont[$iccf]['importeconceptocontable'] = number_format($importefinal, 2, '.', '');
                                //Desglose
                                $centcosto = $rp["idcentrocosto"];
                                if ($importeconccontable != 0) {
                                    $importefinalcc = number_format($arraydatosccont[$iccf]['desglosecentcosto'][$centcosto]['importe'], 2, '.', '') + number_format($importeconccontable, 2, '.', '');
                                    $arraydatosccont[$iccf]['desglosecentcosto'][$centcosto]['importe'] = number_format($importefinalcc, 2, '.', '');
                                }

                            }

                        }
                        //Agrupando a las personas en centros de costo
                        /*foreach($arraydatosccont as $iccont => $rccont) {
                            foreach($arrcentroscosto as $rccent){
                                if($rccent['idcentrogrupo'] == $rp["idcentrocosto"]){

                                }
                            }
                        }*/
                    }
                }
                //Si este periodo de pago tiene conceptos con montos se elimina
                $datosmontoconceptos = DatConceptosMontoElaborarPago::obtenerArrDatConceptosMontoXElaborarPagoEstNomina($idelaborarpago);
                if (count($datosmontoconceptos) > 0) {
                    foreach ($datosmontoconceptos as $irdc => $rdc) {
                        //Delete
                        $objDelete = Doctrine::getTable('DatConceptosMontoElaborarPago')->find($rdc['idconceptoelaborarpago']);
                        $objDelete->delete();
                    }
                }
                //Salvando en base de datos los montos de los cacoceptos contables
                foreach ($arraydatosccont as $irdm => $rdm) {
                    //Save
                    $objsave = new DatConceptosMontoElaborarPago();
                    $objsave->monto = $rdm['importeconceptocontable'];
                    $objsave->idelaborarpagos = $idelaborarpago;
                    $objsave->idestructuramodelodomina = $rdm['idestructuramodelodomina'];
                    $objsave->desglosecentcosto = (count($rdm['desglosecentcosto']) > 0) ? serialize($rdm['desglosecentcosto']) : null;
                    $objsave->save();
                }
                return;
            }
        } else {
            return;
        }
    }

    /** Funcion para generar un codigo para organizar por el orden en las plantillas nominales
     */
    public function fnOrganizarPlantillas($orden, &$divisor)
    {
        $formatorden = 0;
        if ($orden >= 0 && $orden <= 99) {
            $formatorden = (int)($orden / 10);
        } else if ($orden >= 100 && $orden <= 999) {
            $formatorden = (int)($orden / 100);
        }
        $divisor *= (strlen($orden) != strlen($divisor)) ? 10 : 1;
        $letra = chr(97 + $formatorden);

        return $letra . "" . $orden % 10;
    }

    /** Funcion para cambiar el estado de los reportes
     *  Autor: Ing. Dainier Velazquez Labrada
     */
    public function fnModificarEstadoReporte($identidad, $idelaborarpago, $valor)
    {
        /*Verifico si el tipo de pago para este periodo depende de un reporte*/
        $idtipopago = DatElaborarPagos::obtenerTipoPagoPeriodo($idelaborarpago);
        $tipopago = NomTipoPago::obtenerObjTipoPagoDadoId($idtipopago);
        //if ($tipopago->modoseleccionpersonas == 3) {
            //Cambiando el estado del reporte a aprobado(3)
           // if (!empty($tipopago->idconfreportescertificaciones)) {
                $ffinperiodo = DatElaborarPagos::obtenerFechaInicioPeriodo($idelaborarpago, $identidad);
                $finicioperiodo = DatElaborarPagos::obtenerFechaFinPeriodo($idelaborarpago, $identidad);
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                //Obteniendo los Reportes Configurados en Formas y Sistemas de Pago
                $sqlfsp = "select dv.idconfreportescertificaciones from mod_nomina.dat_variableauxconceptospdformasysistemaspago dv
                        inner join mod_nomina.conf_conceptospdformasysistemaspago cfs on(cfs.idconfconceptospdformasysistemaspago = dv.idconfconceptospdformasysistemaspago)
                        inner join mod_nomina.conf_conceptosportiposysistemaspago cs on(cs.idconfconceptosportiposysistemaspago = cfs.idconfconceptosportiposysistemaspago)
                        where cs.identidad = ?;";
                $repformsistpago = $conn->fetchAll($sqlfsp, array($identidad));
                $arrrepformspagofinal = array();
                foreach($repformsistpago as $rfs){
                    if($rfs['idconfreportescertificaciones']){
                        $arrrepformspagofinal[] = $rfs['idconfreportescertificaciones'];
                    }
                }
                $arrrepformspagofinal = array_unique($arrrepformspagofinal);
                //Reportes a Certificar
                $sql = "select idreportescertificaciones from mod_nomina.dat_reportescertificaciones
                        where identidad = ?
                        and ('{$ffinperiodo}'::date = fechainicio and '{$finicioperiodo}'::date = fechafin)
                        and idconfreportescertificaciones IN (" . implode(',', $arrrepformspagofinal) . ");";
                $datosrep = $conn->fetchAll($sql, array($identidad));
                //Cambiandole el Estado a todos los Reportes que coincidan con el rango de fecha de la Nomina y esten Configurados en Formas y Sistemas de Pago
                if (count($datosrep) > 0) {
                    foreach($datosrep as $rep){
                        $idreportescertificaciones = $rep['idreportescertificaciones'];
                        //Obteniendo todos los datos a serializar
                        $datos = DatElementosReportesCertificaciones::obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad);
                        $datosserializados = ($valor == 3) ? serialize($datos) : null;
                        $sqlmodificarreporte = "UPDATE mod_nomina.dat_reportescertificaciones set estado = ?, datos = ? where idreportescertificaciones = $idreportescertificaciones
                                                and identidad = $identidad";
                        $conn->fetchAll($sqlmodificarreporte,array($valor,$datosserializados));                        
                        //Obteniendo el reporte a modificar.
                        //$objReporte = DatReportesCertificaciones::obtenerObjReporteDadoId($idreportescertificaciones);
                        //Modificando los datos del reporte.
                        //$objReporte->estado = $valor;
                        //$objReporte->datos = $datosserializados;
                        //Guardando los datos.
                        //$objReporte->save();
                    }
                }
            //}
       // }
    }

    public function actualizarCobrosyPagos($identidad, $idelaborarpagos, $idComprobante, $numComprobante, $idtasa, $idmoneda, $idoperacion, $arrayidnomina)
    {//
        //Actualizando el modulo de cobros y pagos
        //Si es comprobante de operaciones
        $idtiponomina = ConfigModeloNomina::obtenerIdTiposNominaporTipoPago($idelaborarpagos);
        $reintegro = NomTipoNomina::obtenerReintegroNomina($idtiponomina[0]['idtiponomina']);
        $sql = "select * from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $modulo = $conn->fetchAll($sql);
        if ($modulo[0]['cobroypago'] == 1) {
            $idsubsistema = $this->global->Subsistema->idsubsistema;
            $fechacontable = $this->integrator->datosmaestros->fechaContableSubsistema($identidad, $idsubsistema);
            //Comprobante en contabilidad
            $sqlcomprobante = "select * from mod_contabilidad.dat_comprobante  where idcomprobante = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrcomp = $conn->fetchAll($sqlcomprobante, array($idComprobante));
            //Buscando el iddoc por la operacion contable
            $arraydatosopcc = $this->integrator->datosmaestros->obtenerOperaciones(null, null, null, $idoperacion);
            //Iddocumento
            $sqlop = "select * from mod_datosmaestros.dat_operacionesentidad where idoperacionesentidad = ?";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrop = $conn->fetchAll($sqlop, array($arraydatosopcc[0]['idoperacionesentidad']));
            foreach ($arrayidnomina as $ridncp) {
                //Si la nomina no es de reintegros (Para las nominas de salario, vacaciones, subsidios, licencias de maternidad....)
                if ($reintegro == 2) {
                    //Validar si la nomina tiene retenciones configuradas a aplicar
                    $cantcamposretenciones = ConfigEstructurarModelosNomina::obtenerCantCamposRetenciones($idelaborarpagos);
                    if ($cantcamposretenciones > 0) {
                        //Retenciones aplicadas
                        $arrpersonasretencionesaplicadas = HisRetencionesPersona::obtenerHistoricoSubMayorRetencionesIdNomina($ridncp);
                        $this->liquidarRetencionesAplicadas($arrpersonasretencionesaplicadas, $arrcomp, $identidad, $idmoneda, $idtasa, $arrop, $idoperacion, $fechacontable, $modulo[0]['fijaretencionesporpagar']);
                    }

                    //Cuentas por cobrar por personas por conceptos de pagos en divisa o impuestos ing. personales o cotribucion esp. seg. social no aplicados, liquidacion de cuentas por cobrar porque la deuda de la persona salio por nomina, ej. Contravalor CUC.
                    $this->crearCuentasPorCobraryPagar($identidad, $idtiponomina, $idelaborarpagos, $arrcomp, $arrop, $idoperacion, $idmoneda, $idtasa, $ridncp, 1, $fechacontable);
                    //Si la nomina es de reintegros
                } else {
                    $this->crearObligacionNominaReintegros($idelaborarpagos, $ridncp, $identidad, $arrcomp, $idmoneda, $arrop, $fechacontable);
                }
            }
            //Impuestos y contribuciones con el presupuesto del estado.
            $return = $this->crearCuentasPorCobraryPagar($identidad, $idtiponomina, $idelaborarpagos, $arrcomp, $arrop, $idoperacion, $idmoneda, $idtasa, $ridncp, 2, $fechacontable);
            if ($return) {
                return 'ok';
            }

        }
    }

    public function liquidarRetencionesAplicadas($arrpersonasretencionesaplicadas, $arrcomp, $identidad, $idmoneda, $idtasa, $arrop, $idoperacion, $fechacontable, $fijaretencionesporpagar)
    {
        //Si se aplicaron retenciones en la nomina
        if (count($arrpersonasretencionesaplicadas) > 0) {
            //LLamar aqui el servicio de cobros y pagos para actualizar las retenciones de las personas
            $arraypersonas = array();
            foreach ($arrpersonasretencionesaplicadas as $rprap) {
                //Si es una retencion que creo la obligacion en cobros y pagos desde la carga inicial del submayor de retenciones (Responsabilidad Material)
                if ($rprap['cobrosypagos'] == 1) {
                    $arrdata = array(
                        'numero' => $rprap['idretencionpersona'],//numerodocumento,
                        'fecha' => $fechacontable,//$fechaComprobante,
                        'comentario' => $rprap['denominacion'],//$arrayAnticipos[0]['comentario'],
                        'importemo' => $rprap['retenido'],
                        'importemb' => $rprap['retenido'],
                        'idestructura' => $identidad,//$idEstructura,
                        'idmoneda' => $idmoneda,//idmoneda,
                        'idcuenta' => $rprap['cuentacontable'],//idcuenta,
                        'idcliente' => $rprap['idpersona'],//
                        'idperiodo' => $arrcomp[0]['idperiodo'],//$idperiodo,
                        'numcmp' => $arrcomp[0]['numerocomprobante'],//$numComprobante,
                        'iddoc' => $arrop[0]['iddoc']//
                    );
                    //Actualizando las retenciones
                    $this->integrator->copa->ActualizarDerechoObligacion($rprap['iddocumentoobligacion'], array('liquidadomb' => abs($rprap['retenido']), 'pagadomb' => abs($rprap['retenido']),
                        'liquidaDirecto' => TRUE, 'resumenLiq' => $arrdata));
                    //Si es una retencion de las que se crea la obligacion en la nomina y se liquidan desde caja y banco
                } else {
                    //Validando si las retenciones por pagar se fijan en cobros y pagos
                    if($fijaretencionesporpagar == 1){
                        $stdPase = new stdClass();
                        //Cuenta por pagar
                        $stdPase->tipo = 2;
                        $stdPase->tipopersona = 3;
                        $stdPase->iddocumento = $rprap['idretencionpersona'];//id tipo de retencion. Para vizualizar en cobros y pagos en el campo documento el nombre de la retencion
                        $stdPase->idcomprobante = $arrcomp[0]['idcomprobante'];//Datos del comprobante
                        $stdPase->numcomprobante = $arrcomp[0]['numerocomprobante'];//Datos del comprobante
                        $stdPase->fechacomprobante = $arrcomp[0]['fechaemision'];//Datos del comprobante
                        //$this->obtenerCondicionPago($documento['iddocumento'], $datosDocumentos['subsistema'], $stdPase);
                        $stdPase->numero = $rprap['idretencionpersona'];//Id de la retencion de la persona para identificarla en cobros y pagos
                        $stdPase->idsubsistema = $arrcomp[0]['idsubsistema'];//Datos del comprobante
                        $stdPase->idperiodo = $arrcomp[0]['idperiodo'];//Datos del comprobante
                        $stdPase->fecha = $arrcomp[0]['fechaemision'];//Datos del comprobante
                        $stdPase->fechaemision = $arrcomp[0]['fechaemision'];//Datos del comprobante
                        $stdPase->comentario = $rprap['denominacion'];
                        $stdPase->idcliente = $rprap['idpersona'];//Id persona
                        $stdPase->tipodocumento = $arrop[0]['iddoc'];//Id documento q tiene la operacion
                        $stdPase->importe = $rprap['retenido'];
                        $stdPase->idcuenta = $rprap['cuentacontable'];
                        $stdPase->idoperacioncontable = $idoperacion;
                        $stdPase->operaciones[0]->importemb = $rprap['retenido'];
                        $stdPase->operaciones[0]->importemo = $rprap['retenido'];
                        $stdPase->operaciones[0]->idmoneda = $idmoneda;
                        $stdPase->operaciones[0]->tasa = $idtasa;
                        $stdPase->operaciones[0]->idoperacioncontable = $idoperacion;
                        // $stdPase->idoperacioncontable = $arrop[0]['idoperacionesentidad'];
                        array_push($arraypersonas, $stdPase);
                    }

                }

            }
            //Creando las cuentas por pagar de la entidad con el banco por el monto de las retenciones
            if (count($arraypersonas)) {
                return $this->integrator->copa->InsertarDerechoObligacionSubsistemaExterno(
                    $arraypersonas, $identidad, $this->global->Subsistema->idsubsistema
                );
            }
        }
    }

    public function crearObligacionNominaReintegros($idelaborarpagos, $ridncp, $identidad, $arrcomp, $idmoneda, $arrop)
    {
        $datosperiodopago = DatElaborarPagos::obtenerPeriodosPagoEntidad($idelaborarpagos);
        $arridtiponomina = ConfigModeloNomina::obtenerIdTiposNominaporTipoPago($idelaborarpagos);
        $camposalario = ConfigEstructurarModelosNomina::obtenerCampoADevengarEntidad($idelaborarpagos, 1, $identidad);
        $nominadatos = DatNominaDatos::obtenerDatosNomina($ridncp)[0]['valores'];
        $datos = unserialize($nominadatos);
        //Desde aqui se liquida la cuenta por pagar por concepto de reintegro
        foreach ($datos as $rd) {
            $rexplode = explode('-', $rd['id']);
            $rpersona = DatReintegros::obtenerDatosPersona($rexplode[0], $identidad);
            $arrdata = array(
                'numero' => $rpersona[0]['idelaborarpagos'],//numerodocumento, Este tiene que ser el mismo con el que el modulo de banco fijo la cuenta por pagar por el salario no reclamado
                'fecha' => $arrcomp[0]['fechaemision'],//$fechaComprobante,
                'comentario' => 'Nomina de reintegros del ' . $datosperiodopago[0]['fechainicioperiodo'] . ' al ' . $datosperiodopago[0]['fechafinperiodo'],//$arrayAnticipos[0]['comentario'],
                'importemo' => $rd["c$camposalario"],
                'importemb' => $rd["c$camposalario"],
                'idestructura' => $identidad,//$idEstructura,
                'idmoneda' => $idmoneda,//idmoneda,
                'idcuenta' => $rpersona[0]['idcuenta'],//idcuenta,
                'idcliente' => $rexplode[0],//
                'idperiodo' => $arrcomp[0]['idperiodo'],//$idperiodo,
                'numcmp' => $arrcomp[0]['numerocomprobante'],//$numComprobante,
                'iddoc' => $arrop[0]['iddoc']//
            );
            //Actualizando las retenciones
            return $this->integrator->copa->ActualizarDerechoObligacion($rpersona[0]['iddocumentoobligacion'], array('liquidadomb' => abs($rd["c$camposalario"]), 'pagadomb' => abs($rd["c$camposalario"]),
                'liquidaDirecto' => TRUE, 'resumenLiq' => $arrdata));
        }
    }

    //Impuestos y contribuciones con el presupuesto del estado, cuentas por cobrar por personas por conceptos de pagos en divisa o impuestos ing. personales o cotribucion esp. seg. social no aplicados, liquidacion de cuentas por cobrar porque la deuda de la persona salio por nomina, ej. Contravalor CUC.
    //&params: $idtipointegracioncobrospagos. Este campo indica si la afectacion en cobros y pagos se hace a partir del monto del concepto o si es por personas
    public function crearCuentasPorCobraryPagar($identidad, $idtiponomina, $idelaborarpagos, $arrcomp, $arrop, $idoperacion, $idmoneda, $idtasa, $ridncp, $idtipointegracioncobrospagos, $fechacontable)
    {
        $objConfEstructuraNomina = new ConfigEstructurarModelosNomina();
        $objModeloNominaConceptos = new DatDatosModeloNominaConceptos();
        $objNomConceptoRM = new NomConceptoRM();
        $objConfConceptoContable = new ConfigConceptosContables();
        $objMonto = new DatConceptosMontoElaborarPago();
        //Campos de la nomina
        $arrcamposnomina = $objConfEstructuraNomina->obtenerAllDatosModeloNominaxIdTipoNomina($identidad, $idtiponomina[0]['idtiponomina']);
        //Estructuras de la nomina
        $arrobligacionespresupuesto = array();
        $contpest = 0;//print_r($arrcamposnomina);die;
        foreach ($arrcamposnomina as $iem => $remn) {
            //Si son campos calculables
            if ($remn['idtipocampo'] == 2 || $remn['idtipocampo'] == 3 || $remn['idtipocampo'] == 4) {
                    //Concepto contable de la estructura de nomina
                    $arrccont = $objConfConceptoContable->obtenerConceptoContableEstructuraNomina($identidad, $remn['idestructuramodelodomina']);
                    //Si es un campo de referencias de nominas(descuento por nomina) q liquida una obligacion.
                    $liquidacobrosypagos =  $arrccont[0]['liquidacobrosypagos'];
                    $idestructuramodelodomina = $remn['idestructuramodelodomina'];
                     if($liquidacobrosypagos == 1){
                        $idestnominaliquidaobligacion = $arrccont[0]['idcampoliquidaobligacion'];
                        //Si es un campo de referencias de nomina que dentro tiene el campo que fijo la obligacion
                        $this->liquidarObligacionFijadaPorNomina($idestructuramodelodomina, $idestnominaliquidaobligacion,$remn, $ridncp, $arrcomp, $identidad, $idmoneda, $arrop, $fechacontable);
                     //Si el conccepto contable afecta cobros y pagos
                     }else{
                         if($arrccont[0]['idtienecobrospagos'] == 1){
                             $idtipocobrospagos = $arrccont[0]['idtipocobrospagos'];
                             //Si la afectacion en cobros y pagos es por Personas
                             if($idtipointegracioncobrospagos == 1 && $arrccont[0]['idtipointegracioncobrospagos'] == 1){
                                 $cuentacontable = $arrccont[0]['cuentacontable'];
                                 $denomcc = $arrccont[0]['denominacion'];
                                 //Si es una afectacion en cobros y pagos a nivel de personas
                                 $this->crearObligacionesPersonas($identidad, $idelaborarpagos, $arrcomp, $arrop, $idoperacion, $idmoneda,
                                     $idtasa, $cuentacontable, $ridncp, $remn['idestructuramodelodomina'], $idtipocobrospagos, $denomcc, $fechacontable);
                                 //Si la afectacion en cobros y pagos es Global(Monto concepto)
                             }else if($idtipointegracioncobrospagos == 2 && $arrccont[0]['idtipointegracioncobrospagos'] == 2){
                                 $obligacion = $arrccont[0]['idparrafofiscal'];
                                 $idclientecuentacontablecp = $arrccont[0]['idclienteproveedorcobropago'];
                                 $denomcc = $arrccont[0]['denominacion'];
                                 $idccont = $arrccont[0]['idconceptoscontables'];
                                 //Por cobrar o pagar
                                 if ($obligacion) {
                                     //Si es la afectacion en cobros y pagos es a nivel global ej. Los impuestos y contribuciones
                                     $this->crearObligacionesPresupuestoEstado($identidad, $idelaborarpagos, $arrcomp, $arrop, $idoperacion, $idmoneda,
                                         $idtasa, $obligacion, $idclientecuentacontablecp, $denomcc, $idccont, $remn['idestructuramodelodomina'], $idtipocobrospagos, $fechacontable);
                                 }
                             }

                         }
                     }

            }

        }
        return 'ok';
    }

    //Funcion para liquidar obligaciones fijadas desde otra nomina y que salen en esta por referencias
    public function liquidarObligacionFijadaPorNomina($idestructuramodelodomina, $idestnominaliquidaobligacion,$remn, $ridncp, $arrcomp, $identidad, $idmoneda, $arrop, $fechacontable){
        //Si el concepto contable liquida otro idestructurarmodelos de nomina
        if($idestnominaliquidaobligacion){
           $arrestnominaliquida = ConfigEstructurarModelosNomina::obtenerTodosDatosEstNomina($idestnominaliquidaobligacion)[0];
            $remn = $arrestnominaliquida;
        }
        $objConfEstructuraNomina = new ConfigEstructurarModelosNomina();
        //Si es una referencia
        if($remn['idtipocampo'] == 4){
            $arrIndFormulas = array();$contrf = 0;
            if($remn['idvalormostrar']){
                //Datos de los elementos expresion matematica por sql porque el servicio de los indicadores se marea en linux si la carpeta no tiene los permisos
                $sqlElementosExpMatematicaref = "SELECT idindicador FROM mod_utiles.dat_elementoexpresionmatematica
                                            WHERE idexpresionmatematica = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrayElementosExpMatematicaRef = $conn->fetchAll($sqlElementosExpMatematicaref, array($remn['idvalormostrar']));
                foreach ($arrayElementosExpMatematicaRef as $reemref){
                    if($reemref['idindicador'] != 0){
                        $arrIndFormulas[$remn['idvalormostrar']][$contrf] = $reemref['idindicador'];
                        $contrf ++;
                    }
                }
            }
            //Obteniendo el idestructurarmodelosnomina del campo que fijo la obligacion
            foreach ($arrIndFormulas as $ridfref) {
                foreach ($ridfref as $ridestnominacampoformularef) {
                    $rexplode = explode('_', $ridestnominacampoformularef);
                    $idestructuranominacampoaliquidar = $rexplode[1];
                }
            }
            $nominadatos = DatNominaDatos::obtenerDatosNomina($ridncp)[0]['valores'];
            $datos = unserialize($nominadatos);
            //Recorriendo las personas para obtener los datos de la obligacion fijada desde la otra nomina
            foreach ($datos as $rvalor){
                $importeconcepto = $rvalor["c$idestructuramodelodomina"];
                if($importeconcepto > 0){
                    $rexploded = explode('-', $rvalor['id']);
                    $idpersona = $rexploded[0];
                    //Datos de la obligacion fijada a la persona
                    $sqlPersonaEstructuraNominaCobrosyPagos = "SELECT * FROM mod_nomina.dat_personaestructuranominacobrosypagos
                                            WHERE idpersona = ? and idestructuramodelodomina = ? and estado = 1;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrayPersonaEstructuraNominaCobrosyPagos = $conn->fetchAll($sqlPersonaEstructuraNominaCobrosyPagos, array($idpersona, $idestructuranominacampoaliquidar));
                    //Si la a persona se le fijo una obligacion
                    if(count($arrayPersonaEstructuraNominaCobrosyPagos)>0){
                        //Liquidando la obligacion
                        $arrdata = array(
                            'numero' => $arrayPersonaEstructuraNominaCobrosyPagos[0]['idpersonaestructuranominacobrosypagos'],//numerodocumento,
                            'fecha' => $fechacontable,//$fechaComprobante,
                            'comentario' => 'Liquidando la obligacion desde la nómina',//$arrayAnticipos[0]['comentario'],
                            'importemo' => $importeconcepto,
                            'importemb' => $importeconcepto,
                            'idestructura' => $identidad,//$idEstructura,
                            'idmoneda' => $idmoneda,//idmoneda,
                            'idcuenta' => $arrayPersonaEstructuraNominaCobrosyPagos[0]['idcuenta'],//idcuenta,
                            'idcliente' => $idpersona,//
                            'idperiodo' => $arrcomp[0]['idperiodo'],//$idperiodo,
                            'numcmp' => $arrcomp[0]['numerocomprobante'],//$numComprobante,
                            'iddoc' => $arrop[0]['iddoc']//
                        );
                        //Actualizando las retenciones
                        $this->integrator->copa->ActualizarDerechoObligacion($arrayPersonaEstructuraNominaCobrosyPagos[0]['iddocumentoobligacion'],
                            array('liquidadomb' => abs($importeconcepto), 'pagadomb' => abs($importeconcepto),'liquidaDirecto' => TRUE, 'resumenLiq' => $arrdata));
                        //Cambiandole el estado a liquidado a la obligacion que se guardo en nomina
                        $sqlUpdatePersonaEstructuraNominaCobrosyPagos = "UPDATE mod_nomina.dat_personaestructuranominacobrosypagos
                                               SET estado = 2
                                               WHERE idpersona = ? and idestructuramodelodomina = ?;";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $conn->execute($sqlUpdatePersonaEstructuraNominaCobrosyPagos, array($idpersona, $idestructuranominacampoaliquidar));
                    }

                }
            }
        }
        //Si es un campo agrupado que dentro tiene uno de referencias que fijo una obligacion
        if($remn['idtipocampo'] == 3){
            $tiponominacampo = $remn['idtiponomina'];
            //Recorriendo los indicadores de la formula para validar que no halla mas de un campo que vengo por referencias
            $cantref = 0;$arrayidref = array();
            $arrIndFormulas = array();$contf = 0;
            if($remn['idvalormostrar']){
                //Datos de los elementos expresion matematica por sql porque el servicio de los indicadores se marea en linux si la carpeta no tiene los permisos
                $sqlElementosExpMatematica = "SELECT idindicador FROM mod_utiles.dat_elementoexpresionmatematica
                                            WHERE idexpresionmatematica = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrayElementosExpMatematica = $conn->fetchAll($sqlElementosExpMatematica, array($remn['idvalormostrar']));
                foreach ($arrayElementosExpMatematica as $reem){
                    if($reem['idindicador'] != 0){
                        $arrIndFormulas[$remn['idvalormostrar']][$contf] = $reem['idindicador'];
                        $contf ++;
                    }
                }
            }
            foreach ($arrIndFormulas as $ridf){
                foreach ($ridf as $ridestructnominacampoformula){
                    $tipocampoformulaagrupado = $objConfEstructuraNomina->obtenerIdTipoCampoPorIdEstructuraNomina($ridestructnominacampoformula);
                    //Si es un campo de referencias de nominas
                    if($tipocampoformulaagrupado == 4){
                        $arrayidref[] = $ridestructnominacampoformula;
                        $cantref++;
                    }

                }
            }
            $arrayidref = array_unique($arrayidref);
            //Si hay un campo de referencias de nomina dentro de la formula del agrupado
            if(count($arrayidref)==1){
                $idestructuranominareferenciado = $arrayidref[0];
                $arrayestructuranominareferencia = $objConfEstructuraNomina->obtenerAllDatosEstNominaxIdEstModeloNomina($idestructuranominareferenciado);
                $arrIndFormulasReferencia = array();$contrf = 0;
                if($arrayestructuranominareferencia[0]['idvalormostrar']){
                    //Datos de los elementos expresion matematica por sql porque el servicio de los indicadores se marea en linux si la carpeta no tiene los permisos
                    $sqlElementosExpMatematicaref = "SELECT idindicador FROM mod_utiles.dat_elementoexpresionmatematica
                                            WHERE idexpresionmatematica = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrayElementosExpMatematicaRef = $conn->fetchAll($sqlElementosExpMatematicaref, array($arrayestructuranominareferencia[0]['idvalormostrar']));
                    foreach ($arrayElementosExpMatematicaRef as $reemref){
                        if($reemref['idindicador'] != 0){
                            $arrIndFormulasReferencia[$arrayestructuranominareferencia[0]['idvalormostrar']][$contrf] = $reemref['idindicador'];
                            $contrf ++;
                        }
                    }
                }
                foreach ($arrIndFormulasReferencia as $ridfref) {
                    foreach ($ridfref as $ridestnominacampoformularef) {
                        $rexplode = explode('_', $ridestnominacampoformularef);
                        $idestructuranominacampoaliquidar = $rexplode[1];
                    }
                }
                $nominadatos = DatNominaDatos::obtenerDatosNomina($ridncp)[0]['valores'];
                $datos = unserialize($nominadatos);
                //Recorriendo las personas para obtener los datos de la obligacion fijada desde la otra nomina
                foreach ($datos as $rvalor){
                    $importeconcepto = $rvalor["c$idestructuramodelodomina"];
                    if($importeconcepto > 0){
                        $rexploded = explode('-', $rvalor['id']);
                        $idpersona = $rexploded[0];
                        //Datos de la obligacion fijada a la persona
                        $sqlPersonaEstructuraNominaCobrosyPagos = "SELECT * FROM mod_nomina.dat_personaestructuranominacobrosypagos
                                            WHERE idpersona = ? and idestructuramodelodomina = ? and estado = 1;";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $arrayPersonaEstructuraNominaCobrosyPagos = $conn->fetchAll($sqlPersonaEstructuraNominaCobrosyPagos, array($idpersona, $idestructuranominacampoaliquidar));
                        //Si la a persona se le fijo una obligacion
                        if(count($arrayPersonaEstructuraNominaCobrosyPagos)>0){
                            //Liquidando la obligacion
                            $arrdata = array(
                                'numero' => $arrayPersonaEstructuraNominaCobrosyPagos[0]['idpersonaestructuranominacobrosypagos'],//numerodocumento,
                                'fecha' => $fechacontable,//$fechaComprobante,
                                'comentario' => 'Liquidando la obligacion desde la nómina',//$arrayAnticipos[0]['comentario'],
                                'importemo' => $importeconcepto,
                                'importemb' => $importeconcepto,
                                'idestructura' => $identidad,//$idEstructura,
                                'idmoneda' => $idmoneda,//idmoneda,
                                'idcuenta' => $arrayPersonaEstructuraNominaCobrosyPagos[0]['idcuenta'],//idcuenta,
                                'idcliente' => $idpersona,//
                                'idperiodo' => $arrcomp[0]['idperiodo'],//$idperiodo,
                                'numcmp' => $arrcomp[0]['numerocomprobante'],//$numComprobante,
                                'iddoc' => $arrop[0]['iddoc']//
                            );
                            //Actualizando las retenciones
                            $this->integrator->copa->ActualizarDerechoObligacion($arrayPersonaEstructuraNominaCobrosyPagos[0]['iddocumentoobligacion'],
                                array('liquidadomb' => abs($importeconcepto), 'pagadomb' => abs($importeconcepto),'liquidaDirecto' => TRUE, 'resumenLiq' => $arrdata));
                            //Cambiandole el estado a liquidado a la obligacion que se guardo en nomina
                            $sqlUpdatePersonaEstructuraNominaCobrosyPagos = "UPDATE mod_nomina.dat_personaestructuranominacobrosypagos
                                               SET estado = 2
                                               WHERE idpersona = ? and idestructuramodelodomina = ?;";
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $conn->execute($sqlUpdatePersonaEstructuraNominaCobrosyPagos, array($idpersona, $idestructuranominacampoaliquidar));
                        }

                    }
                }
            }

        }
        return 'ok';
    }

    public function crearObligacionesPersonas($identidad, $idelaborarpagos, $arrcomp, $arrop, $idoperacion, $idmoneda, $idtasa, $cuentacontable, $ridncp, $idestructuramodelodomina, $idtipocobrospagos, $denomcc, $fechacontable){
        $nominadatos = DatNominaDatos::obtenerDatosNomina($ridncp)[0]['valores'];
        $datos = unserialize($nominadatos);
        //Desde aqui se liquida la cuenta por pagar por concepto de reintegro
        foreach ($datos as $rd) {
            $rexplode = explode('-', $rd['id']);
            $idpersona = $rexplode[0];
            $importeconcepto = $rd["c$idestructuramodelodomina"];
                if($importeconcepto > 0){
                $arraypersonas = array();
                $stdPase = new stdClass();
                $stdPase->tipo = $idtipocobrospagos;
                $stdPase->tipopersona = 3;
                $stdPase->iddocumento = $idpersona;//id persona. Para vizualizar en cobros y pagos en el campo documento el nombre de la retencion
                $stdPase->idcomprobante = $arrcomp[0]['idcomprobante'];//Datos del comprobante
                $stdPase->numcomprobante = $arrcomp[0]['numerocomprobante'];//Datos del comprobante
                $stdPase->fechacomprobante = $fechacontable;//Datos del comprobante
                //$this->obtenerCondicionPago($documento['iddocumento'], $datosDocumentos['subsistema'], $stdPase);
                $stdPase->numero = $idpersona;//Id de la persona para identificarla en cobros y pagos
                $stdPase->idsubsistema = $arrcomp[0]['idsubsistema'];//Datos del comprobante
                $stdPase->idperiodo = $arrcomp[0]['idperiodo'];//Datos del comprobante
                $stdPase->fecha = $fechacontable;//Datos del comprobante
                $stdPase->fechaemision = $fechacontable;//Datos del comprobante
                $stdPase->comentario = $denomcc;
                $stdPase->idcliente = $idpersona;//Id persona
                $stdPase->tipodocumento = $arrop[0]['iddoc'];//Id documento q tiene la operacion
                $stdPase->importe = $importeconcepto;
                $stdPase->idcuenta = $cuentacontable;
                $stdPase->idoperacioncontable = $idoperacion;
                $stdPase->operaciones[0]->importemb =  $importeconcepto;
                $stdPase->operaciones[0]->importemo = $importeconcepto;
                $stdPase->operaciones[0]->idmoneda = $idmoneda;
                $stdPase->operaciones[0]->tasa = $idtasa;
                $stdPase->operaciones[0]->idoperacioncontable = $idoperacion;
                // $stdPase->idoperacioncontable = $arrop[0]['idoperacionesentidad'];
                array_push($arraypersonas, $stdPase);//print_r($arraypersonas);
                $idderechuobligacion = $this->integrator->copa->InsertarDerechoObligacionSubsistemaExterno(
                    $arraypersonas, $identidad, $this->global->Subsistema->idsubsistema
                );
                //Insertando la obligacion en dat_personaestructuranominacobrosypagos para luego liquidarla en otro pago que refrencie por nomina este campo
                if($idtipocobrospagos == 1){
                    //Eliminando los datos temporales de las liquidaciones de las cuentas por cobrar a nivel de personas
                    $sqlDeletePersonaEstructuraNominaCobrosyPagos = "DELETE FROM mod_nomina.dat_personaestructuranominacobrosypagos
					WHERE idestructuramodelodomina = ? and idpersona = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $conn->execute($sqlDeletePersonaEstructuraNominaCobrosyPagos, array($idestructuramodelodomina, $idpersona));
                    //Insertando los datos de la obligacion fijadas a las personas
                    $sqlPersonaEstructuraNominaCobrosyPagos = "INSERT INTO mod_nomina.dat_personaestructuranominacobrosypagos(
                    idpersona, idestructuramodelodomina, iddocumentoobligacion, idcuenta, estado, importe)
                    VALUES (?, ?, ?, ?, ?, ?);";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                        $conn->execute($sqlPersonaEstructuraNominaCobrosyPagos, array($idpersona, $idestructuramodelodomina, $idderechuobligacion, $cuentacontable, 1, $importeconcepto));
                }
            }
        }
    }

    public function crearObligacionesPresupuestoEstado($identidad, $idelaborarpagos, $arrcomp, $arrop, $idoperacion, $idmoneda, $idtasa, $obligacion, $idclientecuentacontablecp, $denomcc, $idccont, $idestructuramodelodomina, $idtipocobrospagos, $fechacontable){
        $objMonto = new DatConceptosMontoElaborarPago();
        //Monto concepto
        $montoconcepto = $objMonto->obtenerMontoXElaborarPagoEstNomina($idelaborarpagos, $idestructuramodelodomina);
        $arrobligacionespresupuesto['idestructuramodelodomina'] = $idestructuramodelodomina;
        $arrobligacionespresupuesto['idclienteproveedor'] = $obligacion;
        $arrobligacionespresupuesto['idcuenta'] = $idclientecuentacontablecp;
        $arrobligacionespresupuesto['idconceptorm'] = $idccont;
        $arrobligacionespresupuesto['denominacion'] = $this->integrator->contabilidad->obtenerCuentaPorId($idclientecuentacontablecp)->text;
        $arrobligacionespresupuesto['monto'] = $montoconcepto;
        //Creando el pago fiscal(cuenta por pagar) de la entidad con el presupuesto del estado
        if($montoconcepto > 0){
            $arraypersonas = array();
            $stdPase = new stdClass();
            //Cuenta por pagar o cobrar(obligacion fiscal)
            $stdPase->tipo = $idtipocobrospagos;
            $stdPase->tipopersona = 2;//Derecho fiscal
            $stdPase->iddocumento = $arrobligacionespresupuesto['idconceptorm'];//id tipo de retencion. Para vizualizar en cobros y pagos en el campo documento el nombre de la retencion
            $stdPase->idcomprobante = $arrcomp[0]['idcomprobante'];//Datos del comprobante
            $stdPase->numcomprobante = $arrcomp[0]['numerocomprobante'];//Datos del comprobante
            $stdPase->fechacomprobante = $fechacontable;//Datos del comprobante
            //$this->obtenerCondicionPago($documento['iddocumento'], $datosDocumentos['subsistema'], $stdPase);
            $stdPase->numero = $arrobligacionespresupuesto['idconceptorm'];//Id de la retencion de la persona para identificarla en cobros y pagos
            $stdPase->idsubsistema = $arrcomp[0]['idsubsistema'];//Datos del comprobante
            $stdPase->idperiodo = $arrcomp[0]['idperiodo'];//Datos del comprobante
            $stdPase->fecha = $fechacontable;//Datos del comprobante
            $stdPase->fechaemision = $fechacontable;//Datos del comprobante
            $stdPase->comentario = $arrobligacionespresupuesto['denominacion'];
            $stdPase->idcliente = $arrobligacionespresupuesto['idclienteproveedor'];//Id persona
            $stdPase->tipodocumento = $arrop[0]['iddoc'];//Id documento q tiene la operacion
            $stdPase->importe = $montoconcepto;
            $stdPase->idcuenta = $arrobligacionespresupuesto['idcuenta'];
            $stdPase->idoperacioncontable = $idoperacion;
            $stdPase->operaciones[0]->importemb = $montoconcepto;
            $stdPase->operaciones[0]->importemo = $montoconcepto;
            $stdPase->operaciones[0]->idmoneda = $idmoneda;
            $stdPase->operaciones[0]->tasa = $idtasa;
            $stdPase->operaciones[0]->idoperacioncontable = $idoperacion;
            // $stdPase->idoperacioncontable = $arrop[0]['idoperacionesentidad'];
            array_push($arraypersonas, $stdPase);

            //Creando las cuentas por pagar de la entidad con el banco con las obligaciones con el presupuesto del estado
            if (count($arraypersonas)) {
                /*print_r($this->integrator->copa->InsertarDerechoObligacionSubsistemaExterno(
                    $arraypersonas, $identidad, $this->global->Subsistema->idsubsistema
                ).'-');*/
                return $this->integrator->copa->InsertarDerechoObligacionSubsistemaExterno(
                    $arraypersonas, $identidad, $this->global->Subsistema->idsubsistema
                );
            }
        }

    }
}