<?php

/**
 * Componente para gestionar División Político Administrativa.
 *
 * @package    Configuración
 * @subpackage DivisiónPolítica/Controllers
 * @copyright  UCID Cuba
 * @author     Livan A Capote Valdez
 * @version    1.0-0
 */
class GestdpaController extends ZendExt_Controller_Secure
{

    /**
     * objeto de la clase GestnivelestructuralModel
     */
    private $model;

    /**
     * Constuctor de la clase
     */
    function init()
    {
        $this->model = new GestnivelestructuralModel();
        parent::init();
    }

    /**
     * Obtiene los Países
     */
    function gestdpaAction()
    {
        if (count(NomPais::gettodos()) > 0) {
            /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
            $this->render();
        } else {
            $this->exception = new ZendExt_Exception('CONFDPT002');
            $flashMessenger = $this->_helper->_flashMessenger;
            $flashMessenger->addMessage($this->exception->getIdException());
            $flashMessenger->addMessage($this->exception->getDescription());
            $flashMessenger->addMessage($this->exception->getMessage());
            $this->render('info');
        }
    }

    /**
     * Obtiene la exepción controlada por el marco de trabajo
     *
     * @return exception Detalles de la excepción y
     * el mensaje asociado a la misma
     */
    public function getexcepcioncontroladaAction()
    {
        $dataException = $this->_helper->_flashMessenger->getMessages();
        echo("{detalles: '$dataException[1]', 'message': '$dataException[2]'}");
    }

    /**
     * Obtiene todos los países
     *
     * @return array Arreglo con la cantidad de filas y los datos de país
     */
    function getPaisesAction()
    {
        $datos = NomPais::gettodos();
        echo json_encode(
            array('cantidad_filas' => count($datos), 'root' => $datos)
        );
        return;
    }

    /**
     * Adiciona un objeto NomConcept
     *
     * @return code Código de respuesta
     */
    function insertarConceptoEstructuralAction()
    {
        $tipo = $this->_request->getPost('tipo');
        $datos = NomConcept::comprobarPorUri($tipo);
        $idFuncionalidad = NomConcept::obtenerIdFuncionalidadGestionarRelaciones();
        if (count($datos) > 0) {
            echo(json_encode(array('idconceptoestructural' => $datos[0]['idconceptoestructural'], 'idfuncionalidad' => $idFuncionalidad)));
            return;
        } else {
            $conceptoEstructural = new NomConcept();
            $conceptoEstructural->denominacion = $tipo;
            $conceptoEstructural->uri = $tipo;
            $conceptoEstructural->fechaini = date("d/m/Y");
            $conceptoEstructural->descripcion = $tipo;
            $conceptoEstructural->visible = 0;
            $conceptoEstructural->save();
            echo(json_encode($conceptoEstructural->idconceptoestructural));
            return;
        }
    }

    /**
     * Busca las conexiones con \xE1rbol para construir el menú
     *
     * @return array Arreglo con los datos de menu
     */
    function construirMenuAction()
    {
        $idtabla = $this->_request->getPost('idtabla');
        $tipo = $this->_request->getPost('tipo');
        $arregloRetorno = array();
        $idnomeav = $idtabla == 'idpadre' ? false : $idtabla;
        $arregloRetorno ['menu'] = $this->model->buscarConexionesarbol(
            $idnomeav, $tipo
        );
        echo(json_encode($arregloRetorno));
    }

