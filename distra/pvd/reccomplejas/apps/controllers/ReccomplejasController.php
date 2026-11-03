<?php
//Include PHPExcel to import person data
include_once (Zend_Registry::get('config')->dir_aplication.'/pvd/comun/recursos/PHPExcel.php');
include_once (Zend_Registry::get('config')->dir_aplication.'/pvd/comun/recursos/PHPExcel/PHPExcel/IOFactory.php');

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

//include_once($dir_www . '/pvd/comun/bibliotecas/highchart/jquery-1.8.2/jquery-1.8.2.min.js');
//include_once($dir_www . '/pvd/comun/bibliotecas/highchart/js/highcharts.js');
//include_once($dir_www . '/pvd/comun/bibliotecas/highchart/js/modules/exporting.js');

class ReccomplejasController extends ZendExt_Controller_Secure
{

    private $direccionModulo;
    private $arrIndices;

    function init()
    {
        parent::init();
        $this->direccionModulo = Zend_Registry::getInstance()->config->modulo_path;
    }

    function reccomplejasAction()
    {
        $this->render();
    }

    function cargaInicialAction()
    {
        try {
            $idconfiguracion = $this->_request->getPost('idconfiguracion');

            $objRecModel = new RecuperacionesModel();
            $selectores = $this->direccionModulo .
                "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
            $arrSelectores = $objRecModel->getHojas(json_decode(file_get_contents($selectores)));
            $hiddenFields = json_decode(
                file_get_contents(
                    $this->direccionModulo .
                    "comun/recursos/config_reccomplejas/config_{$idconfiguracion}/json/hiddenFields.json"
                )
            );
            $pKeys = json_decode(
                file_get_contents(
                    $this->direccionModulo . "comun/recursos/config_reccomplejas/config_{$idconfiguracion}/json/pkeys.json"
                )
            );

            $this->loadCompartimentacion($idconfiguracion);

            //Combina los elementos ocultos con los elemenos a mostrar para generar la consulta
            $arrSelectores = array_merge($arrSelectores, $hiddenFields);


            $columnas = array(); //Column Model
            $indices = array(); //Indices para el Store
            $hiddenIndex = array(); //Almacena los indices de los campos ocultos
            $filtros = array();
            $expander = array();
            $groupField = null;

            //Adiciona a los indices las llaves primarias de la tabla base
            foreach ($pKeys as $i => $pkey) {
                $hiddenIndex[] = array('name' => utf8_decode('pkey' . $i));
            }

            //Leo los indices que puedan llegar desde la compartimentacion
            foreach ($this->arrIndices as $indice) {
                $hiddenIndex[] = array('name' => utf8_decode($indice));
            }

            foreach ($arrSelectores as $campo) {

                if ($campo->usarcondicion == 1 && $campo->representartbar == 1) {
                    //Crea los filtros basicos
                    $filtro = null;
                    $filtro->fieldLabel = $campo->text;
                    $filtro->idcampo = utf8_decode($campo->idcampo);
                    $filtro->campo = utf8_decode($campo->campo);
                    $filtro->esquema = utf8_decode($campo->esquema);
                    $filtro->tabla = utf8_decode($campo->tabla);
                    $filtro->tipo = utf8_decode($campo->tipodato);
                    $filtro->condicion = utf8_decode($campo->condicionpordefecto);
                    $filtros[] = $filtro;
                }

                if ($campo->obligatorio == 1 || $campo->expander == 1) {
                    $aliasCampo = empty($campo->alias) ? '_' . $campo->idcampo : $campo->alias;
//                if ($campo->groupfield == 1) {
//                    $result->groupField = $name;
//                }
                    if ($campo->expander) {
                        $expander[] = array(
                            'header' => $campo->text,
                            'text' => '{' . $aliasCampo . '}'
                        );
                    } else {
                        if ($campo->oculto) {
                            $hiddenIndex[] = array('name' => $aliasCampo);
                            continue;
                        } else {
                            //Crea las columnas
                            $column = null;

                            if ($campo->agruparcampo == 1) {
                                $result->groupField = $aliasCampo;
                                $column->hidden = true;
                            }
                            $column->dataIndex = $aliasCampo;
                            $column->sortable = true;
                            $column->header = $campo->text;
                            if (!empty($campo->renderer)) {
                                $column->renderer = 'self.parent.renderers.' . $campo->renderer;
                            }
                            $column->width = (int)$campo->anchocolumna;
                            $column->tooltip = $campo->qtip;
                            $columnas[] = $column;
                        }
                    }
                    $indices[] = array('name' => $aliasCampo);
                }
            }
            if ($expander[0]) {
                $result->expander = $expander;
            }
            $result->columnas = $columnas;
            $result->indices = $indices;
            $result->hiddenIndex = $hiddenIndex;
            $result->filtros = $filtros;


            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode($e->getMessage());
        }
    }

    function getColumnasBusquedaAction()
    {
        $idbusqueda = $this->_request->getPost('idbusqueda');
        $objDatBusqueda = new DatBusqueda();
        $objDatBusqueda = $objDatBusqueda->getDatBusqueda($idbusqueda);
        $result->idconfiguracion = $objDatBusqueda->idconfiguracion;

        $selectores = $this->direccionModulo . 'comun/recursos/config_reccomplejas/config_' . $result->idconfiguracion
            . '/json/selectores.json';
        $selectores = json_decode(file_get_contents($selectores));
        $objDatSelectores = new DatSelectores();
        $arrSelectores = $objDatSelectores->getSelectores($idbusqueda);

        $objXML = new ReadXmlRec($result->idconfiguracion);
        $this->arrTablaBase = $objXML->getXML('tablabase.xml');

        $cm = array(); //Column Model
        $indices = array();
        $indices[] = array('name' => utf8_decode('_idtablabase'));
        $i = 0;
        $j = 0;
        foreach ($arrSelectores as $datoSelector) {
            foreach ($selectores as $carpeta) {
                foreach ($carpeta->children as $campo) {
                    if ($campo->idmostrar == $datoSelector['idmostrar']
                        && $campo->idmetadato == $datoSelector['idmetadato']
                    ) {
                        $cm[] = array('id' => ++$i, 'dataIndex' => utf8_decode('_' . $campo->idmostrar),
                            'sortable' => true, 'header' => $campo->text,
                            'width' => (int)utf8_decode($campo->anchocolumna), 'tooltip' => $campo->qtip);
                        $indices[] = array('name' => utf8_decode('_' . $campo->idmostrar));
                    }
                }
            }
            ++$j;
        }
        $result->columnas = $cm;
        $result->indices = $indices;
        echo json_encode($result);
    }

