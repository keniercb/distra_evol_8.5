<?php

class ConfreportescertificacionesController extends ZendExt_Controller_Secure
{
    var $datosModelo;

    public function init()
    {
        parent::init();
        $this->datosModelo->nivel[] = array('valor' => 1, 'denominacion' => 'Grupo de personas');
        $this->datosModelo->nivel[] = array('valor' => 2, 'denominacion' => 'Grupo de cargos');
        $this->datosModelo->nivel[] = array('valor' => 3, 'denominacion' => 'Entidad');

        $this->datosModelo->comportamiento[] = array('valor' => 0, 'denominacion' => 'Sin comportamiento');
        $this->datosModelo->comportamiento[] = array('valor' => 7, 'denominacion' => 'Reporte de antiguedad');
        $this->datosModelo->comportamiento[] = array('valor' => 4, 'denominacion' => 'Reporte de ausencias');
        $this->datosModelo->comportamiento[] = array('valor' => 2, 'denominacion' => 'Reporte de vacaciones');
        $this->datosModelo->comportamiento[] = array('valor' => 8, 'denominacion' => 'Reporte de Subsidios y Prestación Social');
        $this->datosModelo->comportamiento[] = array('valor' => 3, 'denominacion' => 'Reporte de Licencia de Maternidad');
        $this->datosModelo->comportamiento[] = array('valor' => 5, 'denominacion' => 'Reporte de evaluaciones');
        $this->datosModelo->comportamiento[] = array('valor' => 6, 'denominacion' => 'Reporte de reintegros');
        $this->datosModelo->comportamiento[] = array('valor' => 50, 'denominacion' => 'Busca en Reportes Anteriores');
        $this->datosModelo->comportamiento[] = array('valor' => 10, 'denominacion' => 'Reporte de Talleres');

        $this->datosModelo->obligatorioprocesarlo[] = array('valor' => 1, 'denominacion' => 'SI');
        $this->datosModelo->obligatorioprocesarlo[] = array('valor' => 2, 'denominacion' => 'NO');

        $this->datosModelo->aprobacionelementos[] = array('valor' => 1, 'denominacion' => 'Individual');
        $this->datosModelo->aprobacionelementos[] = array('valor' => 2, 'denominacion' => 'General');

        $this->datosModelo->aplicaren[] = array('valor' => 1, 'denominacion' => 'Período de vigencia');
        $this->datosModelo->aplicaren[] = array('valor' => 2, 'denominacion' => 'Fecha de aplicación');

        $this->datosModelo->tipovalor[] = array('valor' => 1, 'denominacion' => 'Tipo Nomenclador');
        $this->datosModelo->tipovalor[] = array('valor' => 2, 'denominacion' => 'Tipo Número');
        $this->datosModelo->tipovalor[] = array('valor' => 3, 'denominacion' => 'Tipo Texto');
        $this->datosModelo->tipovalor[] = array('valor' => 4, 'denominacion' => 'Tipo Fecha');
        $this->datosModelo->tipovalor[] = array('valor' => 5, 'denominacion' => 'Tipo Nomenclador Fijo');

        $this->datosModelo->nivelaplicarvalor[] = array('valor' => 1, 'denominacion' => 'Nivel Elemento');
        $this->datosModelo->nivelaplicarvalor[] = array('valor' => 2, 'denominacion' => 'Nivel Reporte');

        $this->datosModelo->comportamientoreporte[] = array('valor' => 1, 'denominacion' => 'Sin Comportamiento');
        $this->datosModelo->comportamientoreporte[] = array('valor' => 2, 'denominacion' => 'Reporte de Vacaciones');
        $this->datosModelo->comportamientoreporte[] = array('valor' => 3, 'denominacion' => 'Reporte de  Subsidios');
        $this->datosModelo->comportamientoreporte[] = array('valor' => 4, 'denominacion' => 'Reporte de Licencia de Maternidad');
        $this->datosModelo->comportamientoreporte[] = array('valor' => 5, 'denominacion' => 'Reporte de Pago a Destajo');


        $objNomRef = new NomNomencladorReferencia();
        $this->datosModelo->nomencladorreferencia = $objNomRef->obtenerListadoNomencladorReferenciaportipo(-1, 0, 1000);

        //Campos de las nominas para mostrarlos en el componente formula para la busqueda en historicos
        $arrtiposnominas = NomTipoNomina::obtenerListadoTodosTiposNomina();
        $objEstructuraNomina = new ConfigEstructurarModelosNomina();
        $arrInd = array();
        foreach ($arrtiposnominas as $tiponomina){
            $camposnomina = $objEstructuraNomina->obtenerEstructuraPorTipoNomina($tiponomina['idtiponomina']);
            foreach ($camposnomina as $cn){
                $arrInd[] = array(0=>'EMN'._.$cn['idestructuramodelodomina'], 1=>$cn['denominacion'], 2=>$tiponomina['denominaciontiponomina']);
            }
        }
        $this->datosModelo->indicadorestiposnominas = $arrInd;
    }

