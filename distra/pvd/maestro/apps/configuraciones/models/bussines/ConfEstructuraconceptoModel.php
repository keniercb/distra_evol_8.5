<?php
/**
 * @name ConfEstructuraconceptoModel - Clase de logica de negocio para la configuracion de de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfEstructuraconceptoModel extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerEstructura - Devuelve la estructura organizativa.
     * @params $idestructura - Identificador de la estructura organizativa.
     * @return array - Arreglo con las estructuras.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerEstructura($idestructura, $idestructglobal)
    {
        try {
            //Verificando si se esta cargando desde la raiz del arbol
            if ($idestructura == -1) {
                //Obteniendo la estructura inmediata.
                $result = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructglobal);
            } else {
                //Obteniendo la estructura inmediata.
                $result = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);
            }
            return $result;
        } catch (Exception $e) {
            return Array();
        }
    }

    /**
     * @method obtenerConfEstructuraconcepto - Devuelve todas las configuraciones de estructuras por conceptos.
     * @return array - Arreglo de configuraciones
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerConfEstructuraconcepto()
    {
        //Obteniendo las configuraciones
        $result = ConfEstructuraconcepto::obtenerConfEstructuraConcepto();
        //Verificando la existencia de datos en el resultado
        if (!$result) {
            $result = Array();
        } else {
            //Se recorre el resultado para incorporar los datos de la estructura configurada
            foreach ($result as $k=>$v) {
                //Obteniendo los datos de la estructura configurada
                $estructura =  ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['idestructura']);
                $result[$k]['estructura'] =  $estructura[0]->denominacion;
            }
        }
        return $result;
    }
    public function modConfEstructuraconcepto($idestructconcepto, $idestructura)
    {
        try {
            $cfg = ConfEstructuraconcepto::obtenerPorId($idestructconcepto);
            $cfg->idestructura = $idestructura;
            $cfg->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @method obtenerEstructuraConcepto - Devuelve el identificador de la estructura organizativa.
     * @params $idestructconcepto - Identificador de la configuracion.
     * @return Number - Identificador de la estructura organizativa configurada para el concepto.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerEstructuraConcepto($idestructconcepto)
    {
        try {
            $estructura = ConfEstructuraconcepto::obtenerPorId($idestructconcepto);
            return $estructura->idestructura;
        } catch (Exception $e) {
            return false;
        }
    }
}