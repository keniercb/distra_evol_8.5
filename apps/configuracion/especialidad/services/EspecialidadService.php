<?php

/**
 * Componente que gestiona las especialidades por subsistemas
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Especialidad/Services
 * @version    1.0
 */
class EspecialidadService extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function __construct()
    {

    }

    /**
     * Buscar especialidad por id
     *
     * @param int $idespecialidad Identificador de especialidad
     *
     * @return array Retorna un arreglo con los datos de la especialidad
     */
    public function BuscarPorId($idespecialidad)
    {
        $model = new EspecialidadModel();
        $result = $model->BuscarPorId($idespecialidad);
        $standart = new ZendExt_ClassStandard();
        return $standart->ArrayObject($result);
    }

    /**
     * Arboles especialidad
     *
     */
    public function arbolespecialidad()
    {
        $dircontroller = '/configuracion/especialidad/index.php/arbolespecialidad/arbolespecialidad';
        header("Location: $dircontroller");
    }

    /**
     * Obtener especialidades
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad
     */
    public function GetEspecialidadesHoja()
    {
        $model = new EspecialidadModel();
        return $model->GetEspecialidadesHoja(array('service' => '(ne.ordender - ne.ordenizq) = 1'));
    }

    /**
     * Obtener arbol especialidad
     *
     * @param int    $argIdEspecialidad Identificador de la especialidad
     * @param int    $argSearch         Argumento de busqueda
     * @param string $argFiltersSql     Filtros sql
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad
     */
    public function getArbolEspecialidad($argIdEspecialidad = 0, $argSearch = 0, $argFiltersSql = '', $onlyContableCode = false)
    {
        if ($argSearch == 0) {
            $result = NomEspecialidad::cargarEspecialidades($argIdEspecialidad, $onlyContableCode);
        } else {
            $result = EspecialidadModel::obtenerArbol($argFiltersSql, $argSearch, $onlyContableCode);
        }
        $arrayEspecialidades = (count($result) > 0) ? $result : array();
        return $arrayEspecialidades;
    }

    /**
     * Obtiene todos los hijos de un nodo dado su identificador
     *
     * @param int $idEspecialidad
     *
     * @author Ing. Lisvany Alonso Martinez
     *
     * @return bool|null|string
     */
    public function getTodosHijosEspecialidad($idEspecialidad)
    {
        if ($idEspecialidad) {
            return EspecialidadModel::getTodosHijosEspecialidad($idEspecialidad);
        } else {
            return null;
        }

    }

}
