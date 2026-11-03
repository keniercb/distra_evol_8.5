<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Controller
 * @copyright  XETID
 * @version    1.0
 */
class FormatosController extends ZendExt_Controller_Secure
{

    /**
     * Constuctor de la clase
     */
    function init()
    {
        $this->model[] = new FormatoModel();
        $this->model[] = new ParteformatoModel();
        parent::init();
    }

    /**
     * Gestionar Formatos
     *
     */
    function gestionarformatosAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        if (!$idestructura) {
            throw new ZendExt_Exception('CONF116');
        }
        $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($idestructura);
        if (count($subsistemas) > 0) {
            $this->render();
        } else {
            $this->exception = new ZendExt_Exception('CONFE011');
            $flashMessenger = $this->_helper->_flashMessenger;
            $flashMessenger->addMessage($this->exception->getIdException());
            $flashMessenger->addMessage($this->exception->getDescription());
            $flashMessenger->addMessage($this->exception->getMessage());
            $this->render('info');
        }
    }

    /**
     * Gestionar excepción controlada
     *
     */
    public function getexcepcioncontroladaAction()
    {
        $dataException = $this->_helper->_flashMessenger->getMessages();
        echo("{detalles: '$dataException[1]', 'message': '$dataException[2]'}");
    }

    /**
     * Cargar subsistema
     *
     */
    function cargarsubsistemaAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
        $subsistema = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($idestructura);
        $arrsubsistemas = array();
        foreach ($subsistema as $i => $value) {
            $value = '';
            $arrsubsistemas[] = array('idsubsistema' => $subsistema[$i]->NomSubsistema[idsubsistema],
                                      'descripcion'  => $subsistema[$i]->NomSubsistema[denominacion]);
        }
        echo(json_encode(array('datos'=>$arrsubsistemas,'total'=>count($arrsubsistemas))));
    }

    /**
     * Cargar
     *
     * @throws Doctrine_Exception $ee
     */
    function cargarAction()
    {
        try {
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
            $filters = array(
                'nombre'            => $this->_request->getPost('nombre'),
                'descripcion'       => $this->_request->getPost('descripcion'),
                'separador'         => $this->_request->getPost('separador'),
                'sfFiltro'          => $this->_request->getPost('sfFiltro'),
                'start'             => ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0,
                'limit'             => ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20,
                'idestructuracomun' => $idestructura);
            $el = $this->model[0]->CargarFormatos($filters);
            $cantidad = $this->model[0]->CantidadFormatos($filters);
            $elementos = array('cant' => $cantidad, 'datos' => $el);
            echo(json_encode($elementos));
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF112', $ee);
        }
    }

    /**
     * Cargar formatos a heredar
     *
     */
    public function cargarFormatosHeredarAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model[0]->cargarFormatosHeredar($post);
        echo json_encode($data);
    }

    /**
     * Heredar formatos
     *
     */
    public function heredarFormatosAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model[0]->heredarFormatos($post);
        echo json_encode($data);
    }

    /**
     * Cargar partes
     *
     * @throws Doctrine_Exception $ee
     */
    function cargarpartesAction()
    {
        try {
            $elementos = DatParteformato::getParteFormato(
                array(
                    'idformato' => $this->_request->getPost('idformato')
                ),
                $this->_request->getPost('limit'), $this->_request->getPost('start')
            );


            echo(json_encode($elementos));
            return;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF113', $ee);
        }
    }

    /**
     * Insertar formato
     *
     *
     * @throws Exception Excepci&oacute;n ocurrida durante la operaci&oacute;n.
     */
    public function insertarformatoAction()
    {
        try {
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
            $datFormato = new DatFormato();
            $datFormato->nombre = $this->_request->getPost('nombre');
            $datFormato->descripcion = $this->_request->getPost('descripcion');
            $datFormato->version = 0;
            $datFormato->separador = $this->_request->getPost('separador');
            $datFormato->idsubsistema = $this->_request->getPost('idsubsistema');
            $datFormato->idestructuracomun = $idestructura;
            $datFormato->nivelpais = ($this->_request->getPost('nivelpais')) ? 1 : null;
            if ($this->model[0]->insertarDatFormato($datFormato, $idestructura)) {
                echo("{'codMsg':-1}");
                return;
            } else {
                echo("{'codMsg':-2}");
                return;
            }
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Insertar nivel de formato
     *
     */
    public function inspformatoAction()
    {
        $condicion = $this->_request->getPost();
        $start = ($condicion['start']) ? $condicion['start'] : 0;
        $limit = ($condicion['limit']) ? $condicion['limit'] : 20;
        $elementos = DatParteformato::getParteFormato(array('idformato' => $condicion['idformato']), $limit, $start);
        $datParteFormato = new DatParteformato();
        $datParteFormato->nombre = $this->_request->getPost('nombre');
        $datParteFormato->abreviatura = $this->_request->getPost('abreviatura');
        $datParteFormato->nivel = $elementos['cant'] + 1;
        $datParteFormato->longitud = $this->_request->getPost('longitud');
        $datParteFormato->idformato = $this->_request->getPost('idformato');
        $datParteFormato->version = 0;
        $datParteFormato->idconfapertura = $this->_request->getPost('idconfapertura');
        if ($this->model[1]->insertarDatParteformato($datParteFormato)) {
            echo("{'codMsg':-1}");
        } else {
            echo("{'codMsg':-2}");
        }
    }

    /**
     * Eliminar formato
     *
     * @throws Doctrine_Exception $ee
     */
    public function eliminarformatoAction()
    {
        try {
            $post = $this->_request->getPost();
            $formatos = json_decode(stripslashes($post['formatos']));
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
            if (count($formatos) > 1) {
                foreach ($formatos as $elem) {
                    if ($elem->heredado == 0) {
                        $datFormato = new DatFormato();
                        $datFormato = Doctrine::getTable('DatFormato')->find($elem->idformato);
                        $result = $this->model[0]->eliminarDatFormato($datFormato);
                        if ($result === '-4') {
                            echo("{'codMsg':-4}");
                            return;
                        }
                        if (!$result) {
                            unset($datFormato);
                        }
                    } else {
                        $result = DatFormatoEntidadModel::Eliminar($elem->idformato, $idestructura);
                    }
                }

                echo("{'codMsg':-1}");
                return;
            } else {
                $datFormato = new DatFormato();
                if ($formatos[0]->heredado == 0) {
                    $datFormato = Doctrine::getTable('DatFormato')->find($formatos[0]->idformato);
                    $result = $this->model[0]->eliminarDatFormato($datFormato);
                    if ($result === '-4') {
                        echo("{'codMsg':-4}");
                        return;
                    }
                } else {
                    $result = DatFormatoEntidadModel::Eliminar($formatos[0]->idformato, $idestructura);
                }
                if ($result) {
                    echo("{'codMsg':-2}");
                    return;
                } else {
                    echo("{'codMsg':-3}");
                    return;
                }
            }
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode == 23503) {
                return '-4';
            }
        }
    }


    /**
     * Eliminar parte formato
     *
     * @throws Doctrine_Exception $ee
     */
    public function eliminarparteformatoAction()
    {
        try {
            if (strpos($this->_request->getPost('idparteformato'), ',')) {
                $elementos = split(",", $this->_request->getPost('idparteformato'));
                foreach ($elementos as $i => $elem) {
                    $i++;
                    $datParteFormato = new DatParteformato();
                    $datParteFormato = Doctrine::getTable('DatParteFormato')->find($elem);
                    $datParteFormato->idparteformato = $elem;
                    $this->model[1]->eliminarDatParteFormato($datParteFormato);
                    unset($datParteFormato);
                }
                echo("{'codMsg':-2}");
            } else {
                $datParteFormato = new DatParteformato();
                $datParteFormato = Doctrine::getTable('DatParteFormato')
                    ->find($this->_request->getPost('idparteformato'));
                $condicion = $this->_request->getPost();
                $start = ($condicion['start']) ? $condicion['start'] : 0;
                $limit = ($condicion['limit']) ? $condicion['limit'] : 20;
                $elementos = DatParteformato::getParteFormato(
                    array('idformato' => $condicion['idformato']), $limit, $start
                );
                $datos = $elementos['datos'];
                $post = 0;
                foreach ($datos as $key => $value) {
                    if ($datParteFormato['idparteformato'] == $value['idparteformato']) {
                        $post = $key;
                        break;
                    }
                }
                if ($post + 1 == $elementos['cant']) {


                    if ($this->model[1]->eliminarDatParteformato($datParteFormato)) {

                        echo("{'codMsg':-1}");
                    } else {

                        echo("{'codMsg':-3}");
                        return;
                    }
                } else {
                    echo("{'codMsg':-4}");
                    return;
                }
            }
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode == 23503) {
                return '-4';
            }
        }
    }

    /**
     * Modificar formato
     *
     * @throws Doctrine_Exception $ee
     */
    function modificarformatoAction()
    {
        try {
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
            $datFormato = new DatFormato();
            $datFormato = Doctrine::getTable('DatFormato')->find($this->_request->getPost('idformato'));
            $datFormato->nombre = $this->_request->getPost('nombre');
            $datFormato->descripcion = $this->_request->getPost('descripcion');
            $datFormato->separador = $this->_request->getPost('separador');
            $datFormato->idformato = $this->_request->getPost('idformato');
            $datFormato->idsubsistema = $this->_request->getPost('idsubsistema');
            if ($this->_request->getPost('nivelpais')) {
                $datFormato->nivelpais = 1;
            } else {
                $datFormato->nivelpais = 0;
            }
            $datFormato->version = $this->_request->getPost('version');
            if ($this->model[0]->modificarDatFormato($datFormato,$idestructura)) {
                echo("{'codMsg':-1}");
            } else {
                echo("{'codMsg':-2}");
                return;
            }
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode == 23503) {
                return '-4';
            }
        }
    }

    /**
     * Modificar parte formato
     *
     * @throws Doctrine_Exception $ee
     */
    function modificarparteformatoAction()
    {
        try {
            $datParteFormato = new DatParteformato();
            $datParteFormato = Doctrine::getTable('DatParteFormato')->find($this->_request->getPost('idparteformato'));
            $datParteFormato->idparteformato = $this->_request->getPost('idparteformato');
            $datParteFormato->nombre = $this->_request->getPost('nombre');
            $datParteFormato->abreviatura = $this->_request->getPost('abreviatura');

            $datParteFormato->longitud = $this->_request->getPost('longitud');
            $datParteFormato->idformato = $this->_request->getPost('idformato');
            $datParteFormato->version = $this->_request->getPost('version');
            $datParteFormato->idconfapertura = $this->_request->getPost('idconfapertura');;


            if ($this->model[1]->modificarDatParteformato($datParteFormato)) {

                echo("{'codMsg':-1}");
            } else {

                echo("{'codMsg':-2}");
                return;
            }
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode == 23503) {
                return '-4';
            }
        }
    }

    /**
     * Verificar formato
     *
     */
    function verifdatejformatAction()
    {
        $ejercicio = DatFormato::buscarFormato(array('idformato' => $this->_request->getPost('idformato')));


        if ($ejercicio['datos'][0]['nombre'] == $this->_request->getPost('nombre')
            && $ejercicio['datos'][0]['descripcion'] == $this->_request->getPost('descripcion')
            && $ejercicio['datos'][0]['separador'] == $this->_request->getPost('separador')
            && $ejercicio['datos'][0]['nivelpais'] == $this->_request->getPost('nivelpais')
            && $ejercicio['datos'][0]['idsubsistema'] == $this->_request->getPost('idsubsistema')
        ) {

            echo("{'retorno': '1'}");
            return;
        }
        echo("{'retorno': '0'}");
        return;
    }

    /**
     * Verificar parte formato
     *
     */
    function verifdatpartformAction()
    {
        $periodo = DatParteformato::buscarParteFormato(
            array('idparteformato' => $this->_request->getPost('idparteformato'))
        );

        if (
            $periodo['datos'][0]['nombre'] == $this->_request->getPost('nombre')
            && $periodo['datos'][0]['abreviatura'] == $this->_request->getPost('abreviatura')
            && $periodo['datos'][0]['idconfapertura'] == $this->_request->getPost('idconfapertura') &&
            $periodo['datos'][0]['longitud'] == $this->_request->getPost('longitud')
        ) {
            echo("{'retorno': '-1'}");
            return;
        }
        echo("{'retorno': '0'}");
    }

    function cargarAperturasAction(){
        $post = $this->_request->getPost();
        $result = $this->model[0]->cargarAperturas($post);
        echo json_encode($result);
    }
}