    public function confreportescertificacionesAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    public function cargardatosconfreportescertificacionesAction()
    {
        echo json_encode($this->datosModelo);
    }

    public function obtenerconfiguracionesreportescertificacionesAction()
    {
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');
        $variables = $this->_getParam('variables');
        $criterio = $this->_getParam('criterio');
        $objRC = new ConfReportesCertificaciones();
        if ($variables != 1) {
            $r = $objRC->obtenerListadoReportesCertificaciones($inicio, $limite, $criterio);
            
            foreach ($r as $i => $val) {
                $r[$i]['comportamiento'] = $val['deresultados'];
            }
            //print_r($r);die;
            $c = $objRC->obtenerCantidadReportesCertificaciones($criterio);
        } else {
            $r = $objRC->obtenerTodosTiposReportesCertificacionesConVariables($inicio, $limite,$criterio);
            $c = $objRC->obtenerCantidadTodosTiposReportesCertificacionesConVariables($criterio);
        }
        echo json_encode(array('datos' => $r, 'cantidad' => $c));

    }

    public function adicionarconfiguracionesreportescertificacionesAction()
    {

        $arregloDatos['denominacion'] = $this->_getParam('denominacion');
        $arregloDatos['deresultados'] = $this->_getParam('comportamiento');
        $arregloDatos['comportamientoreportesc4'] = $this->_getParam('comportamientoreporte');
        $arregloDatos['nivel'] = $this->_getParam('nivel');
        $arregloDatos['obligatorioprocesarlo'] = $this->_getParam('obligatorioprocesarlo');
        $arregloDatos['aprobacionelementos'] = $this->_getParam('aprobacionelementos');
        $arregloDatos['aplicaren'] = $this->_getParam('aplicaren');
        $arregloDatos['meses'] = $this->_getParam('meses');
        $arregloDatos['tiposeleccionpersonas'] = $this->_getParam('tiposeleccionpersonas');

        $objModel = new ConfReportesCertificacionesModel();
        $result = $objModel->adicionarConfReportesCertificaciones($arregloDatos);


        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($result) {
            $r->codigo = 'ADD-1';
            echo json_encode($r);

        } else {
            echo "{'codigo':'ADD-2','msg':'El tipo de reporte y certificación que intenta adicionar ya existe.'}";
        }

    }

    public function modificarconfiguracionesreportescertificacionesAction()
    {

        $id = $this->_getParam('idconfreportescertificaciones');
        $arregloDatos['denominacion'] = $this->_getParam('denominacion');
        $arregloDatos['deresultados'] = $this->_getParam('comportamiento');
        $arregloDatos['comportamientoreportesc4'] = $this->_getParam('comportamientoreporte');
        $arregloDatos['nivel'] = $this->_getParam('nivel');
        $arregloDatos['obligatorioprocesarlo'] = $this->_getParam('obligatorioprocesarlo');
        $arregloDatos['aprobacionelementos'] = $this->_getParam('aprobacionelementos');
        $arregloDatos['aplicaren'] = $this->_getParam('aplicaren');
        $arregloDatos['meses'] = $this->_getParam('meses');
        $arregloDatos['tiposeleccionpersonas'] = $this->_getParam('tiposeleccionpersonas');

        $objModel = new ConfReportesCertificacionesModel();
        $result = $objModel->modificarConfReportesCertificaciones($id, $arregloDatos);

        if ($result) {
            $r->codigo = 'MOD-1';
            echo json_encode($r);
        } else {
            echo "{'codigo':'MOD-2','msg':'El tipo de reporte y certificación ya existe.'}";
        }


    }

    public function eliminarconfiguracionesreportescertificacionesAction()
    {

        $id = $this->_getParam('idconfreportescertificaciones');

        $objModel = new ConfReportesCertificacionesModel();
        $bool = $objModel->eliminarConfReportesCertificaciones($id);

        if ($bool == 2) {
            echo "{'codigo':'DEL-2'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'DEL-1'}";
        }
        /*$r->codigo = 'DEL-1';
        echo json_encode($r);*/
    }

