<?php

/**
 * Modelo de negocio para estructurar los modelos de nominas.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad modelo de nómina (Clase del bussines).
 * @copyright XETID
 * @version 1.0
 */
class ConfigEstructurarModelosNominaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function ConfigEstructurarModelosNominaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los modelos de nominas.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    public function obtenerListadoModelosNomina($inicio = 0, $limite = 10)
    {
        //Retornando el listado de tipos de nómina.
        return ConfigEstructurarModelosNomina::obtenerListadoModelosNomina($inicio, $limite);
    }


    /**
     * Obtener la cantidad total de tipos de nómina.
     *
     * @return int Cantidad total de tipos de nómina.
     */
    public function obtenerCantidadTotalModelosNomina($idtiponomina, $identidad)
    {

        //Retornando la cantidad total de tipos de nómina.
        return ConfigEstructurarModelosNomina::obtenerCantidadTotalModelosNomina($idtiponomina, $identidad);
    }


    public function obtenerModeloNominaxIdTipoNomina($idtiponomina, $idestructura, $criterio, $start = 0,$limit = 10000)
    {

        return ConfigEstructurarModelosNomina::obtenerModeloNominaxIdTipoNomina($idtiponomina, $idestructura, $criterio, $start,$limit);
    }

    public function modificarOrdenModelosNomina($idestructuramodelodomina, $orden)
    {
        try {
            //Obteniendo el modelo de nómina a modificar.
            $objModeloNomina = ConfigEstructurarModelosNomina::obtenerObjModelosNominaDadoId($idestructuramodelodomina);

            //Modificando los datos del modelo de nómina.
            $objModeloNomina->orden = $orden;

            //Guardando los datos.
            $objModeloNomina->save();
            return 1;
        } catch (Exception $e) {
            return 0;
        };


    }

    /**
     * Insertar un modelo de nómina.
     *
     * @param string $denom Denominacion del modelo de nómina.
     * @param string $finicio Fecha de inicio de creacion del modelo de nómina.
     * @param string $ffin Fecha de fin de uso del modelo de nómina.
     * @param string $descrip Descripcion del modelo de nómina.
     */
    public function adicionarModelosNomina($idtiponomina, $denominacion, $idtipocampo, $idvalormostrar, $orden, $ordenreporte, $visible, $descuento, $SC_4_01, $SC_4_06, $aceptavaloresnegativos, $esconceptopagosalario, $textoformula, $acumulaliquida, $identidad, $escampopersona, $diasimportevac, $correo, $talonario, $periodo, $comportamientocorreo, $descripcion, $tiporeferencia, $idmessnc)
    {
        $nominaacumulaliquida = NomTipoNomina::acumulaLiquidaVacaciones($idtiponomina);
        if ($nominaacumulaliquida != 3) {
            $existe = ConfigEstructurarModelosNomina::existeCampoAcumulaLiquidaNominaAdd($idtiponomina, $identidad, $acumulaliquida);
            if ($existe == 0) {
                //Se crea el objeto del modelo de nómina.
                $objModeloNomina = new ConfigEstructurarModelosNomina();
                //Insertando los datos del modelo de nómina.
                $objModeloNomina->idtiponomina = $idtiponomina;
                $objModeloNomina->denominacion = $denominacion;
                $objModeloNomina->descripcion = $descripcion;
                $objModeloNomina->idtipocampo = $idtipocampo;
                $objModeloNomina->idvalormostrar = $idvalormostrar;
                $objModeloNomina->orden = $orden;
                $objModeloNomina->ordenreporte = $ordenreporte;
                $objModeloNomina->visible = $visible;
                $objModeloNomina->descuento = $descuento;
                $objModeloNomina->sc_4_01 = $SC_4_01;
                $objModeloNomina->sc_4_06 = $SC_4_06;
                $objModeloNomina->valoresnegativos = $aceptavaloresnegativos;
                $objModeloNomina->esconceptopagosalario = $esconceptopagosalario;
                $objModeloNomina->textoformula = $textoformula;
                $objModeloNomina->acumulaliquida = $acumulaliquida;
                $objModeloNomina->escampopersona = $escampopersona;
                $objModeloNomina->vacacionesdiasimporte = $diasimportevac;
                $objModeloNomina->correo = $correo;
                $objModeloNomina->talonario = $talonario;
                $objModeloNomina->periodobusquedareferencianomina = (is_numeric($periodo)) ? $periodo : null;
                $objModeloNomina->comportamientocorreo = $comportamientocorreo ? $comportamientocorreo : 0;
                $objModeloNomina->tiporeferencia = (is_numeric($tiporeferencia))?$tiporeferencia:null;
                $objModeloNomina->idmessnc = (is_numeric($idmessnc))?$idmessnc:null;

                //Guardando los datos.
                $objModeloNomina->save();
                $idestructuramodelodomina = $objModeloNomina->idestructuramodelodomina;
                $objEstModelNominaEntidad = new ConfigEstructuraModeloNominaEntidad();
                $objEstModelNominaEntidad->idestructuramodelodomina = $idestructuramodelodomina;
                $objEstModelNominaEntidad->idestructura = $identidad;
                $objEstModelNominaEntidad->save();

                return $objModeloNomina;
            } else {
                return 'existe';
            }
        } else {
            //Se crea el objeto del modelo de nómina.
            $objModeloNomina = new ConfigEstructurarModelosNomina();
            //Insertando los datos del modelo de nómina.
            $objModeloNomina->idtiponomina = $idtiponomina;
            $objModeloNomina->denominacion = $denominacion;
            $objModeloNomina->descripcion = $descripcion;
            $objModeloNomina->idtipocampo = $idtipocampo;
            $objModeloNomina->idvalormostrar = $idvalormostrar;
            $objModeloNomina->orden = $orden;
            $objModeloNomina->ordenreporte = $ordenreporte;
            $objModeloNomina->visible = $visible;
            $objModeloNomina->descuento = $descuento;
            $objModeloNomina->sc_4_01 = $SC_4_01;
            $objModeloNomina->sc_4_06 = $SC_4_06;
            $objModeloNomina->valoresnegativos = $aceptavaloresnegativos;
            $objModeloNomina->esconceptopagosalario = $esconceptopagosalario;
            $objModeloNomina->textoformula = $textoformula;
            $objModeloNomina->acumulaliquida = 0;
            $objModeloNomina->escampopersona = $escampopersona;
            $objModeloNomina->vacacionesdiasimporte = $diasimportevac;
            $objModeloNomina->correo = $correo;
            $objModeloNomina->talonario = $talonario;
            $objModeloNomina->periodobusquedareferencianomina = (is_numeric($periodo)) ? $periodo : null;
            $objModeloNomina->comportamientocorreo = $comportamientocorreo ? $comportamientocorreo : 0;
            $objModeloNomina->tiporeferencia = (is_numeric($tiporeferencia))?$tiporeferencia:null;
            $objModeloNomina->idmessnc = (is_numeric($idmessnc))?$idmessnc:null;

            //Guardando los datos.
            $objModeloNomina->save();
            $idestructuramodelodomina = $objModeloNomina->idestructuramodelodomina;
            $objEstModelNominaEntidad = new ConfigEstructuraModeloNominaEntidad();
            $objEstModelNominaEntidad->idestructuramodelodomina = $idestructuramodelodomina;
            $objEstModelNominaEntidad->idestructura = $identidad;
            $objEstModelNominaEntidad->save();


            return $objModeloNomina;
        }


    }

    /**
     * Modificar un modelo de nómina.
     *
     * @param int $idtiponomina Identificador del modelo de nómina.
     * @param string $denom Denominacion del modelo de nómina.
     * @param string $finicio Fecha de inicio de creacion del modelo de nómina.
     * @param string $ffin Fecha de fin de uso del modelo de nómina.
     * @param string $descrip Descripcion del modelo de nómina.
     */

    public function modificarModelosNomina($idestructuramodelodomina, $idtiponomina, $denominacion, $idtipocampo, $idvalormostrar, $orden, $ordenreporte, $visible, $descuento, $SC_4_01, $SC_4_06, $aceptavaloresnegativos, $esconceptopagosalario, $textoformula, $acumulaliquida, $identidad, $escampopersona, $diasimportevac, $correo, $talonario, $periodo, $comportamientocorreo, $descripcion, $tiporeferencia, $idmessnc)
    {
        if (!$aceptavaloresnegativos) {
            $aceptavaloresnegativos = 0;
        }
        if (!$acumulaliquida) {
            $acumulaliquida = 0;
        }
        $nominaacumulaliquida = NomTipoNomina::obtenerAcumulaLiquida($idtiponomina);
        if ($nominaacumulaliquida != 3) {
            $existe = ConfigEstructurarModelosNomina::existeCampoAcumulaLiquidaNomina($idestructuramodelodomina, $idtiponomina, $identidad, $acumulaliquida);

            if ($existe == 0) {
                //Obteniendo el modelo de nómina a modificar.
                $objModeloNomina = ConfigEstructurarModelosNomina::obtenerObjModelosNominaDadoId($idestructuramodelodomina);

                //Modificando los datos del modelo de nómina.
                $objModeloNomina->idtiponomina = $idtiponomina;
                $objModeloNomina->denominacion = $denominacion;
                $objModeloNomina->descripcion = $descripcion;
                $objModeloNomina->idtipocampo = $idtipocampo;
                $objModeloNomina->orden = $orden;
                $objModeloNomina->ordenreporte = $ordenreporte;
                $objModeloNomina->visible = $visible;
                $objModeloNomina->descuento = $descuento;
                $objModeloNomina->sc_4_01 = $SC_4_01;
                $objModeloNomina->sc_4_06 = $SC_4_06;
                $objModeloNomina->valoresnegativos = $aceptavaloresnegativos;
                $objModeloNomina->esconceptopagosalario = $esconceptopagosalario;
                if ($idtipocampo == 3 || $idtipocampo == 4) {
                    if ($textoformula) {
                        $objModeloNomina->textoformula = $textoformula;
                    }
                } else if ($idtipocampo == 1) {
                    $objModeloNomina->idvalormostrar = $idvalormostrar;
                }
                $objModeloNomina->acumulaliquida = $acumulaliquida;
                $objModeloNomina->escampopersona = $escampopersona;
                $objModeloNomina->vacacionesdiasimporte = $diasimportevac;
                $objModeloNomina->correo = $correo;
                $objModeloNomina->talonario = $talonario;
                $objModeloNomina->periodobusquedareferencianomina = (is_numeric($periodo)) ? $periodo : null;
                $objModeloNomina->comportamientocorreo = $comportamientocorreo ? $comportamientocorreo : 0;
                $objModeloNomina->tiporeferencia = (is_numeric($tiporeferencia))?$tiporeferencia:null;
                $objModeloNomina->idmessnc = (is_numeric($idmessnc))?$idmessnc:null;//print_r($objModeloNomina);die;
                //Guardando los datos.
                $objModeloNomina->save();
                return $objModeloNomina->idestructuramodelodomina;
            } else {
                return 'existe';
            }
        } else {
            //Obteniendo el modelo de nómina a modificar.
            $objModeloNomina = ConfigEstructurarModelosNomina::obtenerObjModelosNominaDadoId($idestructuramodelodomina);

            //Modificando los datos del modelo de nómina.
            $objModeloNomina->idtiponomina = $idtiponomina;
            $objModeloNomina->denominacion = $denominacion;
            $objModeloNomina->descripcion = $descripcion;
            $objModeloNomina->idtipocampo = $idtipocampo;
            $objModeloNomina->orden = $orden;
            $objModeloNomina->ordenreporte = $ordenreporte;
            $objModeloNomina->visible = $visible;
            $objModeloNomina->descuento = $descuento;
            $objModeloNomina->sc_4_01 = $SC_4_01;
            $objModeloNomina->sc_4_06 = $SC_4_06;
            $objModeloNomina->valoresnegativos = $aceptavaloresnegativos;
            $objModeloNomina->esconceptopagosalario = $esconceptopagosalario;
            if ($idtipocampo == 3 || $idtipocampo == 4) {
                if ($textoformula) {
                    $objModeloNomina->textoformula = $textoformula;
                }
            } else if ($idtipocampo == 1) {
                $objModeloNomina->idvalormostrar = $idvalormostrar;
            }
            $objModeloNomina->acumulaliquida = 0;
            $objModeloNomina->escampopersona = $escampopersona;
            $objModeloNomina->vacacionesdiasimporte = $diasimportevac;
            $objModeloNomina->correo = $correo;
            $objModeloNomina->talonario = $talonario;
            $objModeloNomina->periodobusquedareferencianomina = (is_numeric($periodo)) ? $periodo : null;
            $objModeloNomina->comportamientocorreo = $comportamientocorreo ? $comportamientocorreo : 0;
            $objModeloNomina->tiporeferencia = (is_numeric($tiporeferencia))?$tiporeferencia:null;
            $objModeloNomina->idmessnc = (is_numeric($idmessnc))?$idmessnc:null;//print_r($objModeloNomina);die;
            //Guardando los datos.
            $objModeloNomina->save();
            return $objModeloNomina;
        }
    }

    /**
     * Eliminar un modelo de nómina.
     *
     * @param int $idtiponomina Identificador del modelo de nómina.
     */
    public function eliminarEstNomina($idestructuramodelodomina, $arridentidad)
    {
        //Eliminando las estructura modelo nomina entidades.
        if(count($arridentidad)>0){
            foreach ($arridentidad as $identidad){
                if(count($idestructuramodelodomina)>0){
                    foreach ($idestructuramodelodomina as $ki => $vi) {
                        // print_r($vi['idestructuramodelodomina']);die;
                        $objModeloNominaE = ConfigEstructuraModeloNominaEntidad::obtenerObjModelosNominaDadoIdEntidad($vi['idestructuramodelodomina'], $identidad);

                        //Obteniendo array de estructura modelo nomina entidades en todas las estructuras
                        $objModeloNomina = ConfigEstructuraModeloNominaEntidad::obtenerObjModelosNominaDadoId($vi['idestructuramodelodomina']);
                        //print_r($objModeloNomina);die;
                        if (count($objModeloNomina) == count($objModeloNominaE)) {

                            //Borrando estructura modelo nomina entidades.
                            foreach ($objModeloNomina as $k => $v) {
                                $objDeleteE = ConfigEstructuraModeloNominaEntidad::obtenerObjConfigEstruraModelosNominaDadoId($v['idestructuramodelosnominaentidad']);
                                $objDeleteE->delete();
                                $objDelete = ConfigEstructurarModelosNomina::obtenerObjModelosNominaDadoId($v['idestructuramodelodomina']);
                                $objDelete->delete();
                            }
                        } else {

                            //Borrando estructura modelo nomina entidades.
                            foreach ($objModeloNominaE as $k => $v) {
                                // print_r($v['idestructuramodelosnominaentidad']);die;
                                $objDeleteE = ConfigEstructuraModeloNominaEntidad::obtenerObjConfigEstruraModelosNominaDadoId($v['idestructuramodelosnominaentidad']);
                                $objDeleteE->delete();
                            }
                        }
                    }
                }

            }
        }
    }

    public function devolverObjeto()
    {
        $objModelDatosModeloConceptos = new Doctrine_Collection('DatDatosModeloNominaConceptos');
        return $objModelDatosModeloConceptos;
    }


    public function loadDataComprobante($idEstructura, $arrayIdDuo, $tipoDuo, $tipoContabilizacion, $idOpSelec)
    {
        try {
            $idSubsistema = 6;
            $objeto = $this->integrator->parametros->ObtenerObjetoPorSubsistTipo($idSubsistema, $tipoDuo);
            $idObjeto = $objeto['idobjeto'];

            $arrayDataObservacion = array();
            $arrayDataDetalle = array();
            $cont = 0;
            $dataComprobante = array();

            foreach ($arrayIdDuo as $idDuo) {
                $idOpContable = '';
//                $idOperacion = '';
                $dataDuo = Doctrine::getTable('DatDerechouobligacion')->find($idDuo);
                //Construir observacion del comprobante
                $arrayDataObservacion[$dataDuo->idtipodocumento][] = $dataDuo->numero;

                $importeMo = $dataDuo->importemb;
                $importeMb = $dataDuo->importemb;
                $dataComprobante[$cont] = $this->confeccionarAnotacionComprobante($tipoContabilizacion, $idEstructura, $dataDuo, $importeMo, $importeMb, '', '', '');
                $cont++;
                if ($idOpSelec) {
                    $idOpContable = $idOpSelec;
                    $dataComprobante[$cont] = $this->confeccionarAnotacionComprobante($tipoContabilizacion, $idEstructura, $dataDuo, $importeMo, $importeMb, $idOpContable, '', $idOpSelec);
                    $cont++;

                    $arrayContAdicional = $this->integrator->parametros->ObtContabAdicional($idOpContable);
                    if ($arrayContAdicional > 0) {
                        foreach ($arrayContAdicional as $contAdicional) {
                            $dataComprobante[$cont] = $this->confeccionarAnotacionComprobante($tipoContabilizacion, $idEstructura, $dataDuo, $importeMo, $importeMb, $idOpContable, $contAdicional, $idOpSelec);
                            $cont++;
                        }
                    }
                } else {
                    $operacionesDuo = DatOperacioncp::OperacionesPorDerechoObligacionId($idDuo);
                    if (count($operacionesDuo)) {
                        foreach ($operacionesDuo as $op) {
                            //obtener la cuenta de la operacion contable
                            $idOpContable = $op['idoperacioncontable'];
                            $idOperacion = $op['idoperacion'];
                            $importeMo = $op['importemo'];
                            $importeMb = $op['importemb'];

                            //Construir detalle del comprobante
                            if (!array_key_exists($idOpContable, $arrayDataDetalle)) {
                                $oper = $this->integrator->parametros->OperacionesPorId($idOpContable);
                                $arrayDataDetalle[$idOpContable] = $oper->denominacion;
                            }

                            $dataComprobante[$cont] = $this->confeccionarAnotacionComprobante($tipoContabilizacion, $idEstructura, $dataDuo, $importeMo, $importeMb, $idOpContable, '', '');

                            $anexo = array();
                            if ($op['anexo'] == 1) {
                                $anexos = DatRegistroAnexoop::AnexosPorOperacion($op['idoperacion']);
                                if (count($anexos)) {
                                    foreach ($anexos as $i => $anex) {
                                        $anexo[$i]['idanexo'] = $anex['idoperacion'];
                                        $anexo[$i]['idoperacion'] = $anex['idoperacion'];
                                        $anexo[$i]['idregistroanexoop'] = $anex['idregistroanexoop'];
                                        $anexo[$i]['idcentronivel'] = $anex['idcentrocostocomun'];
                                        $anexo[$i]['idelementouobjeto'] = $anex['idelementogastocomun'];
                                        $centrocostoporid = $this->pIntegrator->contabilidad_costos->ObtenerCentroNivelPorId($anex['idcentrocostocomun']);
                                        $objetogastoporid = $this->pIntegrator->contabilidad_costos->ObtenerElementoObjetoPorId($anex['idelementogastocomun']);
                                        $anexo[$i]['centronivel'] = $centrocostoporid['concat'] . " " . $centrocostoporid['descripcioncentrogrupo'];
                                        $anexo[$i]['elementouobjeto'] = $objetogastoporid['concat'] . " " . $objetogastoporid['descripcionelementoobjeto'];
                                        $anexo[$i]['importe'] = abs($anex['importemb']);
//                                        $anexo[$i]['importemb'] = abs($anex['importemb']);
                                        $anexo[$i]['importemo'] = abs($anex['importemo']);
                                    }
                                }
                            }
                            $dataComprobante[$cont]['anexo'] = $anexo;
                            $cont++;

                            $arrayContAdicional = $this->integrator->parametros->ObtContabAdicional($idOpContable);
                            if ($arrayContAdicional > 0) {
                                foreach ($arrayContAdicional as $contAdicional) {
                                    $dataComprobante[$cont] = $this->confeccionarAnotacionComprobante($tipoContabilizacion, $idEstructura, $dataDuo, $importeMo, $importeMb, $idOpContable, $contAdicional, '');
                                    $cont++;
                                }
                            }
                        }
                    }
                }
            }

            foreach ($arrayDataObservacion as $key => $observ) {
                $tipoDoc = $this->integrator->parametros->TipoDocumentoById($key);
                $tipoDocDuo[] = trim($tipoDoc->denominacion) . ' (' . implode(', ', $observ) . ')';
            }
            $observacion = implode('; ', $tipoDocDuo);
            $detalle = implode('; ', $arrayDataDetalle);

            return array('idObjeto' => $idObjeto, 'dataComprobante' => $dataComprobante, 'detalle' => $detalle, 'observacion' => $observacion);
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    public function replicarEstructurarNominaEntidades($id, $idEstructura)
    {

        $obj = new ConfigEstructuraModeloNominaEntidad();
        $replicado = $obj->obtenerObjModelosNominaDadoIdEntidad($id, $idEstructura);

        if (count($replicado) == 0) {
            $obj->idestructuramodelodomina = $id;
            $obj->idestructura = $idEstructura;

            $obj->save();
        }
        return true;
    }

    public function replicarEstructurarNominaOtrasNominas($idConceptos, $identidad, $arrTiposPagosReplicar)
    {
        $objEstructuraNomina = new ConfigEstructurarModelosNomina();
        $objDatosModeloNominaConceptos = new DatDatosModeloNominaConceptos();
        $objConfConceptospdFormasySistemasPagoModel = new ConfConceptospdFormasySistemasPagoModel();
        foreach ($arrTiposPagosReplicar as $idtipopago) {
            $rtiponomina = $objEstructuraNomina->obtenerIdTipoNominaxIdTipoPago($idtipopago);
            $idtiponomina = $rtiponomina[0]['idtiponomina'];
            foreach ($idConceptos as $idConcepto) {
                $restructuranomina = $objEstructuraNomina->obtenerAllDatosEstNominaxIdEstModeloNomina($idConcepto);
                $idestructuramodelodomina = $restructuranomina[0]['idestructuramodelodomina'];
                //Si la estructura de nomina es un campo de persona: tipo 1
                if ($restructuranomina[0]['idtipocampo'] == 1) {
                    $objEstructuraNominaSave = new ConfigEstructurarModelosNomina();
                    $objEstructuraNominaSave->idtiponomina = $idtiponomina;
                    $objEstructuraNominaSave->denominacion = $restructuranomina[0]['denominacion'];
                    $objEstructuraNominaSave->idtipocampo = $restructuranomina[0]['idtipocampo'];
                    $objEstructuraNominaSave->idvalormostrar = $restructuranomina[0]['idvalormostrar'];
                    $objEstructuraNominaSave->orden = $restructuranomina[0]['orden'];
                    $objEstructuraNominaSave->ordenreporte = $restructuranomina[0]['ordenreporte'];
                    $objEstructuraNominaSave->visible = $restructuranomina[0]['visible'];
                    $objEstructuraNominaSave->descuento = $restructuranomina[0]['descuento'];
                    $objEstructuraNominaSave->controldatosnomina = $restructuranomina[0]['controldatosnomina'];
                    $objEstructuraNominaSave->valoresnegativos = $restructuranomina[0]['valoresnegativos'];
                    $objEstructuraNominaSave->textoformula = $restructuranomina[0]['textoformula'];
                    $objEstructuraNominaSave->pagoresultados = $restructuranomina[0]['pagoresultados'];
                    $objEstructuraNominaSave->acumulavacaciones = $restructuranomina[0]['acumulavacaciones'];
                    $objEstructuraNominaSave->estotal = $restructuranomina[0]['estotal'];
                    $objEstructuraNominaSave->acumulaliquida = $restructuranomina[0]['acumulaliquida'];
                    $objEstructuraNominaSave->esconceptopagosalario = $restructuranomina[0]['esconceptopagosalario'];
                    $objEstructuraNominaSave->escampopersona = $restructuranomina[0]['escampopersona'];
                    $objEstructuraNominaSave->sc_4_06 = $restructuranomina[0]['sc_4_06'];
                    $objEstructuraNominaSave->sc_4_01 = $restructuranomina[0]['sc_4_01'];
                    $objEstructuraNominaSave->vacacionesdiasimporte = $restructuranomina[0]['vacacionesdiasimporte'];
                    $objEstructuraNominaSave->correo = $restructuranomina[0]['correo'];
                    $objEstructuraNominaSave->talonario = $restructuranomina[0]['talonario'];
                    $objEstructuraNominaSave->periodobusquedareferencianomina = $restructuranomina[0]['periodobusquedareferencianomina'];
                    $objEstructuraNominaSave->comportamientocorreo = $restructuranomina[0]['comportamientocorreo'];
                    $objEstructuraNominaSave->descripcion = $restructuranomina[0]['descripcion'];
                    $objEstructuraNominaSave->save();
                    $idestructurarmodelonominasave = $objEstructuraNominaSave->idestructuramodelodomina;
                    //
                    $objConfigEstructurarModelosNominaEntidad = new ConfigEstructurarModelosNominaEntidad();
                    $objConfigEstructurarModelosNominaEntidad->idestructuramodelodomina = $idestructurarmodelonominasave;
                    $objConfigEstructurarModelosNominaEntidad->idestructura = $identidad;
                    $objConfigEstructurarModelosNominaEntidad->save();
                    //Si la estructura de nomina es un campo de pago: tipo 2
                } else if ($restructuranomina[0]['idtipocampo'] == 2) {
                    $rdatosmodelonominaconceptos = $objDatosModeloNominaConceptos->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($idestructuramodelodomina);
                    $objEstructuraNominaSave = new ConfigEstructurarModelosNomina();
                    $objEstructuraNominaSave->idtiponomina = $idtiponomina;
                    $objEstructuraNominaSave->denominacion = $restructuranomina[0]['denominacion'];
                    $objEstructuraNominaSave->idtipocampo = $restructuranomina[0]['idtipocampo'];
                    $objEstructuraNominaSave->idvalormostrar = $restructuranomina[0]['idvalormostrar'];
                    $objEstructuraNominaSave->orden = $restructuranomina[0]['orden'];
                    $objEstructuraNominaSave->ordenreporte = $restructuranomina[0]['ordenreporte'];
                    $objEstructuraNominaSave->visible = $restructuranomina[0]['visible'];
                    $objEstructuraNominaSave->descuento = $restructuranomina[0]['descuento'];
                    $objEstructuraNominaSave->controldatosnomina = $restructuranomina[0]['controldatosnomina'];
                    $objEstructuraNominaSave->valoresnegativos = $restructuranomina[0]['valoresnegativos'];
                    $objEstructuraNominaSave->textoformula = $restructuranomina[0]['textoformula'];
                    $objEstructuraNominaSave->pagoresultados = $restructuranomina[0]['pagoresultados'];
                    $objEstructuraNominaSave->acumulavacaciones = $restructuranomina[0]['acumulavacaciones'];
                    $objEstructuraNominaSave->estotal = $restructuranomina[0]['estotal'];
                    $objEstructuraNominaSave->acumulaliquida = $restructuranomina[0]['acumulaliquida'];
                    $objEstructuraNominaSave->esconceptopagosalario = $restructuranomina[0]['esconceptopagosalario'];
                    $objEstructuraNominaSave->escampopersona = $restructuranomina[0]['escampopersona'];
                    $objEstructuraNominaSave->sc_4_06 = $restructuranomina[0]['sc_4_06'];
                    $objEstructuraNominaSave->sc_4_01 = $restructuranomina[0]['sc_4_01'];
                    $objEstructuraNominaSave->vacacionesdiasimporte = $restructuranomina[0]['vacacionesdiasimporte'];
                    $objEstructuraNominaSave->correo = $restructuranomina[0]['correo'];
                    $objEstructuraNominaSave->talonario = $restructuranomina[0]['talonario'];
                    $objEstructuraNominaSave->periodobusquedareferencianomina = $restructuranomina[0]['periodobusquedareferencianomina'];
                    $objEstructuraNominaSave->comportamientocorreo = $restructuranomina[0]['comportamientocorreo'];
                    $objEstructuraNominaSave->descripcion = $restructuranomina[0]['descripcion'];
                    $objEstructuraNominaSave->save();
                    $idestructurarmodelonominasave = $objEstructuraNominaSave->idestructuramodelodomina;
                    //En la entidad
                    $objConfigEstructurarModelosNominaEntidad = new ConfigEstructurarModelosNominaEntidad();
                    $objConfigEstructurarModelosNominaEntidad->idestructuramodelodomina = $idestructurarmodelonominasave;
                    $objConfigEstructurarModelosNominaEntidad->idestructura = $identidad;
                    $objConfigEstructurarModelosNominaEntidad->save();
                    //
                    $objDatosModeloNominaConceptosSave = new DatDatosModeloNominaConceptos();
                    $objDatosModeloNominaConceptosSave->idestructuramodelosnomina = $idestructurarmodelonominasave;
                    $objDatosModeloNominaConceptosSave->idconcepto = $rdatosmodelonominaconceptos[0]['idconcepto'];
                    $objDatosModeloNominaConceptosSave->tipo = $rdatosmodelonominaconceptos[0]['tipo'];
                    $objDatosModeloNominaConceptosSave->save();

                    //Si la estructura de nomina es un campo de formula: tipo 3 y 4
                } else if ($restructuranomina[0]['idtipocampo'] == 3 || $restructuranomina[0]['idtipocampo'] == 4) {
                    //Duplicando la expresion matematica para salvar un id nuevo y guardando en el servidor el fichero
                    $idexpresionmatematica = $restructuranomina[0]['idvalormostrar'];
                    $nuevoidformula = $objConfConceptospdFormasySistemasPagoModel->crearFormulaNueva($idexpresionmatematica);
                    $dirleer = $_SERVER['DOCUMENT_ROOT'] . '/pvd/comun/indicadoresexpresonmatematica/' . $idexpresionmatematica . '.iem';
                    $datosserializados = file_get_contents($dirleer);
                    $dirguardar = $_SERVER['DOCUMENT_ROOT'] . '/pvd/comun/indicadoresexpresonmatematica/' . $nuevoidformula . '.iem';
                    file_put_contents($dirguardar, $datosserializados);
                    //Salvando la estructura de nomina
                    $objEstructuraNominaSave = new ConfigEstructurarModelosNomina();
                    $objEstructuraNominaSave->idtiponomina = $idtiponomina;
                    $objEstructuraNominaSave->denominacion = $restructuranomina[0]['denominacion'];
                    $objEstructuraNominaSave->idtipocampo = $restructuranomina[0]['idtipocampo'];
                    $objEstructuraNominaSave->idvalormostrar = $nuevoidformula;
                    $objEstructuraNominaSave->orden = $restructuranomina[0]['orden'];
                    $objEstructuraNominaSave->ordenreporte = $restructuranomina[0]['ordenreporte'];
                    $objEstructuraNominaSave->visible = $restructuranomina[0]['visible'];
                    $objEstructuraNominaSave->descuento = $restructuranomina[0]['descuento'];
                    $objEstructuraNominaSave->controldatosnomina = $restructuranomina[0]['controldatosnomina'];
                    $objEstructuraNominaSave->valoresnegativos = $restructuranomina[0]['valoresnegativos'];
                    $objEstructuraNominaSave->textoformula = $restructuranomina[0]['textoformula'];
                    $objEstructuraNominaSave->pagoresultados = $restructuranomina[0]['pagoresultados'];
                    $objEstructuraNominaSave->acumulavacaciones = $restructuranomina[0]['acumulavacaciones'];
                    $objEstructuraNominaSave->estotal = $restructuranomina[0]['estotal'];
                    $objEstructuraNominaSave->acumulaliquida = $restructuranomina[0]['acumulaliquida'];
                    $objEstructuraNominaSave->esconceptopagosalario = $restructuranomina[0]['esconceptopagosalario'];
                    $objEstructuraNominaSave->escampopersona = $restructuranomina[0]['escampopersona'];
                    $objEstructuraNominaSave->sc_4_06 = $restructuranomina[0]['sc_4_06'];
                    $objEstructuraNominaSave->sc_4_01 = $restructuranomina[0]['sc_4_01'];
                    $objEstructuraNominaSave->vacacionesdiasimporte = $restructuranomina[0]['vacacionesdiasimporte'];
                    $objEstructuraNominaSave->correo = $restructuranomina[0]['correo'];
                    $objEstructuraNominaSave->talonario = $restructuranomina[0]['talonario'];
                    $objEstructuraNominaSave->periodobusquedareferencianomina = $restructuranomina[0]['periodobusquedareferencianomina'];
                    $objEstructuraNominaSave->comportamientocorreo = $restructuranomina[0]['comportamientocorreo'];
                    $objEstructuraNominaSave->descripcion = $restructuranomina[0]['descripcion'];
                    $objEstructuraNominaSave->save();
                    $idestructurarmodelonominasave = $objEstructuraNominaSave->idestructuramodelodomina;
                    //En la entidad
                    $objConfigEstructurarModelosNominaEntidad = new ConfigEstructurarModelosNominaEntidad();
                    $objConfigEstructurarModelosNominaEntidad->idestructuramodelodomina = $idestructurarmodelonominasave;
                    $objConfigEstructurarModelosNominaEntidad->idestructura = $identidad;
                    $objConfigEstructurarModelosNominaEntidad->save();
                }

            }
        }
        return 'ok';
    }

    public function obtenerOrdenDisponible($identidad, $idtiponomina)
    {
        $obj = new ConfigEstructurarModelosNomina();
        return $obj->obtenerOrdenDisponible($identidad, $idtiponomina);
    }
}
