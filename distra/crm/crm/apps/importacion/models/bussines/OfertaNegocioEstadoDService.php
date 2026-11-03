<?php

/**
 * OfertaNegocioEstadoDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class OfertaNegocioEstadoDService extends ZendExt_Model
{
    private $_idproceso = 'ofertanegocio';
    private $_estadoRepository;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_estadoRepository = new OfertaNegocioEstadoRepository();
    }

    public function getEstadoTrazas($idoferta)
    {
        $listEstados = $this->_estadoRepository->getEstados(array('equalIdOferta'=>$idoferta));
        foreach($listEstados as &$value){
            $persona = (new PersonaComunicationInterface())->getPersona($value['idpersona']);
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

    public function registrarEstadoInicial($idoferta)
    {
//        $idEstadoInicial = $this->_estadoRepository->getEstadoInicial($this->_idproceso);
        $estado = new NomEstado();
        $idEstadoInicial = $estado->getEstadoInicial();

        if($idEstadoInicial){
            $this->_estadoRepository->insertRecord(array(
                'idestado' => $idEstadoInicial['idestado'],
                'idoferta' =>  $idoferta,
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
        }
    }
    
    public function getConfiguracionEstados($idproceso='ofertanegocio')
    {
//        print('/*'.$idproceso.'*/');
        $roles = (new SeguridadComunicationInterface())->getRolsByUser($this->global->Perfil->idusuario);
        $idroles = array();
        foreach($roles as $val)
            array_push($idroles, $val['idrol']);

        $result = $this->_estadoRepository->getEstadoTransicionesPermisos($idproceso, $idroles, $this->global->Estructura->idestructura);
//        if($idproceso=='ofertanegocioproveedor'){print_r($result);die;}
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
//            if($value['idestado']==8)print_r($transicionesAutorizadas);die;
            unset($value['NomTransicion']);
            $value['transiciones'] = $transicionesAutorizadas;
            $value['acciones'] = Zend_Json::decode($value['acciones']);
        }
        return $result;
    }

    public function cambiarOfertaEstado($values)
    {
        $datosrolesobligatorios=NomTransicion::obtenerRolesObligatorios(array('idtransicion'=>$values['idtransicion']));
        $ultimoestado=$this->_estadoRepository->obtenerUltimoEstado($values['idoferta']);
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
        $this->_estadoRepository->actualizarRolesObligatorios(json_encode($rolesparticipados), $values['idoferta']);
        if($seguir) {
            $this->_estadoRepository->modificarFechaFinEstadoCuliminado(date('d/m/Y'), $values['idoferta']);

            $this->_estadoRepository->insertRecord(array(
                'idestado' => $values['idestado'],
                'idoferta' => $values['idoferta'],
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
        }
        return array('datos'=>array(
            'cantidadrolesobligatorios'=>count($datosrolesobligatorios), 'obligatoriosefectuados'=>$obligatoriosefectuados, 'nuevoestado'=>$seguir));
    }
}