    public function obtenervariablesconfiguracionesreportescertificacionesAction()
    {
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');
        $objVRC = new ConfVariablesReportesCertificaciones();
        $r = $objVRC->obtenerListadoVariablesReportesCertificaciones($idconfreportescertificaciones, 0, 10000);
        $ioc = ZendExt_IoC_Inter::getInstance();
        foreach ($r as $v => $variable) {
            if (!empty($variable['calculable']) && !empty($variable['idexpresionmatematica'])) {
                $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($variable['idexpresionmatematica']));
                $r[$v]['textoexpresionmatematica'] = $rf[0]['expresionamostrar'];
            } else {
                $r[$v]['idexpresionmatematica'] =  -1;
                $r[$v]['textoexpresionmatematica'] =  '';
            }

            if (!empty($variable['calculablehistoriconominasreportes']) && !empty($variable['idexpresionmatematicahistoriconominasreportes'])) {
                $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($variable['idexpresionmatematicahistoriconominasreportes']));
                $r[$v]['textoexpresionmatematicahistoriconominasreportes'] = $rf[0]['expresionamostrar'];
            } else {
                $r[$v]['idexpresionmatematicahistoriconominasreportes'] =  -1;
                $r[$v]['textoexpresionmatematicahistoriconominasreportes'] =  '';
            }
            $denomvariable = ConfVariablesReportesCertificaciones::obtenerDenomVariablexIdVariable($r[$v]['idvariablesconfreportescertificacionesreportesanteriores']);
            $denomtiporeporte = ConfVariablesReportesCertificaciones::obtenerSoloDenomReporteXIdVarConfReportesCert($r[$v]['idvariablesconfreportescertificacionesreportesanteriores']);
            $r[$v]['denomvariablereporteanterior'] = ($r[$v]['idvariablesconfreportescertificacionesreportesanteriores'])
                                                     ?$denomvariable . ' - ' . $denomtiporeporte
                                                     :'';

