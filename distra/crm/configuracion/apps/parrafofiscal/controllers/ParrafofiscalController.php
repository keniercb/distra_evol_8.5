<?php

/**
 * Clase controladora de P\xE1rrafo Fiscal
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage P\xE1rrafoFiscal/Controllers
 * @copyright  XETID
 * @version    1.0-0
 */
class ParrafofiscalController extends ZendExt_Controller_Secure
{

    private $model;
    private $modelp;

    /**
     * Inicializa el padre y la clase
     */
    function init()
    {
        parent::init();
        $this->model = new ParrafofiscalModel();
        $this->modelp = new DatParrafoFiscalEntidadModel();
    }

    /**
     * Inicializa la vista
     */
    function gestionarparrafofiscalAction()
    {
        $formatos = $this->integrator->datosmaestros->buscarFormatosPorSubsist(
            $this->global->Estructura->idestructura, 4
        );
        if (count($formatos)) {
            /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
            $this->render();
        } else {
            $this->exception = new ZendExt_Exception('CONTB049');
            $flashMessenger = $this->_helper->_flashMessenger;
            $flashMessenger->addMessage($this->exception->getIdException());
            $flashMessenger->addMessage($this->exception->getDescription());
            $flashMessenger->addMessage($this->exception->getMessage());
            $this->render('info');
        }
    }

    /**
     * Obtiene una excepción controlada
     */
    public function getexcepcioncontroladaAction()
    {
        $dataException = $this->_helper->_flashMessenger->getMessages();
        echo("{detalles: '$dataException[1]', 'message': '$dataException[2]'}");
    }

    /**
     * Obtiene el \xE1rbol de P\xE1rrafo Fiscal
     *
     * @return void Echo con el \xE1rbol de p\xE1rrafos fiscales
     */
    function cargararbolAction()
    {
        $busqueda = 1;
        if ($this->_request->getPost('opcion') == 1) {
            if ($this->_request->getPost('node') != '0') {
                $tmp = explode('-', $this->_request->getPost('node'));
            }
            $parrafosFiscales = NomParrafoFiscal::cargarParrafosFiscales(
                $tmp[0]
            );
        } else {
            $filter = $this->_request->getPost('filter');
            $parrafosFiscales = ParrafofiscalModel::obtenerArbol(
                $filter, $busqueda
            );
        }
        $temp = array();
        if (!empty($parrafosFiscales)) {
            $cont = count($parrafosFiscales);
            for ($i = 0; $i < $cont; $i++) {
                $id = explode('-', $parrafosFiscales[$i]['id']);
                if (!isset($id[1]) || $id[1] == 'p') {
                    $get = $this->modelp->getPFEntidad(
                        $id[0], $this->global->Estructura->idestructura
                    );
                    $parrafosFiscales[$i]['id']
                        = $parrafosFiscales[$i]['id'] . '-p';
                    if ($get) {
                        $temp[0] = $parrafosFiscales[$i];
                        $temp[0]['id']
                            = $get[0]['idparrafofiscalentidad'] . '-e';
                        $temp[0]['leaf'] = 1;
                        $temp[0]['text'] = '<b>' . $temp[0]['text'] . '</b>';
                        $temp[0]['fechaini'] = $get[0]['fechaini'];
                        $temp[0]['fechafin'] = $get[0]['fechafin'];
                        $temp[0]['referencia'] = $get[0]['referencia'];
                        $parrafosFiscales[$i]['orden'] = 1;
                        $temp[0]['orden'] = 2;
                        $parrafosFiscales = array_merge(
                            $parrafosFiscales, $temp
                        );
                        $temp = array();
                    }
                }
            }
            foreach ($parrafosFiscales as $llave => $fila) {
                $codigo[$llave] = $fila['codigo'];
                $orden[$llave] = $fila['orden'];
            }
            array_multisort(
                $codigo, SORT_ASC, $orden, SORT_ASC, $parrafosFiscales
            );

            for ($i = 0; $i < count($parrafosFiscales); $i++) {
                $parrafosFiscales[$i]['padre']
                    = $parrafosFiscales[$i]['padre'] . '-p';
            }
        }
        $valor = (count($parrafosFiscales) > 0) ? $parrafosFiscales : $busqueda;
        echo(json_encode($valor));
    }

