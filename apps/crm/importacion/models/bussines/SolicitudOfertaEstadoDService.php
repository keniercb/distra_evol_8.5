<?php

/**
 * SolicitudNegocioEstadoDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */



class SolicitudOfertaEstadoDService extends ZendExt_Model
{
    private $_idproceso = 'solicitudnegocio';
    private $_estadoRepository;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_estadoRepository = new SolicitudNegocioEstadoRepository();
    }

    public function getEstadoTrazas($idsolicitud)
    {
        $listEstados = $this->_estadoRepository->getEstados(array('equalIdSolicitud' => $idsolicitud));
        foreach ($listEstados as &$value) {
            $persona = (new PersonaComunicationInterface())->getPersona($value['idpersona']);
            $estruc = (new EstructuraComunicationInterface())->getEstructuraById($persona['idarea']);
            $value['nombreapellidos'] = $persona['nombreapellidos'];
            $value['area'] = $estruc[0]->denominacion;
            $value['duracionestado'] = $this->calcularDuracionEstado($value);
        }
        return $listEstados;
    }

    private function calcularDuracionEstado($value)
    {
        $fechainicio = DateTime::createFromFormat('d/m/Y', $value['fechainicio']);
        $fechafin = DateTime::createFromFormat('d/m/Y', ($value['fechafin']) ? $value['fechafin'] : date('d/m/Y'));
        $diferencia = $fechainicio->diff($fechafin);
        return $diferencia->days;
    }

    public function registrarEstadInicial($idsolicitud)
    {
//        $idEstadoInicial = $this->_estadoRepository->getEstadoInicial($this->_idproceso);
        $estado = new NomEstado();
        $idEstadoInicial = $estado->getEstadoInicial();
        if ($idEstadoInicial) {
            $this->_estadoRepository->insertRecord(array(
                'idestado' => $idEstadoInicial['idestado'],
                'idsolicitud' => $idsolicitud,
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
        }
    }

    public function getConfiguracionEstados($idproceso = 'solicitudnegocio')
    {
        $roles = (new SeguridadComunicationInterface())->getRolsByUser($this->global->Perfil->idusuario);
        $idroles = array();
        //print_r($roles); die;
        foreach ($roles as $val)
            array_push($idroles, $val['idrol']);
        $result = $this->_estadoRepository->getEstadoTransicionesPermisos($idproceso, $idroles, $this->global->Estructura->idestructura);
        foreach ($result as &$value) {

            $transicionesAutorizadas = array();
            foreach ($value['NomTransicion'] as $val) {
                if (empty($val['DatRolTransicion']) || $val['idestadofinal'] == $value['idestado'])
                    continue;
                array_push($transicionesAutorizadas,
                    array(
                        'idtransicion'=>$val['idtransicion'],
                        'idestado' => $val['idestadofinal'],
                        'notificar' => $val['notificar']
                    ));
            }

            unset($value['NomTransicion']);
            $value['transiciones'] = $transicionesAutorizadas;
            $value['acciones'] = Zend_Json::decode($value['acciones']);
        }
        return $result;
    }

    public function cambiarSolicitudEstado($values)
    {
        $datosrolesobligatorios = NomTransicion::obtenerRolesObligatorios(array('idtransicion' => $values['idtransicion']));
        $ultimoestado = $this->_estadoRepository->obtenerUltimoEstado($values['idsolicitud']);
        $rolesparticipados = json_decode($ultimoestado['rolesobligatorios']);
        if (!is_array($rolesparticipados)) $rolesparticipados = array();
        if (!in_array($this->global->Perfil->idrol, $rolesparticipados)) $rolesparticipados[] = $this->global->Perfil->idrol;
        $seguir = true;
        $obligatoriosefectuados = 0;
        foreach ($datosrolesobligatorios as $rol) {
            if (!in_array($rol['idrol'], $rolesparticipados)) {
                $seguir = false;
            } else {
                $obligatoriosefectuados += 1;
            }
        }
        $this->_estadoRepository->actualizarRolesObligatorios(json_encode($rolesparticipados), $values['idsolicitud']);
        if ($seguir) {
            $this->_estadoRepository->modificarFechaFinEstadoCuliminado(date('d/m/Y'), $values['idsolicitud']);
            $this->_estadoRepository->insertRecord(array(
                'idestado' => $values['idestado'],
                'idsolicitud' => $values['idsolicitud'],
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
        }
        return array('datos' => array(
            'cantidadrolesobligatorios' => count($datosrolesobligatorios),
            'obligatoriosefectuados' => $obligatoriosefectuados, 'nuevoestado' => $seguir));
    }

    public function exportarExcelSolicitudImp($params)
    {

        $dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Anexo a la Solicitud');
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(20);
        $objPHPExcel->getActiveSheet()->setCellValue('B8', 'ITEM');
        $objPHPExcel->getActiveSheet()->setCellValue('C8', 'DESCRIPCION');
        $objPHPExcel->getActiveSheet()->setCellValue('D8', 'U/M');
        $objPHPExcel->getActiveSheet()->setCellValue('E8', 'CANT.');

        $this->formatoMarcadoTabla($objPHPExcel, 'B8');
        $this->formatoMarcadoTabla($objPHPExcel, 'C8');
        $this->formatoMarcadoTabla($objPHPExcel, 'D8');
        $this->formatoMarcadoTabla($objPHPExcel, 'E8');

        $solicitud = Doctrine::getTable('SolicitudNegocio')->find($params['idsolicitud']);
        $objPHPExcel->getActiveSheet()->mergeCells('B6:E6');
        $objPHPExcel->getActiveSheet()->setCellValue('B6', $solicitud['nombre']);
        $this->formatoTitulo($objPHPExcel, 'B6:E6');
        $model=new SolicitudNegocioDService();
        $result = $model->obtenerProductoServicio($params['idsolicitud']);


        $fila = 9;
        foreach ($result['datos'] as $i => $indi) {

            $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $i + 1);
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $indi['denominacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $indi['unidadmedida']);
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $indi['cantidad']);


            $this->formatoTabla($objPHPExcel, 'B' . $fila);
            $this->formatoTabla($objPHPExcel, 'C' . $fila);
            $this->formatoTabla($objPHPExcel, 'D' . $fila);
            $this->formatoTabla($objPHPExcel, 'E' . $fila);
            $fila++;

        }

        //Cargar logo
        //print_r($_SERVER['DOCUMENT_ROOT']);die;
        $ObjDrawing = new PHPExcel_WorkSheet_Drawing ();
        $ObjDrawing->setName('Logo Empresa');
        $ObjDrawing->setDescription('Logo Empresa');
        $ObjDrawing->setPath($_SERVER['DOCUMENT_ROOT'] . "/crm/application/views/images/logosasa.png");
        $ObjDrawing->setCoordinates('B1');
        $ObjDrawing->setWidth(80);
        $ObjDrawing->setHeight(80);

        $ObjDrawing->setWorkSheet($objPHPExcel->getActiveSheet());

        if(isset($params['adjuntar'])) {
            $mail = new MailModel();
            return $mail-> guardarArchivoTemporal('xls', $objPHPExcel, 'Anexo');
        }else{
            ob_end_clean();
            //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
            header(
                'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            header(
                'Content-Disposition: attachment;filename="Solicitud_' . date('d-m-Y') . '.xls" '
            );
            header('Cache-Control: max-age=0');
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            ob_end_clean();
            echo($objWriter->save('php://output'));
            $objPHPExcel->disconnectWorksheets();
            unset($objPHPExcel);
        }
    }


    private function formatoMarcadoTabla(&$objPHPExcel, $celda)
    {

        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()
            ->applyFromArray(
                array(
                    'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                    'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                )
            );
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()
            ->applyFromArray(
                array(

                    'name' => 'Arial',
                    'bold' => true,
                    'italic' => false,
                    'strike' => false,
                    'size' => 10,
                    'color' => array(
                        'rgb' => '000000',

                    )
                )
            );
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()
            ->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    ),
                    'top' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000',
                        )
                    ),
                    'left' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgl' => '000000',
                        )
                    ),
                    'right' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
    }

    private function formatoTabla(&$objPHPExcel, $celda, $color = '000000')
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()->getColor()->setRGB($color);
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()
            ->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000',
                        )
                    ),

                    'right' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000',

                        )

                    ),

                    'top' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000',
                        )
                    ),

                    'left' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgl' => '000000',
                        )
                    )

                )
            );
    }

    private function formatoTitulo(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()
            ->applyFromArray(
                array(
                    'name' => 'Arial',
                    'bold' => true,
                    'italic' => false,
                    'strike' => false,
                    'size' => 12,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            );
    }

    /** @noinspection PhpUndefinedVariableInspection */
    public function exportarWordSolicitudImp($params)
    {
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/crm/comun/recursos/rtf/PHPRtfLite.php');
//        require_once($apps . 'apps/pvd/comun/recursos/rtf/Rtf.php');
        PHPRtfLite::registerAutoloader();
        $rtf = new PHPRtfLite();

        $this->sect = $rtf->addSection();

        $this->sect->setPaperHeight(27.94);
        $this->sect->setPaperWidth(21.59);
        $this->sect->setMargins(2.5, 2.2, 2.2, 2.2);
        $solicitud = Doctrine::getTable('SolicitudNegocio')->find($params['idsolicitud']);
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $linea=$conn->fetchRow(
            "SELECT n.denominacion 
            FROM mod_datosmaestros.nom_naturaleza n WHERE n.idnaturaleza=".$solicitud['idlinea']
        );



        $this->createHeader();
        $this->sect->writeText( "<b>{$solicitud['nombre']}</b>", new Font(16, Arial), new ParFormat('center'));
        $this->sect->writeText('<br/><br/>', new Font(2, Arial), new ParFormat('center'));
        $this->sect->writeText(' <i>Estimados Señores:</i>',new Font(12, Arial), new ParFormat('justify') );
        $this->sect->writeText($this->textoparrafo(), new Font(12, Arial), new ParFormat('justify') );
        $this->sect->writeText("<i>Dicha oferta debe ser presentada impresa y en formato digital en nuestras oficinas en o antes del día {$solicitud['fechafin']} </i>", new Font(12, Arial), new ParFormat('justify'));
        $this->sect->writeText('<br/><br/>', new Font(1, Arial), new ParFormat('center'));
        $this->sect->writeText('<i>La oferta que no incluya los siguientes requisitos será desechada automáticamente.</i>', new Font(12, Arial), new ParFormat('justify'));
        $this->sect->writeText('<i>Su oferta debe incluir las siguientes condiciones:</i>', new Font(12, Arial), new ParFormat('justify'));
        $this->sect->writeText('<br/><br/>', new Font(1, Arial), new ParFormat('center'));
        $this->sect->writeText($this->vinnetas(), new Font(12, Arial), new ParFormat('left'));
        $this->sect->writeText('<br/>', new Font(1, Arial), new ParFormat('left'));
        $this->sect->writeText($this->textoparrafo2(), new Font(12, Arial), new ParFormat('justify'));
        $this->sect->writeText('<br/><br/>', new Font(1, Arial), new ParFormat('center'));
        $this->sect->writeText($this->textoparrafo3(), new Font(12, Arial), new ParFormat('justify'));
        $this->sect->writeText('<i>Quedamos al tanto de su rápida y amable respuesta.</i>', new Font(12, Arial), new ParFormat('justify') );
        $this->sect->writeText('<br/><br/>', new Font(2, Arial), new ParFormat('center'));
        $this->sect->writeText('<i>Leanet Ruz Cordoví</i>', new Font(12, Arial), new ParFormat('left') );
        $this->sect->writeText('<i>Comprador Internacional</i>', new Font(12, Arial), new ParFormat('left') );
        $this->sect->writeText('<i>Servicios Automotores, S.A.</i>', new Font(12, Arial), new ParFormat('left') );



       // $this->sect->writeText('<i>La oferta que no incluya los siguientes requisitos será desechada automáticamente.</i>', new PHPRtfLite_Font(8, Arial), new PHPRtfLite_ParFormat('left'));



//        $rtf->save("ExportarOrdenes.rtf");


        if(isset($params['adjuntar'])) {
            $mail = new MailModel();
            return $mail-> guardarArchivoTemporal('rtf', $rtf, 'Solicitud_oferta');
        }else {
            //finalizando
            ob_end_clean();
            //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
//        header(
//            'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//        );
            header(
                'Content-Disposition: attachment;filename="Solicitud_oferta_' . date('d-m-Y') . '.rtf" '
            );
            header('Cache-Control: max-age=0');
            ob_end_clean();
            echo($rtf->save('php://output'));
            unset($rtf);
        }
    }

    private function createHeader()
    {
        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(2, 0.5);
        $this->table->addColumnsList(array(6, 4, 4.5, 6));
        $dirfoto = $_SERVER ['DOCUMENT_ROOT'] . '/crm/application/views/images/logosasa.png';
        $this->table->addImageToCell(1, 1, $dirfoto, new PHPRtfLite_ParFormat('center'), 3.5, 1.5);
        $this->sect->writeText($this->direccion(),  new PHPRtfLite_Font(9, Arial), new PHPRtfLite_ParFormat('right'));
        $this->sect->writeText($this->telefono(),  new PHPRtfLite_Font(9, Arial), new PHPRtfLite_ParFormat('right'));
        $this->sect->writeText('__________________________________________', new PHPRtfLite_Font(20, Arial, '#FF0000'), new PHPRtfLite_ParFormat('center'));
        $this->sect->writeText($this->generaLugarFechaEmision(), new PHPRtfLite_Font(9, Arial), new PHPRtfLite_ParFormat('right'));

    }

    private function textoparrafo($linea){

        return '<i>Por medio de la presente, le solicitamos nos cotice el listado de <b>'.$linea['denominacion'].
            '</b> que se anexa. Para ello '.
            'en su oferta deben dejar claramente las características de cada producto '.
            '(código, marca). </i>  ';
    }

    private function textoparrafo2(){
        return '<i>Su oferta será dirigida a la Dirección de Compras de Servicios Automotores S.A '.
            'antes de la fecha de referencia, a: Leanet Ruz Cordoví: dircompra@presidencia.sasa.co.cu, '.
            'y Ana Margarita Sánchez Hechavarría:comex5@presidencia.sasa.co.cu</i>.';
    }

    private function textoparrafo3(){
        return "<i>Para que su oferta sea válida, es de estricto cumplimiento los parámetros exigidos ".
            "en esta solicitud. En el caso de los concurrentes que aún no han entregado sus documentos ".
            "acreditativos para este año, por favor pasar por nuestra oficina y entregarlos para su evaluación.</i> ";
    }

    private function direccion(){
        return "<i>Casa Matriz, Calle 1era e/26 y 28 No. 2602, Miramar,Ciudad Habana</i>";

    }

    private function telefono(){
        return
            "<i>Telèfon: 206-9550, 206-9561, 206-9562</i> ";
    }


    private function generaLugarFechaEmision()
    {
        $num = (int)date('Y') - 1959;
        $dia = (int)date('d');
        $mes = (int)date('m');
        $anno = (int)date('Y');

        $fechaEmision = ' "Año ' . ($num + 1) . ' de la Revolución".';
        $this->sect->writeText('<br/><br/>', new Font(2, Arial), new ParFormat('right'));
        $fecha = 'Ciudad de la Habana.' . ($dia) . ' de ' . ($mes) . ' del '. ($anno);
        $this->sect->writeText($fecha .  '', new Font(9, Arial), new ParFormat('right'));
        $this->sect->writeText($fechaEmision .  '', new Font(9, Arial), new ParFormat('right'));
    }
    private function vinnetas(){
        return "<i>1.Código<br/>".
            "2.Descripciòn del producto<br/>".
            "3.Cantidad<br/>".
            "4.Precio e Importe<br/>".
            "5.Moneda<br/>".
            "6.Garantia<br/>".
            "7.Origen<br/>".
            "8.Condiciòn de compra, segun P2A2-R2<br/>".
            "9.Flete<br/>".
            "10.Valor C.F.R<br/>".
            "11.Seguro<br/>".
            "12.Valor C.I.P<br/>".
            "13.Peso en Kg y Volumen m3.(Por renglòn y/o global por oferta)<br/>".
            "14.Tiempo de entrega<br/>".
            "15.Condigiones de pago<br/>".
            "16.Fecha de la oferta<br/>".
            "17.Validez de la oferta</i>";


    }

    public function obtenerContenidoCorreo($params)
    {
//        print('AQUI');die;
        $model=new NomEstado();
        $solicitud=Doctrine::getTable('SolicitudNegocio')->find($params['idsolicitud']);
        $params['identificacion']= 'La solicitud de oferta con nombre <b style="color:#3158a0">' .$solicitud['nombre'].'</b> y número <b style="color:#3158a0">'.$solicitud['numero'].'</b>';
        $params['destinatarios']=array();
//        $contactos=NomTransicion::obtenerDatosSiguientesRolesObligatorios(array('idtransicion'=>$params['idtransicion']));

        $transicion = Doctrine::getTable('NomTransicion')->find($params['idtransicion']);
        $estadofinal = Doctrine::getTable('NomEstado')->find($transicion['idestadofinal']);
        $enviaracliente=false;
        if($estadofinal['acciones']){
            $acciones=json_decode($estadofinal['acciones']);
            if(array_search('notificacliente', $acciones))
                $enviaracliente=true;
        }

        if($enviaracliente){
            $proveedores=Doctrine::getTable('DatSolicitudNegocioProveedor')->findBy(
                'idsolicitudnegocio', $params['idsolicitud'])->toArray();
            if(count($proveedores)){
                $datosmaestros=new DatosMaestrosComunicationInterface();
                foreach($proveedores as $prov){
                    $proveedor=$datosmaestros->getClienteById($prov['idproveedor']);
                    if($proveedor['cantidad']>0)
                        if($proveedor['datos'][0]['correo'])
                            $params['destinatarios'][]=$proveedor['datos'][0]['correo'];
                }
//                $params['destinatarios']=$transicion['notificaciones']?json_decode($transicion['notificaciones']):null;
            }
        }else {
            $params['destinatarios'] = $transicion['notificaciones'] ? json_decode($transicion['notificaciones']) : null;
        }
//        print_r($params['destinatarios']);die;
//        if($params['destinatarios']==null)throw new Exception('No existen destinatarios.');
        $params['attachment']=array();
        $params['attachment'][]=$this->exportarExcelSolicitudImp(array('idsolicitud'=>$params['idsolicitud'], 'adjuntar'=>true));
        $params['attachment'][]=$this->exportarWordSolicitudImp(array('idsolicitud'=>$params['idsolicitud'], 'adjuntar'=>true));

        return $model->obtenerContenidoCorreo($params);
    }
    /*
    private function setSpaceBetweenLines($spaceBetweenLines) {
        $this->spaceBetweenLines = round($spaceBetweenLines * SPACE_IN_LINES);
    }
*/






}
