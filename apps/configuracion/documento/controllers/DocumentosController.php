<?php

/**
 * Clase controladora para gestionar documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Controllers
 * @copyright  XETID.
 * @version    1.0-0
 */
class DocumentosController extends ZendExt_Controller_Secure
{
    /**
     * Inicializa el padre
     */
    function init()
    {
        parent::init();
        $this->model[] = new DocumentoModel();
        $this->model[] = new DatDocumentoprimModel();
    }

    /**
     * Inicializa la vista
     */
    function documentosAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        if (self::testGD()) {
            $this->view->gestdoc = $this->integrator->gestordocumental->devolverJSContenido();
        } else {
            $this->view->gestdoc = '';
        }

        $this->view->jasper = '<script type="text/javascript"> var existe_jasper=' . json_encode(self::testJasper()) . '</script>';

        $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($idestructura);
        if (count($subsistemas)) {
            $this->render();
        } else {
            $this->exception = new ZendExt_Exception('CONF150');
            $flashMessenger = $this->_helper->_flashMessenger;
            $flashMessenger->addMessage($this->exception->getIdException());
            $flashMessenger->addMessage($this->exception->getDescription());
            $flashMessenger->addMessage($this->exception->getMessage());
            $this->render('info');
        }
    }

    /**
     * Obtiene una excepción controlada
     *
     * @return void Echo con detalles de la excepción
     */
    public function getexcepcioncontroladaAction()
    {
        $dataException = $this->_helper->_flashMessenger->getMessages();
        echo("{detalles: '$dataException[1]', 'message': '$dataException[2]'}");
    }

    /**
     * Obtiene un documento primario
     *
     * @return void Echo con el documento
     */
    function cargardocumentosAction()
    {
        try {
            $cond = $this->_request->getPost();
            $entidad = $this->_request->getPost('idestructura');
            $entidad = ($entidad) ? $entidad : $this->global->Estructura->idestructura;
            $subs = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($entidad);
            if (count($subs) == 0) {
                echo json_encode(array('datos' => [], 'cant' => 0));
                return;
            }
            $idsub = array();
            foreach ($subs as $i => $sub) {
                $idsub[$i] = $sub->idestructurasubsist;
            }
            $cond['subsistemas'] = $idsub;
            $elementos = DatDocumentoprim::buscarDocTodos($cond);
            $elementos = $this->extraerElementos($elementos, $subs);
            if (self::testGD()) {
                foreach ($elementos['datos'] as &$element) {
                    $idespaciotrabajo = $element['idespaciotrabajo'];
                    if ($idespaciotrabajo && $idespaciotrabajo != 'Null') {
                        try {
                            $espacioTrabajo = $this->integrator->gestordocumental->obtenerContenidos(
                                array('identificadorNodo' => $idespaciotrabajo), 0, 0
                            );
                        } catch (Exception $e) {
                            continue;
                        }
                        $element['espacioTrabajo'] = $espacioTrabajo['detalles']['nombre'];
                    } else {
                        $element['espacioTrabajo'] = '';
                    }
                    if ($element['idgestordocumental'] == 'Null') {
                        $element['idgestordocumental'] = '';
                    }
                }
            }
            if ($cond['sfFiltro'] != '') {
                include_once Zend_Registry::get('config')->dir_aplication
                    . 'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
                $elementos['datos'] = UtilesDatosMaestros::colorSearch(
                    $elementos['datos'],
                    array('denominacion', 'codigo'),
                    array($cond['sfFiltro'], $cond['sfFiltro']), true
                );
            }
            echo(json_encode($elementos));
        } catch (Exception $ee) {
            throw new Exception($ee);
        }
    }

    /**
     * Método auxiliar para extraer elementos de dos arrays
     *
     * @param array $elementos Elementos a extraer
     * @param array $subs      Subsistemas
     *
     * @return array Elementos
     */
    private function extraerElementos($elementos, $subs)
    {
        foreach ($elementos['datos'] as $k => $objeto) {
            foreach ($subs as $sub) {
                if ($objeto['idestructurasubsist'] == $sub->idestructurasubsist) {
                    $elementos['datos'][$k]['nombresubsistema'] = $sub->NomSubsistema['denominacion'];
                    break;
                }
            }
        }
        return $elementos;
    }

    /**
     * Obtiene documentos
     *
     * @return void Echo con mensaje de confirmación
     */
    function cargardocumentosHeredarAction()
    {
        $cond = $this->_request->getPost();
        $entidad = $this->_request->getPost('idestructura');
        $entidad = ($entidad) ? $entidad : $this->global->Estructura->idestructura;

        $entidadPadre = $this->integrator->metadatos->obtenerPadreEntidad($entidad);
        if ($entidad != $entidadPadre[0]->idestructura) {
            $subsistemasComun = array();

            $subs = $this->integrator->datosmaestros->buscarSubsistemasActivosPorEntidad($entidad);
            if ($subs) {
                $subsPadre = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad(
                    $entidadPadre[0]->idestructura
                );
                $subsistemasComun = $this->objPadre($subs, $subsPadre);

                $idsub = array();
                if ($subsistemasComun) {
                    foreach ($subsistemasComun as $i => $sub) {
                        $idsub[$i] = $sub->idestructurasubsist;
                    }

                    $cond['subsistemas'] = $idsub;
                    $elementos = DatDocumentoprim::buscarDocTodos($cond);

                    foreach ($elementos['datos'] as $k => $objeto) {
                        foreach ($subsistemasComun as $i => $sub) {
                            if ($objeto['idestructurasubsist'] == $sub->idestructurasubsist) {
                                $elementos['datos'][$k]['nombresubsistema'] = $sub->NomSubsistema['denominacion'];
                                $elementos['datos'][$k]['idsubsistema'] = $sub->NomSubsistema['idsubsistema'];
                                break;
                            }
                        }
                    }
                    echo(json_encode($elementos));
                } else {
                    echo("{'codMsg':-4}");
                }
            }
        } else {
            echo("{'codMsg':-4}");
        }
    }

    /**
     * Método auxiliar para obtener un objeto padre
     *
     * @param array $subs Subsistemas
     * @param array $subsPadre Subsistemas padre
     *
     * @return array El objeto padre
     */
    private function objPadre($subs, $subsPadre)
    {
        $subsistemasComun = array();
        foreach ($subs as $obj) {
            foreach ($subsPadre as $objPadre) {
                if ($obj->idsubsistema == $objPadre->idsubsistema) {
                    $subsistemasComun[] = $objPadre;
                }
            }
        }
        return $subsistemasComun;
    }

    /**
     * Obtiene subsistemas
     *
     * @return void Echo con un array de subsistemas
     */
    function cargarsubsistemasAction()
    {
        $entidad = $this->_request->getPost('idestructura');
        $entidad = ($entidad) ? $entidad : $this->global->Estructura->idestructura;
        $subs = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($entidad);
        $elementos = array();
        foreach ($subs as $i => $sub) {
            $elementos[$i]['idestructurasubsist'] = $sub->idestructurasubsist;
            $elementos[$i]['nombresubsistema'] = $sub->NomSubsistema['denominacion'];
        }
        echo(json_encode(
            array('cant' => count($elementos), 'datos' => $elementos)
        ));
    }

    /**
     * Obtiene nomencladores de documentos
     *
     * @return void Echo con array de nomencladores
     */
    function cargarnomdocAction()
    {
        $elementos = NomDocprim::obtenerNomDocprim($this->_request->getPost());
        echo(json_encode($elementos));
    }

    /**
     * Obtiene nomencladores de documentos ordenados
     *
     * @return void Echo con array de nomencladores
     */
    function cargarnomdocgAction()
    {
        $elementos = NomDocprim::buscarnomdoc($this->_request->getPost());
        array_multisort($elementos['datos']);
        echo(json_encode($elementos));
    }

    /**
     * Obtiene conceptos
     *
     * @return void Echo con array de conceptos
     */
    function cargarconceptosAction()
    {
        $result = array(array('concepto' => 'N', 'nombreconcepto' => 'Ninguno'),
                        array('concepto' => '+', 'nombreconcepto' => "Entrada"),
                        array('concepto' => '-', 'nombreconcepto' => "Salida"));
        echo(json_encode(array('datos' => $result)));
    }

    /**
     * Elimina documento
     *
     * @return void Echo con mensaje de confirmación
     */
    public function eliminardocumentoAction()
    {
        if (strpos($this->_request->getPost('iddoc'), ',')) {
            $elementos = split(",", $this->_request->getPost('iddoc'));
            foreach ($elementos as $elem) {
                $datDocumentoprim = new DatDocumentoprim();
                $datDocumentoprim = Doctrine::getTable('DatDocumentoprim')
                    ->find($elem);
                if ($this->model[1]->eliminarDatDocumentoprim($datDocumentoprim) === '-4') {
                    echo("{'codMsg':-4}");
                    return;
                }
                unset($datDocumentoprim);
            }
            echo("{'codMsg':-2}");
        } else {
            $datDocumentoprim = new DatDocumentoprim();
            $datDocumentoprim = Doctrine::getTable('DatDocumentoprim')->find(
                $this->_request->getPost('iddoc')
            );
            if ($this->model[1]->eliminarDatDocumentoprim($datDocumentoprim) === '-4') {
                echo("{'codMsg':-4}");
            } else {
                echo("{'codMsg':-1}");
            }
        }
    }

    /**
     * Elimina nomenclador de documento primario
     *
     * @return void Echo con mensaje de confirmación
     */
    public function eliminarNomencladorDocumentoPrimarioAction()
    {
        $idndocumentos = $this->_request->getPost('iddocumentos');
        $cantdoc = DocumentoModel::obtenerdocporID($idndocumentos);
        if ($cantdoc >= 1) {
            echo("{'codMsg':-3}");
        } else {
            DocumentoModel::eliminarnDocumento($idndocumentos);
            echo("{'codMsg':-1}");
        }
    }

    /**
     * Adiciona documento
     *
     * @return void Echo con mensaje de confirmación
     */
    function insertardocumentoAction()
    {
        $flagTodosInsertados = true;
        if (strpos($this->_request->getPost('iddocumentos'), ',')) {
            $elementos = explode(",", $this->_request->getPost('iddocumentos'));
            $siglas = explode(",", $this->_request->getPost('sigla'));
            $numInicial = explode(",", $this->_request->getPost('numinicial'));
            $idespaciotrabajo = explode(
                ",", $this->_request->getPost('idespaciotrabajo')
            );
            $idgestordocumental = explode(
                ",", $this->_request->getPost('idgestordocumental')
            );
            $dirreporte = explode(",", $this->_request->getPost('dirreporte'));
            foreach ($elementos as $i => $v) {
                $datDocumentoprim = new DatDocumentoprim();
                $datDocumentoprim->iddocumentos = $v;
                $datDocumentoprim->sigla = $siglas[$i];
                $datDocumentoprim->numinicial = $numInicial[$i];
                $datDocumentoprim->idespaciotrabajo = $idespaciotrabajo[$i];
                $datDocumentoprim->idgestordocumental = $idgestordocumental[$i];
                $datDocumentoprim->dirreporte = $dirreporte[$i];
                $datDocumentoprim->idestructurasubsist
                    = $this->_request->getPost('idestructurasubsist');
                if (!$this->model[1]->insertarDatDocumentoprim(
                    $datDocumentoprim
                )
                ) {
                    $flagTodosInsertados = false;
                }
            }
            if ($flagTodosInsertados) {
                echo "{'retorno':1}";
            } else {
                echo "{'retorno':2}";
            }
        } else {
            $iddocumentos = $this->_request->getPost('iddocumentos');
            $idespaciotrabajo = $this->_request->getPost('idespaciotrabajo');
            $idgestordocumental = $this->_request->getPost(
                'idgestordocumental'
            );
            $datDocumentoprim = new DatDocumentoprim();
            $datDocumentoprim->iddocumentos = $iddocumentos;
            $datDocumentoprim->idespaciotrabajo = $idespaciotrabajo;
            $datDocumentoprim->idgestordocumental = $idgestordocumental;
            $datDocumentoprim->sigla = $this->_request->getPost('sigla');
            $datDocumentoprim->numinicial = $this->_request->getPost('numinicial');
            $datDocumentoprim->idestructurasubsist = $this->_request->getPost(
                'idestructurasubsist'
            );
            if (!$this->model[1]->insertarDatDocumentoprim(
                $datDocumentoprim
            )
            ) { //esta llamada es la que inserta si se puede.
                echo "{'retorno':2}";
            } else {
                echo "{'retorno':1}";
            }
        }
    }

    /**
     * Adiciona documento
     *
     * @return void Echo con mensaje de confirmación
     */
    function insertardocumentoHeredarAction()
    {
        $seleccions = json_decode(
            stripcslashes($this->_request->getPost('seleccions'))
        );
        $identidad = $this->_request->getPost('idestructura');
        $identidad = ($identidad) ? $identidad : $this->global->Estructura->idestructura;
        foreach ($seleccions as $documento) {
            $idsubsist = $documento->idsubsistema;
            $estructuraSubsist = $this->integrator->datosmaestros->buscarEstructuraSubsit($identidad, $idsubsist);
            $idEstructuraSubsist = $estructuraSubsist[0]['idestructurasubsist'];
            $flagTodosInsertados = true;
            $datDocumentoprim = new DatDocumentoprim();
            $datDocumentoprim->iddocumentos = $documento->iddocumentos;
            $datDocumentoprim->sigla = $documento->sigla;
            $datDocumentoprim->numinicial = $documento->numinicial;
            $datDocumentoprim->idestructurasubsist = $idEstructuraSubsist;
            if (!$this->model[1]->insertarDatDocumentoprim($datDocumentoprim)) {
                $flagTodosInsertados = false;
            }
        }
        if ($flagTodosInsertados) {
            echo "{'retorno':1}";
        } else {
            echo "{'retorno':2}";
        }
    }

    /**
     * Modifica documento
     *
     * @return void Echo con mensaje de confirmación
     * @throws ZendExt_Exception
     */
    function modificardocumentoAction()
    {
        try {
            $datDocumentoprim = Doctrine::getTable('DatDocumentoprim')->find(
                $this->_request->getPost('iddoc')
            );
            if ($this->_request->getPost('version')
                != $datDocumentoprim->version
            ) {
                throw new ZendExt_Exception('CONFCONCURR');
            }
            $datDocumentoprim->sigla = $this->_request->getPost('sigla');
            $datDocumentoprim->numinicial = $this->_request->getPost('numinicial');
            $datDocumentoprim->idespaciotrabajo = $this->_request->getPost(
                'espacioTrabajo'
            );
            $datDocumentoprim->idgestordocumental = $this->_request->getPost(
                'idgestordocumental'
            );
            $datDocumentoprim->dirreporte = $this->_request->getPost('dirreporte');
            $datDocumentoprim->save();
            echo("{'codMsg':-1}");
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF143', $ee);
        }
    }

    /**
     * Obtiene documentos
     *
     * @return void Echo con documentos
     */
    function cargarselectAction()
    {
        $nomenclador = $this->getRequest()->getParams();
        $class = new $nomenclador ['nomenclador'];
        $elementos = $class->buscar($this->_request->getPost());
        echo(json_encode($elementos));
    }

    /**
     * Adiciona nomenclador de documento primario
     *
     * @return void Echo con mensaje de confirmación
     */
    public function insertarnomdocAction()
    {
        $doc = new NomDocprim();
        $doc->denominacion = $this->_request->getPost('denominacion');
        $doc->abreviatura = $this->_request->getPost('abreviatura');
        $doc->concepto = $this->_request->getPost('concepto');
        $codigo = $this->_request->getPost('codigo');
        if (!empty($codigo)) {
            $doc->codigo = $this->_request->getPost('codigo');
        } else {
            $doc->codigo = '-';
        }
        if ($this->model[0]->insertarDocumento($doc) === '-4') {
            echo("{'codMsg':-4}");
            return;
        }
        echo("{'codMsg':-1}");
    }

    /**
     * Modifica nomenclador de documento primario
     *
     * @return void Echo con mensaje de confirmación
     * @throws ZendExt_Exception
     */
    public function modificarnomdocAction()
    {
        try {
            $pIdDocumento = $this->_request->getPost('iddocumentos');
            $objNomDocprim = Doctrine::getTable('NomDocprim')->find(
                $pIdDocumento
            );
            $objNomDocprim->denominacion = $this->_request->getPost(
                'denominacion'
            );
            $objNomDocprim->abreviatura = $this->_request->getPost(
                'abreviatura'
            );
            $objNomDocprim->concepto = $this->_request->getPost('concepto');
            $codigo = $this->_request->getPost('codigo');

            if (!empty($codigo)) {
                $objNomDocprim->codigo = $codigo;
            } else {
                $objNomDocprim->codigo = '-';
            }
            $cantdoc = DatDocumentoprim::yaExisteDocumentoAsociadoSubsistema(
                $pIdDocumento
            );
            if ($cantdoc >= 1) {
                echo("{'codMsg':-2}");
                return;
            } else {
                $result = DocumentoModel::modificar(
                    $objNomDocprim, $pIdDocumento
                );
                echo("{'codMsg':$result}");
                return;
            }
        } catch (Exception $ex) {
            throw new ZendExt_Exception('CONF145', $ex);
        }
    }

    /**
     * Obtiene gestión documental
     *
     * @return void Echo con documentos
     */
    public function cargarGestDocumentalAction()
    {
        $responseAlfresco = $this->integrator->gestordocumental->estaAutenticadoUsuarioActual();
        if ($responseAlfresco == 1) {
            $documentos = $this->integrator->gestordocumental->obtenerTiposDocumentos();
            echo(json_encode($documentos));
        } else {
            echo(json_encode(-2));
        }
    }

    /**
     * Obtiene \xE1rbol de espacios de trabajo
     *
     * @return void Echo con espacios de trabajo
     */
    public function cargarTreeEspTrabajoAction()
    {
        try {
            $node = $this->_request->getPost('node');
            $responseAlfresco = $this->integrator->gestordocumental->estaAutenticadoUsuarioActual();
            if ($responseAlfresco == 1) {
                if (!empty($node) || $node != 0) {
                    $espTrabajo = $this->integrator->gestordocumental->obtenerEspaciosTrabajo($node);
                } else {
                    $espTrabajo = $this->integrator->gestordocumental->obtenerEspaciosTrabajo(0);
                }
                echo(json_encode($espTrabajo));
            } else {
                echo(json_encode(-2));
            }
        } catch (Exception $e) {
            echo('-2');
        }
    }

    /**
     * Verifica que se encuentre integrado el gestor documental
     *
     * @return void Echo con mensaje de confirmación
     */
    public function integradoGestorDocumentalAction()
    {
        try {
            if (self::testGD()) {
                echo('-1');
                return;
            } else {
                echo('-2');
                return;
            }
        } catch (Exception $e) {
            echo('-2');
        }
    }

    /**
     * Elimina un nodo en Alfresco, sea un documento o espacio de trabajo
     *
     * @author Ing. Lisvany Alonso Martinez
     */
    public function eliminarEspTrabajoAction()
    {
        $arrayId = array();
        $arrayId[] = $this->_request->getPost('idEspW');
        $tmp = $this->integrator->gestordocumental->eliminarElementosContenido($arrayId);
        if ($tmp) {
            echo("{'codMsg':-1}");
        } else {
            echo("{'codMsg':-2}");
        }
    }

    /**
     * Verifica código, servidor y auntenticacion del gestor documental
     *
     * @author Ing. Lisvany Alonso Martinez
     * @return bool
     */
    private function testGD()
    {
        try {
            $dirindex = $_SERVER['SCRIPT_FILENAME'];
            $gestordocumental
                = substr($dirindex, 0, strrpos($dirindex, 'web'))
                . 'apps/gestordocumental/comun/recursos/xml/ioc.xml';
            $alfresco = realpath(dirname(__FILE__))
                . '/../../../../lib/Alfresco/Alfresco/Service/ConfiguracionesGD/ConfiguracionGD.php';
            if (file_exists($gestordocumental) && file_exists($alfresco)) {
                include_once $alfresco;
                $configuracion = new ConfiguracionGD(
                    (string)Zend_Registry::getInstance()->config->xml->RepositorioAlfresco
                );
                $data = parse_url($configuracion->obtenerDireccionRepositorio() . 'api');
                $fp = fsockopen($data['host'], isset($data['port']) ? $data['port'] : 80, $errno, $errstr, 30);
                if ($fp) {
                    /*$this->integrator->gestordocumental->estaAutenticadoUsuarioActual()*/
                    $autenticacion = $this->integrator->gestordocumental->obtenerAutenticacion();
                }
                if ($autenticacion) {
                    return true;
                }
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }


    private function testJasper()
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $jasper = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'lib/JasperReports/JasperClient/class/Jaspersoft/Config/data.ini';
        if (file_exists($jasper)) {
            return true;
        }
        return false;
    }

    /**
     * Guarda los documentos configurados para la entidad actual como una plantilla
     * para ser usados posteriormente por otra entidad
     */
    public function crearPlantillaAction()
    {
        $result = $this->model[1]->crearPlantilla($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Obtiene la información de una platilla determinada y la inserta para la entidad
     * actual
     */
    public function usarPlantillaAction()
    {
        $result = $this->model[1]->usarPlantilla($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Lista las plantillas creadas para este componente
     */
    public function listarPlantillaAction()
    {
        $result = $this->model[1]->listarPlantillas($this->_request->getPost());
        echo(json_encode($result));
    }

}
