<?php

/**
 * ReclamacionesEstadoDService
 *
 * @package    Domain.
 * @subpackage Domain services.
 * @copyright  UCID
 * @version    1.0
 */
class ReclamacionesEstadoDService extends ZendExt_Model
{
    private $_idproceso = 'reclamacion';
    private $_estadoRepository;
    private $_reclamacionesDService;
    private $_gestordocumental;
    private $_transicion;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_estadoRepository = new ReclamacionesEstadoRepository();
//        $this->_reclamacionesDService = new ReclamacionesDService();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_transicion = new NomTransicion();
    }

    public function getreclamacionEstadoTrazas($idreclamacion)
    {
        $listEstados = $this->_estadoRepository->getEstados(
            array('equalIdReclamacion' => $idreclamacion)
        );
        foreach ($listEstados as &$value) {
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
        $fechainicio = DateTime::createFromFormat(
            'd/m/Y', $value['fechainicio']
        );
        $fechafin = DateTime::createFromFormat(
            'd/m/Y', ($value['fechafin']) ? $value['fechafin'] : date('d/m/Y')
        );
        $diferencia = $fechainicio->diff($fechafin);
        return $diferencia->days;
    }

    public function registrarEstadoInicial($idreclamacion)
    {
//        $idEstadoInicial = $this->_estadoRepository->getEstadoInicial($this->_idproceso);
        $estado = new NomEstado();
        $idEstadoInicial = $estado->getEstadoInicial();
        if ($idEstadoInicial) {
            $this->_estadoRepository->insertRecord(
                array(
                    'idestado'      => $idEstadoInicial['idestado'],
                    'idreclamacion' => $idreclamacion,
                    'fechainicio'   => date('d/m/Y'),
                    'idusuario'     => $this->global->Perfil->idusuario
                )
            );
        }
    }

    public function getConfiguracionEstados($idproceso = 'reclamacion')
    {
        $roles = (new SeguridadComunicationInterface())->getRolsByUser(
            $this->global->Perfil->idusuario
        );
        $idroles = array();
        foreach ($roles as $val) {
            array_push($idroles, $val['idrol']);
        }
        $result = $this->_estadoRepository->getEstadoTransicionesPermisos(
            $idproceso, $idroles, $this->global->Estructura->idestructura
        );
        foreach ($result as &$value) {

            $transicionesAutorizadas = array();
            foreach ($value['NomTransicion'] as $val) {
                if (empty($val['DatRolTransicion'])
                    || $val['idestadofinal'] == $value['idestado']
                ) {
                    continue;
                }
                array_push(
                    $transicionesAutorizadas,
                    array('idestado' => $val['idestadofinal'],
                          // 'notificar' => $val['notificar']
                    )
                );
            }

            unset($value['NomTransicion']);
            $value['transiciones'] = $transicionesAutorizadas;
            $value['acciones'] = Zend_Json::decode($value['acciones']);
        }
        return $result;
    }

    public function getDatosNotificar($reclamacion)
    {
        try {
            $result = $this->_transicion->getTransitions(
                null, $reclamacion->idestado
            );
            $roles = array();
            foreach ($result as $t) {
                foreach ($t['DatRolTransicion'] as $r) {
                    if (!in_array($r['idrol'], $roles)) {
                        $roles[] = $r['idrol'];
                    }
                }
            }
            return array('roles'       => $roles,
                         'reclamacion' => $reclamacion->toArray());
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function crearEspacioReclamaciones($parametros, $idespaciogeneral,
        $idreclamacion = null
    ) {
        try {

            //$idespacio = $this->crearEspacioClienteProveedor($parametros);
            $idespacio = $this->_gestordocumental->CreateWorkSpace(
                $idespaciogeneral, $parametros->nombre
            );
            if ($idreclamacion) {
                $contrato = Doctrine::getTable('DatReclamaciones')->find(
                    $idreclamacion
                );
                $contrato->idespaciotrabajo = $idespacio;
                $contrato->save();
            }
            return $idespacio;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addDocument($reclamacion, $params)
    {
        try {
            if (!$reclamacion->idespaciotrabajo) {
                $reclamacion->idespaciotrabajo
                    = $this->crearEspacioReclamaciones($reclamacion->toArray());
            }
            $_FILES['documento']['realname']
                = $params['nombre'] . ' ' . date('dmYHis');
            $this->_gestordocumental->saveDocument(
                $reclamacion->idespaciotrabajo
            );
            return $reclamacion;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function upEstadoReclamacion($upData)
    {
        try {
            $idreclamacion = $upData['idreclamacion'];
            $idestado = $upData['idestado'];
            $fecha = date('d-m-Y');
            $reclamacion = Doctrine::getTable('DatReclamaciones')->find(
                $idreclamacion
            );
            if ($reclamacion) {
                $this->_estadoRepository->modificarFechaFinEstadoCulmiminado(
                    $idreclamacion
                );
                $instance = new ReclamacionEstado();
                $instance->idestado = $idestado;
                $instance->idreclamacion = $idreclamacion;
                $instance->idusuario = $this->global->Perfil->idusuario;
                $instance->fechainicio = $fecha;
                $instance->save();

                if (count($_FILES)
                    && $this->_reclamacionesDService->existeGestorDocumental()
                ) {
                    $reclamacion = $this->addDocument($reclamacion, $upData);
                }
                $reclamacion->save();
//                $data = $this->getDatosNotificar($reclamacion);
            }
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false, 'upestado' => false);
        }
    }
}