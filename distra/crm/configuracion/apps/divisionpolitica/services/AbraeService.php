<?php

/**
 * Servicios asociados a las zonas especiales(Abraes)
 *
 * @copyright  XETID
 * @package    Servicios
 * @subpackage Configuración/DivisiónPolítica
 * @version    1.0
 * @author     Leyner Patterson Tamayo
 */
class AbraeService extends ZendExt_Model
{

    /**
     * Función que me permite insertar una zona de seguridad como un Abrae
     * devuelve el id del Abrae insertado
     *
     * @param mixed $denominacion - Denominacion de la zona de seguridad insertada.
     *
     * @return code Código de respuesta
     */
    function insertarZonaAsAbrae($denominacion)
    {
        $model = new NomZonaespecialModel();
        return $model->InsertarZonaSeguridad($denominacion);
    }

    /**
     * Funcion que me permite modificar una zona de seguridad como un Abrae
     * devuelve el id del Abrae modificado
     *
     * @param mixed $denominacion - Denominacion de la zona de seguridad actualizada.
     * @param int   $idabrae      - Identificador del Abrae.
     *
     * @return code Código de respuesta
     */
    function actualizarZonaAsAbrae($idabrae, $denominacion)
    {
        $model = new NomZonaespecialModel();
        return $model->ActualizarZonaSeguridad($idabrae, $denominacion);
    }

    /**
     * Funcion que me permite eliminar una zona de seguridad como un Abrae
     * devuelve true
     *
     * @param int $idabrae - Identificador del Abrae.
     *
     * @return bool
     */
    function eliminarZonaAsAbrae($idabrae)
    {
        $model = new NomZonaespecialModel();
        return $model->EliminarZonaSeguridad($idabrae);
    }

    /**
     * Obtiene Abraes desde arreglo
     *
     * @param int  $_idabrae - Identificador del Abrae.
     * @param bool $checked
     *
     * @return bool
     */
    public function obtenerAbraesDesdeArreglo($_idabrae, $checked = false)
    {
        $_abraes = NomAbrae::BuscarDesdeArreglo($_idabrae, $checked);
        return $_abraes;
    }

    /**
     * Obtiene los hijos de Abraes
     *
     * @param int $_idabrae - Identificador del Abrae.
     *
     * @return bool
     */
    public function obtenerHijosAbrae($_idabrae)
    {
        //$node = is_numeric($_idabrae) ? $_idabrae : 'nodoZonaespecial';
        $_abraes = NomAbrae::getHijos($_idabrae);
        return $_abraes;
    }

    /**
     * Devuelve en un arreglo los paises dado un arreglo de valores con id paises
     *
     * @param array $arrayids
     * @param mixed $node
     * @param bool  $checked
     *
     * @return array
     * @author Dionisdel Ponce Santana.
     */
    public function obtenerAbraeParaInfEst($arrayids, $node, $checked = false)
    {

        $_abraes = $this->obtenerAbraesDesdeArreglo($arrayids, $checked);

        $strpadres = '';
        foreach ($_abraes as $k => $_abrae) {
            if ($k) {
                $strpadres .= ' OR ';
            }
            $strpadres .= ' (n.rgt >= ' . $_abrae ['rgt'] . ' AND  n.lft <= ' . $_abrae ['lft'] . ') ';
        }

        $_result = NomAbrae::obtenerAbraeDadoArregloHijos($strpadres, $node, $checked);

        return $_result;
    }

}