    /**
     * Obtiene los datos para construir el formulario de inserción
     *
     * @return array Arreglo con la cantidad de datos del formulario
     */
    function construirformularioinsercionAction()
    {
        $arregloRetorno = array();
        $arregloRetorno [0] = array();
        $arregloRetorno [1] = array('url' => 'adicionarDpa');
        $arregloRetorno [] = array(
            'xtype'      => 'textfield', 'fieldLabel' => 'Denominaci&oacute;n',
            'id'         => 'denominacion', 'name' => 'denominacion',
            'value'      => '',
            'allowBlank' => false, 'maxLength' => 19,
            'maskRe'     => '/^([a-zA-ZÃ�Ã‰Ã�Ã“ÃšÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d ]
            +?[a-zA-ZÃ�Ã‰Ã�Ã“ÃšÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d ]*)+$/',
            'vtype'      => 'vtalfanumerico');
        $arregloRetorno [] = array('xtype'      => 'textfield',
                                   'fieldLabel' => 'C&oacute;digo',
                                   'id'         => 'codigo',
                                   'name'       => 'codigo', 'value' => '',
                                   'allowBlank' => false, 'maxLength' => 5,
                                   'vtype'      => 'vtalfanumericopunto');
        $arregloRetorno [] = array('xtype'      => 'textfield',
                                   'fieldLabel' => 'Abreviatura',
                                   'id'         => 'abreviatura',
                                   'name'       => 'abreviatura', 'value' => '',
                                   'allowBlank' => true, 'maxLength' => 10,
                                   'vtype'      => 'vtalfanumerico');
        $arregloRetorno [] = array('xtype'        => 'datefield',
                                   'fieldLabel'   => 'Fecha inicio',
                                   'id'           => 'fechainicio',
                                   'name'         => 'fechainicio',
                                   'value'        => '', 'allowBlank' => false,
                                   'endDateField' => 'fechafin',);
        $arregloRetorno [] = array('xtype'          => 'datefield',
                                   'fieldLabel'     => 'Fecha fin',
                                   'id'             => 'fechafin',
                                   'name'           => 'fechafin',
                                   'value'          => '', 'allowBlank' => true,
                                   'startDateField' => 'fechainicio');
        $arregloRetorno [0] = array('cantidad' => count($arregloRetorno) - 2);
        echo(json_encode($arregloRetorno));
    }

    /**
     * Obtiene los datos para construir el formulario de modificación
     *
     * @return array Arreglo con la cantidad de datos del formulario
     */
    function construirformulariomodificarAction()
    {
        $iddpa = ($this->_request->getPost('idfila') != '')
            ? $this->_request->getPost('idfila')
            : die("{'codMsg':1,
            'mensaje':'Debe de seleccionar una estructura.'}");
        $dpa = Doctrine::getTable('NomDpa')->find($iddpa);
        if (is_object($dpa)) {
            $arregloRetorno = array();
            $arregloRetorno [0] = array();
            $arregloRetorno [1] = array('url' => 'modificarDpa');
            $arregloRetorno [] = array('xtype'      => 'textfield',
                                       'fieldLabel' => 'Denominaci&oacute;n',
                                       'id'         => 'denominacion',
                                       'name'       => 'denominacion',
                                       'value'      => $dpa->denominacion,
                                       'allowBlank' => false);
            $arregloRetorno [] = array('xtype'      => 'textfield',
                                       'fieldLabel' => 'C&oacute;digo',
                                       'id'         => 'codigo',
                                       'maxLength'  => 5, 'name' => 'codigo',
                                       'value'      => $dpa->codigo,
                                       'allowBlank' => false,
                                       'vtype'      => 'vtalfanumericopunto');
            $arregloRetorno [] = array('xtype'      => 'textfield',
                                       'fieldLabel' => 'Abreviatura',
                                       'id'         => 'abreviatura',
                                       'maxLength'  => 10,
                                       'name'       => 'abreviatura',
                                       'value'      => $dpa->abreviatura,
                                       'allowBlank' => true,
                                       'vtype'      => 'vtalfanumerico');
            $arregloRetorno [] = array('xtype'        => 'datefield',
                                       'fieldLabel'   => 'Fecha inicio',
                                       'id'           => 'fechainicio',
                                       'name'         => 'fechainicio',
                                       'value'        => $dpa->fechainicio,
                                       'allowBlank'   => false,
                                       'vtype'        => 'daterange2',
                                       'endDateField' => 'fechafin');
            $arregloRetorno [] = array('xtype'          => 'datefield',
                                       'fieldLabel'     => 'Fecha fin',
                                       'id'             => 'fechafin',
                                       'name'           => 'fechafin',
                                       'value'          => $dpa->fechafin,
                                       'allowBlank'     => true,
                                       'vtype'          => 'daterange2',
                                       'startDateField' => 'fechainicio');
            $arregloRetorno [0] = array('cantidad' => count($arregloRetorno)
                - 2);
            echo(json_encode($arregloRetorno));
        } else {
            die("{'codMsg':3,
            'mensaje':'La Divisi&oacute;n-Pol&iacute;tico-Administrativa
            que selecciono no existe.'}");
            return;
        }
    }

    /**
     * Obtiene todos los datos de NomDpa
     *
     * @return array
     */
    function cargarEstructuraplanAction()
    {
        $node = $this->_request->getPost('node');
        $idpais = $this->_request->getPost('idpais');
        if ($idpais != "undefined") {
            $sistemas = NomDpa::cargarEstructura($node, $idpais);

            if (count($sistemas)) {
                $sistemaArr = array();
                for ($i = 0; $i < count($sistemas); $i++) {
                    $aux['id'] = $sistemas[$i]['id'];
                    $aux['text'] = $sistemas[$i]['text'];
                    $aux['idpadre'] = $sistemas[$i]['idpadre'];
                    $aux['leaf'] = $sistemas[$i]['leaf'];
                    $aux['abreviatura'] = $sistemas[$i]['abreviatura'];
                    $aux['fechafin'] = $sistemas[$i]['fechafin'];
                    $aux['fechainicio'] = $sistemas[$i]['fechainicio'];
                    $aux['idtipodpa'] = $sistemas[$i]['idtipodpa'];
                    $aux['idnivelestructural']
                        = $sistemas[$i]['idnivelestructural'];
                    $aux['raiz']
                        = $sistemas[$i]['NomNivelestructural'][0]['raiz'];
                    $sistemaArr[] = $aux;
                }
                echo json_encode($sistemaArr);
                return;
            } else {
                echo json_encode(array());
                return;
            }
        }
        echo json_encode(array());
        return;
    }

    /**
     * Obtiene todos los datos de NomDpa delimitados
     * por los campos start y limit
     *
     * @return array Arreglo con la cantidad de filas y los datos de NomDpa
     */
    function cargarDpaAction()
    {
        $post = $this->_request->getPost();
        $idpadre = ($this->_request->getPost('idpadre') != '')
            ? $this->_request->getPost('idpadre')
            : die("{'codMsg':1,
            'mensaje':'Debe seleccionar una estructura.'}");
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idpais = ($this->_request->getPost('idpais') != '')
            ? $this->_request->getPost('idpais')
            : die("{'codMsg':1,
            'mensaje':'Debe seleccionar un pa&iacute;s.'}");
        
        $filter = !empty($post['filter']) ? $post['filter'] : NULL;
        
        $valores = NomDpa::valoresEstructuraplan(
            $idpadre, $start, $limit, $idpais, $filter
        );
        $cantidad = NomDpa::cantidadEstructuras($idpadre, $idpais);
        if ($cantidad != 0) {
            if(!is_null($filter)) {
                include_once Zend_Registry::get('config')->dir_aplication .
                    'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
                $valores = UtilesDatosMaestros::colorSearch($valores,
                    array('codigo', 'denominacion', 'abreviatura'),
                    array($filter, $filter, $filter));
            }
            echo json_encode(
                array('cantidad_filas' => $cantidad, 'root' => $valores)
            );
        } else {
            echo json_encode(array('cantidad_filas' => 0, 'root' => array()));
        }
    }

    /**
     * Adiciona una División Político Administrativa
     *
     * @return code Código de respuesta
     */
    function adicionarDpaAction()
    {
        $obj = new NomDpa();
        $idpadre = ($this->_request->getPost('idpadre') == 'idpadre') ? 0
            : $this->_request->getPost('idpadre');
        $obj->denominacion = $this->_request->getPost('denominacion');
        $obj->abreviatura = $this->_request->getPost('abreviatura');
        $obj->codigo = $this->_request->getPost('codigo');
        $obj->idpais = $this->_request->getPost('idpais');
        $obj->fechafin = $this->_request->getPost('fechafin');
        $obj->fechainicio = ($this->_request->getPost('fechainicio') != '')
            ? $this->_request->getPost('fechainicio') : die("{'codMsgg':-1}");
        $obj->idpadre = $idpadre;
        $obj->idnivelestructural = $this->_request->getPost('idtabla');
        if (NomDpasecodena::verificarDenominacion($obj) == false) {
            echo("{'codMsgg':-2}");
            return;
        } else if (NomDpasecodena::verificarCodigo($obj) == false) {
            echo("{'codMsgg':-4}");
            return;
        } else {
            $result = $obj->save();
            echo("{'codMsgg':-3}");
            return;
        }
    }

    /**
     * Modifica una División Político Administrativa
     *
     * @return code Código de respuesta
     */
    function modificarDpaAction()
    {
        $iddpa = $this->_request->getPost('idfila');
        $dpa = Doctrine::getTable('NomDpa')->find($iddpa);
        if (is_object($dpa)) {
            $dpa->denominacion = ($this->_request->getPost('denominacion')
                != '') ? $this->_request->getPost(
                'denominacion'
            ) : die("{'codMsg':-1}");
            $dpa->abreviatura = $this->_request->getPost('abreviatura');
            $dpa->fechafin = $this->_request->getPost('fechafin');
            $dpa->fechainicio = ($this->_request->getPost('fechainicio') != '')
                ? $this->_request->getPost(
                    'fechainicio'
                ) : die("{'codMsg':-2}");
            $dpa->codigo = ($this->_request->getPost('codigo') != '')
                ? $this->_request->getPost('codigo') : die("{'codMsg':-3}");
            $resultcod = NomDpasecodena::verificarCod($dpa);
            if ($resultcod == false) {
                echo("{'codMsgg':-4}");
                return;
            }
            $resultden = NomDpasecodena::verificarDen($dpa);
            if ($resultden == false) {
                echo("{'codMsgg':-5}");
                return;
            }
            if ($this->model->modificar($dpa)) {
                echo("{'codMsgg':-6}");
                return;
            }
            die("{'codMsgg':3,
            'mensaje':'No se pudo modificar el elemento satisfactoriamente.'}");
        }
        die("{'codMsgg':3,
        'mensaje':'La base legal que selecciono no existe.'}");
        return;
    }

    /**
     * Elimina una División Político Administrativa
     *
     * @return code Código de respuesta
     */
    function eliminarDpaAction()
    {
        $iddpa = ($this->_request->getPost('idfila') != '')
            ? $this->_request->getPost('idfila')
            : die("{'codMsg':1,
            'mensaje':'Debe de seleccionar una estructura.'}");
        $dpa = Doctrine::getTable('NomDpa')->find($iddpa);
        if (is_object($dpa)) {
            $dpa->fechafin = date("d/m/Y");
            $dpa->save();
            echo("{'codMsgg':-1}");
            return;
        } else {
            echo("{'codMsgg':-3}");
            return;
        }
    }

    /**
     * Gestiona el \xE1rbol de la División Político Administrativa
     *
     * @return array Arreglo del \xE1rbol resultante
     */
    public function gettreedpaAction()
    {
        $model = new GestnomencladoresModel();
        $tipoBusqueda = $this->_request->getPost('tiporaiz');
        $node = (is_numeric($this->_request->getPost('node')))
            ? $this->_request->getPost('node') : 'idpadre';
        $idPais = ($this->_request->getPost('idpais'))
            ? $this->_request->getPost('idpais')
            : Zend_Registry::get(
                'config'
            )->idpais;
        if (str_replace('pais', '', $node) != $node) {
            $idPais = str_replace('pais', '', $node);
            $node = 'idpadre';
        }
        echo json_encode(
            $this->retornoGetTreeDpa($tipoBusqueda, $node, $idPais, $model)
        );
        return;
    }

    /**
     * Gestiona el \xE1rbol de la División Político Administrativa
     *
     * @param mixed $tipoBusqueda
     * @param mixed $node
     * @param int   $idPais
     * @param mixed $model
     *
     * @return array
     */
    private function retornoGetTreeDpa($tipoBusqueda, $node, $idPais, $model)
    {
        $treeDpa = array();
        if ($tipoBusqueda == 'pais') {
            if ($node == 'idpadre' && !$idPais) {
                $treeDpa = $model->getPaises();
            } else {
                if ($node) {
                    $treeDpa = $model->getTreeDPA($node, $idPais);
                }
            }
        } else {
            $treeDpa = $model->getTreeDPA($node, $idPais);
        }
        return $treeDpa;
    }

}
