<?php
/**
 * Componente que gestiona las especialidades por subsistemas 
 * 
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Especialidad/Controllers
 * @version    1.0
 */
class ArbolespecialidadController extends ZendExt_Controller_Secure
{
   /**
     * Constructor de la clase
     */
    public function indexAction() 
    {
        parent::init();
    }
   /**
     * Arbol especialidad
     * 
     * Renderiza el arbol de especialidades 
     */
    public function arbolespecialidadAction() 
    {
        $this->render();
    }

    /**
     * carga el arbol de especialidades
     * 
     */
    public function cargararbolespecialidadesAction() 
    {
        $node = $this->_request->getPost('node'); //se obtiene el nodo desplegado
        $where = ($node) ? "idpadre = $node AND idespecialidad <> idpadre" : "idespecialidad = idpadre";
        $objNomAdt = new ZendExt_Nomencladores_ADT();
        $result = $objNomAdt->get('nom_especialidad', 0, 0, $where, '', 'mod_datosmaestros');
        for ($i = 0; $i < count($result); $i++) {
            $result[$i]['text'] = $result[$i]['codespecialidad'] . ' ' . $result[$i]['denespecialidad'];
            $result[$i]['id'] = $result[$i]['idespecialidad'];
            $result[$i]['idparend'] = $result[$i]['idpadre'];
            $result[$i]['leaf'] = ($result[$i]["ordender"] - $result[$i]["ordenizq"] == 1) ? 1 : 0;
        }
        echo json_encode($this->orderMultiDimensionalArray($result, 'text'));
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

}