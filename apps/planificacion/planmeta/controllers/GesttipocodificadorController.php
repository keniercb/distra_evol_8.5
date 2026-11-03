<?php

/**
 * Gestgruposnomencladores
 * Controlador para gestionar los nomencladores
 *
 * @ author Javier Lamas Collejo
 * @ package Planificaciï¿½n
 * @ subpackage Planificaciï¿½n
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class GesttipocodificadorController extends ZendExt_Controller_Secure {

    /**
     * funcion init()
     * Para inicializar el modulo
     *
     * @author Javier Lamas Collejo
     * */
    function init() {
        parent::init();
    }

    /**
     * funcion gestgruposcodificadores()
     * Para renderizar la vista
     *
     * @author Javier Lamas Collejo
     * */
    public function gesttipocodificadorAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function adicionarAction() {
        //$params['color'] = $this->_request->getPost('color');
        $params['idpadre'] = $this->_request->getPost('idpadre');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');
        $params['idformato'] = $this->_request->getPost('idformato');
        $params['codigo'] = $this->_request->getPost('codigo');
        //$params['color2'] = $this->_request->getPost('color2');
        $params['denominacion1'] = $this->_request->getPost('denominacion1');
        $params['descripcion1'] = $this->_request->getPost('descripcion1');
        $params['um'] = $this->_request->getPost('um');
        $params['mod'] = $this->_request->getPost('mod');
        $params['anode'] = $this->_request->getPost('anode');
        $params['id'] = $this->_request->getPost('id');
        $result = NomTipocodificadorModel::adicionar($params);
        if ($result) {
            echo json_encode($result);
        } else {
            echo("{'codMsgA':21 }");
        }
    }

    public function eliminarAction() {
        $params = json_decode(stripslashes($this->_request->getPost('id')));
        echo json_encode(NomTipocodificadorModel::eliminar($params));
    }

    public function listarAction() {

        $parametros['idpadre'] = $this->_request->getPost('anode');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['es_especialidad'] = $this->_request->getPost(
                'es_especialidad'
        );

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $key => $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                }
                if ($datos['field'] == 'descripcion') {
                    $parametros['descripcion'] = $datos ['data'] ['value'];
                }
                if ($datos['field'] == 'codigo') {
                    $parametros['codigo'] = $datos ['data'] ['value'];
                }
            }
        }

        $tiponom = new NomTipocodificadorModel();
        $data = $tiponom->listar($parametros);

        $datos = array();
        foreach ($data->data as $key => $val) {
            $val = array_splice(
                    $val, -8
            ); //suprime el primer elemento del array $val, posibilitando que los datos en la IU de
            // difieran en idtiponomenclador y iddatosnomencldor.
            if ($val['_parent'] == null) {
                $hasDatos = Doctrine::getTable('NomDatoscodificador')->findOneByIdtipocodificador($val['id']);
                if (!$hasDatos->iddatoscodificador) {
                    $val['_is_leaf'] = true;
                }
            } else {
                
            }
            $datos[$key] = $val;
        }
        $data->data = $datos;

        echo json_encode($data);
    }

    public function listarFormatosAction() {
        $formatos = $this->integrator->datosmaestros->listarFormatos();
        echo json_encode(array('data' => $formatos));
    }

    public function listarUmAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );

        //$unidades = DatControldivisaindicador::listarUM();
        echo json_encode(array('data' => $unidades));
    }

    public function listarIndicadoresAction() {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['idpadre'] = $this->_request->getPost('anode');
        $params['idtipocodif'] = $this->_request->getPost('idtipocodif');

        $integrator = $this->integrator;
        $params['centrobalances'] = NomIndicadorModel::listarCentroBalance(
                        $integrator, null, null
        );

        //  $identidad = $this->global->Estructura->idestructura;
        if ($this->_request->getPost('rector') != 'true') {
            $idEstructura = $this->global->Estructura->idestructura;
            $identidaddatosnomenclador = DatEntidaddatosnomenclador::obtenerEntidades($idEstructura);
            if ($identidaddatosnomenclador[0] != null) {
                $params['identidad'] = $idEstructura;
            }
        }
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'codigo') {
                    $params['codigo'] = $datos['data']['value'];
                    if (strlen($params['codigo']) <= 3) {
                        $params['nivelarbol'] = 1;
                    } else {
                        if (strlen($params ['codigo']) == 4) {
                            $params['nivelarbol'] = 2;
                        } else {
                            if (strlen($params ['codigo']) == 5 || strlen(
                                            $params ['codigo']
                                    ) == 6
                            ) {
                                $params['nivelarbol'] = 3;
                            } else {
                                $params['nivelarbol'] = 4;
                            }
                        }
                    }
                }
                if ($datos['field'] == 'numeropieza') {
                    $params['numeropieza'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'denominacion') {
                    $params['denominacion'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'idtipocodificador') {
                    $params['idtipocodificador'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'denocentrobalance') {
                    $params['identidaddatosnomenclador'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'denodatoscodif') {
                    $params['denodatoscodif'] = $datos['data']['value'];
                }
            }
        }
        $params['nivelarbol'] = ($this->_request->getPost('nivelarbol')) ? $this->_request->getPost('nivelarbol') : $params['nivelarbol'];
        echo json_encode(
                NomIndicadorModel::listarIndicadoresParaTipoCodificador($params)
        );
    }

    public function cargaInicialAction() {
        //servicio para obtener el id de la entidad que esta logueada
        $identidad = $this->global->Estructura->idestructura;

        $denoEntidad = $this->global->Estructura->denominacion;
        $compEntidad = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador(
                        $identidad
        );
        $entidadCB = NomIndicador::entidadEsCB($identidad);
        $rector = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        //temporal hasta que se haga un servicio que de el id del formato "Indicadores"
        $formato = $this->integrator->datosmaestros->listarFormatos();

        //manda entidadrector
        /* if ($rector[0]['identidad'] == $identidad) {
          $entidadrectora = true;
          } else {
          $entidadrectora = false;
          } */
        $entidadrectora = true;

        foreach ($formato as $valor) {
            if ($valor->nombre == 'Indicadores') {
                $idformatoInd = $valor->idformato;
                $nombreFormatoInd = "Indicadores";
            }
        }
        if ($idformatoInd == '') {
            echo("{'codMsg':21 }"); //no existe formato de indicadores
        } else {
            echo json_encode(
                    array('identidad' => $identidad,
                        'idformatoInd' => $idformatoInd,
                        'nombreFormatoInd' => $nombreFormatoInd,
                        'entidadCB' => $entidadCB,
                        'denoEntidad' => $denoEntidad,
                        'compEntidad' => $compEntidad[0][identidaddatosnomenclador],
                        'entidadrectora' => $entidadrectora)
            );
        }
    }

    public function listarTipoCodificadoresAction() {
        echo json_encode(NomTipocodificadorModel::listarTipoCodificadores());
    }

    public function listarDatosCodificadorAction() {
        $params['idpadre'] = $this->_request->getPost('idpadre');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'codigo') {
                    $params['codigo'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'denominacion') {
                    $params['denominacion'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'idumedida') {
                    $params['idumedida'] = $datos['data']['value'];
                }
            }
        }
        echo json_encode(
                NomTipocodificadorModel::listarDatosCodifdadoIdPadre($params)
        );
    }

    public function asociarAction() {
        $params['indicadores'] = json_decode(
                stripslashes($this->_request->getPost('indicadores'))
        );
        $params['iddatcodificador'] = json_decode(
                stripslashes($this->_request->getPost('iddatcodificador'))
        );
        $params['accion'] = $this->_request->getPost('accion');
        $params['idtipoc'] = $this->_request->getPost('idtipoc');
        $params['iddelet'] = json_decode(
                stripslashes($this->_request->getPost('iddelet'))
        );
        $params['idind'] = json_decode(
                stripslashes($this->_request->getPost('idind'))
        );
        echo json_encode(DatDatosclasificadorindicadorModel::asociar($params));
    }

    public function validarAsociacionAction() {
        $params['indicadores'] = json_decode(
                stripslashes($this->_request->getPost('indicadores'))
        );
        $params['idtipoc'] = $this->_request->getPost('idtipoc');
        echo json_encode(
                DatDatosclasificadorindicadorModel::validarAsociacion($params)
        );
    }

    public function listarCentroBalanceAction() {
        $integrator = $this->integrator;
        echo json_encode(
                array('data' => NomIndicadorModel::listarCentroBalance(
                            $integrator, $idpadre, $idindicador
                    ))
        );
    }

    public function ValidarCentroAction() {
        $identidad = $this->global->Estructura->idestructura;
        echo NomIndicadorModel::ValidarCentro($identidad);
    }

    public function exportarAction() {
        $parametros['idpadre'] = (!$this->_request->getParam('anode')) ? 0 : $this->_request->getParam('anode');
        $parametros['filtros'] = json_decode(
                $this->_request->getParam('filtros')
        );
        echo json_encode(NomTipocodificadorModel::exportar($parametros));
    }

    public function exportarindasocAction() {
        $integrator = $this->integrator;
        $params['centrobalances'] = NomIndicadorModel::listarCentroBalance(
                        $integrator, null, null
        );
        if ($this->_request->getPost('rector') != 'true') {
            $idEstructura = $this->global->Estructura->idestructura;
            $identidaddatosnomenclador = DatEntidaddatosnomenclador::obtenerEntidades($idEstructura);
            if ($identidaddatosnomenclador[0] != null) {
                $params['identidad'] = $idEstructura;
            }
        }
        if ($this->_request->getParam('nivelarbol')) {
            $params['nivelarbol'] = $this->_request->getParam('nivelarbol');
        } else {
            $params['nivelarbol'] = 1;
        }
        $params['idtipocodif'] = $this->_request->getParam('idtipocodif');
        $params['asociado'] = $this->_request->getParam('asociado');
        $params['filtros'] = json_decode($this->_request->getParam('filtros'));
        $obj = new NomIndicadorModel();
        echo json_encode($obj->exportarindasoc($params));
    }

}