    /**
     * Obtiene el \xE1rbol de P\xE1rrafo Fiscal Original
     *
     * @return void Echo con un array conteniendo el \xE1rbol de p\xE1rrafo fiscal original
     */
    function cargararbolOriginalAction()
    {
        $nodo = explode('-', $this->_request->getPost('node'));
        $result = $this->model->devolverarbol(
            'mod_datosmaestros.nom_parrafofiscal', $nodo[0]
        );
        $temp = array();
        if (!empty($result)) {
            for ($i = 0; $i < count($result); $i++) {
                $id = explode('-', $result[$i]['id']);
                if (!isset($id[1]) || $id[1] == 'p') {
                    $get = $this->modelp->getPFEntidad(
                        $id[0], $this->global->Estructura->idestructura
                    );
                    $result[$i]['id'] = $result[$i]['id'] . '-p';
                    if ($get) {
                        $temp[0] = $result[$i];
                        $temp[0]['id']
                            = $get[0]['idparrafofiscalentidad'] . '-e';
                        $temp[0]['leaf'] = 1;
                        $temp[0]['text'] = '<b>' . $temp[0]['text'] . '</b>';
                        $temp[0]['fechaini'] = $get[0]['fechaini'];
                        $temp[0]['fechafin'] = $get[0]['fechafin'];
                        $temp[0]['referencia'] = $get[0]['referencia'];
                        $result[$i]['orden'] = 1;
                        $temp[0]['orden'] = 2;
                        $result = array_merge($result, $temp);
                        $temp = array();
                    }
                }
            }
            $result = $this->auxCargarArbolOriginal($result);
        }
        echo json_encode(array('result' => $result));
    }

    /**
     * Función auxiliar de "cargarArbolOriginal"
     *
     * @param array $result Árbol original
     *
     * @return array Árbol original
     */
    private function auxCargarArbolOriginal($result)
    {
        foreach ($result as $llave => $fila) {
            $codigo[$llave] = $fila['codigo'];
            $orden[$llave] = $fila['orden'];
        }
        array_multisort($codigo, SORT_ASC, $orden, SORT_ASC, $result);
        for ($i = 0; $i < count($result); $i++) {
            $result[$i]['padre'] = $result[$i]['padre'] . '-p';
        }
        return $result;
    }

    /**
     * Elimina uno o varios p\xE1rrafos fiscales
     *
     * @return void Echo con mensaje de confirmación
     */
    function eliminarAction()
    {
        $tmp = explode('-', $this->_request->getPost('idparrafofiscal'));
        if ($tmp[1] == 'e'
        ) {  // ---> Para que elimine cualquier cosa--> Lelo  16/02/2011
            $this->modelp->Eliminar($tmp[0]);
            echo '{"codMsgg":"1"}';
            return;
        } else {
            if ($this->model->eliminarNomParrafoFiscal($tmp[0])) {
                echo '{"codMsgg":"1"}';
                return;
            }
        }
    }

    /**
     * Adiciona un p\xE1rrafo fiscal
     *
     * @return void Echo con mensaje de confirmación,1 se adicionó correctamente,-3 no se adicionó
     */
    function insertarAction()
    {
        $datos = $this->_request->getPost();
        if ($this->_request->getPost('idpadre')) {
            $d = explode('-', $this->_request->getPost('idpadre'));
        }
        $datos['idpadre'] = $d[0];
        if ($this->model->adicionarNomParrafoFiscal($datos)) {
            echo '{"codMsgg":"-1"}';
            return;
        } else {
            echo '{"codMsgg":"-3"}';
            return;
        }//falta validar que el parrafo no este duplicado
    }

    /**
     * Modifica un p\xE1rrafo fiscal
     *
     * @return void Echo con mensaje de confirmación
     */
    function modificarAction()
    {
        /* el id de parrafo fiscal cuando viene concatenado con p representa un parrafo fiscal de la
        entidad rectora cuando viene
          concatenado con e es de la entidad */
        //$flagAddDatparrafofiscalEntidad;
        $datos = $this->_request->getPost();
        $tmpID = explode(
            '-', $this->_request->getPost('idparrafofiscal')
        ); //verificar cual p\xE1rrafo fiscal es o el de la entidad o el de la entidad rectora
        $datos['idparrafofiscal'] = $tmpID[0];
        /*verificar si cuando vayas a modificar un parrafo fiscal exista ya otro con el mismo 
        codigo(esto no se cumple para el parrafo de la entidad ya que no se le puede modificar el codigo).*/
        if ($datos['codigo'] && $tmpID[1] == 'p') {
            if (NomParrafoFiscal::verificar(
                    $datos['codigo'], $datos['idparrafofiscal'], $datos['nivel'], $datos['idpadre']
                ) > 0
            ) {
                echo '{"codMsgg":"-6"}';
                return;
            }
        }
        if ($tmpID[1] == 'p') {
            $this->model->modificarNomParrafoFiscal($datos);
            echo '{"codMsgg":"1"}';
            return;
        } else {
            $param = array();
            $param['idparrafofiscalentidad'] = $tmpID[0];
            $param['fechaini'] = $this->_request->getPost('fechaStart');
            $param['fechafin'] = $this->_request->getPost('pformfin');
            $param['referencia'] = $this->_request->getPost('referencia');
            if ($this->modelp->Modificar($param) === '-4') {
                echo '{"codMsgg":"-4"}';
                return;
            } else {
                echo '{"codMsgg":"1"}';
                return;
            }
        }
    }

