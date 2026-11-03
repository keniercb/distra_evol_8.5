<?php
/**
 * Componente que gestiona las especialidades por subsistemas 
 * 
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Especialidad/Controllers
 * @version    1.0
 */
class EspecialidadController extends ZendExt_Controller_Secure
{

    private $model;
   /**
     * Constructor de la clase
     */
    function init() 
    {
        parent::init();
        $this->model = new EspecialidadModel();
    }
   /**
     * Gestionar especialidad
     * 
     */
    function gestionarespAction() 
    {
        try {
            /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
            $this->render();
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF201', $ee);
        }
    }
   /**
     * Cargar arbol
     * 
     */
    function cargararbolAction() 
    {
        $busqueda = 1;
        if ($this->_request->getPost('opcion') == 1) {
            $result = NomEspecialidad::cargarEspecialidades($this->_request->getPost('node'));
        } else {
            $filter = $this->_request->getPost('filter');
            $result = EspecialidadModel::obtenerArbol($filter, $busqueda);
        }
        $valor = (count($result) > 0) ? $result : $busqueda;
        echo (json_encode($valor));
    }
   /**
     * Cargar arbol original
     * 
     */
    function cargararboloriginalAction() 
    {
        $result = $this->model
        ->devolverarbolAction(
                'nom_especialidad', $this->_request
                ->getPost('node'), $this->_request->getPost('filter')
                );
        $resultOrdenado = $this->orderMultiDimensionalArray($result, 'codespecialidad', $inverse = false);
        if ($resultOrdenado != 0 && $resultOrdenado != 1 && $resultOrdenado != 2)
            echo (json_encode($resultOrdenado));
    }
   /**
     * Eliminar especialidad
     * 
     */
    function eliminarAction() 
    {
        $llave['idespecialidad'] = $this->_request->getPost('idespecialidad');
        if ($this->model->eliminarNomEspecialidad($llave['idespecialidad']) === '-4') {
            echo '{"codMsgg":"-4"}';
            return;
        } else {
            echo '{"codMsgg":"-1"}';
        }
    }
   /**
     * Insertar especialidad
     * 
     */
    function insertarAction() 
    {
        $result = $this->model->adicionarNomEspecialidad($this->_request->getPost());
        echo "{'codMsgg':'$result'}";
    }
   /**
     * Modificar especialidad
     * 
     */
    function modificarAction() 
    {
        $datos = $this->_request->getPost();
        $result = $this->model->modificarNomEspecialidad($datos);
        echo "{'codMsgg':'$result'}";
    }
  /**
     * Verificar especialidad
     * 
     */
    function verificarAction() 
    {
        $fecha = NomEspecialidad::cargarTodosHijosEspecialidad(
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

        $llave['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $datos['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $datos['codespecialidad'] = $this->_request->getPost('codespecialidad');
        $datos['abrevespecialidad'] = $this->_request->getPost('abrevespecialidad');
        $datos['denespecialidad'] = $this->_request->getPost('denespecialidad');
        $datos['orden'] = $this->_request->getPost('orden');
        $datos['fechaini'] = $this->_request->getPost('fechaini');
        $datos['fechafin'] = $this->_request->getPost('fechafin');
        $datos['controlmaterial'] = $this->_request->getPost('controlmaterial');
        if (!$this->model->verificar($datos, $llave))
            echo '{"modifico":"nomodifico","codMsgg":"3"}';
        else
            echo '{"modifico":"simodifico"}';
    }
   /**
     * Ordenar arreglo multidimensional
     * 
     * @param array $toOrderArray Arreglo a ordenar
     * @param int $field Indice de la fila
     * @param boolean $inverse Indica de que forma se quiere ordenar el arreglo
     * @return array Retorna un arreglo multidimensional ordenado  
     */
    public function orderMultiDimensionalArray($toOrderArray, $field, $inverse = false) 
    {
        foreach ($toOrderArray as $key => $row) {
            $position[$key] = $row[$field];
            $newRow[$key] = $row;
        }
        if ($inverse)
            arsort($position);
        else
            asort($position);
        foreach ($position as $key => $pos)
            $pos='';
            $returnArray[] = $newRow[$key];
        return $returnArray;
    }
   /**
     * Obtener datos para imprimir en el reporte
     * 
     */
    public function obtenerDatosImprimirReporteAction() 
    {
        echo json_encode($this->model->obtenerDatosImprimirReporte());
        return;
    }

}