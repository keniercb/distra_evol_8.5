<?php

/**
 * SolicitudNegocioEstadoDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class SolicitudNegocioEstadoDService extends ZendExt_Model
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
        $listEstados = $this->_estadoRepository->getEstados(array('equalIdSolicitud'=>$idsolicitud));
        foreach($listEstados as &$value){
            $persona = (new PersonaComunicationInterface())->getPersona($value['idpersona']);
//            print_r($persona);die;
            $estruc = (new EstructuraComunicationInterface())->getEstructuraById($persona['idarea']);
            $value['nombreapellidos'] = $persona['nombreapellidos'];
            $value['area'] =$estruc[0]->denominacion;
            $value['duracionestado'] = $this->calcularDuracionEstado($value);
        }
        return $listEstados;
    }

    private function calcularDuracionEstado($value)
    {
        $fechainicio = DateTime::createFromFormat('d/m/Y', $value['fechainicio']);
        $fechafin = DateTime::createFromFormat('d/m/Y', ($value['fechafin'])?$value['fechafin']:date('d/m/Y'));
        $diferencia = $fechainicio->diff($fechafin);
        return $diferencia->days;
    }

    public function registrarEstadInicial($idsolicitud)
    {
        //$idEstadoInicial = $this->_estadoRepository->getEstadoInicial($this->_idproceso);
        $estado = new NomEstado();
        $idEstadoInicial = $estado->getEstadoInicial();
        if($idEstadoInicial){
            $this->_estadoRepository->insertRecord(array(
                'idestado' => $idEstadoInicial['idestado'],
                'idsolicitud' =>  $idsolicitud,
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
        }
    }
    
    public function getConfiguracionEstados($idproceso='solicitudnegocio')
    {

        $roles = (new SeguridadComunicationInterface())->getRolsByUser($this->global->Perfil->idusuario);
        $idroles = array();
//        print_r($this->global->Perfil); die;
        foreach($roles as $val)
            array_push($idroles, $val['idrol']);
        $result = $this->_estadoRepository->getEstadoTransicionesPermisos($idproceso, $idroles, $this->global->Estructura->idestructura);
        foreach($result as &$value){

            $transicionesAutorizadas = array();
            foreach($value['NomTransicion'] as $val){
                if(empty($val['DatRolTransicion']) || $val['idestadofinal'] == $value['idestado'])
                    continue;
                array_push($transicionesAutorizadas,
                    array(
                        'idtransicion'=>$val['idtransicion'],
                        'idestado'=>$val['idestadofinal'],
                        'notificar'=>$val['notificar']
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
        $datosrolesobligatorios=NomTransicion::obtenerRolesObligatorios(array('idtransicion'=>$values['idtransicion']));
        $ultimoestado=$this->_estadoRepository->obtenerUltimoEstado($values['idsolicitud']);
        $rolesparticipados=json_decode($ultimoestado['rolesobligatorios']);
        if(!is_array($rolesparticipados))$rolesparticipados=array();
        if(!in_array($this->global->Perfil->idrol, $rolesparticipados))$rolesparticipados[]=$this->global->Perfil->idrol;
        $seguir=true; $obligatoriosefectuados=0;
        foreach($datosrolesobligatorios as $rol){
            if(!in_array($rol['idrol'], $rolesparticipados)){
                $seguir=false;
            }else{
                $obligatoriosefectuados+=1;
            }
        }
        $this->_estadoRepository->actualizarRolesObligatorios(json_encode($rolesparticipados), $values['idsolicitud']);
        if($seguir) {
            $this->_estadoRepository->modificarFechaFinEstadoCuliminado(date('d/m/Y'), $values['idsolicitud']);
            $this->_estadoRepository->insertRecord(array(
                'idestado' => $values['idestado'],
                'idsolicitud' => $values['idsolicitud'],
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
        }
        return array('datos'=>array(
            'cantidadrolesobligatorios'=>count($datosrolesobligatorios),
            'obligatoriosefectuados'=>$obligatoriosefectuados, 'nuevoestado'=>$seguir));
    }

    public function obtenerAdjunto(){
        $dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
        include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Contratos');
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(20);
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Número contrato');
//        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

        $mail = new MailModel();
        return $mail-> guardarArchivoTemporal('xls', $objPHPExcel, 'Sistema.xls');
//        ob_end_clean();
//        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
//        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//        header('Content-Disposition: attachment;filename="Reporte contrato '.date('d/m/Y').'.xls" ');
//        header('Cache-Control: max-age=0');
//
//        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
//        ob_end_clean();
//        $temp='temp';$cont=1;$dir_temp='/crm/comun/recursos/mailtemplates/';
//        while(file_exists($dir_www.$dir_temp.$temp.$cont.'.xls')){
//            $cont++;
//        }
//        $objWriter->save($dir_www.$dir_temp.$temp.$cont.'.xls');
//        $objPHPExcel->disconnectWorksheets();
//        unset($objPHPExcel);
//        ini_restore("max_execution_time");
//        ini_restore("max_input_time");
//        ini_restore("memory_limit");
//        return array('ruta'=>$dir_www.$dir_temp.$temp.$cont.'.xls', 'nombre'=>'Sistema.xls');
    }

    public function obtenerContenidoCorreo($params){
//        print('AQUI con');die;
        $model=new NomEstado();
        $solicitud=Doctrine::getTable('SolicitudNegocio')->find($params['idsolicitud']);
        $params['identificacion']= 'La solicitud con nombre <b style="color:#3158a0">' .$solicitud['nombre'].'</b> y número <b style="color:#3158a0">'.$solicitud['numero'].'</b>';
        $params['destinatarios']=array();
//        $contactos=NomTransicion::obtenerDatosSiguientesRolesObligatorios(array('idtransicion'=>$params['idtransicion']));
        $transicion = Doctrine::getTable('NomTransicion')->find($params['idtransicion']);
        $params['destinatarios']=$transicion['notificaciones']?json_decode($transicion['notificaciones']):null;
        if($params['destinatarios']==null)throw new Exception('No existen destinatarios.');
//        $params['attachment']=$this->obtenerAdjunto();
        return $model->obtenerContenidoCorreo($params);
    }
}