    /**
     * Verifica la existencia de un p\xE1rrafo fiscal en la Base de Datos
     *
     * @return void Echo con mensaje de confirmación
     */
    public function verificarAction()
    {
        $tmp = explode('-', $this->_request->getPost('idparrafofiscal'));
        $fecha = NomParrafoFiscal::cargarTodosHijosParrafosFiscales(
            $this->_request->getPost('ordenizq'),
            $this->_request->getPost('ordender'),
            $this->_request->getPost('fechaini'),
            $this->_request->getPost('fechafin')
        );

        if ($fecha == 'fechainicio') {
            echo '{"modifico":"fechainicio"}';
            return;
        }
        if ($fecha == 'fechafin') {
            echo '{"modifico":"fechafin"}';
            return;
        }
        if ($tmp[1] == 'p') {
            $datos = array();
            $llave = array();
            $llave['idparrafofiscal'] = $tmp[0];
            $datos['idparrafofiscal'] = $tmp[0];
            $datos['codigo'] = $this->_request->getPost('codigo');
            $datos['referencia'] = $this->_request->getPost('referencia');
            $datos['descripcion'] = $this->_request->getPost('descripcion');
            $datos['fechaini'] = $this->_request->getPost('fechaini');
            $datos['fechafin'] = $this->_request->getPost('fechafin');
            $result = $this->model->verificar($datos, $llave);
        } else {
            $datos = array();
            $llave = $tmp[0];
            $datos['fechaini'] = $this->_request->getPost('fechaini');
            $datos['fechafin'] = $this->_request->getPost('fechafin');
            $datos['referencia'] = $this->_request->getPost('referencia');
            $result = $this->modelp->verificar($datos, $llave);
        }
        if (!$result) {
            echo '{"modifico":"nomodifico"}';
        } else {
            echo '{"modificotasa":"simodifico"}';
        }
    }

    /**
     * Valida que un p\xE1rrafo fiscal pertenezca a una determinada estructura común
     *
     * @return void Echo con mensaje de confirmación
     */
    public function validarAction()
    {
        $tmp = explode('-', $this->_request->getPost('idpadre'));
        $partes = $this->integrator->datosmaestros->buscarParteFormato(
            $this->_request->getPost('formato')
        );
        if ($this->_request->getPost('nivel') > count($partes)) {
            die('{"modifico":"noformato","codMsgg":"3"}');
        }
            //$idpadre = $tmp[0];
            $codigo = $this->_request->getPost('codigo');
        $idparrafofiscal
            = $this->_request->getPost('idparrafofiscal') != -1 ? explode(
            '-', $this->_request->getPost('idparrafofiscal')
        ) : null;
        $result = $this->model->validar(
                $codigo, $this->_request->getPost('descripcion'),
                $this->_request->getPost('nivel'), $idparrafofiscal[0], $tmp[0]
            );//
            if ($result == 'codigoEx') {
                echo '{"modifico":"codigoEx","codMsgg":"3"}';
                return;
            } elseif ($result == 'descripcionEX') {
                echo '{"modifico":"descripcionEX","codMsgg":"4"}';
                return;
            } else {
                echo '{"modificotasa":"siinserto"}';
                return;
            }

    }

    /**
     * Obtiene el formato de un p\xE1rrafo fiscal
     *
     * @return void Echo con un array de datos sobre el p\xE1rrafo fiscal
     */
    public function getformatoAction()
    {
        if ($this->_request->getPost('accion') == 'add'
            && $this->_request->getPost('nivel')
        ) {
            $partes = $this->integrator->datosmaestros->buscarParteFormato(
                $this->_request->getPost('formato')
            );
            //print_r($partes);die;
            if ($this->_request->getPost('nivel') > count($partes)) {
                $maxl = '{"maxl":0, "nivel":' . count($partes) . '}';
            } else {
                foreach ($partes as $parte) {
                    if ($this->_request->getPost('nivel') == $parte->nivel) {
                        $maxl = '{"maxl":' . $parte->longitud . '}';
                        break;
                    }
                }
            }
            echo $maxl;
        }
    }

    /**
     * Obtiene los formatos del subsistema
     *
     * @return void Echo con un array de formatos
     */
    public function obtenerformatosAction()
    {
        $formatos = $this->integrator->datosmaestros->buscarFormatosPorSubsist(
            $this->global->Estructura->idestructura, 4
        );
        echo json_encode(array('root' => $formatos));
    }

    /**
     * Obtiene los datos para el reporte
     *
     * @return void Echo con datos para el reporte
     */
    public function obtenerDatosImprimirReporteAction()
    {
        echo json_encode($this->model->obtenerDatosImprimirReporte());
        return;
    }

}
