<?php
/**
 * Gestión de transporte
 * Clase para gestionar la disponibilidad de los medios de transporte
 *
 * @version 1.0
 * @autor   Jorge Luis Cuellar Mondeja
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}



class ControldisponibilidadController extends BaseController// ZendExt_Controller_Secure
{

//    private $serviciosAyuda; /-------*/
    private $model;

    /**
     * Función para inicializar el componente (constructor)
     *
     * @return void
     */
    public function init()
    {
        parent::init('log.aft.cdt');
//        $this->view->jsayuda = $this->serviciosAyuda->getJSAyuda();
        $this->model = new ControlDisponibilidadModel();
    }

    /**
     * Función para mostrar el componente
     *
     * @return void
     */
    public function controldisponibilidadAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.cdt');
        $this->rendertemplate();
    }

    public function getMarcasAction()
    {
        $this->datos = $this->model->GetTodasMarcas();
    }

    public function getModelosAction()
    {
        $idmarca = $this->uiParams['idmarca'];
        $this->datos = $this->model->GetModelos($idmarca);
    }

    public function getEstatusAction()
    {
        $this->datos = $this->model->GetEstatus();
    }

    public function getEstatusOperativoAction()
    {
        $idestatus = $this->uiParams['idestatus'];
        $this->datos = $this->model->getEstatusOperativos($idestatus);
    }

    /**
     * Función para mostrar los medios de transporte registrados en la entidad
     *
     * @param array $post Todos los parámetros de filtrado que se quiera pasar al método para parametrizarlo
     *
     * @return json(array(datos))
     */
    public function mostrarMediosTransporteAction()
    {
        //Por favor no tocar mas, yoendy
        try {
            $parametros = $this->uiParams;
            $idestructuras = json_decode($parametros['estructuras']);
            $datosEviar = Array();

            $parametros['estructuras'] = $idestructuras;

            if (count($parametros['estructuras']) > 0) {
                $parametros['disponibilidad'] = true;

                $formatos = $this->configuracionHelper->BuscarFormatosPorSubsist(
                    $this->global->Estructura->idestructura, 2
                );

                $newArreglo = array();
                foreach ($formatos as &$formato) {
                    $partes = $this->configuracionHelper->BuscarParteFormato(
                        $formato->idformato
                    );
                    foreach ($partes as $key => $parte) {
                        $formato->partes[$key]->nivel = $key + 1;
                        $formato->partes[$key]->longitud = $parte->longitud;
                        $formato->partes[$key]->nombre = $parte->nombre;
                    }
                    $formato->ultimonivel = $key;
                    $newArreglo[$formato->idformato] = $formato;
                }
                $formatosColumnID = $newArreglo;
                // En la variable $formatosColumnID tengo un arreglo asociativo, donde cada posicion es el id de un formato
                // y lo que tiene son todos los datos del formato con las partes_formatos, es decir los niveles.

                $datos = $this->model->getDatosTreeGridDisponibilidadSql(
                    $parametros, $formatosColumnID
                );

                foreach ($datos as $k => &$dato) {

                    $arreglo = explode("-", $dato['descripcionmarcamodelo']);
                    $dato['marca'] = trim($arreglo[0]);
                    $dato['modelo'] = trim($arreglo[1]);

                    ($dato['idregnumerico']) ? ($dato['idmostrar'] = $dato['idregnumerico']) : ($dato['idmostrar'] = $dato['nroserie']);

                    if (!$dato['idmostrar']) {
                        $dato['idmostrar'] = $dato['idindicador'];
                    }

                    if (!$dato['leaf'] || ($dato['leaf'] && $dato['idregnumerico'])
                    ) {
                        $datosEviar[] = $dato;
                    }
                }
                $this->datos = $datosEviar;
                // echo json_encode(array('data' => $datosEviar));
            } else {
                //echo json_encode(array('data' => array()));
                $this->datos = array();
            }
        } catch (Doctrine_Exception $e) {
            echo $e;
        }
    }

    /**
     * Función para modificar el estado de un medio de transporte registrado en la entidad (disponible/no disponible)
     *
     * @param array $post Todos los parámetros de identificación del medio a modificar y el nuevo valor
     *
     * @return json(array(failure, success, error))
     */
    public function modificarEstadoMedioAction()
    {

        try {
            ControlDisponibilidadModel::ModificarEstadoMedio(
                $this->uiParams
            );
            $this->cod = 1;
        } catch (Doctrine_Exception $e) {
            $this->cod = 3;
            $this->error = $e->getMessage();
        }
    }

    /**
     * Función para mostrar un resumen de disponibilidad de los medios de transporte registrados en la entidad
     *
     * @param array $post Todos los parámetros de filtrado que se quiera pasar al método para parametrizarlo
     *
     * @return json(array(datos, total))
     */
    public function mostrarResumenAction()
    {
        $this->autoShow = false;
        $params = $this->uiParams;
        $idestructuras = json_decode($params['estructurasIn']);
        $parametros['estructuras'] = $idestructuras;

        $parametros['idindicador'] = $params['nodo'];

        $data = $this->model->GetDisponibilidadTransporte(
            $parametros
        );

        //$this->datos = $data;
        echo json_encode($data);
        /*echo json_encode(array('total' => count($data),
                'cantidad' => count($data),
                'datos' => $data));







        $this->autoShow = false;
        try {
            //2 --> es el idsubsistema de configuracion general.
            $formatos = $this->configuracionHelper->BuscarFormatosPorSubsist(
                $this->global->Estructura->idestructura, 2
            );
            $newArreglo = array();

            foreach ($formatos as &$formato) {
                $partes = $this->configuracionHelper->BuscarParteFormato(
                    $formato->idformato
                );

                foreach ($partes as $key => $parte) {
                    $formato->partes[$key]->nivel = $key + 1;
                    $formato->partes[$key]->longitud = $parte->longitud;
                    $formato->partes[$key]->nombre = $parte->nombre;
                }

                $formato->ultimonivel = $key;
                $newArreglo[$formato->idformato] = $formato;
            }
            $formatosColumnID = $newArreglo;
            $parametros = $this->uiParams;
            $parametros['formatos'] = $formatosColumnID;

            $idestructuras = json_decode($parametros['estructurasIn']);

            $parametros['estructuras'] = $idestructuras;

            //print_r($parametros);

            $data = $this->model->GetDisponibilidadTransporte(
                $parametros
            );
            echo json_encode($data);
        } catch (Doctrine_Exception $e) {
            echo $e;
        }*/


    }

    /**
     * Función para mostrar dado un estado técnico de un medio de transporte registrados en la entidad, los estados
     * operativos correspondientes
     *
     * @param array $post Todos los parámetros de filtrado que se quiera pasar al método para parametrizarlo
     *
     * @return json(array(datos))
     */
    public function getSubEstatusAction()
    {
        $this->datos = ControlDisponibilidadModel::GetSubEstatus($this->uiParams);
    }

    /**
     * Función exportar en formato excel un resumen del estado técnico de los medios de transporte registrados en la
     * entidad
     *
     * @return void
     */
    public function exportarResumenAction()
    {

        ControlDisponibilidadModel::ExportarResumen();
    }

    /**
     * Función para mostrar las estructuras internas del sistema
     *
     * @param node  parámetro de filtrado para mostrar las estructuras correspondientes
     *
     * @return json(array(datos))
     */
    public function getEntidadesDelDominioAction()
    {
        $this->autoShow = false;
        $global = ZendExt_GlobalConcept::getInstance();
        $nodo = $this->uiParams['node'];
        $checked = $this->uiParams['checked'];
        $nodo = ($nodo == -1) ? 0 : ($nodo);
        $inicio = false;
        if (!$nodo) {
            $inicio = true;
            $nodo = $global->Estructura->idestructura;
        }
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idestructuracomun = $nodo;
        $dominios = $security->getDomain($idestructuracomun);
        /*$ent = $this->estructuraHelper->getEstructura(
            $global->Estructura->idestructura
        );*/
        $ent = $this->integrator->metadatos->DameEstructura($global->Estructura->idestructura);
        $denominacion = $ent[0]->text;
        $arearesp = new GestarearesponsabilidadModel();
        $datos = $arearesp->getAreaById(
                $nodo, $global->Estructura->idestructura
        );

        foreach ($datos as &$value) {
            $value['entidad'] = $denominacion;
            if ($inicio) {
                $value['checked'] = false;
            } else {
                $value['checked'] = ($checked) ? true : false;
            }
        }

        echo json_encode($datos);
    }

    public function getentidadAction()
    {
        /*$ent = $this->estructuraHelper->getEstructura(
            $this->global->Estructura->idestructura
        );*/
        $ent = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
        $this->entidad = $ent[0]->denominacion;
        $this->identidad = $ent[0]->idestructura;
    }

}
