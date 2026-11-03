<?php

/**
 * Clase encargada de la gestion de solicitudes del
 * comite de aprobacion
 *
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class OfertaModel extends ZendExt_Model
{
    private $_contrato;
    private $_contratomodel;
    private $_confcontratacion;
    private $_configuracion;
    private $_dictamen;
    private $_fields;
    private $_gestordocumental;
    private $_persona;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_contrato = new DatContrato();
        $this->_contratomodel = new GestioncontratoModel();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_dictamen = new DatDictamen();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_persona = new PersonaComunicationInterface();
        $this->_configuracion = $this->cargarConfiguracion();
        $this->_fields = $this->obtenerColumnas();
    }

    public function guardarDictamen($params)
    {
        try {
            $roles = $this->integrator->seguridad->getRolesbyUser($params['idusuario']);
            if (count($roles)) {
                $documentojson = array();
                $idespaciotrabajo = $this->getIdEspacioTrabajo();
                if ($_FILES['file']['type'] && $idespaciotrabajo) {
                    $documento = $this->_gestordocumental->saveDocument($idespaciotrabajo);
                    if (!$documento['fail'] && $documento['idnodoadicionado']) {
                        $documentojson = array(
                            'id'   => $documento['idnodoadicionado'],
                            'name' => $_FILES['file']['name']
                        );
                    } else {
                        return;
                    }
                }
            }
            foreach ($roles as $rol) {
                if (in_array($rol['idrol'], $this->_configuracion['idroles'])) {
                    $filter = array('idcontrato' => $params['idcontrato'],
                                    'idrol'      => $rol['idrol'],
                                    'activo'     => 1);
                    $dictamen = $this->_dictamen->getByParams($filter, false);
                    if ($dictamen[0]) {
                        $dictamen = $dictamen[0];
                    } else {
                        $dictamen = new DatDictamen();
                    }
                    $dictamen->idcontrato = $params['idcontrato'];
                    $dictamen->idestado = $params['idestado'];
                    $dictamen->idrol = $rol['idrol'];
                    $dictamen->idusuario = $params['idusuario'];
                    $dictamen->observacion = $params['observacion'];
                    $dictamen->documento = json_encode($documentojson);
                    $dictamen->fecha = date('d/m/Y');
                    $dictamen->save();
                }
            }
            return array('code' => 1, 'success' => true);
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function cargarDictamenes($params)
    {
        try {
            $condition = [];
            if ($params['idcontrato']) {
                $condition['idcontrato'] = $params['idcontrato'];
            }
            $condition['dd.activo'] = 1;
            $result = $this->_dictamen->getByParams($condition);
            foreach ($result as $key => $value) {
                $result[$key]['nombrerol'] = $value['SegRol']['denominacion'];
                $result[$key]['abreviaturarol'] = $value['SegRol']['abreviatura'];
                $result[$key]['nombreestado'] = $value['NomEstado']['nombre'];
                $result[$key]['iconoestado'] = $value['NomEstado']['icono'];
                if ($value['SegUsuario']['idpersona']) {
                    $persona = $this->_persona->getPersona($value['SegUsuario']['idpersona']);
                    $result[$key]['nombrepersona'] = $persona['nombreapellidos'];
                    $result[$key]['cargopersona'] = $persona['denomcargo'];
                }
                $documento = json_decode($value['documento']);
                if ($documento->id) {
                    $array = $this->getFile(array('iddocument' => $documento->id));
                    $documento->base64 = $array['base64'];
                    $documento->url = $array['url'];
                }
                $result[$key]['documento'] = $documento;
            }
            return array('data' => $result, 'count' => count($result));
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function cargarContrato($params, $reglas = true)
    {
        try {
            $conf = $this->_configuracion;
            $result = $this->cargarDatos($params, $conf['estadoinicial']);
            $result['metaData'] = $this->obtenerMetadata();
            $flag = false;
            $reload = false;
            foreach ($result['data'] as $key => $contrato) {
                foreach ($conf['roles'] as $rol) {
                    $filter = array('idcontrato' => $contrato['idcontrato'],
                                    'idrol'      => $rol['idrol'],
                                    'dd.activo'  => 1);
                    $dictamen = $this->_dictamen->getByParams($filter);
                    if ($dictamen) {
                        $dictamen = $dictamen[count($dictamen) - 1];
                        $contrato['idestado-' . $rol['abreviatura']] = $dictamen['idestado'];
                        $contrato['iconoestado-' . $rol['abreviatura']] = $dictamen['NomEstado']['icono'];
                        $contrato['estado-' . $rol['abreviatura']] = $dictamen['NomEstado']['nombre'];
                    } else {
                        $contrato['idestado-' . $rol['abreviatura']] = $contrato['idestado'];
                        $contrato['iconoestado-' . $rol['abreviatura']] = $contrato['iconoestadoinicial'];
                        $contrato['estado-' . $rol['abreviatura']] = $contrato['estadoinicial'];
                    }
                }
                if ($reglas) {
                    $response = $this->aplicarReglas($contrato, false);
                    if (!$flag && $response['reload'] == true) {
                        $reload = true;
                        $flag = true;
                    }
                    $result['data'][$key] = $response['contrato'];
                }
            }
            if ($reload) {
                $result = $this->cargarContrato($params);
            }
            return $result;

        } catch (Exception $e) {
            return array('code' => $e, 'success' => false);
        }
    }

    public function cargarConfiguracion()
    {
        $result = $this->_confcontratacion->loadConfComite()['transitions'];
        $data = [];
        foreach ($result as $key => $value) {
            foreach ($value['roles'] as $rol) {
                if (!in_array($rol['idrol'], $data['idroles'])) {
                    $data['roles'][] = $rol;
                    $data['idroles'][] = $rol['idrol'];
                }
            }
            $data['estadofinal-' . $value['idestadofinal']] = json_decode($value['reglas']);
            if (!in_array($value['idestadoinicial'], $data['estadoinicial'])) {
                $data['estadoinicial'][] = $value['idestadoinicial'];
            }
        }
        return $data;
    }

    public function cargarDatos($params, $estados)
    {
        foreach ($estados as $estado) {
            if (!isset($params['filter'])) {
                $params['filter'] = array();
            }
            $filtro = array(
                'field' => 'idestado',
                'data'  => array(
                    'type'  => 'list',
                    'value' => $estado,
                )
            );
            $params['filter'][] = $filtro;
        }
        return $this->_contrato->cargarcontrato(
            $this->global->Estructura->idestructura,
            $params['limit'],
            $params['start'],
            array($params['filter'], ' AND '),
            array(json_decode($params['filter2'], true), ' OR ')
        );
    }

    public function obtenerMetadata()
    {
        $roles = $this->_configuracion['roles'];
        $fields = $this->_fields;
        $columns = array();
        foreach ($roles as $rol) {
            $fields[] = array('name' => 'idestado-' . $rol['abreviatura'], 'type' => 'int', 'hideable' => false);
            $fields[] = array('name' => 'estado-' . $rol['abreviatura'], 'type' => 'string', 'hideable' => false);
            $fields[] = array('name'     => 'iconoestado-' . $rol['abreviatura'], 'type' => 'string', 'width' => 80,
                              'renderer' => 'showIcon', 'align' => 'center');
        }

        foreach ($fields as $key => $field) {
            if (!isset($field['hideable'])) {
                $header = explode('-', $field['name']);
                $header = count($header) == 2 ? strtoupper($header[1]) : $header[0];
                $column = array('dataIndex' => $field['name'],
                                'header'    => $header,
                                'filter'    => array('type' => $field['type']),
                                'renderer'  => $field['renderer'],
                                'align'     => $field['align'] ? $field['align'] : 'left'
                );
                if ($field['width']) {
                    $column['width'] = $field['width'];
                } else {
                    $column['flex'] = 1;
                }

                if ($field['type'] == 'date') {
                    unset($fields[$key]['type']);
                }
                $columns[] = $column;
            }
        }
        return array(
            'fields'  => $fields,
            'columns' => $columns
        );
    }

    public function aplicarReglas($contrato)
    {
        try {
            $reload = false;
            foreach ($contrato['transicion'] as $transicion) {
                $required = 0;
                $checked = 0;
                $quantiy = 0;
                $reglas = $this->_configuracion['estadofinal-' . $transicion['idestadofinal']];
                if ($reglas) {
                    foreach ($reglas as $regla) {
                        if ($regla->idtiporegla == 1) {
                            $required++;
                            $filter = array('idcontrato' => $contrato['idcontrato'],
                                            'idestado'   => $transicion['idestadofinal'],
                                            'idrol'      => $regla->idrol,
                                            'dd.activo'  => 1);
                            $dictamen = $this->_dictamen->getByParams($filter);
                            if (count($dictamen) != 0) {
                                $checked++;
                            }
                        }

                        if ($regla->idtiporegla == 2) {
                            $filter = array('idcontrato' => $contrato['idcontrato'],
                                            'idestado'   => $transicion['idestadofinal'],
                                            'dd.activo'  => 1);
                            $dictamen = $this->_dictamen->getByParams($filter);

                            settype($regla->valor, 'int');
                            if (count($dictamen) >= $regla->valor) {
                                $quantiy = $regla->valor;
                            }
                        }

                        if ($regla->idtiporegla == 3) {
                            $diasrestantes = $diasautomatico = $contrato['diasrestantes'] = $this->obtenerDiasRestantes(
                                $contrato['fechaestado'], $regla->valor
                            );
                        }

                        if ($regla->idtiporegla == 4) {
                            $diasrestantes = $diasplazo = $contrato['diasrestantes'] = $this->obtenerDiasRestantes(
                                $contrato['fechaestado'], $regla->valor
                            );
                        }
                    }
                    if ($required != 0 && $required == $checked) {
                        $idestado = $transicion['idestadofinal'];
                        break;
                    } else {
                        if ($quantiy != 0 && !isset($diasplazo)) {
                            $idestado = $transicion['idestadofinal'];
                            break;
                        } else {
                            if ($diasautomatico === 0) {
                                $idestado = $transicion['idestadofinal'];
                                break;
                            } else {
                                if ($diasplazo === 0 && $quantiy != 0) {
                                    $idestado = $transicion['idestadofinal'];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if ($idestado) {
                $filter = array('idcontrato' => $contrato['idcontrato'],
                                'idestado'   => $idestado);
                $response = $this->_contratomodel->upEstadoContrato($filter);

                if ($response['success']) {
                    $reload = true;
                    $this->_dictamen->deleteByParams($filter);
                }
                if ($diasrestantes) {
                    $contrato['diasrestantes'] = $diasrestantes;
                }
            }
            return array('reload' => $reload, 'contrato' => $contrato);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerDiasRestantes($fechaestado, $maxdias)
    {
        $factual = explode('/', date('d/m/Y'));
        $festado = explode('/', $fechaestado);
        $dias = $maxdias;
        $f1 = mktime(0, 0, 0, $factual[1], $factual[0], $factual[2]);
        $f2 = mktime(0, 0, 0, $festado[1], $festado[0], $festado[2]);

        if ($f1 > $f2) {
            //segundos de diferencia
            $segdif = $f1 - $f2;
            //dias de diferencia
            $diasdif = $segdif / (60 * 60 * 24);
            //valor absoluto
            $diasdif = abs($diasdif);
            //eliminar decimales
            $diasdif = floor($diasdif);
            $dias = $diasdif > $maxdias ? 0 : $maxdias - $diasdif;
        }
        return $dias;
    }

    public function obtenerColumnas()
    {
        return array(
            array('name' => 'idcontrato', 'type' => 'int', 'hideable' => false),
            array('name' => 'numero', 'type' => 'string'),
            array('name' => 'nombre', 'type' => 'string'),
            array('name' => 'fechainicio', 'hideable' => false),
            array('name' => 'fechafin', 'hideable' => false),
            array('name' => 'fechafirma', 'hideable' => false),
            array('name' => 'tipocontrato', 'hideable' => false),
            array('name' => 'clienteproveedor', 'hideable' => false),
            array('name' => 'montototal', 'hideable' => false),
            array('name' => 'registropago', 'hideable' => false),
            array('name' => 'idproforma', 'hideable' => false),
            array('name' => 'objeto', 'hideable' => false),
            array('name' => 'descripcion', 'hideable' => false),
            array('name' => 'denominacioncontratomarco', 'hideable' => false),
            array('name' => 'mediopago', 'hideable' => false),
            array('name' => 'idproforma', 'hideable' => false),
            array('name' => 'mediopago', 'hideable' => false),
            array('name' => 'sector', 'hideable' => false),
            array('name' => 'vigencia', 'hideable' => false),
            array('name' => 'unidadtiempo', 'hideable' => false),
            array('name' => 'condicionpago', 'hideable' => false),
            array('name' => 'nombrepersona', 'type' => 'string'),
            array('name' => 'acciones', 'type' => 'array', 'hideable' => false),
            array('name' => 'transicion', 'type' => 'array', 'hideable' => false),
            array('name' => 'idestado', 'type' => 'int', 'hideable' => false),
            array('name' => 'fechaestado', 'type' => 'date', 'width' => 100),
            array('name' => 'diasrestantes', 'type' => 'int', 'width' => 50),
            array('name' => 'documentojson', 'hideable' => false),
        );
    }

    public function cargarProductos($params)
    {
        try {
            return $this->_contratomodel->getDatosAdicionales($params);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function obtenerArchivo($params)
    {
        return $this->_gestordocumental->getFile($params);
    }

    public function getIdEspacioTrabajo()
    {
        $result = $this->_confcontratacion->loadCommitteedoc();
        return $result[0]['idespaciotrabajo'];
    }

    public function getFile($params)
    {
        return $this->_gestordocumental->getFile($params);
    }
} 