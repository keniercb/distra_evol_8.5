<?php
/**
 * @name ConceptosalarialService - Clase de servicios para la configuracion de de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConceptosalarialService extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerConfConceptoSalarial - Servicio que obtiene los conceptos salariales configurados.
     * @return Array - Arreglo de identificadores de conceptos salariales configurados.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerConfConceptoSalarial()
    {
        $datos = ConfConceptosNominaModel::getSelected();
        $arr_res = Array();
        foreach ($datos as $k => $v) {
            array_push($arr_res, $v['idconcepto']);
        }
        return  $arr_res;
    }
}