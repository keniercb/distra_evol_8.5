<?php
/**
 * Patron Factory para acceder a los datos desde distintas interfaces
 * @author    Alien Fernandez Fuentes
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Común/Models/Bussines
 * @version    1.0
 */
class FactoryDataSearch
{
    //  Drivers de búsqueda
    const _DEFAULT_DOCTRINE_DRIVER_ = 'DoctrineDataSearch';
    const _DEFAULT_NOMENCLADORES_DRIVER_ = 'NomencladorDataSearch';

    //  Datos del \xE1rbol
    const _DEFAULT_IDPARENT_TREE_ = 'idpadre';
    const _DEFAULT_CODE_TREE_ = 'codigo';
    const _DEFAULT_DESCRIPTION_TREE_ = 'denominacion';
    const _DEFAULT_LEVEL_TREE_ = 'nivel';
    const _DEFAULT_LEFT_ORDER_TREE_ = 'ordenizq';
    const _DEFAULT_RIGHT_ORDER_TREE_ = 'ordender';

    /**
     * Función para obtener el driver a utilizar en la búsqueda
     *
     * @param string $driver - Nombre del driver a utilizar
     *
     * @return array
     */
    public static function getDriver($driver)
    {

        //  Comprobamos que la clase que solicitamos exista
        if (class_exists($driver)) {

            //  Devolvemos una instancia de la clase
            return new $driver();
        } else {
            echo "<br />Error al cargar la clase '" . $driver . "'";
        }

        return 0;
    }

    /**
     * Función para obtener el filtro de la búsqueda
     *
     * @param array $_config -  array de datos a filtrar
     *
     * @return array
     */
    public static function getFilterByConfig($_config)
    {
        $filter = '';
        $arrFilter = array();
        if (array_key_exists('formatLength', $_config)) {
            $arrFilter[] = "{$_config['level']} <> {$_config['formatLength']}";
        }
        if ($_config['idespecialidad']) {
            if (array_key_exists('idespecialidad', $_config)) {
                $arrFilter[] = "idespecialidad = {$_config['idespecialidad']}";
            }
        }
        if (array_key_exists('filters', $_config)) {
            $filter .= implode(' AND ', $_config['filter']);
        }
        $filter .= implode(' AND ', $arrFilter);

        return $filter;
    }
}
