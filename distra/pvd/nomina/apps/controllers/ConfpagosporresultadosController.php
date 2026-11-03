<?php

class ConfpagosporresultadosController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();

    }

    public function confpagosporresultadosAction()
    {
        // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    public function GuardarAction()
    {
        $idpagoporresultado = $this->_request->getPost('idpagoporresultado');

        $referencia = $this->_request->getPost('referencia');
        $tipodato = ConfpagosporresultadosModel::Guardar($idpagoporresultado);

        $objComp = new CompartimentacionNominaModel($referencia);

        $r['code'] = $objComp->getDataFile();

        echo json_encode($r);

        /* $hola = CompartimentacionModel ::CompartimentacionModel('nueva');
        echo json_encode(array('datos' => 'ok'));*/
    }

    public function DesaprobarAction()
    {
        $idpagoporresultado = $this->_request->getPost('idpagoporresultado');

        $referencia = $this->_request->getPost('referencia');
        $tipodato = ConfpagosporresultadosModel::Desaprobar($idpagoporresultado);

        // $objComp = new CompartimentacionNominaModel($referencia);
        $nombre = ucwords($referencia);
        $register = Zend_Registry::getInstance();
        $this->dirFolderComp = $register->config->modulo_path .
            '/models/bussines/Calculo';
        $this->dirFileComp = $this->dirFolderComp . '/Calculo' . $nombre . '.php';
        //$r['code'] =unlink($this->dirFileComp);

        echo json_encode('ok');

        /* $hola = CompartimentacionModel ::CompartimentacionModel('nueva');
        echo json_encode(array('datos' => 'ok'));*/
    }

    public function obtenerTiposPagoAction()
    {

        $obj = new NomTipoPagoModel();
        $r = $obj->obtenerListadoTiposPago();
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));

    }

    public function obtenerConfpagosporresultadosAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idestructura = $this->global->Estructura->idestructura;
        $obj = new ConfpagosporresultadosModel();
        $r = $obj->obtenerConfpagosporresultados($idestructura, $start, $limit);
        $cantidad = $obj->cantidadConfpagosporresultados($idestructura);
        echo json_encode(array('datos' => $r, 'cantidad' => $cantidad));
    }

    public function AddTiposdepagosAction()
    {
        //$idtipopago = $this->_request->getPost('idtipopago');

        $idtipopago = Zend_Json::decode(stripslashes($this->_getParam('idtipopago')));
        $idestrcutura = $this->global->Estructura->idestructura;
        // print_r($perfilseguridad);die;
        $referencia = 'por definir';

        $obj = new ConfpagosporresultadosModel();
        $idpagoporresultado = $obj->AddTiposdepagos($idtipopago, $idestrcutura);
        echo json_encode(array('datos' => $idpagoporresultado));


    }

    public function DelTiposdepagosAction()
    {
        $idpagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('idpagoporresultado')));
        // $idpagoporresultado = $this->_request->getPost(' idpagoporresultado');
        $referencia = 'por definir';

        $obj = new ConfpagosporresultadosModel();
        $idpagoporresultado = $obj->DelTiposdepagos($idpagoporresultado);
        echo json_encode(array('datos' => 'ok'));
    }

    public function obtenerAreaAction()
    {
        $node = $this->_request->getPost('node');
        $idestructura = $this->global->Estructura->idestructura;
        $r = array();
        if ($node == 'root') {
            $r = NomAreasModel::obtenerAreas($idestructura);
            foreach ($r as $k => $v) {
                $r[$k]['checked'] = false;
                $r[$k]['leaf'] = true;
                $r[$k]['text'] = $v['area'];
                $r[$k]['id'] = $v['idarea'];
                $r[$k]['idestructura'] = $v['idestructura'];
            }
        }
        echo Zend_Json::encode($r);
    }

    public function ObtenerCargosporareasAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $idarea = Zend_Json::decode(stripslashes($this->_getParam('idarea')));
        $idpagoporresultado = $this->_getParam('idpagoporresultado');
        $obj = new ConfpagosporresultadosModel();
        $r = $obj->ObtenerCargosporareas($idarea, $idestructura, $idpagoporresultado);
        if (count($r) > 0) {
            echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
        } else
            echo json_encode(array('datos' => [], 'cantidad' => count($r)));
    }

    public function ObtenerCargosapagosporresultadosAction()
    {
        //$idarea = $this->_request->getPost('idarea');
        $idestructura = $this->global->Estructura->idestructura;
        $idpagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('idpagoporresultado')));
        $obj = new ConfpagosporresultadosModel();
        $r = $obj->ObtenerCargosapagosporresultados($idestructura, $idpagoporresultado);
        if (count($r) > 0) {
            echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
        } else
            echo json_encode(array('datos' => [], 'cantidad' => count($r)));

    }

    public function AddCargosapagosporresultadosAction()
    {
        // $idcargo = $this->_request->getPost('idcargo');
        // $idpagoporresultado = $this->_request->getPost('idpagoporresultado');
        $idcargo = Zend_Json::decode(stripslashes($this->_getParam('idcargo')));
        $idpagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('idpagoporresultado')));

        $obj = new ConfpagosporresultadosModel();
        $idpagoporresultado = $obj->AddCargosapagosporresultados($idcargo, $idpagoporresultado);
        echo json_encode(array('datos' => 'ok'));
    }

    public function DelCargosapagosporresultadosAction()
    {
        // $idcargo = $this->_request->getPost('idcargo');
        // $idpagoporresultado = $this->_request->getPost('idpagoporresultado');
        $idcargopagoresultado = Zend_Json::decode(stripslashes($this->_getParam('idcargopagoresultado')));

        $obj = new ConfpagosporresultadosModel();
        $idpagoporresultado = $obj->DelCargosapagosporresultados($idcargopagoresultado);
        echo json_encode(array('datos' => 'ok'));
    }

    public function obtenerVariablesAction()
    {
        // $idpagoporresultado = $this->_request->getPost('idpagoporresultado');

        $r = ConfVariablesReportesCertificacionesModel::obtenerVariables();

        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function ObtenerIndicadorespagosporresultadosidAction()
    {
        $idpagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('idpagoporresultado')));
        $obj = new ConfpagosporresultadosModel();
        $r = $obj->ObtenerIndicadorespagosporresultadosid($idpagoporresultado);

        if (count($r) > 0) {
            echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
        } else
            echo json_encode(array('datos' => [], 'cantidad' => count($r)));

    }

    public function AddIndicadorespagosporresultadosAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $tipovalor = $this->_request->getPost('tipovalor');
        $idreporteentrada = $this->_request->getPost('idreporteentrada');
        $idreportesalida = $this->_request->getPost('idreportesalida');
        $obligatorio = $this->_request->getPost('obligatorio');
        $recalculable = $this->_request->getPost('recalculable');
        $resultadofinal = $this->_request->getPost('resultadofinal');
        $sumadestajo = $this->_request->getPost('sumadestajo');
        $idpagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('idpagoporresultado')));
        $idestructuramodelonomina = Zend_Json::decode(stripslashes($this->_getParam('idestructuramodelonomina')));
        $lugaresdecimales = Zend_Json::decode(stripslashes($this->_getParam('lugaresdecimales')));
        $obj = new ConfpagosporresultadosModel();
        $idpagoporresultado = $obj->AddIndicadorespagosporresultados($denominacion, $idpagoporresultado, $tipovalor, $idreporteentrada, $idreportesalida, $idestructuramodelonomina, $lugaresdecimales, $obligatorio, $recalculable, $resultadofinal, $sumadestajo);
        if ($idpagoporresultado) {
            $m->codMsg = 100;
            echo json_encode($m);
        } else {
            $m->codMsg = 300;
            echo json_encode($m);
        }
        //  echo json_encode(array('datos' => 'ok'));
    }

    public function ModIndicadorespagosporresultadosAction()
    {
        $idindicadorespagoresultado = $this->_request->getPost('idindicadorespagoresultado');
        $denominacion = $this->_request->getPost('denominacion');
        $tipovalor = $this->_request->getPost('tipovalor');
        $idreporteentrada = $this->_request->getPost('idreporteentrada');
        $idreportesalida = $this->_request->getPost('idreportesalida');
        $obligatorio = $this->_request->getPost('obligatorio');
        $recalculable = $this->_request->getPost('recalculable');
        $resultadofinal = $this->_request->getPost('resultadofinal');
        $sumadestajo = $this->_request->getPost('sumadestajo');
        $idpagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('idpagoporresultado')));
        $idestructuramodelonomina = Zend_Json::decode(stripslashes($this->_getParam('idestructuramodelonomina')));
        $lugaresdecimales = Zend_Json::decode(stripslashes($this->_getParam('lugaresdecimales')));
        try {
            $obj = new ConfpagosporresultadosModel();
            $idpagoporresultado = $obj->ModIndicadorespagosporresultados($idindicadorespagoresultado, $denominacion, $idpagoporresultado, $tipovalor, $idreporteentrada, $idreportesalida, $idestructuramodelonomina, $lugaresdecimales, $obligatorio, $recalculable, $resultadofinal, $sumadestajo);

            if ($idpagoporresultado) {
                $m->codMsg = 100;
                echo json_encode($m);
            } else {
                $m->codMsg = 300;
                echo json_encode($m);
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }


        // echo json_encode(array('datos' => 'ok'));
    }

    public function DelIndicadorespagosporresultadosAction()
    {
        $idindicadorespagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('idindicadorespagoresultado')));
        // $idpagoporresultado = $this->_request->getPost(' idpagoporresultado');
        $referencia = 'por definir';

        $obj = new ConfpagosporresultadosModel();
        $idpagoporresultado = $obj->DelIndicadorespagosporresultados($idindicadorespagoporresultado);
        echo json_encode(array('datos' => 'ok'));
    }

    public function OrdenarAScAction()
    {
        $idindicadorespagoporresultado = $this->_request->getPost('idindicadorespagoresultado');
        $idpagoporresultado = $this->_request->getPost('idpagoporresultado');


        $obj = new ConfpagosporresultadosModel();
        $idpagoporresultado = $obj->OrdenarASc($idindicadorespagoporresultado, $idpagoporresultado);
        echo json_encode(array('datos' => 'ok'));
    }

    public function OrdenarDesAction()
    {
        $idindicadorespagoporresultado = $this->_request->getPost('idindicadorespagoresultado');
        $idpagoporresultado = $this->_request->getPost('idpagoporresultado');

        $obj = new ConfpagosporresultadosModel();
        $idpagoporresultado = $obj->OrdenarDes($idindicadorespagoporresultado, $idpagoporresultado);
        echo json_encode(array('datos' => 'ok'));
    }

    //Fórmulas
    public function obtenerIndicadoresFormulasAction()
    {
        $idpagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('idpagoporresultado')));
        $arrInd = ConfpagosporresultadosModel::ObtenerIndicadorespagosporresultadosid($idpagoporresultado);
        //Arreglo de los indicadores.
        foreach ($arrInd as $k => $v) {
            $arrR[] = array(
                'idindicador' => 'F_' . $v['idindicadorespagoresultado'],
                'indicador' => $v['denominacion'],
                'tipo' => 'Indicadores',
                'orden' => $v['orden']);
        }
        echo Zend_Json::encode(array('indicadores' => $arrR));
    }

    public function obtenerIdsFormulasAction()
    {
        $ioc = ZendExt_IoC_Inter::getInstance();
        //Arreglo de los idexpresionmatematica de las formulas de los indicadores para el tipo de pago seleccionado.
        $r = new stdClass();
        $idindicadorespagoresultado = $this->_getParam('idindicadorpagoresultado');
        $arridsformulas = (!empty($idindicadorespagoresultado)) ? ConfIndicadorespagosporresultados::obtenerExpresionesMatXIdIndicadoresPR($idindicadorespagoresultado) : null;

        $r->idindicadorespagoresultado = $idindicadorespagoresultado;
        $r->tipovalor = $arridsformulas[0]['tipovalor'];
        $r->orden = $arridsformulas[0]['orden'];
        //Datos de la formula del text area "Indicador"
        $r->formulaindicador = (!empty($arridsformulas[0]['expresionmatematicaindicador'])) ? $arridsformulas[0]['expresionmatematicaindicador'] : -1;
        if ($r->formulaindicador != -1) {
            $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($r->formulaindicador));
            $r->textoformulaindicador = $rf[0]['expresionamostrar'];
        } else
            $r->textoformulaindicador = '';

        //Datos de la formula del text area "Sumatoria"
        $r->formulasumatoria = (!empty($arridsformulas[0]['expresionmatematicaformula'])) ? $arridsformulas[0]['expresionmatematicaformula'] : -1;
        if ($r->formulasumatoria != -1) {
            $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($r->formulasumatoria));
            $r->textoformulasumatoria = $rf[0]['expresionamostrar'];
        } else
            $r->textoformulasumatoria = '';

        echo(json_encode($r));
    }

    public function adicionarFormulasAction()
    {

        $idindicadorespagoresultado = $this->_request->getPost('idindicadorespagoresultado');
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $tipoexpresion = $this->_request->getPost('tipoexpresion');
        $objConfPagosporresultado = new ConfPagosporresultadoModel();
        echo json_encode($objConfPagosporresultado->adicionarFormulas($idindicadorespagoresultado, $idexpresionmatematica, $tipoexpresion));
    }

    public function limpiarFormulasIndicadoresAction()
    {
//        //Eliminando fórmulas de retención del tipo de nómina.
//        $obj = ConfPagosporresultadoModel::limpiarFormulas($this->_getParam('idtiponomina'));
//        if ($obj == "ok")
//            echo "{'codMsg':'1'}";
//        else
//            echo "{'codMsg':'0'}";
    }

    public function obtenerCamposNominasAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $arraycamposnominas = ConfpagosporresultadosModel::obtenerCamposNominas($idestructura);
        //Imprimiendo por los tipos de nominas los campos de las mismas en el tree combo
        echo Zend_Json::encode($arraycamposnominas);
    }

    public function buscarPadreSuperiorAction(){
        $arrCaminosCargos = $this->integrator->metadatos->getRutaEstructura(array($this->global->Estructura->idestructura));
        $idpadresuperior = explode('/', $arrCaminosCargos[0]['rutaId'])[0];
        echo json_encode($idpadresuperior);
    }

    public function replicarAction(){
        $arrEntidades = Zend_Json::decode(stripslashes($this->_getParam('arrEntidades')));
        $arridpagoporresultado = Zend_Json::decode(stripslashes($this->_getParam('arridpagoporresultado')));
        $arridtipopago = Zend_Json::decode(stripslashes($this->_getParam('arridtipopago')));
        $objConfPagoResultados = new ConfPagosporresultado();
        $objConfIndicadorespagosporresultados = new ConfIndicadorespagosporresultados();
        //Recorriendo el array de estructuras
        foreach ($arrEntidades as $identidad){
           //Verificando que el pago x resultados no exista para la entidad
           foreach ($arridpagoporresultado as $i=>$idpagres){
               $arrdatosppr = $objConfPagoResultados->devPagosPorResultadosPorId($idpagres);
               $idtipopago = $arrdatosppr[0]['idtipopago'];
               $existe = $objConfPagoResultados->existePagosPorResultadosPorIdEntidadIdTipoPago($identidad, $idtipopago);
               //Si no existe en la entidad
               if($existe == 0){
                   //Guardando el pago x resultados para la nueva entidad
                   $objConfPagoResultadosSave = new ConfPagosporresultado();
                   $objConfPagoResultadosSave->idtipopago = $idtipopago;
                   $objConfPagoResultadosSave->referencia = $arrdatosppr[0]['referencia'];
                   $objConfPagoResultadosSave->estado = $arrdatosppr[0]['estado'];
                   $objConfPagoResultadosSave->identidad = $identidad;
                   $objConfPagoResultadosSave->save();
                   $idpagoporresultado = $objConfPagoResultadosSave->idpagoporresultado;
                   //Obteniendo los indicadores del pago x resultados q se esta replicando
                   $indicadores = $objConfIndicadorespagosporresultados->ObtenerIndicadorespagosporresultadosid($idpagres);
                   if(count($indicadores)>0){
                       $arrindrealcopia = array();
                       foreach ($indicadores as $indicador){
                           $objConfIndicadorespagosporresultadosSave = new ConfIndicadorespagosporresultados();
                           $objConfIndicadorespagosporresultadosSave->idreporteentrada = $indicador['idreporteentrada'];
                           $objConfIndicadorespagosporresultadosSave->idreportesalida = $indicador['idreportesalida'];
                           $objConfIndicadorespagosporresultadosSave->idpagoporresultado = $idpagoporresultado;
                           $objConfIndicadorespagosporresultadosSave->orden = $indicador['orden'];
                           $objConfIndicadorespagosporresultadosSave->tipovalor = $indicador['tipovalor'];
                           $objConfIndicadorespagosporresultadosSave->denominacion = $indicador['denominacion'];
                           //Creando nuevas expresiones matematicas
                           //Busco las expresiones matematicas*/
                           $dm = Doctrine_Manager::getInstance();
                           $conn = $dm->getCurrentConnection();
                           if($indicador['expresionmatematicaindicador']){
                               $sql = "SELECT dem.idexpresionmatematica, dem.denominacion, dem.expresionamostrar, dem.expresionacalcular,
                                deem.elemento, deem.tipoelemento, deem.idindicador, deem.orden, deem.valormostrar, deem.idelementoexpresionmatematica 
                                FROM mod_utiles.dat_expresionmatematica dem
                                INNER JOIN mod_utiles.dat_elementoexpresionmatematica deem ON (deem.idexpresionmatematica = dem.idexpresionmatematica)
                               WHERE dem.idexpresionmatematica = ? ORDER BY dem.idexpresionmatematica, deem.orden;";
                               $rExpMat = $conn->fetchAll($sql, array($indicador['expresionmatematicaindicador']));
                               $arrExpMat = array();
                               foreach ($rExpMat as $em)
                               {
                                   $arrE = array();
                                   $arrE['denominacion'] = $em['expresionamostrar'];
                                   $arrE['expresionamostrar'] = $em['expresionamostrar'];
                                   $arrE['expresionacalcular'] = $em['expresionacalcular'];
                                   $arrE['expresionmostrarconformato'] = $em['expresionamostrar'];
                                   $arrExpMat[$em['idexpresionmatematica']]['expresionmatematica'] = $arrE;
                                   $arrElem = array();
                                   $arrElem['valor'] = $em['elemento'];
                                   $arrElem['tipo'] = $em['tipoelemento'];
                                   $arrElem['valormostrar'] = $em['valormostrar'];
                                   $arrExpMat[$em['idexpresionmatematica']]['elementos'][] = $arrElem;

                               }
                               $arrExpMatCopia = $arrExpMat;
                               $expcal = $arrExpMat[$indicador['expresionmatematicaindicador']]['expresionmatematica']['expresionacalcular'];

                               foreach ($arrExpMatCopia[$indicador['expresionmatematicaindicador']]['elementos'] as &$eme){
                                   if($eme['tipo'] == 6){
                                       $rexplind = explode('_', $eme['valor']);
                                       if($rexplind[0] == 'IF'){
                                           $idindicadorviejo = $rexplind[1];
                                           $idindicadornuevo = $arrindrealcopia[$idindicadorviejo];
                                           $expcal = str_replace("F_".$idindicadorviejo, "F_".$idindicadornuevo, $expcal);
                                           $valor = str_replace("F_".$idindicadorviejo, "F_".$idindicadornuevo, $eme['valor']);
                                           $eme['valor'] = $valor;
                                       }


                                   }
                               }
                               $arrExpMatCopia[$indicador['expresionmatematicaindicador']]['expresionmatematica']['expresionacalcular'] = $expcal;

                               if($arrExpMatCopia[$indicador['expresionmatematicaindicador']]['expresionmatematica']['denominacion']){
                                   /*Duplicando la expresion matematica y se guarda en la configuracion*/
                                   $idExpMat = $this->pIntegrator->comun->AdicionarExpresionMatematica(
                                       $arrExpMatCopia[$indicador['expresionmatematicaindicador']]['expresionmatematica'],
                                       $arrExpMatCopia[$indicador['expresionmatematicaindicador']]['elementos']
                                   );
                                   $this->pIntegrator->comun->GuardarExpresionesMatematicas(array($idExpMat));
                                   $objConfIndicadorespagosporresultadosSave->expresionmatematicaindicador = $indicador['expresionmatematicaindicador'] = $idExpMat;
                               }

                           }
                           if($indicador['expresionmatematicaformula']){
                               $sql = "SELECT dem.idexpresionmatematica, dem.denominacion, dem.expresionamostrar, dem.expresionacalcular,
                                deem.elemento, deem.tipoelemento, deem.idindicador, deem.orden, deem.valormostrar, deem.idelementoexpresionmatematica 
                                FROM mod_utiles.dat_expresionmatematica dem
                                INNER JOIN mod_utiles.dat_elementoexpresionmatematica deem ON (deem.idexpresionmatematica = dem.idexpresionmatematica)
                               WHERE dem.idexpresionmatematica = ? ORDER BY dem.idexpresionmatematica, deem.orden;";
                               $rExpMat = $conn->fetchAll($sql, array($indicador['expresionmatematicaformula']));
                               $arrExpMat = array();
                               foreach ($rExpMat as $em)
                               {
                                   $arrE = array();
                                   $arrE['denominacion'] = $em['expresionamostrar'];
                                   $arrE['expresionamostrar'] = $em['expresionamostrar'];
                                   $arrE['expresionacalcular'] = $em['expresionacalcular'];
                                   $arrE['expresionmostrarconformato'] = $em['expresionamostrar'];
                                   $arrExpMat[$em['idexpresionmatematica']]['expresionmatematica'] = $arrE;
                                   $arrElem = array();
                                   $arrElem['valor'] = $em['elemento'];
                                   $arrElem['tipo'] = $em['tipoelemento'];
                                   $arrElem['valormostrar'] = $em['valormostrar'];
                                   $arrExpMat[$em['idexpresionmatematica']]['elementos'][] = $arrElem;

                               }
                               $arrExpMatCopia = $arrExpMat;
                               $expcal = $arrExpMat[$indicador['expresionmatematicaformula']]['expresionmatematica']['expresionacalcular'];

                               foreach ($arrExpMatCopia[$indicador['expresionmatematicaformula']]['elementos'] as &$eme){
                                   if($eme['tipo'] == 6){
                                       $rexplind = explode('_', $eme['valor']);
                                       if($rexplind[0] == 'IF'){
                                           $idindicadorviejo = $rexplind[1];
                                           $idindicadornuevo = $arrindrealcopia[$idindicadorviejo];
                                           $expcal = str_replace("F_".$idindicadorviejo, "F_".$idindicadornuevo, $expcal);
                                           $valor = str_replace("F_".$idindicadorviejo, "F_".$idindicadornuevo, $eme['valor']);
                                           $eme['valor'] = $valor;
                                       }


                                   }
                               }
                               $arrExpMatCopia[$indicador['expresionmatematicaformula']]['expresionmatematica']['expresionacalcular'] = $expcal;
                               //print_r($arrExpMatCopia);die;
                               if($arrExpMatCopia[$indicador['expresionmatematicaformula']]['expresionmatematica']['denominacion']){
                                   /*Duplicando la expresion matematica y se guarda en la configuracion*/
                                   $idExpMat = $this->pIntegrator->comun->AdicionarExpresionMatematica(
                                       $arrExpMatCopia[$indicador['expresionmatematicaformula']]['expresionmatematica'],
                                       $arrExpMatCopia[$indicador['expresionmatematicaformula']]['elementos']
                                   );
                                   $this->pIntegrator->comun->GuardarExpresionesMatematicas(array($idExpMat));
                                   $objConfIndicadorespagosporresultadosSave->expresionmatematicaformula = $indicador['expresionmatematicaformula'] = $idExpMat;
                               }
                           }
                           //
                           $objConfIndicadorespagosporresultadosSave->idestructuramodelonomina = $indicador['idestructuramodelonomina'];
                           $objConfIndicadorespagosporresultadosSave->essbc = $indicador['essbc'];
                           $objConfIndicadorespagosporresultadosSave->lugaresdecimales = $indicador['lugaresdecimales'];
                           $objConfIndicadorespagosporresultadosSave->obligatorio = $indicador['obligatorio'];
                           $objConfIndicadorespagosporresultadosSave->recalculable = $indicador['recalculable'];
                           $objConfIndicadorespagosporresultadosSave->resultadofinal = $indicador['resultadofinal'];
                           $objConfIndicadorespagosporresultadosSave->sumadestajo = $indicador['sumadestajo'];
                           $objConfIndicadorespagosporresultadosSave->save();
                           $arrindrealcopia[$indicador['idindicadorespagoresultado']] = $objConfIndicadorespagosporresultadosSave->idindicadorespagoresultado;

                       }
                   }

               }

           }
        }
        echo json_encode('ADD-1');

    }

    public function actualizarOrdenAction(){
        $arrayidindicadores = Zend_Json::decode(stripslashes($this->_getParam('arrayidindicadores')));
        $arrayorden = Zend_Json::decode(stripslashes($this->_getParam('arrayorden')));
        foreach ($arrayidindicadores as $i=>$idindicador){
            $objUpdateConfInd = Doctrine::getTable('ConfIndicadorespagosporresultados')->find($idindicador);
            $objUpdateConfInd->orden = $arrayorden[$i];
            $objUpdateConfInd->save();
        }
        echo json_encode('ok');
    }

}
