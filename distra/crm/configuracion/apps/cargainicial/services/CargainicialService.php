<?php

/**
 * Servicios asociados a Carga inicial
 *
 * @copyright  XETID
 * @package    Servicios
 * @subpackage Configuración/CargaInicial
 * @version    1.0
 */
class CargainicialService extends ZendExt_Model
{

    /* Constructor de la clase */
    public function __construct()
    {

    }


    /**
     * Cambia la configuración de ConfEntidades
     */
    public function EscribirFinalizar()
    {
        try {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;
            $x = ConfEntidades::BuscarEntConf($idestructura);
            $confentidad = new ConfEntidades();
            if ($x) {
                $confentidad = Doctrine::getTable("ConfEntidades")->find($x);
                $confentidad->idconfiguracion = $x;
            }
            $confentidad->configurado = '1';
            $confentidad->idestructuracomun = $idestructura;
            $confentidad->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Verifica la existencia de entidades configuradas
     * @param int $idestructura Identificador de estructura
     * @return bool
     */
    public function entidadConfigurada($idestructura)
    {
        $bool = ConfEntidades::entidadConfigurada($idestructura);
        return $bool;
    }

    /**
     * Actualiza la entidad importación
     *
     * @param int $idestructura Identificador de estructura
     * @param int $valor Valor
     */
    public function actualizarEntidadImportacion($idestructura, $valor)
    {
        ConfEntidades::actualizarEntidadImportacion($idestructura, $valor);
    }

    /**
     * Limpia la entidad configurada
     * @return bool
     */
    public function limpiarEntidadConfigurada()
    {
        $bool = ConfEntidades::limpiarEntidadConfigurada();
        return $bool;
    }

    /**
     * Verifica la existencia de entidades configuradas
     *
     * @param int $param
     *
     * @return bool ConfEntidad
     */
    public function existenEntidadesConfiguradas($param)
    {
        $bool = ConfEntidades::existenEntidadesConfiguradas($param);
        return $bool;
    }

}