            $denomvariablemesinicial = ConfVariablesReportesCertificaciones::obtenerDenomVariablexIdVariable($r[$v]['idvariablesconfreportescertiicacionesmesinicial']);
            $denomtiporeportemesinicial = ConfVariablesReportesCertificaciones::obtenerSoloDenomReporteXIdVarConfReportesCert($r[$v]['idvariablesconfreportescertiicacionesmesinicial']);
            $r[$v]['denomvariablemesinicial'] = ($r[$v]['idvariablesconfreportescertiicacionesmesinicial'])
                ?$denomvariablemesinicial . ' - ' . $denomtiporeportemesinicial
                :'';
        }
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function adicionarvariablesconfiguracionesreportescertificacionesAction()
    {

        $arregloDatos['denominacion'] = $this->_getParam('denominacion');
        $arregloDatos['tipovalor'] = $this->_getParam('tipovalor');
        $arregloDatos['idnomencladorreferencia'] = $this->_getParam('idnomencladorreferencia');
        $arregloDatos['nivelaplicarvalor'] = $this->_getParam('nivelaplicarvalor');
        $arregloDatos['idconfreportescertificaciones'] = $this->_getParam('idconfreportescertificaciones');
        $arregloDatos['lugaresdecimales'] = $this->_getParam('lugaresdecimales');
        $arregloDatos['min'] = $this->_getParam('min');
        $arregloDatos['max'] = $this->_getParam('max');
        $arregloDatos['orden'] = $this->_getParam('orden');
        $arregloDatos['calculable'] = $this->_getParam('calculable');
        $arregloDatos['idexpresionmatematica'] = $this->_getParam('idexpresionmatematica');
        $arregloDatos['descripcion'] = $this->_getParam('descripcion');
        $arregloDatos['meses'] = $this->_getParam('meses');
        $arregloDatos['calculablehistoriconominasreportes'] = $this->_getParam('calculablehistoriconominasreportes');
        $arregloDatos['idexpresionmatematicanominasreportes'] = $this->_getParam('idexpresionmatematicanominasreportes');
        $arregloDatos['idvariablesconfreportescertificacionesreportesanteriores'] = $this->_getParam('idvariablesconfreportescertificacionesreportesanteriores');
        $arregloDatos['idvariablesconfreportescertiicacionesmesinicial'] = $this->_getParam('idvariablesconfreportescertiicacionesmesinicial');
        $arregloDatos['tiposnomina'] = implode(',', Zend_Json::decode(stripslashes($this->_getParam('arraytiposnomina'))));
        $objModel = new ConfVariablesReportesCertificacionesModel();
        $result = $objModel->adicionarConfVariablesReportesCertificaciones($arregloDatos);


        if ($result) {
            $r->codigo = 'ADD-1';
            echo json_encode($r);
        } else {
            echo "{'codigo':'ADD-2','msg':'La variable de tipo de reporte y certificación que intenta adicionar ya existe.'}";
        }
    }

    public function modificarvariablesconfiguracionesreportescertificacionesAction()
    {
        $id = $this->_getParam('idvariablesconfreportescertificaciones');
        $arregloDatos['denominacion'] = $this->_getParam('denominacion');
        $arregloDatos['tipovalor'] = $this->_getParam('tipovalor');
        $arregloDatos['idnomencladorreferencia'] = $this->_getParam('idnomencladorreferencia');
        $arregloDatos['nivelaplicarvalor'] = $this->_getParam('nivelaplicarvalor');
        $arregloDatos['idconfreportescertificaciones'] = $this->_getParam('idconfreportescertificaciones');
        $arregloDatos['lugaresdecimales'] = $this->_getParam('lugaresdecimales');
        $arregloDatos['min'] = $this->_getParam('min');
        $arregloDatos['max'] = $this->_getParam('max');
        $arregloDatos['orden'] = $this->_getParam('orden');
        $arregloDatos['calculable'] = $this->_getParam('calculable');
        $arregloDatos['idexpresionmatematica'] = $this->_getParam('idexpresionmatematica');
        $arregloDatos['descripcion'] = $this->_getParam('descripcion');
        $arregloDatos['meses'] = $this->_getParam('meses');
        $arregloDatos['calculablehistoriconominasreportes'] = $this->_getParam('calculablehistoriconominasreportes');
        $arregloDatos['idexpresionmatematicanominasreportes'] = $this->_getParam('idexpresionmatematicanominasreportes');
        $arregloDatos['idvariablesconfreportescertificacionesreportesanteriores'] = $this->_getParam('idvariablesconfreportescertificacionesreportesanteriores');
        $arregloDatos['idvariablesconfreportescertiicacionesmesinicial'] = $this->_getParam('idvariablesconfreportescertiicacionesmesinicial');
        $arregloDatos['tiposnomina'] = implode(',', Zend_Json::decode(stripslashes($this->_getParam('arraytiposnomina'))));

        $objModel = new ConfVariablesReportesCertificacionesModel();
        $result = $objModel->modificarConfVariablesReportesCertificaciones($id, $arregloDatos);

        if ($result) {
            $r->codigo = 'MOD-1';
            echo json_encode($r);
        } else {
            echo "{'codigo':'MOD-2','msg':'La variable de tipo de reporte y certificación ya existe.'}";
        }
    }

    public function eliminarvariablesconfiguracionesreportescertificacionesAction()
    {
        $id = $this->_getParam('idvariablesconfreportescertificaciones');
        $objModel = new ConfVariablesReportesCertificacionesModel();
        $respuesta = $objModel->eliminarConfVariablesReportesCertificaciones($id);
        $r = new stdClass();
        $r->codigo = ($respuesta == 1) ? 'DEL-1' : (($respuesta == 2) ? 'ESTA-EN-USO' : 'ERROR');
        echo json_encode($r);
    }

    //Fórmulas
    public function obtenerIndicadoresFormulasAction()
    {
        $idconfreportescertificaciones = Zend_Json::decode(stripslashes($this->_getParam('idconfreportescertificaciones')));
        $arrVariablesReportes = ConfReportesCertificacionesModel::obtenerTodosTiposReportesCertificacionesConVariables();
        //Arreglo de los indicadores.
        foreach ($arrVariablesReportes as $k => $v) {
            if($idconfreportescertificaciones != $v['idconfreportescertificaciones']){
                $arrR[] = array(
                    //Id de la variable del reporte
                    'idindicador' => 'F_' . $v['idvariablesconfreportescertificaciones'],
                    //Denominacion de la variable del reporte
                    'indicador' => $v['denominacionvariable'],
                    //Denominacion de cada uno de los reportes por donde se van a a grupar las variables
                    'tipo' => $v['denominacion'],
                    //'orden' => $v['orden']
                );
            }
        }
       /* print_r($arrR);die;*/
        echo Zend_Json::encode(array('variables' => $arrR));
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
        $idvariablesconfreportescertificaciones = $this->_request->getPost('idvariablesconfreportescertificaciones');
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $objConfReportes = new ConfVariablesReportesCertificacionesModel();
        echo json_encode($objConfReportes->adicionarFormulas($idvariablesconfreportescertificaciones, $idexpresionmatematica));
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

    public function obtenerTiposNominasAction(){
        $arrtiposnominas = NomTipoNomina::obtenerListadoTodosTiposNomina();
        echo json_encode(array('datos'=>$arrtiposnominas, 'cantidad'=>count($arrtiposnominas)));
    }

    public function obtenerVariablesReportesAnterioresAction()
    {
        $r = ConfVariablesReportesCertificacionesModel::obtenerVariables();
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerVariablesMesInicialAction()
    {
        $r = ConfVariablesReportesCertificacionesModel::obtenerVariables();
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }
}