    function obtenerReporteInicialAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $condiciones = json_decode($this->_request->getPost('condiciones'));
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');

        $objRecModel = new RecuperacionesModel();
        $result = $objRecModel->obtenerReporteInicial($idconfiguracion, $condiciones, array(), $limit, $start);
        echo json_encode($result);
    }

    function cargarInterfazReporteAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $idbusqueda = $this->_request->getPost('idbusqueda');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');

        $objRecuperacionesModel = new RecuperacionesModel();
        $sqlBusqueda = $objRecuperacionesModel->getSqlBusqueda($idconfiguracion, $idbusqueda);
        $datosBusqueda->datos = $objRecuperacionesModel->getDatos($sqlBusqueda->sql, $sqlBusqueda->params);
        echo json_encode($datosBusqueda);
    }

    function cargarselectoresAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');

        $objModel = new RecuperacionesModel();
        $tree = $objModel->getTreeFields($idconfiguracion, $this->global->Perfil->idusuario);
        if ($tree) {
            echo $tree;
        } else {
            echo array();
        }
    }

    function getCamposGeoespacialesAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $objXML = new ReadXmlRec($idconfiguracion);
        $camposGeoespaciales = $objXML->getXML('campos_geoespaciales.xml');
        $result = array();
        foreach ($camposGeoespaciales as $campo) {
            $arrAux->idcampogeoespacial = (Integer)$campo['idcampogeoespacial'];
            $arrAux->denominacion = (String)$campo['denominacion'];
            $arrAux->descripcion = (String)$campo['descripcion'];
            $result[] = $arrAux;
        }
        echo json_encode($result);
    }

    function cargarValoresNomencladorAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $idcampo = $this->_request->getPost('idcampo');
        $tipo = $this->_request->getPost('tipo');
        $result = RecuperacionesModel::cargarNomenclador($idconfiguracion, $idcampo, $tipo);
        $result = array('cantidad' => count($result), 'datos' => $result);
        echo json_encode($result);
    }

    function cargarValoresArbolAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $idcampo = $this->_request->getPost('idcampo');
        $node = $this->_request->getPost('node');

        $objModel = new RecuperacionesModel();
        $result = $objModel->cargarArbol($idconfiguracion, $idcampo, $node);
        echo json_encode($result);
    }

    function obtenerReporteAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $campos = json_decode(stripslashes($this->_request->getPost('campos')));
        $condiciones = json_decode(stripslashes($this->_request->getPost('condiciones')));
        $operacion = json_decode(stripslashes($this->_request->getPost('operacion')));
        $orderby = json_decode(stripslashes($this->_request->getPost('orderby')));
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $extraParams['idusuario'] = $this->global->Perfil->idusuario;
        set_time_limit(36000);
        ini_set('memory_limit', '2048M');

        $objRecuperacionesModel = new RecuperacionesModel();
        $result = $objRecuperacionesModel->obtenerReporteCompleto($idconfiguracion,$campos,$condiciones,$operacion,$orderby,$limit,$start,$extraParams);

        echo json_encode($result);
    }

    public function obtenerReporteGeoespacialAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $idcampogeoespacial = $this->_request->getPost('idcampogeoespacial');
        $condiciones = json_decode(stripslashes($this->_request->getPost('condiciones')));

        $objXML = new ReadXmlRec($idconfiguracion);
        $camposGeoespaciales = $objXML->getXML('campos_geoespaciales.xml');
        foreach ($camposGeoespaciales as $campoGeoespacial) {
            if ($campoGeoespacial['idcampogeoespacial'] == $idcampogeoespacial) {
                foreach ($campoGeoespacial->campo as $campo) {
                    $aux = array();
                    $aux[2] = (Integer)$campo['idmostrar'];
                    $aux[3] = (Integer)$campo['idmetadato'];
                    $camposMostrar[] = $aux;
                }
                break;
            }
        }

        //Generar el sql
        $objRecuperacionesModel = new RecuperacionesModel();
        $objRecuperacionesModel->generaSQLs($idconfiguracion, $camposMostrar, $condiciones, null, null, null, null);
        $result = $objRecuperacionesModel->ejecutarSQL();
        echo json_encode($result);
    }

    public function getSqlReporteAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $campos = json_decode(stripslashes($this->_request->getPost('campos')));
        $condiciones = json_decode(stripslashes($this->_request->getPost('condiciones')));
        $operacion = json_decode(stripslashes($this->_request->getPost('operacion')));
        $orderby = json_decode(stripslashes($this->_request->getPost('orderby')));

        //Generar el sql
        $objRecuperacionesModel = new RecuperacionesModel();
        $objRecuperacionesModel->generaSQLs(
            $idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start
        );
        $objSQL = $objRecuperacionesModel->getSQLRipeado();

        echo json_encode($objSQL);
    }

    //Funcion que genera un reporte en pdf a partir de los datos que recibe de la vista
    function getRTFAction()
    {
        $objRecuperacionesModel = new RecuperacionesModel();
        $idconfiguracion = $this->_request->getParam('idconfiguracion');

        $title = $this->_request->getParam('title');
        $reporte = $this->_request->getParam('reporte');
        $visualizacion = $this->_request->getParam('visualizacion');


        $limit = $this->_request->getParam('limit');
        $start = $this->_request->getParam('start');
        $strColumn = $this->_request->getParam('strColumn');

        if($reporte=='Pdf' && $visualizacion =='Plantillas'){

            $campos = json_decode($this->_request->getParam('campos'));
            $condiciones = json_decode($this->_request->getParam('condiciones'));
            $operacion = json_decode($this->_request->getParam('operacion'));
            $orderby = json_decode($this->_request->getParam('orderby'));

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;

            $camposexportar = array();
            if($operacion!=null){
                $result = $objRecuperacionesModel->obtenerReporteCompleto($idconfiguracion, $campos, $condiciones,  $operacion,$orderby, $limit, $start,$extraParams);
                if(count($operacion)==1 || count($operacion)==0){
                    $operacion[0]->alias = $operacion[0]->campo;
                    $operacion[0]->text = $operacion[0]->campo;
                    $operacion[0]->denominacion = $operacion[0]->campo;

                    $operacion[1]->idconfiguracion = $idconfiguracion;
                    $operacion[1]->text =  'Cantidad';
                    $operacion[1]->campo =  'Cantidad';
                    $operacion[1]->alias =  'Cantidad';
                    $operacion[1]->denominacion =  'Cantidad';

                    $objReporte = new ReporteModel('Cantidades entrecruzadas de valores', $operacion, $result->datos);
                }
                else{
                    $camposexportar[0]->idconfiguracion = $idconfiguracion;
                    $camposexportar[0]->text =  $operacion[0]->campo;
                    $camposexportar[0]->campo =  $operacion[0]->campo;
                    $camposexportar[0]->alias =  $operacion[0]->campo;
                    $camposexportar[0]->denominacion =  $operacion[0]->campo;

                    $camposnuevos = $objRecuperacionesModel->obtenerValorCampo($operacion[1]->tabla,$operacion[1]->esquema,$operacion[1]->campo);
                    $contador = 1;
                    for($i = 0;$i<count($camposnuevos);$i++){
                        $camposexportar[$contador]->idconfiguracion = $idconfiguracion;
                        $camposexportar[$contador]->text =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->campo =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->alias =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->denominacion =  $camposnuevos[$i]['denominacion'];
                        $contador++;
                    }

                    $objReporte = new ReporteModel('Cantidades entrecruzadas de valores', $camposexportar, $result->datos);
                }

            }
            else{
                if(empty($campos)) {
                    $selectores = $this->direccionModulo .
                        "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                    $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                    foreach($arrSelectores as $selector){
                        if($selector->obligatorio == '1' && $selector->oculto == '0') {
                            $campos[] = $selector;
                        }
                    }
                }

                $result = $objRecuperacionesModel->obtenerReporteCompleto(
                    $idconfiguracion, $campos, $condiciones, $operacion, $orderby, $limit, $start, $extraParams
                );

                $objReporte = new ReporteModel($title, $campos, $result->datos);
            }

            $objReporte->export();
        }
        if($reporte=='Pdf' && $visualizacion =='General'){
            $campos = json_decode($this->_request->getParam('campos'));
            $condiciones = json_decode($this->_request->getParam('condiciones'));
            $operacion = json_decode($this->_request->getParam('operacion'));
            $orderby = json_decode($this->_request->getParam('orderby'));

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;

            $camposexportar = array();
            if($operacion!=null){
                $result = $objRecuperacionesModel->obtenerReporteCompleto($idconfiguracion, $campos, $condiciones, $operacion,$orderby, $limit, $start,$extraParams);
                if(count($operacion)==1 || count($operacion)==0){
                    $operacion[0]->alias = $operacion[0]->campo;
                    $operacion[0]->text = $operacion[0]->campo;
                    $operacion[0]->denominacion = $operacion[0]->campo;

                    $operacion[1]->idconfiguracion = $idconfiguracion;
                    $operacion[1]->text =  'Cantidad';
                    $operacion[1]->campo =  'Cantidad';
                    $operacion[1]->alias =  'Cantidad';
                    $operacion[1]->denominacion =  'Cantidad';

                    $objReporte = new ReporteModel('Cantidades entrecruzadas de valores', $operacion, $result->datos);
                }
                else{
                    $camposexportar[0]->idconfiguracion = $idconfiguracion;
                    $camposexportar[0]->text =  $operacion[0]->campo;
                    $camposexportar[0]->campo =  $operacion[0]->campo;
                    $camposexportar[0]->alias =  $operacion[0]->campo;
                    $camposexportar[0]->denominacion =  $operacion[0]->campo;

                    $camposnuevos = $objRecuperacionesModel->obtenerValorCampo($operacion[1]->tabla,$operacion[1]->esquema,$operacion[1]->campo);
                    $contador = 1;
                    for($i = 0;$i<count($camposnuevos);$i++){
                        $camposexportar[$contador]->idconfiguracion = $idconfiguracion;
                        $camposexportar[$contador]->text =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->campo =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->alias =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->denominacion =  $camposnuevos[$i]['denominacion'];
                        $contador++;
                    }
                    $objReporte = new ReporteModel('Cantidades entrecruzadas de valores', $camposexportar, $result->datos);
                }

            }else{

                if(empty($campos)) {
                    $selectores = $this->direccionModulo .
                        "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                    $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                    foreach($arrSelectores as $selector){
                        if($selector->obligatorio == '1' && $selector->oculto == '0') {
                            $campos[] = $selector;
                        }
                    }
                }
                $objRecuperacionesModel->generaSQLsExportar($idconfiguracion, $campos, $condiciones, $orderby, $operacion);

                $result = $objRecuperacionesModel->ejecutarSQL();

                $objReporte = new ReporteModel($title, $campos, $result->datos);
            }

            $objReporte->export();
        }
        if($reporte=='Pdf' && $visualizacion =='Seleccionado'){
            $campos = json_decode($this->_request->getParam('campos'));


            $extraParams['idusuario'] = $this->global->Perfil->idusuario;
            $seleccionados = json_decode($this->_request->getParam('seleccionados'));

                if(empty($campos)) {
                    $selectores = $this->direccionModulo .
                        "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                    $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                    foreach($arrSelectores as $selector){
                        if($selector->obligatorio == '1' && $selector->oculto == '0') {
                            $campos[] = $selector;
                        }
                    }
                }
            if(count($seleccionados)>0){
                for($i = 0;$i<count($seleccionados);$i++){
                    $result->datos[$i] = $seleccionados[$i];
                }
            }

            foreach($result->datos as $k=>$r){
                $result->datos[$k]->numero = $r->numid;
            }

            foreach ($result->datos as $k=>$value) {
                foreach($value as $p=>$v){
                    $arraytemp[$p] = $v;
                }
                $result->datos[$k] = $arraytemp;
            }

            $objReporte = new ReporteModel($title, $campos, $result->datos);

            $objReporte->export();
        }

        if($reporte=='Excel' && $visualizacion =='Plantillas'){

            $campos = json_decode($this->_request->getParam('campos'));
            $condiciones = json_decode($this->_request->getParam('condiciones'));
            $operacion = json_decode($this->_request->getParam('operacion'));
            $orderby = json_decode($this->_request->getParam('orderby'));

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;

            $objPHPExcel = new PHPExcel();
            $camposexportar = array();
            if($operacion!=null){
                $result = $objRecuperacionesModel->obtenerReporteCompleto($idconfiguracion, $campos, $condiciones, $operacion,$orderby, $limit, $start,$extraParams);
                if(count($operacion)==1 || count($operacion)==0){
                    $operacion[0]->alias = $operacion[0]->campo;
                    $operacion[0]->text = $operacion[0]->campo;
                    $operacion[0]->denominacion = $operacion[0]->campo;

                    $operacion[1]->idconfiguracion = $idconfiguracion;
                    $operacion[1]->text =  'Cantidad';
                    $operacion[1]->campo =  'Cantidad';
                    $operacion[1]->alias =  'Cantidad';
                    $operacion[1]->denominacion =  'Cantidad';


                    $objRecuperacionesModel->fnPintarEncabezado($objPHPExcel,$operacion);
                    $objRecuperacionesModel->fnPintarCuerpo($objPHPExcel,$result,$operacion);
                    $objPHPExcel->setActiveSheetIndex(0);
                    ob_end_clean();
                    //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));

                    header('Content-Type: application/vnd.ms-excel');
                    header('Content-Disposition: attachment;filename="Persona.xls" ');
                    header('Pragma: no-cache');
                    header('Expires: 0');

                    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                    ob_end_clean();
                    echo($objWriter->save('php://output'));

                    $objPHPExcel->disconnectWorksheets();
                    unset($objPHPExcel);
                }
                else{
                    $camposexportar[0]->idconfiguracion = $idconfiguracion;
                    $camposexportar[0]->text =  $operacion[0]->campo;
                    $camposexportar[0]->campo =  $operacion[0]->campo;
                    $camposexportar[0]->alias =  $operacion[0]->campo;
                    $camposexportar[0]->denominacion =  $operacion[0]->campo;

                    $camposnuevos = $objRecuperacionesModel->obtenerValorCampo($operacion[1]->tabla,$operacion[1]->esquema,$operacion[1]->campo);
                    $contador = 1;
                    for($i = 0;$i<count($camposnuevos);$i++){
                        $camposexportar[$contador]->idconfiguracion = $idconfiguracion;
                        $camposexportar[$contador]->text =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->campo =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->alias =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->denominacion =  $camposnuevos[$i]['denominacion'];
                        $contador++;
                    }
                    $objRecuperacionesModel->fnPintarEncabezado($objPHPExcel,$camposexportar);
                    $objRecuperacionesModel->fnPintarCuerpo($objPHPExcel,$result,$camposexportar);
                    $objPHPExcel->setActiveSheetIndex(0);
                    ob_end_clean();
                    //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
                    header('Content-Type: application/vnd.ms-excel');
                    header('Content-Disposition: attachment;filename="Persona.xls" ');
                    header('Pragma: no-cache');
                    header('Expires: 0');

                    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                    ob_end_clean();
                    echo($objWriter->save('php://output'));

                    $objPHPExcel->disconnectWorksheets();
                    unset($objPHPExcel);

                }

            }
            else{
                if(empty($campos)) {
                    $selectores = $this->direccionModulo .
                        "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                    $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                    foreach($arrSelectores as $selector){
                        if($selector->obligatorio == '1' && $selector->oculto == '0') {
                            $campos[] = $selector;
                        }
                    }
                }
                $objRecuperacionesModel->generaSQLs($idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start);
                $result = $objRecuperacionesModel->ejecutarSQL();

                $objRecuperacionesModel->fnPintarEncabezado($objPHPExcel,$campos);
                $objRecuperacionesModel->fnPintarCuerpo($objPHPExcel,$result,$campos);
                $objPHPExcel->setActiveSheetIndex(0);
                ob_end_clean();
                //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
                header('Content-Type: application/vnd.ms-excel');
                header('Content-Disposition: attachment;filename="Persona.xls" ');
                header('Pragma: no-cache');
                header('Expires: 0');

                $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                ob_end_clean();
                echo($objWriter->save('php://output'));

                $objPHPExcel->disconnectWorksheets();
                unset($objPHPExcel);
            }


        }
        if($reporte=='Excel' && $visualizacion =='General'){

            $campos = json_decode($this->_request->getParam('campos'));
            $condiciones = json_decode($this->_request->getParam('condiciones'));
            $operacion = json_decode($this->_request->getParam('operacion'));
            $orderby = json_decode($this->_request->getParam('orderby'));

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;
            $objPHPExcel = new PHPExcel();

            $camposexportar = array();
            if($operacion!=null){
                $result = $objRecuperacionesModel->obtenerReporteCompleto($idconfiguracion, $campos, $condiciones, $operacion,$orderby, $limit, $start,$extraParams);
                if(count($operacion)==1 || count($operacion)==0){
                    $operacion[0]->alias = $operacion[0]->campo;
                    $operacion[0]->text = $operacion[0]->campo;
                    $operacion[0]->denominacion = $operacion[0]->campo;

                    $operacion[1]->idconfiguracion = $idconfiguracion;
                    $operacion[1]->text =  'Cantidad';
                    $operacion[1]->campo =  'Cantidad';
                    $operacion[1]->alias =  'Cantidad';
                    $operacion[1]->denominacion =  'Cantidad';


                    $objRecuperacionesModel->fnPintarEncabezado($objPHPExcel,$operacion);
                    $objRecuperacionesModel->fnPintarCuerpo($objPHPExcel,$result,$operacion);
                    $objPHPExcel->setActiveSheetIndex(0);
                    ob_end_clean();
                    //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
                    header('Content-Type: application/vnd.ms-excel');
                    header('Content-Disposition: attachment;filename="Persona.xls" ');
                    header('Pragma: no-cache');
                    header('Expires: 0');

                    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                    ob_end_clean();
                    echo($objWriter->save('php://output'));

                    $objPHPExcel->disconnectWorksheets();
                    unset($objPHPExcel);
                }
                else{
                    $camposexportar[0]->idconfiguracion = $idconfiguracion;
                    $camposexportar[0]->text =  $operacion[0]->campo;
                    $camposexportar[0]->campo =  $operacion[0]->campo;
                    $camposexportar[0]->alias =  $operacion[0]->campo;
                    $camposexportar[0]->denominacion =  $operacion[0]->campo;

                    $camposnuevos = $objRecuperacionesModel->obtenerValorCampo($operacion[1]->tabla,$operacion[1]->esquema,$operacion[1]->campo);
                    $contador = 1;
                    for($i = 0;$i<count($camposnuevos);$i++){
                        $camposexportar[$contador]->idconfiguracion = $idconfiguracion;
                        $camposexportar[$contador]->text =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->campo =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->alias =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->denominacion =  $camposnuevos[$i]['denominacion'];
                        $contador++;
                    }
                    $objRecuperacionesModel->fnPintarEncabezado($objPHPExcel,$camposexportar);
                    $objRecuperacionesModel->fnPintarCuerpo($objPHPExcel,$result,$camposexportar);
                    $objPHPExcel->setActiveSheetIndex(0);
                    ob_end_clean();
                    //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
                    header('Content-Type: application/vnd.ms-excel');
                    header('Content-Disposition: attachment;filename="Persona.xls" ');
                    header('Pragma: no-cache');
                    header('Expires: 0');

                    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                    ob_end_clean();
                    echo($objWriter->save('php://output'));

                    $objPHPExcel->disconnectWorksheets();
                    unset($objPHPExcel);

                }

            }else{
                if(empty($campos)) {
                    $selectores = $this->direccionModulo .
                        "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                    $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                    foreach($arrSelectores as $selector){
                        if($selector->obligatorio == '1' && $selector->oculto == '0') {
                            $campos[] = $selector;
                        }
                    }
                }

                $objRecuperacionesModel->generaSQLsExportar($idconfiguracion, $campos, $condiciones, $orderby, $operacion);
                $result = $objRecuperacionesModel->ejecutarSQL();

                $objRecuperacionesModel->fnPintarEncabezado($objPHPExcel,$campos);
                $objRecuperacionesModel->fnPintarCuerpo($objPHPExcel,$result,$campos);
                $objPHPExcel->setActiveSheetIndex(0);
                ob_end_clean();
                header('Content-Type: application/vnd.ms-excel');
                header('Content-Disposition: attachment;filename="Persona.xls" ');
                header('Pragma: no-cache');
                header('Expires: 0');

                $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                ob_end_clean();
                echo($objWriter->save('php://output'));

                $objPHPExcel->disconnectWorksheets();
                unset($objPHPExcel);
            }


        }
        if($reporte=='Excel' && $visualizacion =='Seleccionado'){

            $campos = json_decode($this->_request->getParam('campos'));
            $condiciones = json_decode($this->_request->getParam('condiciones'));
            $operacion = json_decode($this->_request->getParam('operacion'));
            $orderby = json_decode($this->_request->getParam('orderby'));

            $seleccionados = json_decode($this->_request->getParam('seleccionados'));

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;
            $objPHPExcel = new PHPExcel();

            $camposexportar = array();

                if(empty($campos)) {
                    $selectores = $this->direccionModulo .
                        "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                    $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                    foreach($arrSelectores as $selector){
                        if($selector->obligatorio == '1' && $selector->oculto == '0') {
                            $campos[] = $selector;
                        }
                    }
                }
            if(count($seleccionados)>0){
                for($i = 0;$i<count($seleccionados);$i++){
                    $result->datos[$i] = $seleccionados[$i];
                }
            }

            foreach($result->datos as $k=>$r){
                $result->datos[$k]->numero = $r->numid;
            }

            foreach ($result->datos as $k=>$value) {
                foreach($value as $p=>$v){
                    $arraytemp[$p] = $v;
                }
                $result->datos[$k] = $arraytemp;
            }

            $objRecuperacionesModel->fnPintarEncabezado($objPHPExcel,$campos);
                $objRecuperacionesModel->fnPintarCuerpo($objPHPExcel,$result,$campos);
                $objPHPExcel->setActiveSheetIndex(0);
                ob_end_clean();
                header('Content-Type: application/vnd.ms-excel');
                header('Content-Disposition: attachment;filename="Persona.xls" ');
                header('Pragma: no-cache');
                header('Expires: 0');

                $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
                ob_end_clean();
                echo($objWriter->save('php://output'));

                $objPHPExcel->disconnectWorksheets();
                unset($objPHPExcel);



        }
       echo json_encode($result);
    }
    /***************************Reporte word*************************************/
    function getWordAction()
    {
        $objRecuperacionesModel = new RecuperacionesModel();
        $idconfiguracion = $this->_request->getParam('idconfiguracion');

        $title = $this->_request->getParam('title');
        $reporte = $this->_request->getParam('reporte');
        $visualizacion = $this->_request->getParam('visualizacion');


        $limit = $this->_request->getParam('limit');
        $start = $this->_request->getParam('start');
        $strColumn = $this->_request->getParam('strColumn');

        $seleccionados = json_decode($this->_request->getParam('seleccionados'));


        if($visualizacion =='Plantillas'){

            $campos = json_decode($this->_request->getParam('campos'));
            $condiciones = json_decode($this->_request->getParam('condiciones'));
            $operacion = json_decode($this->_request->getParam('operacion'));
            $orderby = json_decode($this->_request->getParam('orderby'));

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;

            $camposexportar = array();
            if($operacion!=null){
                $result = $objRecuperacionesModel->obtenerReporteCompleto($idconfiguracion, $campos, $condiciones, $operacion,$orderby, $limit, $start,$extraParams);
                if(count($operacion)==1 || count($operacion)==0){
                    $operacion[0]->alias = $operacion[0]->campo;
                    $operacion[0]->text = $operacion[0]->campo;
                    $operacion[0]->denominacion = $operacion[0]->campo;

                    $operacion[1]->idconfiguracion = $idconfiguracion;
                    $operacion[1]->text =  'Cantidad';
                    $operacion[1]->campo =  'Cantidad';
                    $operacion[1]->alias =  'Cantidad';
                    $operacion[1]->denominacion =  'Cantidad';

                    $result->titulo = 'Cantidades entrecruzadas de valores';
                    $result->campos = $operacion;
                    $objPerfil = new ReporteWord($result);
                    $objPerfil->salvarPerfil();
                    $r = new StdClass();
                    $r->url = "/reccomplejas/ReporteWord.rtf";
                }
                else{
                    $camposexportar[0]->idconfiguracion = $idconfiguracion;
                    $camposexportar[0]->text =  $operacion[0]->campo;
                    $camposexportar[0]->campo =  $operacion[0]->campo;
                    $camposexportar[0]->alias =  $operacion[0]->campo;
                    $camposexportar[0]->denominacion =  $operacion[0]->campo;

                    $camposnuevos = $objRecuperacionesModel->obtenerValorCampo($operacion[1]->tabla,$operacion[1]->esquema,$operacion[1]->campo);
                    $contador = 1;
                    for($i = 0;$i<count($camposnuevos);$i++){
                        $camposexportar[$contador]->idconfiguracion = $idconfiguracion;
                        $camposexportar[$contador]->text =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->campo =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->alias =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->denominacion =  $camposnuevos[$i]['denominacion'];
                        $contador++;
                    }

                    $result->titulo = 'Cantidades entrecruzadas de valores';
                    $result->campos = $camposexportar;
                    $objPerfil = new ReporteWord($result);
                    $objPerfil->salvarPerfil();
                    $r = new StdClass();
                    $r->url = "/reccomplejas/ReporteWord.rtf";

                }

            }
            else{
                if(empty($campos)) {
                    $selectores = $this->direccionModulo .
                        "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                    $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                    foreach($arrSelectores as $selector){
                        if($selector->obligatorio == '1' && $selector->oculto == '0') {
                            $campos[] = $selector;
                        }
                    }
                }
                $objRecuperacionesModel->generaSQLs($idconfiguracion, $campos, $condiciones, $orderby, $operacion, $limit, $start);

                $result = $objRecuperacionesModel->ejecutarSQL();

                foreach($result->datos as $k=>$r){
                    $result->datos[$k]['numero'] = $r['numid'];
                }

                $result->campos = $campos;
                $result->titulo = 'LISTADO DE PERSONAS';

                $objPerfil = new ReporteWord($result);
                $objPerfil->salvarPerfil();
                $r = new StdClass();
                $r->url = "/reccomplejas/ReporteWord.rtf";

            }

        }
        if($visualizacion =='General'){
            $campos = json_decode($this->_request->getParam('campos'));
            $condiciones = json_decode($this->_request->getParam('condiciones'));
            $operacion = json_decode($this->_request->getParam('operacion'));
            $orderby = json_decode($this->_request->getParam('orderby'));

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;

            $camposexportar = array();
            if($operacion!=null){
                $result = $objRecuperacionesModel->obtenerReporteCompleto($idconfiguracion, $campos, $condiciones, $operacion,$orderby, $limit, $start,$extraParams);
                if(count($operacion)==1 || count($operacion)==0){
                    $operacion[0]->alias = $operacion[0]->campo;
                    $operacion[0]->text = $operacion[0]->campo;
                    $operacion[0]->denominacion = $operacion[0]->campo;

                    $operacion[1]->idconfiguracion = $idconfiguracion;
                    $operacion[1]->text =  'Cantidad';
                    $operacion[1]->campo =  'Cantidad';
                    $operacion[1]->alias =  'Cantidad';
                    $operacion[1]->denominacion =  'Cantidad';

                    $result->titulo = 'Cantidades entrecruzadas de valores';
                    $result->campos = $operacion;
                    $objPerfil = new ReporteWord($result);
                    $objPerfil->salvarPerfil();
                    $r = new StdClass();
                    $r->url = "/reccomplejas/ReporteWord.rtf";

                }
                else{
                    $camposexportar[0]->idconfiguracion = $idconfiguracion;
                    $camposexportar[0]->text =  $operacion[0]->campo;
                    $camposexportar[0]->campo =  $operacion[0]->campo;
                    $camposexportar[0]->alias =  $operacion[0]->campo;
                    $camposexportar[0]->denominacion =  $operacion[0]->campo;

                    $camposnuevos = $objRecuperacionesModel->obtenerValorCampo($operacion[1]->tabla,$operacion[1]->esquema,$operacion[1]->campo);
                    $contador = 1;
                    for($i = 0;$i<count($camposnuevos);$i++){
                        $camposexportar[$contador]->idconfiguracion = $idconfiguracion;
                        $camposexportar[$contador]->text =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->campo =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->alias =  $camposnuevos[$i]['denominacion'];
                        $camposexportar[$contador]->denominacion =  $camposnuevos[$i]['denominacion'];
                        $contador++;
                    }

                    $result->titulo = 'Cantidades entrecruzadas de valores';
                    $result->campos = $camposexportar;
                    $objPerfil = new ReporteWord($result);
                    $objPerfil->salvarPerfil();
                    $r = new StdClass();
                    $r->url = "/reccomplejas/ReporteWord.rtf";
                }

            }else{

                if(empty($campos)) {
                    $selectores = $this->direccionModulo .
                        "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                    $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                    foreach($arrSelectores as $selector){
                        if($selector->obligatorio == '1' && $selector->oculto == '0') {
                            $campos[] = $selector;
                        }
                    }
                }
                $objRecuperacionesModel->generaSQLsExportar($idconfiguracion, $campos, $condiciones, $orderby, $operacion);

                $result = $objRecuperacionesModel->ejecutarSQL();

                foreach($result->datos as $k=>$r){
                    $result->datos[$k]['numero'] = $r['numid'];
                }

                $result->campos = $campos;
                $result->titulo = 'LISTADO DE PERSONAS';

                $objPerfil = new ReporteWord($result);
                $objPerfil->salvarPerfil();
                $r = new StdClass();
                $r->url = "/reccomplejas/ReporteWord.rtf";
            }


        }
        if($visualizacion == 'Seleccionado'){

            $campos = json_decode($this->_request->getParam('campos'));
            $condiciones = json_decode($this->_request->getParam('condiciones'));
            $operacion = json_decode($this->_request->getParam('operacion'));
            $orderby = json_decode($this->_request->getParam('orderby'));

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;

            if(empty($campos)) {
                $selectores = $this->direccionModulo .
                    "comun/recursos/config_reccomplejas/config_$idconfiguracion/json/campos.json";
                $arrSelectores = $objRecuperacionesModel->getHojas(json_decode(file_get_contents($selectores)));
                foreach($arrSelectores as $selector){
                    if($selector->obligatorio == '1' && $selector->oculto == '0') {
                        $campos[] = $selector;
                    }
                }
            }

            if(count($seleccionados)>0){
                for($i = 0;$i<count($seleccionados);$i++){
                    $result->datos[$i] = $seleccionados[$i];                   
                }
            }

            foreach($result->datos as $k=>$r){
                $result->datos[$k]->numero = $r->numid;
            }
            
            foreach ($result->datos as $k=>$value) {
                foreach($value as $p=>$v){
                    $arraytemp[$p] = $v;
                }
                $result->datos[$k] = $arraytemp;
            }           
            
            $result->campos = $campos;
            $result->titulo = 'LISTADO DE PERSONAS';

            $objPerfil = new ReporteWord($result);
            $objPerfil->salvarPerfil();
            $r = new StdClass();
            $r->url = "/reccomplejas/ReporteWord.rtf";
        }

        echo json_encode($r);
    }
    /*****************************************************************************/
    function buscarDatos($sql)
    {
        $query = Doctrine_Manager::getInstance();
        $val = $query->getCurrentConnection()->execute($sql);

        return $val->fetchAll(PDO::FETCH_ASSOC);
    }

    //Busquedas para el ComboBox
    function getBusquedasAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $idusuario = $this->global->Perfil->idusuario;
        $objDatBusqueda = new DatBusqueda();
        $datos = $objDatBusqueda->getBusquedas($idconfiguracion, $idusuario);
        $r->datos = $datos;
        echo json_encode($r);
    }

    //Busquedas para el GridPanel de Gestionar Busquedas
    function obtenerBusquedasAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $noUsarGestAvisos = $this->_request->getPost('noUsarGestAvisos');
        $idusuario = $this->global->Perfil->idusuario;

        $codigo = $this->_request->getPost('codigo');
        $denominacion = $this->_request->getPost('denominacion');
        $objDatBusqueda = new DatBusqueda();
        $arrAvisos = array();

        //Obtengo todos los aviso asociados al usuario
        if ($noUsarGestAvisos == 'false') {
            $arrAvisos = $this->integrator->notification->obtenerInfoAvisoDadoCreador($idusuario);
        }
        $datos = array();
        $cantidad = '';
        if ($codigo != null || $denominacion != null) {
            $datos = $objDatBusqueda->filtrarBusquedas(
                $idconfiguracion, $idusuario, $limit, $start, $codigo, $denominacion
            );
            $cantidad = $objDatBusqueda->cantidadBusquedasFiltro($idconfiguracion, $idusuario, $codigo, $denominacion);
        } else {
            $datos = $objDatBusqueda->obtenerBusquedas($idconfiguracion, $idusuario, $limit, $start);
            $cantidad = $objDatBusqueda->cantidadBusquedas($idconfiguracion, $idusuario);
        }

        foreach ($datos as &$dato) {
            if ($dato['idaviso'] != null) {
                $flag = false;
                foreach ($arrAvisos as $aviso) {
                    if ($dato['idaviso'] == $aviso['idaviso']) {
                        $dato['sms'] = $aviso['sms'];
                        $dato['correo'] = $aviso['email'];
                        $dato['jabber'] = $aviso['jabber'];
                        $dato['activo'] = $aviso['activo'];
                        $dato['sistema'] = $aviso['sistema'];
                        $flag = true;
                        break;
                    }
                }
                if (!$flag) { //Si no encontro aviso para la busqueda le cambio el idbusqueda en la base dato a 0.
                    $objDatBusqueda = new DatBusqueda();
                    $objDatBusqueda = $objDatBusqueda->getDatBusqueda($dato['idbusqueda']);
                    $objDatBusqueda->idaviso = $dato['idaviso'];

                    $objDatBusquedaModel = new DatBusquedaModel();
                    $objDatBusquedaModel->Actualizar($objDatBusqueda);
                }
            } else {
                $dato['sms'] = 0;
                $dato['correo'] = 0;
                $dato['jabber'] = 0;
                $dato['sistema'] = 0;
                $dato['activo'] = '-1';
            }
        }
        $r->datos = $datos;
        $r->cantidad = $cantidad;
        echo json_encode($r);
    }

    function adicionarBusquedaAction()
    {
        try {
            $idconfiguracion = $this->_request->getPost('idconfiguracion');
            $denominacion = $this->_request->getPost('denominacion');
            $codigo = $this->_request->getPost('codigo');
            $descripcion = $this->_request->getPost('descripcion');
            $idusuario = $this->global->Perfil->idusuario;

            $campos = Json_decode(stripslashes($this->_request->getPost('campos')));
            $condiciones = Json_decode(stripslashes($this->_request->getPost('condiciones')));
            $operacion = Json_decode(stripslashes($this->_request->getPost('operacion')));
            $orderby = Json_decode(stripslashes($this->_request->getPost('orderby')));

            $objRecuperacionesModel = new RecuperacionesModel();
            $objRecuperacionesModel->generaSQLs($idconfiguracion, $campos, $condiciones, $orderby, $operacion, '', '');

            $objDatBusquedaModel = new DatBusquedaModel();
            $objDatBusqueda = new DatBusqueda();

            $objDatBusqueda->idconfiguracion = $idconfiguracion; //Coger la uri dinamica
            $objDatBusqueda->denominacion = $denominacion;
            $objDatBusqueda->codigo = $codigo;
            $objDatBusqueda->descripcion = $descripcion;
            $objDatBusqueda->sqlbusqueda = $objRecuperacionesModel->getSQL();
           // $objDatBusqueda->sqltotal = $objRecuperacionesModel->getSQLTotal();
            $objDatBusqueda->sqltotal = '';

            $tablasVisitadas = $objRecuperacionesModel->getTablasVisitadasToString();
            if ($tablasVisitadas != '') {
                $objDatBusqueda->tablasvisitadas = $tablasVisitadas;
            }
            $objDatBusqueda->arrideventos = $objDatBusquedaModel->getArrIdTablaBaseBusqueda(
                $objRecuperacionesModel->getSQL(), $objRecuperacionesModel->getParamsCompartimentacion()
            );

            $configuracion = $objDatBusquedaModel->getObjJsonConfiguracion($campos, $condiciones, $orderby, $operacion);
            $objDatBusqueda->configuracion = json_encode($configuracion);

            if(count($operacion)>0){
                $objDatBusqueda->cantidad = 1;
            }

            $objDatBusquedaModel->Insertar($objDatBusqueda);
            $idbusqueda = $objDatBusqueda->idbusqueda;

            $objDatBusquedausuario = new DatBusquedausuario();
            $objDatBusquedausuario->idusuario = $idusuario;
            $objDatBusquedausuario->idbusqueda = $idbusqueda;
            $objDatBusquedausuario->save();

            $r->codMsg = 1;
            $r->mensaje = "La b&uacute;squeda ha sido adicionada satisfactoriamente.";
            echo(json_encode($r));
        } catch (Exception $e) {
            $r->codMsg = 1;
            $r->mensaje = $e->getMessage();
            echo(json_encode($r));
        }
    }

    function modificarBusquedaAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $codigo = $this->_request->getPost('codigo');
        $descripcion = $this->_request->getPost('descripcion');
        $idbusqueda = $this->_request->getPost('idbusqueda');
        $idaviso = $this->_request->getPost('idaviso');
        $noUsarGestAvisos = $this->_request->getPost('noUsarGestAvisos');

        $objDatBusqueda = new DatBusqueda();
        $objDatBusqueda = $objDatBusqueda->getDatBusqueda($idbusqueda);
        $objDatBusqueda->denominacion = $denominacion;
        $objDatBusqueda->codigo = $codigo;
        $objDatBusqueda->descripcion = $descripcion;

        $objDatBusquedaModel = new DatBusquedaModel();
        $objDatBusquedaModel->Actualizar($objDatBusqueda);

        if ($idaviso != ''
            && $noUsarGestAvisos == 'false'
        ) { //Para modificar los datos del aviso en caso de que la busqueda tenga algun aviso asociado
            $contenidoAviso = Json_decode(stripslashes($this->_request->getPost('contenidoAviso')));
            $arrValores = array('nombreAviso' => $denominacion, 'codigo' => $codigo,
                'descripcionBusqueda' => $descripcion);
            $this->integrator->notification->modificarContenidosAviso($idaviso, $arrValores, $contenidoAviso);
        }

        $r->codMsg = 1;
        $r->mensaje = "La b&uacute;squeda ha sido modificada satisfactoriamente.";
        echo(json_encode($r));
    }

    function eliminarBusquedaAction()
    {
        $idbusqueda = $this->_request->getPost('idbusqueda');
        $idaviso = $this->_request->getPost('idaviso');
        $noUsarGestAvisos = $this->_request->getPost('noUsarGestAvisos');

        $objDatBusqueda = new DatBusqueda();
        $objDatBusqueda = $objDatBusqueda->getDatBusqueda($idbusqueda);

        $objDatBusquedaModel = new DatBusquedaModel();
        $objDatBusquedaModel->Eliminar($objDatBusqueda);

        if ($idaviso != 0 && $noUsarGestAvisos == 'false') {
            $this->integrator->notification->eliminarAviso($idaviso);
        }
        $r->codMsg = 1;
        $r->mensaje = "La b&uacute;squeda ha sido eliminada satisfactoriamente.";
        echo(json_encode($r));
    }

    function setPorDefectoAction()
    {
        $idbusquedausuario = $this->_request->getPost('idbusquedausuario');
        $pordefecto = $this->_request->getPost('pordefecto');
        $idusuario = $this->global->Perfil->idusuario;

        $objBusquedaModel = new DatBusquedausuarioModel();
        $objBusquedaModel->setSearchNotDefault($idusuario);
        if ($pordefecto != '1') {
            $objBusquedaModel->setSearchByDefault($idbusquedausuario);
        }
        $datos->success = true;
        echo(json_encode($datos));
    }

    public function obtenerUsuarioPersonasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');

        $objAux = new RecuperacionesModel();
        $r = $objAux->g($limit, $start);

        echo json_encode($r);
    }

    function asignarBusquedaAction()
    {
        die('En desarrollo');
    }

    public function getConfiguracionBusquedaAction()
    {
        $idbusqueda = $this->_request->getPost('idbusqueda');

        $objDatBusqueda = new DatBusqueda();
        $busqueda = $objDatBusqueda->getBusquedaById($idbusqueda);

       /* $objDatBusqueda = new RecuperacionesModel();
        $busqueda = $objDatBusqueda->obtenerServicioBusqueda($idbusqueda,300000000172);*/

        $datos = json_decode($busqueda->configuracion);

        $datos->codMsg = 1;
        $datos->mensaje = 'La configuraci&oacute;n de la b&uacute;squeda ha sido ejecutada satisfactoriamente.';

        echo(json_encode($datos));
    }

    public function activarDesactivarAvisoAction()
    {
        $idaviso = $this->_request->getPost('idaviso');
        $activo = $this->_request->getPost('activo');
        $this->integrator->notification->activarDesactivarAviso($idaviso);

        $datos->codMsg = 1;
        if ($activo == 1) {
            $datos->mensaje = 'El aviso ha sido desactivado satisfactoriamente.';
        } else {
            $datos->mensaje = 'El aviso ha sido activado satisfactoriamente.';
        }
        echo(json_encode($datos));
    }

    public function actualizarAvisoBusquedaAction()
    {
        $idbusqueda = $this->_request->getPost('idbusqueda');
        $idaviso = $this->_request->getPost('idaviso');

        $objDatBusqueda = new DatBusqueda();
        $objDatBusqueda = $objDatBusqueda->getDatBusqueda($idbusqueda);
        $objDatBusqueda->idaviso = $idaviso;

        $objDatBusquedaModel = new DatBusquedaModel();
        $objDatBusquedaModel->Actualizar($objDatBusqueda);

        $r->codMsg = 1;
        $r->mensaje = "La b&uacute;squeda ha sido modificada satisfactoriamente.";
        echo(json_encode($r));
    }

    private function loadCompartimentacion($idconfiguracion)
    {
        try {

            $dirFicheroCompartimentar = $this->direccionModulo . 'comun/recursos/config_reccomplejas/config_'.$idconfiguracion.'/compartimentacion.php';

            require_once($dirFicheroCompartimentar);
            $methodName = 'compartimentar_' . $idconfiguracion;

            $extraParams['idusuario'] = $this->global->Perfil->idusuario;

            if (function_exists($methodName)) {
                $result = $methodName($extraParams);
                $this->arrIndices = $result['arrIndices'];
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

}
