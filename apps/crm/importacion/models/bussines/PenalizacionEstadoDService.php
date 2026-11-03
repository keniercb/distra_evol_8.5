<?php

/**
 * PenalizacionEstadoDService
 *
 * @package    Domain.
 * @subpackage Domain services.
 * @copyright  UCID
 * @version    1.0
 */
class PenalizacionEstadoDService extends ZendExt_Model
{
    private $_idproceso = 'penalizacion';
    private $_estadoRepository;
    private $_penalizacionesDService;
    private $_gestordocumental;
    private $_transicion;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_estadoRepository = new PenalizacionEstadoRepository();
        $this->_Repository = new PenalizacionesRepository();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_transicion = new NomTransicion();
    }

    public function getPenalizacionEstadoTrazas($idpenalidad)
    {
        $listEstados = $this->_estadoRepository->getEstados(
            array('equalIdPenalizacion' => $idpenalidad)
        );
        foreach ($listEstados as &$value) {
            $persona = (new PersonaComunicationInterface())->getPersona(
                $value['idpersona']
            );
            $estruc = (new EstructuraComunicationInterface())->getEstructuraById($persona['idarea']);
            $value['nombreapellidos'] = $persona['nombreapellidos'];
            $value['area'] = $estruc[0]->denominacion;
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

    public function registrarEstadoInicial($idpenalidad)
    {

        $estado = new NomEstado();
        $idEstadoInicial = $estado->getEstadoInicial();
        if ($idEstadoInicial) {
            $this->_Repository->insertRecord(
                array(
                    'idestado' => $idEstadoInicial['idestado'],
                    'idpenalidad' => $idpenalidad,
                    'fechainicio' => date('d/m/Y'),
                    'idusuario' => $this->global->Perfil->idusuario
                )
            );
        }
    }

    public function getConfiguracionEstados($idproceso = 'penalizacion')
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

    public function getDatosNotificar($penalizacion)
    {
        try {
            $result = $this->_transicion->getTransitions(
                null, $penalizacion->idestado
            );
            $roles = array();
            foreach ($result as $t) {
                foreach ($t['DatRolTransicion'] as $r) {
                    if (!in_array($r['idrol'], $roles)) {
                        $roles[] = $r['idrol'];
                    }
                }
            }
            return array('roles' => $roles,
                'penalizacion' => $penalizacion->toArray());
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function crearEspacioPenalizaciones($parametros, $idespaciogeneral,
                                               $idpenalidad = null
    )
    {
        try {
            $idespacio = $this->_gestordocumental->CreateWorkSpace(
                $idespaciogeneral, $parametros->nombre
            );
            if ($idpenalidad) {
                $contrato = Doctrine::getTable('DatPenalizaciones')->find(
                    $idpenalidad
                );
                $contrato->idespaciotrabajo = $idespacio;
                $contrato->save();
            }
            return $idespacio;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addDocument($penalizacion, $params)
    {
        try {
            if (!$penalizacion->idespaciotrabajo) {
                $penalizacion->idespaciotrabajo
                    = $this->crearEspacioPenalizaciones(
                    $penalizacion->toArray()
                );
            }
            $_FILES['documento']['realname']
                = $params['nombre'] . ' ' . date('dmYHis');
            $this->_gestordocumental->saveDocument(
                $penalizacion->idespaciotrabajo
            );
            return $penalizacion;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function upEstadoPenalizacion($upData)
    {
        try {
            $idpenalidad = $upData['idpenalidad'];
            $idestado = $upData['idestado'];
            $observacion = $upData['observacion'];
            $fecha = date('d-m-Y');
            $penalizacion = Doctrine::getTable('DatPenalizaciones')->find(
                $idpenalidad
            );
            Doctrine::getTable('DatPenalizaciones')->findAll()->getLast();
            if ($penalizacion) {
                $this->_estadoRepository->modificarFechaFinEstadoCulmiminado(
                    $idpenalidad
                );
                $instance = new PenalizacionEstado();
                $instance->idestado = $idestado;
                $instance->idpenalidad = $idpenalidad;
                $instance->idusuario = $this->global->Perfil->idusuario;
                $instance->fechainicio = $fecha;
                $instance->observacion = $observacion;
                $instance->save();

                if (count($_FILES)
                    && $this->_penalizacionesDService->existeGestorDocumental()
                ) {
                    $penalizacion = $this->addDocument($penalizacion, $upData);
                }
                $penalizacion->save();
            }
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false, 'upestado' => false);
        }
    }
}