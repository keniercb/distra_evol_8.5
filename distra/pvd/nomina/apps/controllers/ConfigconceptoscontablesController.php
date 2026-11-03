<?php

/**
 * Controlador para configurar los conceptos contables.
 *
 * @author Tte. Frank Rodiguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses ConfigconceptoscontablesController
 * @copyright UCID
 * @version 1.0
 */
class ConfigconceptoscontablesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de configurar los conceptos contabless.
     */
    public function configconceptoscontablesAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        $this->view->scriptelemgastoUI = $this->integrator->contabilidad->dir_CmpEOGUI();
        $this->view->scriptelemgastoClass = $this->integrator->contabilidad->dir_CmpEOGClass();
        //Mostrando la vista.

        $this->render();
    }

    /**
     * Accion utilizada para listar la configuración de los conceptos contabless.
     */
    public function obtenerConfigConceptosContablesAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $start = $this->_request->getPost('start', 0);
        $limit = $this->_request->getPost('limit', 1000);
        //Estructura economica
        $idestructuraE = $this->global->EstructuraEconomica->idestructurae;
        $criterio = $this->_request->getPost('criterio');
        $objDomain = new ConfigConceptosContables();
        $objDomainNomTipoNomina = new NomTipoNomina();
        $objDomainConfigEstructurarModelosNomina = new ConfigEstructurarModelosNomina();
        $objDatConceptosContablesElementosGasto = new DatConceptosContablesElementosGasto();
        $arrconfigconceptoscontables = $objDomain->obtenerListadoConfigConceptosContables($idestructura, $criterio, $start, $limit);
        $contconceptoscontables = $objDomain->obtenerTotalConfigConceptosContables($idestructura, $criterio);
        $arrayfinal = array();
        $cont = 0;
        foreach ($arrconfigconceptoscontables as $i => $valor) {
            $arrayfinal[$cont]['idconceptoscontables'] = $valor['idconceptoscontables'];
            $arrayfinal[$cont]['denominacion'] = explode(' - ', $valor['denominacion'])[0];
            $arrayfinal[$cont]['obligacion'] = $valor['obligacion'];
            $arrayfinal[$cont]['fdesde'] = $valor['fdesde'];
            $arrayfinal[$cont]['fhasta'] = $valor['fhasta'];
            $arrayfinal[$cont]['descripcion'] = $valor['descripcion'];
            $arrayfinal[$cont]['idestructuramodelodomina'] = $valor['idestructuramodelodomina'];
            $arrayfinal[$cont]['id'] = $valor['id'];
            $arrayfinal[$cont]['partida'] = $valor['partida'];
            $arrayfinal[$cont]['text'] = $valor['partida'];
            $arrayfinal[$cont]['denominacionestructuranomina'] = $objDomainConfigEstructurarModelosNomina->obtenerDenomXId($valor['idestructuramodelodomina']);
            $arrayfinal[$cont]['idtiponomina'] = $valor['idtiponomina'];
            $arrayfinal[$cont]['idestructura'] = $valor['idestructura'];
            $arrayfinal[$cont]['liquidacobrosypagos'] = $valor['liquidacobrosypagos'];
            $arrayfinal[$cont]['denomliquidacobrosypagos'] = ($valor['liquidacobrosypagos'] == 1) ? 'Si' : 'No';
            $arrayfinal[$cont]['idcampoliquidaobligacion'] = $valor['idcampoliquidaobligacion'];
            $arrayfinal[$cont]['campoliquidaobligacion'] = $objDomainConfigEstructurarModelosNomina->obtenerDenomXId($valor['idcampoliquidaobligacion']);
            if ($valor['idparrafofiscal']) {
                $arrayfinal[$cont]['idparrafofiscal'] = $valor['idparrafofiscal'];
                $rpf = $rpf = $this->integrator->datosmaestros->getClientesProveedorByParams($valor['idparrafofiscal'], null, null, true, null);
                $arrayfinal[$cont]['denominacionpf'] = $rpf['datos'][0]['nombre'];
            } else {
                $arrayfinal[$cont]['denominacionpf'] = '';
            }
            if ($valor['idclienteproveedorcobropago']) {
                /*$rccp = $this->integrator->datosmaestros->getClientesProveedorByParams($valor['idparrafofiscal'], null, false, true, null);
                //Recorriendo el proveedor para buscar la cuenta que coincide con la del concepto rm
                foreach($rccp['datos'][0]['cobrospagos'] as $rccp){
                    if($rccp['idclienteproveedorcobropago'] == $valor['idclienteproveedorcobropago']){
                        $arrayfinal[$cont]['nombrecuenta'] = $rccp['nombrecuenta'];
                        $arrayfinal[$cont]['idclienteproveedorcobropago'] = $valor['idclienteproveedorcobropago'];
                    }
                }*/
                //Si es una estructura economica
                if ($idestructuraE) {
                    $arrayfinal[$cont]['nombrecuenta'] = $this->integrator->contabilidad->obtenerCuentaPorId($valor['idclienteproveedorcobropago'])->text;
                }
                $arrayfinal[$cont]['idclienteproveedorcobropago'] = $valor['idclienteproveedorcobropago'];
            } else {
                $arrayfinal[$cont]['nombrecuenta'] = '';
            }
            if ($valor['idtienecobrospagos'] == 1) {
                $arrayfinal[$cont]['idtienecobrospagos'] = $valor['idtienecobrospagos'];
                $arrayfinal[$cont]['denomtienecobrospagos'] = 'Si';
            } else {
                $arrayfinal[$cont]['idtienecobrospagos'] = $valor['idtienecobrospagos'];
                $arrayfinal[$cont]['denomtienecobrospagos'] = 'No';
            }
            if ($valor['idtipocobrospagos'] == 1) {
                $arrayfinal[$cont]['idtipocobrospagos'] = $valor['idtipocobrospagos'];
                $arrayfinal[$cont]['denomtipocobrospagos'] = 'Por cobrar';
            } else if ($valor['idtipocobrospagos'] == 2) {
                $arrayfinal[$cont]['denomtipocobrospagos'] = 'Por pagar';
                $arrayfinal[$cont]['idtipocobrospagos'] = $valor['idtipocobrospagos'];
            }
            if ($valor['idtipointegracioncobrospagos'] == 1) {
                $arrayfinal[$cont]['idtipointegracioncobrospagos'] = $valor['idtipointegracioncobrospagos'];
                $arrayfinal[$cont]['denomidtipointegracioncobrospagos'] = 'Por personas';
            } else if ($valor['idtipointegracioncobrospagos'] == 2) {
                $arrayfinal[$cont]['idtipointegracioncobrospagos'] = $valor['idtipointegracioncobrospagos'];
                $arrayfinal[$cont]['denomidtipointegracioncobrospagos'] = 'Global';
            }
            if (!empty($valor['cuentacontable'])) {
                if ($idestructuraE) {
                    $arrayfinal[$cont]['denom'] = $this->integrator->contabilidad->obtenerCuentaPorId($valor['cuentacontable'])->text;
                }
                $arrayfinal[$cont]['cuentacontable'] = $valor['cuentacontable'];
            }
            $arrayfinal[$cont]['denominaciontiponomina'] = $objDomainNomTipoNomina->obtenerDenominacion($valor['idtiponomina']);
            $arrayelementoconceptos = $objDatConceptosContablesElementosGasto->obtenerDatConceptosContablesElementosGastoxIdConceptosContables($valor['idconceptoscontables']);
            $arrayfinal[$cont]['idconceptcontabelemtgasto'] = (count($arrayelementoconceptos) > 0) ? $arrayelementoconceptos[0]['idconceptcontabelemtgasto'] : -1;
            $arrayfinal[$cont]['idelementosgasto'] = $arrayelementoconceptos[0]['idelementosgasto'];
            $datoselem = $this->integrator->contabilidad_costos->obtenerElementoObjetoPorId($arrayelementoconceptos[0]['idelementosgasto']);
            $arrayfinal[$cont]['denomelementosgasto'] = $datoselem['descripcionelementoobjeto'];
            if (count($datoselem) > 0) {
                $arrayfinal[$cont]['denomelementosgasto'] = $datoselem['descripcionelementoobjeto'];
            } else {
                $arrayfinal[$cont]['denomelementosgasto'] = 'rojo';
            }
            $cont++;


        }
        //Imprimiendo la configuración de los modelos de nominas.
        echo Zend_Json::encode(array('datos' => $arrayfinal, 'cantidad' => $contconceptoscontables));
    }

    /**
     * Accion utilizada para listar los tipos de nomina.
     */
    public function obtenerTiposNominaAction()
    {
        $objTiposNomina = new NomTipoNomina();
        $arraytiposnomina = $objTiposNomina->obtenerListadoTodosTiposNomina();
        $cantidad = count($arraytiposnomina);
        //print_r($this->global->Subsistema);die;
        //Imprimiendo los tipos de nomina
        echo Zend_Json::encode(array('datos' => $arraytiposnomina, 'cantidad' => $cantidad));
    }

    /**
     * Accion utilizada para cargar treecombo de las partidas de gasto.
     */
    public function obtenerPartidasgastoAction()
    {
        $objPartidasgasto = new NomPartidagasto();
        $arraypartidasgasto = $objPartidasgasto->obtenerPartidasgasto();
        $cantidad = count($arraypartidasgasto);
        //print_r($this->global->Subsistema);die;
        //Imprimiendo los tipos de nomina
        echo Zend_Json::encode($arraypartidasgasto);
    }

    /**
     * Accion para listar las estructuras de las nóminas.
     */
    public function obtenerEstructuraNominaAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $objEstructuraNomina = new ConfigEstructurarModelosNomina();
        $arrayestructuranomina = $objEstructuraNomina->obtenerDatosModeloNominaxIdTipoNomina($idestructura, $idtiponomina);
        //Imprimiendo la configuración de las estructuras de las nóminas.
        echo Zend_Json::encode(array('datos' => $arrayestructuranomina, 'cantidad' => count($arrayestructuranomina)));
    }

    /**
     * Accion utilizada para actualizar la configuración de los conceptos contables. modificado 22/02/2015 milena
     */
    public function actualizarConfigConceptosContablesAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idconceptoscontables = $this->_request->getPost('idconceptoscontables');
        $denominacion = $this->_request->getPost('denominacion');
        $obligacion = $this->_request->getPost('obligacion');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $idestructuranomina = $this->_request->getPost('idestructuranomina');
        $idpartidagasto = $this->_request->getPost('idpartidagasto');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $descripcion = $this->_request->getPost('descripcion');
        $addmod = $this->_request->getPost('addmod');
        $idparrafofiscal = $this->_request->getPost('idparrafofiscal');
        $idclienteproveedorcobropago = $this->_request->getPost('idclienteproveedorcobropago');
        $idtienecobrospagos = $this->_request->getPost('idtienecobrospagos');
        $idtipocobrospagos = $this->_request->getPost('idtipocobrospagos');
        $tipointegracioncobrospagos = $this->_request->getPost('tipointegracioncobrospagos');
        $cuentacontable = $this->_request->getPost('cuentacontable');
        $liquidacobrosypagos = $this->_request->getPost('liquidacobrosypagos');
        $idcampoliquidaobligacion = $this->_request->getPost('idcampoliquidaobligacion');

        $objModel = new ConfigConceptosContablesModel();
        if ($addmod == 1) {
            $add = $objModel->adicionarConfigConceptosContables($idestructura, $denominacion, $idtiponomina, $idestructuranomina, $fechainicio, $fechafin, $descripcion,
                $idpartidagasto, $obligacion, $idparrafofiscal, $idclienteproveedorcobropago, $idtienecobrospagos, $idtipocobrospagos, $tipointegracioncobrospagos, $cuentacontable, $liquidacobrosypagos, $idcampoliquidaobligacion);
            //Devolviendo una notificación de que todo ocurrió correctamente.
            echo json_encode($add);
        } else {
            $mod = $objModel->modificarConfigConceptosContables($idconceptoscontables, $idestructura, $denominacion, $idtiponomina, $idestructuranomina, $fechainicio,
                $fechafin, $descripcion, $idpartidagasto, $obligacion, $idparrafofiscal, $idclienteproveedorcobropago, $idtienecobrospagos, $idtipocobrospagos, $tipointegracioncobrospagos, $cuentacontable, $liquidacobrosypagos, $idcampoliquidaobligacion);
            //Devolviendo una notificación de que todo ocurrió correctamente.
            echo json_encode($mod);
        }

    }

    /**
     * Accion utilizada para eliminar la configuración de los conceptos contables.
     */
    public function eliminarConfigConceptosContablesAction()
    {
        $identidad = $this->_getParam('identidad');
        $arridsconceptos = Zend_Json::decode(stripslashes($this->_getParam('idconceptoscontables')));
        $objModel = new ConfigConceptosContablesModel();
        $del = $objModel->eliminarConfigConceptosContables($identidad, $arridsconceptos);
        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo json_encode($del);
    }

    /**
     * Accion utilizada para obtener los elementos del gasto.
     */
    public function obtenerElementosGastoAction()
    {

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo json_encode($del);
    }

    /**
     * Accion utilizada para obtener los elementos del gasto.
     */
    public function asociarElementosGastoAction()
    {
        $idconceptocontable = $this->_request->getPost('idconceptocontable');
        $idelementogasto = $this->_request->getPost('idelementogasto');
        $idconceptcontabelemtgasto = $this->_request->getPost('idconceptcontabelemtgasto');
        //Si el concepto ya tiene elemento se elmina el viejo
        if ($idconceptcontabelemtgasto != -1) {
            $objDatConceptosContablesElementosGasto = new DatConceptosContablesElementosGasto();
            $objDelete = $objDatConceptosContablesElementosGasto->obtenerObjDatConceptosContablesElementosGasto($idconceptcontabelemtgasto);
            $objDelete->delete();
        }
        //Obteniendo la clase para salvar en bd
        $objDomainConceptosElemGasto = new DatConceptosContablesElementosGasto();
        //Salvando los datos
        $objDomainConceptosElemGasto->idconceptoscontables = $idconceptocontable;
        $objDomainConceptosElemGasto->idelementosgasto = $idelementogasto;
        $objDomainConceptosElemGasto->save();
        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo json_encode($idelementogasto);
    }

    public function replicardatosAction()
    {
        $arridentidades = Zend_Json::decode(stripslashes($this->_getParam('identidad')));
        $arridconceptos = Zend_Json::decode(stripslashes($this->_getParam('arridconceptos')));

        $replica = ConfigConceptosContablesModel::replicarConceptosContables($arridentidades, $arridconceptos);
        $r->codigo = ($replica == 'ok') ? 'ADD-1' : 'error';
        echo json_encode($r);
    }

    public function sincronizarConceptosContablesAction()
    {
        $idestructura = $this->_getParam('idestructura');
        //Obtener todos los conceptos contables
        $arrayconceptoscontables = ConfigConceptosContables::obtenerListadoConfigConceptosContablesEntidad($idestructura);
        foreach ($arrayconceptoscontables as $cc) {
            $cantidadccestructura = ConfigConceptosContables::obtenerTotalConfigConceptosContablesEntidad($idestructura, $cc['idconceptoscontables']);
            //Si hay mas de una asociacion con la entidad
            if ($cantidadccestructura > 1) {
                $arrconceptoccentidad = ConfigConceptosContables::obtenerIdConceptoContableEntidad($idestructura, $cc['idconceptoscontables']);
                if (count($arrconceptoccentidad[0]['ConfigConceptosContablesEntidad']) > 1) {
                    foreach ($arrconceptoccentidad[0]['ConfigConceptosContablesEntidad'] as $icc => $rcce) {
                        if ($icc != 0) {
                            $objConfigConceptosContablesEntidadDelete = Doctrine::getTable('ConfigConceptosContablesEntidad')->find($rcce['idconceptocontableentidad']);
                            $objConfigConceptosContablesEntidadDelete->delete();
                        }
                    }
                }
            }
        }
        echo json_encode('ok');
    }

    public function obtenerListadoParrafoFiscalAction()
    {
        //obteniendo en maestro si el modulo de nomina lleva parrafo fiscal
        $sql = "select * from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $modulo = $conn->fetchAll($sql);//print_r($modulo);die;
        //Si lleva parrafo fiscal se cargan estos desde datos maestros
        if (count($modulo) > 0) {
            if ($modulo[0]['parrafofiscal'] == 1) {
                //obteniendo  el proveedor desde datos maestros
                //$identidad = $this->global->Estructura->idestructura;
                $identidad = $this->global->EstructuraEconomica->idestructurae;
                $sql = "select COALESCE (clpr.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as nombre,
        COALESCE (clpr.codigo,estru.codigo, ident.numero,estruop.codigo) as codigo, clpr.idclientesproveedores
        FROM mod_datosmaestros.nom_clientesproveedor clpr
        LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona)
        LEFT JOIN mod_persona.dat_docidentidad ident ON (clpr.idpersona = ident.idpersona)
        LEFT JOIN mod_estructuracomp.dat_estructura estru ON (clpr.idestructura = estru.idestructura and estru.idproyecto=0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop estruop ON (clpr.idestructura = estruop.idestructuraop and estruop.idproyecto=0)
        where clpr.idtipo = 3 order by nombre ASC";

                $dm = Doctrine_Manager::getInstance();
                $conn = $dm->getCurrentConnection();
                $arrayResult = $conn->fetchAll($sql);
                //$rpf = $this->integrator->datosmaestros->getClientesProveedorByParams(null, $identidad, false, true);
                $arraypf = array();
                $cont = 0;
                if (count($arrayResult) > 0) {
                    foreach ($arrayResult as $pf) {
                        $arraypf[$cont]['idparrafofiscal'] = $pf['idclientesproveedores'];
                        $arraypf[$cont]['denominacionpf'] = $pf['nombre'];
                        $cont++;
                    }
                }
                //print_r($arraypf);die;
                echo json_encode(array('datos' => $arraypf, 'cantidad' => count($arraypf)));
            } else {
                echo json_encode(array());
            }
        } else {
            echo json_encode(array());
        }
    }

    public function obtenerClienteProvCobrosPagosAction()
    {
        $idparrafofiscal = $this->_request->getPost('idparrafofiscal');
        //Obteniendo las cuentas asociadas al proveedor
        $rpf = $this->integrator->datosmaestros->getClientesProveedorByParams($idparrafofiscal, null, false, true, null);
        $arraypf = array();
        $cont = 0;
        foreach ($rpf['datos'][0]['cobrospagos'] as $rc) {
            $arraypf[$cont]['idclienteproveedorcobropago'] = $rc['idcuenta'];
            $arraypf[$cont]['nombrecuenta'] = $rc['nombrecuenta'];
            $cont++;
        }
        echo json_encode(array('datos' => $arraypf, 'cantidad' => count($arraypf)));
    }

    public function sincronizarValoresContablesAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $arrayidconcont = Zend_Json::decode(stripslashes($this->_getParam('arrayidconcont')));
        $objConfigConceptosContables = new ConfigConceptosContables();
        foreach ($arrayidconcont as $idconccont) {
            $referencia = 'ConfigConceptosContables.' . $idconccont;
            //Validando si el concepto contable ya tiene un valor contable asociado
            $sqlexiste = "select count (nv.idvalorcontable) as cantidad
                FROM mod_datosmaestros.nom_valorcontable nv
                where nv.idsubsistema = 71 and nv.idestructuracomun = ? and nv.referencia = ?";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $existe = $conn->fetchOne($sqlexiste, array($idestructura, $referencia));
            //Sino existe
            if ($existe == 0) {
                $rconceptocontable = $objConfigConceptosContables->obtenerListadoTodosConfigConceptosContablesxIdConf($idconccont);
                $denomvc = $rconceptocontable[0]['denominacion'];
                $sustitucion = 'false';
                //Insertando el valor contable
                $sqlinsertvc = "INSERT INTO mod_datosmaestros.nom_valorcontable(
                    nombre, idsubsistema, tipo, idestructuracomun, sustitucion, referencia, ruta)
                    VALUES (?, ?, ?, ?, ?, ?, ?);";
                $dm = Doctrine_Manager::getInstance();
                $conn = $dm->getCurrentConnection();
                $conn->execute($sqlinsertvc, array($denomvc, 71, 5, $idestructura, $sustitucion, $referencia, '/pvd/nomina/models/domain/ConfigConceptosContables.php'));
            }
        }
        echo json_encode('ok');
    }

    /**
     * Accion para listar los campos a liquidar las obligaciones.
     */
    public function obtenerCampoLiquidarObligacionAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $objEstructuraNomina = new ConfigEstructurarModelosNomina();
        $arrayestructuranomina = $objEstructuraNomina->obtenerDatosModeloNominaxIdTipoNomina($idestructura, $idtiponomina);
        $arrayfinal = array();
        $cont = 0;
        foreach ($arrayestructuranomina as $arrest) {
            $arrayfinal[$cont]['idcampoliquidaobligacion'] = $arrest['idestructuramodelodomina'];
            $arrayfinal[$cont]['campoliquidaobligacion'] = $arrest['denominacionestructuranomina'];
            $cont++;
        }
        //Imprimiendo la configuración de las estructuras de las nóminas.
        echo Zend_Json::encode(array('datos' => $arrayfinal, 'cantidad' => count($arrayfinal)));
    }
}